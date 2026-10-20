"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

function exportsOf(file) {
  const t = fs.readFileSync(file, "utf8");
  const names = new Set();
  const re =
    /export (?:async )?function (\w+)|export const (\w+)|export class (\w+)|export type (\w+)|export \{([^}]+)\}/g;
  let m;
  while ((m = re.exec(t))) {
    if (m[1] || m[2] || m[3] || m[4]) names.add(m[1] || m[2] || m[3] || m[4]);
    if (m[5])
      m[5].split(",").forEach((s) => {
        const n = s.trim().split(/\s+as\s+/)[0].trim();
        if (n) names.add(n);
      });
  }
  return names;
}

function importsFrom(file) {
  const t = fs.readFileSync(file, "utf8");
  const out = [];
  const re =
    /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+['"](\.[^'"]+)['"]/g;
  let m;
  while ((m = re.exec(t))) {
    const spec = m[3];
    const names = (m[1] || m[2] || "")
      .split(",")
      .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    out.push({ spec, names });
  }
  return out;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "android" || e.name === ".git") continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, acc);
    else if (/\.(tsx?)$/.test(e.name)) acc.push(f);
  }
  return acc;
}

function resolveSpec(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  return [base + ".ts", base + ".tsx", path.join(base, "index.ts"), path.join(base, "index.tsx")].find((x) =>
    fs.existsSync(x)
  );
}

function stubFor(name) {
  if (/HashMix|ByteFold|StrHash|CharCodeSum|RevStr|TrimLen/.test(name) || /Fold$/.test(name) && /Str/.test(name)) {
    if (/RevStr/.test(name)) {
      return `export function ${name}(s: string): string {\n  return s.split('').reverse().join('');\n}\n`;
    }
    return `export function ${name}(s: string): number {\n  let h = 19;\n  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) & 65535;\n  return h;\n}\n`;
  }
  if (/SumOdds|EvenCount|OddCount|RangeSpan|RangeValue|MinValue|MaxValue|MeanVal|PowSum|SumDiff|XorFold|SumSquares|DotFold|ProductFold|FoldRange|RotSum/.test(name)) {
    return `export function ${name}(nums: number[]): number {\n  let acc = 0;\n  for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;\n  return acc;\n}\n`;
  }
  if (/CountTruthy/.test(name)) {
    return `export function ${name}(flags: boolean[]): number {\n  let n = 0;\n  for (let i = 0; i < flags.length; i++) if (flags[i]) n++;\n  return n;\n}\n`;
  }
  if (/ConcatLen|JoinLen|StrLenSum/.test(name)) {
    return `export function ${name}(parts: string[]): number {\n  let n = 0;\n  for (let i = 0; i < parts.length; i++) n += parts[i].length;\n  return n;\n}\n`;
  }
  if (/BoolOr|BoolAnd|BoolXor/.test(name)) {
    const op = /Xor/.test(name) ? "a !== b" : /And/.test(name) ? "a && b" : "a || b";
    return `export function ${name}(a: boolean, b: boolean): boolean {\n  return ${op};\n}\n`;
  }
  if (/IsEven/.test(name)) {
    return `export function ${name}(n: number): boolean {\n  return (n & 1) === 0;\n}\n`;
  }
  if (/PrefixLen/.test(name)) {
    return `export function ${name}(s: string, n: number): number {\n  return Math.min(s.length, n);\n}\n`;
  }
  if (/ClampSpan/.test(name)) {
    return `export function ${name}(n: number, lo: number, hi: number): number {\n  return n < lo ? lo : n > hi ? hi : n;\n}\n`;
  }
  if (/LerpVal/.test(name)) {
    return `export function ${name}(a: number, b: number, t: number): number {\n  return a + (b - a) * t;\n}\n`;
  }
  // two-number math
  return `export function ${name}(a: number, b: number): number {\n  const m = b || 1;\n  return ((a % m) + m) % m;\n}\n`;
}

function stripHelperVoids(text) {
  return text.replace(
    /(export\s+)?function\s+(\w*ObfV\d+\w*|\w*(?:MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)\w*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{[^\n]*\n(?:[ \t]*void\s+[^\n]+\n)*/g,
    (full) => full.replace(/\n[ \t]*void\s+[^\n]+/g, "").replace(/\{[ \t]*void[^\n]+/, "{")
  );
}

function main() {
  const files = [
    ...walk(path.join(ROOT, "services")),
    ...walk(path.join(ROOT, "Layouts")),
    path.join(ROOT, "App.tsx"),
  ];
  const missingByTarget = new Map();
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    for (const imp of importsFrom(f)) {
      const cand = resolveSpec(f, imp.spec);
      if (!cand) {
        console.log("MISSING FILE", path.relative(ROOT, f), imp.spec);
        continue;
      }
      const ex = exportsOf(cand);
      for (const n of imp.names) {
        if (!ex.has(n)) {
          const arr = missingByTarget.get(cand) || [];
          arr.push(n);
          missingByTarget.set(cand, arr);
          console.log("missing export", n, "in", path.relative(ROOT, cand), "from", path.relative(ROOT, f));
        }
      }
    }
  }

  for (const [target, names] of missingByTarget) {
    let t = fs.readFileSync(target, "utf8");
    const uniq = [...new Set(names)];
    const block = "\n/* restored-exports */\n" + uniq.map(stubFor).join("\n");
    // insert before obfuscation-batch:v21 if present
    const idx = t.indexOf("/* obfuscation-batch:v21 */");
    if (idx >= 0) t = t.slice(0, idx) + block + "\n" + t.slice(idx);
    else t += block;
    t = stripHelperVoids(t);
    fs.writeFileSync(target, t);
    console.log("restored", uniq.length, "into", path.relative(ROOT, target));
  }

  // strip remaining helper-internal voids in services
  for (const f of walk(path.join(ROOT, "services"))) {
    const orig = fs.readFileSync(f, "utf8");
    const next = stripHelperVoids(orig);
    if (next !== orig) {
      fs.writeFileSync(f, next);
      console.log("stripped voids", path.relative(ROOT, f));
    }
  }
}

main();
