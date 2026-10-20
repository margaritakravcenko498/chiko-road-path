const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
function walk(d) {
  if (!fs.existsSync(d)) return [];
  if (fs.statSync(d).isFile()) return [d];
  let o = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) o = o.concat(walk(p));
    else if (/\.tsx?$/.test(e.name)) o.push(p);
  }
  return o;
}
const files = [
  ...walk(path.join(root, "services")),
  ...walk(path.join(root, "Layouts", "Game")),
  path.join(root, "App.tsx"),
];
const re = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
let bad = 0;
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  const dir = path.dirname(f);
  let m;
  const r = new RegExp(re.source, "g");
  while ((m = r.exec(t))) {
    const base = path.resolve(dir, m[1]);
    const cands = [base + ".ts", base + ".tsx", path.join(base, "index.ts"), path.join(base, "index.tsx")];
    if (!cands.some((c) => fs.existsSync(c))) {
      console.log("MISSING", path.relative(root, f), "->", m[1]);
      bad++;
    }
  }
}
console.log("missing", bad);
