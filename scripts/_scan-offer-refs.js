const fs = require("fs");
const path = require("path");

function scan(file) {
  const s = fs.readFileSync(file, "utf8");
  const defs = new Set([...s.matchAll(/function\s+([A-Za-z0-9_]+)\s*\(/g)].map((m) => m[1]));
  const imported = new Set();
  const impRe = /import\s+(?:type\s+)?(?:\{([^}]+)\}|([A-Za-z0-9_]+))/g;
  let m;
  while ((m = impRe.exec(s))) {
    const block = m[1] || m[2] || "";
    for (const part of block.split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (name) imported.add(name);
    }
  }
  const missing = new Map();
  const callRe = /void\s+([A-Za-z0-9_]+)\s*\(/g;
  while ((m = callRe.exec(s))) {
    const name = m[1];
    if (!defs.has(name) && !imported.has(name) && !missing.has(name)) missing.set(name, true);
  }
  console.log(path.basename(file), "missing", missing.size);
  for (const n of missing.keys()) console.log(" ", n);
}

for (const f of process.argv.slice(2)) scan(f);
