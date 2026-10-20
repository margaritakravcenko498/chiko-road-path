const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const root = path.resolve(__dirname, "..", "..");

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

function parse(file, text) {
  return parser.parse(text, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: true,
  });
}

function resolveModule(fromFile, spec) {
  if (!spec.startsWith(".")) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  return candidates.find((c) => fs.existsSync(c)) || null;
}

const tsFiles = [
  ...walk(path.join(root, "services")),
  ...walk(path.join(root, "Layouts", "Game")),
  ...walk(path.join(root, "Layouts")).filter((f) => !f.includes(`${path.sep}Game${path.sep}`)),
].filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".d.ts"));

const extra = ["App.tsx", "index.js"].map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));
const files = [...new Set([...tsFiles, ...extra])];

const parsed = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  try {
    parsed.set(file, { text, ast: parse(file, text), error: null });
  } catch (error) {
    parsed.set(file, { text, ast: null, error: String(error.message).split("\n")[0] });
  }
}

function collectExports(ast) {
  const names = new Set();
  if (!ast) return names;
  for (const node of ast.program.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        if (node.declaration.id) names.add(node.declaration.id.name);
        if (node.declaration.declarations) {
          for (const d of node.declaration.declarations) {
            if (d.id && d.id.type === "Identifier") names.add(d.id.name);
          }
        }
      }
      for (const spec of node.specifiers || []) {
        if (spec.exported && spec.exported.type === "Identifier") names.add(spec.exported.name);
      }
    }
    if (node.type === "ExportDefaultDeclaration") names.add("default");
  }
  return names;
}

const exportsOf = new Map();
for (const [file, info] of parsed) exportsOf.set(file, collectExports(info.ast));

function walkAst(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "range") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) if (item && typeof item.type === "string") walkAst(item, visit);
    } else if (value && typeof value.type === "string") walkAst(value, visit);
  }
}

const importProblems = [];
const unbound = [];
const voidInHelper = [];
const uiHits = [];
const FRAG = "ichyikowrdfpagthms";

for (const [file, info] of parsed) {
  if (!info.ast) {
    console.log("PARSE", path.relative(root, file), info.error);
    continue;
  }
  const localFns = new Set();
  const imported = new Map();
  walkAst(info.ast, (node) => {
    if (node.type === "FunctionDeclaration" && node.id) localFns.add(node.id.name);
    if (node.type === "VariableDeclarator" && node.id && node.id.type === "Identifier") localFns.add(node.id.name);
    if (node.type === "ClassDeclaration" && node.id) localFns.add(node.id.name);
    if (
      (node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression" ||
        node.type === "ObjectMethod" ||
        node.type === "ClassMethod") &&
      node.id &&
      /ObfV\d+|MixSeed|FoldRange|ClampSpan/.test(node.id.name) &&
      node.body &&
      node.body.type === "BlockStatement"
    ) {
      for (const stmt of node.body.body) {
        if (
          stmt.type === "ExpressionStatement" &&
          stmt.expression.type === "UnaryExpression" &&
          stmt.expression.operator === "void"
        ) {
          voidInHelper.push(`${path.relative(root, file)}:${stmt.loc.start.line} ${node.id.name}`);
        }
      }
    }
    if (node.type === "ImportDeclaration" && node.source.value.startsWith(".")) {
      const target = resolveModule(file, node.source.value);
      for (const spec of node.specifiers) {
        if (spec.type === "ImportSpecifier") {
          const importedName = spec.imported.type === "Identifier" ? spec.imported.name : spec.imported.value;
          imported.set(spec.local.name, { importedName, target, spec: node.source.value });
          if (!target) {
            importProblems.push(`${path.relative(root, file)} missing file ${node.source.value}`);
          } else if (importedName !== "default") {
            const ex = exportsOf.get(target);
            if (ex && !ex.has(importedName)) {
              importProblems.push(
                `${path.relative(root, file)}:${spec.loc.start.line} imports ${importedName} not exported by ${path.relative(root, target)}`
              );
            }
          }
        }
      }
    }
    if (node.type === "StringLiteral" && node.value.includes(FRAG) && file.includes(`${path.sep}Game${path.sep}`)) {
      const v = node.value;
      if (v.startsWith(".") || v.includes("/") || v.includes("assets")) return;
      uiHits.push(`${path.relative(root, file)}:${node.loc.start.line} ${JSON.stringify(v).slice(0, 120)}`);
    }
    if (node.type === "JSXText" && node.value.includes(FRAG)) {
      uiHits.push(`${path.relative(root, file)}:${node.loc.start.line} JSX ${JSON.stringify(node.value.trim()).slice(0, 80)}`);
    }
    if (node.type === "TemplateElement" && node.value && node.value.raw && node.value.raw.includes(FRAG) && file.includes(`${path.sep}Game${path.sep}`)) {
      uiHits.push(`${path.relative(root, file)}:${node.loc.start.line} TPL ${JSON.stringify(node.value.raw).slice(0, 80)}`);
    }
  });

  const scope = new Set([...localFns, ...imported.keys()]);
  walkAst(info.ast, (node) => {
    if (node.type !== "CallExpression") return;
    if (node.callee.type !== "Identifier") return;
    const name = node.callee.name;
    if (!/ObfV\d+|ryptHex|ryptBytes|hexToBytes|bytesToHex|gasahupux|colossus/.test(name)) return;
    if (scope.has(name) || localFns.has(name)) return;
    unbound.push(`${path.relative(root, file)}:${node.loc.start.line} ${name}(${node.arguments.length})`);
  });
}

console.log("--- IMPORT PROBLEMS", importProblems.length);
for (const line of importProblems.slice(0, 80)) console.log(line);
console.log("--- UNBOUND", unbound.length);
for (const line of unbound.slice(0, 80)) console.log(line);
console.log("--- VOID IN HELPER", voidInHelper.length);
for (const line of voidInHelper.slice(0, 40)) console.log(line);
console.log("--- UI", uiHits.length);
for (const line of uiHits.slice(0, 40)) console.log(line);
