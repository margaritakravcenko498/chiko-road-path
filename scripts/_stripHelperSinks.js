const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const FUNC = new Set([
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
  "ClassMethod",
  "ClassPrivateMethod",
  "ObjectMethod",
]);

function stripFrag(name) {
  return String(name || "").split(FRAG).join("");
}

function isHelper(name) {
  const stripped = stripFrag(name);
  if (/ObfV\d/.test(stripped)) return true;
  if (/(MixSeed|FoldRange|ClampSpan)$/.test(stripped) && (String(name).includes(FRAG) || /^Game/.test(stripped))) return true;
  return false;
}

function walkFiles(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "build") continue;
      walkFiles(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function walkAst(node, ancestors, visit) {
  if (!node || typeof node.type !== "string") return;
  visit(node, ancestors);
  const next = ancestors.concat(node);
  for (const key of Object.keys(node)) {
    if (["loc", "start", "end", "range", "leadingComments", "trailingComments", "innerComments", "extra"].includes(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) child.forEach((item) => walkAst(item, next, visit));
    else if (child && typeof child.type === "string") walkAst(child, next, visit);
  }
}

function nodeName(node) {
  if (node.id && node.id.type === "Identifier") return node.id.name;
  if (node.key && node.key.type === "Identifier") return node.key.name;
  return "";
}

function applyEdits(src, edits) {
  const sorted = edits.slice().sort((a, b) => b.start - a.start);
  let out = src;
  for (const edit of sorted) out = out.slice(0, edit.start) + out.slice(edit.end);
  return out;
}

function cleanTs(file) {
  const src = fs.readFileSync(file, "utf8");
  const plugins = ["typescript", "classProperties", "classPrivateProperties", "classPrivateMethods", "optionalChaining", "nullishCoalescingOperator", "objectRestSpread"];
  if (file.endsWith(".tsx")) plugins.push("jsx");
  const ast = parser.parse(src, { sourceType: "module", plugins });
  const edits = [];
  walkAst(ast, [], (node, ancestors) => {
    if (!FUNC.has(node.type) || !node.body || node.body.type !== "BlockStatement") return;
    if (!isHelper(nodeName(node))) return;
    for (const stmt of node.body.body) {
      if (stmt.type === "ExpressionStatement" && stmt.expression && stmt.expression.type === "UnaryExpression" && stmt.expression.operator === "void") {
        let end = stmt.end;
        if (src[end] === "\r") end += 1;
        if (src[end] === "\n") end += 1;
        edits.push({ start: stmt.start, end });
      }
    }
  });
  if (!edits.length) return 0;
  const next = applyEdits(src, edits);
  parser.parse(next, { sourceType: "module", plugins });
  fs.writeFileSync(file, next);
  return edits.length;
}

function mask(src) {
  const out = new Array(src.length);
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    const three = src.slice(i, i + 3);
    if (three === '"""') {
      let j = src.indexOf('"""', i + 3);
      if (j < 0) j = src.length - 3;
      for (let k = i; k < j + 3 && k < src.length; k++) out[k] = src[k] === "\n" ? "\n" : " ";
      i = Math.min(src.length, j + 3);
      continue;
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      out[i] = " ";
      i += 1;
      while (i < src.length) {
        if (src[i] === "\\") {
          out[i] = " ";
          if (i + 1 < src.length) out[i + 1] = src[i + 1] === "\n" ? "\n" : " ";
          i += 2;
          continue;
        }
        if (src[i] === q) {
          out[i] = " ";
          i += 1;
          break;
        }
        out[i] = src[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }
    if (two === "//") {
      while (i < src.length && src[i] !== "\n") {
        out[i] = " ";
        i += 1;
      }
      continue;
    }
    if (two === "/*") {
      const j = src.indexOf("*/", i + 2);
      const end = j < 0 ? src.length : j + 2;
      for (let k = i; k < end; k++) out[k] = src[k] === "\n" ? "\n" : " ";
      i = end;
      continue;
    }
    out[i] = src[i];
    i += 1;
  }
  return out.join("");
}

function prevToken(masked, index) {
  let j = index - 1;
  while (j >= 0 && /\s/.test(masked[j])) j -= 1;
  if (j < 0) return null;
  if (!/[A-Za-z0-9_]/.test(masked[j])) return { text: masked[j], start: j };
  const end = j;
  while (j >= 0 && /[A-Za-z0-9_]/.test(masked[j])) j -= 1;
  return { text: masked.slice(j + 1, end + 1), start: j + 1 };
}

function matchParen(masked, openIdx) {
  let d = 0;
  for (let i = openIdx; i < masked.length; i++) {
    if (masked[i] === "(") d += 1;
    else if (masked[i] === ")") {
      d -= 1;
      if (d === 0) return i;
    }
  }
  return -1;
}

function matchBrace(masked, openIdx) {
  let d = 0;
  for (let i = openIdx; i < masked.length; i++) {
    if (masked[i] === "{") d += 1;
    else if (masked[i] === "}") {
      d -= 1;
      if (d === 0) return i;
    }
  }
  return -1;
}

function afterSignature(masked, closeParen) {
  let i = closeParen + 1;
  let angle = 0;
  let paren = 0;
  while (i < masked.length) {
    const c = masked[i];
    if (c === "<") angle += 1;
    else if (c === ">") angle = Math.max(0, angle - 1);
    else if (c === "(") paren += 1;
    else if (c === ")") paren = Math.max(0, paren - 1);
    else if (angle === 0 && paren === 0 && (c === "{" || c === "=")) return i;
    else if (angle === 0 && paren === 0 && c === "\n") {
      let k = i + 1;
      while (k < masked.length && /[ \t]/.test(masked[k])) k += 1;
      if (masked[k] === "{" || masked[k] === "=") {
        i = k;
        continue;
      }
      return -1;
    }
    i += 1;
  }
  return -1;
}

function helperBodies(src, kind) {
  const masked = mask(src);
  const ranges = [];
  if (kind === "kt") {
    const funRe = /\bfun\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:<[^>\n]+>\s*)?\(/g;
    let match;
    while ((match = funRe.exec(masked))) {
      if (!isHelper(match[1])) continue;
      const open = match.index + match[0].length - 1;
      const close = matchParen(masked, open);
      if (close < 0) continue;
      const sig = afterSignature(masked, close);
      if (sig < 0 || masked[sig] !== "{") continue;
      const end = matchBrace(masked, sig);
      if (end > sig) ranges.push([sig, end]);
    }
  } else {
    for (let i = 0; i < masked.length; i++) {
      if (masked[i] !== "{") continue;
      const name = classifyJava(masked, i);
      if (!name || !isHelper(name)) continue;
      const end = matchBrace(masked, i);
      if (end > i) ranges.push([i, end]);
    }
  }
  return ranges;
}

function matchParenBack(masked, closeIdx) {
  let d = 0;
  for (let i = closeIdx; i >= 0; i--) {
    if (masked[i] === ")") d += 1;
    else if (masked[i] === "(") {
      d -= 1;
      if (d === 0) return i;
    }
  }
  return -1;
}

function classifyJava(masked, braceIdx) {
  let j = braceIdx;
  for (let guard = 0; guard < 16; guard++) {
    const tok = prevToken(masked, j);
    if (!tok) return null;
    if (tok.text === ")") {
      const open = matchParenBack(masked, tok.start);
      if (open < 0) return null;
      const nameTok = prevToken(masked, open);
      if (!nameTok || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(nameTok.text)) return null;
      return nameTok.text;
    }
    if (tok.text === "throws" || tok.text === "," || tok.text === "." || /^[A-Za-z_][A-Za-z0-9_]*$/.test(tok.text)) {
      j = tok.start;
      continue;
    }
    return null;
  }
  return null;
}

function cleanNative(file) {
  const src = fs.readFileSync(file, "utf8");
  const kind = file.endsWith(".java") ? "java" : "kt";
  const ranges = helperBodies(src, kind);
  if (!ranges.length) return 0;
  const lines = src.split(/\r?\n/);
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  let offset = 0;
  const lineSpans = lines.map((line) => {
    const start = offset;
    offset += line.length + nl.length;
    return [start, start + line.length];
  });
  const drop = new Set();
  lines.forEach((line, index) => {
    if (!line.includes("SinkV25")) return;
    const start = lineSpans[index][0];
    if (ranges.some(([a, b]) => start > a && start < b)) drop.add(index);
  });
  if (!drop.size) return 0;
  const next = lines.filter((_, index) => !drop.has(index)).join(nl);
  if (!src.endsWith(nl) && next.endsWith(nl)) {
    fs.writeFileSync(file, next.slice(0, -nl.length));
  } else {
    fs.writeFileSync(file, next);
  }
  return drop.size;
}

function main() {
  let tsEdits = 0;
  let nativeEdits = 0;
  for (const file of [...walkFiles(path.join(ROOT, "services"), new Set([".ts", ".tsx"])), ...walkFiles(path.join(ROOT, "Layouts", "Game"), new Set([".ts", ".tsx"]))]) {
    tsEdits += cleanTs(file);
  }
  for (const file of walkFiles(path.join(ROOT, "android", "app", "src", "main", "java"), new Set([".kt", ".java"]))) {
    const head = fs.readFileSync(file, "utf8").slice(0, 200);
    if (head.includes("autosetup-decoy:v1") || head.includes("dex-lanes:v1") || file.endsWith(`${path.sep}Str.java`)) continue;
    nativeEdits += cleanNative(file);
  }
  console.log(`removed ts voids=${tsEdits} native sinks=${nativeEdits}`);
}

main();
