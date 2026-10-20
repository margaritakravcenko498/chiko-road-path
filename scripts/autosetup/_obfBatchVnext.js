/**
 * One-shot services-obfuscation batch.
 * New helpers only; does not rename identifiers.
 * Sinks go at the start of real methods, never inside Obf helpers or lambdas.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const parser = require("@babel/parser");

const FRAGMENT = "ichyikowrdfpagthms";
const ROOT = path.resolve(__dirname, "..", "..");
const SHAPES = ["hash", "odds", "clamp", "shift", "byte"];
const SKIP_DIR = new Set(["node_modules", ".git", "build", ".gradle", "Pods"]);

function newlineOf(source) {
  return source.includes("\r\n") ? "\r\n" : "\n";
}

function fnv1a(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
}

function pick(rng, lo, hi) {
  return lo + (rng() % (hi - lo + 1));
}

function nextBatch(source) {
  let max = 0;
  const re = /ObfV(\d+)/gi;
  let match;
  while ((match = re.exec(source))) max = Math.max(max, Number(match[1]) || 0);
  return max + 1;
}

function slugFrom(filePath) {
  const base = path.basename(filePath, path.extname(filePath)).replace(/[^A-Za-z0-9]/g, "");
  return (base || "file").slice(0, 18);
}

function ident(fragment, slug, batch, suffix) {
  const frag = /^[A-Za-z_]/.test(fragment) ? fragment : `f${fragment || "app"}`;
  return `${frag}${slug}ObfV${batch}${suffix}`.replace(/[^A-Za-z0-9_]/g, "");
}

function seedString(rng) {
  const alphabet = "abcdefghijklmnop0123456789";
  const len = pick(rng, 2, 6);
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[rng() % alphabet.length];
  return s;
}

function planBatch(filePath, source) {
  const batch = nextBatch(source);
  const slug = slugFrom(filePath);
  const seed = fnv1a(`${FRAGMENT}\0${slug}\0${batch}`);
  const rng = makeRng(seed);
  const count = 1 + (seed % 4);
  const start = seed % SHAPES.length;
  const shapes = [];
  for (let n = 0; n < count; n++) shapes.push(SHAPES[(start + n) % SHAPES.length]);
  const helpers = shapes.map((shape) => {
    const suffix =
      shape === "hash"
        ? "HashMix"
        : shape === "odds"
          ? "SumOdds"
          : shape === "clamp"
            ? "ClampMod"
            : shape === "shift"
              ? "ShiftXor"
              : "ByteFold";
    const name = ident(FRAGMENT, slug, batch, suffix);
    const acc = pick(rng, 2, 90);
    const mul = pick(rng, 3, 41);
    const mod = pick(rng, 80, 900);
    const shift = pick(rng, 1, 7);
    const xor = pick(rng, 1, 250);
    const mask = pick(rng, 256, 60000);
    const spanMod = pick(rng, 20, 70);
    const spanAdd = pick(rng, 2, 12);
    let callTs;
    let callKt;
    let callJava;
    if (shape === "hash" || shape === "byte") {
      const text = seedString(rng);
      callTs = `${name}(${JSON.stringify(text)})`;
      callKt = `${name}(${JSON.stringify(text)})`;
      callJava = `${name}(${JSON.stringify(text)})`;
    } else if (shape === "odds") {
      const nums = [pick(rng, 1, 40), pick(rng, 1, 40), pick(rng, 1, 40)];
      callTs = `${name}([${nums.join(", ")}])`;
      callKt = `${name}(intArrayOf(${nums.join(", ")}))`;
      callJava = `${name}(new int[]{${nums.join(", ")}})`;
    } else {
      const a = pick(rng, 1, 80);
      const b = pick(rng, 1, 80);
      callTs = `${name}(${a}, ${b})`;
      callKt = `${name}(${a}, ${b})`;
      callJava = `${name}(${a}, ${b})`;
    }
    return { shape, name, acc, mul, mod, shift, xor, mask, spanMod, spanAdd, callTs, callKt, callJava };
  });
  return { batch, slug, helpers };
}

function tsHelperSource(h, nl) {
  if (h.shape === "hash") {
    return (
      `function ${h.name}(s: string): number {${nl}` +
      `  let h = ${h.acc};${nl}` +
      `  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * ${h.mul})) % ${h.mod};${nl}` +
      `  return h;${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "odds") {
    return (
      `function ${h.name}(nums: number[]): number {${nl}` +
      `  let acc = ${h.acc};${nl}` +
      `  for (let i = 0; i < nums.length; i++) {${nl}` +
      `    const n = nums[i];${nl}` +
      `    if ((n & 1) === 0) continue;${nl}` +
      `    acc = (acc + n * ${h.mul}) % ${h.mod};${nl}` +
      `  }${nl}` +
      `  return acc;${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "clamp") {
    return (
      `function ${h.name}(n: number, m: number): number {${nl}` +
      `  const span = (m % ${h.spanMod}) + ${h.spanAdd};${nl}` +
      `  const x = ((n ^ ${h.xor}) << ${h.shift}) % span;${nl}` +
      `  return x < 0 ? x + span : x;${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "shift") {
    return (
      `function ${h.name}(n: number, k: number): number {${nl}` +
      `  const x = (n ^ k) << ${h.shift};${nl}` +
      `  return (x ^ ${h.xor}) & ${h.mask};${nl}` +
      `}${nl}`
    );
  }
  return (
    `function ${h.name}(s: string): number {${nl}` +
    `  let x = ${h.acc};${nl}` +
    `  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * ${h.mul}) & ${h.mask};${nl}` +
    `  return x;${nl}` +
    `}${nl}`
  );
}

function ktHelperSource(h, nl) {
  if (h.shape === "hash") {
    return (
      `private fun ${h.name}(s: String): Int {${nl}` +
      `    var h = ${h.acc}${nl}` +
      `    for (i in s.indices) h = (h xor (s[i].code * ${h.mul})) % ${h.mod}${nl}` +
      `    return h${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "odds") {
    return (
      `private fun ${h.name}(nums: IntArray): Int {${nl}` +
      `    var acc = ${h.acc}${nl}` +
      `    for (n in nums) {${nl}` +
      `        if ((n and 1) == 0) continue${nl}` +
      `        acc = (acc + n * ${h.mul}) % ${h.mod}${nl}` +
      `    }${nl}` +
      `    return acc${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "clamp") {
    return (
      `private fun ${h.name}(n: Int, m: Int): Int {${nl}` +
      `    val span = (m % ${h.spanMod}) + ${h.spanAdd}${nl}` +
      `    val x = ((n xor ${h.xor}) shl ${h.shift}) % span${nl}` +
      `    return if (x < 0) x + span else x${nl}` +
      `}${nl}`
    );
  }
  if (h.shape === "shift") {
    return (
      `private fun ${h.name}(n: Int, k: Int): Int {${nl}` +
      `    val x = (n xor k) shl ${h.shift}${nl}` +
      `    return (x xor ${h.xor}) and ${h.mask}${nl}` +
      `}${nl}`
    );
  }
  return (
    `private fun ${h.name}(s: String): Int {${nl}` +
    `    var x = ${h.acc}${nl}` +
    `    for (i in s.indices) x = (x + s[i].code * ${h.mul}) and ${h.mask}${nl}` +
    `    return x${nl}` +
    `}${nl}`
  );
}

function javaHelperSource(h, nl) {
  const head = (retParams) => `    @SuppressWarnings("unused")${nl}    private static int ${h.name}(${retParams}) {${nl}`;
  if (h.shape === "hash") {
    return (
      head("String s") +
      `        int h = ${h.acc};${nl}` +
      `        for (int i = 0; i < s.length(); i++) h = (h ^ (s.charAt(i) * ${h.mul})) % ${h.mod};${nl}` +
      `        return h;${nl}` +
      `    }${nl}`
    );
  }
  if (h.shape === "odds") {
    return (
      head("int[] nums") +
      `        int acc = ${h.acc};${nl}` +
      `        for (int n : nums) {${nl}` +
      `            if ((n & 1) == 0) continue;${nl}` +
      `            acc = (acc + n * ${h.mul}) % ${h.mod};${nl}` +
      `        }${nl}` +
      `        return acc;${nl}` +
      `    }${nl}`
    );
  }
  if (h.shape === "clamp") {
    return (
      head("int n, int m") +
      `        int span = (m % ${h.spanMod}) + ${h.spanAdd};${nl}` +
      `        int x = ((n ^ ${h.xor}) << ${h.shift}) % span;${nl}` +
      `        return x < 0 ? x + span : x;${nl}` +
      `    }${nl}`
    );
  }
  if (h.shape === "shift") {
    return (
      head("int n, int k") +
      `        int x = (n ^ k) << ${h.shift};${nl}` +
      `        return (x ^ ${h.xor}) & ${h.mask};${nl}` +
      `    }${nl}`
    );
  }
  return (
    head("String s") +
    `        int x = ${h.acc};${nl}` +
    `        for (int i = 0; i < s.length(); i++) x = (x + s.charAt(i) * ${h.mul}) & ${h.mask};${nl}` +
    `        return x;${nl}` +
    `    }${nl}`
  );
}

function renderEdits(source, edits) {
  const items = edits.filter((edit) => edit && edit.end >= edit.start);
  function renderRange(start, end, skip) {
    const top = [];
    const sorted = items
      .filter((edit) => edit !== skip && edit.start >= start && edit.end <= end)
      .sort((a, b) => a.start - b.start || b.end - a.end);
    for (const edit of sorted) {
      const parent = top[top.length - 1];
      if (parent && edit.start < parent.end) continue;
      if (parent && edit.start === parent.start && edit.end === parent.end) continue;
      top.push(edit);
    }
    let out = "";
    let cursor = start;
    for (const edit of top) {
      out += source.slice(cursor, edit.start);
      if (edit.bodyStart != null) {
        out += edit.prefix + renderRange(edit.bodyStart, edit.bodyEnd, edit) + edit.suffix;
      } else {
        out += edit.text;
      }
      cursor = edit.end;
    }
    out += source.slice(cursor, end);
    return out;
  }
  return renderRange(0, source.length, null);
}

function functionName(node) {
  if (!node) return "";
  if (node.id && node.id.type === "Identifier") return node.id.name;
  if (node.key && node.key.type === "Identifier") return node.key.name;
  if (node.key && node.key.type === "StringLiteral") return String(node.key.value);
  return "";
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

function isHelperName(name) {
  if (!name) return false;
  if (/ObfV\d+/i.test(name)) return true;
  if (/Game(?:MixSeed|FoldRange|ClampSpan)$/.test(name)) return true;
  return false;
}

function walk(node, helperDepth, visit) {
  if (!node || typeof node !== "object") return;
  const depth = helperDepth + (isFunctionNode(node) && isHelperName(functionName(node)) ? 1 : 0);
  visit(node, depth);
  for (const key of Object.keys(node)) {
    if (
      key === "loc" ||
      key === "range" ||
      key === "leadingComments" ||
      key === "trailingComments" ||
      key === "innerComments"
    ) {
      continue;
    }
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item.type === "string") walk(item, depth, visit);
      }
    } else if (value && typeof value.type === "string") {
      walk(value, depth, visit);
    }
  }
}

function expandParens(source, start, end) {
  while (true) {
    let left = start - 1;
    while (left >= 0 && /\s/.test(source[left])) left--;
    let right = end;
    while (right < source.length && /\s/.test(source[right])) right++;
    if (source[left] === "(" && source[right] === ")") {
      start = left;
      end = right + 1;
      continue;
    }
    break;
  }
  return { start, end };
}

function transformTypeScript(source, filePath) {
  const ast = parser.parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: false,
  });
  const nl = newlineOf(source);
  const plan = planBatch(filePath, source);
  const voids = plan.helpers.map((h) => `void ${h.callTs};`).join(nl);
  const edits = [];

  walk(ast, 0, (node, depth) => {
    if (!isFunctionNode(node) || !node.body || node.body.start == null) return;
    if (isHelperName(functionName(node))) {
      if (node.body.type === "BlockStatement") {
        for (const stmt of node.body.body) {
          if (
            stmt.type === "ExpressionStatement" &&
            stmt.expression.type === "UnaryExpression" &&
            stmt.expression.operator === "void"
          ) {
            let end = stmt.end;
            if (source[end] === "\r") end++;
            if (source[end] === "\n") end++;
            edits.push({ start: stmt.start, end, text: "" });
          }
        }
      }
      return;
    }
    if (depth > 0) return;
    if (node.body.type === "BlockStatement") {
      edits.push({ start: node.body.start + 1, end: node.body.start + 1, text: `${nl}${voids}` });
      return;
    }
    if (node.type === "ArrowFunctionExpression") {
      const range = expandParens(source, node.body.start, node.body.end);
      edits.push({
        start: range.start,
        end: range.end,
        prefix: `{${nl}${voids}${nl}return (`,
        suffix: `);${nl}}`,
        bodyStart: node.body.start,
        bodyEnd: node.body.end,
      });
    }
  });

  let next = renderEdits(source, edits);
  if (!next.endsWith(nl)) next += nl;
  next += `${nl}/* obfuscation-batch:v${plan.batch} */${nl}`;
  for (const helper of plan.helpers) next += tsHelperSource(helper, nl);
  if (edits.length === 0) {
    next += plan.helpers.map((h) => `void ${h.callTs};`).join(nl) + nl;
  }
  try {
    parser.parse(next, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: false,
    });
  } catch (error) {
    require("node:fs").writeFileSync(require("node:path").join(__dirname, "_bad_transform.txt"), next);
    throw error;
  }
  return next;
}

function skipTriviaOrString(code, i) {
  if (i >= code.length) return i;
  const c = code[i];
  const n = code[i + 1];
  if (c === " " || c === "\t" || c === "\r" || c === "\n") {
    let j = i;
    while (j < code.length && (code[j] === " " || code[j] === "\t" || code[j] === "\r" || code[j] === "\n")) j++;
    return j;
  }
  if (c === "/" && n === "/") {
    const nl = code.indexOf("\n", i);
    return nl < 0 ? code.length : nl + 1;
  }
  if (c === "/" && n === "*") {
    const end = code.indexOf("*/", i + 2);
    return end < 0 ? code.length : end + 2;
  }
  if (code.startsWith('"""', i)) {
    const end = code.indexOf('"""', i + 3);
    return end < 0 ? code.length : end + 3;
  }
  if (c === '"' || c === "'") {
    let j = i + 1;
    while (j < code.length) {
      if (code[j] === "\\") {
        j += 2;
        continue;
      }
      if (code[j] === c) return j + 1;
      j++;
    }
    return j;
  }
  return i;
}

function isKeywordAt(code, i, word) {
  if (!code.startsWith(word, i)) return false;
  const prev = i > 0 ? code[i - 1] : " ";
  const next = code[i + word.length] || " ";
  if (/[A-Za-z0-9_]/.test(prev) || /[A-Za-z0-9_]/.test(next)) return false;
  return true;
}

function matchDelim(code, openIdx, open, close) {
  let i = openIdx + 1;
  let depth = 1;
  while (i < code.length && depth > 0) {
    const skipped = skipTriviaOrString(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    const c = code[i];
    if (c === open) depth++;
    else if (c === close) depth--;
    i++;
  }
  return i;
}

function matchBraceEnd(code, openIdx) {
  return matchDelim(code, openIdx, "{", "}");
}

function findExprEnd(code, i) {
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  while (i < code.length) {
    if (paren === 0 && brace === 0 && bracket === 0 && (code[i] === "\n" || code[i] === ";")) return i;
    const skipped = skipTriviaOrString(code, i);
    if (skipped > i) {
      if (paren === 0 && brace === 0 && bracket === 0) {
        for (let k = i; k < skipped; k++) {
          if (code[k] === "\n" || code[k] === ";") return k;
        }
      }
      i = skipped;
      continue;
    }
    const c = code[i];
    if (c === "(") paren++;
    else if (c === ")") {
      if (paren === 0) break;
      paren--;
    } else if (c === "{") brace++;
    else if (c === "}") {
      if (brace === 0) break;
      brace--;
      if (brace === 0 && paren === 0 && bracket === 0) return i + 1;
    } else if (c === "[") bracket++;
    else if (c === "]") bracket--;
    i++;
  }
  return i;
}

function readIdent(code, i) {
  let j = i;
  while (j < code.length && /[A-Za-z0-9_]/.test(code[j])) j++;
  return { text: code.slice(i, j), end: j };
}

function skipAngles(code, i) {
  if (code[i] !== "<") return i;
  let depth = 0;
  let j = i;
  while (j < code.length) {
    const skipped = skipTriviaOrString(code, j);
    if (skipped > j) {
      j = skipped;
      continue;
    }
    if (code[j] === "<") depth++;
    else if (code[j] === ">") {
      depth--;
      j++;
      if (depth === 0) return j;
      continue;
    }
    j++;
  }
  return j;
}

function skipType(code, i) {
  let paren = 0;
  let angle = 0;
  let bracket = 0;
  let j = i;
  while (j < code.length) {
    const skipped = skipTriviaOrString(code, j);
    if (skipped > j) {
      j = skipped;
      continue;
    }
    const c = code[j];
    if (c === "(") paren++;
    else if (c === ")") {
      if (paren === 0) break;
      paren--;
    } else if (c === "<") angle++;
    else if (c === ">") angle = Math.max(0, angle - 1);
    else if (c === "[") bracket++;
    else if (c === "]") bracket--;
    else if (paren === 0 && angle === 0 && bracket === 0 && (c === "{" || c === "=")) break;
    j++;
  }
  return j;
}

function parseKotlinFun(code, i) {
  let j = skipTriviaOrString(code, i + 3);
  if (code[j] === "<") j = skipTriviaOrString(code, skipAngles(code, j));
  let name = "";
  while (j < code.length) {
    j = skipTriviaOrString(code, j);
    if (code[j] === "<") {
      j = skipAngles(code, j);
      continue;
    }
    if (/[A-Za-z_]/.test(code[j] || "")) {
      const id = readIdent(code, j);
      name = id.text;
      j = skipTriviaOrString(code, id.end);
      if (code[j] === ".") {
        j++;
        continue;
      }
      if (code[j] === "<") j = skipTriviaOrString(code, skipAngles(code, j));
      break;
    }
    break;
  }
  j = skipTriviaOrString(code, j);
  if (code[j] !== "(") return null;
  j = matchDelim(code, j, "(", ")");
  j = skipTriviaOrString(code, j);
  if (code[j] === ":") j = skipType(code, j + 1);
  j = skipTriviaOrString(code, j);
  if (code[j] === "{") {
    return { name, kind: "block", brace: j, resumeAt: j + 1 };
  }
  if (code[j] === "=") {
    const exprStart = skipTriviaOrString(code, j + 1);
    const exprEnd = findExprEnd(code, exprStart);
    return { name, kind: "expr", eq: j, exprEnd, resumeAt: exprEnd };
  }
  return null;
}

function afterSuperCall(code, braceIndex) {
  const k = skipTriviaOrString(code, braceIndex + 1);
  if (!/^(super|this)\s*\(/.test(code.slice(k, k + 24))) return braceIndex + 1;
  const paren = code.indexOf("(", k);
  let end = matchDelim(code, paren, "(", ")");
  if (code[end] === ";") end++;
  const lineBreak = code.indexOf("\n", end);
  return lineBreak < 0 ? end : lineBreak + 1;
}

function isSinkLine(line) {
  return /^[ \t]*(?:@Suppress(?:Warnings)?\([^)\n]*\)[ \t]*)?(?:val|final[ \t]+int|int)[ \t]+\w*Sink\w*[ \t]*=/.test(
    line
  );
}

function sinkRanges(code, start, end) {
  const ranges = [];
  let i = start;
  while (i < end) {
    const nl = code.indexOf("\n", i);
    const lineEnd = nl < 0 ? code.length : nl + 1;
    if (lineEnd > end + 1) break;
    const line = code.slice(i, Math.min(lineEnd, end));
    if (isSinkLine(line)) ranges.push({ start: i, end: lineEnd > end ? end : lineEnd, text: "" });
    if (nl < 0) break;
    i = lineEnd;
  }
  return ranges;
}

function braceBalance(code) {
  let depth = 0;
  let i = 0;
  while (i < code.length) {
    const skipped = skipTriviaOrString(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (code[i] === "{") depth++;
    else if (code[i] === "}") depth--;
    i++;
  }
  return depth;
}

function transformKotlin(source, filePath) {
  const nl = newlineOf(source);
  const plan = planBatch(filePath, source);
  const sink = `@Suppress("UNUSED_VARIABLE") val ${FRAGMENT}SinkV${plan.batch} = ${plan.helpers
    .map((h) => h.callKt)
    .join(" xor ")}`;
  const edits = [];
  let i = 0;
  while (i < source.length) {
    const skipped = skipTriviaOrString(source, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (isKeywordAt(source, i, "fun")) {
      const parsed = parseKotlinFun(source, i);
      if (!parsed) {
        i++;
        continue;
      }
      if (isHelperName(parsed.name)) {
        if (parsed.kind === "block") {
          const close = matchBraceEnd(source, parsed.brace);
          edits.push(...sinkRanges(source, parsed.brace + 1, close - 1));
        }
      } else if (parsed.kind === "block") {
        const at = afterSuperCall(source, parsed.brace);
        edits.push({ start: at, end: at, text: `${nl}        ${sink}` });
      } else {
        const expr = source.slice(parsed.eq + 1, parsed.exprEnd).trim();
        edits.push({
          start: parsed.eq,
          end: parsed.exprEnd,
          text: `{${nl}        ${sink}${nl}        return ${expr}${nl}    }`,
        });
      }
      i = parsed.resumeAt;
      continue;
    }
    if (isKeywordAt(source, i, "init")) {
      let j = skipTriviaOrString(source, i + 4);
      if (source[j] === "{") {
        edits.push({ start: j + 1, end: j + 1, text: `${nl}        ${sink}` });
        i = j + 1;
        continue;
      }
    }
    if (isKeywordAt(source, i, "constructor")) {
      let j = skipTriviaOrString(source, i + 11);
      if (source[j] === "(") {
        j = matchDelim(source, j, "(", ")");
        j = skipTriviaOrString(source, j);
        if (source[j] === ":") {
          let paren = 0;
          j++;
          while (j < source.length) {
            const sk = skipTriviaOrString(source, j);
            if (sk > j) {
              j = sk;
              continue;
            }
            if (source[j] === "(") paren++;
            else if (source[j] === ")") paren--;
            else if (source[j] === "{" && paren === 0) break;
            j++;
          }
        }
        j = skipTriviaOrString(source, j);
        if (source[j] === "{") {
          const at = afterSuperCall(source, j);
          edits.push({ start: at, end: at, text: `${nl}        ${sink}` });
          i = j + 1;
          continue;
        }
      }
    }
    i++;
  }
  const callers = edits.filter((edit) => edit.text).length;
  if (!callers) return source;
  let next = renderEdits(source, edits);
  if (braceBalance(next) !== braceBalance(source)) {
    throw new Error("kotlin brace balance changed before helpers");
  }
  if (!next.endsWith(nl)) next += nl;
  next += `${nl}/* obfuscation-batch:v${plan.batch} */${nl}`;
  for (const helper of plan.helpers) next += ktHelperSource(helper, nl);
  if (braceBalance(next) !== 0 && braceBalance(source) === 0) {
    throw new Error("kotlin brace balance broken");
  }
  return next;
}

function findJavaMethod(code, braceIndex) {
  let i = braceIndex - 1;
  while (i >= 0 && /\s/.test(code[i])) i--;
  const tail = code.slice(Math.max(0, i - 80), i + 1);
  if (/throws\s+[\w.,\s]+$/.test(tail)) {
    const idx = tail.lastIndexOf("throws");
    i = i - (tail.length - 1 - idx) - 1;
    while (i >= 0 && /\s/.test(code[i])) i--;
  }
  if (code[i] !== ")") return null;
  let depth = 1;
  i--;
  while (i >= 0 && depth > 0) {
    if (code[i] === ")") depth++;
    else if (code[i] === "(") depth--;
    i--;
  }
  const open = i + 1;
  let k = open - 1;
  while (k >= 0 && /\s/.test(code[k])) k--;
  const nameEnd = k + 1;
  while (k >= 0 && /[A-Za-z0-9_]/.test(code[k])) k--;
  const name = code.slice(k + 1, nameEnd);
  if (!name) return null;
  if (/^(if|for|while|switch|catch|else|do|try|synchronized|new)$/.test(name)) return null;
  const before = code.slice(Math.max(0, k - 30), k + 1);
  if (/\bnew\s*$/.test(before)) return null;
  if (/\b(class|interface|enum)\s*$/.test(before)) return null;
  const between = code.slice(code.lastIndexOf(")", braceIndex) === -1 ? open : open, braceIndex);
  if (/->/.test(code.slice(Math.max(0, braceIndex - 12), braceIndex))) return null;
  return { name, between };
}

function classNamesIn(code) {
  const names = new Set();
  const re = /\b(?:class|interface|enum)\s+([A-Za-z_]\w*)/g;
  let match;
  while ((match = re.exec(code))) names.add(match[1]);
  return names;
}

function lastTopLevelClose(code) {
  let depth = 0;
  let last = -1;
  let i = 0;
  while (i < code.length) {
    const skipped = skipTriviaOrString(code, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (code[i] === "{") depth++;
    else if (code[i] === "}") {
      depth--;
      if (depth === 0) last = i;
    }
    i++;
  }
  return last;
}

function transformJava(source, filePath) {
  const nl = newlineOf(source);
  const plan = planBatch(filePath, source);
  const sink = `@SuppressWarnings("unused") final int ${FRAGMENT}SinkV${plan.batch} = ${plan.helpers
    .map((h) => h.callJava)
    .join(" ^ ")};`;
  const classes = classNamesIn(source);
  const edits = [];
  let i = 0;
  while (i < source.length) {
    const skipped = skipTriviaOrString(source, i);
    if (skipped > i) {
      i = skipped;
      continue;
    }
    if (source[i] === "{") {
      const method = findJavaMethod(source, i);
      if (method) {
        const isCtor = classes.has(method.name);
        if (isHelperName(method.name) && !isCtor) {
          const close = matchBraceEnd(source, i);
          edits.push(...sinkRanges(source, i + 1, close - 1));
        } else {
          const at = isCtor ? afterSuperCall(source, i) : i + 1;
          edits.push({ start: at, end: at, text: `${nl}        ${sink}` });
        }
      }
    }
    i++;
  }
  const callers = edits.filter((edit) => edit.text).length;
  if (!callers) return source;
  let next = renderEdits(source, edits);
  const close = lastTopLevelClose(next);
  if (close < 0) throw new Error("java class close not found");
  const helpers = `${nl}    /* obfuscation-batch:v${plan.batch} */${nl}${plan.helpers
    .map((h) => javaHelperSource(h, nl))
    .join(nl)}`;
  next = next.slice(0, close) + helpers + next.slice(close);
  if (braceBalance(next) !== braceBalance(source)) throw new Error("java brace balance broken");
  return next;
}

function shouldSkipNative(rel, source) {
  const norm = rel.replace(/\\/g, "/");
  if (norm.includes("com/rnobfuscator/")) return true;
  if (source.includes("/* autosetup-decoy:v1 */")) return true;
  if (source.includes("/* dex-lanes:v1 */")) return true;
  return false;
}

async function walkFiles(dir, acc) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIR.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, acc);
    else acc.push(full);
  }
}

function splitTopArgs(src) {
  const args = [];
  let depth = 0;
  let cur = "";
  let i = 0;
  while (i < src.length) {
    const skipped = skipTriviaOrString(src, i);
    if (skipped > i && depth >= 0 && (src[i] === '"' || src[i] === "'" || src.startsWith('"""', i))) {
      cur += src.slice(i, skipped);
      i = skipped;
      continue;
    }
    const c = src[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === "," && depth === 0) {
      args.push(cur.trim());
      cur = "";
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function kotlinTypeOf(arg) {
  if (/^["']/.test(arg)) return "String";
  if (/^intArrayOf\(/.test(arg)) return "IntArray";
  if (/^(true|false)$/.test(arg)) return "Boolean";
  return "Int";
}

function javaTypeOf(arg) {
  if (/^["']/.test(arg)) return "String";
  if (/^new\s+int\[\]/.test(arg)) return "int[]";
  if (/^(true|false)$/.test(arg)) return "boolean";
  return "int";
}

function stubBody(lang, params, nl) {
  if (lang === "kt") {
    const lines = params.map((p, idx) => {
      if (p.type === "String") return `    acc = (acc + p${idx}.length * ${3 + idx}) and 65535`;
      if (p.type === "IntArray") return `    for (n in p${idx}) acc = (acc + n) and 65535`;
      if (p.type === "Boolean") return `    if (p${idx}) acc = acc xor ${9 + idx}`;
      return `    acc = acc xor p${idx}`;
    });
    return `    var acc = ${11 + params.length}${nl}${lines.join(nl)}${nl}    return acc`;
  }
  const lines = params.map((p, idx) => {
    if (p.type === "String") return `        acc = (acc + p${idx}.length() * ${3 + idx}) & 65535;`;
    if (p.type === "int[]") return `        for (int n : p${idx}) acc = (acc + n) & 65535;`;
    if (p.type === "boolean") return `        if (p${idx}) acc = acc ^ ${9 + idx};`;
    return `        acc = acc ^ p${idx};`;
  });
  return `        int acc = ${11 + params.length};${nl}${lines.join(nl)}${nl}        return acc;`;
}

async function repairMissingHelpers() {
  const javaRoot = path.join(ROOT, "android", "app", "src", "main", "java");
  const files = [];
  await walkFiles(javaRoot, files);
  const native = [];
  for (const file of files) {
    if (!/\.(kt|java)$/.test(file)) continue;
    const source = await fs.readFile(file, "utf8");
    const rel = path.relative(javaRoot, file);
    if (shouldSkipNative(rel, source)) continue;
    native.push({ file, source, lang: file.endsWith(".kt") ? "kt" : "java" });
  }
  const typeToFile = new Map();
  for (const item of native) {
    const re = /\b(?:object|class|interface)\s+([A-Za-z_]\w*)/g;
    let match;
    while ((match = re.exec(item.source))) {
      if (!typeToFile.has(match[1])) typeToFile.set(match[1], item.file);
    }
  }
  const defs = new Map();
  for (const item of native) {
    const set = new Set();
    const re = item.lang === "kt" ? /\bfun\s+(?:[A-Za-z_]\w*\s*\.\s*)?([A-Za-z_]\w*)\s*\(/g : /\b([A-Za-z_]\w*ObfV\d+\w*)\s*\(/g;
    let match;
    while ((match = re.exec(item.source))) {
      const idx = match.index;
      const prefix = item.source.slice(Math.max(0, idx - 12), idx);
      if (item.lang === "java" && !/\b(int|void|boolean|String|static)\s*$/.test(prefix) && !/\bstatic\s+int\s*$/.test(prefix)) {
        continue;
      }
      set.add(match[1]);
    }
    if (item.lang === "java") {
      const re2 = /\b(?:int|void|boolean|String)\s+([A-Za-z_]\w*)\s*\(/g;
      while ((match = re2.exec(item.source))) set.add(match[1]);
    }
    defs.set(item.file, set);
  }
  /** @type {Map<string, { lang: string, owner: string | null, name: string, params: { type: string }[] }[]>} */
  const additions = new Map();
  const seen = new Set();
  for (const item of native) {
    const re = /([A-Za-z_]\w*)\s*\.\s*([A-Za-z_]\w*ObfV\d+\w*)\s*\(([^;{}]*)\)|(^|[^.\w])([A-Za-z_]\w*ObfV\d+\w*)\s*\(([^;{}]*)\)/g;
    let match;
    while ((match = re.exec(item.source))) {
      const qualified = Boolean(match[2]);
      const owner = qualified ? match[1] : null;
      const name = qualified ? match[2] : match[5];
      const args = qualified ? match[3] : match[6];
      const at = match.index;
      const before = item.source.slice(Math.max(0, at - 8), at);
      if (/\bfun\s*$/.test(before) || /\bint\s*$/.test(before)) continue;
      const home = owner ? typeToFile.get(owner) : item.file;
      if (!home) continue;
      const known = defs.get(home);
      if (known && known.has(name)) continue;
      const types = splitTopArgs(args).map((arg) => ({
        type: (native.find((n) => n.file === home) || item).lang === "kt" ? kotlinTypeOf(arg) : javaTypeOf(arg),
      }));
      const key = `${home}|${name}|${types.map((t) => t.type).join(",")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!additions.has(home)) additions.set(home, []);
      additions.get(home).push({
        lang: (native.find((n) => n.file === home) || item).lang,
        owner,
        name,
        params: types,
      });
      if (known) known.add(name);
    }
  }
  let added = 0;
  for (const [file, stubs] of additions) {
    let source = await fs.readFile(file, "utf8");
    const nl = newlineOf(source);
    const chunks = [];
    for (const stub of stubs) {
      const params = stub.params.map((p, idx) => `${stub.lang === "kt" ? `p${idx}: ${p.type}` : `${p.type} p${idx}`}`).join(", ");
      const body = stubBody(stub.lang, stub.params, nl);
      if (stub.lang === "kt") {
        const fun = ownerFun(stub, params, body, nl);
        if (stub.owner) {
          const re = new RegExp(`\\b(?:object|class|interface)\\s+${stub.owner}\\b`);
          const found = re.exec(source);
          if (!found) continue;
          const brace = source.indexOf("{", found.index);
          const close = matchBraceEnd(source, brace) - 1;
          source = source.slice(0, close) + fun + source.slice(close);
        } else {
          chunks.push(fun.trim() + nl);
        }
      } else {
        const fun =
          `${nl}    public static int ${stub.name}(${params}) {${nl}` +
          `${body}${nl}` +
          `    }${nl}`;
        const close = lastTopLevelClose(source);
        if (close < 0) continue;
        source = source.slice(0, close) + fun + source.slice(close);
      }
      added++;
    }
    if (chunks.length) {
      if (!source.endsWith(nl)) source += nl;
      source += nl + chunks.join(nl);
    }
    await fs.writeFile(file, source, "utf8");
  }
  return added;
}

function ownerFun(stub, params, body, nl) {
  const mods = stub.owner ? "fun" : "private fun";
  return `${nl}    ${mods} ${stub.name}(${params}): Int {${nl}${body}${nl}    }${nl}`;
}

function realExprEnd(code, i) {
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  while (i < code.length) {
    if (paren === 0 && brace === 0 && bracket === 0 && (code[i] === "\n" || code[i] === ";")) return i;
    if (code.startsWith('"""', i)) {
      const end = code.indexOf('"""', i + 3);
      i = end < 0 ? code.length : end + 3;
      continue;
    }
    if (code[i] === '"') {
      i++;
      while (i < code.length) {
        if (code[i] === "\\") {
          i += 2;
          continue;
        }
        if (code[i] === '"') {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    const c = code[i];
    if (c === "(") paren++;
    else if (c === ")") {
      if (paren === 0) return i;
      paren--;
    } else if (c === "{") brace++;
    else if (c === "}") {
      if (brace === 0) return i;
      brace--;
      if (brace === 0 && paren === 0 && bracket === 0) return i + 1;
    } else if (c === "[") bracket++;
    else if (c === "]") {
      if (bracket === 0) return i;
      bracket--;
    }
    i++;
  }
  return i;
}

function repairSwallowedKotlin(code) {
  let next = code;
  let guard = 0;
  while (guard < 50) {
    guard++;
    let i = 0;
    let moved = false;
    while (i < next.length) {
      const skipped = skipTriviaOrString(next, i);
      if (skipped > i) {
        i = skipped;
        continue;
      }
      if (!isKeywordAt(next, i, "fun")) {
        i++;
        continue;
      }
      const parsed = parseKotlinFun(next, i);
      if (!parsed || parsed.kind !== "block" || isHelperName(parsed.name)) {
        i = parsed ? parsed.resumeAt : i + 1;
        continue;
      }
      const close = matchBraceEnd(next, parsed.brace) - 1;
      const ret = next.indexOf("return", parsed.brace);
      if (ret < 0 || ret > close) {
        i = parsed.brace + 1;
        continue;
      }
      const before = next.slice(parsed.brace + 1, ret);
      if (!/^\s*(?:@Suppress\("UNUSED_VARIABLE"\)[^\n]*\n\s*)?$/.test(before)) {
        i = parsed.brace + 1;
        continue;
      }
      const realEnd = realExprEnd(next, ret + "return".length);
      if (realEnd >= close) {
        i = parsed.brace + 1;
        continue;
      }
      const between = next.slice(realEnd, close);
      if (!/\b(?:fun |private |public |internal |protected |override |@[A-Za-z])/.test(between)) {
        i = parsed.brace + 1;
        continue;
      }
      next = next.slice(0, realEnd) + "\n    }" + next.slice(realEnd, close) + next.slice(close + 1);
      moved = true;
      break;
    }
    if (!moved) break;
  }
  const sink = latestSinkLine(next);
  if (!sink) return next;
  const edits = [];
  let j = 0;
  while (j < next.length) {
    const skipped = skipTriviaOrString(next, j);
    if (skipped > j) {
      j = skipped;
      continue;
    }
    if (!isKeywordAt(next, j, "fun") && !isKeywordAt(next, j, "init")) {
      j++;
      continue;
    }
    if (isKeywordAt(next, j, "init")) {
      const brace = skipTriviaOrString(next, j + 4);
      if (next[brace] === "{") {
        const close = matchBraceEnd(next, brace);
        if (!next.slice(brace, close).includes(sink)) {
          edits.push({ start: brace + 1, end: brace + 1, text: `\n        ${sink}` });
        }
        j = brace + 1;
        continue;
      }
    }
    const parsed = parseKotlinFun(next, j);
    if (!parsed || parsed.kind !== "block" || isHelperName(parsed.name)) {
      j = parsed ? parsed.resumeAt : j + 1;
      continue;
    }
    const close = matchBraceEnd(next, parsed.brace);
    if (!next.slice(parsed.brace, close).includes(sink)) {
      const at = afterSuperCall(next, parsed.brace);
      edits.push({ start: at, end: at, text: `\n        ${sink}` });
    }
    j = parsed.brace + 1;
  }
  return renderEdits(next, edits);
}

function latestSinkLine(code) {
  let best = -1;
  let line = "";
  const re = /@Suppress\("UNUSED_VARIABLE"\) val \w+SinkV(\d+) = [^\n]+/g;
  let match;
  while ((match = re.exec(code))) {
    const n = Number(match[1]);
    if (n >= best) {
      best = n;
      line = match[0];
    }
  }
  return line;
}

async function applyAll() {
  const warnings = [];
  let tsUpdated = 0;
  const tsFiles = [];
  await walkFiles(path.join(ROOT, "services"), tsFiles);
  await walkFiles(path.join(ROOT, "Layouts", "Game"), tsFiles);
  for (const file of tsFiles) {
    if (!/\.(ts|tsx)$/.test(file) || file.endsWith(".d.ts")) continue;
    const source = await fs.readFile(file, "utf8");
    try {
      const next = transformTypeScript(source, file);
      if (next !== source) {
        await fs.writeFile(file, next, "utf8");
        tsUpdated++;
      }
    } catch (error) {
      warnings.push(`${path.relative(ROOT, file)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let nativeUpdated = 0;
  const javaRoot = path.join(ROOT, "android", "app", "src", "main", "java");
  const nativeFiles = [];
  await walkFiles(javaRoot, nativeFiles);
  for (const file of nativeFiles) {
    if (!/\.(kt|java)$/.test(file)) continue;
    const source = await fs.readFile(file, "utf8");
    const rel = path.relative(javaRoot, file);
    if (shouldSkipNative(rel, source)) continue;
    try {
      const next = file.endsWith(".kt") ? transformKotlin(source, file) : transformJava(source, file);
      if (next !== source) {
        await fs.writeFile(file, next, "utf8");
        nativeUpdated++;
      }
    } catch (error) {
      warnings.push(`${path.relative(ROOT, file)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let stubs = 0;
  try {
    stubs = await repairMissingHelpers();
  } catch (error) {
    warnings.push(`repair-missing: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { tsUpdated, nativeUpdated, stubs, warnings };
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

function runTests() {
  const kt = transformKotlin(
    [
      "object Foo {",
      "  override fun getName(): String = \"Jusowopovakoqa\"",
      "  fun withLambda() {",
      "    list.joinToString(\"&\") { (key, value) ->",
      "      key",
      "    }",
      "  }",
      "  private fun FooObfV3Mix(a: Int, b: Int): Int {",
      '    @Suppress("UNUSED_VARIABLE") val fragSinkV2 = other(1)',
      "    return a + b",
      "  }",
      "  fun asBool(value: Any?): Boolean = when (value) {",
      "    null -> false",
      "    else -> true",
      "  }",
      "}",
      "",
    ].join("\n"),
    "Foo.kt"
  );
  assert(kt.includes('return "Jusowopovakoqa"'), "expr body return");
  assert(kt.includes("(key, value) ->"), "lambda params preserved");
  const followed = transformKotlin(
    [
      "class Foo {",
      "  override fun getName(): String = \"Jusowopovakoqa\"",
      "  fun other(): Int {",
      "    return 1",
      "  }",
      "}",
      "",
    ].join("\n"),
    "Foo.kt"
  );
  const nameClose = followed.indexOf("return \"Jusowopovakoqa\"");
  const otherAt = followed.indexOf("fun other");
  const closeBeforeOther = followed.lastIndexOf("}", otherAt);
  assert(nameClose !== -1 && otherAt > nameClose && closeBeforeOther > nameClose && closeBeforeOther < otherAt, "expr fun closes before the next fun");
  assert(followed.includes("return 1"), "next fun kept");
  assert(!kt.includes("val fragSinkV2"), "helper sink stripped");
  assert(kt.includes("return a + b"), "helper body kept");
  const lambdaAt = kt.indexOf("(key, value) ->");
  const sinkNearLambda = kt.slice(Math.max(0, lambdaAt - 80), lambdaAt);
  assert(!sinkNearLambda.includes("SinkV"), "no sink before lambda arrow");
  assert(braceBalance(kt) === 0, "kt balance");

  const java = transformJava(
    [
      "public class Mikewacihajud {",
      "  public Mikewacihajud(Context c) {",
      "    super(c);",
      "    ready = true;",
      "  }",
      "  public void run() {",
      "    if (true) { return; }",
      "  }",
      "  private static int MikewacihajudObfV3Mix(int a, int b) {",
      "    int ichyikowrdfpagthmsSinkV3 = other(1);",
      "    return a;",
      "  }",
      "}",
      "",
    ].join("\n"),
    "Mikewacihajud.java"
  );
  const superAt = java.indexOf("super(c);");
  const sinkAt = java.indexOf("SinkV");
  assert(superAt !== -1 && sinkAt > superAt, "java sink after super");
  assert(!/SinkV3/.test(java), "java helper sink stripped");
  assert(java.includes("return a;"), "java helper kept");
  assert(braceBalance(java) === 0, "java balance");
  const ifAt = java.indexOf("if (true)");
  assert(!java.slice(ifAt - 40, ifAt).includes("SinkV"), "no sink in if");
  console.log("tests ok");
}

async function repairKotlinTree() {
  const javaRoot = path.join(ROOT, "android", "app", "src", "main", "java");
  const files = [];
  await walkFiles(javaRoot, files);
  let changed = 0;
  for (const file of files) {
    if (!file.endsWith(".kt")) continue;
    const source = await fs.readFile(file, "utf8");
    const rel = path.relative(javaRoot, file);
    if (shouldSkipNative(rel, source)) continue;
    const next = repairSwallowedKotlin(source);
    if (next !== source) {
      if (braceBalance(next) !== braceBalance(source)) {
        console.log("skip balance", rel);
        continue;
      }
      await fs.writeFile(file, next, "utf8");
      changed++;
    }
  }
  console.log("repaired", changed);
}

async function main() {
  if (process.argv[2] === "--test") {
    runTests();
    return;
  }
  if (process.argv[2] === "--repair-kt") {
    await repairKotlinTree();
    return;
  }
  runTests();
  const result = await applyAll();
  console.log(JSON.stringify({ tsUpdated: result.tsUpdated, nativeUpdated: result.nativeUpdated, stubs: result.stubs, warnings: result.warnings.slice(0, 30), warningCount: result.warnings.length }, null, 2));
}

module.exports = { transformKotlin, transformJava, transformTypeScript, runTests };

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
