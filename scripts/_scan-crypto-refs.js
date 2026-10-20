const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "services");
const files = fs.readdirSync(dir).filter((f) => f.startsWith("Crypto") && f.endsWith(".ts"));
const exportsByFile = {};
const allExports = new Map();
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  const names = [...text.matchAll(/^(?:export )?function ([A-Za-z0-9_]+)/gm)].map((m) => m[1]);
  exportsByFile[f] = new Set(names);
  for (const n of names) {
    if (!allExports.has(n)) allExports.set(n, []);
    allExports.get(n).push(f);
  }
}
const host = "CrichyikowrdfpagthmsyptoService.ts";
const text = fs.readFileSync(path.join(dir, host), "utf8");
const imported = new Set(
  [...text.matchAll(/import\s*\{([^}]+)\}\s*from\s*'([^']+)'/g)].flatMap((m) =>
    m[1].split(",").map((s) => s.trim()).filter(Boolean)
  )
);
const local = exportsByFile[host];
const skip = new Set(["if", "for", "while", "switch", "catch", "return", "function", "void", "Uint8Array", "TextEncoder", "TextDecoder", "JSON", "Math", "Promise", "Array", "Object", "String", "Number", "Error", "console", "setTimeout", "Buffer", "Date"]);
const calls = [...text.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((m) => m[1]);
const uniq = [...new Set(calls)];
const missing = uniq.filter((n) => !imported.has(n) && !local.has(n) && !skip.has(n));
for (const n of missing) {
  const where = allExports.get(n);
  console.log((where ? where.join(",") : "NOWHERE") + " :: " + n);
}
const importRe = /import\s*\{([^}]+)\}\s*from\s*'\.\/([^']+)'/g;
let im;
while ((im = importRe.exec(text))) {
  const names = im[1].split(",").map((s) => s.trim()).filter(Boolean);
  const file = im[2].endsWith(".ts") ? im[2] : im[2] + ".ts";
  const set = exportsByFile[file];
  if (!set) {
    console.log("NO FILE " + file);
    continue;
  }
  for (const n of names) {
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    if (!new RegExp("export function " + n + "\\b").test(src)) console.log("NOT EXPORTED " + n + " from " + file);
  }
}
