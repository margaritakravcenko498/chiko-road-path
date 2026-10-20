"use strict";
const fs = require("fs");
const path = require("path");
const files = [
  "services/UtiichyikowrdfpagthmslServicePart01.ts",
  "services/UtilServicePart02ichyikowrdfpagthms.ts",
  "services/initiichyikowrdfpagthmsalizationFlowPart01.ts",
  "services/constants/constntsVariablePaichyikowrdfpagthmsrt01.ts",
];
const ROOT = path.resolve(__dirname, "..");

function impl(name) {
  if (/ashMix|yteFold|StrHash|CharCode|RevStr|TrimLen/.test(name)) {
    if (/RevStr/.test(name)) {
      return `export function ${name}(s: string): string {\n  return s.split('').reverse().join('');\n}`;
    }
    return `export function ${name}(s: string): number {\n  let h = 19;\n  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) & 65535;\n  return h;\n}`;
  }
  if (/umOdds|venCount|ddCount|angeSpan|angeValue|inValue|axValue|eanVal|owSum|umDiff|orFold|umSquares|otFold|roductFold|oldRange|otSum|ountTruthy/.test(name)) {
    if (/ountTruthy/.test(name)) {
      return `export function ${name}(flags: boolean[]): number {\n  let n = 0;\n  for (let i = 0; i < flags.length; i++) if (flags[i]) n++;\n  return n;\n}`;
    }
    return `export function ${name}(nums: number[]): number {\n  let acc = 0;\n  for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;\n  return acc;\n}`;
  }
  if (/oncatLen|oinLen|trLenSum/.test(name)) {
    return `export function ${name}(parts: string[]): number {\n  let n = 0;\n  for (let i = 0; i < parts.length; i++) n += parts[i].length;\n  return n;\n}`;
  }
  if (/oolOr|oolAnd|oolXor/.test(name)) {
    const op = /Xor/.test(name) ? "a !== b" : /And/.test(name) ? "a && b" : "a || b";
    return `export function ${name}(a: boolean, b: boolean): boolean {\n  return ${op};\n}`;
  }
  if (/sEven/.test(name)) {
    return `export function ${name}(n: number): boolean {\n  return (n & 1) === 0;\n}`;
  }
  if (/refixLen/.test(name)) {
    return `export function ${name}(s: string, n: number): number {\n  return Math.min(s.length, n);\n}`;
  }
  if (/lampSpan/.test(name)) {
    return `export function ${name}(n: number, lo: number, hi: number): number {\n  return n < lo ? lo : n > hi ? hi : n;\n}`;
  }
  if (/erpVal/.test(name)) {
    return `export function ${name}(a: number, b: number, t: number): number {\n  return a + (b - a) * t;\n}`;
  }
  return `export function ${name}(n: number, m: number): number {\n  const span = (m % 17) + 2;\n  const x = n % span;\n  return x < 0 ? x + span : x;\n}`;
}

for (const rel of files) {
  const f = path.join(ROOT, rel);
  let t = fs.readFileSync(f, "utf8");
  const idx = t.indexOf("/* restored-exports */");
  if (idx < 0) continue;
  const after = t.slice(idx);
  const names = [];
  const re = /export function (\w+)\(/g;
  let m;
  while ((m = re.exec(after))) names.push(m[1]);
  const block = "/* restored-exports */\n" + names.map(impl).join("\n\n") + "\n\n";
  const v21 = t.indexOf("/* obfuscation-batch:v21 */", idx);
  if (v21 < 0) {
    t = t.slice(0, idx) + block;
  } else {
    t = t.slice(0, idx) + block + t.slice(v21);
  }
  fs.writeFileSync(f, t);
  console.log("rewrote stubs", rel, names.length);
}
