const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const javaRoot = path.join(root, "android", "app", "src", "main", "java");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "build" || entry.name === "node_modules") continue;
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

function matchParen(code, open) {
  let depth = 0;
  let i = open;
  while (i < code.length) {
    const skipped = skipTrivia(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (code[i] === "(") depth++;
    else if (code[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

function splitArgs(src) {
  const args = [];
  let depth = 0;
  let cur = "";
  let i = 0;
  while (i < src.length) {
    const skipped = skipTrivia(src, i);
    if (skipped > i && (src[i] === '"' || src[i] === "'" || src.startsWith('"""', i))) {
      cur += src.slice(i, skipped);
      i = skipped;
      continue;
    }
    const c = src[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function ktType(arg) {
  if (/^["']/.test(arg)) return "String";
  if (/^intArrayOf\(/.test(arg)) return "IntArray";
  if (/^(true|false)$/.test(arg)) return "Boolean";
  return "Int";
}

function javaType(arg) {
  if (/^["']/.test(arg)) return "String";
  if (/^new\s+int\[\]/.test(arg)) return "int[]";
  if (/^(true|false)$/.test(arg)) return "boolean";
  return "int";
}

function definedNames(text, lang) {
  const names = new Set();
  const re = lang === "kt" ? /\bfun\s+(?:[A-Za-z_]\w*\s*\.\s*)?([A-Za-z_]\w*)\s*\(/g : /\b(?:int|void|boolean|String|long)\s+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return names;
}

function lastTopClose(code) {
  let depth = 0;
  let last = -1;
  let i = 0;
  while (i < code.length) {
    const skipped = skipTrivia(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (code[i] === "{") depth++;
    else if (code[i] === "}") {
      depth--;
      if (depth === 0) last = i;
    }
    i++;
  }
  return last;
}

function ktBody(params) {
  const lines = params.map((p, idx) => {
    if (p === "String") return `    acc = (acc + p${idx}.length * ${3 + idx}) and 65535`;
    if (p === "IntArray") return `    for (n in p${idx}) acc = (acc + n) and 65535`;
    if (p === "Boolean") return `    if (p${idx}) acc = acc xor ${9 + idx}`;
    return `    acc = acc xor p${idx}`;
  });
  return `    var acc = ${11 + params.length}\n${lines.join("\n")}\n    return acc`;
}

function javaBody(params) {
  const lines = params.map((p, idx) => {
    if (p === "String") return `        acc = (acc + p${idx}.length() * ${3 + idx}) & 65535;`;
    if (p === "int[]") return `        for (int n : p${idx}) acc = (acc + n) & 65535;`;
    if (p === "boolean") return `        if (p${idx}) acc = acc ^ ${9 + idx};`;
    return `        acc = acc ^ p${idx};`;
  });
  return `        int acc = ${11 + params.length};\n${lines.join("\n")}\n        return acc;`;
}

const files = walk(javaRoot).filter((f) => /\.(kt|java)$/.test(f));
let added = 0;
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (rel.includes("rnobfuscator") || text.includes("autosetup-decoy") || text.includes("dex-lanes")) continue;
  const lang = file.endsWith(".kt") ? "kt" : "java";
  const defs = definedNames(text, lang);
  const wanted = new Map();
  const re = /([A-Za-z_]\w*ObfV\d+\w*)\s*\(/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[1];
    const at = m.index;
    const before = text.slice(Math.max(0, at - 20), at);
    if (/\bfun\s+$/.test(before) || /\b(?:int|void|boolean|String)\s+$/.test(before)) continue;
    if (/\.\s*$/.test(before)) continue;
    if (defs.has(name) || wanted.has(name)) continue;
    const open = text.indexOf("(", at);
    const close = matchParen(text, open);
    if (close < 0) continue;
    const args = splitArgs(text.slice(open + 1, close));
    const types = args.map((arg) => (lang === "kt" ? ktType(arg) : javaType(arg)));
    wanted.set(name, types);
    defs.add(name);
  }
  if (!wanted.size) continue;
  const chunks = [];
  for (const [name, types] of wanted) {
    if (lang === "kt") {
      const params = types.map((t, i) => `p${i}: ${t}`).join(", ");
      chunks.push(`private fun ${name}(${params}): Int {\n${ktBody(types)}\n}\n`);
    } else {
      const params = types.map((t, i) => `${t} p${i}`).join(", ");
      chunks.push(
        `    @SuppressWarnings("unused")\n    private static int ${name}(${params}) {\n${javaBody(types)}\n    }\n`
      );
    }
    added++;
  }
  if (lang === "kt") {
    if (!text.endsWith("\n")) text += "\n";
    text += "\n" + chunks.join("\n");
  } else {
    const close = lastTopClose(text);
    if (close < 0) {
      console.log("no class close", rel);
      continue;
    }
    text = text.slice(0, close) + "\n" + chunks.join("\n") + text.slice(close);
  }
  fs.writeFileSync(file, text);
  console.log("stubbed", rel, wanted.size);
}
console.log("added", added);
