const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const gameRoot = path.join(root, "Layouts", "Game");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function isFn(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessor(node) ||
    ts.isSetAccessor(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node)
  );
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

function hasExprFunction(body) {
  let found = false;
  function visit(node) {
    if (found) return;
    if (isFn(node) && node.body && !ts.isBlock(node.body)) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

function callsOf(text) {
  const seen = new Set();
  const out = [];
  const re = /void [\w]+ObfV17\w+\([^;]*\);/g;
  let m;
  while ((m = re.exec(text))) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    out.push(m[0]);
  }
  return out;
}

let wrapped = 0;
for (const file of walk(gameRoot)) {
  let text = fs.readFileSync(file, "utf8");
  const calls = callsOf(text);
  if (!calls.length) continue;
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  for (let guard = 0; guard < 8; guard++) {
    const sf = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const edits = [];
    function visit(node) {
      if (
        isFn(node) &&
        node.body &&
        !ts.isBlock(node.body) &&
        !hasExprFunction(node.body) &&
        !isDummy(fnName(node)) &&
        !insideDummy(node)
      ) {
        const expr = text.slice(node.body.getStart(sf), node.body.end);
        const start = node.body.getStart(sf);
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        const base = (text.slice(lineStart, start).match(/^[ \t]*/) || [""])[0];
        const inner = calls.map((l) => base + "  " + l).join(nl);
        edits.push({
          start,
          end: node.body.end,
          text: `{${nl}${inner}${nl}${base}  return ${expr};${nl}${base}}`,
        });
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) break;
    edits.sort((a, b) => b.start - a.start);
    for (const ed of edits) text = text.slice(0, ed.start) + ed.text + text.slice(ed.end);
    wrapped += edits.length;
  }
  fs.writeFileSync(file, text);
}
console.log("wrapped", wrapped);
