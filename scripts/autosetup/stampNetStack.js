/**
 * Pick one HTTP client and one JSON parser from the fragment seed and
 * call both from a live @ReactMethod so R8 keeps the library code.
 *
 * OkHttp is the copy already pulled in by React Native (4.9.2). Do not add
 * an OkHttp dependency and do not bump it. Moshi stays on 1.12.0: 1.13+
 * pulls Okio 3, which breaks React Native's Okio 2.9.0 pin.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat, isAutosetupSplitPart } = require("./fsUtils");

const NET_BEGIN = "// net-stack-begin";
const NET_END = "// net-stack-end";

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

function chooseStack(fragment) {
  const seed = mix32(hashSeed(`${fragment}:net`));
  const http = (seed & 1) === 0 ? "okhttp" : "volley";
  const json = ((seed >>> 1) & 1) === 0 ? "gson" : "moshi";
  return { http, json, seed };
}

function eolOf(src) {
  return src.includes("\r\n") ? "\r\n" : "\n";
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

function readPackage(src) {
  const m = src.match(/^\s*package\s+([\w.]+)\s*$/m);
  return m ? m[1] : "";
}

function depLines(http, json) {
  const lines = [];
  if (http === "volley") lines.push("    implementation 'com.android.volley:volley:1.2.1'");
  if (json === "gson") lines.push("    implementation 'com.google.code.gson:gson:2.11.0'");
  if (json === "moshi") lines.push("    implementation 'com.squareup.moshi:moshi:1.12.0'");
  return lines;
}

async function writeGradleDeps(rootPath, http, json) {
  const gradlePath = path.join(rootPath, "android", "app", "build.gradle");
  let src = await fs.readFile(gradlePath, "utf8");
  const nl = eolOf(src);
  const block = [`    ${NET_BEGIN}`, ...depLines(http, json), `    ${NET_END}`].join(nl);
  const re = /[ \t]*\/\/ net-stack-begin[\s\S]*?\/\/ net-stack-end/;
  if (re.test(src)) {
    src = src.replace(re, block);
  } else {
    const needle = "if (hermesEnabled)";
    const idx = src.indexOf(needle);
    if (idx < 0) {
      throw new Error("android/app/build.gradle: if (hermesEnabled) not found");
    }
    const lineStart = src.lastIndexOf("\n", idx) + 1;
    src = `${src.slice(0, lineStart)}${block}${nl}${nl}${src.slice(lineStart)}`;
  }
  await fs.writeFile(gradlePath, src, "utf8");
}

function digestBody(json) {
  if (json === "gson") {
    return `        val element = JsonParser.parseString(body)
        return element.toString().length.toString()`;
  }
  return `        val count = JsonReader.of(Buffer().writeUtf8(body)).use { reader ->
            var tokens = 0
            while (reader.peek() != JsonReader.Token.END_DOCUMENT) {
                when (reader.peek()) {
                    JsonReader.Token.BEGIN_OBJECT -> {
                        reader.beginObject()
                        tokens += 1
                    }
                    JsonReader.Token.END_OBJECT -> {
                        reader.endObject()
                        tokens += 1
                    }
                    JsonReader.Token.BEGIN_ARRAY -> {
                        reader.beginArray()
                        tokens += 1
                    }
                    JsonReader.Token.END_ARRAY -> {
                        reader.endArray()
                        tokens += 1
                    }
                    JsonReader.Token.NAME -> {
                        reader.nextName()
                        tokens += 1
                    }
                    JsonReader.Token.STRING -> {
                        reader.nextString()
                        tokens += 1
                    }
                    JsonReader.Token.NUMBER -> {
                        reader.nextDouble()
                        tokens += 1
                    }
                    JsonReader.Token.BOOLEAN -> {
                        reader.nextBoolean()
                        tokens += 1
                    }
                    JsonReader.Token.NULL -> {
                        reader.nextNull<Any>()
                        tokens += 1
                    }
                    else -> {
                        reader.skipValue()
                        tokens += 1
                    }
                }
            }
            tokens
        }
        return count.toString()`;
}

function sendBody(http) {
  if (http === "okhttp") {
    return `        val client = OkHttpClient.Builder()
            .callTimeout(8, TimeUnit.SECONDS)
            .build()
        var short = ""
        try {
            client.newCall(Request.Builder().url(url).get().build()).execute().use { response ->
                val text = response.body?.string() ?: ""
                short = digest(text)
            }
        } catch (e: Exception) {
            short = ""
        } finally {
            client.dispatcher.executorService.shutdown()
            client.connectionPool.evictAll()
        }
        promise.resolve(short)`;
  }
  return `        val callbackExecutor = Executors.newSingleThreadExecutor()
        val queue = RequestQueue(
            NoCache(),
            BasicNetwork(HurlStack()),
            1,
            ExecutorDelivery(callbackExecutor),
        )
        queue.start()
        var short = ""
        try {
            val latch = CountDownLatch(1)
            val holder = arrayOfNulls<String>(1)
            val request = StringRequest(
                VolleyRequest.Method.GET,
                url,
                { body ->
                    holder[0] = body
                    latch.countDown()
                },
                { _ ->
                    latch.countDown()
                },
            )
            request.setShouldCache(false)
            request.retryPolicy = DefaultRetryPolicy(8000, 0, 1f)
            queue.add(request)
            if (latch.await(8, TimeUnit.SECONDS)) {
                val body = holder[0]
                if (body != null) short = digest(body)
            } else {
                request.cancel()
            }
        } catch (e: Exception) {
            short = ""
        } finally {
            queue.stop()
            callbackExecutor.shutdownNow()
        }
        promise.resolve(short)`;
}

function renderModule(pkg, fragment, http, json) {
  const className = `P${fragment}NetStackModule`;
  const moduleName = `P${fragment}NetStack`;
  const imports = [
    "import com.facebook.react.bridge.Promise",
    "import com.facebook.react.bridge.ReactApplicationContext",
    "import com.facebook.react.bridge.ReactContextBaseJavaModule",
    "import com.facebook.react.bridge.ReactMethod",
  ];
  if (http === "okhttp") {
    imports.push("import okhttp3.OkHttpClient", "import okhttp3.Request", "import java.util.concurrent.TimeUnit");
  } else {
    imports.push(
      "import com.android.volley.DefaultRetryPolicy",
      "import com.android.volley.ExecutorDelivery",
      "import com.android.volley.Request as VolleyRequest",
      "import com.android.volley.RequestQueue",
      "import com.android.volley.toolbox.BasicNetwork",
      "import com.android.volley.toolbox.HurlStack",
      "import com.android.volley.toolbox.NoCache",
      "import com.android.volley.toolbox.StringRequest",
      "import java.util.concurrent.CountDownLatch",
      "import java.util.concurrent.Executors",
      "import java.util.concurrent.TimeUnit"
    );
  }
  if (json === "gson") imports.push("import com.google.gson.JsonParser");
  else imports.push("import com.squareup.moshi.JsonReader", "import okio.Buffer");

  return `/* net-stack:v1 ${http}+${json} */
package ${pkg}

${imports.join("\n")}

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "${moduleName}"

    @ReactMethod
    fun send(url: String, promise: Promise) {
${sendBody(http)}
    }

    private fun digest(body: String): String {
${digestBody(json)}
    }
}
`;
}

function registerModule(src, className) {
  const nl = eolOf(src);
  let next = src.replace(/^[ \t]*P\w*Net\w*Stack\w*Module\(reactContext\),?[ \t]*\r?\n/gm, "");
  if (next.includes(`${className}(reactContext)`)) return next;
  const funAt = next.search(/fun createNativeModules\s*\(/);
  if (funAt < 0) throw new Error("ModuleRegistry.createNativeModules not found");
  const listAt = next.indexOf("listOf(", funAt);
  if (listAt < 0) throw new Error("ModuleRegistry listOf( not found");
  const paren = next.indexOf("(", listAt);
  let depth = 0;
  let close = -1;
  for (let i = paren; i < next.length; i++) {
    const ch = next[i];
    if (ch === "(") depth += 1;
    else if (ch === ")") {
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
  const line = `${needsComma ? "," : ""}${nl}            ${className}(reactContext),${nl}        `;
  return before + line + next.slice(close);
}

async function findRegistry(javaRoot) {
  const files = await walkKt(javaRoot);
  for (const file of files) {
    if (/Part\d+\.kt$/.test(path.basename(file))) continue;
    const src = await fs.readFile(file, "utf8");
    if (src.includes("autosetup-decoy")) continue;
    if (!src.includes("fun createNativeModules")) continue;
    return { file, src };
  }
  return null;
}

async function purgeNetModules(javaRoot) {
  const removed = [];
  const files = await walkKt(javaRoot);
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("net-stack:v1")) continue;
    const className = (src.match(/\bclass\s+([A-Za-z0-9_]+)/) || [])[1];
    if (className) removed.push(className);
    await fs.unlink(file);
  }
  return removed;
}

function stripRegistryEntries(src, names) {
  let next = src;
  for (const name of names) {
    next = next.replace(
      new RegExp(`^[ \\t]*${name}\\(reactContext\\),?[ \\t]*\\r?\\n`, "gm"),
      ""
    );
  }
  return next;
}

function ensureNativeModulesImport(src) {
  const re = /import\s*\{([^}]*)\}\s*from\s*(['"])react-native\2\s*;?/;
  if (!re.test(src)) {
    const nl = eolOf(src);
    return `import { NativeModules } from 'react-native';${nl}${src}`;
  }
  return src.replace(re, (full, inner, quote) => {
    const parts = inner
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.includes("NativeModules")) parts.push("NativeModules");
    const semi = full.trim().endsWith(";") ? ";" : "";
    return `import { ${parts.join(", ")} } from ${quote}react-native${quote}${semi}`;
  });
}

function rewritePublicPing(src, moduleName) {
  const nl = eolOf(src);
  let next = ensureNativeModulesImport(src);
  const blockRe = /^([ \t]*)const controller = new AbortController\(\);[\s\S]*?clearTimeout\(timeoutId\);\s*\}/m;
  const block = next.match(blockRe);
  if (block) {
    const indent = block[1] || "  ";
    const varMatch = block[0].match(/await\s+fetch\(\s*([A-Za-z0-9_]+)\s*,/);
    const varName = varMatch ? varMatch[1] : "";
    if (!varName) {
      throw new Error("PublicPing fetch() has no session endpoint variable");
    }
    const replacement = [
      `${indent}try {`,
      `${indent}  await NativeModules.${moduleName}.send(${varName});`,
      `${indent}} catch {`,
      `${indent}  // Response is unused; a failed call just waits for the next interval.`,
      `${indent}}`,
    ].join(nl);
    next = next.replace(blockRe, replacement);
  }
  next = next.replace(
    /NativeModules\.[A-Za-z0-9_]+\.[A-Za-z0-9_]+\s*\(/g,
    `NativeModules.${moduleName}.send(`
  );
  return next;
}

function isPingHost(src) {
  const hasFlow =
    /SendPublicPing|PublicEndpoints|catfact\.ninja|SessionEndpoint/.test(src);
  const hasCall = /NativeModules\.\w+\.\w+\s*\(/.test(src) || /await\s+fetch\s*\(/.test(src);
  return hasFlow && hasCall;
}

async function rewritePings(rootPath, moduleName) {
  const dir = path.join(rootPath, "services");
  if (!(await safeStat(dir))) throw new Error("services/ not found");
  const names = [];
  for (const name of await fs.readdir(dir)) {
    if (!name.endsWith(".ts") || name.endsWith(".d.ts")) continue;
    const src = await fs.readFile(path.join(dir, name), "utf8");
    if (isAutosetupSplitPart(src)) continue;
    if (isPingHost(src)) names.push(name);
  }
  if (names.length === 0) throw new Error("services/*PublicPing.ts not found");
  const updated = [];
  for (const name of names) {
    const file = path.join(dir, name);
    const src = await fs.readFile(file, "utf8");
    const next = rewritePublicPing(src, moduleName);
    if (/await\s+fetch\s*\(/.test(next)) {
      throw new Error(`${name}: fetch() is still present`);
    }
    if (!next.includes(`NativeModules.${moduleName}.send(`)) {
      throw new Error(`${name}: NativeModules.${moduleName}.send was not written`);
    }
    await fs.writeFile(file, next, "utf8");
    updated.push(name);
  }
  return updated;
}

async function stampNetStack(rootPath, options = {}) {
  const fragment = options.fragment || "";
  if (!fragment) return { ok: false, details: "fragment not detected" };
  const { http, json } = chooseStack(fragment);
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const registry = await findRegistry(javaRoot);
  if (!registry) return { ok: false, details: "ModuleRegistry.createNativeModules not found" };
  const pkg = readPackage(registry.src);
  if (!pkg) return { ok: false, details: "ModuleRegistry package not found" };

  const className = `P${fragment}NetStackModule`;
  const moduleName = `P${fragment}NetStack`;
  const removed = await purgeNetModules(javaRoot);
  const modulePath = path.join(path.dirname(registry.file), `${className}.kt`);
  await fs.writeFile(modulePath, renderModule(pkg, fragment, http, json), "utf8");

  const registryNow = stripRegistryEntries(await fs.readFile(registry.file, "utf8"), removed);
  await fs.writeFile(registry.file, registerModule(registryNow, className), "utf8");
  await writeGradleDeps(rootPath, http, json);
  await rewritePings(rootPath, moduleName);

  return {
    ok: true,
    http,
    json,
    details: `net ${http}+${json}`,
  };
}

module.exports = {
  stampNetStack,
  chooseStack,
};
