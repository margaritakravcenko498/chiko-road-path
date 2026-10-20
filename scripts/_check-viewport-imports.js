const fs = require("fs");
const src = fs.readFileSync("services/ViewportHichyikowrdfpagthmsost.ts", "utf8");
const imports = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'([^']+)'/g)];
const imported = new Map();
for (const m of imports) {
  const names = m[1].split(",").map((s) => s.trim()).filter(Boolean);
  for (const n of names) imported.set(n, m[2]);
}
const missingExport = [];
for (const [name, rel] of imported) {
  const p = "services/" + rel.replace(/^\.\//, "") + ".ts";
  const body = fs.readFileSync(p, "utf8");
  if (!body.includes("function " + name) && !body.includes("const " + name)) {
    missingExport.push(name + " <- " + p);
  }
}
const called = new Set(
  [...src.matchAll(/void\s+([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1]),
);
const notImported = [...called].filter(
  (n) => !imported.has(n) && !src.includes("function " + n),
);
console.log("bad exports", missingExport.length ? missingExport.join("\n") : "none");
console.log("unbound calls", notImported.length ? notImported.join(", ") : "none");
