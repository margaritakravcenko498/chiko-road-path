const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "build") continue;
      walk(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function hash(name) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 16777619);
  return h >>> 0;
}

function argsFor(params, lang, name) {
  const h = hash(name);
  const a = 3 + (h % 40);
  const b = 3 + ((h >>> 8) % 40);
  const c = 3 + ((h >>> 16) % 28);
  const str = String.fromCharCode(97 + (h % 26)) + (2 + ((h >>> 5) % 8));
  if (/IntArray|int\[\]|number\[\]/.test(params)) {
    if (lang === "ts") return `[${a}, ${b}, ${c}]`;
    if (lang === "kt") return `intArrayOf(${a}, ${b}, ${c})`;
    return `new int[]{${a}, ${b}, ${c}}`;
  }
  if (/String|string/.test(params)) {
    return lang === "ts" ? `'${str}'` : `"${str}"`;
  }
  return `${a}, ${b}`;
}

function defs(src) {
  const found = [];
  const re = /(?:function|fun|int)\s+([A-Za-z_][A-Za-z0-9_]*ObfV25[A-Za-z0-9_]*)\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1];
    if (src.split(name).length - 1 < 2) found.push({ name, params: m[2] });
  }
  return found;
}

function langOf(file) {
  if (file.endsWith(".kt")) return "kt";
  if (file.endsWith(".java")) return "java";
  return "ts";
}

const files = [
  ...walk(path.join(ROOT, "services"), new Set([".ts", ".tsx"])),
  ...walk(path.join(ROOT, "Layouts", "Game"), new Set([".ts", ".tsx"])),
  ...walk(path.join(ROOT, "android", "app", "src", "main", "java"), new Set([".kt", ".java"])),
];

let touched = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("interface ") && file.endsWith(".java")) continue;
  const missing = defs(src);
  if (!missing.length) continue;
  const lang = langOf(file);
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  const calls = missing.map((item) => `${item.name}(${argsFor(item.params, lang, item.name)})`);
  let addition = "";
  if (lang === "ts") {
    addition = `${nl}${calls.map((call) => `void ${call};`).join(nl)}${nl}`;
    fs.writeFileSync(file, src.replace(/\s*$/, "") + addition);
  } else if (lang === "kt") {
    addition = `${nl}@Suppress("UNUSED_VARIABLE") private val ${FRAG}BootV25 = ${calls.join(" xor ")}${nl}`;
    fs.writeFileSync(file, src.replace(/\s*$/, "") + addition);
  } else {
    const joiner = " ^ ";
    const field = `${nl}@SuppressWarnings("unused") private static final int ${FRAG}BootV25 = ${calls.join(joiner)};${nl}`;
    const idx = src.lastIndexOf("}");
    if (idx < 0) continue;
    fs.writeFileSync(file, src.slice(0, idx) + field + src.slice(idx));
  }
  touched += 1;
}
console.log(`wired ${touched} files`);
