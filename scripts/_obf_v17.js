/**
 * obfuscation-batch v17 for services/, Layouts/Game/, and Android host sources.
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const BATCH = "v17";
const gameRoot = path.join(root, "Layouts", "Game");
const servicesRoot = path.join(root, "services");
const javaRoot = path.join(root, "android", "app", "src", "main", "java");

const RESERVED_PROPS = new Set(["children", "key", "ref"]);
const SHAPE_TAGS = ["HashMix", "SumOdds", "ClampMod", "ShiftXor", "ByteFold"];

function walk(dir, pred) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build" || ent.name === ".git") continue;
      out.push(...walk(p, pred));
    } else if (pred(p, ent.name)) out.push(p);
  }
  return out;
}

function nlOf(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mix32(x) {
  x = x >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d) >>> 0;
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

function lit(seed, salt, lo, span) {
  return (mix32(seed ^ Math.imul(salt, 0x9e3779b9)) % span) + lo;
}

function seedStr(seed) {
  const alph = "bdfghjkmnpqrstvwz23456789";
  const len = 2 + (seed % 3);
  let s = "";
  let x = seed >>> 0;
  for (let i = 0; i < len; i++) {
    x = mix32(x ^ Math.imul(i + 1, 0x85ebca6b));
    s += alph[x % alph.length];
  }
  if (s === "xy") s = "k3";
  return s;
}

function seedArr(seed) {
  const a = [];
  let x = seed >>> 0;
  for (let i = 0; i < 3; i++) {
    x = mix32(x ^ Math.imul(i + 3, 0xc2b2ae35));
    a.push((x % 29) + 2);
  }
  if (a[0] === 1 && a[1] === 3 && a[2] === 5) a[2] = 8;
  return a;
}

function helperSlug(file) {
  const stem = path.basename(file).replace(/\.(tsx?|kt|java)$/, "");
  const clean = stem.replace(/[^A-Za-z0-9_]/g, "_");
  if (clean.includes(FRAG)) return clean;
  return FRAG + clean.charAt(0).toUpperCase() + clean.slice(1);
}

function buildShapePlan(seed) {
  const count = 1 + (seed % 4);
  const start = seed % 5;
  const shapes = [];
  for (let i = 0; i < count; i++) shapes.push((start + i) % 5);
  const hasLoopOrShift = shapes.some((s) => s !== 2);
  if (!hasLoopOrShift) shapes[0] = 3;
  return shapes;
}

function buildBatch(slug, seed, lang) {
  const shapes = buildShapePlan(seed);
  const helpers = [];
  const calls = [];
  const specs = [];
  shapes.forEach((shape, idx) => {
    const salt = idx + 1;
    const name = `${slug}ObfV17${SHAPE_TAGS[shape]}`;
    const mul = lit(seed, salt * 11, 3, 41);
    const mod = lit(seed, salt * 13, 113, 700);
    const init = lit(seed, salt * 17, 2, 90);
    const shift = lit(seed, salt * 19, 1, 7);
    const mask = lit(seed, salt * 23, 255, 65000);
    const xor = lit(seed, salt * 29, 3, 240);
    const str = seedStr(mix32(seed ^ salt));
    const arr = seedArr(mix32(seed ^ (salt * 7)));
    const n1 = lit(seed, salt * 31, 2, 80);
    const n2 = lit(seed, salt * 37, 2, 80);
    const rad = lit(seed, salt * 41, 5, 60);
    const lo = lit(seed, salt * 43, 1, 9);
    specs.push({ shape, name, mul, mod, init, shift, mask, xor, str, arr, n1, n2, rad, lo });
    if (lang === "ts") {
      if (shape === 0) {
        helpers.push(
          `function ${name}(s: string): number {\n  let h = ${init};\n  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * ${mul}) % ${mod};\n  return h;\n}`,
        );
        calls.push(`void ${name}('${str}');`);
      } else if (shape === 1) {
        helpers.push(
          `function ${name}(nums: number[]): number {\n  let acc = ${init};\n  for (let i = 0; i < nums.length; i++) {\n    const n = nums[i];\n    if ((n & 1) === 0) continue;\n    acc = (acc + n * ${mul}) % ${mod};\n  }\n  return acc;\n}`,
        );
        calls.push(`void ${name}([${arr.join(", ")}]);`);
      } else if (shape === 2) {
        helpers.push(
          `function ${name}(n: number, m: number): number {\n  const span = (m % ${rad}) + ${lo};\n  const x = n % span;\n  return x < 0 ? x + span : x;\n}`,
        );
        calls.push(`void ${name}(${n1}, ${n2});`);
      } else if (shape === 3) {
        helpers.push(
          `function ${name}(n: number, k: number): number {\n  const x = (n ^ k) << ${shift};\n  return (x ^ ${xor}) & ${mask};\n}`,
        );
        calls.push(`void ${name}(${n1}, ${n2});`);
      } else {
        helpers.push(
          `function ${name}(s: string): number {\n  let x = ${init};\n  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${mul}) ^ ${xor};\n  return x & ${mask};\n}`,
        );
        calls.push(`void ${name}('${str}');`);
      }
    }
  });
  return { helpers, calls, specs };
}

function kotlinHelper(spec) {
  const { shape, name, mul, mod, init, shift, mask, xor, rad, lo } = spec;
  if (shape === 0) {
    return `private fun ${name}(s: String): Int {\n  var h = ${init}\n  for (i in s.indices) h = (h xor (s[i].code * ${mul})) % ${mod}\n  return h\n}`;
  }
  if (shape === 1) {
    return `private fun ${name}(nums: IntArray): Int {\n  var acc = ${init}\n  for (n in nums) {\n    if ((n and 1) == 0) continue\n    acc = (acc + n * ${mul}) % ${mod}\n  }\n  return acc\n}`;
  }
  if (shape === 2) {
    return `private fun ${name}(n: Int, m: Int): Int {\n  val span = (m % ${rad}) + ${lo}\n  val x = n % span\n  return if (x < 0) x + span else x\n}`;
  }
  if (shape === 3) {
    return `private fun ${name}(n: Int, k: Int): Int {\n  val x = (n xor k) shl ${shift}\n  return (x xor ${xor}) and ${mask}\n}`;
  }
  return `private fun ${name}(s: String): Int {\n  var x = ${init}\n  for (i in s.indices) x = (x + s[i].code * ${mul}) xor ${xor}\n  return x and ${mask}\n}`;
}

function javaHelper(spec) {
  const { shape, name, mul, mod, init, shift, mask, xor, rad, lo } = spec;
  if (shape === 0) {
    return `    private static int ${name}(String s) {\n        int h = ${init};\n        for (int i = 0; i < s.length(); i++) h = (h ^ (s.charAt(i) * ${mul})) % ${mod};\n        return h;\n    }`;
  }
  if (shape === 1) {
    return `    private static int ${name}(int[] nums) {\n        int acc = ${init};\n        for (int n : nums) {\n            if ((n & 1) == 0) continue;\n            acc = (acc + n * ${mul}) % ${mod};\n        }\n        return acc;\n    }`;
  }
  if (shape === 2) {
    return `    private static int ${name}(int n, int m) {\n        int span = (m % ${rad}) + ${lo};\n        int x = n % span;\n        return x < 0 ? x + span : x;\n    }`;
  }
  if (shape === 3) {
    return `    private static int ${name}(int n, int k) {\n        int x = (n ^ k) << ${shift};\n        return (x ^ ${xor}) & ${mask};\n    }`;
  }
  return `    private static int ${name}(String s) {\n        int x = ${init};\n        for (int i = 0; i < s.length(); i++) x = (x + s.charAt(i) * ${mul}) ^ ${xor};\n        return x & ${mask};\n    }`;
}

function sinkExpr(specs, lang) {
  const parts = specs.map((spec) => {
    if (spec.shape === 0 || spec.shape === 4) return `${spec.name}("${spec.str}")`;
    if (spec.shape === 1) {
      return lang === "kt"
        ? `${spec.name}(intArrayOf(${spec.arr.join(", ")}))`
        : `${spec.name}(new int[]{${spec.arr.join(", ")}})`;
    }
    return `${spec.name}(${spec.n1}, ${spec.n2})`;
  });
  return parts.join(lang === "kt" ? " xor " : " ^ ");
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
  if (p && ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)) return p.name.text;
  return "";
}

function isDummyHelperName(name) {
  if (!name) return false;
  if (/ObfV\d+/.test(name)) return true;
  if (/GameMixSeed$|GameFoldRange$|GameClampSpan$/.test(name)) return true;
  return false;
}

function helperNodeSet(sf) {
  const set = new Set();
  function visit(node) {
    if (isFunctionLike(node) && isDummyHelperName(functionLikeName(node))) set.add(node);
    ts.forEachChild(node, visit);
  }
  visit(sf);
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

function indentAt(text, pos) {
  const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
  const m = text.slice(lineStart, pos).match(/^[ \t]*/);
  return m ? m[0] : "";
}

function bodyHasFunction(body) {
  let found = false;
  function visit(node) {
    if (found) return;
    if (isFunctionLike(node)) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

function stripVoidInsideDummyHelpers(file, text) {
  const sf = parse(file, text);
  const helpers = helperNodeSet(sf);
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
  ranges.sort((a, b) => b.start - a.start);
  let out = text;
  for (const r of ranges) out = out.slice(0, r.start) + out.slice(r.end);
  return out;
}

function injectTs(file) {
  let text = fs.readFileSync(file, "utf8");
  if (text.includes(`ObfV17`) || text.includes(`obfuscation-batch:${BATCH}`)) {
    return { skipped: true, callers: 0 };
  }
  const nl = nlOf(text);
  text = stripVoidInsideDummyHelpers(file, text);
  const slug = helperSlug(file);
  const seed = fnv1a(`${FRAG}|${slug}|${BATCH}`);
  const batch = buildBatch(slug, seed, "ts");
  const calls = batch.calls.map((c) => c.replace(/\n/g, nl));
  const marker = calls[0];
  let callers = 0;

  function applyEdits(src, edits) {
    edits.sort((a, b) => b.start - a.start);
    let out = src;
    for (const ed of edits) out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    return out;
  }

  for (let guard = 0; guard < 16; guard++) {
    const sf = parse(file, text);
    const helpers = helperNodeSet(sf);
    const edits = [];
    function visit(node) {
      if (!isFunctionLike(node) || !node.body) {
        ts.forEachChild(node, visit);
        return;
      }
      if (helpers.has(node) || insideHelper(node, helpers) || isDummyHelperName(functionLikeName(node))) {
        ts.forEachChild(node, visit);
        return;
      }
      if (!ts.isBlock(node.body) && !bodyHasFunction(node.body)) {
        const expr = text.slice(node.body.getStart(sf), node.body.end);
        if (!expr.includes(marker)) {
          const base = indentAt(text, node.body.getStart(sf));
          const inner = calls.map((l) => base + "  " + l).join(nl);
          edits.push({
            start: node.body.getStart(sf),
            end: node.body.end,
            text: `{${nl}${inner}${nl}${base}  return ${expr};${nl}${base}}`,
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) break;
    text = applyEdits(text, edits);
  }

  for (let guard = 0; guard < 8; guard++) {
    const sf = parse(file, text);
    const helpers = helperNodeSet(sf);
    const edits = [];
    function visit(node) {
      if (!isFunctionLike(node) || !node.body) {
        ts.forEachChild(node, visit);
        return;
      }
      if (helpers.has(node) || insideHelper(node, helpers) || isDummyHelperName(functionLikeName(node))) {
        ts.forEachChild(node, visit);
        return;
      }
      if (!ts.isBlock(node.body)) {
        const expr = text.slice(node.body.getStart(sf), node.body.end);
        if (!expr.includes(marker)) {
          const base = indentAt(text, node.body.getStart(sf));
          const inner = calls.map((l) => base + "  " + l).join(nl);
          edits.push({
            start: node.body.getStart(sf),
            end: node.body.end,
            text: `{${nl}${inner}${nl}${base}  return ${expr};${nl}${base}}`,
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) break;
    text = applyEdits(text, edits);
  }

  const sf = parse(file, text);
  const helpers = helperNodeSet(sf);
  const spots = [];
  function visitBlocks(node) {
    if (
      isFunctionLike(node) &&
      node.body &&
      ts.isBlock(node.body) &&
      !helpers.has(node) &&
      !insideHelper(node, helpers) &&
      !isDummyHelperName(functionLikeName(node))
    ) {
      const bodyText = node.body.getText(sf);
      if (!bodyText.includes(marker)) {
        const body = node.body;
        const stmt = body.statements[0];
        let indent = "  ";
        let at = body.getStart(sf) + 1;
        if (stmt) {
          at = stmt.getFullStart();
          const stmtPos = stmt.getStart(sf);
          const m = text.slice(text.lastIndexOf("\n", stmtPos - 1) + 1, stmtPos).match(/^[ \t]*/);
          indent = m ? m[0] : "  ";
        } else {
          indent = indentAt(text, body.getStart(sf)) + "  ";
          at = body.getStart(sf) + 1;
        }
        spots.push({ at, indent });
      }
      callers += 1;
    }
    ts.forEachChild(node, visitBlocks);
  }
  visitBlocks(sf);
  spots.sort((a, b) => b.at - a.at);
  for (const spot of spots) {
    const payload = calls.map((l) => spot.indent + l).join(nl) + nl;
    text = text.slice(0, spot.at) + payload + text.slice(spot.at);
  }
  const block =
    nl +
    `/* obfuscation-batch:${BATCH} */` +
    nl +
    batch.helpers.join(nl).replace(/\n/g, nl) +
    nl;
  if (callers === 0) text = text.replace(/\s*$/, "") + block + calls.join(nl) + nl;
  else text = text.replace(/\s*$/, "") + block;
  fs.writeFileSync(file, text);
  return { skipped: false, callers, calls, slug };
}

function verifyTs(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const problems = [];
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) {
    problems.push(`parse ${sf.parseDiagnostics.length}`);
  }
  const slug = helperSlug(file);
  const seed = fnv1a(`${FRAG}|${slug}|${BATCH}`);
  const batch = buildBatch(slug, seed, "ts");
  const helpers = helperNodeSet(sf);
  let callers = 0;
  function visit(node) {
    if (isFunctionLike(node) && node.body && ts.isBlock(node.body)) {
      const name = functionLikeName(node);
      const body = node.body.getText();
      if (helpers.has(node) || isDummyHelperName(name)) {
        if (name.includes("ObfV17") && /\bvoid\s+/.test(body)) problems.push(`void inside ${name}`);
      } else if (!insideHelper(node, helpers)) {
        callers += 1;
        for (const c of batch.calls) {
          if (!body.includes(c)) problems.push(`missing call in ${name || "<anon>"}`);
        }
      }
    } else if (
      isFunctionLike(node) &&
      node.body &&
      !ts.isBlock(node.body) &&
      !helpers.has(node) &&
      !insideHelper(node, helpers) &&
      !isDummyHelperName(functionLikeName(node))
    ) {
      problems.push(`expr body left in ${functionLikeName(node) || "<anon>"}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  for (const h of batch.helpers) {
    const nm = h.match(/function (\w+)/)[1];
    if (!text.includes(`function ${nm}`)) problems.push(`missing helper ${nm}`);
  }
  if (callers === 0) {
    for (const c of batch.calls) {
      if (!text.includes(c)) problems.push(`missing module call`);
    }
  }
  return problems;
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
      ts.isJsxAttribute(p) ||
      ts.isShorthandPropertyAssignment(p)) &&
    p.name === node
  ) {
    return true;
  }
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

function collectExportedNames(files) {
  const names = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const sf = parse(file, text);
    sf.forEachChild((node) => {
      const exported = (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported) return;
      if (
        (ts.isFunctionDeclaration(node) ||
          ts.isClassDeclaration(node) ||
          ts.isInterfaceDeclaration(node) ||
          ts.isTypeAliasDeclaration(node) ||
          ts.isEnumDeclaration(node)) &&
        node.name
      ) {
        names.add(node.name.text);
      }
      if (ts.isVariableStatement(node)) {
        for (const d of node.declarationList.declarations) {
          if (ts.isIdentifier(d.name)) names.add(d.name.text);
        }
      }
    });
  }
  return names;
}

function buildExportMap(names) {
  const taken = new Set(names);
  const map = new Map();
  for (const name of [...names].sort()) {
    if (name.includes(FRAG)) continue;
    let next = baseInsert(name);
    if (!next || next === name) continue;
    let n = 2;
    while (taken.has(next) && next !== name) {
      next = baseInsert(name) + "X" + n;
      n += 1;
    }
    taken.add(next);
    map.set(name, next);
  }
  return map;
}

function isPropsParam(param) {
  if (!param || !param.type) return false;
  if (ts.isTypeLiteralNode(param.type)) return true;
  if (ts.isTypeReferenceNode(param.type) && ts.isIdentifier(param.type.typeName)) {
    return /Props$/.test(param.type.typeName.text);
  }
  return false;
}

function collectPropsModel(file, sf) {
  const tagProps = new Map();
  function addFromBinding(name, param) {
    if (!ts.isObjectBindingPattern(param.name)) return;
    const set = tagProps.get(name) || new Set();
    for (const el of param.name.elements) {
      if (ts.isIdentifier(el.name) && !RESERVED_PROPS.has(el.name.text) && !el.name.text.includes(FRAG)) {
        set.add(el.name.text);
      }
    }
    if (set.size) tagProps.set(name, set);
  }
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      for (const p of node.parameters) {
        if (isPropsParam(p)) addFromBinding(node.name.text, p);
      }
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      for (const p of node.initializer.parameters) {
        if (isPropsParam(p)) addFromBinding(node.name.text, p);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  const typeFields = new Map();
  function visitTypes(node) {
    if (ts.isTypeAliasDeclaration(node) && /Props$/.test(node.name.text) && ts.isTypeLiteralNode(node.type)) {
      const set = new Set();
      for (const m of node.type.members) {
        if (m.name && ts.isIdentifier(m.name) && !RESERVED_PROPS.has(m.name.text) && !m.name.text.includes(FRAG)) {
          set.add(m.name.text);
        }
      }
      typeFields.set(node.name.text, set);
    }
    ts.forEachChild(node, visitTypes);
  }
  visitTypes(sf);
  return { tagProps, typeFields, file };
}

function jsxTagText(attr) {
  let cur = attr.parent;
  while (cur && !ts.isJsxOpeningElement(cur) && !ts.isJsxSelfClosingElement(cur)) cur = cur.parent;
  if (!cur || !cur.tagName || !ts.isIdentifier(cur.tagName)) return "";
  return cur.tagName.text;
}

function resolveRel(fromFile, spec) {
  if (!spec.startsWith(".")) return "";
  const abs = path.resolve(path.dirname(fromFile), spec);
  for (const ext of [".ts", ".tsx"]) {
    const c = abs + ext;
    if (fs.existsSync(c)) return path.normalize(c);
  }
  const idx = path.join(abs, "index.ts");
  if (fs.existsSync(idx)) return path.normalize(idx);
  return "";
}

function applyGameRenames(files, exportMap, propsByFile) {
  let filesChanged = 0;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const sf = parse(file, text);
    const styleKeys = new Set();
    function collectStyles(node) {
      if (
        (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
        node.name &&
        ts.isIdentifier(node.name) &&
        isDirectStyleSheetKey(node)
      ) {
        const n = node.name.text;
        if (n && !n.includes(FRAG)) styleKeys.add(n);
      }
      ts.forEachChild(node, collectStyles);
    }
    collectStyles(sf);

    const importProps = new Map();
    const localTags = new Set();
    sf.forEachChild((node) => {
      if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text)) {
        localTags.add(node.name.text);
      }
      if (!ts.isImportDeclaration(node) || !node.importClause || !ts.isStringLiteral(node.moduleSpecifier)) return;
      const spec = node.moduleSpecifier.text;
      if (!spec.startsWith(".")) return;
      const resolved = resolveRel(file, spec);
      const model = propsByFile.get(resolved);
      if (!model) return;
      const clause = node.importClause;
      if (clause.name) {
        localTags.add(clause.name.text);
        const props = model.tagProps.get("default") || model.tagProps.get(clause.name.text);
        if (props) importProps.set(clause.name.text, props);
      }
      const b = clause.namedBindings;
      if (b && ts.isNamedImports(b)) {
        for (const el of b.elements) {
          const exported = el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : el.name.text;
          const local = el.name.text;
          if (/^[A-Z]/.test(local)) localTags.add(local);
          if (model.tagProps.has(exported)) importProps.set(local, model.tagProps.get(exported));
          else if (model.tagProps.has(local)) importProps.set(local, model.tagProps.get(local));
        }
      }
    });
    const own = propsByFile.get(path.normalize(file));
    if (own) {
      for (const [tag, props] of own.tagProps) importProps.set(tag, props);
    }

    const propMap = new Map();
    const allPropNames = new Set();
    for (const set of importProps.values()) for (const n of set) allPropNames.add(n);
    if (own) for (const set of own.typeFields.values()) for (const n of set) allPropNames.add(n);
    for (const n of allPropNames) {
      if (!exportMap.has(n)) propMap.set(n, baseInsert(n));
    }

    const fnPropSpans = [];
    function markFn(node, name) {
      const props = importProps.get(name);
      if (!props || !node.body) return;
      fnPropSpans.push({ start: node.getStart(sf), end: node.end, props });
    }
    function findFns(node) {
      if (ts.isFunctionDeclaration(node) && node.name) markFn(node, node.name.text);
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
      ) {
        markFn(node.initializer, node.name.text);
      }
      ts.forEachChild(node, findFns);
    }
    findFns(sf);

    const edits = [];
    function visit(node) {
      if (ts.isIdentifier(node)) {
        const raw = node.text;
        const parent = node.parent;
        let mode = "";
        let next = "";
        if (styleKeys.has(raw) && parent && (ts.isPropertyAssignment(parent) || ts.isShorthandPropertyAssignment(parent)) && parent.name === node && isDirectStyleSheetKey(parent)) {
          mode = "rename";
          next = baseInsert(raw);
        } else if (
          styleKeys.has(raw) &&
          parent &&
          ts.isPropertyAccessExpression(parent) &&
          parent.name === node &&
          ts.isIdentifier(parent.expression) &&
          parent.expression.text === "styles"
        ) {
          mode = "rename";
          next = baseInsert(raw);
        } else if (parent && ts.isJsxAttribute(parent) && parent.name === node && propMap.has(raw)) {
          const tag = jsxTagText(parent);
          const props = importProps.get(tag);
          if (props && props.has(raw)) {
            mode = "rename";
            next = propMap.get(raw);
          }
        } else if (parent && ts.isBindingElement(parent) && parent.name === node && !parent.propertyName && propMap.has(raw)) {
          const pat = parent.parent;
          const param = pat && pat.parent;
          if (param && ts.isParameter(param) && isPropsParam(param)) {
            mode = "rename";
            next = propMap.get(raw);
          }
        } else if (parent && ts.isPropertySignature(parent) && parent.name === node && propMap.has(raw)) {
          const typeLit = parent.parent;
          const owner = typeLit && typeLit.parent;
          if (owner && ts.isTypeAliasDeclaration(owner) && /Props$/.test(owner.name.text)) {
            mode = "rename";
            next = propMap.get(raw);
          } else if (owner && ts.isParameter(owner)) {
            mode = "rename";
            next = propMap.get(raw);
          }
        } else if (exportMap.has(raw) && parent && ts.isShorthandPropertyAssignment(parent) && parent.name === node) {
          mode = "expand";
          next = `${raw}: ${exportMap.get(raw)}`;
        } else if (exportMap.has(raw) && parent && ts.isBindingElement(parent) && parent.name === node && !parent.propertyName) {
          mode = "expand";
          next = `${raw}: ${exportMap.get(raw)}`;
        } else if (exportMap.has(raw) && !isPropertyNameIdent(node)) {
          mode = "rename";
          next = exportMap.get(raw);
        } else if (propMap.has(raw) && !isPropertyNameIdent(node)) {
          const pos = node.getStart(sf);
          for (const span of fnPropSpans) {
            if (pos >= span.start && pos < span.end && span.props.has(raw)) {
              mode = "rename";
              next = propMap.get(raw);
              break;
            }
          }
        }
        if (mode === "rename" && next && next !== raw) {
          edits.push({ start: node.getStart(sf), end: node.end, text: next });
        } else if (mode === "expand" && next) {
          edits.push({ start: node.getStart(sf), end: node.end, text: next });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    if (!edits.length) continue;
    edits.sort((a, b) => b.start - a.start);
    let out = text;
    for (const ed of edits) {
      const slice = out.slice(ed.start, ed.end);
      if (slice.includes(FRAG) && ed.text.includes(FRAG)) {
        /* still replace when expanding a name that lacks the fragment */
      }
      if (slice.includes(FRAG) && !ed.text.startsWith(slice + ":")) continue;
      out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    }
    if (out !== text) {
      fs.writeFileSync(file, out);
      filesChanged += 1;
    }
  }
  return filesChanged;
}

function maskNonCode(text) {
  const out = text.split("");
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (c === "/" && n === "/") {
      while (i < text.length && text[i] !== "\n") {
        out[i] = " ";
        i++;
      }
      continue;
    }
    if (c === "/" && n === "*") {
      out[i] = " ";
      out[i + 1] = " ";
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) {
        if (text[i] !== "\n") out[i] = " ";
        i++;
      }
      if (i < text.length) {
        out[i] = " ";
        if (i + 1 < text.length) out[i + 1] = " ";
        i += 2;
      }
      continue;
    }
    if (c === '"' && text[i + 1] === '"' && text[i + 2] === '"') {
      out[i] = out[i + 1] = out[i + 2] = " ";
      i += 3;
      while (i < text.length && !(text[i] === '"' && text[i + 1] === '"' && text[i + 2] === '"')) {
        if (text[i] !== "\n") out[i] = " ";
        i++;
      }
      if (i < text.length) {
        out[i] = out[i + 1] = out[i + 2] = " ";
        i += 3;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      out[i] = " ";
      i++;
      while (i < text.length) {
        if (text[i] === "\\") {
          out[i] = " ";
          if (i + 1 < text.length) {
            if (text[i + 1] !== "\n") out[i + 1] = " ";
            i += 2;
            continue;
          }
        }
        if (text[i] === q) {
          out[i] = " ";
          i++;
          break;
        }
        if (text[i] !== "\n") out[i] = " ";
        i++;
      }
      continue;
    }
    i++;
  }
  return out.join("");
}

function braceBalance(text) {
  const mask = maskNonCode(text);
  let d = 0;
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "{") d++;
    else if (mask[i] === "}") d--;
  }
  return d;
}

function matchParen(mask, openIdx) {
  let d = 0;
  for (let i = openIdx; i < mask.length; i++) {
    if (mask[i] === "(") d++;
    else if (mask[i] === ")") {
      d--;
      if (d === 0) return i;
    }
  }
  return -1;
}

function findBodyAfter(mask, afterParen) {
  let i = afterParen + 1;
  let angle = 0;
  while (i < mask.length) {
    const c = mask[i];
    if (c === "<") angle++;
    else if (c === ">") angle = Math.max(0, angle - 1);
    else if (angle === 0 && c === "{") return { kind: "block", at: i };
    else if (angle === 0 && c === "=" && mask[i + 1] !== "=" && mask[i - 1] !== "=" && mask[i - 1] !== "!" && mask[i - 1] !== "<" && mask[i - 1] !== ">") {
      return { kind: "expr", at: i };
    } else if (angle === 0 && c === ";") return null;
    i++;
  }
  return null;
}

function findExprEnd(mask, eqIdx) {
  let i = eqIdx + 1;
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  while (i < mask.length) {
    const c = mask[i];
    if (c === "(") paren++;
    else if (c === ")") {
      if (paren === 0 && brace === 0) break;
      paren--;
    } else if (c === "{") brace++;
    else if (c === "}") {
      if (brace === 0) break;
      brace--;
    } else if (c === "[") bracket++;
    else if (c === "]") bracket--;
    else if (c === "\n" && paren === 0 && brace === 0 && bracket === 0) {
      let j = i + 1;
      while (j < mask.length && (mask[j] === " " || mask[j] === "\t" || mask[j] === "\r" || mask[j] === "\n")) j++;
      const nxt = mask[j];
      if (nxt !== "." && nxt !== "?" && nxt !== ":" && nxt !== "+" && nxt !== "-" && nxt !== "&" && nxt !== "|" && nxt !== "*" && nxt !== "/" && nxt !== ",") {
        return i;
      }
    }
    i++;
  }
  return i;
}

function wordAt(mask, i) {
  return (i <= 0 || !/[A-Za-z0-9_]/.test(mask[i - 1])) && (i + 1 >= mask.length || !/[A-Za-z0-9_]/.test(mask[i + 3] || " "));
}

function collectKotlinBodies(text) {
  const mask = maskNonCode(text);
  const bodies = [];
  const seen = new Set();
  function addBody(name, body) {
    if (!body || seen.has(body.kind === "block" ? body.at : body.at)) return;
    if (/ObfV\d+/.test(name)) return;
    seen.add(body.kind === "block" ? body.at : body.at);
    bodies.push({ name, body });
  }
  for (let i = 0; i < mask.length; i++) {
    if (mask.startsWith("fun", i) && (i === 0 || !/[A-Za-z0-9_]/.test(mask[i - 1])) && !/[A-Za-z0-9_]/.test(mask[i + 3] || " ")) {
      if (mask.slice(i + 3).match(/^\s+interface\b/)) continue;
      let j = i + 3;
      while (j < mask.length && /\s/.test(mask[j])) j++;
      if (mask[j] === "<") {
        let a = 0;
        for (; j < mask.length; j++) {
          if (mask[j] === "<") a++;
          else if (mask[j] === ">") {
            a--;
            if (a === 0) {
              j++;
              break;
            }
          }
        }
        while (j < mask.length && /\s/.test(mask[j])) j++;
      }
      const m = mask.slice(j).match(/^(?:[\w.]+\.)?(\w+)\s*\(/);
      if (!m) continue;
      const paren = j + m[0].length - 1;
      const close = matchParen(mask, paren);
      if (close < 0) continue;
      const body = findBodyAfter(mask, close);
      addBody(m[1], body);
    }
    if (mask.startsWith("init", i) && (i === 0 || !/[A-Za-z0-9_]/.test(mask[i - 1])) && !/[A-Za-z0-9_]/.test(mask[i + 4] || " ")) {
      const rest = mask.slice(i + 4);
      const mm = rest.match(/^\s*\{/);
      if (mm) addBody("init", { kind: "block", at: i + 4 + mm[0].length - 1 });
    }
    if ((mask.startsWith("get", i) || mask.startsWith("set", i)) && (i === 0 || !/[A-Za-z0-9_]/.test(mask[i - 1]))) {
      const kind = mask.startsWith("get", i) ? "get" : "set";
      const lineStart = mask.lastIndexOf("\n", i - 1) + 1;
      const prefix = mask.slice(lineStart, i).trim();
      if (prefix && !/^(?:(?:override|private|public|protected|internal|final|open|abstract)\s+)+$/.test(prefix)) continue;
      const mm = mask.slice(i).match(kind === "get" ? /^get\s*\(\s*\)/ : /^set\s*\(/);
      if (!mm) continue;
      const paren = i + mm[0].lastIndexOf("(");
      const close = kind === "get" ? i + mm[0].length - 1 : matchParen(mask, paren);
      if (close < 0) continue;
      const body = findBodyAfter(mask, close);
      addBody(kind, body);
    }
  }
  return bodies;
}

function collectJavaBodies(text) {
  const mask = maskNonCode(text);
  const bodies = [];
  const seen = new Set();
  const re = /\b(?:public|private|protected)\b/g;
  let m;
  while ((m = re.exec(mask))) {
    const from = m.index;
    const window = mask.slice(from, Math.min(mask.length, from + 500));
    const sig = window.match(
      /^(?:public|private|protected)(?:\s+(?:static|final|synchronized|native|abstract))*\s+[^;{}=]*?\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/,
    );
    if (!sig) continue;
    const name = sig[1];
    if (/^(if|for|while|switch|catch|return|new|class|interface|enum)$/.test(name)) continue;
    const paren = from + sig[0].length - 1;
    const close = matchParen(mask, paren);
    if (close < 0) continue;
    const body = findBodyAfter(mask, close);
    if (!body || body.kind !== "block" || seen.has(body.at)) continue;
    seen.add(body.at);
    bodies.push({ name, body });
    re.lastIndex = close;
  }
  return bodies;
}

function bodyIndent(text, braceIdx) {
  const braceLineStart = text.lastIndexOf("\n", braceIdx - 1) + 1;
  const braceIndent = (text.slice(braceLineStart, braceIdx).match(/^[ \t]*/) || [""])[0];
  let i = braceIdx + 1;
  if (text[i] === "\r") i++;
  if (text[i] === "\n") {
    const nextStart = i + 1;
    const nextEnd = text.indexOf("\n", nextStart);
    const next = text.slice(nextStart, nextEnd === -1 ? text.length : nextEnd).replace(/\r$/, "");
    const mm = next.match(/^[ \t]+/);
    if (mm && mm[0].length > braceIndent.length) return mm[0];
  }
  return braceIndent + "    ";
}

function lineIndent(text, idx) {
  const lineStart = text.lastIndexOf("\n", idx - 1) + 1;
  return (text.slice(lineStart, idx).match(/^[ \t]*/) || [""])[0];
}

function injectHost(file) {
  const original = fs.readFileSync(file, "utf8");
  if (original.includes("autosetup-decoy:v1") || original.includes("dex-lanes:v1")) return { skipped: true };
  if (original.includes("ObfV17") || original.includes(`obfuscation-batch:${BATCH}`)) return { skipped: true };
  const isKt = file.endsWith(".kt");
  const lang = isKt ? "kt" : "java";
  const nl = nlOf(original);
  const slug = helperSlug(file);
  const seed = fnv1a(`${FRAG}|${slug}|${BATCH}`);
  const batch = buildBatch(slug, seed, "ts");
  const sinkCore = sinkExpr(batch.specs, lang);
  const sinkLine = isKt
    ? `@Suppress("UNUSED_VARIABLE") val ${FRAG}SinkV17 = ${sinkCore}`
    : `@SuppressWarnings("unused") final int ${FRAG}SinkV17 = ${sinkCore};`;
  const bodies = isKt ? collectKotlinBodies(original) : collectJavaBodies(original);
  const edits = [];
  for (const item of bodies) {
    const body = item.body;
    if (body.kind === "block") {
      const brace = body.at;
      const ind = bodyIndent(original, brace);
      let at = brace + 1;
      let payload;
      if (original[at] === "\r") at++;
      if (original[at] === "\n") {
        at++;
        payload = ind + sinkLine + nl;
      } else {
        const base = lineIndent(original, brace);
        payload = nl + ind + sinkLine + nl + base;
      }
      edits.push({ at, payload });
    } else {
      const eq = body.at;
      const mask = maskNonCode(original);
      const end = findExprEnd(mask, eq);
      const expr = original.slice(eq + 1, end).trim();
      if (!expr) continue;
      const base = lineIndent(original, eq);
      const ind = base + "    ";
      const ret = expr.startsWith("throw ") ? expr : `return ${expr}`;
      const payload = `{${nl}${ind}${sinkLine}${nl}${ind}${ret}${nl}${base}}`;
      edits.push({ at: eq, end, payload, replace: true });
    }
  }
  edits.sort((a, b) => b.at - a.at);
  let text = original;
  for (const ed of edits) {
    if (ed.replace) text = text.slice(0, ed.at) + ed.payload + text.slice(ed.end);
    else text = text.slice(0, ed.at) + ed.payload + text.slice(ed.at);
  }
  const helperSrc = batch.specs
    .map((spec) => (isKt ? kotlinHelper(spec) : javaHelper(spec)))
    .join(nl + nl);
  const marked = `${nl}/* obfuscation-batch:${BATCH} */${nl}${helperSrc.replace(/\n/g, nl)}${nl}`;
  if (isKt) {
    text = text.replace(/\s*$/, "") + marked;
  } else {
    const mask = maskNonCode(text);
    let depth = 0;
    let classBrace = -1;
    const classRe = /\b(?:class|interface|enum)\s+[A-Za-z0-9_]+/g;
    let cm;
    while ((cm = classRe.exec(mask))) {
      const lineStart = mask.lastIndexOf("\n", cm.index - 1) + 1;
      const prefix = mask.slice(lineStart, cm.index);
      if (prefix.includes("{")) continue;
      let k = cm.index + cm[0].length;
      while (k < mask.length && mask[k] !== "{" && mask[k] !== ";") k++;
      if (mask[k] === "{") {
        classBrace = k;
        break;
      }
    }
    if (classBrace < 0) {
      text = text.replace(/\s*$/, "") + marked;
    } else {
      let d = 0;
      let close = -1;
      for (let i = classBrace; i < mask.length; i++) {
        if (mask[i] === "{") d++;
        else if (mask[i] === "}") {
          d--;
          if (d === 0) {
            close = i;
            break;
          }
        }
      }
      if (close < 0) text = text.replace(/\s*$/, "") + marked;
      else {
        const ind = lineIndent(text, close);
        const block = `${nl}${ind}/* obfuscation-batch:${BATCH} */${nl}${helperSrc.replace(/\n/g, nl).replace(/^/gm, ind)}${nl}`;
        text = text.slice(0, close) + block + text.slice(close);
      }
    }
  }
  if (braceBalance(text) !== 0 || braceBalance(original) !== braceBalance(text)) {
    console.log("BRACE FAIL", path.relative(root, file), "methods", bodies.length);
    return { skipped: false, failed: true, methods: bodies.length };
  }
  fs.writeFileSync(file, text);
  return { skipped: false, failed: false, methods: bodies.length, helpers: batch.specs.length };
}

function collectStrings(file) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const set = new Set();
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) set.add(node.text);
    if (ts.isJsxText(node)) set.add(node.getText());
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return set;
}

function scanUi(file, beforeStrings) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const hits = [];
  function isModuleSpec(node) {
    const p = node.parent;
    if (!p) return false;
    if ((ts.isImportDeclaration(p) || ts.isExportDeclaration(p)) && p.moduleSpecifier === node) return true;
    if (ts.isCallExpression(p) && p.expression && ts.isIdentifier(p.expression) && p.expression.text === "require") return true;
    return false;
  }
  function visit(node) {
    if (ts.isJsxText(node) && node.getText().includes(FRAG)) hits.push(node.getText().trim().slice(0, 80));
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && node.text.includes(FRAG) && !isModuleSpec(node)) {
      if (!beforeStrings.has(node.text)) hits.push(node.text.slice(0, 80));
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return hits;
}

function resolveImport(fromFile, spec) {
  if (!spec.startsWith(".")) return true;
  const abs = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    abs,
    abs + ".ts",
    abs + ".tsx",
    abs + ".js",
    abs + ".jsx",
    path.join(abs, "index.ts"),
    path.join(abs, "index.tsx"),
    path.join(abs, "index.js"),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

function scanBrokenImports(dirs) {
  const problems = [];
  const re = /(?:require\s*\(\s*|from\s+)(['"])(\.\.?\/[^'"]+)\1/g;
  for (const dir of dirs) {
    const files = walk(dir, (p) => /\.(tsx?|jsx?)$/.test(p));
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      let m;
      const r = new RegExp(re.source, "g");
      while ((m = r.exec(text))) {
        if (!resolveImport(file, m[2])) {
          problems.push(`${path.relative(root, file)} -> ${m[2]}`);
        }
      }
    }
  }
  return problems;
}

function main() {
  const gameFiles = walk(gameRoot, (p) => /\.tsx?$/.test(p) && !p.endsWith(".d.ts"));
  const serviceFiles = walk(servicesRoot, (p) => /\.tsx?$/.test(p) && !p.endsWith(".d.ts"));
  const beforeStrings = new Set();
  for (const f of gameFiles) for (const s of collectStrings(f)) beforeStrings.add(s);

  const exported = collectExportedNames(gameFiles);
  const exportMap = buildExportMap(exported);
  console.log("export renames", exportMap.size);

  const propsByFile = new Map();
  for (const file of gameFiles) {
    const text = fs.readFileSync(file, "utf8");
    const sf = parse(file, text);
    const model = collectPropsModel(file, sf);
    for (const [tag, props] of model.tagProps) {
      if (tag !== "default") model.tagProps.set(tag, props);
    }
    sf.forEachChild((node) => {
      const isDefault = (node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      if (isDefault && ts.isFunctionDeclaration(node) && node.name && model.tagProps.has(node.name.text)) {
        model.tagProps.set("default", model.tagProps.get(node.name.text));
      }
      if (!ts.isExportAssignment(node)) return;
      const expr = node.expression;
      if (ts.isIdentifier(expr) && model.tagProps.has(expr.text)) {
        model.tagProps.set("default", model.tagProps.get(expr.text));
      }
    });
    propsByFile.set(path.normalize(file), model);
  }
  const renamedFiles = applyGameRenames(gameFiles, exportMap, propsByFile);
  console.log("renamed files", renamedFiles);

  const tsFiles = [...serviceFiles, ...walk(gameRoot, (p) => /\.tsx?$/.test(p) && !p.endsWith(".d.ts"))];
  let injected = 0;
  let callers = 0;
  for (const file of tsFiles) {
    const r = injectTs(file);
    if (!r.skipped) {
      injected += 1;
      callers += r.callers;
    }
  }
  console.log("ts v17 files", injected, "callers", callers);

  const hostFiles = walk(javaRoot, (p, name) => /\.(kt|java)$/.test(name) && !p.includes(`${path.sep}build${path.sep}`) && !p.includes(`${path.sep}rnobfuscator${path.sep}`));
  let hostOk = 0;
  let hostFail = 0;
  for (const file of hostFiles) {
    const r = injectHost(file);
    if (r.failed) hostFail += 1;
    else if (!r.skipped) hostOk += 1;
  }
  console.log("host files", hostOk, "brace fails", hostFail);

  const uiHits = [];
  for (const file of walk(gameRoot, (p) => /\.tsx?$/.test(p))) {
    const hits = scanUi(file, beforeStrings);
    if (hits.length) uiHits.push({ file: path.relative(root, file), hits });
  }
  console.log("ui hits", JSON.stringify(uiHits));

  let verifyProblems = 0;
  for (const file of tsFiles) {
    const problems = verifyTs(file);
    if (problems.length) {
      verifyProblems += problems.length;
      console.log("VERIFY", path.relative(root, file), problems.slice(0, 6));
    }
  }
  console.log("verify problems", verifyProblems);

  const broken = scanBrokenImports(
    [servicesRoot, path.join(root, "Layouts")].filter((p) => fs.existsSync(p) && fs.statSync(p).isDirectory()),
  );
  const app = path.join(root, "App.tsx");
  const index = path.join(root, "index.js");
  const extra = [];
  for (const file of [app, index]) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const re = /(?:require\s*\(\s*|from\s+)(['"])(\.\.?\/[^'"]+)\1/g;
    let m;
    while ((m = re.exec(text))) {
      if (!resolveImport(file, m[2])) extra.push(`${path.relative(root, file)} -> ${m[2]}`);
    }
  }
  const allBroken = [...broken, ...extra];
  console.log("broken imports", allBroken.length);
  for (const b of allBroken.slice(0, 20)) console.log("BROKEN", b);
  if (verifyProblems || uiHits.length || hostFail || allBroken.length) process.exitCode = 2;
}

main();
