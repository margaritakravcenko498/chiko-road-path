const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const SKIP = new Set(["stop", "start", "reset", "setValue", "value", "finished", "children", "style", "width", "height", "opacity", "transform", "elevation", "App", "React", "Props"]);

function parse(code) {
  return parser.parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
}
function walk(node, visit, parent) {
  if (!node || typeof node.type !== "string") return;
  visit(node, parent);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const c of child) {
        if (c && c.type) walk(c, visit, node);
      }
    } else if (child && child.type) {
      walk(child, visit, node);
    }
  }
}
function insertMid(name) {
  const at = Math.max(1, Math.floor(name.length / 2));
  return name.slice(0, at) + FRAG + name.slice(at);
}
function apply(src, edits) {
  edits.sort((a, b) => b.start - a.start);
  let out = src;
  let last = out.length;
  for (const e of edits) {
    if (e.end > last) continue;
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
    last = e.start;
  }
  return out;
}
function walkFiles(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(full, out);
    else if (/\.tsx?$/.test(ent.name)) out.push(full);
  }
  return out;
}

const files = [
  ...walkFiles(path.join(ROOT, "Layouts")),
  ...walkFiles(path.join(ROOT, "services")),
  path.join(ROOT, "App.tsx"),
].filter((f) => fs.existsSync(f));

const map = new Map();
let seenExports = 0;
for (const file of files) {
  let ast;
  try { ast = parse(fs.readFileSync(file, "utf8")); } catch { continue; }
  const body = ast.program && ast.program.body ? ast.program.body : [];
  for (const node of body) {
    if (node.type !== "ExportNamedDeclaration") continue;
    seenExports++;
    const add = (name) => {
      if (!name || name.includes(FRAG) || name.length < 4 || SKIP.has(name)) return;
      if (/ObfV|MixSeed|FoldRange|ClampSpan/.test(name)) return;
      map.set(name, insertMid(name));
    };
    if (node.declaration) {
      const d = node.declaration;
      if (d.id && d.id.type === "Identifier") add(d.id.name);
      if (d.declarations) for (const dec of d.declarations) {
        if (dec.id && dec.id.type === "Identifier") add(dec.id.name);
      }
    }
    for (const s of node.specifiers || []) {
      if (s.local) add(s.local.name);
    }
  }
}

let touched = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  let ast;
  try { ast = parse(src); } catch { continue; }
  const edits = [];
  walk(ast, (node, parent) => {
    if (node.type !== "Identifier") return;
    const next = map.get(node.name);
    if (!next) return;
    if (parent && parent.type === "MemberExpression" && parent.property === node && !parent.computed) return;
    if (parent && parent.type === "ObjectProperty" && parent.key === node && !parent.computed && !parent.shorthand) return;
    if (parent && parent.type === "ObjectProperty" && parent.shorthand && parent.value === node) {
      // keep shorthand in sync by renaming the single token
    }
    edits.push({ start: node.start, end: node.end, text: next });
  });
  const nextSrc = apply(src, edits);
  if (nextSrc !== src) {
    fs.writeFileSync(file, nextSrc);
    touched++;
  }
}

const crypto = path.join(ROOT, "services", "CrichyikowrdfpagthmsyptoService.ts");
let cryptoSrc = fs.readFileSync(crypto, "utf8");
cryptoSrc = cryptoSrc.replace(
  "from './CryptoServicePichyikowrdfpagthmsart01'",
  "from './CryptoServicePichyikowrdfpagthmsart01'"
);
fs.writeFileSync(crypto, cryptoSrc);

const errors = [];
for (const file of files) {
  try { parse(fs.readFileSync(file, "utf8")); }
  catch (err) { errors.push(path.relative(ROOT, file) + ": " + err.message); }
}
console.log(JSON.stringify({ files: files.length, seenExports, mapped: map.size, touched, errors, sample: [...map.entries()].slice(0, 8) }, null, 2));
