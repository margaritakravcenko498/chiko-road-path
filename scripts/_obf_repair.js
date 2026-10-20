"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FRAG = "ichyikowrdfpagthms";
const SKIP_DIRS = new Set(["node_modules", "build", "Pods", ".git", "dist"]);

function walk(dir, acc = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function stripFrag(s) {
  return s.split(FRAG).join("");
}

function isHelperName(name) {
  return /ObfV\d+/i.test(name) || /(?:MixSeed|FoldRange|ClampSpan|HashMix|SumOdds|ClampMod|ShiftXor|ByteFold)/.test(name);
}

function extractStyleSheetKeys(text) {
  const idx = text.indexOf("StyleSheet.create(");
  if (idx < 0) return [];
  const brace = text.indexOf("{", idx);
  if (brace < 0) return [];
  let depth = 0;
  let i = brace;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const inner = text.slice(brace + 1, i);
  const keys = [];
  const re = /(^|[,\n{])\s*([A-Za-z_$][\w$]*)\s*:/g;
  let m;
  let d = 0;
  // only top-level keys: track braces inside inner
  d = 0;
  let buf = inner;
  for (let p = 0; p < buf.length; p++) {
    if (buf[p] === "{") d++;
    else if (buf[p] === "}") d--;
    else if (d === 0 && /[A-Za-z_$]/.test(buf[p])) {
      let q = p + 1;
      while (q < buf.length && /[\w$]/.test(buf[q])) q++;
      const name = buf.slice(p, q);
      let r = q;
      while (r < buf.length && /\s/.test(buf[r])) r++;
      if (buf[r] === ":") keys.push(name);
      p = q - 1;
    }
  }
  return keys;
}

function fixStyleAccess(text) {
  const keys = extractStyleSheetKeys(text);
  if (!keys.length) return text;
  const map = new Map();
  for (const k of keys) {
    const orig = stripFrag(k);
    if (orig && orig !== k) map.set(orig, k);
  }
  if (!map.size) return text;
  // styles var is typically stichyikowrdfpagthmsyles or styles
  return text.replace(
    /\b([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\b/g,
    (full, obj, prop) => {
      if (!map.has(prop)) return full;
      if (stripFrag(obj) !== "styles") return full;
      return obj + "." + map.get(prop);
    }
  );
}

function findMatchingBrace(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      i++;
      while (i < text.length && text[i] !== q) {
        if (text[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function stripVoidFromHelpers(text, lang) {
  const fnRe = lang === "kt"
    ? /((?:private\s+|internal\s+|protected\s+|public\s+)*)fun\s+([A-Za-z_][\w]*)\s*\(/g
    : lang === "java"
    ? /((?:public|private|protected|static|final|\s)+)([A-Za-z_][\w]*)\s*\(/g
    : /function\s+([A-Za-z_$][\w$]*)\s*\(/g;

  let out = text;
  const matches = [];
  let m;
  const re = lang === "ts"
    ? /function\s+([A-Za-z_$][\w$]*)\s*\(/g
    : /fun\s+([A-Za-z_][\w]*)\s*\(/g;
  if (lang === "java") {
    // handled separately
  }
  while ((m = re.exec(text))) {
    const name = m[1];
    if (!isHelperName(name)) continue;
    let k = m.index + m[0].length;
    // skip params
    let depth = 1;
    while (k < text.length && depth) {
      if (text[k] === "(") depth++;
      else if (text[k] === ")") depth--;
      k++;
    }
    while (k < text.length && /\s/.test(text[k])) k++;
    if (text[k] === ":") {
      while (k < text.length && text[k] !== "{" && text[k] !== "=") k++;
    }
    while (k < text.length && /\s/.test(text[k])) k++;
    if (text[k] !== "{") continue;
    const close = findMatchingBrace(text, k);
    if (close < 0) continue;
    matches.push({ open: k, close, name });
  }
  matches.sort((a, b) => b.open - a.open);
  for (const h of matches) {
    const body = text.slice(h.open + 1, h.close);
    const cleaned = body
      .split("\n")
      .filter((line) => {
        if (/void\s+\w+/.test(line) && /ObfV\d+/.test(line)) return false;
        if (/SinkV\d+/.test(line) && /ObfV\d+/.test(line)) return false;
        if (/SinkV\d+Boot/.test(line)) return false;
        return true;
      })
      .join("\n");
    out = out.slice(0, h.open + 1) + cleaned + out.slice(h.close);
    // keep `text` positions? We're applying from the end so use `out` consistently
    text = out;
  }
  return out;
}

function extractV21Sink(text) {
  const m = text.match(/@Suppress\("UNUSED_VARIABLE"\) val ichyikowrdfpagthmsSinkV21 = [^\n]+/);
  return m ? m[0] : null;
}

function injectKtReturnFns(text) {
  const sink = extractV21Sink(text);
  if (!sink) return text;
  const re = /fun\s+([A-Za-z_][\w]*)\s*\([^)]*\)\s*:\s*[A-Za-z_][\w.<>,?\s\[\]]*\{/g;
  const inserts = [];
  let m;
  while ((m = re.exec(text))) {
    const name = m[1];
    if (isHelperName(name)) continue;
    const pos = m.index + m[0].length;
    const snippet = text.slice(pos, pos + 450);
    if (snippet.includes("SinkV21") || snippet.includes("ObfV21")) continue;
    const indent = (() => {
      let s = m.index;
      while (s > 0 && text[s - 1] !== "\n") s--;
      const sp = text.slice(s, m.index).match(/^\s*/);
      return (sp ? sp[0] : "    ") + "    ";
    })();
    inserts.push({ pos, text: "\n" + indent + sink + "\n" + indent });
  }
  inserts.sort((a, b) => b.pos - a.pos);
  let out = text;
  for (const ins of inserts) out = out.slice(0, ins.pos) + ins.text + out.slice(ins.pos);
  return out;
}

function fixWiwatiged(text, filePath) {
  if (!filePath.endsWith("WiwatigedPart01.kt")) return text;
  return text
    .replace(/(?<!WiwatigedPart02\.)\bichyikowrdfpagthmsWiwatigedObfV20HashMix\(/g, "WiwatigedPart02.ichyikowrdfpagthmsWiwatigedObfV20HashMix(")
    .replace(/(?<!WiwatigedPart03\.)\bWiwatigedObfV20ichyikowrdfpagthmsSumOdds\(/g, "WiwatigedPart03.ichyikowrdfpagthmsWiwatigedObfV20SumOdds(");
}

function scanUiCopy(file, text) {
  const hits = [];
  const re = /(['"`])([^'"`]*ichyikowrdfpagthms[^'"`]*)\1/g;
  let m;
  while ((m = re.exec(text))) {
    const s = m[2];
    if (s.includes("/") || s.includes("./") || s.includes("../")) continue; // paths
    if (/ObfV\d+/.test(s)) continue;
    if (/^[a-z0-9]{2,4}$/.test(s)) continue; // helper call args
    hits.push({ file, s });
  }
  // JSX text nodes
  const jsx = />\s*([^<{]*ichyikowrdfpagthms[^<{]*)\s*</g;
  while ((m = jsx.exec(text))) {
    if (m[1].trim()) hits.push({ file, s: m[1].trim() });
  }
  return hits;
}

function repairImports(filePath, content) {
  const re = /((?:from|require\s*\()\s*)(['"])(\.\.?\/[^'"]+)\2/g;
  let out = content;
  const refs = [];
  let m;
  while ((m = re.exec(content))) refs.push(m);
  for (const r of refs.reverse()) {
    const spec = r[3];
    const base = path.resolve(path.dirname(filePath), spec);
    const candidates = [base, base + ".ts", base + ".tsx", base + ".js", path.join(base, "index.ts"), path.join(base, "index.tsx")];
    if (candidates.some((c) => fs.existsSync(c))) continue;
    const dir = path.resolve(path.dirname(filePath), path.dirname(spec));
    if (!fs.existsSync(dir)) continue;
    const want = stripFrag(path.basename(spec));
    const match = fs.readdirSync(dir).find((f) => stripFrag(f.replace(/\.(tsx?|jsx?)$/i, "")) === want);
    if (!match) continue;
    const noExt = match.replace(/\.(tsx?|jsx?)$/i, "");
    const prefix = spec.slice(0, spec.lastIndexOf("/") + 1);
    out = out.replace(spec, prefix + noExt);
  }
  return out;
}

function main() {
  const gameFiles = walk(path.join(ROOT, "Layouts", "Game")).filter((f) => /\.tsx?$/.test(f));
  const serviceFiles = walk(path.join(ROOT, "services")).filter((f) => /\.tsx?$/.test(f));
  const androidFiles = walk(path.join(ROOT, "android", "app", "src", "main", "java")).filter((f) => /\.(kt|java)$/.test(f));
  const uiHits = [];
  let styleFixed = 0, kotlinInject = 0, helperStrip = 0;

  for (const f of gameFiles) {
    let t = fs.readFileSync(f, "utf8");
    const orig = t;
    t = fixStyleAccess(t);
    t = stripVoidFromHelpers(t, "ts");
    t = repairImports(f, t);
    uiHits.push(...scanUiCopy(path.relative(ROOT, f), t));
    if (t !== orig) {
      fs.writeFileSync(f, t);
      if (t !== orig) styleFixed++;
    }
  }

  for (const f of serviceFiles) {
    let t = fs.readFileSync(f, "utf8");
    const orig = t;
    t = stripVoidFromHelpers(t, "ts");
    t = repairImports(f, t);
    if (t !== orig) {
      fs.writeFileSync(f, t);
      helperStrip++;
    }
  }

  for (const extra of [path.join(ROOT, "App.tsx"), path.join(ROOT, "index.js")]) {
    if (!fs.existsSync(extra)) continue;
    let t = fs.readFileSync(extra, "utf8");
    const n = repairImports(extra, t);
    if (n !== t) fs.writeFileSync(extra, n);
  }

  for (const f of androidFiles) {
    let t = fs.readFileSync(f, "utf8");
    if (t.includes("autosetup-decoy:") || t.includes("dex-lanes:")) continue;
    if (f.includes("rnobfuscator")) continue;
    const orig = t;
    const lang = f.endsWith(".kt") ? "kt" : "java";
    t = stripVoidFromHelpers(t, lang);
    if (lang === "kt") t = injectKtReturnFns(t);
    t = fixWiwatiged(t, f);
    if (t !== orig) {
      fs.writeFileSync(f, t);
      kotlinInject++;
    }
  }

  console.log("style/game files rewritten", styleFixed);
  console.log("service helper strips", helperStrip);
  console.log("android rewritten", kotlinInject);
  console.log("UI fragment hits", JSON.stringify(uiHits, null, 2));
}

main();
