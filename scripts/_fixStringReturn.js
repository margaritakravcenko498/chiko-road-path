const fs = require("node:fs");
const path = require("node:path");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".kt")) out.push(full);
  }
  return out;
}

const re = /return ("(?:\\.|[^"\\\n])*")\r?\n(?:[ \t]*\r?\n)*([ \t]*\S[^\n]*)\r?\n([ \t]*)\}/g;
const decl = /^\s*(@|private\b|public\b|internal\b|protected\b|override\b|fun\b|class\b|object\b|companion\b)/;
let total = 0;
for (const file of walk(path.join("android", "app", "src", "main", "java"))) {
  const src = fs.readFileSync(file, "utf8");
  let count = 0;
  const next = src.replace(re, (full, ret, swallowed, indent) => {
    if (!decl.test(swallowed)) return full;
    count += 1;
    console.log(`${file} :: ${swallowed.trim()}`);
    return `return ${ret}\n${indent}}\n\n${swallowed}`;
  });
  if (count) {
    fs.writeFileSync(file, next);
    total += count;
  }
}
console.log(`fixed ${total}`);
