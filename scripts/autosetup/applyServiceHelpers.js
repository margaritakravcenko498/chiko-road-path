/**
 * Mechanical pass of the services-obfuscation skill:
 * a new helper batch plus `void` calls in existing functions.
 * Identifier rename stays with game-stamp / reshuffle (those names already
 * contain the fragment). Helper bodies never call other helpers.
 */
const fs = require("node:fs/promises");
const path = require("node:path");

const HOST_NAME_RE = /Cipher|Intake|ModuleReg|Viewport|ewport|linkkit|SharedPref/i;
const SKIP_DIR = new Set(["node_modules", ".git", "build", ".gradle", "Pods"]);

function requireParser(rootPath) {
  return require(require.resolve("@babel/parser", { paths: [rootPath, __dirname] }));
}

function newlineOf(source) {
  return source.includes("\r\n") ? "\r\n" : "\n";
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

function isObfHelper(node) {
  return /ObfV\d+/i.test(functionName(node));
}

function walk(node, helperDepth, visit) {
  if (!node || typeof node !== "object") return;
  const depth = helperDepth + (isFunctionNode(node) && isObfHelper(node) ? 1 : 0);
  visit(node, depth);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "range" || key === "leadingComments" || key === "trailingComments" || key === "innerComments") {
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

function nextBatch(source) {
  let max = 0;
  const re = /ObfV(\d+)/gi;
  let match;
  while ((match = re.exec(source))) {
    max = Math.max(max, Number(match[1]) || 0);
  }
  return max + 1;
}

function seedFrom(fragment) {
  let sum = 0;
  for (const ch of String(fragment || "app")) sum = (sum + ch.charCodeAt(0)) % 200;
  return 11 + (sum % 80);
}

function slugFrom(filePath) {
  const base = path.basename(filePath, path.extname(filePath)).replace(/[^A-Za-z0-9]/g, "");
  return (base || "file").slice(0, 28);
}

function ident(fragment, slug, batch, suffix) {
  const frag = /^[A-Za-z_]/.test(fragment) ? fragment : `f${fragment || "app"}`;
  return `${frag}${slug}ObfV${batch}${suffix}`.replace(/[^A-Za-z0-9_]/g, "");
}

function transformTypeScript(source, { filePath, fragment }) {
  const parser = requireParser(path.dirname(filePath));
  const ast = parser.parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: false,
  });
  const nl = newlineOf(source);
  const batch = nextBatch(source);
  const slug = slugFrom(filePath);
  const frag = String(fragment || "app").replace(/[^A-Za-z0-9]/g, "") || "app";
  const mixName = ident(frag, slug, batch, "Mix");
  const foldName = ident(frag, slug, batch, "Fold");
  const seed = seedFrom(frag + slug);
  const foldArg = slug.slice(0, 6).toLowerCase() || "ab";
  const voids = `void ${mixName}(${(seed % 17) + 1}, ${(seed % 29) + 3});${nl}void ${foldName}(${JSON.stringify(foldArg)});`;

  const edits = [];
  walk(ast, 0, (node, depth) => {
    if (!isFunctionNode(node) || depth > 0 || !node.body || node.body.start == null) return;
    if (isObfHelper(node)) return;
    if (node.body.type === "BlockStatement") {
      edits.push({ index: node.body.start + 1, text: `${nl}${voids}` });
      return;
    }
    if (node.type === "ArrowFunctionExpression") {
      edits.push({
        index: node.body.start,
        end: node.body.end,
        text: `{${nl}${voids}${nl}return (${source.slice(node.body.start, node.body.end)});${nl}}`,
      });
    }
  });

  edits.sort((a, b) => b.index - a.index);
  let next = source;
  const seen = new Set();
  for (const edit of edits) {
    if (seen.has(edit.index)) continue;
    seen.add(edit.index);
    if (edit.end != null) {
      next = next.slice(0, edit.index) + edit.text + next.slice(edit.end);
    } else {
      next = next.slice(0, edit.index) + edit.text + next.slice(edit.index);
    }
  }

  if (!next.endsWith(nl)) next += nl;
  next += `${nl}/* obfuscation-batch:v${batch} */${nl}`;
  next += `function ${mixName}(a: number, b: number): number {${nl}`;
  next += `  const base = ${seed};${nl}`;
  next += `  const denom = (b % 97) + 3;${nl}`;
  next += `  return ((a + base) % denom) ^ (base & 15);${nl}`;
  next += `}${nl}`;
  next += `function ${foldName}(text: string): number {${nl}`;
  next += `  let acc = ${seed};${nl}`;
  next += `  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;${nl}`;
  next += `  return acc;${nl}`;
  next += `}${nl}`;

  parser.parse(next, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: false,
  });
  return { next, changed: next !== source, calls: edits.length, batch };
}

function headerBefore(code, braceIndex) {
  let end = braceIndex - 1;
  while (end >= 0 && /\s/.test(code[end])) end--;
  let start = end;
  let paren = 0;
  for (; start >= 0; start--) {
    const ch = code[start];
    if (ch === ")") paren++;
    else if (ch === "(") {
      if (paren === 0) break;
      paren--;
    } else if (paren === 0 && (ch === ";" || ch === "{" || ch === "}")) {
      start++;
      break;
    }
  }
  return code.slice(Math.max(0, start), braceIndex);
}

function scanCodeBraces(code) {
  const braces = [];
  let i = 0;
  let depth = 0;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (ch === "/" && next === "/") {
      const nl = code.indexOf("\n", i);
      i = nl < 0 ? code.length : nl + 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end < 0 ? code.length : end + 2;
      continue;
    }
    if (code.startsWith('"""', i)) {
      const end = code.indexOf('"""', i + 3);
      i = end < 0 ? code.length : end + 3;
      continue;
    }
    if (ch === '"' || ch === "'") {
      i++;
      while (i < code.length) {
        if (code[i] === "\\") {
          i += 2;
          continue;
        }
        if (code[i] === ch) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (ch === "{") {
      braces.push({ index: i, depth });
      depth++;
      i++;
      continue;
    }
    if (ch === "}") {
      depth = Math.max(0, depth - 1);
      i++;
      continue;
    }
    i++;
  }
  return braces;
}

function transformNative(source, { filePath, fragment }) {
  const nl = newlineOf(source);
  const isKotlin = filePath.endsWith(".kt");
  const batch = nextBatch(source);
  const slug = slugFrom(filePath);
  const frag = String(fragment || "app").replace(/[^A-Za-z0-9]/g, "") || "app";
  const mixName = ident(frag, slug, batch, "Mix");
  const foldName = ident(frag, slug, batch, "Fold");
  const sink = `${frag}SinkAutoV${batch}`;
  const seed = seedFrom(frag + slug);
  const foldArg = slug.slice(0, 6).toLowerCase() || "ab";
  const call = isKotlin
    ? `@Suppress("UNUSED_VARIABLE") val ${sink} = ${mixName}(${(seed % 17) + 1}, ${(seed % 29) + 3}) xor ${foldName}(${JSON.stringify(foldArg)})`
    : `int ${sink} = ${mixName}(${(seed % 17) + 1}, ${(seed % 29) + 3}) ^ ${foldName}(${JSON.stringify(foldArg)});`;

  const skipNames = new Set([
    "if", "for", "while", "switch", "catch", "when", "else", "try", "do",
    "synchronized", "class", "object", "interface", "enum", "init", "constructor",
  ]);
  const inserts = [];
  for (const brace of scanCodeBraces(source)) {
    if (brace.depth < 1) continue;
    const header = headerBefore(source, brace.index);
    if (!header.includes("(")) continue;
    if (/\b(class|object|interface|enum)\b/.test(header) && !/\bfun\b/.test(header)) continue;
    const named = header.match(/([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
    const name = named?.[1] || "";
    if (!name || skipNames.has(name) || /ObfV\d+/i.test(name) || /ObfV\d+/i.test(header)) continue;
    if (isKotlin && !/\bfun\b/.test(header)) continue;
    inserts.push(brace.index + 1);
  }

  inserts.sort((a, b) => b - a);
  let next = source;
  for (const index of inserts) {
    next = next.slice(0, index) + `${nl}        ${call}` + next.slice(index);
  }
  if (!inserts.length) return { next: source, changed: false, calls: 0, batch };

  if (isKotlin) {
    if (!next.endsWith(nl)) next += nl;
    next += `${nl}private fun ${mixName}(a: Int, b: Int): Int {${nl}`;
    next += `    val base = ${seed}${nl}`;
    next += `    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3${nl}`;
    next += `    return ((a + base) % denom) xor (base and 15)${nl}`;
    next += `}${nl}${nl}`;
    next += `private fun ${foldName}(text: String): Int {${nl}`;
    next += `    var acc = ${seed}${nl}`;
    next += `    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff${nl}`;
    next += `    return acc${nl}`;
    next += `}${nl}`;
  } else {
    const last = next.lastIndexOf("}");
    if (last < 0) return { next: source, changed: false, calls: 0, batch };
    const methods =
      `${nl}    private static int ${mixName}(int a, int b) {${nl}` +
      `        int base = ${seed};${nl}` +
      `        int denom = Math.abs(b % 97) + 3;${nl}` +
      `        return ((a + base) % denom) ^ (base & 15);${nl}` +
      `    }${nl}` +
      `    private static int ${foldName}(String text) {${nl}` +
      `        int acc = ${seed};${nl}` +
      `        for (int i = 0; i < text.length(); i++) acc = (acc * 33 + text.charAt(i)) & 0x7fffffff;${nl}` +
      `        return acc;${nl}` +
      `    }${nl}`;
    next = next.slice(0, last) + methods + next.slice(last);
  }
  return { next, changed: true, calls: inserts.length, batch };
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

async function applyServiceHelpers(rootPath, fragment) {
  const files = [];
  await walkFiles(path.join(rootPath, "services"), files);
  await walkFiles(path.join(rootPath, "Layouts", "Game"), files);
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const native = [];
  await walkFiles(javaRoot, native);

  let updated = 0;
  let skipped = 0;
  const warnings = [];

  for (const filePath of files) {
    if (!/\.(ts|tsx)$/.test(filePath) || filePath.endsWith(".d.ts")) continue;
    const source = await fs.readFile(filePath, "utf8");
    try {
      const result = transformTypeScript(source, { filePath, fragment });
      if (result.changed) {
        await fs.writeFile(filePath, result.next, "utf8");
        updated++;
      }
    } catch (error) {
      skipped++;
      warnings.push(
        `${path.relative(rootPath, filePath)}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  let nativeUpdated = 0;
  for (const filePath of native) {
    if (!/\.(kt|java)$/.test(filePath)) continue;
    const rel = path.relative(javaRoot, filePath);
    if (!HOST_NAME_RE.test(rel)) continue;
    const source = await fs.readFile(filePath, "utf8");
    try {
      const result = transformNative(source, { filePath, fragment });
      if (result.changed) {
        await fs.writeFile(filePath, result.next, "utf8");
        nativeUpdated++;
      }
    } catch (error) {
      warnings.push(
        `${path.relative(rootPath, filePath)}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    ok: updated + nativeUpdated > 0 || files.length === 0,
    details:
      `helpers: ts/tsx ${updated}, kotlin/java ${nativeUpdated}` +
      (skipped ? `, пропущено ${skipped}` : "") +
      (warnings.length ? `; ${warnings.slice(0, 4).join(" | ")}` : ""),
    warnings,
  };
}

module.exports = {
  applyServiceHelpers,
  transformTypeScript,
  transformNative,
};
