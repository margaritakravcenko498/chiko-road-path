const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const root = path.resolve(__dirname, "..", "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "build" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function isHelperName(name) {
  if (!name) return false;
  if (/ObfV\d+/i.test(name)) return true;
  if (/(MixSeed|FoldRange|ClampSpan)$/.test(name)) return true;
  return false;
}

function functionName(node) {
  if (!node) return "";
  if (node.id && node.id.type === "Identifier") return node.id.name;
  if (node.key && node.key.type === "Identifier") return node.key.name;
  if (node.key && node.key.type === "StringLiteral") return String(node.key.value);
  return "";
}

function walkAst(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "range" || key === "leadingComments" || key === "trailingComments") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) if (item && typeof item.type === "string") walkAst(item, visit);
    } else if (value && typeof value.type === "string") walkAst(value, visit);
  }
}

function stripHelperVoids(file) {
  const source = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (error) {
    console.log("PARSE", path.relative(root, file), String(error.message).split("\n")[0]);
    return 0;
  }
  const ranges = [];
  walkAst(ast, (node) => {
    const isFn =
      node.type === "FunctionDeclaration" ||
      node.type === "FunctionExpression" ||
      node.type === "ArrowFunctionExpression" ||
      node.type === "ObjectMethod" ||
      node.type === "ClassMethod" ||
      node.type === "ClassPrivateMethod";
    if (!isFn || !node.body || node.body.type !== "BlockStatement") return;
    let name = functionName(node);
    if (!name && node.type === "ArrowFunctionExpression") return;
    if (!isHelperName(name)) return;
    for (const stmt of node.body.body) {
      if (
        stmt.type === "ExpressionStatement" &&
        stmt.expression.type === "UnaryExpression" &&
        stmt.expression.operator === "void"
      ) {
        let end = stmt.end;
        if (source[end] === "\r") end++;
        if (source[end] === "\n") end++;
        ranges.push([stmt.start, end]);
      }
    }
  });
  if (!ranges.length) return 0;
  ranges.sort((a, b) => b[0] - a[0]);
  let next = source;
  for (const [start, end] of ranges) next = next.slice(0, start) + next.slice(end);
  try {
    parser.parse(next, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (error) {
    console.log("STRIP FAIL", path.relative(root, file), String(error.message).split("\n")[0]);
    return 0;
  }
  fs.writeFileSync(file, next);
  return ranges.length;
}

const tsFiles = [
  ...walk(path.join(root, "services")),
  ...walk(path.join(root, "Layouts", "Game")),
].filter((f) => /\.(ts|tsx)$/.test(f));

let stripped = 0;
let files = 0;
for (const file of tsFiles) {
  const n = stripHelperVoids(file);
  if (n) {
    stripped += n;
    files++;
  }
}
console.log("stripped voids", stripped, "in", files);

const gameFiles = walk(path.join(root, "Layouts", "Game")).filter((f) => /\.(ts|tsx)$/.test(f));
let transformFixes = 0;
let routeFixes = 0;
for (const file of gameFiles) {
  let text = fs.readFileSync(file, "utf8");
  const next = text
    .replace(/\bfowufadekax\b/g, () => {
      transformFixes++;
      return "transform";
    })
    .replace(/(['"])lichyikowrdfpagthmsevels\1/g, (_m, q) => {
      routeFixes++;
      return `${q}levels${q}`;
    })
    .replace(/\[lichyikowrdfpagthmsevels\]/g, () => {
      routeFixes++;
      return "[levels]";
    });
  if (next !== text) fs.writeFileSync(file, next);
}
console.log("transform", transformFixes, "routes", routeFixes);

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

const javaRoot = path.join(root, "android", "app", "src", "main", "java");
const missing = [];
const lambdaSink = [];
const dupFun = [];
for (const file of walk(javaRoot)) {
  if (!/\.(kt|java)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (rel.includes(`rnobfuscator`) || text.includes("autosetup-decoy") || text.includes("dex-lanes")) continue;
  const defs = new Set();
  const defRe = file.endsWith(".kt")
    ? /\bfun\s+(?:[A-Za-z_]\w*\s*\.\s*)?([A-Za-z_]\w*)\s*\(/g
    : /\b(?:int|void|boolean|String|long|float|double)\s+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = defRe.exec(text))) defs.add(m[1]);
  const callRe = /([A-Za-z_]\w*ObfV\d+\w*)\s*\(/g;
  const seen = new Set();
  while ((m = callRe.exec(text))) {
    const name = m[1];
    const before = text.slice(Math.max(0, m.index - 16), m.index);
    if (/\bfun\s+$/.test(before) || /\b(?:int|void|boolean|String)\s+$/.test(before)) continue;
    if (defs.has(name) || seen.has(name)) continue;
    seen.add(name);
    missing.push(`${rel}: ${name}`);
  }
  if (file.endsWith(".kt") && /SinkV\d+\s*=[^\n]*\n\s*(?:\([^)\n]{0,40}\)|[A-Za-z_]\w*)\s*->/.test(text)) {
    lambdaSink.push(rel);
  }
  const funRe = /\bfun\s+([A-Za-z_]\w*)\s*\(/g;
  const counts = new Map();
  while ((m = funRe.exec(text))) counts.set(m[1], (counts.get(m[1]) || 0) + 1);
  for (const [name, count] of counts) {
    if (count > 1 && !/ObfV/.test(name)) dupFun.push(`${rel}: ${name} x${count}`);
  }
}
console.log("kotlin/java missing Obf", missing.length);
for (const line of missing.slice(0, 40)) console.log(line);
console.log("lambda sink", lambdaSink.length);
for (const line of lambdaSink.slice(0, 20)) console.log(line);
console.log("dup fun", dupFun.length);
for (const line of dupFun.slice(0, 20)) console.log(line);
