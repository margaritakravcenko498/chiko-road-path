const fs = require("fs");
const path = require("path");
const { repairObfDrift } = require("./autosetup/repairObfDrift");
const { checkProjectPaths } = require("./autosetup/checkPaths");

const ROOT = path.resolve(__dirname, "..");
const javaDir = path.join(ROOT, "android", "app", "src", "main", "java");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "build") walk(f, out);
    } else if (/\.(kt|java)$/.test(e.name)) out.push(f);
  }
  return out;
}

const files = walk(javaDir);
const missingMarker = [];
const missingFns = [];
const lambdaRisk = [];
const brace = [];

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  const decoy =
    src.slice(0, 300).includes("autosetup-decoy:v1") ||
    src.slice(0, 300).includes("dex-lanes:v1") ||
    rel.includes("rnobfuscator");
  if (decoy) continue;
  if (!src.includes("obfuscation-batch:v26")) missingMarker.push(rel);
  const defs = new Set();
  for (const m of src.matchAll(/\b(?:fun|int)\s+([A-Za-z_]\w*ObfV26\w*)\s*\(/g)) defs.add(m[1]);
  for (const m of src.matchAll(/\b([A-Za-z_]\w*ObfV26\w*)\s*\(/g)) {
    if (!defs.has(m[1])) missingFns.push(`${rel} -> ${m[1]}`);
  }
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("SinkV26")) continue;
    if (/^\s*(\([^)]*\)|[A-Za-z_]\w*)\s*->/.test(lines[i + 1] || "")) {
      lambdaRisk.push(`${rel}:${i + 2}`);
    }
  }
  let depth = 0;
  let bad = false;
  let i = 0;
  while (i < src.length) {
    if (src[i] === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (src[i] === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (src[i] === '"') {
      i++;
      while (i < src.length && src[i] !== '"') {
        if (src[i] === "\\") i += 2;
        else i++;
      }
      i++;
      continue;
    }
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth < 0) bad = true;
    }
    i++;
  }
  if (bad || depth !== 0) brace.push(`${rel} depth ${depth}`);
}

console.log("host checked", files.length);
console.log("missingMarker", missingMarker);
console.log("missingFns", [...new Set(missingFns)]);
console.log("lambdaRisk", lambdaRisk);
console.log("brace", brace);

(async () => {
  const repair = await repairObfDrift(ROOT, { fragment: "ichyikowrdfpagthms" });
  const paths = await checkProjectPaths(ROOT);
  console.log("repair", repair.details);
  console.log("paths ok", paths.ok, "files", paths.checkedFiles, "problems", paths.problems);
})();
