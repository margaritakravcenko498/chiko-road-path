const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");
const { repairObfDrift } = require("./autosetup/repairObfDrift");
const { checkProjectPaths } = require("./autosetup/checkPaths");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "build") continue;
      walk(full, exts, out);
    } else if (exts.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function mask(src) {
  const out = src.split("");
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      while (i < src.length && src[i] !== "\n") {
        out[i] = " ";
        i++;
      }
      continue;
    }
    if (c === "/" && d === "*") {
      out[i] = out[i + 1] = " ";
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] !== "\n") out[i] = " ";
        i++;
      }
      if (i < src.length) out[i++] = " ";
      if (i < src.length && src[i] === "/") out[i++] = " ";
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      out[i++] = " ";
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") {
          out[i++] = " ";
          if (i < src.length) out[i++] = " ";
          continue;
        }
        if (src[i] !== "\n") out[i] = " ";
        i++;
      }
      if (i < src.length) out[i++] = " ";
      continue;
    }
    i++;
  }
  return out.join("");
}

function braceBalance(src) {
  const m = mask(src);
  let d = 0;
  let min = 0;
  for (const c of m) {
    if (c === "{") d++;
    else if (c === "}") {
      d--;
      if (d < min) min = d;
    }
  }
  return { end: d, min };
}

function resolveImport(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, base + ".ts", base + ".tsx", base + ".js", path.join(base, "index.ts"), path.join(base, "index.tsx")];
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    if (fs.statSync(c).isDirectory()) continue;
    return c;
  }
  return null;
}

function exported(file) {
  const src = fs.readFileSync(file, "utf8");
  const names = new Set();
  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch {
    return names;
  }
  for (const node of ast.program.body) {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        const d = node.declaration;
        if (d.id) names.add(d.id.name);
        if (d.type === "VariableDeclaration") {
          for (const dec of d.declarations) if (dec.id.type === "Identifier") names.add(dec.id.name);
        }
      }
      for (const s of node.specifiers || []) names.add(s.exported.name);
    }
    if (node.type === "ExportDefaultDeclaration") names.add("default");
    if (node.type === "ExportAllDeclaration") names.add("*");
  }
  return names;
}

async function main() {
  const drift = await repairObfDrift(ROOT, { fragment: FRAG });
  const paths = await checkProjectPaths(ROOT);
  const host = walk(path.join(ROOT, "android", "app", "src", "main", "java"), new Set([".kt", ".java"]));
  const badBrace = [];
  for (const file of host) {
    if (file.endsWith("Str.java")) continue;
    const b = braceBalance(fs.readFileSync(file, "utf8"));
    if (b.end !== 0 || b.min < 0) badBrace.push(`${path.relative(ROOT, file)} end=${b.end} min=${b.min}`);
  }
  const ts = [
    ...walk(path.join(ROOT, "services"), new Set([".ts", ".tsx"])),
    ...walk(path.join(ROOT, "Layouts"), new Set([".ts", ".tsx"])),
    path.join(ROOT, "App.tsx"),
  ];
  const missingExports = [];
  for (const file of ts) {
    if (!fs.existsSync(file)) continue;
    let ast;
    try {
      ast = parser.parse(fs.readFileSync(file, "utf8"), { sourceType: "module", plugins: ["typescript", "jsx"] });
    } catch (err) {
      missingExports.push(`PARSE ${path.relative(ROOT, file)} ${err.message}`);
      continue;
    }
    for (const node of ast.program.body) {
      if (node.type !== "ImportDeclaration") continue;
      if (!node.source.value.startsWith(".")) continue;
      const target = resolveImport(file, node.source.value);
      if (!target) {
        missingExports.push(`MISSING FILE ${path.relative(ROOT, file)} -> ${node.source.value}`);
        continue;
      }
      const names = exported(target);
      if (names.has("*")) continue;
      for (const s of node.specifiers) {
        if (s.type === "ImportDefaultSpecifier") {
          if (!names.has("default") && !/export default/.test(fs.readFileSync(target, "utf8"))) {
            missingExports.push(`NO DEFAULT ${path.relative(ROOT, file)} from ${node.source.value}`);
          }
          continue;
        }
        if (s.type !== "ImportSpecifier") continue;
        const imported = s.imported.name;
        if (!names.has(imported)) missingExports.push(`NO EXPORT ${imported} in ${path.relative(ROOT, target)} imported by ${path.relative(ROOT, file)}`);
      }
    }
  }
  console.log(JSON.stringify({
    drift,
    paths,
    badBrace,
    missingExports: missingExports.slice(0, 40),
    missingCount: missingExports.length,
  }, null, 2));
}

main();
