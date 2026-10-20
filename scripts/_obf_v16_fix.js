/**
 * Pull v16 void calls out of helper reduce callbacks and cover leftover expression bodies.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const dirs = [path.join(root, "services"), path.join(root, "Layouts", "Game")];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(ent.name) && !ent.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

function scriptKind(file) {
  return file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function parse(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
}

function isFunctionLike(node) {
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

function functionLikeName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}

function isExported(node) {
  return (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function isPureHelper(node) {
  const name = functionLikeName(node);
  if (/ObfV\d+/.test(name) || /(HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)$/.test(name)) return true;
  if (!isExported(node) && /(FoldRange|MixSeed|ClampSpan)$/.test(name)) return true;
  return false;
}

function insidePure(node) {
  let cur = node.parent;
  while (cur) {
    if (isFunctionLike(cur) && (isPureHelper(cur) || /FoldRange$/.test(functionLikeName(cur)))) return true;
    cur = cur.parent;
  }
  return false;
}

const reduceRe =
  /return (\w+)\.reduce\(\((\w+), (\w+)\) => \{\r?\n(?:[ \t]*void [\w]+\([^;]*\);\r?\n)+[ \t]*return \2 \+ \3;\r?\n[ \t]*\}, 0\);/g;

function v16Calls(text) {
  const seen = new Set();
  const calls = [];
  const re = /void [\w]+ObfV16\w+\([^;]*\);/g;
  let m;
  while ((m = re.exec(text))) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    calls.push(m[0]);
  }
  return calls;
}

function indentAt(text, pos) {
  const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
  const m = text.slice(lineStart, pos).match(/^[ \t]*/);
  return m ? m[0] : "";
}

let reverted = 0;
let wrapped = 0;
const files = dirs.flatMap(walk);

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");
  const next = text.replace(reduceRe, "return $1.reduce(($2, $3) => $2 + $3, 0);");
  if (next !== text) {
    reverted += 1;
    text = next;
  }

  const calls = v16Calls(text);
  if (calls.length) {
    const sf = parse(file, text);
    const edits = [];
    function visit(node) {
      if (isFunctionLike(node) && node.body && !isPureHelper(node) && !insidePure(node)) {
        if (!ts.isBlock(node.body)) {
          const expr = text.slice(node.body.getStart(sf), node.body.end);
          const base = indentAt(text, node.body.getStart(sf));
          const inner = calls.map((l) => base + "  " + l).join("\n");
          edits.push({
            start: node.body.getStart(sf),
            end: node.body.end,
            text: `{\n${inner}\n${base}  return ${expr};\n${base}}`,
          });
        } else if (
          ts.isFunctionDeclaration(node) &&
          node.name &&
          /FoldRange$/.test(node.name.text) &&
          isExported(node) &&
          !node.body.getText(sf).includes("ObfV16")
        ) {
          const brace = node.body.getStart(sf);
          const indent = indentAt(text, brace) + "  ";
          const payload = "\n" + calls.map((l) => indent + l).join("\n") + "\n";
          edits.push({ start: brace + 1, end: brace + 1, text: payload });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (edits.length) {
      edits.sort((a, b) => b.start - a.start);
      for (const ed of edits) text = text.slice(0, ed.start) + ed.text + text.slice(ed.end);
      wrapped += edits.length;
      console.log("edit", edits.length, path.relative(root, file));
    }
  }

  if (text !== fs.readFileSync(file, "utf8")) fs.writeFileSync(file, text);
}

console.log("reverted files", reverted, "edits", wrapped);

let parseProblems = 0;
let exprLeft = 0;
let voidInHelper = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) {
    parseProblems += 1;
    console.log("PARSE", path.relative(root, file));
  }
  function visit(node) {
    if (isFunctionLike(node) && node.body) {
      const name = functionLikeName(node);
      if (isPureHelper(node) && /ObfV16/.test(name)) {
        const body = node.body.getText(sf);
        if (/\bvoid\s+/.test(body)) {
          voidInHelper += 1;
          console.log("VOID-HELPER", path.relative(root, file), name);
        }
      } else if (!ts.isBlock(node.body) && !isPureHelper(node) && !insidePure(node)) {
        exprLeft += 1;
        console.log("EXPR", path.relative(root, file), name || "<anon>");
      }
      if (/FoldRange$/.test(name) && node.body.getText(sf).includes("void ")) {
        console.log("FOLD-VOID", path.relative(root, file), name);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}
console.log("parse", parseProblems, "expr", exprLeft, "voidInHelper", voidInHelper);
