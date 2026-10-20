/**
 * Fix destructure bindings whose uses were renamed but the binding name was not.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const gameRoot = path.join(root, "Layouts", "Game");
const FRAG = "ichyikowrdfpagthms";
const SUFFIXES = [
  "Screen", "Button", "Card", "Panel", "Layer", "Strip", "Tile", "Row",
  "Controls", "Header", "Init", "Engine", "Scale", "Puzzle", "Segment",
  "Background", "Overlay", "Indicator", "Badge", "Gauge", "Pill", "Shell",
  "Field", "Backdrop", "Planner", "Backstop",
];

function insertFragmentInBasename(base, fragment) {
  if (!base || !fragment || base.includes(fragment)) return base;
  if (/^(index)$/i.test(base)) return base;
  for (const suf of SUFFIXES) {
    if (base.endsWith(suf) && base.length > suf.length) {
      return `${base.slice(0, -suf.length)}${fragment}${suf}`;
    }
  }
  const pascal = base.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
  if (pascal) return `${pascal[1]}${fragment}${pascal[2]}`;
  const hook = base.match(/^(use)([A-Z].*)$/);
  if (hook) {
    const rest = hook[2];
    const restPair = rest.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
    if (restPair) return `${hook[1]}${restPair[1]}${fragment}${restPair[2]}`;
    return `${hook[1]}${fragment}${rest}`;
  }
  if (/^[a-z]/.test(base)) {
    const mid = Math.max(1, Math.floor(base.length / 2));
    return `${base.slice(0, mid)}${fragment}${base.slice(mid)}`;
  }
  return `${base}${fragment}`;
}

function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (name === "GameInit") return "GichyikowrdfpagthmsameShell";
  if (name === "doneOnFirstCycle") return "dichyikowrdfpagthmsoneOnFirstCycle";
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  return insertFragmentInBasename(name, FRAG);
}

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(ent.name)) out.push(p);
  }
  return out;
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

function countWord(text, word) {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
  return (text.match(re) || []).length;
}

let files = 0;
let editsN = 0;
for (const file of walk(gameRoot)) {
  const text = fs.readFileSync(file, "utf8");
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
      ts.isBindingElement(node) &&
      ts.isIdentifier(node.name) &&
      !node.propertyName &&
      !node.dotDotDotToken
    ) {
      const raw = node.name.text;
      const next = insertIdent(raw);
      if (next !== raw && raw.length >= 2) {
        let scope = node.parent;
        while (scope && !isFunctionLike(scope)) scope = scope.parent;
        const scopeText = (scope || sf).getText();
        const oldCount = countWord(scopeText, raw);
        const newCount = countWord(scopeText, next);
        if (newCount > 0 && oldCount === 1) {
          const start = node.name.getStart(sf);
          const end = node.name.end;
          const isArray = ts.isArrayBindingPattern(node.parent);
          edits.push({
            start,
            end,
            text: isArray ? next : `${raw}: ${next}`,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  fs.writeFileSync(file, out);
  files += 1;
  editsN += edits.length;
  console.log(path.relative(root, file), edits.length);
}
console.log("files", files, "edits", editsN);
