/**
 * Per-app Cloudflare intake shape: cookie/header names, dummy pipe fields,
 * extra body keys, and response JSON aliases.
 * The client side lives in a Kotlin NativeModule so the shape is in the DEX.
 * services/{fragment}CfProtocol.ts only forwards to that module.
 * The worker keeps the same CF_PROTOCOL block.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { rngFor, identFromRng, randomSeedString } = require("./rng");
const { detectFragmentFromConstants } = require("./applyMeta");
const { findUtilService, findOfferResolve } = require("./findService");

const REQUIRED = [
  "appId",
  "deviceID",
  "adId",
  "pushToken",
  "referer",
  "oneLink",
  "naming",
  "userAgent",
  "app_version",
  "androidId",
];

const BODY_KEYS = [
  "event",
  "device_model",
  "manufacturer",
  "locale",
  "timezone",
  "network",
  "screen",
  "session_id",
  "play_integrity_token",
];

function headerName(rng) {
  const n = identFromRng(rng, 2, 4);
  return `X-${n.charAt(0).toUpperCase()}${n.slice(1)}`;
}

function shuffle(list, rng) {
  const next = list.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
  }
  return next;
}

function withPads(fields, rng, minPads, maxPads) {
  const layout = shuffle(fields, rng);
  const pads = minPads + Math.floor(rng() * Math.max(1, maxPads - minPads + 1));
  for (let i = 0; i < pads; i++) {
    layout.splice(Math.floor(rng() * (layout.length + 1)), 0, "pad");
  }
  return layout;
}

function pickChannel(rng, cookieW, headerW) {
  const roll = rng();
  if (roll < cookieW) return "cookie";
  if (roll < cookieW + headerW) return "header";
  return "body";
}

function assignFieldRoutes(rng) {
  const routes = {};
  const counts = { cookie: 0, header: 0, body: 0 };
  for (const field of REQUIRED) {
    routes[field] = pickChannel(rng, 0.42, 0.28);
    counts[routes[field]] += 1;
  }
  for (const field of BODY_KEYS) {
    routes[field] = field === "play_integrity_token" ? "body" : pickChannel(rng, 0.22, 0.28);
    counts[routes[field]] += 1;
  }
  const steal = (to, min) => {
    while (counts[to] < min) {
      const from = ["cookie", "header", "body"]
        .filter((channel) => channel !== to && counts[channel] > 1)
        .sort((a, b) => counts[b] - counts[a])[0];
      if (!from) break;
      const field = Object.keys(routes).find(
        (name) => routes[name] === from && name !== "play_integrity_token"
      );
      if (!field) break;
      routes[field] = to;
      counts[from] -= 1;
      counts[to] += 1;
    }
  };
  steal("cookie", 2);
  steal("header", 1);
  steal("body", 3);
  return routes;
}

function fieldsFor(routes, channel) {
  return Object.keys(routes).filter((name) => routes[name] === channel);
}

function buildProtocol(fragment) {
  const rng = rngFor(`cfproto:${fragment}:${randomSeedString(12)}`);
  const transports = ["fetch", "xhr", "axios"];
  const transport = transports[Math.floor(rng() * transports.length)];
  const fieldRoutes = assignFieldRoutes(rng);
  const extraCount = 2 + Math.floor(rng() * 9);
  const share = [rng(), rng(), rng(), rng()];
  const shareSum = share.reduce((acc, value) => acc + value, 0) || 1;
  const parts = share.map((value) => Math.round((value / shareSum) * extraCount));
  let drift = extraCount - parts.reduce((acc, value) => acc + value, 0);
  parts[2] += drift;
  if (parts[2] < 0) {
    parts[0] += parts[2];
    parts[2] = 0;
  }
  const dummyBodyKeys = [];
  for (let i = 0; i < Math.max(2, parts[2]); i++) dummyBodyKeys.push(identFromRng(rng, 4, 7));
  const extraQuery = {};
  for (let i = 0; i < parts[3]; i++) {
    extraQuery[identFromRng(rng, 2, 4)] = identFromRng(rng, 3, 6);
  }
  const extraPads = {};
  const padKeys = 1 + Math.floor(rng() * 3);
  for (let i = 0; i < padKeys; i++) extraPads[identFromRng(rng, 2, 4)] = identFromRng(rng, 4, 8);

  return {
    transport,
    path: `/${identFromRng(rng, 2, 5)}`,
    cookieName: identFromRng(rng, 3, 6),
    headerName: headerName(rng),
    fieldRoutes,
    cookieLayout: withPads(fieldsFor(fieldRoutes, "cookie"), rng, Math.max(1, parts[0]), Math.max(1, parts[0])),
    headerLayout: withPads(fieldsFor(fieldRoutes, "header"), rng, parts[1], parts[1]),
    dummyBodyKeys,
    extraQuery,
    responseKeys: {
      redirectUrl: identFromRng(rng, 2, 4),
      redirectUrlInitial: identFromRng(rng, 2, 4),
      error: identFromRng(rng, 2, 3),
      blockUser: identFromRng(rng, 2, 3),
    },
    extraResponsePads: extraPads,
  };
}

function renderTs(frag, className) {
  return `import { NativeModules } from 'react-native';

const intake = NativeModules.${className};

export async function ${frag}AssembleIntake(
  fields: string[],
  bodyPlain: string,
): Promise<string> {
  return intake.assembleIntake(fields, bodyPlain);
}

export async function ${frag}MapInitResponse(obj: Record<string, unknown>): Promise<{
  redirectUrl: string | null;
  redirectUrlInitial: string | null;
  error: string | null;
  blockUser: boolean;
}> {
  return intake.mapInitResponse(JSON.stringify(obj ?? {}));
}

export async function ${frag}SendCf(
  baseUrl: string,
  requestPayload: { cookieHeader: string; dataValue: string; headerValue?: string; body: string },
  _signal?: AbortSignal,
): Promise<{ ok: boolean; text: () => Promise<string> }> {
  const text = String(
    (await intake.postIntake(
      baseUrl,
      requestPayload.dataValue,
      requestPayload.headerValue || '',
      requestPayload.body,
    )) ?? '',
  );
  return { ok: Boolean(text), text: async () => text };
}
`;
}

function protocolJsBlock(proto) {
  return `/* cf-protocol-begin */
const CF_PROTOCOL = ${JSON.stringify(proto, null, 2)};
/* cf-protocol-end */
`;
}

function replaceMarked(content, begin, end, inner) {
  const re = new RegExp(
    `${begin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  if (re.test(content)) {
    return content.replace(re, `${begin}\n${inner.trim()}\n${end}`);
  }
  return null;
}

async function patchWorkerProtocol(rootPath, proto) {
  const indexPath = path.join(rootPath, "cloudflare-worker", "index.js");
  let src = await fs.readFile(indexPath, "utf8");
  const block = protocolJsBlock(proto);
  const marked = replaceMarked(src, "/* cf-protocol-begin */", "/* cf-protocol-end */", JSON.stringify(proto, null, 2).replace(/^/, "const CF_PROTOCOL = ").replace(/$/, ";"));
  if (marked != null) {
    src = marked;
  } else {
    const needle = "const REQUIRED_FIELDS = [";
    const idx = src.indexOf(needle);
    if (idx < 0) throw new Error("REQUIRED_FIELDS not found in worker");
    src = `${src.slice(0, idx)}${block}\n${src.slice(idx)}`;
  }

  const channelsBlock = `/* cf-channels-begin */
function parseLayoutPipe(decrypted, layout) {
  const parts = String(decrypted || "").split("|");
  const out = {};
  let pi = 0;
  const slots = layout || [];
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot === "pad") {
      pi++;
      continue;
    }
    out[slot] = clean(parts[pi++] || "", 4096);
  }
  return out;
}

function readEncryptedPipe(raw, layout, label) {
  if (!layout || !layout.some((slot) => slot && slot !== "pad")) return {};
  const decrypted = decryptStrict(raw, label);
  if (!decrypted) return {};
  return parseLayoutPipe(decrypted, layout);
}

function readChannelFields(request) {
  const cookieRaw = getCookie(request, CF_PROTOCOL.cookieName);
  const headerRaw = request.headers.get(CF_PROTOCOL.headerName) || "";
  const cookie = readEncryptedPipe(cookieRaw, CF_PROTOCOL.cookieLayout, "cookie.pipe");
  const header = readEncryptedPipe(headerRaw, CF_PROTOCOL.headerLayout, "header.pipe");
  if (cookie.naming) cookie.naming = parseMaybeJson(cookie.naming);
  if (header.naming) header.naming = parseMaybeJson(header.naming);
  return { cookie, header };
}

function takeField(cookie, header, body, key) {
  const value = cookie[key] ?? header[key] ?? body[key] ?? "";
  return value;
}
/* cf-channels-end */
`;
  const channelsInner = channelsBlock
    .replace("/* cf-channels-begin */\n", "")
    .replace("\n/* cf-channels-end */\n", "")
    .replace("/* cf-channels-end */", "");
  const markedChannels = replaceMarked(src, "/* cf-channels-begin */", "/* cf-channels-end */", channelsInner);
  if (markedChannels != null) src = markedChannels;
  else if (!src.includes("function takeField(")) {
    const insertAt = src.indexOf("export default {");
    src = insertAt >= 0 ? `${src.slice(0, insertAt)}${channelsBlock}\n${src.slice(insertAt)}` : `${src}\n${channelsBlock}`;
  }

  src = src.replace(
    /function isUnusedIntakeField\(key\) \{\s*return key === "play_integrity_token";\s*\}/,
    `function isUnusedIntakeField(key) {
  if (key === "play_integrity_token") return true;
  const dummies = (CF_PROTOCOL && CF_PROTOCOL.dummyBodyKeys) || [];
  return dummies.indexOf(key) >= 0;
}`
  );

  src = src.replace(
    /const cookieResult = readEncryptedCookiePayload\(request\);\s*if \(!cookieResult\.ok\) \{\s*console\.log\("\[COOKIE_DECRYPT_FAILED_RETURN_EMPTY\]"\);\s*return emptyResponse\("cookie_decrypt_failed"\);\s*\}\s*const cookiePayload = cookieResult\.payload;\s*const body = await readFormBody\(request\);\s*const payload = \{[\s\S]*?ip\s*\};/,
    `const channels = readChannelFields(request);
      const cookiePayload = channels.cookie || {};
      const headerPayload = channels.header || {};
      const body = await readFormBody(request);
      if (body.naming) body.naming = parseMaybeJson(body.naming);

      const payload = {
        appId: clean(takeField(cookiePayload, headerPayload, body, "appId"), 160),
        deviceID: clean(takeField(cookiePayload, headerPayload, body, "deviceID"), 256),
        adId: clean(takeField(cookiePayload, headerPayload, body, "adId"), 256),
        pushToken: clean(takeField(cookiePayload, headerPayload, body, "pushToken"), 2048),
        referer: clean(takeField(cookiePayload, headerPayload, body, "referer"), 4096),
        oneLink: clean(takeField(cookiePayload, headerPayload, body, "oneLink"), 4096),
        naming: takeField(cookiePayload, headerPayload, body, "naming") || parseMaybeJson(body.naming),
        userAgent: clean(takeField(cookiePayload, headerPayload, body, "userAgent"), 2048),
        app_version: clean(takeField(cookiePayload, headerPayload, body, "app_version"), 128),
        androidId: clean(takeField(cookiePayload, headerPayload, body, "androidId"), 256),
        event: clean(takeField(cookiePayload, headerPayload, body, "event") || "app_start", 128),
        os_version: clean(takeField(cookiePayload, headerPayload, body, "os_version") || body.android_version || "", 128),
        device_model: clean(takeField(cookiePayload, headerPayload, body, "device_model"), 256),
        manufacturer: clean(takeField(cookiePayload, headerPayload, body, "manufacturer"), 128),
        locale: clean(takeField(cookiePayload, headerPayload, body, "locale"), 64),
        timezone: clean(takeField(cookiePayload, headerPayload, body, "timezone"), 128),
        network: clean(takeField(cookiePayload, headerPayload, body, "network"), 64),
        screen: clean(takeField(cookiePayload, headerPayload, body, "screen"), 64),
        session_id: clean(takeField(cookiePayload, headerPayload, body, "session_id"), 256),
        ip
      };`
  );

  await fs.writeFile(indexPath, src, "utf8");
}

function ensureImport(content, importLine) {
  if (content.includes(importLine)) return content;
  const matches = [...content.matchAll(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm)];
  const lastImport = matches[matches.length - 1];
  if (!lastImport) return `${importLine}\n${content}`;
  const at = lastImport.index + lastImport[0].length;
  return `${content.slice(0, at)}\n${importLine}${content.slice(at)}`;
}

async function patchAppCallSites(rootPath, frag) {
  const assembleName = `${frag}AssembleIntake`;
  const mapName = `${frag}MapInitResponse`;
  const sendName = `${frag}SendCf`;
  const protoFile = `${frag}CfProtocol`;
  const importLine = `import { ${assembleName}, ${mapName} } from './${protoFile}';`;

  const offerPath = await findOfferResolve(rootPath);
  const utilPath = await findUtilService(rootPath);

  const notes = [];

  if (offerPath) {
    let src = await fs.readFile(offerPath, "utf8");
    src = src.replace(
      /import \{ [^}]*PackCookie[^}]*\} from '\.\/[^']+CfProtocol';/,
      importLine
    );
    src = ensureImport(src, importLine);
    src = src.replace(
      /const cookieRaw = await \w+PackCookie\(/,
      `const ${frag}CookieFields = (`
    );
    src = src.replace(
      /const cookieRaw = \[[\s\S]*?\]\.join\('\|'\);/,
      (block) =>
        block
          .replace("const cookieRaw = [", `const ${frag}CookieFields = [`)
          .replace("].join('|');", "];")
    );
    src = src.replace(
      /const encryptedCookie = cryptoEncrypt\(cookieRaw\);\s*const dataValue = encodeURIComponent\(encryptedCookie\);\s*const cookieHeader = `[^`]+`;/,
      ""
    );
    if (!src.includes(`${assembleName}(`)) {
      const assembled = src.replace(
        /const encryptedBody = encodeURIComponent\(cryptoEncrypt\((?:await )?\w+DecorateBody\(bodyPlain\)\)\);/,
        `const packed = JSON.parse(await ${assembleName}(${frag}CookieFields, bodyPlain)) as { cookie?: string; header?: string; body?: string };
    const encryptedCookie = cryptoEncrypt(packed.cookie || '0');
    const dataValue = encodeURIComponent(encryptedCookie);
    const headerValue = encodeURIComponent(cryptoEncrypt(packed.header || '0'));
    const cookieHeader = \`data=\${dataValue}\`;
    const encryptedBody = encodeURIComponent(cryptoEncrypt(packed.body || ''));`
      );
      if (assembled === src) {
        throw new Error("OfferResolve: не удалось вставить AssembleIntake");
      }
      src = assembled;
    }
    src = src.replace(
      /ichyikowrdfpagthmsSendInitPayload\(workerBaseUrl, \{\s*cookieHeader,\s*dataValue,\s*body: encryptedBody,/,
      (full) => full.replace("dataValue,", "dataValue,\n        headerValue,")
    );
    src = src.replace(
      /(\w+SendInitPayload\(workerBaseUrl, \{\s*cookieHeader,\s*dataValue,)(\s*body: encryptedBody)/,
      `$1\n        headerValue,$2`
    );
    src = src.replace(
      /const obj = JSON\.parse\(decrytedResponse\);\s*redirectUrl = obj\.redirectUrl \|\| null;\s*redirectUrlInitial = obj\.redirectUrlInitial \|\| null;\s*errorField = obj\.error \|\| null;\s*blockUser = !!obj\.blockUser;/,
      `const obj = ${mapName}(JSON.parse(decrytedResponse) as Record<string, unknown>);
      redirectUrl = obj.redirectUrl;
      redirectUrlInitial = obj.redirectUrlInitial;
      errorField = obj.error;
      blockUser = !!obj.blockUser;`
    );
    await fs.writeFile(offerPath, src, "utf8");
    notes.push(path.basename(offerPath));
  }

  if (utilPath) {
    let src = await fs.readFile(utilPath, "utf8");
    const utilImport = `import { ${sendName} } from './${protoFile}';`;
    src = ensureImport(src, utilImport);
    src = src.replace(
      /const response = await fetch\(url, \{[\s\S]*?signal: controller\.signal,\s*\}\);/,
      `const response = await ${sendName}(url, requestPayload, controller.signal);`
    );
    if (!src.includes("headerValue?: string")) {
      src = src.replace(
        /(\s+dataValue: string;\s+)/,
        `$1headerValue?: string;\n`
      );
    }
    await fs.writeFile(utilPath, src, "utf8");
    notes.push(path.basename(utilPath));
  }

  return notes;
}

function kotlinQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\$/g, "\\$")}"`;
}

function renderIntakeKotlin(pkg, className, proto) {
  const layout = proto.cookieLayout.map((item) => kotlinQuote(item)).join(", ");
  const headerLayout = (proto.headerLayout || []).map((item) => kotlinQuote(item)).join(", ");
  const dummies = proto.dummyBodyKeys.map((item) => kotlinQuote(item)).join(", ");
  const query = Object.entries(proto.extraQuery)
    .map(([key, value]) => `${kotlinQuote(key)} to ${kotlinQuote(value)}`)
    .join(", ");
  const routes = Object.entries(proto.fieldRoutes || {})
    .map(([key, value]) => `${kotlinQuote(key)} to ${kotlinQuote(value)}`)
    .join(", ");
  const required = REQUIRED.map((item) => kotlinQuote(item)).join(", ");
  const keys = proto.responseKeys;
  return `/* cf-intake:v1 */
package ${pkg}

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "${className}"

    @ReactMethod
    fun assembleIntake(fields: ReadableArray, bodyPlain: String, promise: Promise) {
        try {
            promise.resolve(assemble(fields, bodyPlain))
        } catch (e: Exception) {
            promise.resolve("{\\"cookie\\":\\"0\\",\\"header\\":\\"0\\",\\"body\\":\\"\\"}")
        }
    }

    @ReactMethod
    fun mapInitResponse(json: String, promise: Promise) {
        try {
            promise.resolve(mapResponse(JSONObject(if (json.isEmpty()) "{}" else json)))
        } catch (e: Exception) {
            val empty = Arguments.createMap()
            empty.putNull("redirectUrl")
            empty.putNull("redirectUrlInitial")
            empty.putNull("error")
            empty.putBoolean("blockUser", false)
            promise.resolve(empty)
        }
    }

    @ReactMethod
    fun postIntake(baseUrl: String, dataValue: String, headerValue: String, body: String, promise: Promise) {
        Thread {
            try {
                val connection = (URL(workerUrl(baseUrl)).openConnection() as HttpURLConnection)
                connection.requestMethod = "POST"
                connection.connectTimeout = 25000
                connection.readTimeout = 25000
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                if (dataValue.isNotEmpty()) {
                    connection.setRequestProperty("Cookie", ${kotlinQuote(proto.cookieName)} + "=" + dataValue)
                }
                if (headerValue.isNotEmpty()) {
                    connection.setRequestProperty(${kotlinQuote(proto.headerName)}, headerValue)
                }
                connection.setRequestProperty("Accept", "text/plain, */*")
                connection.outputStream.use { stream ->
                    stream.write(body.toByteArray(Charsets.UTF_8))
                }
                val code = connection.responseCode
                val stream = if (code in 200..299) connection.inputStream else connection.errorStream
                val text = stream?.bufferedReader()?.use { it.readText() } ?: ""
                promise.resolve(text)
            } catch (e: Exception) {
                promise.resolve("")
            }
        }.start()
    }

    private val requiredFields = arrayOf(${required})
    private val cookieLayout = arrayOf(${layout})
    private val headerLayout = arrayOf(${headerLayout || ""})
    private val dummyBodyKeys = arrayOf(${dummies})
    private val extraQuery = linkedMapOf(${query})
    private val fieldRoutes = linkedMapOf(${routes})

    private fun assemble(fields: ReadableArray, bodyPlain: String): String {
        val values = LinkedHashMap<String, String>()
        for (pair in parseForm(bodyPlain)) {
            values[pair.first] = pair.second
        }
        for (index in requiredFields.indices) {
            val key = requiredFields[index]
            val field = if (index < fields.size()) fields.getString(index) ?: "" else ""
            if (field.isNotEmpty() || !values.containsKey(key)) values[key] = field
        }
        val cookie = packPipe(cookieLayout, values)
        val header = packPipe(headerLayout, values)
        val bodyParts = ArrayList<String>()
        for ((key, value) in values) {
            if (dummyBodyKeys.contains(key)) continue
            val route = fieldRoutes[key]
            if (route != null && route != "body") continue
            bodyParts.add(enc(key) + "=" + enc(value))
        }
        dummyBodyKeys.forEachIndexed { index, key ->
            bodyParts.add(enc(key) + "=" + enc((index + bodyPlain.length).toString()))
        }
        val json = JSONObject()
        json.put("cookie", cookie)
        json.put("header", header)
        json.put("body", bodyParts.joinToString("&"))
        return json.toString()
    }

    private fun packPipe(layout: Array<String>, values: Map<String, String>): String {
        if (layout.isEmpty()) return ""
        val out = ArrayList<String>(layout.size)
        var pad = 0
        for (slot in layout) {
            if (slot == "pad") {
                out.add("p" + pad.toString(16) + values.size)
                pad += 1
            } else {
                out.add(values[slot] ?: "")
            }
        }
        return out.joinToString("|")
    }

    private fun parseForm(plain: String): List<Pair<String, String>> {
        if (plain.isEmpty()) return emptyList()
        return plain.split("&").mapNotNull { part ->
            if (part.isEmpty()) return@mapNotNull null
            val at = part.indexOf("=")
            if (at < 0) Pair(part, "") else Pair(part.substring(0, at), part.substring(at + 1))
        }
    }

    private fun enc(value: String): String = URLEncoder.encode(value, "UTF-8")

    private fun workerUrl(base: String): String {
        val root = base.trimEnd('/')
        val params = extraQuery.entries.joinToString("&") { (key, value) ->
            URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
        }
        return root + ${kotlinQuote(proto.path)} + if (params.isEmpty()) "" else "?" + params
    }

    private fun mapResponse(obj: JSONObject): com.facebook.react.bridge.WritableMap {
        val map = Arguments.createMap()
        writeNullable(map, "redirectUrl", pick(obj, ${kotlinQuote(keys.redirectUrl)}, "redirectUrl"))
        writeNullable(map, "redirectUrlInitial", pick(obj, ${kotlinQuote(keys.redirectUrlInitial)}, "redirectUrlInitial"))
        writeNullable(map, "error", pick(obj, ${kotlinQuote(keys.error)}, "error"))
        map.putBoolean("blockUser", asBool(pickRaw(obj, ${kotlinQuote(keys.blockUser)}, "blockUser")))
        return map
    }

    private fun writeNullable(map: com.facebook.react.bridge.WritableMap, key: String, value: String?) {
        if (value == null) map.putNull(key) else map.putString(key, value)
    }

    private fun pick(obj: JSONObject, alias: String, fallback: String): String? {
        val raw = pickRaw(obj, alias, fallback) ?: return null
        val text = raw.toString()
        return if (text.isEmpty()) null else text
    }

    private fun pickRaw(obj: JSONObject, alias: String, fallback: String): Any? {
        if (obj.has(alias) && !obj.isNull(alias)) return obj.opt(alias)
        if (obj.has(fallback) && !obj.isNull(fallback)) return obj.opt(fallback)
        return null
    }

    private fun asBool(value: Any?): Boolean = when (value) {
        null -> false
        is Boolean -> value
        is Number -> value.toDouble() != 0.0
        is String -> value.isNotEmpty() && value != "0" && !value.equals("false", true)
        else -> true
    }
}
`;
}

async function walkKt(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "build") continue;
      await walkKt(full, out);
    } else if (entry.name.endsWith(".kt")) out.push(full);
  }
  return out;
}

async function findRegistry(javaRoot) {
  const files = await walkKt(javaRoot);
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("fun createNativeModules")) continue;
    if (src.includes("autosetup-decoy")) continue;
    const pkg = (src.match(/^package\s+([A-Za-z0-9_.]+)/m) || [])[1];
    if (pkg) return { file, src, pkg };
  }
  return null;
}

function stripRegistryEntries(src, names) {
  let next = src;
  for (const name of names) {
    next = next.replace(new RegExp(`^[ \\t]*${name}\\(reactContext\\),?[ \\t]*\\r?\\n`, "gm"), "");
  }
  return next;
}

function registerIntake(src, className) {
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  let next = stripRegistryEntries(src, [className]);
  if (next.includes(`${className}(reactContext)`)) return next;
  const funAt = next.search(/fun createNativeModules\s*\(/);
  if (funAt < 0) throw new Error("ModuleRegistry.createNativeModules not found");
  const listAt = next.indexOf("listOf(", funAt);
  if (listAt < 0) throw new Error("ModuleRegistry listOf( not found");
  const paren = next.indexOf("(", listAt);
  let depth = 0;
  let close = -1;
  for (let i = paren; i < next.length; i++) {
    if (next[i] === "(") depth += 1;
    else if (next[i] === ")") {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close < 0) throw new Error("ModuleRegistry listOf( not closed");
  const before = next.slice(0, close).replace(/\s*$/, "");
  const needsComma = !before.endsWith(",") && !before.endsWith("(");
  return `${before}${needsComma ? "," : ""}${nl}            ${className}(reactContext),${nl}        ${next.slice(close)}`;
}

async function writeIntakeModule(rootPath, frag, proto) {
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const registry = await findRegistry(javaRoot);
  if (!registry) throw new Error("ModuleRegistry.createNativeModules not found");
  const className = `C${frag}Intake`;
  const removed = [];
  for (const file of await walkKt(javaRoot)) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("cf-intake:v1")) continue;
    const previous = (src.match(/\bclass\s+([A-Za-z0-9_]+)/) || [])[1];
    if (previous) removed.push(previous);
    await fs.unlink(file);
  }
  const modulePath = path.join(path.dirname(registry.file), `${className}.kt`);
  await fs.writeFile(modulePath, renderIntakeKotlin(registry.pkg, className, proto), "utf8");
  let registrySrc = stripRegistryEntries(await fs.readFile(registry.file, "utf8"), removed);
  registrySrc = registerIntake(registrySrc, className);
  await fs.writeFile(registry.file, registrySrc, "utf8");
  return className;
}

async function stampCfProtocol(rootPath, { fragment } = {}) {
  const frag = String(fragment || (await detectFragmentFromConstants(rootPath)) || "").trim();
  if (!frag) return { ok: false, details: "fragment не найден" };

  const proto = buildProtocol(frag);
  const className = await writeIntakeModule(rootPath, frag, proto);
  const tsPath = path.join(rootPath, "services", `${frag}CfProtocol.ts`);
  await fs.writeFile(tsPath, renderTs(frag, className), "utf8");
  await patchWorkerProtocol(rootPath, proto);
  const patched = await patchAppCallSites(rootPath, frag);

  return {
    ok: true,
    details: `cf intake ${className} ${proto.path} cookie=${proto.cookieName} header=${proto.headerName} routes c=${fieldsFor(proto.fieldRoutes, "cookie").length}/h=${fieldsFor(proto.fieldRoutes, "header").length}/b=${fieldsFor(proto.fieldRoutes, "body").length} dummies=${proto.dummyBodyKeys.length} pads=${proto.cookieLayout.filter((s) => s === "pad").length}+${(proto.headerLayout || []).filter((s) => s === "pad").length}; ${patched.join(", ")}`,
    protocol: proto,
  };
}

module.exports = { stampCfProtocol, buildProtocol, renderIntakeKotlin };
