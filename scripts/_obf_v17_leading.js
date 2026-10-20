const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
}

function isFn(n) {
  return (
    ts.isFunctionDeclaration(n) ||
    ts.isMethodDeclaration(n) ||
    ts.isConstructorDeclaration(n) ||
    ts.isGetAccessor(n) ||
    ts.isSetAccessor(n) ||
    ts.isFunctionExpression(n) ||
    ts.isArrowFunction(n)
  );
}

function nameOf(n) {
  if (n.name && ts.isIdentifier(n.name)) return n.name.text;
  const p = n.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}

function dummy(n) {
  return /ObfV\d+/.test(n) || /GameMixSeed$|GameFoldRange$|GameClampSpan$/.test(n);
}

function insideDummy(n) {
  let c = n.parent;
  while (c) {
    if (isFn(c) && dummy(nameOf(c))) return true;
    c = c.parent;
  }
  return false;
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

let inserted = 0;
for (const file of [...walk("services"), ...walk(path.join("Layouts", "Game"))]) {
  let text = fs.readFileSync(file, "utf8");
  const calls = callsOf(text);
  if (!calls.length) continue;
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const sf = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const spots = [];
  function visit(node) {
    if (isFn(node) && node.body && ts.isBlock(node.body) && !dummy(nameOf(node)) && !insideDummy(node)) {
      const first = node.body.statements[0];
      const firstText = first ? first.getText(sf) : "";
      if (!firstText.includes("ObfV17")) {
        let at;
        let indent = "  ";
        if (first) {
          at = first.getStart(sf);
          const lineStart = text.lastIndexOf("\n", at - 1) + 1;
          indent = (text.slice(lineStart, at).match(/^[ \t]*/) || ["  "])[0] || "  ";
        } else {
          at = node.body.getStart(sf) + 1;
          indent = "  ";
        }
        spots.push({ at, indent });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  spots.sort((a, b) => b.at - a.at);
  for (const spot of spots) {
    const payload = calls.map((l, i) => (i === 0 ? l : spot.indent + l)).join(nl) + nl + spot.indent;
    text = text.slice(0, spot.at) + payload + text.slice(spot.at);
    inserted += 1;
  }
  if (spots.length) fs.writeFileSync(file, text);
}
console.log("inserted", inserted);
