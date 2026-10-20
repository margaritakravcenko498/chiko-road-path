/**
 * One-shot obfuscation batch v26. Deleted after a clean run.
 * Helpers + Game module-level fragment renames. Does not rewrite cipher math.
 */
const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const BATCH = 26;
const MARKER = `/* obfuscation-batch:v${BATCH} */`;

const PLATFORM_METHODS = new Set([
  "stop", "start", "reset", "setValue", "setOffset", "flattenOffset",
  "extractOffset", "addListener", "removeListener", "removeAllListeners",
  "interpolate", "stopAnimation",
]);
const PLATFORM_STYLE = new Set([
  "transform", "opacity", "elevation", "translateX", "translateY",
  "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY",
]);
const SHAPES = ["hash-mix", "odd-sum", "clamp", "shift-xor", "byte-fold"];
const SHAPE_TAG = {
  "hash-mix": "HashMix",
  "odd-sum": "SumOdds",
  clamp: "ClampMod",
  "shift-xor": "ShiftXor",
  "byte-fold": "ByteFold",
};

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function makeRng(seed) {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x;
  };
}

function walkFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "build" || entry.name === "Pods") continue;
      walkFiles(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function nlOf(src) {
  return src.includes("\r\n") ? "\r\n" : "\n";
}

function parseTs(src, filename) {
  return parser.parse(src, {
    sourceType: "module",
    plugins: ["typescript", "jsx", "classProperties", "decorators-legacy"],
    errorRecovery: false,
  });
}

function isFunctionNode(node) {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression" ||
    node.type === "ObjectMethod" ||
    node.type === "ClassMethod" ||
    node.type === "ClassPrivateMethod"
  );
}

function funcName(node) {
  if (!node) return "";
  if (node.id && node.id.type === "Identifier") return node.id.name;
  const key = node.key;
  if (!key) return "";
  if (key.type === "Identifier") return key.name;
  if (key.type === "StringLiteral") return String(key.value);
  if (key.type === "PrivateName" && key.id) return key.id.name;
  return "";
}

function isHelperName(name) {
  if (!name) return false;
  if (/ObfV\d/.test(name)) return true;
  if (/GameMixSeed|GameFoldRange|GameClampSpan/.test(name)) return true;
  return false;
}

function insertFragment(name, salt) {
  if (!name || name.includes(FRAG)) return name;
  if (name.length < 2) return name + FRAG;
  const at = 1 + (fnv1a(`${salt}:${name}`) % (name.length - 1));
  return name.slice(0, at) + FRAG + name.slice(at);
}

function slugOf(file) {
  return path.basename(file).replace(/\.[^.]+$/, "").replace(/[^A-Za-z0-9_]/g, "") || "mod";
}

function pickShapes(rng) {
  const start = rng() % SHAPES.length;
  let count = (rng() % 3) + 2; // 2..4
  const picked = [];
  for (let i = 0; i < count; i++) picked.push(SHAPES[(start + i) % SHAPES.length]);
  const hasLoopOrShift = picked.some((s) => s !== "clamp");
  if (!hasLoopOrShift) picked[0] = "shift-xor";
  return picked;
}

function alnum(rng, len) {
  const alphabet = "abcdefghijklmnoprstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[rng() % alphabet.length];
  if (!s) s = "k3";
  return s;
}

function nz(rng, lo, span) {
  return lo + (rng() % span);
}

function buildBatch(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const rng = makeRng(fnv1a(`${FRAG}|${rel}|v${BATCH}`));
  const shapes = pickShapes(rng);
  const slug = slugOf(file);
  const helpers = [];
  const used = new Set();
  shapes.forEach((shape) => {
    let name = insertFragment(`${slug}ObfV${BATCH}${SHAPE_TAG[shape]}`, rel + shape);
    while (used.has(name)) name += "x";
    used.add(name);
    const mul = nz(rng, 3, 47);
    const mod = nz(rng, 80, 900);
    const acc = nz(rng, 11, 90);
    const shift = nz(rng, 1, 7);
    const xorc = nz(rng, 11, 220);
    const mask = nz(rng, 1000, 64000);
    const span = nz(rng, 18, 50);
    const base = nz(rng, 4, 12);
    const init = nz(rng, 7, 90);
    let params = "";
    let body = "";
    let call = "";
    if (shape === "hash-mix") {
      const s = alnum(rng, nz(rng, 2, 4));
      params = "s: string";
      body = `let h = ${acc};\n  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * ${mul}) % ${mod};\n  return h;`;
      call = `${name}('${s}')`;
    } else if (shape === "odd-sum") {
      const arr = [nz(rng, 1, 40) | 1, nz(rng, 2, 40), nz(rng, 1, 40) | 1];
      params = "nums: number[]";
      body = `let acc = ${acc};\n  for (let i = 0; i < nums.length; i++) {\n    const n = nums[i];\n    if ((n & 1) === 0) continue;\n    acc = (acc + n * ${mul}) % ${mod};\n  }\n  return acc;`;
      call = `${name}([${arr.join(", ")}])`;
    } else if (shape === "clamp") {
      const n = nz(rng, 1, 90);
      const m = nz(rng, 3, 80);
      params = "n: number, m: number";
      body = `const span = (m % ${span}) + ${base};\n  const x = n % span;\n  return x < 0 ? x + span : x;`;
      call = `${name}(${n}, ${m})`;
    } else if (shape === "shift-xor") {
      const n = nz(rng, 1, 90);
      const k = nz(rng, 1, 90);
      params = "n: number, k: number";
      body = `const x = (n ^ k) << ${shift};\n  return (x ^ ${xorc}) & ${mask};`;
      call = `${name}(${n}, ${k})`;
    } else {
      const s = alnum(rng, nz(rng, 2, 4));
      params = "s: string";
      body = `let x = ${init};\n  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${mul}) & ${mask};\n  return x;`;
      call = `${name}('${s}')`;
    }
    helpers.push({ name, shape, params, body, call, kt: null, java: null, ktCall: null, javaCall: null });
    const last = helpers[helpers.length - 1];
    if (shape === "hash-mix") {
      const s = last.call.match(/'([^']*)'/)[1];
      last.kt = `private fun ${name}(s: String): Int {\n  var h = ${acc}\n  for (i in s.indices) h = (h xor (s[i].code * ${mul})) % ${mod}\n  return h\n}`;
      last.java = `private static int ${name}(String s) {\n    int h = ${acc};\n    for (int i = 0; i < s.length(); i++) h = (h ^ (s.charAt(i) * ${mul})) % ${mod};\n    return h;\n}`;
      last.ktCall = `${name}("${s}")`;
      last.javaCall = `${name}("${s}")`;
    } else if (shape === "odd-sum") {
      const arr = last.call.match(/\[([^\]]*)\]/)[1];
      last.kt = `private fun ${name}(nums: IntArray): Int {\n  var acc = ${acc}\n  for (n in nums) {\n    if ((n and 1) == 0) continue\n    acc = (acc + n * ${mul}) % ${mod}\n  }\n  return acc\n}`;
      last.java = `private static int ${name}(int[] nums) {\n    int acc = ${acc};\n    for (int n : nums) {\n        if ((n & 1) == 0) continue;\n        acc = (acc + n * ${mul}) % ${mod};\n    }\n    return acc;\n}`;
      last.ktCall = `${name}(intArrayOf(${arr}))`;
      last.javaCall = `${name}(new int[]{${arr}})`;
    } else if (shape === "clamp") {
      const bits = last.call.match(/\((\d+),\s*(\d+)\)/);
      last.kt = `private fun ${name}(n: Int, m: Int): Int {\n  val span = (m % ${span}) + ${base}\n  val x = n % span\n  return if (x < 0) x + span else x\n}`;
      last.java = `private static int ${name}(int n, int m) {\n    int span = (m % ${span}) + ${base};\n    int x = n % span;\n    return x < 0 ? x + span : x;\n}`;
      last.ktCall = `${name}(${bits[1]}, ${bits[2]})`;
      last.javaCall = `${name}(${bits[1]}, ${bits[2]})`;
    } else if (shape === "shift-xor") {
      const bits = last.call.match(/\((\d+),\s*(\d+)\)/);
      last.kt = `private fun ${name}(n: Int, k: Int): Int {\n  val x = (n xor k) shl ${shift}\n  return (x xor ${xorc}) and ${mask}\n}`;
      last.java = `private static int ${name}(int n, int k) {\n    int x = (n ^ k) << ${shift};\n    return (x ^ ${xorc}) & ${mask};\n}`;
      last.ktCall = `${name}(${bits[1]}, ${bits[2]})`;
      last.javaCall = `${name}(${bits[1]}, ${bits[2]})`;
    } else {
      const s = last.call.match(/'([^']*)'/)[1];
      last.kt = `private fun ${name}(s: String): Int {\n  var x = ${init}\n  for (i in s.indices) x = (x + s[i].code * ${mul}) and ${mask}\n  return x\n}`;
      last.java = `private static int ${name}(String s) {\n    int x = ${init};\n    for (int i = 0; i < s.length(); i++) x = (x + s.charAt(i) * ${mul}) & ${mask};\n    return x;\n}`;
      last.ktCall = `${name}("${s}")`;
      last.javaCall = `${name}("${s}")`;
    }
  });
  return helpers;
}

function applyEdits(src, edits) {
  const sorted = edits.slice().sort((a, b) => b.at - a.at);
  let out = src;
  for (const edit of sorted) {
    out = out.slice(0, edit.at) + edit.text + out.slice(edit.at);
  }
  return out;
}

function collectModuleNames(ast, names) {
  for (const stmt of ast.program.body) visitStmt(stmt, names);
}

function visitStmt(stmt, names) {
  if (!stmt) return;
  if (stmt.type === "ExportNamedDeclaration" || stmt.type === "ExportDefaultDeclaration") {
    if (stmt.declaration) visitStmt(stmt.declaration, names);
    return;
  }
  if (
    (stmt.type === "FunctionDeclaration" ||
      stmt.type === "ClassDeclaration" ||
      stmt.type === "TSTypeAliasDeclaration" ||
      stmt.type === "TSInterfaceDeclaration" ||
      stmt.type === "TSEnumDeclaration") &&
    stmt.id &&
    stmt.id.type === "Identifier"
  ) {
    names.add(stmt.id.name);
  }
  if (stmt.type === "TSModuleDeclaration" && stmt.id && stmt.id.type === "Identifier") {
    names.add(stmt.id.name);
  }
  if (stmt.type === "VariableDeclaration") {
    for (const d of stmt.declarations) {
      if (d.id && d.id.type === "Identifier") names.add(d.id.name);
    }
  }
}

function findPatternNames(ast, hit) {
  walkAst(ast, (node, parent) => {
    if (node.type === "ObjectPattern") {
      for (const prop of node.properties) {
        if (!prop || prop.type !== "ObjectProperty") continue;
        const key = prop.key;
        if (key && key.type === "Identifier") hit.add(key.name);
      }
    }
    if (parent && parent.type === "ObjectProperty" && parent.shorthand && node === parent.key) {
      /* recorded via pattern or expression below */
    }
  });
}

function walkAst(node, fn, parent) {
  if (!node || typeof node !== "object" || typeof node.type !== "string") return;
  fn(node, parent);
  for (const key of Object.keys(node)) {
    if (
      key === "loc" ||
      key === "start" ||
      key === "end" ||
      key === "range" ||
      key === "leadingComments" ||
      key === "trailingComments" ||
      key === "innerComments"
    ) {
      continue;
    }
    const val = node[key];
    if (Array.isArray(val)) {
      for (const child of val) {
        if (child && typeof child.type === "string") walkAst(child, fn, node);
      }
    } else if (val && typeof val.type === "string") {
      walkAst(val, fn, node);
    }
  }
}

function shouldSkipRename(node, parent, ancestors) {
  if (!parent) return false;
  if (
    (parent.type === "MemberExpression" || parent.type === "OptionalMemberExpression") &&
    parent.property === node &&
    !parent.computed
  ) {
    return true;
  }
  if (parent.type === "JSXMemberExpression" && parent.property === node) return true;
  if (parent.type === "ObjectProperty" && parent.key === node && !parent.computed) return true;
  if (parent.type === "ObjectMethod" && parent.key === node && !parent.computed) return true;
  if (parent.type === "ClassMethod" && parent.key === node && !parent.computed) return true;
  if (parent.type === "ClassPrivateMethod" && parent.key === node) return true;
  if (parent.type === "ClassProperty" && parent.key === node && !parent.computed) return true;
  if (parent.type === "TSPropertySignature" && parent.key === node) return true;
  if (parent.type === "TSMethodSignature" && parent.key === node) return true;
  if (parent.type === "TSEnumMember" && parent.id === node) return true;
  if (parent.type === "JSXAttribute" && parent.name === node) return true;
  if (parent.type === "ObjectProperty" && parent.shorthand) return true;
  if (parent.type === "TSQualifiedName" && parent.right === node) return true;
  const decl = [...ancestors].reverse().find(
    (a) =>
      a.type === "ImportDeclaration" ||
      (a.type === "ExportNamedDeclaration" && a.source) ||
      (a.type === "ExportAllDeclaration" && a.source)
  );
  if (decl && decl.source && typeof decl.source.value === "string" && !decl.source.value.startsWith(".")) {
    return true;
  }
  return false;
}

function renameInSource(src, filename, renameMap) {
  const ast = parseTs(src, filename);
  const hits = [];
  const ancestors = [];
  function visit(node, parent) {
    if (
      (node.type === "Identifier" || node.type === "JSXIdentifier") &&
      renameMap.has(node.name) &&
      !shouldSkipRename(node, parent, ancestors)
    ) {
      hits.push(node);
    }
    ancestors.push(node);
    for (const key of Object.keys(node)) {
      if (
        key === "loc" ||
        key === "start" ||
        key === "end" ||
        key === "range" ||
        key === "leadingComments" ||
        key === "trailingComments" ||
        key === "innerComments"
      ) {
        continue;
      }
      const val = node[key];
      if (Array.isArray(val)) {
        for (const child of val) if (child && typeof child.type === "string") visit(child, node);
      } else if (val && typeof val.type === "string") visit(val, node);
    }
    ancestors.pop();
  }
  visit(ast, null);
  const seen = new Set();
  const edits = [];
  for (const node of hits) {
    if (seen.has(node.start)) continue;
    seen.add(node.start);
    edits.push({ at: node.start, end: node.end, text: renameMap.get(node.name) });
  }
  edits.sort((a, b) => b.at - a.at);
  let out = src;
  for (const edit of edits) {
    out = out.slice(0, edit.at) + edit.text + out.slice(edit.end);
  }
  return { out, count: edits.length };
}

function renameGame(gameFiles) {
  const names = new Set();
  const patternNames = new Set();
  const parsed = [];
  for (const file of gameFiles) {
    const src = fs.readFileSync(file, "utf8");
    const ast = parseTs(src, file);
    collectModuleNames(ast, names);
    findPatternNames(ast, patternNames);
    parsed.push({ file, src });
  }
  const renameMap = new Map();
  const skipped = [];
  for (const name of names) {
    if (!name || name.includes(FRAG)) continue;
    if (PLATFORM_STYLE.has(name) || PLATFORM_METHODS.has(name)) {
      skipped.push(name + ":platform");
      continue;
    }
    if (patternNames.has(name)) {
      skipped.push(name + ":pattern");
      continue;
    }
    if (name.length < 2) continue;
    renameMap.set(name, insertFragment(name, "game-export"));
  }
  let files = 0;
  let idents = 0;
  for (const { file, src } of parsed) {
    const { out, count } = renameInSource(src, file, renameMap);
    if (count > 0 && out !== src) {
      fs.writeFileSync(file, out);
      files += 1;
      idents += count;
    }
  }
  const extraRoots = [ROOT];
  const extra = walkFiles(ROOT, new Set([".ts", ".tsx", ".js", ".jsx"])).filter((f) => {
    const rel = path.relative(ROOT, f);
    if (rel.startsWith("node_modules")) return false;
    if (rel.startsWith("Layouts" + path.sep + "Game")) return false;
    if (rel.startsWith("android") || rel.startsWith("ios")) return false;
    if (rel.startsWith("scripts")) return false;
    return true;
  });
  let extraFiles = 0;
  for (const file of extra) {
    const src = fs.readFileSync(file, "utf8");
    if (!src.includes("Layouts/Game") && !src.includes("Layouts\\Game")) continue;
    let ast;
    try {
      ast = parseTs(src, file);
    } catch {
      continue;
    }
    const localMap = new Map();
    for (const stmt of ast.program.body) {
      if (stmt.type !== "ImportDeclaration") continue;
      const from = stmt.source.value;
      if (typeof from !== "string" || !from.includes("Layouts/Game")) continue;
      for (const spec of stmt.specifiers) {
        if (spec.type === "ImportSpecifier") {
          const imported = spec.imported.type === "Identifier" ? spec.imported.name : spec.imported.value;
          if (renameMap.has(imported)) localMap.set(spec.local.name, renameMap.get(imported));
        }
      }
    }
    if (localMap.size === 0) continue;
    const { out, count } = renameInSource(src, file, localMap);
    if (count > 0 && out !== src) {
      fs.writeFileSync(file, out);
      extraFiles += 1;
      idents += count;
    }
  }
  return { renamed: [...renameMap.entries()], skipped, files, extraFiles, idents };
}

function indentAt(src, index) {
  const lineStart = src.lastIndexOf("\n", index - 1) + 1;
  const m = src.slice(lineStart, index).match(/^[ \t]*/);
  return (m ? m[0] : "") + "  ";
}

function injectTsFile(file) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes(MARKER)) return { file, skipped: true };
  const ast = parseTs(src, file);
  const spots = [];
  function walk(node, insideHelper) {
    if (!node || typeof node !== "object" || typeof node.type !== "string") return;
    let childHelper = insideHelper;
    if (isFunctionNode(node)) {
      const helper = insideHelper || isHelperName(funcName(node));
      if (!helper && node.body && node.body.type === "BlockStatement") {
        let at = node.body.start + 1;
        if (
          node.kind === "constructor" &&
          node.body.body[0] &&
          node.body.body[0].type === "ExpressionStatement" &&
          node.body.body[0].expression &&
          node.body.body[0].expression.type === "CallExpression" &&
          node.body.body[0].expression.callee &&
          node.body.body[0].expression.callee.type === "Super"
        ) {
          at = node.body.body[0].end;
        }
        spots.push(at);
      }
      childHelper = helper;
    } else if (node.type === "StaticBlock" && !insideHelper) {
      spots.push(node.body.start + 1);
    }
    for (const key of Object.keys(node)) {
      if (
        key === "loc" ||
        key === "start" ||
        key === "end" ||
        key === "range" ||
        key === "leadingComments" ||
        key === "trailingComments" ||
        key === "innerComments"
      ) {
        continue;
      }
      const val = node[key];
      if (Array.isArray(val)) {
        for (const child of val) if (child && typeof child.type === "string") walk(child, childHelper);
      } else if (val && typeof val.type === "string") walk(val, childHelper);
    }
  }
  walk(ast, false);
  const helpers = buildBatch(file);
  const nl = nlOf(src);
  const voidLines = helpers.map((h) => `void ${h.call};`);
  const edits = [];
  for (const at of spots) {
    const indent = indentAt(src, at);
    const text = nl + voidLines.map((line) => indent + line).join(nl) + (src[at] === "\n" || src[at] === "\r" ? "" : nl);
    edits.push({ at, text });
  }
  const helperSrc = helpers
    .map((h) => `function ${h.name}(${h.params}): number {\n  ${h.body}\n}`)
    .join(nl + nl);
  let tail = `${nl}${nl}${MARKER}${nl}${helperSrc}${nl}`;
  if (spots.length === 0) {
    tail += helpers.map((h) => `void ${h.call};`).join(nl) + nl;
  }
  edits.push({ at: src.length, text: tail });
  const next = applyEdits(src, edits);
  parseTs(next, file);
  fs.writeFileSync(file, next);
  return { file, spots: spots.length, helpers: helpers.length };
}

function blankNonCode(src) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("///", i) || (src[i] === "/" && src[i + 1] === "/")) {
      while (i < src.length && src[i] !== "\n") {
        out += " ";
        i++;
      }
      continue;
    }
    if (src[i] === "/" && src[i + 1] === "*") {
      out += "  ";
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
        out += src[i] === "\n" ? "\n" : " ";
        i++;
      }
      if (i < src.length) {
        out += "  ";
        i += 2;
      }
      continue;
    }
    if (src.startsWith('"""', i)) {
      out += "   ";
      i += 3;
      while (i < src.length && !src.startsWith('"""', i)) {
        out += src[i] === "\n" ? "\n" : " ";
        i++;
      }
      if (i < src.length) {
        out += "   ";
        i += 3;
      }
      continue;
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      out += " ";
      i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") {
          out += "  ";
          i += 2;
          continue;
        }
        out += src[i] === "\n" ? "\n" : " ";
        i++;
      }
      if (i < src.length) {
        out += " ";
        i++;
      }
      continue;
    }
    out += src[i];
    i++;
  }
  if (out.length !== src.length) {
    throw new Error("blank length drift");
  }
  return out;
}

function skipBalanced(s, openPos, openCh, closeCh) {
  let depth = 0;
  for (let i = openPos; i < s.length; i++) {
    const c = s[i];
    if (c === openCh) depth++;
    else if (c === closeCh) {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function skipWs(s, i) {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

const STOP_WORDS = new Set([
  "fun", "class", "object", "interface", "val", "var", "init", "constructor",
  "when", "package", "import", "private", "public", "override", "internal",
  "protected", "companion", "typealias", "return",
]);

function findBodyStart(s, i) {
  let paren = 0;
  let angle = 0;
  let bracket = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "(") paren++;
    else if (c === ")") {
      if (paren === 0) return null;
      paren--;
    } else if (c === "<") angle++;
    else if (c === ">") angle = Math.max(0, angle - 1);
    else if (c === "[") bracket++;
    else if (c === "]") bracket--;
    else if (paren === 0 && angle === 0 && bracket === 0) {
      if (c === "{") return { kind: "block", pos: i };
      if (c === "=") return { kind: "expr", pos: i };
      if (c === ";") return null;
      if (/[A-Za-z_]/.test(c)) {
        const word = s.slice(i).match(/^[A-Za-z_]\w*/);
        if (word && STOP_WORDS.has(word[0])) return null;
      }
    }
    i++;
  }
  return null;
}

function matchBrace(s, openPos) {
  let depth = 0;
  for (let i = openPos; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findKotlinMethods(blank) {
  const found = [];
  const re = /\bfun\b/g;
  let m;
  while ((m = re.exec(blank))) {
    let i = skipWs(blank, m.index + 3);
    if (blank[i] === "<") {
      const after = skipBalanced(blank, i, "<", ">");
      if (after < 0) continue;
      i = skipWs(blank, after);
    }
    const nameMatch = blank.slice(i).match(/^(?:[A-Za-z_][\w]*\s*\.\s*)*([A-Za-z_]\w*)\s*\(/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const parenPos = i + nameMatch[0].length - 1;
    const afterParen = skipBalanced(blank, parenPos, "(", ")");
    if (afterParen < 0) continue;
    const body = findBodyStart(blank, afterParen);
    if (!body || body.kind !== "block") continue;
    found.push({ name, brace: body.pos, isCtor: false });
  }
  const initRe = /\binit\b/g;
  while ((m = initRe.exec(blank))) {
    const i = skipWs(blank, m.index + 4);
    if (blank[i] === "{") found.push({ name: "init", brace: i, isCtor: false });
  }
  const ctorRe = /\bconstructor\b/g;
  while ((m = ctorRe.exec(blank))) {
    const i = skipWs(blank, m.index + 11);
    if (blank[i] !== "(") continue;
    const after = skipBalanced(blank, i, "(", ")");
    if (after < 0) continue;
    const body = findBodyStart(blank, after);
    if (!body || body.kind !== "block") continue;
    found.push({ name: "constructor", brace: body.pos, isCtor: true });
  }
  return found;
}

const JAVA_CONTROL = new Set([
  "if", "for", "while", "switch", "catch", "synchronized", "try", "do", "else",
  "return", "throw", "new", "case", "import", "package", "instanceof",
]);

function prevToken(blank, nameStart) {
  let j = nameStart - 1;
  while (j >= 0 && /\s/.test(blank[j])) j--;
  if (j >= 2 && blank[j] === "." && blank[j - 1] === "." && blank[j - 2] === ".") {
    j -= 3;
    while (j >= 0 && /\s/.test(blank[j])) j--;
  }
  if (j < 0) return { token: "", ch: "" };
  const ch = blank[j];
  if (!/[A-Za-z0-9_>]/.test(ch) && ch !== "]") return { token: "", ch };
  let end = j + 1;
  while (j >= 0 && /[A-Za-z0-9_]/.test(blank[j])) j--;
  return { token: blank.slice(j + 1, end), ch };
}

function findJavaMethods(blank) {
  const classNames = new Set();
  const classRe = /\b(?:class|interface|enum)\s+([A-Za-z_]\w*)/g;
  let cm;
  while ((cm = classRe.exec(blank))) classNames.add(cm[1]);
  const found = [];
  const re = /([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = re.exec(blank))) {
    const name = m[1];
    if (JAVA_CONTROL.has(name)) continue;
    const nameStart = m.index;
    let j = nameStart - 1;
    while (j >= 0 && /\s/.test(blank[j])) j--;
    if (blank[j] === "@" || blank[j] === ".") continue;
    const prev = prevToken(blank, nameStart);
    const typeLike =
      prev.ch === ">" ||
      prev.ch === "]" ||
      (prev.token && !JAVA_CONTROL.has(prev.token) && prev.token !== "new");
    const ctorLike = classNames.has(name) && (prev.token === "public" || prev.token === "private" || prev.token === "protected" || prev.ch === "}" || prev.ch === "{" || prev.ch === ";" || prev.token === "");
    if (!typeLike && !ctorLike) continue;
    if (["public", "private", "protected", "static", "final", "native", "abstract", "default", "strictfp", "class", "interface", "enum", "void"].includes(name)) {
      continue;
    }
    if (!typeLike && !ctorLike) continue;
    if (prev.token === "return" || prev.token === "throw" || prev.token === "new" || prev.token === "else" || prev.token === "case") continue;
    const parenPos = blank.indexOf("(", nameStart);
    const after = skipBalanced(blank, parenPos, "(", ")");
    if (after < 0) continue;
    const body = findBodyStart(blank, after);
    if (!body || body.kind !== "block") continue;
    const isCtor = classNames.has(name);
    found.push({ name, brace: body.pos, isCtor });
  }
  return found;
}

function ctorAdjust(blank, brace) {
  let j = skipWs(blank, brace + 1);
  const m = blank.slice(j).match(/^(super|this)\s*\(/);
  if (!m) return brace + 1;
  const paren = j + m[0].length - 1;
  const after = skipBalanced(blank, paren, "(", ")");
  if (after < 0) return brace + 1;
  let k = skipWs(blank, after);
  if (blank[k] === ";") k++;
  return k;
}

function lambdaAhead(blank, brace) {
  const slice = blank.slice(brace + 1, brace + 180);
  return /^\s*(\([^)]*\)|[A-Za-z_]\w*)\s*->/.test(slice);
}

function topLevelRanges(blank) {
  const ranges = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < blank.length; i++) {
    if (blank[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (blank[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        ranges.push({ start, end: i });
        start = -1;
      }
    }
  }
  return ranges;
}

function injectHostFile(file) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes(MARKER)) return { file, skipped: true };
  const head = src.slice(0, 400);
  if (head.includes("autosetup-decoy:v1") || head.includes("dex-lanes:v1")) {
    return { file, skipped: true, reason: "decoy" };
  }
  if (file.includes(`${path.sep}rnobfuscator${path.sep}`)) return { file, skipped: true, reason: "stringfog" };
  const isJava = file.endsWith(".java");
  const blank = blankNonCode(src);
  const methods = isJava ? findJavaMethods(blank) : findKotlinMethods(blank);
  const ranges = methods.map((method) => ({
    ...method,
    end: matchBrace(blank, method.brace),
  }));
  const obfRanges = ranges.filter((r) => isHelperName(r.name) && r.end > r.brace);
  const targets = [];
  for (const method of ranges) {
    if (isHelperName(method.name)) continue;
    if (obfRanges.some((r) => method.brace > r.brace && method.brace < r.end)) continue;
    if (lambdaAhead(blank, method.brace)) continue;
    const at = method.isCtor ? ctorAdjust(blank, method.brace) : method.brace + 1;
    targets.push({ ...method, at });
  }
  const helpers = buildBatch(file);
  const nl = nlOf(src);
  const isInterface = isJava && /\binterface\s+[A-Za-z_]/.test(blank) && !/\bclass\s+[A-Za-z_]/.test(blank);
  const sink = isJava
    ? (indent) => {
        const expr = helpers.map((h) => h.javaCall).join(" ^ ");
        return `${nl}${indent}@SuppressWarnings("unused") final int ${FRAG}SinkV${BATCH} = ${expr};`;
      }
    : (indent) => {
        const expr = helpers.map((h) => h.ktCall).join(" xor ");
        return `${nl}${indent}@Suppress("UNUSED_VARIABLE") val ${FRAG}SinkV${BATCH} = ${expr}`;
      };
  const edits = [];
  const seenAt = new Set();
  for (const target of targets) {
    if (seenAt.has(target.at)) continue;
    seenAt.add(target.at);
    const indent = indentAt(src, target.at);
    edits.push({ at: target.at, text: sink(indent) });
  }
  const helperBody = helpers.map((h) => (isJava ? h.java : h.kt)).join(nl + nl);
  let block = `${nl}${nl}${MARKER}${nl}${helperBody}${nl}`;
  if (targets.length === 0 && !isInterface) {
    if (isJava) {
      const expr = helpers.map((h) => h.javaCall).join(" ^ ");
      block += `@SuppressWarnings("unused")${nl}private static final int ${FRAG}BootV${BATCH} = ${expr};${nl}`;
    } else {
      const expr = helpers.map((h) => h.ktCall).join(" xor ");
      block += `@Suppress("UNUSED_VARIABLE")${nl}private val ${FRAG}BootV${BATCH} = ${expr}${nl}`;
    }
  }
  if (isJava) {
    const rangesTop = topLevelRanges(blank);
    let host = rangesTop[rangesTop.length - 1];
    if (targets.length) {
      host = rangesTop.find((r) => targets.some((t) => t.brace > r.start && t.brace < r.end)) || host;
    }
    if (!host) throw new Error("no class range " + file);
    edits.push({ at: host.end, text: block });
  } else {
    edits.push({ at: src.length, text: block });
  }
  const next = applyEdits(src, edits);
  const blank2 = blankNonCode(next);
  let depth = 0;
  for (const c of blank2) {
    if (c === "{") depth++;
    else if (c === "}") depth--;
    if (depth < 0) throw new Error("brace underflow " + file);
  }
  if (depth !== 0) throw new Error("brace imbalance " + file);
  for (const h of helpers) {
    if (!next.includes(`fun ${h.name}`) && !next.includes(`int ${h.name}`) && !next.includes(` ${h.name}(`)) {
      throw new Error("missing helper " + h.name + " in " + file);
    }
  }
  fs.writeFileSync(file, next);
  return { file, spots: targets.length, helpers: helpers.length, interface: isInterface };
}

function scanUiStrings(file) {
  const src = fs.readFileSync(file, "utf8");
  const ast = parseTs(src, file);
  const hits = [];
  walkAst(ast, (node, parent) => {
    const raw =
      node.type === "StringLiteral"
        ? node.value
        : node.type === "TemplateLiteral"
          ? node.quasis.map((q) => q.value.cooked || "").join("")
          : node.type === "JSXText"
            ? node.value
            : null;
    if (raw == null || !raw.includes(FRAG)) return;
    const inRequire =
      parent &&
      parent.type === "CallExpression" &&
      parent.callee &&
      parent.callee.type === "Identifier" &&
      parent.callee.name === "require";
    hits.push({ file, inRequire, text: raw.slice(0, 120), type: node.type });
  });
  return hits;
}

function main() {
  const gameDir = path.join(ROOT, "Layouts", "Game");
  const servicesDir = path.join(ROOT, "services");
  const javaDir = path.join(ROOT, "android", "app", "src", "main", "java");
  const gameFiles = walkFiles(gameDir, new Set([".ts", ".tsx"]));
  const serviceFiles = walkFiles(servicesDir, new Set([".ts", ".tsx"]));
  const hostFiles = walkFiles(javaDir, new Set([".kt", ".java"]));

  const rename = renameGame(gameFiles);
  console.log(
    `rename module bindings: ${rename.renamed.length} names, ${rename.files} game files, ${rename.extraFiles} external, ${rename.idents} idents`
  );
  console.log("renamed:", rename.renamed.map(([a, b]) => `${a} -> ${b}`).join("\n"));
  console.log("skipped:", rename.skipped.join(", ") || "(none)");

  const tsResults = [];
  const tsErrors = [];
  for (const file of [...serviceFiles, ...gameFiles]) {
    try {
      tsResults.push(injectTsFile(file));
    } catch (error) {
      tsErrors.push(`${path.relative(ROOT, file)}: ${error.message}`);
    }
  }
  const hostResults = [];
  const hostErrors = [];
  for (const file of hostFiles) {
    try {
      hostResults.push(injectHostFile(file));
    } catch (error) {
      hostErrors.push(`${path.relative(ROOT, file)}: ${error.message}`);
    }
  }
  const ui = [];
  for (const file of gameFiles) {
    try {
      ui.push(...scanUiStrings(file));
    } catch (error) {
      tsErrors.push(`ui ${path.relative(ROOT, file)}: ${error.message}`);
    }
  }
  const injectedTs = tsResults.filter((r) => !r.skipped);
  const injectedHost = hostResults.filter((r) => !r.skipped);
  console.log(`ts injected ${injectedTs.length}/${serviceFiles.length + gameFiles.length} spots ${injectedTs.reduce((s, r) => s + (r.spots || 0), 0)}`);
  console.log(`host injected ${injectedHost.length}/${hostFiles.length} spots ${injectedHost.reduce((s, r) => s + (r.spots || 0), 0)}`);
  console.log("ui fragment strings:", ui.length ? JSON.stringify(ui.slice(0, 30), null, 2) : "(none)");
  if (tsErrors.length || hostErrors.length) {
    console.log("ERRORS");
    console.log(tsErrors.concat(hostErrors).join("\n"));
    process.exitCode = 1;
  }
}

if (process.argv[2] === "--inject") {
  for (const file of process.argv.slice(3)) {
    const abs = path.resolve(file);
    console.log(JSON.stringify(injectTsFile(abs)));
  }
} else {
  main();
}
