const fs = require("node:fs");
const path = require("node:path");
const parser = require("@babel/parser");
const { repairObfDrift } = require("./repairObfDrift");
const { checkProjectPaths } = require("./checkPaths");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "build") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function braceBalance(code) {
  let depth = 0;
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
    if (c === "/" && n === "/") {
      const nl = code.indexOf("\n", i);
      i = nl < 0 ? code.length : nl + 1;
      continue;
    }
    if (c === "/" && n === "*") {
      const end = code.indexOf("*/", i + 2);
      i = end < 0 ? code.length : end + 2;
      continue;
    }
    if (code.startsWith('"""', i)) {
      const end = code.indexOf('"""', i + 3);
      i = end < 0 ? code.length : end + 3;
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < code.length) {
        if (code[i] === "\\") {
          i += 2;
          continue;
        }
        if (code[i] === c) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    i++;
  }
  return depth;
}

const root = path.resolve(__dirname, "..", "..");
const javaRoot = path.join(root, "android", "app", "src", "main", "java");
let unbalanced = 0;
for (const file of walk(javaRoot)) {
  if (!/\.(kt|java)$/.test(file)) continue;
  if (file.includes(`${path.sep}rnobfuscator${path.sep}`)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (text.includes("autosetup-decoy") || text.includes("dex-lanes")) continue;
  const depth = braceBalance(text);
  if (depth !== 0) {
    unbalanced++;
    console.log("UNBALANCED", depth, path.relative(root, file));
  }
}

const tsFiles = [...walk(path.join(root, "services")), ...walk(path.join(root, "Layouts", "Game"))];
let badParse = 0;
for (const file of tsFiles) {
  if (!/\.(ts|tsx)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  try {
    parser.parse(text, { sourceType: "module", plugins: ["typescript", "jsx"] });
  } catch (error) {
    badParse++;
    console.log("PARSE", path.relative(root, file), String(error.message).split("\n")[0]);
  }
  if (text.includes("Promise<{void") || text.includes("): {void")) {
    console.log("TYPE VOID", path.relative(root, file));
  }
}

(async () => {
  const drift = await repairObfDrift(root, { fragment: "ichyikowrdfpagthms" });
  const paths = await checkProjectPaths(root);
  console.log(JSON.stringify({
    unbalanced,
    badParse,
    drift,
    pathOk: paths.ok,
    problemCount: paths.problems.length,
    pathProblems: paths.problems.slice(0, 15),
  }));
})();
