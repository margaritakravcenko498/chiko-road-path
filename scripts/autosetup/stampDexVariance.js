/**
 * Per-app DEX variance. The metric is the opcode sequence of a method
 * (dexdump), ignoring names and immediates. Same command order with
 * different constants is the same method. The R8 dictionary only changes
 * short names.
 *
 * Seed: FNV-1a of the key, then mix32.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { stampNetStack } = require("./stampNetStack");

const JAVA_KEYWORDS = new Set(
  `abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null`.split(
    " "
  )
);

const SNIPPET_KINDS = [
  "xor",
  "add",
  "shl",
  "ushr",
  "mul",
  "and",
  "if",
  "when",
  "while",
  "chars",
  "ints",
  "rem",
  "inv",
  "or",
];

const LANE_COUNT = 96;
const DEX_LANES_MARKER = "dex-lanes:v1";
const NEVERINLINE_MARKER = "dex-lanes-neverinline";

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mix32(n) {
  let x = n >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(key) {
  return mulberry32(mix32(hashSeed(key)));
}

function lit(rng, min, span) {
  return min + Math.floor(rng() * span);
}

function pickKinds(rng, count) {
  const kinds = SNIPPET_KINDS.slice();
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = kinds[i];
    kinds[i] = kinds[j];
    kinds[j] = tmp;
  }
  return kinds.slice(0, count);
}

function planSnippets(key, count, seen) {
  let salt = 0;
  while (salt < 80) {
    const seeded = salt === 0 ? key : `${key}#${salt}`;
    const rng = rngFor(seeded);
    const kinds = pickKinds(rng, count);
    const id = `${count}:${kinds.join(",")}`;
    if (!seen.has(id)) {
      seen.add(id);
      return { kinds, rng };
    }
    salt += 1;
  }
  throw new Error(`snippet order collision for ${key}`);
}

function renderSnippet(kind, rng, pad) {
  switch (kind) {
    case "xor":
      return `${pad}dexLane = dexLane xor ${lit(rng, 3, 60000)}`;
    case "add":
      return `${pad}dexLane = dexLane + ${lit(rng, 3, 60000)}`;
    case "shl":
      return `${pad}dexLane = dexLane shl ${lit(rng, 1, 12)}`;
    case "ushr":
      return `${pad}dexLane = dexLane ushr ${lit(rng, 1, 12)}`;
    case "mul":
      return `${pad}dexLane = dexLane * ${lit(rng, 3, 40)}`;
    case "and":
      return `${pad}dexLane = dexLane and ${lit(rng, 3, 32000)}`;
    case "or":
      return `${pad}dexLane = dexLane or ${lit(rng, 3, 60000)}`;
    case "rem":
      return `${pad}dexLane = dexLane % ${lit(rng, 3, 80)}`;
    case "inv":
      return `${pad}dexLane = dexLane.inv()`;
    case "if":
      return `${pad}if ((dexLane and ${lit(rng, 3, 28)}) == 0) {\n${pad}    dexLane = dexLane + ${lit(rng, 3, 4000)}\n${pad}}`;
    case "when":
      return `${pad}dexLane = when (dexLane and 3) {\n${pad}    0 -> dexLane + ${lit(rng, 3, 4000)}\n${pad}    1 -> dexLane + ${lit(rng, 3, 4000)}\n${pad}    else -> dexLane + ${lit(rng, 3, 4000)}\n${pad}}`;
    case "while":
      return `${pad}var laneSpin = (dexLane and 1) + 1\n${pad}while (laneSpin > 0) {\n${pad}    dexLane = dexLane xor laneSpin\n${pad}    laneSpin -= 1\n${pad}}`;
    case "chars": {
      const alphabet = "abcdefghijklmnop";
      let word = "";
      for (let i = 0; i < 4; i++) word += alphabet[Math.floor(rng() * alphabet.length)];
      return `${pad}val laneWord = "${word}"\n${pad}var laneAt = 0\n${pad}while (laneAt < laneWord.length) {\n${pad}    dexLane = dexLane xor laneWord[laneAt].code\n${pad}    laneAt += 1\n${pad}}`;
    }
    case "ints":
      return `${pad}val laneNums = intArrayOf(${lit(rng, 3, 200)}, ${lit(rng, 3, 200)}, ${lit(rng, 3, 200)})\n${pad}var laneIx = 0\n${pad}while (laneIx < laneNums.size) {\n${pad}    dexLane += laneNums[laneIx]\n${pad}    laneIx += 1\n${pad}}`;
    default:
      throw new Error(`unknown snippet ${kind}`);
  }
}

function renderDexBlock(key, count, pad, seen, initExpr) {
  const { kinds, rng } = planSnippets(key, count, seen);
  const lines = [`${pad}var dexLane = ${initExpr}`];
  for (const kind of kinds) lines.push(renderSnippet(kind, rng, pad));
  return lines.join("\n");
}

function renderGate(emptyExpr, pad) {
  return `${pad}if (dexLane == Int.MIN_VALUE) {\n${pad}    promise.resolve(${emptyExpr})\n${pad}    return\n${pad}}`;
}

function eolOf(src) {
  return src.includes("\r\n") ? "\r\n" : "\n";
}

function extractBraced(src, startNeedle) {
  const start = src.indexOf(startNeedle);
  if (start < 0) return "";
  const brace = src.indexOf("{", start);
  if (brace < 0) return "";
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return "";
}

function extractFunction(src, name) {
  const needle = `fun ${name}(`;
  const start = src.indexOf(needle);
  if (start < 0) return "";
  const braced = extractBraced(src, needle);
  if (!braced) return "";
  const lineStart = src.lastIndexOf("\n", start) + 1;
  const abs = src.indexOf(braced, lineStart);
  if (abs < 0) return "";
  return src.slice(lineStart, abs + braced.length);
}

function normalizeIndent(block, base) {
  const lines = block.replace(/\r\n/g, "\n").replace(/\s+$/, "").split("\n");
  const widths = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    widths.push(line.match(/^[ ]*/)[0].length);
  }
  const min = widths.length ? Math.min(...widths) : 0;
  return lines
    .map((line) => {
      if (!line.trim()) return "";
      const rawIndent = line.match(/^[ ]*/)[0].length;
      const content = line.slice(rawIndent).trimEnd();
      const extra = Math.max(0, rawIndent - min);
      return base + " ".repeat(extra) + content;
    })
    .join("\n");
}

function readModuleName(src) {
  const expr = src.match(/fun getName\(\)\s*:\s*String\s*=\s*"([^"]+)"/);
  if (expr) return expr[1];
  // return only — the first quote in the body is often @Suppress("...") after obfuscation
  const returned = src.match(/fun getName\(\)[\s\S]*?\breturn\s+"([^"]+)"/);
  return returned ? returned[1] : "";
}

function readClassName(src) {
  const m = src.match(/\bclass\s+(\w+)\s*\(/);
  return m ? m[1] : "";
}

function readPackage(src) {
  const m = src.match(/^package\s+([\w.]+)\s*$/m);
  return m ? m[1] : "";
}

function listReactMethods(src) {
  return [...src.matchAll(/@ReactMethod[\s\S]*?fun\s+(\w+)\s*\(/g)].map((m) => m[1]);
}

async function walkKt(dir) {
  const out = [];
  if (!(await safeStat(dir))) return out;
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith(".kt")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function detectFragment(rootPath) {
  const dir = path.join(rootPath, "services", "constants");
  if (!(await safeStat(dir))) return "";
  const entries = await fs.readdir(dir);
  for (const name of entries) {
    const m = name.match(/^const([a-zA-Z0-9]+)ntsVariable\.ts$/);
    if (m) return m[1];
  }
  return "";
}

function wrapCall(shape, expr, emptyExpr, pad) {
  if (shape === 0) {
    return `${pad}try {\n${pad}    promise.resolve(${expr})\n${pad}} catch (e: Exception) {\n${pad}    promise.resolve(${emptyExpr})\n${pad}}`;
  }
  if (shape === 1) {
    return `${pad}val dexValue = runCatching { ${expr} }.getOrDefault(${emptyExpr})\n${pad}promise.resolve(dexValue)`;
  }
  return `${pad}val dexValue = try {\n${pad}    ${expr}\n${pad}} catch (e: Exception) {\n${pad}    ${emptyExpr}\n${pad}}\n${pad}promise.resolve(dexValue)`;
}

function wrapBlock(shape, innerLines, emptyExpr, pad) {
  const body = innerLines.map((line) => `${pad}    ${line}`).join("\n");
  if (shape === 0) {
    return `${pad}try {\n${body}\n${pad}    promise.resolve(picked)\n${pad}} catch (e: Exception) {\n${pad}    promise.resolve(${emptyExpr})\n${pad}}`;
  }
  if (shape === 1) {
    return `${pad}val dexValue = runCatching {\n${body}\n${pad}    picked\n${pad}}.getOrDefault(${emptyExpr})\n${pad}promise.resolve(dexValue)`;
  }
  return `${pad}val dexValue = try {\n${body}\n${pad}    picked\n${pad}} catch (e: Exception) {\n${pad}    ${emptyExpr}\n${pad}}\n${pad}promise.resolve(dexValue)`;
}

function reactMethod(name, fragment, emptyExpr, body, seen) {
  const prefix = renderDexBlock(`${fragment}:${name}`, 4, "        ", seen, "reactApplicationContext.hashCode()");
  const gate = renderGate(emptyExpr, "        ");
  return `    @ReactMethod\n    fun ${name}(promise: Promise) {\n${prefix}\n${gate}\n${body}\n    }`;
}

function readAgentBody(shape) {
  if (shape === 0) {
    return `        return WebSettings.getDefaultUserAgent(context) ?: ""`;
  }
  if (shape === 1) {
    return `        val loaded = WebSettings.getDefaultUserAgent(context)\n        return if (loaded.isNullOrEmpty()) "" else loaded`;
  }
  return `        val loaded = WebSettings.getDefaultUserAgent(context)\n        if (loaded == null) {\n            return ""\n        }\n        return loaded`;
}

function buildUserAgent(src, fragment, readShape, seen) {
  const pkg = readPackage(src);
  const className = readClassName(src);
  const moduleName = readModuleName(src);
  const method = (src.match(/@ReactMethod[\s\S]*?fun\s+(\w+)\s*\(\s*promise:\s*Promise\s*\)/) || [])[1];
  if (!pkg || !className || !moduleName || !method) return null;
  const body = wrapCall(readShape, "readAgent(reactApplicationContext)", '""', "        ");
  return `package ${pkg}

import android.content.Context
import android.webkit.WebSettings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "${moduleName}"

${reactMethod(method, fragment, '""', body, seen)}

    private fun readAgent(context: Context): String {
${readAgentBody(readShape)}
    }
}
`;
}

function randomRequestHash(shape) {
  if (shape === 0) {
    return `    private fun randomRequestHash(): String {
        val bytes = ByteArray(16)
        java.security.SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { byte -> "%02x".format(byte) }
    }`;
  }
  if (shape === 1) {
    return `    private fun randomRequestHash(): String {
        val bytes = ByteArray(16)
        java.security.SecureRandom().nextBytes(bytes)
        val alphabet = "0123456789abcdef"
        val out = StringBuilder(bytes.size * 2)
        for (byte in bytes) {
            val v = byte.toInt() and 0xff
            out.append(alphabet[v ushr 4])
            out.append(alphabet[v and 0x0f])
        }
        return out.toString()
    }`;
  }
  return `    private fun randomRequestHash(): String {
        val alphabet = "0123456789abcdef"
        val rng = java.security.SecureRandom()
        val chars = CharArray(32)
        for (i in chars.indices) {
            chars[i] = alphabet[rng.nextInt(alphabet.length)]
        }
        return String(chars)
    }`;
}

function integrityCall(shape, pad) {
  const call = "requestIntegrityToken { value -> finish(value) }";
  if (shape === 0) {
    return `${pad}try {\n${pad}    ${call}\n${pad}} catch (e: Exception) {\n${pad}    finish("")\n${pad}}`;
  }
  if (shape === 1) {
    return `${pad}val started = runCatching { ${call} }\n${pad}if (started.isFailure) finish("")`;
  }
  return `${pad}val started = try {\n${pad}    ${call}\n${pad}    true\n${pad}} catch (e: Exception) {\n${pad}    false\n${pad}}\n${pad}if (!started) finish("")`;
}

function buildIntegrity(src, fragment, readShape, seen) {
  const pkg = readPackage(src);
  const className = readClassName(src);
  const moduleName = readModuleName(src);
  const method = (src.match(/@ReactMethod[\s\S]*?fun\s+(\w+)\s*\(\s*promise:\s*Promise\s*\)/) || [])[1];
  const project = (src.match(/CLOUD_PROJECT_NUMBER\s*=\s*(\d+)L/) || [])[1];
  if (!pkg || !className || !moduleName || !method || !project) return null;
  const hashShape = mix32(hashSeed(`${fragment}:hash`)) % 3;
  const body = `        val timeoutExecutor = Executors.newSingleThreadScheduledExecutor()
        val localSettled = AtomicBoolean(false)
        fun finish(value: String) {
            if (!localSettled.compareAndSet(false, true)) return
            timeoutExecutor.shutdownNow()
            promise.resolve(value)
        }
        timeoutExecutor.schedule({ finish("") }, 12, TimeUnit.SECONDS)
${integrityCall(readShape, "        ")}`;
  return `package ${pkg}

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.StandardIntegrityManager
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "${moduleName}"

${reactMethod(method, fragment, '""', body, seen)}

    private fun requestIntegrityToken(finish: (String) -> Unit) {
        val manager = IntegrityManagerFactory.createStandard(reactApplicationContext.applicationContext)
        val prepareRequest = StandardIntegrityManager.PrepareIntegrityTokenRequest.builder()
            .setCloudProjectNumber(CLOUD_PROJECT_NUMBER)
            .build()
        manager.prepareIntegrityToken(prepareRequest)
            .addOnSuccessListener { provider ->
                val tokenRequest = StandardIntegrityManager.StandardIntegrityTokenRequest.builder()
                    .setRequestHash(randomRequestHash())
                    .build()
                provider.request(tokenRequest)
                    .addOnSuccessListener { response -> finish(response.token() ?: "") }
                    .addOnFailureListener { finish("") }
            }
            .addOnFailureListener { finish("") }
    }

${randomRequestHash(hashShape)}

    companion object {
        private const val CLOUD_PROJECT_NUMBER = ${project}L
    }
}
`;
}

function findGlHelperName(src) {
  const re = /fun\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let match;
  while ((match = re.exec(src))) {
    const body = extractFunction(src, match[1]);
    if (body.includes("GLES20")) return match[1];
  }
  return "";
}

function methodRole(src, name) {
  const body = extractBraced(src, `fun ${name}(`);
  if (!body) return "other";
  if (body.includes("pendingSendId") || body.includes('"sendid"')) return "sendId";
  if (body.includes("pendingPushUrl") || body.includes('"url"')) return "pushUrl";
  if (body.includes("versionCode")) return "versionCode";
  if (body.includes("versionName")) return "versionName";
  if (body.includes("GLES20") || body.includes("GL_RENDERER")) return "gl";
  const calls = body.match(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g) || [];
  for (const raw of calls) {
    const call = raw.replace(/\s*\($/, "");
    if (call === name) continue;
    const helper = extractFunction(src, call);
    if (helper.includes("GLES20")) return "gl";
  }
  if (body.includes("packageName")) return "package";
  return "other";
}

function pendingLines(prefs, intentKey, storeKey) {
  return [
    `var picked = ""`,
    `val activity = reactApplicationContext.currentActivity`,
    `val intent = activity?.intent`,
    `val fromIntent = intent?.getStringExtra("${intentKey}")`,
    `if (!fromIntent.isNullOrBlank()) {`,
    `    picked = fromIntent`,
    `    intent?.removeExtra("${intentKey}")`,
    `} else {`,
    `    val stored = ${prefs}.loadString("${storeKey}", "")`,
    `    if (!stored.isNullOrBlank()) picked = stored`,
    `}`,
    `if (picked.isNotEmpty()) ${prefs}.removeKey("${storeKey}")`,
  ];
}

function buildAppInfo(src, fragment, readShape, seen) {
  const pkg = readPackage(src);
  const className = readClassName(src);
  const moduleName = readModuleName(src);
  const prefs =
    (src.match(/\b([A-Za-z0-9_]+)\.loadString\s*\(/) || [])[1] ||
    (src.match(/\b([A-Za-z0-9_]*P\w*referencesHelper)\b/) || [])[1] ||
    "";
  const glName = findGlHelperName(src);
  let glFn = glName ? extractFunction(src, glName) : "";
  const methods = listReactMethods(src);
  if (!pkg || !className || !moduleName || !glFn || methods.length === 0) return null;
  glFn = normalizeIndent(glFn, "    ").replace(
    new RegExp(`^\\s*(?:private\\s+)?fun\\s+${glName}\\b`),
    "    fun readGlRendererString"
  );
  const prefImport = prefs
    ? (src.match(new RegExp(`^import\\s+[\\w.]*${prefs}\\s*$`, "m")) || [])[0]
    : "";
  const parts = [];
  for (const name of methods) {
    const role = methodRole(src, name);
    if (role === "package") {
      parts.push(reactMethod(name, fragment, '""', wrapCall(readShape, `reactApplicationContext.packageName ?: ""`, '""', "        "), seen));
    } else if (role === "versionName") {
      parts.push(
        reactMethod(
          name,
          fragment,
          '""',
          wrapCall(
            readShape,
            `reactApplicationContext.packageManager.getPackageInfo(reactApplicationContext.packageName, 0).versionName ?: ""`,
            '""',
            "        "
          ),
          seen
        )
      );
    } else if (role === "versionCode") {
      parts.push(
        reactMethod(
          name,
          fragment,
          "0",
          wrapCall(
            readShape,
            `reactApplicationContext.packageManager.getPackageInfo(reactApplicationContext.packageName, 0).versionCode`,
            "0",
            "        "
          ),
          seen
        )
      );
    } else if (role === "gl") {
      parts.push(reactMethod(name, fragment, '""', wrapCall(readShape, "readGlRendererString()", '""', "        "), seen));
    } else if (role === "sendId" && prefs) {
      parts.push(reactMethod(name, fragment, '""', wrapBlock(readShape, pendingLines(prefs, "sendid", "pendingSendId"), '""', "        "), seen));
    } else if (role === "pushUrl" && prefs) {
      parts.push(reactMethod(name, fragment, '""', wrapBlock(readShape, pendingLines(prefs, "url", "pendingPushUrl"), '""', "        "), seen));
    } else {
      const original = extractFunction(src, name);
      if (!original) return null;
      parts.push(normalizeIndent(original, "    "));
    }
  }
  const imports = [
    "import android.opengl.GLES20",
    "import com.facebook.react.bridge.Promise",
    "import com.facebook.react.bridge.ReactApplicationContext",
    "import com.facebook.react.bridge.ReactContextBaseJavaModule",
    "import com.facebook.react.bridge.ReactMethod",
    "import javax.microedition.khronos.egl.EGL10",
    "import javax.microedition.khronos.egl.EGLConfig",
    "import javax.microedition.khronos.egl.EGLContext",
    "import javax.microedition.khronos.egl.EGLDisplay",
  ];
  if (prefImport) imports.push(prefImport);
  return `package ${pkg}

${imports.join("\n")}

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "${moduleName}"

${parts.join("\n\n")}

${glFn}
}
`;
}

function dictionaryWords(fragment) {
  const { freshObfuscationDictionary } = require("./obfDictionary");
  return freshObfuscationDictionary(fragment).text;
}

function renderDexLanes(pkg, fragment, seen) {
  const className = `D${fragment}DexLanes`;
  const methods = [];
  for (let i = 0; i < LANE_COUNT; i++) {
    const name = `lane${String(i).padStart(2, "0")}`;
    const block = renderDexBlock(`${fragment}:lane:${i}`, 5, "        ", seen, "seed");
    methods.push(`    fun ${name}(seed: Int): Int {
${block}
        return dexLane
    }`);
  }
  const chain = [];
  for (let i = 0; i < LANE_COUNT; i++) {
    const name = `lane${String(i).padStart(2, "0")}`;
    chain.push(`        acc = ${name}(acc)`);
  }
  return `/* ${DEX_LANES_MARKER} */
package ${pkg}

object ${className} {
${methods.join("\n\n")}

    fun touch(seed: Int) {
        var acc = seed
${chain.join("\n")}
        if (acc == Int.MIN_VALUE) {
            android.util.Log.v("${className}", "lane")
        }
    }
}
`;
}

async function findDecoyHub(javaRoot) {
  const files = await walkKt(javaRoot);
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("autosetup-decoy:v1")) continue;
    if (!/object\s+\w*DecoyHub\b/.test(src)) continue;
    const pkg = readPackage(src);
    if (!pkg) continue;
    return { file, pkg, dir: path.dirname(file) };
  }
  return null;
}

async function findMainApplication(javaRoot) {
  const files = await walkKt(javaRoot);
  return files.find((file) => path.basename(file) === "MainApplication.kt") || "";
}

async function purgeDexLanes(javaRoot) {
  const files = await walkKt(javaRoot);
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (src.includes(DEX_LANES_MARKER)) await fs.unlink(file);
  }
}

function wireMainApplication(src, pkg, className) {
  const nl = eolOf(src);
  let next = src.replace(/^import\s+[\w.]+\.D\w*DexLanes\s*\r?\n/gm, "");
  const mainPkg = readPackage(next);
  if (mainPkg !== pkg) {
    const importLine = `import ${pkg}.${className}`;
    if (!next.includes(importLine)) {
      const decoy = next.match(/^import\s+[\w.]+\.\w*DecoyHub\s*$/m);
      if (decoy) {
        const at = decoy.index + decoy[0].length;
        next = `${next.slice(0, at)}${nl}${importLine}${next.slice(at)}`;
      } else {
        const imports = [...next.matchAll(/^import\s+.+$/gm)];
        if (imports.length) {
          const last = imports[imports.length - 1];
          const at = last.index + last[0].length;
          next = `${next.slice(0, at)}${nl}${importLine}${next.slice(at)}`;
        } else {
          const pkgLine = next.match(/^package\s+[\w.]+\s*$/m);
          if (!pkgLine) throw new Error("MainApplication.kt: package not found");
          const at = pkgLine.index + pkgLine[0].length;
          next = `${next.slice(0, at)}${nl}${nl}${importLine}${next.slice(at)}`;
        }
      }
    }
  }
  next = next.replace(/[ \t]*\/\/ dex-lanes-begin[\s\S]*?\/\/ dex-lanes-end\r?\n?/g, "");
  const endMark = "// autosetup-decoy-end";
  const idx = next.indexOf(endMark);
  if (idx < 0) throw new Error("MainApplication.kt: autosetup-decoy-end not found");
  const lineEnd = next.indexOf("\n", idx);
  const at = lineEnd < 0 ? next.length : lineEnd + 1;
  const block = `    // dex-lanes-begin${nl}    ${className}.touch(applicationContext.hashCode())${nl}    // dex-lanes-end${nl}`;
  return next.slice(0, at) + block + next.slice(at);
}

async function ensureProguard(rootPath) {
  const file = path.join(rootPath, "android", "app", "proguard-rules.pro");
  let src = await fs.readFile(file, "utf8");
  const nl = eolOf(src);
  const dictLines = [
    "-obfuscationdictionary rn-obfuscator-dict.txt",
    "-classobfuscationdictionary rn-obfuscator-dict.txt",
    "-packageobfuscationdictionary rn-obfuscator-dict.txt",
  ];
  const missing = dictLines.filter((line) => !src.includes(line));
  if (missing.length) {
    src = `${src.replace(/\s*$/, "")}${nl}${missing.join(nl)}${nl}`;
  }
  src = src.replace(
    /\r?\n*# dex-lanes-neverinline[\s\S]*?-keepclassmembers class \* \{\r?\n    @androidx\.annotation\.Keep <methods>;\r?\n\}\r?\n*/g,
    "\n"
  );
  const lanesRule = [
    "# dex-lanes-neverinline",
    "# Keep lane methods from being inlined away, but do not preserve lane00 names.",
    "-keep,allowobfuscation class **.*DexLanes {",
    "    int lane*(int);",
    "    void touch(int);",
    "}",
  ].join(nl);
  if (!src.includes("-keep,allowobfuscation class **.*DexLanes")) {
    src = `${src.replace(/\s*$/, "")}${nl}${nl}${lanesRule}${nl}`;
  }
  await fs.writeFile(file, src, "utf8");
}

function skippedSource(file, src) {
  if (/Part\d+\.kt$/.test(path.basename(file))) return true;
  if (src.includes("autosetup-decoy")) return true;
  if (src.includes(DEX_LANES_MARKER)) return true;
  if (src.includes("net-stack:v1")) return true;
  if (src.includes("cf-intake:v1")) return true;
  if (src.includes("cf-cipher:v1")) return true;
  return false;
}

/** User-agent may live in Part*.kt after decoy split; host still imports WebSettings. */
async function isUserAgentModule(file, src) {
  if (src.includes("WebSettings.getDefaultUserAgent") || /fun\s+\w*UserAgent\s*\(/.test(src)) {
    return true;
  }
  if (!src.includes("@ReactMethod")) return false;
  if (src.includes("import android.webkit.WebSettings")) return true;
  const dir = path.dirname(file);
  const stem = path.basename(file, ".kt");
  for (let i = 1; i <= 9; i++) {
    const partPath = path.join(dir, `${stem}Part${String(i).padStart(2, "0")}.kt`);
    if (!(await safeStat(partPath))) continue;
    const partSrc = await fs.readFile(partPath, "utf8");
    if (partSrc.includes("WebSettings.getDefaultUserAgent")) return true;
  }
  return false;
}

async function stampDexVariance(rootPath, options = {}) {
  const fragment = options.fragment || (await detectFragment(rootPath));
  if (!fragment) return { ok: false, details: "fragment not detected" };

  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const files = await walkKt(javaRoot);
  const readShape = mix32(hashSeed(`${fragment}:read`)) % 3;
  const seen = new Set();
  const written = [];
  const kinds = new Set();

  for (const file of files) {
    // Part*.kt may be deleted mid-loop when user-agent is rewritten — skip by name first.
    if (/Part\d+\.kt$/.test(path.basename(file))) continue;
    if (!(await safeStat(file))) continue;
    const src = await fs.readFile(file, "utf8");
    if (skippedSource(file, src)) continue;
    let next = null;
    let kind = "";
    if (await isUserAgentModule(file, src)) {
      next = buildUserAgent(src, fragment, readShape, seen);
      kind = "user-agent";
    } else if (src.includes("IntegrityManagerFactory")) {
      next = buildIntegrity(src, fragment, readShape, seen);
      kind = "integrity";
    } else if (findGlHelperName(src)) {
      next = buildAppInfo(src, fragment, readShape, seen);
      kind = "app-info";
    }
    if (!kind) continue;
    if (!next) {
      return { ok: false, details: `failed to rewrite ${kind} (${path.basename(file)})` };
    }
    await fs.writeFile(file, next, "utf8");
    if (kind === "user-agent") {
      const dir = path.dirname(file);
      const stems = new Set([path.basename(file, ".kt"), readClassName(src)].filter(Boolean));
      for (const stem of stems) {
        for (let i = 1; i <= 9; i++) {
          const partPath = path.join(dir, `${stem}Part${String(i).padStart(2, "0")}.kt`);
          if (await safeStat(partPath)) await fs.unlink(partPath);
        }
      }
    }
    written.push(path.basename(file));
    kinds.add(kind);
  }

  const dictPath = path.join(rootPath, "android", "app", "rn-obfuscator-dict.txt");
  await fs.writeFile(dictPath, dictionaryWords(fragment), "utf8");

  if (kinds.size < 3 || !kinds.has("user-agent") || !kinds.has("integrity") || !kinds.has("app-info")) {
    return {
      ok: false,
      details: `rewrote ${written.join(", ") || "nothing"}; expected user-agent, app info, and integrity`,
    };
  }

  const hub = await findDecoyHub(javaRoot);
  if (!hub) return { ok: false, details: "DecoyHub package not found" };
  const lanesClass = `D${fragment}DexLanes`;
  const laneSeen = new Set();
  const lanesSrc = renderDexLanes(hub.pkg, fragment, laneSeen);
  const laneHits = lanesSrc.match(/fun lane\d+\(/g) || [];
  if (laneHits.length !== LANE_COUNT) {
    return { ok: false, details: `DexLanes has ${laneHits.length} methods, expected ${LANE_COUNT}` };
  }
  await purgeDexLanes(javaRoot);
  await fs.writeFile(path.join(hub.dir, `${lanesClass}.kt`), lanesSrc, "utf8");

  const mainPath = await findMainApplication(javaRoot);
  if (!mainPath) return { ok: false, details: "MainApplication.kt not found" };
  const mainSrc = await fs.readFile(mainPath, "utf8");
  await fs.writeFile(mainPath, wireMainApplication(mainSrc, hub.pkg, lanesClass), "utf8");
  await ensureProguard(rootPath);

  const net = await stampNetStack(rootPath, { fragment });
  if (!net.ok) return net;

  return {
    ok: true,
    details: `${written.join(", ")}; r8 dictionary; ${lanesClass} ${LANE_COUNT}; ${net.details}`,
  };
}

module.exports = {
  stampDexVariance,
};
