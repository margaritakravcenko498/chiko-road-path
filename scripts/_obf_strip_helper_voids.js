const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build") continue;
      walk(full, exts, out);
    } else if (exts.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function isHelperFn(name) {
  if (/GameMixSeed|GameFoldRange|GameClampSpan/.test(name)) return true;
  if (/HashMix|SumOdds|ClampMod|ShiftXor|ByteFold/.test(name)) return true;
  if (name.includes("Obf")) return true;
  return false;
}

let files = 0;
let hits = 0;
for (const dir of ["services", "Layouts/Game"]) {
  for (const file of walk(path.join(ROOT, dir), new Set([".ts", ".tsx"]))) {
    let c = fs.readFileSync(file, "utf8");
    const next = c.replace(
      /(\bfunction\s+)([A-Za-z_][\w]*)(\s*\([^)]*\)\s*(?::\s*[^;{]+)?\{)\s*((?:void\s+[A-Za-z_][\w]*\([^;]*\);\s*)+)/g,
      (full, fnKw, name, sig, voids) => {
        if (!isHelperFn(name)) return full;
        hits++;
        return fnKw + name + sig + "\n";
      }
    );
    if (next !== c) {
      fs.writeFileSync(file, next, "utf8");
      files++;
    }
  }
}
console.log(JSON.stringify({ files, hits }, null, 2));
