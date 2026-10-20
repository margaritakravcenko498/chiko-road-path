const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const root = path.join(__dirname, "..", "Layouts", "Game");

function walk(d) {
  let o = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) o = o.concat(walk(p));
    else if (/\.tsx$/.test(e.name)) o.push(p);
  }
  return o;
}

const FRAG = "ichyikowrdfpagthms";
function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return parts.join("_") + "_" + FRAG + last;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  const mid = Math.max(1, Math.floor(name.length / 2));
  if (/^[a-z]/.test(name)) return name.slice(0, mid) + FRAG + name.slice(mid);
  const pascal = name.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
  if (pascal) return pascal[1] + FRAG + pascal[2];
  return name + FRAG;
}

const files = walk(root);
/** @type {Map<string, Set<string>>} */
const propsByTag = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const local = new Map();
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.parameters[0] && ts.isObjectBindingPattern(node.parameters[0].name)) {
      const names = node.parameters[0].name.elements.filter(e => ts.isIdentifier(e.name)).map(e => e.name.text);
      local.set(node.name.text, new Set(names));
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isCallExpression(node.initializer)) {
      const call = node.initializer;
      const callee = call.expression;
      const isMemo = (ts.isIdentifier(callee) && callee.text === "memo") || (ts.isPropertyAccessExpression(callee) && callee.name.text === "memo");
      if (isMemo && call.arguments[0] && ts.isIdentifier(call.arguments[0])) {
        const inner = local.get(call.arguments[0].text);
        if (inner) local.set(node.name.text, inner);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const [k, v] of local) propsByTag.set(k, v);
}

let editsApplied = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName;
      if (ts.isIdentifier(tag) && propsByTag.has(tag.text)) {
        const props = propsByTag.get(tag.text);
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) continue;
          const n = attr.name.text;
          if (n === "key" || n === "ref") continue;
          if (!props.has(n)) {
            const guessed = insertIdent(n);
            if (props.has(guessed)) {
              edits.push({ start: attr.name.getStart(sf), end: attr.name.end, text: guessed });
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) {
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    editsApplied += 1;
  }
  if (out !== text) fs.writeFileSync(file, out);
}
console.log("jsx attrs", editsApplied);
