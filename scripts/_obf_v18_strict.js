const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { verifyTs } = require("./_obf_v18_lib");
const { checkProjectPaths } = require("./autosetup/checkPaths");

const root = path.resolve(__dirname, "..");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build") continue;
      walk(p, out);
    } else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function parse(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

function isFn(node) {
  return ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node);
}
function fnName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}
function isDummy(name) {
  return /ObfV\d+/.test(name) || /GameMixSeed$|GameFoldRange$|GameClampSpan$/.test(name);
}
function insideDummy(node) {
  let cur = node.parent;
  while (cur) {
    if (isFn(cur) && isDummy(fnName(cur))) return true;
    cur = cur.parent;
  }
  return false;
}

const files = [...walk(path.join(root, "services")), ...walk(path.join(root, "Layouts", "Game"))];
let problems = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const local = [];
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) local.push("parse " + sf.parseDiagnostics.length);
  const v = verifyTs(file);
  if (v.length) local.push(...v.slice(0, 4));
  function visit(node) {
    if (isFn(node) && node.body && !isDummy(fnName(node)) && !insideDummy(node)) {
      if (!ts.isBlock(node.body)) local.push("expr " + (fnName(node) || "<anon>"));
      else {
        const first = node.body.statements[0];
        const t = first ? first.getText(sf) : "";
        if (!t.includes("ObfV18")) local.push("nostart " + (fnName(node) || "<anon>"));
      }
    }
    if (isFn(node) && isDummy(fnName(node)) && node.body && /\bvoid\s+/.test(node.body.getText(sf))) {
      local.push("void-in-helper " + fnName(node));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (local.length) {
    problems += local.length;
    console.log(path.relative(root, file), local.slice(0, 6).join(" | "));
  }
}
console.log("problem lines", problems);

checkProjectPaths(root).then((r) => console.log("paths", r.ok, r.problems));
