const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { injectTs } = require("./_obf_v18_lib");

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
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
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
  if (p && ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)) return p.name.text;
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

function callsOf(text) {
  const seen = new Set();
  const out = [];
  const re = /void [\w]+ObfV18\w+\([^;]*\);/g;
  let m;
  while ((m = re.exec(text))) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    out.push(m[0]);
  }
  return out;
}

const files = [...walk(path.join(root, "services")), ...walk(path.join(root, "Layouts", "Game"))];
let injected = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("obfuscation-batch:v18")) {
    const r = injectTs(file);
    if (!r.skipped) injected += 1;
  }
}
console.log("injected missing", injected);

let inserted = 0;
let wrapped = 0;
for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const calls = callsOf(text);
  if (!calls.length) {
    console.log("NO CALLS", path.relative(root, file));
    continue;
  }
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const sf = parse(file, text);
  const spots = [];
  function visit(node) {
    if (!isFn(node) || !node.body || isDummy(fnName(node)) || insideDummy(node)) {
      ts.forEachChild(node, visit);
      return;
    }
    if (ts.isBlock(node.body)) {
      const first = node.body.statements[0];
      const firstText = first ? first.getText(sf) : "";
      if (!firstText.includes("ObfV18")) {
        let at;
        let indent = "  ";
        if (first) {
          at = first.getStart(sf);
          const lineStart = text.lastIndexOf("\n", at - 1) + 1;
          indent = (text.slice(lineStart, at).match(/^[ \t]*/) || ["  "])[0] || "  ";
        } else {
          at = node.body.getStart(sf) + 1;
          const base = (text.slice(text.lastIndexOf("\n", node.body.getStart(sf) - 1) + 1, node.body.getStart(sf)).match(/^[ \t]*/) || [""])[0];
          indent = base + "  ";
        }
        spots.push({ at, indent });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  spots.sort((a, b) => b.at - a.at);
  for (const spot of spots) {
    const payload = calls.map((l) => spot.indent + l).join(nl) + nl + spot.indent;
    text = text.slice(0, spot.at) + payload + text.slice(spot.at);
    inserted += 1;
  }
  if (spots.length) fs.writeFileSync(file, text);
}

for (let guard = 0; guard < 6; guard++) {
  let pass = 0;
  for (const file of files) {
    let text = fs.readFileSync(file, "utf8");
    const calls = callsOf(text);
    if (!calls.length) continue;
    const nl = text.includes("\r\n") ? "\r\n" : "\n";
    const sf = parse(file, text);
    const edits = [];
    function visit(node) {
      if (
        isFn(node) &&
        node.body &&
        !ts.isBlock(node.body) &&
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
    if (!edits.length) continue;
    edits.sort((a, b) => b.start - a.start);
    for (const ed of edits) text = text.slice(0, ed.start) + ed.text + text.slice(ed.end);
    fs.writeFileSync(file, text);
    pass += edits.length;
    wrapped += edits.length;
  }
  if (!pass) break;
}
console.log("leading inserted", inserted, "wrapped", wrapped);
