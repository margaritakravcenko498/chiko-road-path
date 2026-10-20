"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SKIP = new Set(["node_modules", "build", "Pods", ".git"]);

function walk(dir, acc = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (/\.tsx?$/.test(e.name)) acc.push(full);
  }
  return acc;
}

function repair(text) {
  let n = 0;
  let t = text;

  t = t.replace(
    /(export\s+)?function\s+(\w+)\(nums:\s*number\[\]\):\s*number\s*\{[\s\S]*?return n % 2 !== 0;[\s\S]*?return (\w+) \+ (\w+)(?: \* (\d+))?;[\s\S]*?\}, 0\);\s*\}/g,
    (full, exp, name, a, b, factor) => {
      if (!/ObfV\d+|SumOdds|FoldRange/.test(name) && !/SumOdds/.test(name)) {
        // still reconstruct if clearly broken
        if (!full.includes("return n % 2")) return full;
      }
      n++;
      const mul = factor ? ` * ${factor}` : "";
      return `${exp || ""}function ${name}(nums: number[]): number {\nreturn nums.filter((n) => n % 2 !== 0).reduce((${a}, ${b}) => ${a} + ${b}${mul}, 0);\n}`;
    }
  );

  // strip remaining void Obf lines that sit inside helper function first lines: `{  void FooObfV`
  t = t.replace(
    /(function\s+\w*ObfV\d+\w*\s*\([^)]*\)\s*(?::\s*[^{]+)?\{)\s*void\s+[^\n]+/g,
    (full, head) => {
      n++;
      return head;
    }
  );

  return { t, n };
}

function main() {
  const files = [...walk(path.join(ROOT, "services")), ...walk(path.join(ROOT, "Layouts"))];
  let changed = 0;
  for (const f of files) {
    const orig = fs.readFileSync(f, "utf8");
    const { t, n } = repair(orig);
    if (t !== orig) {
      fs.writeFileSync(f, t);
      changed++;
      console.log("fixed", path.relative(ROOT, f), n);
    }
  }
  console.log("files", changed);
}

main();
