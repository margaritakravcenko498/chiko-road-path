/**
 * Generate decoy source files so android/java and services/
 * end up with uncorrelated file counts (obfuscation fingerprint break).
 *
 * Android layout (expected):
 *   java/com/{hostFragment}/ MainActivity + MainApplication
 *   java/com/{fragment}/         helpers, Viewport*, ModuleRegistry, decoys
 *   java/com/{fragment}/linkkit/ AppLink stack (not Henway *olts)
 *
 * - Independent RNG ranges per side
 * - Files marked /* autosetup-decoy:v1 *\/ are purged on re-run
 * - Wired into MainApplication + init orchestrator (GatePipeline / initializationFlow)
 * - Decoys are written into the helper package dir, alongside the other app classes
 * - Counts use the whole java/ tree
 * - Existing non-decoy classes are split into Part files via splitExistingUnits
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { detectFragmentFromConstants } = require("./applyMeta");
const { splitExistingUnits } = require("./splitExisting");

const DECOY_MARKER = "/* autosetup-decoy:v1 */";
const WIRE_BEGIN = "// autosetup-decoy-begin";
const WIRE_END = "// autosetup-decoy-end";

const ANDROID_WORDS = [
  "Lattice",
  "Orbit",
  "Cipher",
  "Quanta",
  "Nexus",
  "Prism",
  "Vector",
  "Flux",
  "Ember",
  "Grove",
  "Ridge",
  "Spire",
  "Vale",
  "Crest",
  "Drift",
  "Halo",
  "Shard",
  "Bloom",
];

const SERVICES_WORDS = [
  "pulse",
  "knurl",
  "grit",
  "mote",
  "veneer",
  "fillet",
  "bevel",
  "kerf",
  "plait",
  "weft",
  "yarn",
  "flint",
  "slate",
  "chalk",
  "rime",
  "scree",
  "talus",
  "loam",
];

const CODE_EXTS = new Set([".kt", ".java", ".ts", ".tsx"]);

function randInt(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
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

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickUnique(words, count, rng, used) {
  const pool = [...words];
  const out = [];
  while (out.length < count) {
    if (pool.length === 0) {
      out.push(`X${out.length}${randInt(10, 99, rng)}`);
      continue;
    }
    const idx = randInt(0, pool.length - 1, rng);
    const word = pool.splice(idx, 1)[0];
    if (used.has(word)) continue;
    used.add(word);
    out.push(word);
  }
  return out;
}

async function walkFiles(rootDir, { exts = null } = {}) {
  const files = [];
  if (!(await safeStat(rootDir))) return files;
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (exts && !exts.has(ext)) continue;
      files.push(full);
    }
  }
  await walk(rootDir);
  return files;
}

async function isDecoyFile(filePath) {
  try {
    const fh = await fs.open(filePath, "r");
    try {
      const { buffer, bytesRead } = await fh.read(Buffer.alloc(240), 0, 240, 0);
      return buffer.slice(0, bytesRead).toString("utf8").includes("autosetup-decoy:v1");
    } finally {
      await fh.close();
    }
  } catch {
    return false;
  }
}

async function purgeDecoyFiles(files) {
  let removed = 0;
  for (const file of files) {
    if (await isDecoyFile(file)) {
      await fs.unlink(file);
      removed += 1;
    }
  }
  return removed;
}

function stripWireBlock(content) {
  const re = new RegExp(
    `\\n?[ \\t]*${escapeRegExp(WIRE_BEGIN)}[\\s\\S]*?${escapeRegExp(WIRE_END)}\\n?`,
    "g"
  );
  return content.replace(re, "\n");
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripDecoyImports(content, hubClassOrSymbol) {
  const re = new RegExp(
    `^import\\s+.*?${escapeRegExp(hubClassOrSymbol)}.*?\\r?\\n`,
    "gm"
  );
  return content.replace(re, "");
}

async function findMainApplication(rootPath) {
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const files = await walkFiles(javaRoot, { exts: new Set([".kt", ".java"]) });
  return files.find((f) => path.basename(f) === "MainApplication.kt") || null;
}

function packageNameToDir(javaRoot, packageName) {
  return path.join(javaRoot, ...String(packageName).split("."));
}

/**
 * Prefer the app helper package (com.{fragment}), not abpp / linkkit / bolts leftovers.
 */
async function detectHelperPackage(javaRoot) {
  const files = await walkFiles(javaRoot, { exts: new Set([".kt", ".java"]) });
  const counts = new Map();
  for (const file of files) {
    const base = path.basename(file);
    if (base.startsWith("Main")) continue;
    if (await isDecoyFile(file)) continue;
    const raw = await fs.readFile(file, "utf8");
    const m = raw.match(/^\s*package\s+([\w.]+)\s*;?\s*$/m);
    if (!m) continue;
    const pkg = m[1];
    if (/\.linkkit$/i.test(pkg) || /olts$/i.test(pkg) || /abpp$/i.test(pkg)) continue;
    counts.set(pkg, (counts.get(pkg) || 0) + 1);
  }
  let best = null;
  let bestN = 0;
  for (const [pkg, n] of counts) {
    if (n > bestN) {
      best = pkg;
      bestN = n;
    }
  }
  if (best) return best;

  // After relocate, helpers live in com.{host} together with Main*.
  for (const file of files) {
    if (path.basename(file) !== "MainApplication.kt" && path.basename(file) !== "MainApplication.java") {
      continue;
    }
    const raw = await fs.readFile(file, "utf8");
    const m = raw.match(/^\s*package\s+([\w.]+)\s*;?\s*$/m);
    if (m?.[1]) return m[1];
  }
  return null;
}

async function findInitFlowFile(servicesDir, fragment) {
  const files = await walkFiles(servicesDir, { exts: new Set([".ts", ".tsx"]) });
  // Prefer orchestrator that owns RunInitializationFlow body (GatePipeline etc.),
  // not a thin re-export shell like init{frag}ializationFlow.ts.
  const bodyOwners = [];
  for (const f of files) {
    const name = path.basename(f);
    if (/Steps|Messaging|Shared|hooks|DecoyHub|Part\d+/i.test(name)) continue;
    let src = "";
    try {
      src = await fs.readFile(f, "utf8");
    } catch {
      continue;
    }
    if (
      /export\s+async\s+function\s+\w*RunInitializationFlow\s*\([^)]*\)\s*:\s*[^{]+\{/.test(
        src
      ) &&
      !/export\s+\{\s*[^}]*RunInitializationFlow/.test(
        src.split(/export\s+async\s+function\s+\w*RunInitializationFlow/)[0] || ""
      )
    ) {
      // Has a real function body declaration
      if (src.includes("autosetup-decoy-begin") || /DecoyHubTouch/.test(src) || /GatePipeline|gate|pipeline/i.test(name)) {
        bodyOwners.unshift(f);
      } else {
        bodyOwners.push(f);
      }
    }
  }
  if (bodyOwners.length) {
    const withFrag = bodyOwners.find((f) => path.basename(f).includes(fragment));
    return withFrag || bodyOwners[0];
  }

  const preferred = files.filter((f) => {
    const name = path.basename(f);
    if (/Steps|Messaging|Shared|hooks|DecoyHub/i.test(name)) return false;
    // fragment may be spliced into the middle: init{frag}ializationFlow.ts
    return /init.*ializationFlow\.ts$/i.test(name) || /GatePipeline\.ts$/i.test(name);
  });
  if (preferred.length) {
    const withFrag = preferred.find((f) => path.basename(f).includes(fragment));
    return withFrag || preferred[0];
  }
  return null;
}

function resolveDecoyOptions(meta = {}) {
  const d = meta.decoy && typeof meta.decoy === "object" ? meta.decoy : {};
  return {
    // Defaults diverge from Henway-like 2–18 / flat com/rnapp decoy dumps.
    androidAddMin: Number(d.androidAddMin ?? 8),
    androidAddMax: Number(d.androidAddMax ?? 14),
    servicesAddMin: Number(d.servicesAddMin ?? 2),
    servicesAddMax: Number(d.servicesAddMax ?? 9),
    minGap: Number(d.minGap ?? 4),
  };
}

function pickAdds(baseA, baseS, opts, rngAndroid, rngServices) {
  for (let attempt = 0; attempt < 80; attempt++) {
    const addA = randInt(opts.androidAddMin, opts.androidAddMax, rngAndroid);
    const addS = randInt(opts.servicesAddMin, opts.servicesAddMax, rngServices);
    const totalA = baseA + addA;
    const totalS = baseS + addS;
    if (totalA !== totalS && Math.abs(totalA - totalS) >= opts.minGap) {
      return { addA, addS, totalA, totalS };
    }
  }
  // Force a gap if RNG collided too often.
  let addA = randInt(opts.androidAddMin, opts.androidAddMax, rngAndroid);
  let addS = randInt(opts.servicesAddMin, opts.servicesAddMax, rngServices);
  let totalA = baseA + addA;
  let totalS = baseS + addS;
  if (totalA === totalS || Math.abs(totalA - totalS) < opts.minGap) {
    addA = Math.max(opts.androidAddMin, addS + opts.minGap + randInt(0, 3, rngAndroid));
    if (addA > opts.androidAddMax + 6) {
      addS = Math.max(opts.servicesAddMin, 1);
      addA = addS + opts.minGap + randInt(1, 4, rngAndroid);
    }
    totalA = baseA + addA;
    totalS = baseS + addS;
  }
  return { addA, addS, totalA, totalS };
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

function unitSeed(fragment, name) {
  return mix32(hashSeed(`${fragment}:${name}`));
}

function nz(n, mod, floor = 1) {
  const v = (n >>> 0) % mod;
  return v < floor ? floor : v;
}

function kotlinTapBody(className, seed) {
  const s = mix32(seed);
  const shape = s % 5;
  const a = nz(s, 65521, 2);
  const b = nz(s >>> 8, 4000, 3);
  const c = nz(s >>> 16, 97, 3);
  const oddC = c % 2 === 0 ? c + 1 : c;
  const sh = nz(s >>> 20, 7, 1);
  const tag = String(className);
  if (shape === 0) {
    return `    var x = seed xor ${a}\n    x = (x * ${oddC} + ${b}) and 0xffff\n    return x`;
  }
  if (shape === 1) {
    return `    var x = seed + ${a}\n    x = x shl ${sh}\n    x = x xor ${b}\n    return x and 0xffff`;
  }
  if (shape === 2) {
    return `    var x = seed * ${oddC}\n    x = x xor ${a}\n    x %= ${b + 50}\n    if (x < 0) x += ${b + 50}\n    return x`;
  }
  if (shape === 3) {
    return `    var x = seed\n    x = x xor ${a}\n    x = (x ushr ${sh}) xor ${b}\n    x = (x * ${oddC}) and 0xffff\n    return x`;
  }
  return `    val tag = "${tag}"\n    var x = seed xor ${a}\n    for (ch in tag) {\n      x = (x + ch.code * ${oddC}) and 0xffff\n    }\n    return x xor ${b}`;
}

function servicesTouchLines(fnName, seed) {
  const s = mix32(seed);
  const shape = s % 5;
  const a = nz(s, 65521, 2);
  const b = nz(s >>> 8, 4000, 3);
  const c = nz(s >>> 16, 97, 3);
  const oddC = c % 2 === 0 ? c + 1 : c;
  const sh = nz(s >>> 20, 7, 1);
  const tag = String(fnName);
  if (shape === 0) {
    return `  let x = (seed ^ ${a}) & 0xffff;\n  x = (x * ${oddC} + ${b}) % 65521;\n  return x;`;
  }
  if (shape === 1) {
    return `  let x = (seed + ${a}) | 0;\n  x = (x << ${sh}) | 0;\n  x = (x ^ ${b}) & 0xffff;\n  return x;`;
  }
  if (shape === 2) {
    return `  let x = Math.imul(seed | 0, ${oddC});\n  x = (x ^ ${a}) % ${b + 50};\n  if (x < 0) x += ${b + 50};\n  return x;`;
  }
  if (shape === 3) {
    return `  let x = (seed ^ ${a}) | 0;\n  x = (x >>> ${sh}) ^ ${b};\n  x = Math.imul(x, ${oddC}) & 0xffff;\n  return x;`;
  }
  return `  const tag = "${tag}";\n  let x = (seed ^ ${a}) & 0xffff;\n  for (let i = 0; i < tag.length; i++) {\n    x = (x + tag.charCodeAt(i) * ${oddC}) & 0xffff;\n  }\n  return x ^ ${b};`;
}

function buildAndroidUnit(packageName, className, fragment) {
  const body = kotlinTapBody(className, unitSeed(fragment, className));
  return `${DECOY_MARKER}
package ${packageName}

object ${className} {
  fun tap(seed: Int): Int {
${body}
  }
}
`;
}

function buildAndroidHub(packageName, hubClass, units) {
  const body = units
    .map((u, i) => `    acc = acc xor ${u.className}.tap(${3 + i * 2})`)
    .join("\n");
  return `${DECOY_MARKER}
package ${packageName}

object ${hubClass} {
  @JvmStatic
  fun touch() {
    var acc = 0
${body || "    acc = acc xor 1"}
    if (acc == Int.MIN_VALUE) {
      android.util.Log.v("${hubClass}", "noop")
    }
  }
}
`;
}

function buildServicesUnit(fnName, fragment) {
  const body = servicesTouchLines(fnName, unitSeed(fragment, fnName));
  return `${DECOY_MARKER}

export function ${fnName}(seed: number): number {
${body}
}
`;
}

function buildServicesHub(hubFn, units) {
  const imports = units
    .map((u) => `import { ${u.fnName} } from './${u.fileBase}';`)
    .join("\n");
  const calls = units
    .map((u, i) => `  void ${u.fnName}(${5 + i * 3});`)
    .join("\n");
  return `${DECOY_MARKER}
${imports ? `${imports}\n` : ""}
export function ${hubFn}(): void {
${calls || "  void 0;"}
}
`;
}

async function wireMainApplication(mainAppPath, helperPackage, hubClass) {
  let raw = await fs.readFile(mainAppPath, "utf8");
  raw = stripWireBlock(raw);
  raw = stripDecoyImports(raw, hubClass);

  const importLine = `import ${helperPackage}.${hubClass}\n`;
  if (!raw.includes(hubClass)) {
    const pkgMatch = raw.match(/^package\s+[\w.]+\s*\r?\n/);
    if (pkgMatch) {
      const insertAt = pkgMatch.index + pkgMatch[0].length;
      raw = raw.slice(0, insertAt) + importLine + raw.slice(insertAt);
    } else {
      raw = importLine + raw;
    }
  }

  const wire = `    ${WIRE_BEGIN}\n    ${hubClass}.touch()\n    ${WIRE_END}\n`;
  if (/override fun onCreate\(\)/.test(raw)) {
    raw = raw.replace(
      /(override fun onCreate\(\)\s*\{[^\n]*\n)/,
      `$1${wire}`
    );
  } else {
    throw new Error("MainApplication.kt: onCreate() not found for decoy wiring");
  }

  await fs.writeFile(mainAppPath, raw, "utf8");
}

async function clearMainApplicationWire(mainAppPath) {
  if (!(await safeStat(mainAppPath))) return;
  let raw = await fs.readFile(mainAppPath, "utf8");
  raw = stripWireBlock(raw);
  raw = raw.replace(/^import\s+[\w.]*DecoyHub\s*\r?\n/gm, "");
  await fs.writeFile(mainAppPath, raw, "utf8");
}

async function wireInitFlow(initFlowPath, hubFn, hubImportPath) {
  let raw = await fs.readFile(initFlowPath, "utf8");
  raw = stripWireBlock(raw);
  raw = raw.replace(
    new RegExp(`^import\\s+\\{\\s*${escapeRegExp(hubFn)}\\s*\\}\\s*from\\s*['"][^'"]+['"];?\\r?\\n`, "gm"),
    ""
  );

  const importLine = `import { ${hubFn} } from '${hubImportPath}';\n`;
  const firstImport = raw.search(/^import\s/m);
  if (firstImport >= 0) {
    raw = raw.slice(0, firstImport) + importLine + raw.slice(firstImport);
  } else {
    raw = importLine + raw;
  }

  const wire = `  ${WIRE_BEGIN}\n  void ${hubFn}();\n  ${WIRE_END}\n`;
  // Brace may sit at the end of the signature line or on the same line as the
  // first statement (`{  void helper()`), so do not require a newline after `{`.
  const initRe =
    /(export\s+async\s+function\s+\w*(?:Initialize|RunInitializationFlow)\s*\([^)]*\)\s*:\s*[^{]+\{)([^\n]*)/;
  if (!initRe.test(raw)) {
    throw new Error(
      `${path.basename(initFlowPath)}: export async function *Initialize|*RunInitializationFlow not found`
    );
  }
  raw = raw.replace(initRe, `$1\n${wire}$2`);
  await fs.writeFile(initFlowPath, raw, "utf8");
}

async function clearInitFlowWire(initFlowPath) {
  if (!initFlowPath || !(await safeStat(initFlowPath))) return;
  let raw = await fs.readFile(initFlowPath, "utf8");
  raw = stripWireBlock(raw);
  raw = raw.replace(
    /^import\s+\{\s*\w*DecoyHubTouch\s*\}\s*from\s*['"][^'"]+['"];?\r?\n/gm,
    ""
  );
  await fs.writeFile(initFlowPath, raw, "utf8");
}

/**
 * @param {string} rootPath
 * @param {{ fragment?: string, meta?: object }} [options]
 */
async function generateProjectDecoys(rootPath, options = {}) {
  const fragment =
    options.fragment ||
    (await detectFragmentFromConstants(rootPath)) ||
    "";
  if (!fragment) {
    return { ok: false, details: "fragment not detected (constants/*ntsVariable.ts)" };
  }

  const opts = resolveDecoyOptions(options.meta || {});
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  if (!(await safeStat(javaRoot))) {
    return { ok: false, details: "android/app/src/main/java not found" };
  }
  const mainAppPath = await findMainApplication(rootPath);
  if (!mainAppPath) {
    return { ok: false, details: "MainApplication.kt not found" };
  }
  const servicesDir = path.join(rootPath, "services");
  if (!(await safeStat(servicesDir))) {
    return { ok: false, details: "services/ not found" };
  }

  const helperPackage = await detectHelperPackage(javaRoot);
  if (!helperPackage) {
    return { ok: false, details: "helper package not detected under android/java" };
  }
  const helperDir = packageNameToDir(javaRoot, helperPackage);
  await fs.mkdir(helperDir, { recursive: true });

  const initFlowPath = await findInitFlowFile(servicesDir, fragment);
  if (!initFlowPath) {
    return { ok: false, details: "initializationFlow.ts not found in services/" };
  }

  // Purge previous decoys + wiring (idempotent re-run).
  const androidAll = await walkFiles(javaRoot, { exts: new Set([".kt", ".java"]) });
  const servicesAll = await waitFilesTs(servicesDir);
  const removedAndroid = await purgeDecoyFiles(androidAll);
  const removedServices = await purgeDecoyFiles(servicesAll);
  await clearMainApplicationWire(mainAppPath);
  await clearInitFlowWire(initFlowPath);

  let splitDetails = "";
  try {
    const splitResult = await splitExistingUnits(rootPath);
    splitDetails = `; ${splitResult.details}`;
  } catch (err) {
    splitDetails = `; split skipped (${err.message})`;
  }

  const androidBaseFiles = await walkFiles(javaRoot, { exts: new Set([".kt", ".java"]) });
  const servicesBaseFiles = await waitFilesTs(servicesDir);
  const baseA = androidBaseFiles.length;
  const baseS = servicesBaseFiles.length;

  const rngAndroid = mulberry32(
    (hashSeed(`${fragment}:android:${Date.now()}`) ^ ((Math.random() * 0x100000000) >>> 0)) >>> 0
  );
  const rngServices = mulberry32(
    (hashSeed(`${fragment}:services:${Date.now() + 17}`) ^
      ((Math.random() * 0x100000000) >>> 0)) >>>
      0
  );

  const { addA, addS } = pickAdds(baseA, baseS, opts, rngAndroid, rngServices);

  // addN includes hub file. Need at least 1 (hub only).
  const androidUnitCount = Math.max(0, addA - 1);
  const servicesUnitCount = Math.max(0, addS - 1);

  const usedAndroid = new Set();
  const usedServices = new Set();
  const androidWords = pickUnique(ANDROID_WORDS, androidUnitCount, rngAndroid, usedAndroid);
  const servicesWords = pickUnique(SERVICES_WORDS, servicesUnitCount, rngServices, usedServices);

  const hubClass = `D${fragment}DecoyHub`;
  const hubFn = `${fragment}DecoyHubTouch`;
  const hubFileBase = `${fragment}DecoyHub`;

  const androidUnits = [];
  for (let i = 0; i < androidUnitCount; i++) {
    const word = androidWords[i];
    const className = `D${fragment}${word}${String(i + 1).padStart(2, "0")}`;
    const fileName = `${className}.kt`;
    await fs.writeFile(
      path.join(helperDir, fileName),
      buildAndroidUnit(helperPackage, className, fragment),
      "utf8"
    );
    androidUnits.push({ className, fileName });
  }
  await fs.writeFile(
    path.join(helperDir, `${hubClass}.kt`),
    buildAndroidHub(helperPackage, hubClass, androidUnits),
    "utf8"
  );
  await wireMainApplication(mainAppPath, helperPackage, hubClass);

  const servicesUnits = [];
  for (let i = 0; i < servicesUnitCount; i++) {
    const word = servicesWords[i];
    const fileBase = `${fragment}${word}${String(i + 1).padStart(2, "0")}`;
    const fnName = `${fileBase}Touch`;
    await fs.writeFile(
      path.join(servicesDir, `${fileBase}.ts`),
      buildServicesUnit(fnName, fragment),
      "utf8"
    );
    servicesUnits.push({ fileBase, fnName });
  }
  await fs.writeFile(
    path.join(servicesDir, `${hubFileBase}.ts`),
    buildServicesHub(hubFn, servicesUnits),
    "utf8"
  );

  const relImport = "./" + hubFileBase;
  await wireInitFlow(initFlowPath, hubFn, relImport);

  const androidFinal = (await walkFiles(javaRoot, { exts: new Set([".kt", ".java"]) })).length;
  const servicesFinal = (await waitFilesTs(servicesDir)).length;

  if (androidFinal === servicesFinal) {
    return {
      ok: false,
      details: `decoy counts still equal (${androidFinal}); retry or widen ranges in meta.decoy`,
    };
  }

  return {
    ok: true,
    details:
      `android ${baseA}+${addA}→${androidFinal} @ ${helperPackage}, services ${baseS}+${addS}→${servicesFinal}` +
      ` (gap ${Math.abs(androidFinal - servicesFinal)}; purged a=${removedAndroid} s=${removedServices})` +
      splitDetails,
    androidFinal,
    servicesFinal,
    fragment,
  };
}

async function waitFilesTs(servicesDir) {
  return walkFiles(servicesDir, { exts: new Set([".ts", ".tsx"]) });
}

module.exports = {
  generateProjectDecoys,
  buildAndroidUnit,
  buildServicesUnit,
  servicesTouchLines,
  unitSeed,
  DECOY_MARKER,
};
