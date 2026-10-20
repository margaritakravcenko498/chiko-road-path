const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
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
function isHelperName(name) {
  if (!name) return false;
  return /ObfV\d+/.test(name) || /(MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)$/.test(name);
}
function functionLikeName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}
function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node);
}
function helperSet(sf) {
  const set = new Set();
  const uses = new Map();
  const decls = [];
  function visit(node) {
    if (isFunctionLike(node) && isHelperName(functionLikeName(node))) set.add(node);
    if (ts.isFunctionDeclaration(node) && node.name && !(node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) decls.push(node);
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const rec = uses.get(node.expression.text) || { v: 0, o: 0 };
      if (node.parent && ts.isVoidExpression(node.parent)) rec.v += 1;
      else rec.o += 1;
      uses.set(node.expression.text, rec);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const node of decls) {
    const u = uses.get(node.name.text);
    if (u && u.v > 0 && u.o === 0) set.add(node);
  }
  return set;
}
function insideHelper(node, helpers) {
  let cur = node.parent;
  while (cur) {
    if (helpers.has(cur)) return true;
    cur = cur.parent;
  }
  return false;
}

const files = [...walk(path.join(root, "services")), ...walk(path.join(root, "Layouts", "Game"))];
let inserted = 0;
const problems = [];

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes("obfuscation-batch:v15")) continue;
  const names = [...text.matchAll(/function (\w+ObfV15\w+)/g)].map((m) => m[1]);
  const calls = [];
  for (const n of names) {
    const m = text.match(new RegExp(`void ${n}\\([^)]*\\);`));
    if (m) calls.push(m[0].trim());
  }
  if (!calls.length) continue;
  const sf = parse(file, text);
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) {
    problems.push(`parse ${path.relative(root, file)} ${sf.parseDiagnostics.length}`);
  }
  const helpers = helperSet(sf);
  const edits = [];
  function visit(node) {
    if (isFunctionLike(node) && node.body && ts.isBlock(node.body) && !helpers.has(node) && !insideHelper(node, helpers)) {
      const leading = [];
      for (const stmt of node.body.statements) {
        if (!ts.isExpressionStatement(stmt) || !ts.isVoidExpression(stmt.expression)) break;
        leading.push(stmt.getText(sf).trim());
      }
      const missing = calls.filter((c) => !leading.some((l) => l === c || l.includes(c.replace(/;$/, ""))));
      if (missing.length) {
        const body = node.body;
        const stmt = body.statements[0];
        let indent = "  ";
        let at = body.getStart(sf) + 1;
        if (stmt) {
          at = stmt.getFullStart();
          const stmtPos = stmt.getStart(sf);
          const m = text.slice(text.lastIndexOf("\n", stmtPos - 1) + 1, stmtPos).match(/^[ \t]*/);
          indent = m ? m[0] : "  ";
          if (!indent) indent = "  ";
        }
        const payload = missing.map((l) => indent + l).join("\n") + "\n";
        edits.push({ at, payload });
      }
    }
    if (isFunctionLike(node) && helpers.has(node) && node.body) {
      const body = node.body.getText(sf);
      if (/\bvoid\s+/.test(body)) problems.push(`void in helper ${functionLikeName(node)} ${path.relative(root, file)}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  edits.sort((a, b) => b.at - a.at);
  for (const ed of edits) {
    text = text.slice(0, ed.at) + ed.payload + text.slice(ed.at);
    inserted += 1;
  }
  if (edits.length) fs.writeFileSync(file, text);
}
console.log("functions patched", inserted);
console.log("problems", problems.slice(0, 30));
console.log("problem count", problems.length);
