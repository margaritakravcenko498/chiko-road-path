const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");
const STDLIB = new Set([
  "Math", "Animated", "Array", "Object", "Number", "String", "Date", "JSON",
  "console", "StyleSheet", "Dimensions", "BackHandler", "PanResponder", "AppState",
  "Promise", "Reflect", "Symbol",
]);
const HIT_REVERT = {
  toichyikowrdfpagthmsp: "top",
  leichyikowrdfpagthmsft: "left",
  righichyikowrdfpagthmst: "right",
  boichyikowrdfpagthmsttom: "bottom",
};
const SUFFIXES = [
  "Screen", "Button", "Card", "Panel", "Layer", "Strip", "Tile", "Row",
  "Controls", "Header", "Init", "Engine", "Scale", "Puzzle", "Segment",
  "Background", "Overlay", "Indicator",
];

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
function insertFragmentInBasename(base) {
  if (!base || base.includes(FRAG)) return base;
  for (const suf of SUFFIXES) {
    if (base.endsWith(suf) && base.length > suf.length) return base.slice(0, -suf.length) + FRAG + suf;
  }
  const pascal = base.match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
  if (pascal) return pascal[1] + FRAG + pascal[2];
  const hook = base.match(/^(use)([A-Z].*)$/);
  if (hook) {
    const restPair = hook[2].match(/^([A-Z][a-z0-9]*)([A-Z].*)$/);
    if (restPair) return hook[1] + restPair[1] + FRAG + restPair[2];
    return hook[1] + FRAG + hook[2];
  }
  if (/^[a-z]/.test(base)) {
    const mid = Math.max(1, Math.floor(base.length / 2));
    return base.slice(0, mid) + FRAG + base.slice(mid);
  }
  return base + FRAG;
}
function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return parts.join("_") + "_" + FRAG + last;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  return insertFragmentInBasename(name);
}
function kind(file) {
  return file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

const files = walk(gameRoot);
const parsed = files.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  return { file, text, sf: ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind(file)) };
});

const renameMap = new Map();
for (const { sf } of parsed) {
  function visit(node) {
    if (ts.isIdentifier(node) && node.text.includes(FRAG)) {
      const old = node.text.replace(FRAG, "");
      if (old && insertIdent(old) === node.text) renameMap.set(old, node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

function thirdParty(sf) {
  const names = new Set();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const mod = node.moduleSpecifier.text;
    if (!(mod === "react" || mod === "react-native" || mod.startsWith("react-native") || mod.includes("lucide"))) return;
    const clause = node.importClause;
    if (!clause) return;
    if (clause.name) names.add(clause.name.text);
    const b = clause.namedBindings;
    if (b && ts.isNamespaceImport(b)) names.add(b.name.text);
    if (b && ts.isNamedImports(b)) for (const el of b.elements) names.add(el.name.text);
  });
  return names;
}
function openingOf(attr) {
  let cur = attr.parent;
  while (cur) {
    if (ts.isJsxOpeningElement(cur) || ts.isJsxSelfClosingElement(cur)) return cur;
    cur = cur.parent;
  }
  return undefined;
}
function isThirdTag(opening, third) {
  const tag = opening.tagName;
  if (ts.isPropertyAccessExpression(tag)) return true;
  if (!ts.isIdentifier(tag)) return true;
  if (tag.text[0] !== tag.text[0].toUpperCase()) return true;
  if (third.has(tag.text)) return true;
  if (tag.text.startsWith("Icon")) return true;
  return false;
}
function isHitShape(obj) {
  if (!obj || !ts.isObjectLiteralExpression(obj)) return false;
  const names = [];
  for (const p of obj.properties) {
    if (!p.name || !ts.isIdentifier(p.name)) return false;
    names.push(p.name.text);
  }
  const allowed = new Set(["top", "bottom", "left", "right", "start", "end", ...Object.keys(HIT_REVERT)]);
  return names.length >= 3 && names.every((n) => allowed.has(n));
}

let editsN = 0;
for (const { file, text, sf } of parsed) {
  const third = thirdParty(sf);
  const edits = [];
  function add(start, end, next, old) {
    if (old === next) return;
    edits.push({ start, end, text: next });
  }
  function visit(node) {
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) && STDLIB.has(node.expression.text)) {
      if (node.name.text.includes(FRAG)) {
        const reverted = node.name.text.replace(FRAG, "");
        add(node.name.getStart(sf), node.name.end, reverted, node.name.text);
      }
    }
    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
      const opening = openingOf(node);
      if (opening) {
        const name = node.name.text;
        if (isThirdTag(opening, third)) {
          if (name.includes(FRAG)) {
            add(node.name.getStart(sf), node.name.end, name.replace(FRAG, ""), name);
          }
        } else if (name !== "key" && name !== "ref" && renameMap.has(name)) {
          add(node.name.getStart(sf), node.name.end, renameMap.get(name), name);
        }
      }
    }
    if ((ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) && node.name && ts.isIdentifier(node.name)) {
      if (isHitShape(node.parent) && HIT_REVERT[node.name.text]) {
        add(node.name.getStart(sf), node.name.end, HIT_REVERT[node.name.text], node.name.text);
      } else if (node.name.text === "key" && renameMap.has("key") && !ts.isJsxAttribute(node.parent)) {
        add(node.name.getStart(sf), node.name.end, renameMap.get("key"), node.name.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  const used = [];
  let out = text;
  for (const ed of edits) {
    if (used.some((u) => !(ed.end <= u.start || ed.start >= u.end))) continue;
    if (out.slice(ed.start, ed.end) === ed.text) continue;
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    used.push(ed);
    editsN += 1;
  }
  if (out !== text) fs.writeFileSync(file, out);
}
console.log("api fixes", editsN);
