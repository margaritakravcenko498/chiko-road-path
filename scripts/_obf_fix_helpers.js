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
  let t = text;
  let n = 0;

  t = t.replace(
    /(export\s+)?function\s+(\w+)\(nums:\s*number\[\]\):\s*number\s*\{\s*return n % 2 !== 0;\s*\}\)\.reduce\(\((\w+),\s*(\w+)\)\s*=>\s*\{(?:void[^\n]*\n)*\s*return \3 \+ \4(?: \* (\d+))?;\s*\}, 0\);\s*\}/g,
    (_, exp, name, a, b, factor) => {
      n++;
      const mul = factor ? ` * ${factor}` : "";
      return `${exp || ""}function ${name}(nums: number[]): number {\nreturn nums.filter((n) => n % 2 !== 0).reduce((${a}, ${b}) => ${a} + ${b}${mul}, 0);\n}`;
    }
  );

  t = t.replace(
    /(export\s+)?function\s+(\w+)\(nums:\s*number\[\]\):\s*number\s*\{\s*return acc \+ n;\s*\}, 0\);\s*\}/g,
    (_, exp, name) => {
      n++;
      return `${exp || ""}function ${name}(nums: number[]): number {\nreturn nums.reduce((acc, n) => acc + n, 0);\n}`;
    }
  );

  t = t.replace(
    /(export\s+)?function\s+(\w+)\(s:\s*string\):\s*number\s*\{\s*return \((\w+) \+ (\w+)\.charCodeAt\(0\) \* (\d+)\) % (\d+);\s*\}, 0\);\s*\}/g,
    (_, exp, name, a, c, mul, mod) => {
      n++;
      return `${exp || ""}function ${name}(s: string): number {\nreturn Array.from(s).reduce((${a}, ${c}) => (${a} + ${c}.charCodeAt(0) * ${mul}) % ${mod}, 0);\n}`;
    }
  );

  // leftover void calls glued to reduce arrows inside helpers
  t = t.replace(
    /\.reduce\(\((\w+),\s*(\w+)\)\s*=>\s*\{(?:void[^\n]*\n)+\s*return ([^;]+);/g,
    (_, a, b, expr) => {
      n++;
      return `.reduce((${a}, ${b}) => ${expr};`.replace(/;$/, "");
    }
  );

  return { t, n };
}

function main() {
  const files = [
    ...walk(path.join(ROOT, "services")),
    ...walk(path.join(ROOT, "Layouts")),
  ];
  let filesChanged = 0;
  let fixes = 0;
  for (const f of files) {
    const orig = fs.readFileSync(f, "utf8");
    const { t, n } = repair(orig);
    if (t !== orig) {
      fs.writeFileSync(f, t);
      filesChanged++;
      fixes += n;
      console.log("fixed", path.relative(ROOT, f), n);
    }
  }
  console.log("files", filesChanged, "ops", fixes);
}

main();
