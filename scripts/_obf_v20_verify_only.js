const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { verifyTs } = require("./_obf_v20");
const { checkProjectPaths } = require("./autosetup/checkPaths");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "build" || e.name === "Pods") continue;
      walk(p, out);
    } else out.push(p);
  }
  return out;
}

const tsFiles = [
  ...walk(path.join(root, "services")).filter((p) => /\.tsx?$/.test(p)),
  ...walk(path.join(root, "Layouts", "Game")).filter((p) => /\.tsx?$/.test(p)),
];
let problems = 0;
for (const file of tsFiles) {
  const found = verifyTs(file);
  if (found.length) {
    problems += found.length;
    console.log("VERIFY", path.relative(root, file), found.slice(0, 8));
  }
}
console.log("verify problems", problems);

function resolveImport(fromFile, spec) {
  const abs = path.resolve(path.dirname(fromFile), spec);
  const candidates = [abs, abs + ".ts", abs + ".tsx", abs + ".js", abs + ".jsx", path.join(abs, "index.ts"), path.join(abs, "index.tsx"), path.join(abs, "index.js")];
  return candidates.some((c) => fs.existsSync(c));
}
const broken = [];
for (const file of [...tsFiles, path.join(root, "App.tsx"), path.join(root, "index.js")].filter((f) => fs.existsSync(f))) {
  const text = fs.readFileSync(file, "utf8");
  const re = /(?:require\s*\(\s*|from\s+)(['"])(\.\.?\/[^'"]+)\1/g;
  let m;
  while ((m = re.exec(text))) {
    if (!resolveImport(file, m[2])) broken.push(`${path.relative(root, file)} -> ${m[2]}`);
  }
}
console.log("broken", broken.length);
broken.slice(0, 20).forEach((b) => console.log(b));

const ui = [];
for (const file of tsFiles.filter((p) => p.includes(`${path.sep}Layouts${path.sep}Game${path.sep}`))) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function isMod(node) {
    const p = node.parent;
    if (!p) return false;
    if ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node) return true;
    if (ts.isCallExpression(p) && p.expression && ts.isIdentifier(p.expression) && p.expression.text === "require") return true;
    return false;
  }
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) ui.push(path.relative(root, file) + " jsx " + node.getText().trim().slice(0, 60));
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(FRAG) && !isMod(node)) {
      ui.push(path.relative(root, file) + " str " + node.text.slice(0, 80));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
console.log("ui/string hits", ui.length);
ui.slice(0, 30).forEach((h) => console.log(h));

checkProjectPaths(root).then((report) => {
  console.log("checkPaths", report.ok, report.problems.length);
  for (const p of report.problems.slice(0, 20)) console.log("PATH", p.file, p.ref);
});
