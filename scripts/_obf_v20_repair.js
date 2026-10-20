const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");
const servicesRoot = path.join(root, "services");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build") continue;
      walk(p, out);
    } else if (/\.tsx?$/.test(ent.name) && !ent.name.endsWith(".d.ts")) out.push(p);
  }
  return out;
}

function baseInsert(name) {
  if (!name || name.includes(FRAG)) return name;
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump && hump[1].length > 0) return hump[1] + FRAG + hump[2];
  if (/^[a-z]/.test(name)) {
    const mid = Math.max(1, Math.floor(name.length / 2));
    return name.slice(0, mid) + FRAG + name.slice(mid);
  }
  return name + FRAG;
}

function parse(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
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
  if (!name) return false;
  if (/ObfV/i.test(name)) return true;
  if (/bfV\d+/.test(name)) return true;
  if (/MixSeed$|FoldRange$|ClampSpan$/.test(name)) return true;
  return false;
}

function applyEdits(text, edits) {
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  return out;
}

function repairInterfaces(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const edits = [];
  function visit(node) {
    if (ts.isInterfaceDeclaration(node) && /Props$/.test(node.name.text)) {
      for (const m of node.members) {
        if (!m.name || !ts.isIdentifier(m.name)) continue;
        const raw = m.name.text;
        if (raw.includes(FRAG)) continue;
        const next = baseInsert(raw);
        if (!next || next === raw) continue;
        const re = new RegExp(`\\b${next}\\b`);
        if (!re.test(text)) continue;
        edits.push({ start: m.name.getStart(sf), end: m.name.end, text: next });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!edits.length) return false;
  fs.writeFileSync(file, applyEdits(text, edits));
  return true;
}

function stripDummyVoids(file) {
  let text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const helpers = new Set();
  function mark(node) {
    if (isFn(node) && isDummy(fnName(node))) helpers.add(node);
    ts.forEachChild(node, mark);
  }
  mark(sf);
  const ranges = [];
  function visit(node) {
    if (
      ts.isExpressionStatement(node) &&
      ts.isVoidExpression(node.expression) &&
      ts.isCallExpression(node.expression.expression)
    ) {
      let cur = node.parent;
      while (cur) {
        if (helpers.has(cur)) {
          ranges.push({ start: node.getFullStart(), end: node.getEnd() });
          break;
        }
        cur = cur.parent;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!ranges.length) return false;
  ranges.sort((a, b) => b.start - a.start);
  let out = text;
  for (const r of ranges) out = out.slice(0, r.start) + out.slice(r.end);
  fs.writeFileSync(file, out);
  return true;
}

function exportedNames(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const names = new Set();
  sf.forEachChild((node) => {
    const exported = (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported) return;
    if (ts.isFunctionDeclaration(node) && node.name) names.add(node.name.text);
    if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) names.add(d.name.text);
      }
    }
  });
  return names;
}

function repairCryptoPart03() {
  const host = path.join(servicesRoot, "CrichyikowrdfpagthmsyptoService.ts");
  const text = fs.readFileSync(host, "utf8");
  const sf = parse(host, text);
  const partFiles = walk(servicesRoot).filter((p) => /Crypto/i.test(path.basename(p)) && p !== host);
  const available = new Set();
  for (const f of partFiles) for (const n of exportedNames(f)) available.add(n);
  let removed = false;
  const edits = [];
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) return;
    if (!node.moduleSpecifier.text.endsWith("Part03")) return;
    const clause = node.importClause;
    if (!clause || !clause.namedBindings || !ts.isNamedImports(clause.namedBindings)) return;
    const missing = [];
    for (const el of clause.namedBindings.elements) {
      const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
      if (!available.has(exported)) missing.push(exported);
    }
    if (missing.length) {
      console.log("Part03 still missing exports", missing.slice(0, 12));
      return;
    }
    edits.push({ start: node.getFullStart(), end: node.getEnd(), text: "" });
    removed = true;
  });
  if (removed) fs.writeFileSync(host, applyEdits(text, edits));
  return removed;
}

let iface = 0;
let stripped = 0;
for (const file of walk(gameRoot)) {
  if (repairInterfaces(file)) iface += 1;
}
for (const file of [...walk(servicesRoot), ...walk(gameRoot)]) {
  if (stripDummyVoids(file)) stripped += 1;
}
const crypto = repairCryptoPart03();
console.log("interfaces", iface, "stripped", stripped, "cryptoPart03", crypto);
