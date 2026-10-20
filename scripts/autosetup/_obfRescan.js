const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const root = path.resolve(__dirname, "..", "..");
const javaRoot = path.join(root, "android", "app", "src", "main", "java");

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

function braceBalance(code) {
  let depth = 0;
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
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
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  return depth;
}

const typeToFuns = new Map();
const files = walk(javaRoot).filter((f) => /\.(kt|java)$/.test(f));
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("autosetup-decoy") || text.includes("dex-lanes") || file.includes("rnobfuscator")) continue;
  const types = [];
  const tre = /\b(?:object|class|interface)\s+([A-Za-z_]\w*)/g;
  let m;
  while ((m = tre.exec(text))) types.push(m[1]);
  const funs = new Set();
  const fre = /\bfun\s+([A-Za-z_]\w*)\s*\(/g;
  while ((m = fre.exec(text))) funs.add(m[1]);
  for (const t of types) {
    if (!typeToFuns.has(t)) typeToFuns.set(t, new Set());
    for (const fn of funs) typeToFuns.get(t).add(fn);
  }
}

const unqualified = [];
const qualified = [];
let unbalanced = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  if (text.includes("autosetup-decoy") || text.includes("dex-lanes") || rel.includes("rnobfuscator")) continue;
  const depth = braceBalance(text);
  if (depth !== 0) {
    unbalanced++;
    console.log("UNBALANCED", depth, rel);
  }
  const local = new Set();
  const fre = /\bfun\s+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = fre.exec(text))) local.add(m[1]);
  const cre = /(?:([A-Za-z_]\w*)\s*\.\s*)?([A-Za-z_]\w*ObfV\d+\w*)\s*\(/g;
  const seen = new Set();
  while ((m = cre.exec(text))) {
    const owner = m[1];
    const name = m[2];
    const before = text.slice(Math.max(0, m.index - 12), m.index);
    if (/\bfun\s*$/.test(before)) continue;
    const key = `${owner || ""}|${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!owner) {
      if (!local.has(name)) unqualified.push(`${rel}: ${name}`);
    } else if (owner !== "Suppress") {
      const set = typeToFuns.get(owner);
      if (!set || !set.has(name)) qualified.push(`${rel}: ${owner}.${name}`);
    }
  }
}
console.log("unqualified", unqualified.length);
for (const line of unqualified.slice(0, 30)) console.log(line);
console.log("qualified", qualified.length);
for (const line of qualified.slice(0, 30)) console.log(line);
console.log("unbalanced", unbalanced);

const tsFiles = [...walk(path.join(root, "services")), ...walk(path.join(root, "Layouts", "Game"))].filter((f) =>
  /\.(ts|tsx)$/.test(f)
);
let bad = 0;
let voidInHelper = 0;
for (const file of tsFiles) {
  const text = fs.readFileSync(file, "utf8");
  try {
    const ast = parser.parse(text, { sourceType: "module", plugins: ["typescript", "jsx"] });
    const walkAst = (node, visit) => {
      if (!node || typeof node !== "object") return;
      if (node.type) visit(node);
      for (const key of Object.keys(node)) {
        if (key === "loc" || key === "range") continue;
        const value = node[key];
        if (Array.isArray(value)) for (const item of value) if (item && item.type) walkAst(item, visit);
        else if (value && value.type) walkAst(value, visit);
      }
    };
    walkAst(ast, (node) => {
      const isFn = node.type === "FunctionDeclaration" || node.type === "FunctionExpression";
      if (!isFn || !node.id || !node.body || node.body.type !== "BlockStatement") return;
      if (!/ObfV\d+|MixSeed$|FoldRange$|ClampSpan$/.test(node.id.name)) return;
      for (const stmt of node.body.body) {
        if (stmt.type === "ExpressionStatement" && stmt.expression.type === "UnaryExpression" && stmt.expression.operator === "void") {
          voidInHelper++;
        }
      }
    });
  } catch (error) {
    bad++;
    console.log("PARSE", path.relative(root, file), String(error.message).split("\n")[0]);
  }
}
console.log("ts parse fails", bad, "void in helpers", voidInHelper);
