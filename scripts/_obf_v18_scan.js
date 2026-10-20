const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { checkProjectPaths } = require("./autosetup/checkPaths");
const lib = require("./_obf_v18_lib");

const root = path.resolve(__dirname, "..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build" || ent.name === ".git") continue;
      walk(p, pred, out);
    } else if (pred(p)) out.push(p);
  }
  return out;
}

function parse(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function exportedNames(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const names = new Set();
  let hasDefault = false;
  sf.forEachChild((node) => {
    const mods = node.modifiers || [];
    const exported = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = mods.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (isDefault && exported) hasDefault = true;
    if (ts.isExportAssignment(node)) hasDefault = true;
    if (!exported) return;
    if (node.name && ts.isIdentifier(node.name)) names.add(node.name.text);
    if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) names.add(d.name.text);
      }
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) names.add(el.name.text);
    }
  });
  return { names, hasDefault };
}

function resolveRef(fromFile, spec) {
  if (!spec.startsWith(".")) return "";
  const abs = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    abs,
    abs + ".ts",
    abs + ".tsx",
    abs + ".js",
    abs + ".jsx",
    path.join(abs, "index.ts"),
    path.join(abs, "index.tsx"),
    path.join(abs, "index.js"),
  ];
  return candidates.find((c) => {
    try {
      return fs.statSync(c).isFile();
    } catch {
      return false;
    }
  }) || "";
}

const dirs = [
  path.join(root, "services"),
  path.join(root, "Layouts"),
  path.join(root, "App.tsx"),
  path.join(root, "index.js"),
];
const files = [];
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  if (fs.statSync(dir).isFile()) files.push(dir);
  else walk(dir, (p) => /\.(tsx?|jsx?)$/.test(p), files);
}

const exportCache = new Map();
const broken = [];
const missingNames = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text.startsWith(".")
    ) {
      const resolved = resolveRef(file, node.moduleSpecifier.text);
      if (!resolved) broken.push(`${path.relative(root, file)} -> ${node.moduleSpecifier.text}`);
      else if (ts.isImportDeclaration(node) && node.importClause) {
        if (!exportCache.has(resolved)) exportCache.set(resolved, exportedNames(resolved));
        const info = exportCache.get(resolved);
        const clause = node.importClause;
        if (clause.name && !info.hasDefault) {
          missingNames.push(`${path.relative(root, file)} default from ${node.moduleSpecifier.text}`);
        }
        const b = clause.namedBindings;
        if (b && ts.isNamedImports(b)) {
          for (const el of b.elements) {
            const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
            if (exported === "default") continue;
            if (!info.names.has(exported)) {
              missingNames.push(`${path.relative(root, file)} { ${exported} } from ${node.moduleSpecifier.text}`);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

const gameFiles = walk(path.join(root, "Layouts", "Game"), (p) => /\.tsx?$/.test(p));
const serviceFiles = walk(path.join(root, "services"), (p) => /\.tsx?$/.test(p));
let verifyProblems = 0;
for (const file of [...serviceFiles, ...gameFiles]) {
  const problems = lib.verifyTs(file);
  if (problems.length) {
    verifyProblems += problems.length;
    console.log("VERIFY", path.relative(root, file), problems.slice(0, 8));
  }
}

function braceBalance(text) {
  let d = 0;
  let i = 0;
  let mode = "code";
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (mode === "code") {
      if (c === "/" && n === "/") {
        i += 2;
        while (i < text.length && text[i] !== "\n") i++;
        continue;
      }
      if (c === "/" && n === "*") {
        mode = "block";
        i += 2;
        continue;
      }
      if (c === '"' || c === "'") {
        mode = c;
        i++;
        continue;
      }
      if (c === "{") d++;
      else if (c === "}") d--;
    } else if (mode === "block") {
      if (c === "*" && n === "/") {
        mode = "code";
        i += 2;
        continue;
      }
    } else if (c === "\\") {
      i += 2;
      continue;
    } else if (c === mode) mode = "code";
    i++;
  }
  return d;
}

const javaRoot = path.join(root, "android", "app", "src", "main", "java");
const host = walk(javaRoot, (p) => /\.(kt|java)$/.test(p) && !p.includes(`${path.sep}rnobfuscator${path.sep}`));
const brace = [];
for (const file of host) {
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("autosetup-decoy:v1") || text.includes("dex-lanes:v1")) continue;
  const d = braceBalance(text);
  if (d !== 0) brace.push(`${path.relative(root, file)} ${d}`);
  if (!text.includes("obfuscation-batch:v18") && !text.includes("autosetup-decoy") ) {
    // decoys skipped above
  }
  if (!text.includes("ObfV18")) brace.push(`NO V18 ${path.relative(root, file)}`);
}

const frag = "ichyikowrdfpagthms";
const ui = [];
for (const file of gameFiles.filter((p) => p.endsWith(".tsx"))) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(frag)) ui.push(path.relative(root, file) + " jsx " + node.getText().trim().slice(0, 60));
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(frag)) {
      const p = node.parent;
      const isMod = p && ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node);
      const isReq = p && ts.isCallExpression(p) && p.expression && ts.isIdentifier(p.expression) && p.expression.text === "require";
      if (!isMod && !isReq && !node.text.includes("ObfV") && !node.text.startsWith("./") && !node.text.startsWith("../")) {
        ui.push(path.relative(root, file) + " str " + node.text.slice(0, 80));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

console.log("broken", broken.length);
broken.forEach((b) => console.log("BROKEN", b));
console.log("missing names", missingNames.length);
missingNames.slice(0, 30).forEach((b) => console.log("NAME", b));
console.log("verify problems", verifyProblems);
console.log("brace/missing", brace.length);
brace.forEach((b) => console.log("BRACE", b));
console.log("ui", ui.length);
ui.slice(0, 20).forEach((b) => console.log("UI", b));

checkProjectPaths(root).then((r) => {
  console.log("checkPaths", r.ok, r.problems);
});
