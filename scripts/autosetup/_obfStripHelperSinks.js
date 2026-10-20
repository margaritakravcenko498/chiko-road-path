const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const javaRoot = path.join(root, "android", "app", "src", "main", "java");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "build") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function skipTrivia(code, i) {
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
    if (c === " " || c === "\t" || c === "\r" || c === "\n") {
      i++;
      continue;
    }
    if (c === "/" && n === "/") {
      const nl = code.indexOf("\n", i);
      i = nl < 0 ? code.length : nl + 1;
      continue;
    }
    if (c === "/" && n === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end < 0 ? code.length : end + 2;
      continue;
    }
    if (code.startsWith('"""', i)) {
      const end = code.indexOf('"""', i + 3);
      i = end < 0 ? code.length : end + 3;
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < code.length) {
        if (code[i] === "\\") {
          i += 2;
          continue;
        }
        if (code[i] === c) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    break;
  }
  return i;
}

function matchBrace(code, open) {
  let depth = 0;
  let i = open;
  while (i < code.length) {
    const skipped = skipTrivia(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (code[i] === "{") depth++;
    else if (code[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

function isSinkLine(line) {
  return /^[ \t]*(?:@Suppress(?:Warnings)?\([^)\n]*\)[ \t]*)?(?:val|final[ \t]+int|int)[ \t]+\w*Sink\w*[ \t]*=/.test(line);
}

let stripped = 0;
let files = 0;
for (const file of walk(javaRoot)) {
  if (!/\.(kt|java)$/.test(file)) continue;
  let text = fs.readFileSync(file, "utf8");
  if (text.includes("autosetup-decoy") || text.includes("dex-lanes") || file.includes("rnobfuscator")) continue;
  const ranges = [];
  const re = file.endsWith(".kt")
    ? /\bfun\s+([A-Za-z_]\w*Obf\w*)\s*\(/g
    : /\b(?:int|void|boolean|String)\s+([A-Za-z_]\w*Obf\w*)\s*\(/g;
  let m;
  while ((m = re.exec(text))) {
    if (!/Obf/.test(m[1]) || !/V\d+/.test(m[1])) continue;
    let i = m.index + m[0].length - 1;
    let depth = 0;
    while (i < text.length) {
      const skipped = skipTrivia(text, i);
      if (skipped > i) {
        i = skipped;
        continue;
      }
      if (text[i] === "(") depth++;
      else if (text[i] === ")") {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
      i++;
    }
    let foundBrace = false;
    while (i < text.length) {
      const skipped = skipTrivia(text, i);
      if (skipped > i) {
        i = skipped;
        continue;
      }
      if (text[i] === "{") {
        foundBrace = true;
        break;
      }
      if (text.startsWith("fun ", i) || text[i] === ";") break;
      i++;
    }
    if (!foundBrace) continue;
    const close = matchBrace(text, i);
    if (close < 0) continue;
    const body = text.slice(i + 1, close);
    const lines = body.split("\n");
    let offset = i + 1;
    for (const line of lines) {
      const lineEnd = offset + line.length;
      if (isSinkLine(line)) {
        let end = lineEnd;
        if (text[end] === "\n") end++;
        ranges.push([offset, end]);
      }
      offset = lineEnd + 1;
    }
  }
  if (!ranges.length) continue;
  ranges.sort((a, b) => b[0] - a[0]);
  for (const [start, end] of ranges) text = text.slice(0, start) + text.slice(end);
  fs.writeFileSync(file, text);
  stripped += ranges.length;
  files++;
}
console.log("stripped helper sinks", stripped, "files", files);
