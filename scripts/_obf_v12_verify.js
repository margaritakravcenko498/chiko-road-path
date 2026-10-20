const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue;
      out.push(...walk(p));
    } else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function checkTree(dir, { uiOnly } = {}) {
  const files = walk(dir);
  const exportsBy = new Map();
  const parsed = [];
  let parseErr = 0;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const sf = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    parsed.push({ file, text, sf });
    if ((sf.parseDiagnostics || []).length) {
      parseErr += 1;
      console.log("PARSE", path.relative(root, file));
    }
    const names = new Set();
    sf.forEachChild((node) => {
      const exp = node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exp) return;
      if (node.name && node.name.text) names.add(node.name.text);
      if (ts.isVariableStatement(node)) {
        for (const d of node.declarationList.declarations) {
          if (d.name && ts.isIdentifier(d.name)) names.add(d.name.text);
        }
      }
    });
    exportsBy.set(path.normalize(file), names);
  }
  let importErr = 0;
  let styleErr = 0;
  let ui = 0;
  let missingV12 = 0;
  for (const { file, text, sf } of parsed) {
    if (!text.includes("ObfV12HashMix")) {
      missingV12 += 1;
      console.log("NO V12", path.relative(root, file));
    }
    const keys = new Set();
    function collect(n) {
      if (
        ts.isCallExpression(n) &&
        ts.isPropertyAccessExpression(n.expression) &&
        n.expression.name.text === "create" &&
        ts.isIdentifier(n.expression.expression) &&
        n.expression.expression.text === "StyleSheet"
      ) {
        const arg = n.arguments[0];
        if (arg && ts.isObjectLiteralExpression(arg)) {
          for (const p of arg.properties) if (p.name && ts.isIdentifier(p.name)) keys.add(p.name.text);
        }
      }
      ts.forEachChild(n, collect);
    }
    collect(sf);
    function acc(n) {
      if (
        ts.isPropertyAccessExpression(n) &&
        ts.isIdentifier(n.expression) &&
        n.expression.text.includes("sichyikowrdfpagthmsty") &&
        keys.size &&
        !keys.has(n.name.text)
      ) {
        styleErr += 1;
        console.log("STYLE", path.relative(root, file), n.expression.text + "." + n.name.text);
      }
      if (!uiOnly) {
        /* game ui scan below */
      }
      if (ts.isJsxText(n) && n.getText().includes(FRAG)) {
        ui += 1;
        console.log("JSX", path.relative(root, file), n.getText().trim().slice(0, 60));
      }
      if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && n.text.includes(FRAG)) {
        const p = n.parent;
        const mod =
          (p && (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === n) ||
          (p && ts.isCallExpression(p) && ts.isIdentifier(p.expression) && p.expression.text === "require");
        if (!mod && file.includes("Layouts" + path.sep + "Game")) {
          ui += 1;
          console.log("STR", path.relative(root, file), n.text.slice(0, 70));
        }
      }
      ts.forEachChild(n, acc);
    }
    if (file.includes("Layouts" + path.sep + "Game")) acc(sf);

    if (!file.includes("Layouts" + path.sep + "Game")) continue;
    const dir = path.dirname(file);
    sf.forEachChild((node) => {
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
      const spec = node.moduleSpecifier.text;
      if (!spec.startsWith(".")) return;
      const clause = node.importClause;
      if (!clause || !clause.namedBindings || !ts.isNamedImports(clause.namedBindings)) return;
      const base = path.normalize(path.resolve(dir, spec));
      const target = [base + ".ts", base + ".tsx", path.join(base, "index.ts"), path.join(base, "index.tsx")].find((c) =>
        exportsBy.has(c),
      );
      if (!target) {
        if (spec.includes("GameInitPichyikowrdfpagthmsart01")) return;
        importErr += 1;
        console.log("MISSING", path.relative(root, file), spec);
        return;
      }
      const exp = exportsBy.get(target);
      for (const el of clause.namedBindings.elements) {
        const imported = el.propertyName ? el.propertyName.text : el.name.text;
        if (!exp.has(imported)) {
          importErr += 1;
          console.log("BAD", path.relative(root, file), imported, "from", spec);
        }
      }
    });
  }
  return { files: files.length, parseErr, importErr, styleErr, ui, missingV12 };
}

const game = checkTree(path.join(root, "Layouts", "Game"));
const services = checkTree(path.join(root, "services"));
console.log("game", game);
console.log("services", { files: services.files, parseErr: services.parseErr, missingV12: services.missingV12 });
if (game.parseErr || game.importErr || game.styleErr || game.ui || game.missingV12 || services.parseErr || services.missingV12) {
  process.exitCode = 2;
}
