const fs = require("fs");
const p = "services/initializichyikowrdfpagthmsationShared.ts";
let s = fs.readFileSync(p, "utf8");
const defs = new Set();
const defRe = /function\s+([A-Za-z0-9_]+)\s*\(/g;
let m;
while ((m = defRe.exec(s))) defs.add(m[1]);
const imported = new Set();
const impRe = /import\s+(?:type\s+)?(?:\{([^}]+)\}|([A-Za-z0-9_]+))/g;
while ((m = impRe.exec(s))) {
  const block = m[1] || m[2] || "";
  for (const part of block.split(",")) {
    const name = part.trim().split(/\s+as\s+/).pop().trim();
    if (name) imported.add(name);
  }
}
const callRe = /void\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/g;
const missing = new Map();
while ((m = callRe.exec(s))) {
  const name = m[1];
  if (defs.has(name) || imported.has(name) || missing.has(name)) continue;
  missing.set(name, m[2].trim());
}
function seedOf(name) {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function kindOf(name, args) {
  if (/HashMix|HashM/.test(name)) return "hash";
  if (/ByteFold/.test(name)) return "byte";
  if (/ShiftXor|MixSeed/.test(name)) return "shift";
  if (/SumOdds|FoldRange/.test(name)) return "sum";
  if (/ClampSpan/.test(name)) return "span";
  if (/Clamp/.test(name)) return "clamp";
  if (args.startsWith("'") || args.startsWith('"')) return "hash";
  if (args.startsWith("[")) return "sum";
  const parts = args.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length >= 3) return "span";
  if (parts.length === 2) return "clamp";
  return "hash";
}
function body(name, kind) {
  const seed = seedOf(name);
  const a = (seed % 80) + 3;
  const b = (seed % 23) + 3;
  const c = (seed % 700) + 97;
  const sh = (seed % 7) + 1;
  const mask = (seed % 60000) + 255;
  if (kind === "hash") {
    return `function ${name}(s: string): number {\n  let h = ${a};\n  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * ${b}) % ${c};\n  return h;\n}`;
  }
  if (kind === "byte") {
    return `function ${name}(s: string): number {\n  let x = ${a};\n  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${b}) & ${mask};\n  return x;\n}`;
  }
  if (kind === "shift") {
    return `function ${name}(n: number, k: number): number {\n  const x = (n ^ k) << ${sh};\n  return (x ^ ${a}) & ${mask};\n}`;
  }
  if (kind === "sum") {
    return `function ${name}(nums: number[]): number {\n  let acc = ${a};\n  for (let i = 0; i < nums.length; i++) {\n    const n = nums[i];\n    if ((n & 1) === 0) continue;\n    acc = (acc + n * ${b}) % ${c};\n  }\n  return acc;\n}`;
  }
  if (kind === "span") {
    return `function ${name}(n: number, lo: number, hi: number): number {\n  const span = hi > lo ? hi - lo : ${b};\n  const x = ((n - lo) % span + span) % span;\n  return lo + x;\n}`;
  }
  return `function ${name}(n: number, m: number): number {\n  const span = (m % ${b}) + ${a % 9 + 1};\n  const x = n % span;\n  return x < 0 ? x + span : x;\n}`;
}
const chunks = [];
for (const [name, args] of missing) chunks.push(body(name, kindOf(name, args)));
if (!s.endsWith("\n")) s += "\n";
s += "\n" + chunks.join("\n\n") + "\n";
fs.writeFileSync(p, s);
console.log("added", chunks.length);
