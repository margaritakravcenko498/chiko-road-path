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

function isHelperName(name) {
  return /ObfV\d+/i.test(name) || /(?:MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)/.test(name);
}

function findMatchingBrace(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < text.length && text[i] !== q) {
        if (text[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function reconstructBody(name, params, body) {
  const b = body.replace(/void\s+[^\n;]+;?/g, "").replace(/\s+/g, " ").trim();

  // broken sum-odds remnants
  const odd = /return n % 2 !== 0;[\s\S]*return (\w+) \+ (\w+)(?: \* (\d+))?;/.exec(body);
  if (odd && /nums/.test(params)) {
    const mul = odd[3] ? ` * ${odd[3]}` : "";
    return `\nreturn nums.filter((n) => n % 2 !== 0).reduce((${odd[1]}, ${odd[2]}) => ${odd[1]} + ${odd[2]}${mul}, 0);\n`;
  }

  const fold = /return acc \+ n;/.exec(body);
  if (fold && /nums/.test(params) && body.includes("}, 0)")) {
    return `\nreturn nums.reduce((acc, n) => acc + n, 0);\n`;
  }

  const hash = /return \((\w+) \+ (\w+)\.charCodeAt\(0\) \* (\d+)\) % (\d+);/.exec(body);
  if (hash && /s:\s*string/.test(params) && body.includes("}, 0)")) {
    return `\nreturn Array.from(s).reduce((${hash[1]}, ${hash[2]}) => (${hash[1]} + ${hash[2]}.charCodeAt(0) * ${hash[3]}) % ${hash[4]}, 0);\n`;
  }

  // strip void lines only
  const cleaned = body
    .split("\n")
    .filter((line) => !(/void\s+\w+/.test(line) && /ObfV\d+/.test(line)))
    .join("\n");
  return cleaned;
}

function process(text) {
  const re = /(export\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\{/g;
  const edits = [];
  let m;
  while ((m = re.exec(text))) {
    const name = m[2];
    if (!isHelperName(name)) continue;
    const open = m.index + m[0].length - 1;
    const close = findMatchingBrace(text, open);
    if (close < 0) continue;
    const body = text.slice(open + 1, close);
    const broken =
      body.includes("return n % 2 !== 0") ||
      (body.includes("return acc + n") && body.includes("}, 0)")) ||
      (body.includes("}, 0)") && body.includes("charCodeAt")) ||
      (/void\s+\w+/.test(body) && /ObfV\d+/.test(body));
    if (!broken) continue;
    const neu = reconstructBody(name, m[3] + (m[0].includes(":") ? m[0] : ""), body);
    if (neu !== body) edits.push({ open, close, neu });
  }
  edits.sort((a, b) => b.open - a.open);
  let out = text;
  for (const e of edits) {
    out = out.slice(0, e.open + 1) + e.neu + out.slice(e.close);
  }
  return { out, n: edits.length };
}

function main() {
  const files = [...walk(path.join(ROOT, "services")), ...walk(path.join(ROOT, "Layouts"))];
  let changed = 0;
  for (const f of files) {
    const orig = fs.readFileSync(f, "utf8");
    const { out, n } = process(orig);
    if (out !== orig) {
      fs.writeFileSync(f, out);
      changed++;
      console.log("fixed", path.relative(ROOT, f), n);
    }
  }
  console.log("files", changed);
}

main();
