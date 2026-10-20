const { buildBatch, helperSlug, fnv1a, FRAG, BATCH } = require("./_obf_v20");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "build") continue;
      walk(p, out);
    } else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

function isFn(n) {
  return (
    ts.isFunctionDeclaration(n) ||
    ts.isMethodDeclaration(n) ||
    ts.isConstructorDeclaration(n) ||
    ts.isArrowFunction(n) ||
    ts.isFunctionExpression(n) ||
    ts.isGetAccessor(n) ||
    ts.isSetAccessor(n)
  );
}
function nm(n) {
  if (n.name && ts.isIdentifier(n.name)) return n.name.text;
  const p = n.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  if (p && ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}
function dummy(name) {
  return /ObfV/i.test(name) || /bfV\d+/.test(name) || /MixSeed$|FoldRange$|ClampSpan$/.test(name);
}

const files = [...walk("services"), ...walk(path.join("Layouts", "Game"))];
let appended = 0;
const expr = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("obfuscation-batch:v20")) continue;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const helpers = new Set();
  function mark(n) {
    if (isFn(n) && dummy(nm(n))) helpers.add(n);
    ts.forEachChild(n, mark);
  }
  mark(sf);
  function inside(n) {
    let c = n.parent;
    while (c) {
      if (helpers.has(c)) return true;
      c = c.parent;
    }
    return false;
  }
  let callers = 0;
  function vis(n) {
    if (isFn(n) && n.body && !helpers.has(n) && !inside(n) && !dummy(nm(n))) {
      if (!ts.isBlock(n.body)) {
        expr.push(`${path.relative(".", file)} L${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`);
      } else callers += 1;
    }
    ts.forEachChild(n, vis);
  }
  vis(sf);
  if (callers !== 0) continue;
  const slug = helperSlug(file);
  const batch = buildBatch(slug, fnv1a(`${FRAG}|${slug}|${BATCH}`), "ts");
  const missing = batch.calls.filter((c) => !text.includes(c));
  if (!missing.length) continue;
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  fs.appendFileSync(file, (text.endsWith("\n") ? "" : nl) + missing.join(nl) + nl);
  appended += 1;
  console.log("append", path.relative(".", file), missing.length);
}
console.log("appended", appended, "expr", expr.length);
for (const e of expr) console.log(e);
