const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const BATCH = "/* obfuscation-batch:v23 */";

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

function stripHelperVoids(after) {
  return after.replace(
    /(\bfunction\s+[A-Za-z_][\w]*\s*\([^)]*\)\s*(?::\s*[^;{]+)?\{)\s*((?:void\s+[A-Za-z_][\w]*\([^;]*\);\s*)+)/g,
    (_, sig) => sig + "\n"
  );
}

function helperNames(batch) {
  return [...batch.matchAll(/^\s*(?:export\s+)?function\s+([A-Za-z_][\w]*)/gm)].map(
    (x) => x[1]
  );
}

function voidCallFor(content, name) {
  const escaped = name.replace(/[^A-Za-z0-9_]/g, "\\$&");
  const re = new RegExp("void\\s+" + escaped + "\\([^;]*\\);");
  const m = content.match(re);
  return m ? m[0] : null;
}

function skipWs(s, i) {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

function skipParens(s, i) {
  let d = 0;
  for (; i < s.length; i++) {
    if (s[i] === "(") d++;
    else if (s[i] === ")") {
      d--;
      if (d === 0) return i + 1;
    }
  }
  return -1;
}

let stripped = 0;
let filled = 0;
let files = 0;

for (const dir of ["services", "Layouts/Game"]) {
  const filesList = walk(path.join(ROOT, dir), new Set([".ts", ".tsx"]));
  for (const file of filesList) {
    const c = fs.readFileSync(file, "utf8");
    const idx = c.indexOf(BATCH);
    if (idx < 0) continue;
    files++;
    const before0 = c.slice(0, idx);
    let after = stripHelperVoids(c.slice(idx));
    if (after !== c.slice(idx)) stripped++;
    const names = helperNames(after);
    const whole = before0 + after;
    const calls = names.map((n) => voidCallFor(whole, n)).filter(Boolean);
    const voidBlock = calls.join("");
    let head = before0;
    if (voidBlock) {
      const reFn = /(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_][\w]*)/g;
      const inserts = [];
      let m;
      while ((m = reFn.exec(head))) {
        const name = m[1];
        if (
          names.includes(name) ||
          /GameMixSeed|GameFoldRange|GameClampSpan|ObfV/.test(name)
        ) {
          continue;
        }
        let i = m.index + m[0].length;
        i = skipWs(head, i);
        if (head[i] !== "(") continue;
        i = skipParens(head, i);
        if (i < 0) continue;
        i = skipWs(head, i);
        if (head[i] === ":") {
          i++;
          while (i < head.length && head[i] !== "{") i++;
        }
        if (head[i] !== "{") continue;
        const around = head.slice(i, i + 280);
        const missing = calls.filter((cl) => !around.includes(cl));
        if (missing.length === 0) continue;
        inserts.push({ at: i + 1, text: missing.join("") });
      }
      for (let k = inserts.length - 1; k >= 0; k--) {
        head = head.slice(0, inserts[k].at) + inserts[k].text + head.slice(inserts[k].at);
        filled++;
      }
    }
    const next = head + after;
    if (next !== c) fs.writeFileSync(file, next, "utf8");
  }
}

console.log(JSON.stringify({ files, stripped, filled }, null, 2));
