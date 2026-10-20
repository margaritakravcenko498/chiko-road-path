const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");
const { repairObfDrift } = require("./autosetup/repairObfDrift");
const { checkProjectPaths } = require("./autosetup/checkPaths");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "build") continue;
      walk(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function mask(src) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("/*", i)) {
      const j = src.indexOf("*/", i + 2);
      const end = j < 0 ? src.length : j + 2;
      out += src.slice(i, end).replace(/[^\n]/g, " ");
      i = end;
      continue;
    }
    if (src.startsWith("//", i)) {
      const j = src.indexOf("\n", i);
      const end = j < 0 ? src.length : j;
      out += " ".repeat(end - i);
      i = end;
      continue;
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      out += " ";
      i += 1;
      while (i < src.length) {
        if (src[i] === "\\") {
          out += "  ";
          i += 2;
          continue;
        }
        if (src[i] === q) {
          out += " ";
          i += 1;
          break;
        }
        out += src[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }
    out += src[i];
    i += 1;
  }
  return out;
}

function delta(masked) {
  let n = 0;
  for (const c of masked) {
    if (c === "{") n += 1;
    else if (c === "}") n -= 1;
  }
  return n;
}

function checkBraces(files) {
  const bad = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    const d = delta(mask(src));
    if (d !== 0) bad.push(`${path.relative(ROOT, file)} delta=${d}`);
  }
  return bad;
}

function checkControlSinks(files) {
  const bad = [];
  const re = /\b(if|for|while|switch|catch|else)\b[^{]{0,180}\{\s*\r?\n\s*@Suppress(?:Warnings)?\((?:\"UNUSED_VARIABLE\"|\"unused\")\)[^\n]*SinkV25/;
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    if (re.test(src)) bad.push(path.relative(ROOT, file));
  }
  return bad;
}

function checkHelperVoid(files) {
  const bad = [];
  const func = new Set([
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
    "ClassMethod",
    "ClassPrivateMethod",
    "ObjectMethod",
  ]);
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
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    let ast;
    try {
      const plugins = ["typescript", "classProperties", "classPrivateProperties", "classPrivateMethods", "optionalChaining", "nullishCoalescingOperator", "objectRestSpread"];
      if (file.endsWith(".tsx")) plugins.push("jsx");
      ast = parser.parse(src, { sourceType: "module", plugins });
    } catch (error) {
      bad.push(`PARSE ${path.relative(ROOT, file)}: ${error.message}`);
      continue;
    }
    walkAst(ast, [], (node, ancestors) => {
      if (node.type !== "ExpressionStatement" || node.expression?.operator !== "void") return;
      const fn = [...ancestors].reverse().find((item) => func.has(item.type));
      if (!fn) return;
      const name = fn.id?.name || fn.key?.name || "";
      if (/ObfV\d|GameMixSeed|GameFoldRange|GameClampSpan/.test(name) && ancestors[ancestors.length - 1] === fn.body) {
        bad.push(`${path.relative(ROOT, file)} void in ${name}`);
      }
    });
  }
  return bad;
}

async function main() {
  const native = walk(path.join(ROOT, "android", "app", "src", "main", "java"), new Set([".kt", ".java"]));
  const ts = [
    ...walk(path.join(ROOT, "services"), new Set([".ts", ".tsx"])),
    ...walk(path.join(ROOT, "Layouts", "Game"), new Set([".ts", ".tsx"])),
  ];
  const braces = checkBraces(native);
  const controls = checkControlSinks(native);
  const helperVoid = checkHelperVoid(ts);
  const drift = await repairObfDrift(ROOT, { fragment: FRAG });
  const paths = await checkProjectPaths(ROOT);
  console.log(JSON.stringify({
    braceProblems: braces.slice(0, 30),
    braceCount: braces.length,
    controlSinks: controls.slice(0, 20),
    helperVoid: helperVoid.slice(0, 20),
    helperVoidCount: helperVoid.length,
    drift,
    pathOk: paths.ok,
    pathProblems: paths.problems?.slice(0, 20),
    pathCount: paths.problems?.length || 0,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
