/**
 * One-off obfuscation batch v23 for services/, Layouts/Game/, Android host.
 * Run from repo root: node scripts/_obf_batch_v23.js
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const BATCH = 23;
const SHAPES = ["hash-mix", "odd-sum", "clamp", "shift-xor", "byte-fold"];
const ALPHA = "abcdefghijklmnopqrstuvwxyz0123456789";

const SKIP_DECOY = new Set([
  `D${FRAG}DecoyHub`,
  `D${FRAG}DexLanes`,
  `D${FRAG}Crest01`,
  `D${FRAG}Vale02`,
  `D${FRAG}Drift03`,
  `D${FRAG}Ember04`,
  `D${FRAG}Vector05`,
  `D${FRAG}Ridge06`,
  `D${FRAG}Orbit07`,
  `D${FRAG}Grove08`,
  `D${FRAG}Prism09`,
  `D${FRAG}Quanta10`,
]);

const TS_KW = new Set([
  "if", "for", "while", "switch", "catch", "with", "function", "else", "do",
  "return", "throw", "new", "typeof", "instanceof", "void", "await", "yield",
  "case", "class", "enum", "interface", "type", "import", "export", "from",
  "of", "in", "as", "try", "finally", "break", "continue", "default", "extends",
  "implements", "static", "public", "private", "protected", "async", "get", "set",
]);

const RENAME_SKIP = new Set([
  "round", "abs", "min", "max", "floor", "ceil", "random", "imul", "pow", "sqrt",
  "hypot", "now", "keys", "values", "map", "filter", "reduce", "length", "size",
  "name", "type", "value", "current", "stop", "start", "reset", "create", "style",
  "styles", "props", "state", "children", "transform", "opacity", "elevation",
  "translateX", "translateY", "scale", "rotate", "finished", "setValue",
  "addListener", "interpolate", "stopAnimation", "View", "Text", "Image",
  "React", "Animated", "StyleSheet", "Platform", "Pressable", "Modal",
  "App", "Screen", "Grid", "Phase", "Props", "Options",
]);

const PLATFORM_STYLE = new Set([
  "flex", "color", "backgroundColor", "fontSize", "fontWeight", "letterSpacing",
  "textAlign", "marginTop", "marginBottom", "marginLeft", "marginRight",
  "padding", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
  "borderRadius", "borderColor", "borderWidth", "position", "absolute",
  "left", "right", "top", "bottom", "width", "height", "overflow", "zIndex",
  "gap", "row", "column", "display", "opacity", "elevation", "transform",
  "shadowColor", "shadowOpacity", "shadowRadius", "shadowOffset",
]);

function hashSeed(str) {
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mix32(n) {
  let x = n >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function insertFrag(name, frag, rnd) {
  if (!name || name.includes(frag)) return name;
  if (name.length < 2) return name + frag;
  const at = 1 + Math.floor(rnd() * (name.length - 1));
  return name.slice(0, at) + frag + name.slice(at);
}

function stripFrag(name) {
  return String(name).split(FRAG).join("");
}

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    if (exts.has(path.extname(dir))) out.push(dir);
    return out;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build" || ent.name === "Pods") continue;
      walk(full, exts, out);
    } else if (ent.isFile() && exts.has(path.extname(ent.name))) {
      out.push(full);
    }
  }
  return out;
}

function isHelperName(name) {
  if (!name) return false;
  if (/ObfV\d+/i.test(name)) return true;
  if (/GameMixSeed|GameFoldRange|GameClampSpan/.test(name)) return true;
  if (/SinkV\d+/.test(name)) return true;
  return false;
}

function skipWs(s, i) {
  while (i < s.length) {
    if (s[i] === "/" && s[i + 1] === "/") {
      i += 2;
      while (i < s.length && s[i] !== "\n") i++;
      continue;
    }
    if (s[i] === "/" && s[i + 1] === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }
    break;
  }
  return i;
}

function skipString(s, i) {
  const q = s[i];
  i++;
  while (i < s.length) {
    if (s[i] === "\\") {
      i += 2;
      continue;
    }
    if (s[i] === q) return i + 1;
    i++;
  }
  return i;
}

function skipBalanced(s, i, open, close) {
  let depth = 0;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === "/" && s[i + 1] === "/") {
      while (i < s.length && s[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && s[i + 1] === "*") {
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) i++;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(s, i) - 1;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function skipTsType(s, i) {
  if (s[i] !== ":") return i;
  i++;
  const parseAtom = () => {
    i = skipWs(s, i);
    if (i >= s.length) return false;
    const c = s[i];
    if (c === "{") {
      const n = skipBalanced(s, i, "{", "}");
      if (n < 0) return false;
      i = n;
      return true;
    }
    if (c === "(") {
      const n = skipBalanced(s, i, "(", ")");
      if (n < 0) return false;
      i = n;
      return true;
    }
    if (c === "[") {
      const n = skipBalanced(s, i, "[", "]");
      if (n < 0) return false;
      i = n;
      return true;
    }
    if (c === "<") {
      const n = skipBalanced(s, i, "<", ">");
      if (n < 0) return false;
      i = n;
      return true;
    }
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(s, i);
      return true;
    }
    if (/[A-Za-z_]/.test(c)) {
      while (i < s.length && /[A-Za-z0-9_$.]/.test(s[i])) i++;
      i = skipWs(s, i);
      if (s[i] === "<") {
        const n = skipBalanced(s, i, "<", ">");
        if (n > 0) i = n;
      }
      i = skipWs(s, i);
      while (s[i] === "[" && s[i + 1] === "]") i += 2;
      return true;
    }
    return false;
  };
  parseAtom();
  let guard = 0;
  while (guard++ < 40) {
    i = skipWs(s, i);
    if (s.startsWith("=>", i)) {
      i += 2;
      parseAtom();
      continue;
    }
    if (s[i] === "|" || s[i] === "&" || s[i] === "?" || s[i] === "!") {
      i++;
      parseAtom();
      continue;
    }
    if (s[i] === "[" && s[i + 1] === "]") {
      i += 2;
      continue;
    }
    break;
  }
  return i;
}

function afterSignatureBrace(s, iAfterName) {
  let i = skipWs(s, iAfterName);
  if (s[i] === "<") {
    const n = skipBalanced(s, i, "<", ">");
    if (n < 0) return -1;
    i = skipWs(s, n);
  }
  if (s[i] !== "(") return -1;
  const afterParen = skipBalanced(s, i, "(", ")");
  if (afterParen < 0) return -1;
  i = skipWs(s, afterParen);
  if (s[i] === ":") {
    i = skipTsType(s, i);
    i = skipWs(s, i);
  }
  if (s[i] === "{") return i;
  return -1;
}

function findTsCallers(content) {
  const points = [];
  const seen = new Set();
  const push = (idx, name) => {
    if (idx < 0 || seen.has(idx)) return;
    if (isHelperName(name)) return;
    seen.add(idx);
    points.push({ index: idx, name: name || "" });
  };

  const reFn = /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_][\w]*)/g;
  let m;
  while ((m = reFn.exec(content))) {
    push(afterSignatureBrace(content, m.index + m[0].length), m[1]);
  }

  const reCtor = /\bconstructor\b/g;
  while ((m = reCtor.exec(content))) {
    push(afterSignatureBrace(content, m.index + m[0].length), "constructor");
  }

  const reMethod = /(?:^|\n)[ \t]*(?:(?:public|private|protected|static|async|override|readonly)\s+)*(?:async\s+)?([A-Za-z_][\w]*)\s*(?:<[^>]*>)?\s*\(/g;
  while ((m = reMethod.exec(content))) {
    const name = m[1];
    if (TS_KW.has(name)) continue;
    push(afterSignatureBrace(content, m.index + m[0].length - 1 - name.length + name.length), name);
    // afterSignatureBrace wants index after name; reMethod ends at '('. Recompute:
  }

  // Re-scan class/object methods more carefully
  const reMeth2 = /(?:^|\n)[ \t]*(?:(?:public|private|protected|static|async|override|readonly)\s+)*(?:async\s+)?([A-Za-z_][\w]*)\s*(?:<[^>]*>)?\s*(?=\()/gm;
  while ((m = reMeth2.exec(content))) {
    const name = m[1];
    if (TS_KW.has(name) || name === "function") continue;
    push(afterSignatureBrace(content, m.index + m[0].length), name);
  }

  const reArrow = /(?:export\s+)?(?:const|let)\s+([A-Za-z_][\w]*)\s*=\s*(?:async\s*)?/g;
  while ((m = reArrow.exec(content))) {
    let i = skipWs(content, m.index + m[0].length);
    if (content[i] === "(") {
      const ap = skipBalanced(content, i, "(", ")");
      if (ap < 0) continue;
      i = skipWs(content, ap);
      if (content[i] === ":") {
        i = skipTsType(content, i);
        i = skipWs(content, i);
      }
      if (content.startsWith("=>", i)) {
        i = skipWs(content, i + 2);
        if (content[i] === "{") push(i, m[1]);
      }
    }
  }

  const hookRe = /\b(useCallback|useEffect|useMemo|useLayoutEffect)\s*\(/g;
  while ((m = hookRe.exec(content))) {
    let i = skipWs(content, m.index + m[0].length);
    if (content.startsWith("async", i)) i = skipWs(content, i + 5);
    if (content[i] === "(") {
      const ap = skipBalanced(content, i, "(", ")");
      if (ap < 0) continue;
      i = skipWs(content, ap);
    } else if (/[A-Za-z_]/.test(content[i])) {
      while (i < content.length && /[A-Za-z0-9_]/.test(content[i])) i++;
      i = skipWs(content, i);
    }
    if (content.startsWith("=>", i)) {
      i = skipWs(content, i + 2);
      if (content[i] === "{") push(i, m[1]);
    }
  }

  return points.sort((a, b) => a.index - b.index);
}

function findKotlinFuns(content) {
  const points = [];
  const seen = new Set();
  const re = /(?:^|\n)[ \t]*(?:(?:public|private|protected|internal|open|override|suspend|inline|operator)\s+)*fun\s+([A-Za-z_][\w]*)/g;
  let m;
  while ((m = re.exec(content))) {
    const name = m[1];
    if (isHelperName(name)) continue;
    const brace = afterKotlinBody(content, m.index + m[0].length);
    if (brace < 0 || seen.has(brace)) continue;
    seen.add(brace);
    points.push({ index: brace, name });
  }
  const reInit = /(?:^|\n)[ \t]*init\s*\{/g;
  while ((m = reInit.exec(content))) {
    const idx = m.index + m[0].length - 1;
    if (seen.has(idx)) continue;
    seen.add(idx);
    points.push({ index: idx, name: "init" });
  }
  return points.sort((a, b) => a.index - b.index);
}

function afterKotlinBody(s, iAfterName) {
  let i = skipWs(s, iAfterName);
  if (s[i] === "<") {
    const n = skipBalanced(s, i, "<", ">");
    if (n < 0) return -1;
    i = skipWs(s, n);
  }
  if (s[i] !== "(") return -1;
  const ap = skipBalanced(s, i, "(", ")");
  if (ap < 0) return -1;
  i = skipWs(s, ap);
  if (s[i] === ":") {
    i++;
    let depth = 0;
    while (i < s.length) {
      i = skipWs(s, i);
      const c = s[i];
      if (c === "<") depth++;
      else if (c === ">") depth--;
      else if (c === "(") {
        const n = skipBalanced(s, i, "(", ")");
        if (n < 0) return -1;
        i = n;
        continue;
      } else if ((c === "{" || c === "=") && depth <= 0) break;
      else if (c === "\n" && depth <= 0 && s.slice(i, i + 40).includes("{")) {
        // keep scanning
      }
      i++;
      if (i - ap > 400) break;
    }
    i = skipWs(s, i);
  }
  if (s[i] === "=") return -1;
  if (s[i] === "{") {
    const peek = skipWs(s, i + 1);
    // lambda-as-body is still a method body; don't insert between { and ->
    if (s.slice(peek, peek + 40).match(/^\([^)]*\)\s*->/) || s.slice(peek, peek + 20).match(/^[A-Za-z_]\w*\s*->/)) {
      return -1;
    }
    return i;
  }
  return -1;
}

function findJavaMethods(content, className) {
  const points = [];
  const seen = new Set();
  const re = /(?:^|\n)[ \t]*(?:(?:public|private|protected|static|final|synchronized|native|abstract)\s+)*(?:[\w.<>,\[\]]+\s+)?([A-Za-z_][\w]*)\s*\(/g;
  let m;
  while ((m = re.exec(content))) {
    const name = m[1];
    if (
      [
        "if", "for", "while", "switch", "catch", "return", "new", "throw",
        "synchronized", "assert",
      ].includes(name)
    ) {
      continue;
    }
    if (isHelperName(name)) continue;
    const parenAt = m.index + m[0].length - 1;
    const afterParen = skipBalanced(content, parenAt, "(", ")");
    if (afterParen < 0) continue;
    let i = skipWs(content, afterParen);
    if (content[i] === "throws") {
      while (i < content.length && content[i] !== "{" && content[i] !== ";") i++;
      i = skipWs(content, i);
    }
    if (content[i] !== "{") continue;
    if (seen.has(i)) continue;
    seen.add(i);
    points.push({ index: i, name, isCtor: name === className });
  }
  return points.sort((a, b) => a.index - b.index);
}

function indentAt(content, index) {
  let i = index;
  while (i > 0 && content[i] !== "\n") i--;
  const line = content.slice(i + 1, index);
  const sp = line.match(/^[ \t]*/);
  return sp ? sp[0] + "  " : "    ";
}

function makeHelpers(fileSlug, lang) {
  const seed = hashSeed(`${FRAG}|${fileSlug}|${BATCH}`);
  const rnd = mulberry32(mix32(seed));
  let count = 1 + Math.floor(rnd() * 4);
  let shape0 = seed % 5;
  const shapes = [];
  for (let i = 0; i < count; i++) shapes.push(SHAPES[(shape0 + i) % 5]);
  if (!shapes.some((s) => s === "shift-xor" || s === "byte-fold" || s === "hash-mix" || s === "odd-sum")) {
    shapes[shapes.length - 1] = "byte-fold";
  }
  const helpers = shapes.map((shape, idx) => {
    const lit = literals(rnd, shape);
    const stem = `${fileSlug}ObfV${BATCH}${shapeTitle(shape)}${idx ? idx : ""}`;
    const name = insertFrag(stem, FRAG, rnd);
    return { name, shape, lit };
  });
  return { helpers, rnd };
}

function shapeTitle(shape) {
  return {
    "hash-mix": "HashMix",
    "odd-sum": "SumOdds",
    clamp: "ClampMod",
    "shift-xor": "ShiftXor",
    "byte-fold": "ByteFold",
  }[shape];
}

function literals(rnd, shape) {
  const n = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const str = (len) => {
    let s = "";
    for (let i = 0; i < len; i++) s += ALPHA[Math.floor(rnd() * ALPHA.length)];
    return s;
  };
  return {
    h0: n(11, 90),
    mul: n(3, 31),
    mod: n(191, 811),
    acc: n(17, 90),
    fac: n(7, 35),
    span: n(11, 61),
    add: n(2, 9),
    sh: 1 + Math.floor(rnd() * 7),
    xor: n(19, 150),
    mask: n(1023, 62000),
    x0: n(13, 80),
    a: n(3, 90),
    b: n(3, 90),
    arr: [n(3, 33), n(4, 31), n(5, 32)],
    s1: str(2 + Math.floor(rnd() * 3)),
    s2: str(2 + Math.floor(rnd() * 3)),
  };
}

function tsHelperSrc(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `function ${h.name}(s: string): number {
  let h = ${L.h0};
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * ${L.mul}) % ${L.mod};
  return h;
}`;
    case "odd-sum":
      return `function ${h.name}(nums: number[]): number {
  let acc = ${L.acc};
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * ${L.fac}) % ${L.mod};
  }
  return acc;
}`;
    case "clamp":
      return `function ${h.name}(n: number, m: number): number {
  const span = (m % ${L.span}) + ${L.add};
  const x = n % span;
  return x < 0 ? x + span : x;
}`;
    case "shift-xor":
      return `function ${h.name}(n: number, k: number): number {
  const x = (n ^ k) << ${L.sh};
  return (x ^ ${L.xor}) & ${L.mask};
}`;
    default:
      return `function ${h.name}(s: string): number {
  let x = ${L.x0};
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${L.mul}) & ${L.mask};
  return x;
}`;
  }
}

function ktHelperSrc(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `private fun ${h.name}(s: String): Int {
  var h = ${L.h0}
  for (i in s.indices) h = (h xor (s[i].code * ${L.mul})) % ${L.mod}
  return h
}`;
    case "odd-sum":
      return `private fun ${h.name}(nums: IntArray): Int {
  var acc = ${L.acc}
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * ${L.fac}) % ${L.mod}
  }
  return acc
}`;
    case "clamp":
      return `private fun ${h.name}(n: Int, m: Int): Int {
  val span = (m % ${L.span}) + ${L.add}
  val x = n % span
  return if (x < 0) x + span else x
}`;
    case "shift-xor":
      return `private fun ${h.name}(n: Int, k: Int): Int {
  val x = (n xor k) shl ${L.sh}
  return (x xor ${L.xor}) and ${L.mask}
}`;
    default:
      return `private fun ${h.name}(s: String): Int {
  var x = ${L.x0}
  for (i in s.indices) x = (x + s[i].code * ${L.mul}) and ${L.mask}
  return x
}`;
  }
}

function javaHelperSrc(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `    private static int ${h.name}(String s) {
        int h = ${L.h0};
        for (int i = 0; i < s.length(); i++) h = (h ^ (s.charAt(i) * ${L.mul})) % ${L.mod};
        return h;
    }`;
    case "odd-sum":
      return `    private static int ${h.name}(int[] nums) {
        int acc = ${L.acc};
        for (int n : nums) {
            if ((n & 1) == 0) continue;
            acc = (acc + n * ${L.fac}) % ${L.mod};
        }
        return acc;
    }`;
    case "clamp":
      return `    private static int ${h.name}(int n, int m) {
        int span = (m % ${L.span}) + ${L.add};
        int x = n % span;
        return x < 0 ? x + span : x;
    }`;
    case "shift-xor":
      return `    private static int ${h.name}(int n, int k) {
        int x = (n ^ k) << ${L.sh};
        return (x ^ ${L.xor}) & ${L.mask};
    }`;
    default:
      return `    private static int ${h.name}(String s) {
        int x = ${L.x0};
        for (int i = 0; i < s.length(); i++) x = (x + s.charAt(i) * ${L.mul}) & ${L.mask};
        return x;
    }`;
  }
}

function tsCall(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `void ${h.name}('${L.s1}');`;
    case "odd-sum":
      return `void ${h.name}([${L.arr.join(", ")}]);`;
    case "clamp":
      return `void ${h.name}(${L.a}, ${Math.max(1, L.b)});`;
    case "shift-xor":
      return `void ${h.name}(${L.a}, ${L.b});`;
    default:
      return `void ${h.name}('${L.s2}');`;
  }
}

function ktCallExpr(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `${h.name}("${L.s1}")`;
    case "odd-sum":
      return `${h.name}(intArrayOf(${L.arr.join(", ")}))`;
    case "clamp":
      return `${h.name}(${L.a}, ${Math.max(1, L.b)})`;
    case "shift-xor":
      return `${h.name}(${L.a}, ${L.b})`;
    default:
      return `${h.name}("${L.s2}")`;
  }
}

function javaCallExpr(h) {
  const L = h.lit;
  switch (h.shape) {
    case "hash-mix":
      return `${h.name}("${L.s1}")`;
    case "odd-sum":
      return `${h.name}(new int[]{${L.arr.join(", ")}})`;
    case "clamp":
      return `${h.name}(${L.a}, ${Math.max(1, L.b)})`;
    case "shift-xor":
      return `${h.name}(${L.a}, ${L.b})`;
    default:
      return `${h.name}("${L.s2}")`;
  }
}

function replaceInCode(content, from, to) {
  if (!from || from === to) return content;
  const re = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
  let out = "";
  let i = 0;
  let q = null;
  let lineComment = false;
  let blockComment = false;
  while (i < content.length) {
    if (lineComment) {
      out += content[i];
      if (content[i] === "\n") lineComment = false;
      i++;
      continue;
    }
    if (blockComment) {
      out += content[i];
      if (content[i] === "*" && content[i + 1] === "/") {
        out += content[i + 1];
        i += 2;
        blockComment = false;
        continue;
      }
      i++;
      continue;
    }
    if (!q && content[i] === "/" && content[i + 1] === "/") {
      lineComment = true;
      out += content[i];
      i++;
      continue;
    }
    if (!q && content[i] === "/" && content[i + 1] === "*") {
      blockComment = true;
      out += content[i];
      i++;
      continue;
    }
    if (!q && (content[i] === '"' || content[i] === "'" || content[i] === "`")) {
      q = content[i];
      out += content[i];
      i++;
      continue;
    }
    if (q) {
      out += content[i];
      if (content[i] === "\\" && i + 1 < content.length) {
        out += content[i + 1];
        i += 2;
        continue;
      }
      if (content[i] === q) q = null;
      i++;
      continue;
    }
    re.lastIndex = i;
    const mm = re.exec(content);
    if (mm && mm.index === i) {
      // Don't rewrite Math.round / obj.round etc. when from is a platform stem
      const prev = i > 0 ? content[i - 1] : "";
      if (prev === ".") {
        out += content[i];
        i++;
        continue;
      }
      out += to;
      i += from.length;
      continue;
    }
    out += content[i];
    i++;
  }
  return out;
}

function extractV23VoidBlock(content) {
  const parts = content.split(`/* obfuscation-batch:v${BATCH} */`);
  if (parts.length < 2) return "";
  const batch = parts[1];
  const names = [...batch.matchAll(/function\s+([A-Za-z_][\w]*ObfV23[\w]*)/g)].map((x) => x[1]);
  if (names.length === 0) return "";
  const calls = [];
  for (const name of names) {
    const re = new RegExp(`void\\s+${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\([^;]*\\);`);
    const m = content.match(re);
    if (m) calls.push(m[0]);
  }
  return calls.join("");
}

function fillMissingTsCallers(file) {
  let content = fs.readFileSync(file, "utf8");
  const voidBlock = extractV23VoidBlock(content);
  if (!voidBlock) return { file, skipped: true };
  const callers = findTsCallers(content);
  let added = 0;
  for (let i = callers.length - 1; i >= 0; i--) {
    const p = callers[i];
    const around = content.slice(p.index, Math.min(content.length, p.index + 220));
    if (around.includes(`ObfV${BATCH}`)) continue;
    content = content.slice(0, p.index + 1) + voidBlock + content.slice(p.index + 1);
    added++;
  }
  if (added > 0) fs.writeFileSync(file, content, "utf8");
  return { file, added };
}

function applyTsFile(file) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes(`obfuscation-batch:v${BATCH}`)) return fillMissingTsCallers(file);
  const base = path.basename(file, path.extname(file));
  const slug = stripFrag(base).replace(/[^A-Za-z0-9]/g, "") || "File";
  const { helpers } = makeHelpers(slug, "ts");
  const voidBlock = helpers.map(tsCall).join("");
  const callers = findTsCallers(content);
  if (callers.length > 0) {
    for (let i = callers.length - 1; i >= 0; i--) {
      const p = callers[i];
      const insertAt = p.index + 1;
      const around = content.slice(p.index, Math.min(content.length, p.index + 80));
      if (around.includes(`ObfV${BATCH}`)) continue;
      content = content.slice(0, insertAt) + voidBlock + content.slice(insertAt);
    }
  }
  const helperSrc =
    `\n/* obfuscation-batch:v${BATCH} */\n` +
    helpers.map(tsHelperSrc).join("\n") +
    (callers.length === 0 ? "\n" + helpers.map(tsCall).join("\n") + "\n" : "\n");
  content = content.replace(/\s*$/, "") + helperSrc;
  fs.writeFileSync(file, content, "utf8");
  return { file, helpers: helpers.length, callers: callers.length };
}

function applyKtFile(file) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("autosetup-decoy:v1") || content.includes("dex-lanes:v1")) {
    return { file, skipped: true };
  }
  if (content.includes(`obfuscation-batch:v${BATCH}`)) return { file, skipped: true };
  const base = path.basename(file, path.extname(file));
  if (SKIP_DECOY.has(stripFrag(base)) || SKIP_DECOY.has(base) || /^Dichyikowrdfpagthms/.test(base)) {
    return { file, skipped: true };
  }
  const slug = stripFrag(base).replace(/[^A-Za-z0-9]/g, "") || "Host";
  const { helpers } = makeHelpers(slug, "kt");
  const xorExpr = helpers.map(ktCallExpr).join(" xor ");
  const sinkLine = `@Suppress("UNUSED_VARIABLE") val ${FRAG}SinkV${BATCH} = ${xorExpr}`;
  const callers = findKotlinFuns(content);
  if (callers.length > 0) {
    for (let i = callers.length - 1; i >= 0; i--) {
      const p = callers[i];
      const around = content.slice(p.index, Math.min(content.length, p.index + 200));
      if (around.includes(`SinkV${BATCH}`)) continue;
      const ind = indentAt(content, p.index);
      content =
        content.slice(0, p.index + 1) +
        `\n${ind}${sinkLine}\n` +
        content.slice(p.index + 1);
    }
  }
  const boot = `@Suppress("UNUSED_VARIABLE") private val ${FRAG}${slug}SinkV${BATCH}Boot = ${xorExpr}`;
  const helperSrc =
    `\n/* obfuscation-batch:v${BATCH} */\n` +
    helpers.map(ktHelperSrc).join("\n\n") +
    `\n${boot}\n`;
  content = content.replace(/\s*$/, "") + helperSrc;
  fs.writeFileSync(file, content, "utf8");
  return { file, helpers: helpers.length, callers: callers.length };
}

function applyJavaFile(file) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes(`obfuscation-batch:v${BATCH}`)) return { file, skipped: true };
  if (file.replace(/\\/g, "/").includes("rnobfuscator")) return { file, skipped: true };
  const base = path.basename(file, path.extname(file));
  const slug = stripFrag(base).replace(/[^A-Za-z0-9]/g, "") || "Host";
  const classMatch = content.match(/\b(?:public\s+)?(?:final\s+)?class\s+([A-Za-z_][\w]*)/);
  const className = classMatch ? classMatch[1] : slug;
  const { helpers } = makeHelpers(slug, "java");
  const xorExpr = helpers.map(javaCallExpr).join(" ^ ");
  const sinkLine = `@SuppressWarnings("unused") final int ${FRAG}SinkV${BATCH} = ${xorExpr};`;
  const callers = findJavaMethods(content, className);
  if (callers.length > 0) {
    for (let i = callers.length - 1; i >= 0; i--) {
      const p = callers[i];
      let insertAt = p.index + 1;
      const ind = indentAt(content, p.index);
      if (p.isCtor) {
        let j = skipWs(content, insertAt);
        if (content.startsWith("super(", j) || content.startsWith("this(", j)) {
          const paren = content.indexOf("(", j);
          const after = skipBalanced(content, paren, "(", ")");
          if (after > 0) {
            let k = skipWs(content, after);
            if (content[k] === ";") insertAt = k + 1;
          }
        }
      }
      const around = content.slice(p.index, Math.min(content.length, insertAt + 180));
      if (around.includes(`SinkV${BATCH}`)) continue;
      content = content.slice(0, insertAt) + `\n${ind}${sinkLine}` + content.slice(insertAt);
    }
  }
  const helperSrc =
    `\n    /* obfuscation-batch:v${BATCH} */\n` +
    helpers.map(javaHelperSrc).join("\n\n") +
    `\n    @SuppressWarnings("unused") private static final int ${FRAG}${slug}SinkV${BATCH}Boot = ${xorExpr};\n`;
  const lastBrace = content.lastIndexOf("}");
  if (lastBrace >= 0) {
    content = content.slice(0, lastBrace) + helperSrc + content.slice(lastBrace);
  } else {
    content += helperSrc;
  }
  fs.writeFileSync(file, content, "utf8");
  return { file, helpers: helpers.length, callers: callers.length };
}

function collectGameRenames(files) {
  const map = new Map();
  const add = (name, salt) => {
    if (!name || name.includes(FRAG)) return;
    if (RENAME_SKIP.has(name) || PLATFORM_STYLE.has(name)) return;
    if (name.length < 5) return;
    if (isHelperName(name)) return;
    if (map.has(name)) return;
    const rnd = mulberry32(mix32(hashSeed(`gamerename:${salt}:${name}:${FRAG}`)));
    map.set(name, insertFrag(name, FRAG, rnd));
  };
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const base = path.basename(file, path.extname(file));
    if (!base.includes(FRAG) && !/^index$/i.test(base) && !/Part\d+$/i.test(stripFrag(base))) {
      const rnd = mulberry32(mix32(hashSeed(`gamestamp::${base}:${FRAG}`)));
      map.set("__file__:" + file, insertFrag(base, FRAG, rnd) + path.extname(file));
    }
    let m;
    const reExportFn = /\bexport\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_][\w]*)/g;
    while ((m = reExportFn.exec(raw))) add(m[1], base);
    const reExportConst = /\bexport\s+const\s+([A-Za-z_][\w]*)/g;
    while ((m = reExportConst.exec(raw))) add(m[1], base);
    const reExportType = /\bexport\s+(?:type|interface|class|enum)\s+([A-Za-z_][\w]*)/g;
    while ((m = reExportType.exec(raw))) add(m[1], base);
    const reBase = /\bfunction\s+([A-Za-z_][\w]*Base)\b/g;
    while ((m = reBase.exec(raw))) add(m[1], base);
    const reFn = /\bfunction\s+([A-Za-z_][\w]*)\s*\(/g;
    while ((m = reFn.exec(raw))) add(m[1], base);
  }
  return map;
}

function applyGameRenames(gameFiles) {
  const appTsx = path.join(ROOT, "App.tsx");
  const map = collectGameRenames(gameFiles);
  const fileRenames = [];
  const identPairs = [];
  for (const [k, v] of map.entries()) {
    if (k.startsWith("__file__:")) {
      fileRenames.push({ from: k.slice("__file__:".length), toName: v });
    } else {
      identPairs.push([k, v]);
    }
  }
  identPairs.sort((a, b) => b[0].length - a[0].length);
  const targets = [...gameFiles];
  if (fs.existsSync(appTsx)) targets.push(appTsx);
  let rewritten = 0;
  for (const file of targets) {
    let raw = fs.readFileSync(file, "utf8");
    const before = raw;
    for (const [from, to] of identPairs) {
      raw = replaceInCode(raw, from, to);
    }
    for (const job of fileRenames) {
      const oldBase = path.basename(job.from, path.extname(job.from));
      const newBase = path.basename(job.toName, path.extname(job.toName));
      if (oldBase !== newBase) raw = replaceInCode(raw, oldBase, newBase);
    }
    if (raw !== before) {
      fs.writeFileSync(file, raw, "utf8");
      rewritten++;
    }
  }
  let renamed = 0;
  for (const job of fileRenames.sort((a, b) => b.from.length - a.from.length)) {
    const dest = path.join(path.dirname(job.from), job.toName);
    if (job.from === dest) continue;
    if (fs.existsSync(dest)) continue;
    fs.renameSync(job.from, dest);
    renamed++;
  }
  return { rewritten, renamed, idents: identPairs.length };
}

function repairPlatform(dir) {
  const files = walk(dir, new Set([".ts", ".tsx"]));
  let fixes = 0;
  for (const file of files) {
    let c = fs.readFileSync(file, "utf8");
    const before = c;
    c = c.replace(/Math\.rouichyikowrdfpagthmsnd\b/g, "Math.round");
    c = c.replace(/Math\.flichyikowrdfpagthmsoor\b/g, "Math.floor");
    c = c.replace(/Math\.raichyikowrdfpagthmsndom\b/g, "Math.random");
    c = c.replace(/Math\.aichyikowrdfpagthmsbs\b/g, "Math.abs");
    c = c.replace(/Math\.minichyikowrdfpagthms\b/g, "Math.min");
    c = c.replace(/Math\.michyikowrdfpagthmsax\b/g, "Math.max");
    if (c !== before) {
      fs.writeFileSync(file, c, "utf8");
      fixes++;
    }
  }
  return fixes;
}

function main() {
  const tsExt = new Set([".ts", ".tsx"]);
  const services = walk(path.join(ROOT, "services"), tsExt);
  const game = walk(path.join(ROOT, "Layouts", "Game"), tsExt);
  const android = walk(
    path.join(ROOT, "android", "app", "src", "main", "java"),
    new Set([".kt", ".java"])
  ).filter((f) => {
    const n = path.basename(f, path.extname(f));
    const rel = f.replace(/\\/g, "/");
    if (rel.includes("/rnobfuscator/")) return false;
    if (rel.includes("/build/")) return false;
    if (SKIP_DECOY.has(n) || SKIP_DECOY.has(stripFrag(n))) return false;
    if (n.startsWith("D" + FRAG) || n.startsWith("Dichyikowrdfpagthms")) return false;
    const txt = fs.readFileSync(f, "utf8").slice(0, 80);
    if (txt.includes("autosetup-decoy:v1") || txt.includes("dex-lanes:v1")) return false;
    return true;
  });

  const roundFix = repairPlatform(path.join(ROOT, "Layouts", "Game"));
  const renamed = applyGameRenames(game);
  const gameAfter = walk(path.join(ROOT, "Layouts", "Game"), tsExt);

  const stats = { ts: [], kt: [], java: [] };
  for (const f of services) stats.ts.push(applyTsFile(f));
  for (const f of gameAfter) stats.ts.push(applyTsFile(f));
  for (const f of android) {
    if (f.endsWith(".kt")) stats.kt.push(applyKtFile(f));
    else stats.java.push(applyJavaFile(f));
  }

  const summarize = (arr) => {
    const done = arr.filter((x) => !x.skipped);
    const skip = arr.filter((x) => x.skipped);
    return { done: done.length, skip: skip.length };
  };
  console.log(JSON.stringify({
    fragment: FRAG,
    batch: BATCH,
    roundFix,
    renamed,
    services: services.length,
    game: gameAfter.length,
    android: android.length,
    ts: summarize(stats.ts),
    kt: summarize(stats.kt),
    java: summarize(stats.java),
  }, null, 2));
}

main();
