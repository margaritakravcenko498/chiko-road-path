/**
 * Repair binding declarations and JSX props after the v15 rename pass.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");

function insertIdent(name) {
  if (!name || name.includes(FRAG)) return name;
  if (name === "GameInit") return "GichyikowrdfpagthmsameShell";
  if (name === "doneOnFirstCycle") return "dichyikowrdfpagthmsoneOnFirstCycle";
  if (name === "startAtMenu") return "startAtichyikowrdfpagthmsMenu";
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  if (/^[a-z]/.test(name)) {
    const mid = Math.max(1, Math.floor(name.length / 2));
    return name.slice(0, mid) + FRAG + name.slice(mid);
  }
  if (/^[A-Z]/.test(name)) return name + FRAG;
  return name;
}

function stripFrag(name) {
  return name.split(FRAG).join("");
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

function parse(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function isPropsParam(param) {
  if (!param || !ts.isParameter(param) || !param.type) return false;
  if (ts.isTypeLiteralNode(param.type)) return true;
  if (ts.isTypeReferenceNode(param.type) && ts.isIdentifier(param.type.typeName)) {
    return /Props/.test(param.type.typeName.text);
  }
  return false;
}

function inPropsParam(node) {
  let cur = node;
  while (cur) {
    if (ts.isParameter(cur) && isPropsParam(cur)) return true;
    cur = cur.parent;
  }
  return false;
}

function identSet(sf) {
  const set = new Set();
  function visit(node) {
    if (ts.isIdentifier(node)) set.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return set;
}

function applyEdits(text, edits) {
  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) {
    if (out.slice(ed.start, ed.end) !== ed.expect) {
      console.log("skip mismatch", JSON.stringify(out.slice(ed.start, ed.end)), "expected", ed.expect);
      continue;
    }
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  }
  return out;
}

function propsFromFunc(node) {
  const names = new Set();
  const p = node.parameters && node.parameters[0];
  if (!p) return names;
  if (p.type && ts.isTypeLiteralNode(p.type)) {
    for (const m of p.type.members) {
      if (m.name && ts.isIdentifier(m.name)) names.add(m.name.text);
    }
  }
  if (ts.isObjectBindingPattern(p.name)) {
    for (const el of p.name.elements) {
      if (el.propertyName && ts.isIdentifier(el.propertyName)) names.add(el.propertyName.text);
      else if (ts.isIdentifier(el.name)) names.add(el.name.text);
    }
  }
  return names;
}

function indexFileProps(file, sf) {
  const byName = new Map();
  let defaults = new Set();
  function visit(node) {
    if ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name && node.parameters) {
      const props = propsFromFunc(node);
      if (props.size) byName.set(node.name.text, props);
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      const props = propsFromFunc(node.initializer);
      if (props.size) byName.set(node.name.text, props);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  function take(expr) {
    if (ts.isIdentifier(expr) && byName.has(expr.text)) defaults = byName.get(expr.text);
    else if (ts.isCallExpression(expr)) {
      for (const arg of expr.arguments) {
        if (ts.isIdentifier(arg) && byName.has(arg.text)) defaults = byName.get(arg.text);
      }
    }
  }
  sf.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) {
      if (byName.has(node.name.text)) defaults = byName.get(node.name.text);
    }
    if (ts.isExportAssignment(node)) take(node.expression);
  });
  return { byName, defaults };
}

const files = walk(gameRoot);
const propIndex = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  propIndex.set(path.normalize(file), indexFileProps(file, parse(file, text)));
}

function resolveSpec(fromFile, spec) {
  if (!spec.startsWith(".")) return "";
  const abs = path.resolve(path.dirname(fromFile), spec);
  for (const ext of [".ts", ".tsx"]) {
    const c = abs + ext;
    if (fs.existsSync(c)) return path.normalize(c);
  }
  return "";
}

let bindingEdits = 0;
let jsxEdits = 0;
const dupes = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const known = identSet(sf);
  const edits = [];

  function visit(node) {
    if (ts.isBindingElement(node) && !inPropsParam(node)) {
      const names = node.name && ts.isIdentifier(node.name) ? [node.name] : [];
      // duplicate check later
      if (node.propertyName && ts.isIdentifier(node.propertyName) && node.propertyName.text.includes(FRAG)) {
        const orig = stripFrag(node.propertyName.text);
        if (orig && insertIdent(orig) === node.propertyName.text) {
          edits.push({
            start: node.propertyName.getStart(sf),
            end: node.propertyName.end,
            expect: node.propertyName.text,
            text: orig,
          });
        }
      }
      if (node.name && ts.isIdentifier(node.name) && !node.name.text.includes(FRAG)) {
        const next = insertIdent(node.name.text);
        if (next !== node.name.text && known.has(next)) {
          const pat = node.parent;
          const shorthand = !node.propertyName && pat && ts.isObjectBindingPattern(pat);
          edits.push({
            start: node.name.getStart(sf),
            end: node.name.end,
            expect: node.name.text,
            text: shorthand ? `${node.name.text}: ${next}` : next,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  // JSX attributes for components defined in Layouts/Game
  const importProps = new Map();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.importClause || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const resolved = resolveSpec(file, node.moduleSpecifier.text);
    const idx = propIndex.get(resolved);
    if (!idx) return;
    if (node.importClause.name && idx.defaults && idx.defaults.size) {
      importProps.set(node.importClause.name.text, idx.defaults);
    }
    const nb = node.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb)) {
      for (const el of nb.elements) {
        const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
        if (idx.byName.has(exported)) importProps.set(el.name.text, idx.byName.get(exported));
        else if (idx.defaults && exported === "default") importProps.set(el.name.text, idx.defaults);
      }
    }
  });
  const local = propIndex.get(path.normalize(file));
  if (local) {
    for (const [n, set] of local.byName) importProps.set(n, set);
  }

  function visitJsx(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ts.isIdentifier(node.tagName)) {
      const props = importProps.get(node.tagName.text);
      if (props && props.size) {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) continue;
          const raw = attr.name.text;
          if (raw === "key" || raw === "ref" || props.has(raw)) continue;
          const next = insertIdent(raw);
          if (next !== raw && props.has(next)) {
            edits.push({
              start: attr.name.getStart(sf),
              end: attr.name.end,
              expect: raw,
              text: next,
            });
          }
        }
      }
    }
    ts.forEachChild(node, visitJsx);
  }
  visitJsx(sf);

  // duplicate names inside one binding pattern
  function visitDup(node) {
    if (ts.isObjectBindingPattern(node) || ts.isArrayBindingPattern(node)) {
      const seen = new Map();
      for (const el of node.elements) {
        if (!ts.isBindingElement(el) || !ts.isIdentifier(el.name)) continue;
        const n = el.name.text;
        if (seen.has(n)) dupes.push(`${path.relative(root, file)}:${el.name.getStart(sf)} ${n}`);
        seen.set(n, true);
      }
    }
    ts.forEachChild(node, visitDup);
  }
  visitDup(sf);

  if (edits.length) {
    const next = applyEdits(text, edits);
    if (next !== text) {
      fs.writeFileSync(file, next);
      bindingEdits += edits.filter((e) => !e.text.includes(":") || e.expect.length < 40).length;
      jsxEdits += edits.length;
    }
  }
}

console.log("files touched edits", jsxEdits, "dupes", dupes);

function isHelperName(name) {
  if (!name) return false;
  return /ObfV\d+/.test(name) || /(MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)$/.test(name);
}
function functionLikeName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return "";
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
function helperSet(sf) {
  const set = new Set();
  const uses = new Map();
  const decls = [];
  function visit(node) {
    if (isFunctionLike(node) && isHelperName(functionLikeName(node))) set.add(node);
    if (ts.isFunctionDeclaration(node) && node.name && !(node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      decls.push(node);
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const rec = uses.get(node.expression.text) || { v: 0, o: 0 };
      if (node.parent && ts.isVoidExpression(node.parent)) rec.v += 1;
      else rec.o += 1;
      uses.set(node.expression.text, rec);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const node of decls) {
    const u = uses.get(node.name.text);
    if (u && u.v > 0 && u.o === 0) set.add(node);
  }
  return set;
}
function insideHelper(node, helpers) {
  let cur = node.parent;
  while (cur) {
    if (helpers.has(cur)) return true;
    cur = cur.parent;
  }
  return false;
}
function hasExprFn(body) {
  let found = false;
  function visit(node) {
    if (found) return;
    if (isFunctionLike(node) && node.body && !ts.isBlock(node.body)) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

let exprFixed = 0;
for (const file of [...walk(gameRoot), ...walk(path.join(root, "services"))]) {
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes("obfuscation-batch:v15")) continue;
  const names = [...text.matchAll(/function (\w+ObfV15\w+)/g)].map((m) => m[1]);
  const calls = [];
  for (const n of names) {
    const m = text.match(new RegExp(`void ${n}\\([^)]*\\);`));
    if (m) calls.push(m[0].trim());
  }
  if (!calls.length) continue;
  for (let guard = 0; guard < 8; guard++) {
    const sf = parse(file, text);
    const helpers = helperSet(sf);
    const edits = [];
    function visit(node) {
      if (!isFunctionLike(node) || !node.body || helpers.has(node) || insideHelper(node, helpers)) {
        ts.forEachChild(node, visit);
        return;
      }
      if (!ts.isBlock(node.body) && !hasExprFn(node.body)) {
        const expr = text.slice(node.body.getStart(sf), node.body.end);
        const lineStart = text.lastIndexOf("\n", node.body.getStart(sf) - 1) + 1;
        const base = (text.slice(lineStart, node.body.getStart(sf)).match(/^[ \t]*/) || [""])[0];
        const inner = calls.map((c) => base + "  " + c).join("\n");
        edits.push({
          start: node.body.getStart(sf),
          end: node.body.end,
          expect: expr,
          text: `{\n${inner}\n${base}  return ${expr};\n${base}}`,
        });
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) break;
    text = applyEdits(text, edits);
    exprFixed += edits.length;
    fs.writeFileSync(file, text);
  }
}
console.log("expr fixed", exprFixed);
console.log("dupes", dupes.join("\n"));
