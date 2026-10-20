/**
 * One-shot: Layouts/Game fragment renames + obfuscation-batch v12
 * for services/ and Layouts/Game. Deleted after it runs.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const gameRoot = path.join(root, "Layouts", "Game");
const servicesRoot = path.join(root, "services");

const SUFFIXES = [
  "Screen",
  "Button",
  "Card",
  "Panel",
  "Layer",
  "Strip",
  "Tile",
  "Row",
  "Controls",
  "Header",
  "Init",
  "Engine",
  "Scale",
  "Puzzle",
  "Segment",
  "Background",
  "Overlay",
  "Indicator",
];

const RN_JSX_ATTR_SKIP = new Set([
  "style",
  "contentContainerStyle",
  "hitSlop",
  "accessibilityState",
  "imageStyle",
  "thumbStyle",
  "placeholderTextColor",
]);

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
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name)) {
    const parts = name.split("_");
    const last = parts.pop();
    return `${parts.join("_")}_${FRAG}${last}`;
  }
  const hump = name.match(/^(.*[a-z0-9])([A-Z][A-Za-z0-9]*)$/);
  if (hump) return hump[1] + FRAG + hump[2];
  return insertFragmentInBasename(name, FRAG);
}

function newStem(stem) {
  if (stem.includes(FRAG) || /^index$/i.test(stem)) return stem;
  if (stem === "GameInit") return "GichyikowrdfpagthmsameShell";
  const part = stem.match(/^(.*)(Part\d+)$/);
  if (part) {
    const next = insertIdent(part[1]);
    return next + part[2];
  }
  return insertIdent(stem);
}

function scriptKind(file) {
  return file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function isPropertyNameIdent(node) {
  const p = node.parent;
  if (!p) return false;
  if (
    (ts.isPropertyAssignment(p) ||
      ts.isPropertySignature(p) ||
      ts.isPropertyDeclaration(p) ||
      ts.isMethodSignature(p) ||
      ts.isMethodDeclaration(p) ||
      ts.isEnumMember(p) ||
      ts.isPropertyAccessExpression(p) ||
      ts.isBindingElement(p) ||
      ts.isJsxAttribute(p)) &&
    p.name === node
  ) {
    return true;
  }
  if (ts.isShorthandPropertyAssignment(p) && p.name === node) return true;
  return false;
}

function isDirectStyleSheetKey(propNode) {
  const obj = propNode.parent;
  if (!obj || !ts.isObjectLiteralExpression(obj)) return false;
  const call = obj.parent;
  if (!call || !ts.isCallExpression(call)) return false;
  const expr = call.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    expr.name.text === "create" &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === "StyleSheet"
  );
}

function isNestedPlatformProp(node) {
  if (!isPropertyNameIdent(node)) return false;
  const prop = node.parent;
  if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
    if (isDirectStyleSheetKey(prop)) return false;
  }
  if (node.text === "name") {
    if (
      ts.isPropertyAssignment(prop) &&
      prop.name === node &&
      ts.isStringLiteral(prop.initializer) &&
      prop.initializer.text === "RETRO_NEON"
    ) {
      return true;
    }
    if (
      ts.isPropertyAccessExpression(prop) &&
      prop.name === node &&
      ts.isIdentifier(prop.expression) &&
      prop.expression.text === "THEME"
    ) {
      return true;
    }
  }
  const hitKeys = new Set(["top", "bottom", "left", "right", "start", "end"]);
  if (hitKeys.has(node.text) && (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop))) {
    const obj = prop.parent;
    if (obj && ts.isObjectLiteralExpression(obj)) {
      const names = obj.properties.map((pr) =>
        pr.name && ts.isIdentifier(pr.name) ? pr.name.text : "",
      );
      if (names.length && names.every((n) => hitKeys.has(n))) return true;
    }
  }
  if (
    ts.isPropertyAccessExpression(prop) &&
    prop.name === node &&
    hitKeys.has(node.text) &&
    ts.isIdentifier(prop.expression) &&
    prop.expression.text === "HIT"
  ) {
    return true;
  }

  let cur = node.parent;
  while (cur) {
    if (ts.isJsxAttribute(cur) && cur.name && RN_JSX_ATTR_SKIP.has(cur.name.text)) {
      return true;
    }
    if (ts.isCallExpression(cur)) {
      const expr = cur.expression;
      if (
        ts.isPropertyAccessExpression(expr) &&
        expr.name.text === "create" &&
        ts.isIdentifier(expr.expression) &&
        expr.expression.text === "StyleSheet"
      ) {
        return true;
      }
    }
    cur = cur.parent;
  }
  return false;
}

function jsxTagName(opening) {
  const tag = opening.tagName;
  if (ts.isIdentifier(tag)) return { kind: "id", text: tag.text };
  if (ts.isPropertyAccessExpression(tag)) return { kind: "member", text: tag.getText() };
  return { kind: "other", text: "" };
}

function collectRnImports(sf) {
  const names = new Set();
  sf.forEachChild((node) => {
    if (!ts.isImportDeclaration(node)) return;
    const spec = node.moduleSpecifier;
    if (!ts.isStringLiteral(spec)) return;
    const mod = spec.text;
    if (
      mod !== "react" &&
      mod !== "react-native" &&
      !mod.startsWith("react-native/") &&
      mod !== "react-native-linear-gradient" &&
      mod !== "react-native-safe-area-context"
    ) {
      return;
    }
    const clause = node.importClause;
    if (!clause) return;
    if (clause.name) names.add(clause.name.text);
    const bindings = clause.namedBindings;
    if (bindings && ts.isNamespaceImport(bindings)) names.add(bindings.name.text);
    if (bindings && ts.isNamedImports(bindings)) {
      for (const el of bindings.elements) names.add(el.name.text);
    }
  });
  return names;
}

function collectRenameNames(sf) {
  const names = new Set();
  function add(name) {
    if (!name || name.includes(FRAG) || name.length < 2) return;
    if (name === "default") return;
    const next = insertIdent(name);
    if (next && next !== name) names.add(name);
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) add(node.name.text);
    if (ts.isClassDeclaration(node) && node.name) add(node.name.text);
    if (ts.isInterfaceDeclaration(node)) add(node.name.text);
    if (ts.isTypeAliasDeclaration(node)) add(node.name.text);
    if (ts.isEnumDeclaration(node)) add(node.name.text);
    if (ts.isEnumMember(node) && ts.isIdentifier(node.name)) add(node.name.text);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) add(node.name.text);
    if (ts.isParameter(node) && ts.isIdentifier(node.name)) add(node.name.text);
    if (ts.isBindingElement(node) && ts.isIdentifier(node.name)) add(node.name.text);
    if (
      (ts.isPropertySignature(node) ||
        ts.isMethodSignature(node) ||
        ts.isPropertyDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isGetAccessor(node) ||
        ts.isSetAccessor(node)) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      add(node.name.text);
    }
    if (
      (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
      node.name &&
      ts.isIdentifier(node.name) &&
      !isNestedPlatformProp(node.name)
    ) {
      add(node.name.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return names;
}

function applyIdentifierRenames(file, text) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const renameNames = collectRenameNames(sf);
  const rn = collectRnImports(sf);
  /** @type {{start:number,end:number,text:string}[]} */
  const edits = [];

  function jsxHost(attr) {
    const opening = attr.parent;
    if (!opening || !ts.isJsxOpeningElement(opening) && !ts.isJsxSelfClosingElement(opening)) {
      return false;
    }
    const tag = jsxTagName(opening);
    if (tag.kind === "member") return true;
    if (tag.kind === "id") {
      if (tag.text[0] !== tag.text[0].toUpperCase()) return true;
      if (rn.has(tag.text)) return true;
    }
    return false;
  }

  function visit(node) {
    if (ts.isIdentifier(node)) {
      const raw = node.text;
      if (renameNames.has(raw)) {
        let skip = false;
        if (node.parent && ts.isJsxAttribute(node.parent) && node.parent.name === node) {
          if (raw === "key" || raw === "ref") skip = true;
          else if (jsxHost(node.parent)) skip = true;
        }
        if (!skip && isNestedPlatformProp(node)) skip = true;
        if (!skip) {
          const next = insertIdent(raw);
          if (next !== raw) edits.push({ start: node.getStart(sf), end: node.end, text: next });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const ed of edits) {
    const slice = out.slice(ed.start, ed.end);
    if (slice !== insertIdent(ed.text) && slice.includes(FRAG)) continue;
    // slice must be the old identifier
    if (!renameNames.has(slice) && slice !== ed.text) {
      // position drift guard
    }
    if (out.slice(ed.start, ed.end) !== slice) continue;
    const expectedOld = slice;
    if (insertIdent(expectedOld) !== ed.text && expectedOld !== ed.text) continue;
    if (expectedOld === ed.text) continue;
    out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
  }
  return { out, count: edits.length, names: [...renameNames] };
}

function renameFilesAndSpecifiers(gameFiles) {
  /** @type {Map<string, string>} abs old -> abs new */
  const map = new Map();
  for (const file of gameFiles) {
    const ext = path.extname(file);
    const stem = path.basename(file, ext);
    const next = newStem(stem);
    if (next === stem) continue;
    const target = path.join(path.dirname(file), next + ext);
    if (map.has(target) || (fs.existsSync(target) && path.normalize(target) !== path.normalize(file))) {
      throw new Error(`rename collision: ${target}`);
    }
    map.set(file, target);
  }

  const projectFiles = [];
  function walkProject(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walkProject(p);
      else if (/\.(tsx?|jsx?)$/.test(ent.name)) projectFiles.push(p);
    }
  }
  walkProject(root);

  const specRe = /(from\s+|import\s*\(\s*|require\s*\(\s*)(['"])([^'"]+)\2/g;
  let specUpdates = 0;
  for (const file of projectFiles) {
    let text = fs.readFileSync(file, "utf8");
    const dir = path.dirname(file);
    let changed = false;
    const next = text.replace(specRe, (full, pre, q, spec) => {
      if (spec.startsWith("react") || spec.includes("node_modules")) return full;
      if (!spec.startsWith(".")) {
        // App.tsx absolute-from-root style ./Layouts/...
      }
      const resolved = path.normalize(path.resolve(dir, spec));
      const candidates = [
        resolved + ".ts",
        resolved + ".tsx",
        path.join(resolved, "index.ts"),
        path.join(resolved, "index.tsx"),
      ];
      for (const c of candidates) {
        if (map.has(c)) {
          const target = map.get(c);
          let rel = path.relative(dir, target).replace(/\\/g, "/").replace(/\.tsx?$/, "");
          if (!rel.startsWith(".")) rel = "./" + rel;
          changed = true;
          specUpdates += 1;
          return pre + q + rel + q;
        }
      }
      return full;
    });
    if (changed) fs.writeFileSync(file, next);
  }

  const jobs = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of jobs) {
    fs.renameSync(from, to);
  }
  return { renamed: jobs.length, specUpdates, map };
}

function isHelperName(name) {
  if (!name) return false;
  return (
    /ObfV\d+/.test(name) ||
    /(MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod)$/.test(name)
  );
}

function functionLikeName(node) {
  if (node.name && ts.isIdentifier(node.name)) return node.name.text;
  const p = node.parent;
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  if (p && ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)) return p.name.text;
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

function helperSlug(file) {
  const stem = path.basename(file).replace(/\.tsx?$/, "");
  const clean = stem.replace(/[^A-Za-z0-9_]/g, "_");
  if (clean.includes(FRAG)) return clean;
  return FRAG + clean.charAt(0).toUpperCase() + clean.slice(1);
}

function injectV12(file) {
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("ObfV12")) return { injected: 0, callers: 0, skipped: true };
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const slug = helperSlug(file);
  const hash = `${slug}ObfV12HashMix`;
  const sum = `${slug}ObfV12SumOdds`;
  const clamp = `${slug}ObfV12ClampMod`;
  const callLines = [
    `void ${hash}('xy');`,
    `void ${sum}([1, 3, 5]);`,
    `void ${clamp}(7, 5);`,
  ];

  /** @type {{at:number, indent:string}[]} */
  const spots = [];

  function insideHelper(node) {
    let cur = node.parent;
    while (cur) {
      if (isFunctionLike(cur) && isHelperName(functionLikeName(cur))) return true;
      cur = cur.parent;
    }
    return false;
  }

  function visit(node) {
    if (
      isFunctionLike(node) &&
      node.body &&
      ts.isBlock(node.body) &&
      !isHelperName(functionLikeName(node)) &&
      !insideHelper(node)
    ) {
      const body = node.body;
      const stmt = body.statements[0];
      let indent = "  ";
      let at = body.getStart(sf) + 1;
      if (stmt) {
        at = stmt.getFullStart();
        const stmtPos = stmt.getStart(sf);
        const lineStart = text.lastIndexOf("\n", stmtPos - 1) + 1;
        const m = text.slice(lineStart, stmtPos).match(/^[ \t]*/);
        indent = m ? m[0] : "  ";
        if (text[at] === "\n") {
          /* keep */
        }
      } else {
        const brace = body.getStart(sf);
        const lineStart = text.lastIndexOf("\n", brace) + 1;
        const m = text.slice(lineStart, brace).match(/^[ \t]*/);
        indent = (m ? m[0] : "") + "  ";
        at = brace + 1;
      }
      spots.push({ at, indent });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);

  spots.sort((a, b) => b.at - a.at);
  let out = text;
  for (const spot of spots) {
    const payload = callLines.map((l) => spot.indent + l).join("\n") + "\n";
    out = out.slice(0, spot.at) + payload + out.slice(spot.at);
  }

  const helpers = `
/* obfuscation-batch:v12 */
function ${hash}(s: string): number {
  return Array.from(s).reduce((acc, ch) => (acc + ch.charCodeAt(0) * 61) % 997, 0);
}
function ${sum}(nums: number[]): number {
  return nums.filter((n) => n % 2 !== 0).reduce((acc, n) => acc + n * 37, 0);
}
function ${clamp}(n: number, m: number): number {
  const mod = m || 1;
  return ((n % mod) + mod) % mod;
}
`;
  if (spots.length === 0) {
    out = out.replace(/\s*$/, "") + helpers + callLines.map((l) => l).join("\n") + "\n";
  } else {
    out = out.replace(/\s*$/, "") + "\n" + helpers;
  }
  fs.writeFileSync(file, out);
  return { injected: 1, callers: spots.length, skipped: false };
}

function scanUiCopies(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const hits = [];
  function isModuleSpec(node) {
    const p = node.parent;
    if (!p) return false;
    if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) return p.moduleSpecifier === node;
    if (ts.isCallExpression(p)) {
      const e = p.expression;
      if (ts.isIdentifier(e) && (e.text === "require" || e.text === "import")) return true;
    }
    if (ts.isImportCall && ts.isImportCall(p)) return true;
    return false;
  }
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) {
      hits.push({ kind: "jsx", text: node.getText().trim().slice(0, 80) });
    }
    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      node.text.includes(FRAG) &&
      !isModuleSpec(node)
    ) {
      hits.push({ kind: "str", text: node.text.slice(0, 80) });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return hits;
}

function verifyHelpers(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind(file));
  const problems = [];
  const slug = helperSlug(file);
  const needles = [
    `void ${slug}ObfV12HashMix('xy');`,
    `void ${slug}ObfV12SumOdds([1, 3, 5]);`,
    `void ${slug}ObfV12ClampMod(7, 5);`,
  ];
  let callers = 0;
  function insideHelper(node) {
    let cur = node.parent;
    while (cur) {
      if (isFunctionLike(cur) && isHelperName(functionLikeName(cur))) return true;
      cur = cur.parent;
    }
    return false;
  }
  function visit(node) {
    if (isFunctionLike(node) && node.body && ts.isBlock(node.body)) {
      const name = functionLikeName(node);
      const bodyText = node.body.getText();
      if (isHelperName(name)) {
        if (bodyText.includes("void ")) {
          // older helpers should not have gained void; flag only ObfV12 inside helpers
          if (bodyText.includes("ObfV12")) problems.push(`helper ${name} calls ObfV12`);
        }
      } else if (!insideHelper(node)) {
        callers += 1;
        for (const n of needles) {
          if (!bodyText.includes(n)) problems.push(`missing ${n} in ${name || "<anon>"}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!text.includes(`function ${slug}ObfV12HashMix`)) problems.push("missing helper decl");
  const diags = sf.parseDiagnostics || [];
  if (diags.length) problems.push(`parse errors ${diags.length}`);
  return { problems, callers };
}

// --- run ---
const gameFiles = walk(gameRoot);
let identEdits = 0;
const nameSamples = new Map();
for (const file of gameFiles) {
  const text = fs.readFileSync(file, "utf8");
  const { out, count, names } = applyIdentifierRenames(file, text);
  identEdits += count;
  if (count) nameSamples.set(path.relative(root, file), names.slice(0, 12));
  if (out !== text) fs.writeFileSync(file, out);
}
console.log("identifier edits", identEdits);

const renamed = renameFilesAndSpecifiers(walk(gameRoot));
console.log("files renamed", renamed.renamed, "specifiers", renamed.specUpdates);

const targets = [...walk(servicesRoot), ...walk(gameRoot)];
let helperFiles = 0;
let callerSpots = 0;
for (const file of targets) {
  const r = injectV12(file);
  if (!r.skipped) {
    helperFiles += 1;
    callerSpots += r.callers;
  }
}
console.log("v12 files", helperFiles, "caller bodies", callerSpots);

const uiHits = [];
for (const file of walk(gameRoot)) {
  const hits = scanUiCopies(file);
  if (hits.length) uiHits.push({ file: path.relative(root, file), hits });
}
console.log("ui string hits", JSON.stringify(uiHits, null, 2));

let verifyProblems = 0;
for (const file of targets) {
  const v = verifyHelpers(file);
  if (v.problems.length) {
    verifyProblems += v.problems.length;
    console.log("VERIFY", path.relative(root, file), v.problems.slice(0, 8));
  }
}
console.log("verify problems", verifyProblems);
if (verifyProblems || uiHits.length) process.exitCode = 2;
