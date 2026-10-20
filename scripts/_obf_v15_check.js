const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}
function parse(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}
function propsFromFunc(node) {
  const names = new Set();
  const p = node.parameters && node.parameters[0];
  if (!p) return names;
  if (p.type && ts.isTypeLiteralNode(p.type)) {
    for (const m of p.type.members) if (m.name && ts.isIdentifier(m.name)) names.add(m.name.text);
  }
  if (p.type && ts.isTypeReferenceNode(p.type) && ts.isIdentifier(p.type.typeName)) {
    names.add("TYPE:" + p.type.typeName.text);
  }
  if (ts.isObjectBindingPattern(p.name)) {
    for (const el of p.name.elements) {
      if (el.propertyName && ts.isIdentifier(el.propertyName)) names.add(el.propertyName.text);
      else if (ts.isIdentifier(el.name)) names.add(el.name.text);
    }
  }
  return names;
}

const game = walk(path.join(root, "Layouts", "Game"));
const issues = [];
const propIndex = new Map();
for (const file of game) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) issues.push("PARSE " + path.relative(root, file));
  const byName = new Map();
  let defaults = null;
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const props = propsFromFunc(node);
      if (props.size) byName.set(node.name.text, props);
      if ((node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) && props.size) defaults = props;
    }
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) issues.push("JSX " + path.relative(root, file) + " " + node.getText().trim().slice(0, 80));
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(FRAG)) {
      const p = node.parent;
      const spec = p && ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node);
      const req = p && ts.isCallExpression(p) && ts.isIdentifier(p.expression) && p.expression.text === "require";
      if (!spec && !req) issues.push("STR " + path.relative(root, file) + " " + node.text.slice(0, 80));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  propIndex.set(path.normalize(file), { byName, defaults });
}

function resolve(from, spec) {
  if (!spec.startsWith(".")) return "";
  const abs = path.resolve(path.dirname(from), spec);
  for (const ext of [".ts", ".tsx"]) if (fs.existsSync(abs + ext)) return path.normalize(abs + ext);
  return "";
}

for (const file of game) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const importProps = new Map();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.importClause || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const idx = propIndex.get(resolve(file, node.moduleSpecifier.text));
    if (!idx) return;
    if (node.importClause.name && idx.defaults) importProps.set(node.importClause.name.text, idx.defaults);
    const nb = node.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb)) {
      for (const el of nb.elements) {
        const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
        if (idx.byName.has(exported)) importProps.set(el.name.text, idx.byName.get(exported));
      }
    }
  });
  function visit(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName)) {
      const props = importProps.get(node.tagName.text);
      if (props) {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) continue;
          const n = attr.name.text;
          if (n === "key" || n === "ref") continue;
          if (!props.has(n)) issues.push(`JSXPROP ${path.relative(root, file)} <${node.tagName.text} ${n}>`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

const svc = walk(path.join(root, "services"));
for (const file of [...svc, ...game]) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("obfuscation-batch:v15")) issues.push("NOBATCH " + path.relative(root, file));
}
console.log(issues.length ? issues.join("\n") : "ok");
