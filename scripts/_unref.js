const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

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

const files = [
  ...walk(path.join(ROOT, "services"), new Set([".ts", ".tsx"])),
  ...walk(path.join(ROOT, "Layouts", "Game"), new Set([".ts", ".tsx"])),
  ...walk(path.join(ROOT, "android", "app", "src", "main", "java"), new Set([".kt", ".java"])),
];

const missing = [];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const names = new Set();
  const re = /(?:function|fun|int)\s+([A-Za-z_][A-Za-z0-9_]*ObfV25[A-Za-z0-9_]*)/g;
  let m;
  while ((m = re.exec(src))) names.add(m[1]);
  for (const name of names) {
    const calls = src.split(name).length - 1;
    if (calls < 2) missing.push(`${path.relative(ROOT, file)} :: ${name} refs=${calls}`);
  }
}
console.log(missing.slice(0, 40).join("\n"));
console.log("missing", missing.length);
