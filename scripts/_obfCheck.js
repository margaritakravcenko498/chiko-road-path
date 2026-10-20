const fs = require("fs");
const path = require("path");
const parser = require(path.join(process.env.TEMP, "obfparse", "node_modules", "@babel", "parser"));
const { checkProjectPaths } = require("./autosetup/checkPaths");
const ROOT = path.resolve(__dirname, "..");

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build") continue;
      walk(full, exts, out);
    } else if (exts.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

const javaRoot = path.join(ROOT, "android", "app", "src", "main", "java");
let missing = 0;
for (const file of walk(javaRoot, new Set([".kt", ".java"]))) {
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("autosetup-decoy") || text.includes("dex-lanes") || file.includes("rnobfuscator")) continue;
  const defs = new Set();
  const defRe = /\b(?:fun|int)\s+([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = defRe.exec(text))) defs.add(m[1]);
  const callRe = /(?<![.\w])([A-Za-z_]\w*ObfV\w*)\s*\(/g;
  const seen = new Set();
  while ((m = callRe.exec(text))) {
    if (defs.has(m[1]) || seen.has(m[1])) continue;
    seen.add(m[1]);
    missing += 1;
    if (missing <= 15) console.log("KT", path.basename(file), m[1]);
  }
}
console.log("kotlin missing", missing);

let tsMiss = 0;
const tsFiles = [
  ...walk(path.join(ROOT, "services"), new Set([".ts", ".tsx"])),
  ...walk(path.join(ROOT, "Layouts", "Game"), new Set([".ts", ".tsx"])),
];
for (const file of tsFiles) {
  const code = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (err) {
    console.log("PARSE", path.relative(ROOT, file), err.message.split("\n")[0]);
    continue;
  }
  const defined = new Set();
  const imported = new Set();
  const noteDecl = (d) => {
    if (!d) return;
    if (d.type === "FunctionDeclaration" && d.id) defined.add(d.id.name);
    if (d.type === "VariableDeclaration") {
      for (const one of d.declarations) if (one.id && one.id.type === "Identifier") defined.add(one.id.name);
    }
  };
  for (const stmt of ast.program.body) {
    if (stmt.type === "FunctionDeclaration") noteDecl(stmt);
    if (stmt.type === "ExportNamedDeclaration") noteDecl(stmt.declaration);
    if (stmt.type === "ImportDeclaration") {
      for (const spec of stmt.specifiers) {
        if (spec.local) imported.add(spec.local.name);
      }
    }
    if (stmt.type === "VariableDeclaration") noteDecl(stmt);
  }
  const missingNames = new Map();
  const walkAst = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "CallExpression" && node.callee && node.callee.type === "Identifier" && node.callee.name.includes("ObfV")) {
      const name = node.callee.name;
      if (!defined.has(name) && !imported.has(name) && !missingNames.has(name)) missingNames.set(name, node.arguments || []);
    }
    for (const k of Object.keys(node)) {
      if (k === "loc" || k === "start" || k === "end") continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach(walkAst);
      else if (v && typeof v.type === "string") walkAst(v);
    }
  };
  walkAst(ast);
  if (missingNames.size && process.argv.includes("--fix")) {
    const stubs = [];
    for (const [name, args] of missingNames) {
      const kinds = args.map((a) => a.type);
      let sig = "(n: number, k: number): number";
      let body = "  return ((n ^ k) << 2) & 65535;";
      if (kinds.length === 1 && (kinds[0] === "StringLiteral" || kinds[0] === "TemplateLiteral")) {
        sig = "(s: string): number";
        body = "  let h = 3;\n  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;\n  return h;";
      } else if (kinds.length === 1 && kinds[0] === "ArrayExpression") {
        sig = "(nums: number[]): number";
        body = "  let a = 1;\n  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;\n  return a;";
      } else if (kinds.length === 3) {
        sig = "(n: number, lo: number, hi: number): number";
        body = "  return n < lo ? lo : n > hi ? hi : n;";
      }
      stubs.push(`function ${name}${sig} {\n${body}\n}`);
    }
    fs.writeFileSync(file, `${code.replace(/\s*$/, "")}\n\n${stubs.join("\n")}\n`);
  }
  for (const name of missingNames.keys()) {
    tsMiss += 1;
    if (tsMiss <= 15) console.log("TS", path.relative(ROOT, file), name);
  }
}
console.log("ts missing", tsMiss);

checkProjectPaths(ROOT).then((r) => {
  console.log("paths", r.ok, r.problems);
});
