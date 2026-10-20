const fs = require("node:fs/promises");
const path = require("node:path");
const { identFromRng, randomSeedString, rngFor } = require("./rng");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "build",
  ".gradle",
  "dist",
  "coverage",
  "scripts",
]);

const SKIP_METHODS = new Set([
  "getName",
  "getConstants",
  "initialize",
  "invalidate",
  "onCatalystInstanceDestroy",
  "canOverrideExistingModule",
  "finish",
  "toString",
  "hashCode",
  "equals",
]);

function escapeReg(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceIdent(src, from, to) {
  if (!from || !to || from === to) return src;
  return src.replace(new RegExp(`\\b${escapeReg(from)}\\b`, "g"), to);
}

async function walk(dir, acc, accept) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(full, acc, accept);
      continue;
    }
    if (accept(full)) acc.push(full);
  }
}

function parseModule(src) {
  if (!src.includes("ReactContextBaseJavaModule")) return null;
  if (src.includes("fun createNativeModules")) return null;
  const className = (src.match(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/) || [])[1];
  if (!className) return null;
  const assigned = src.match(
    /getName\(\)\s*(?::\s*[\w.<>?]+\s*)?=\s*"([A-Za-z_][A-Za-z0-9_]*)"/
  );
  const returned = src.match(/getName\(\)[\s\S]*?\breturn\s+"([A-Za-z_][A-Za-z0-9_]*)"/);
  const getName = (assigned || returned || [])[1];
  if (!getName) return null;
  const methods = [];
  const re =
    /(?:\bfun\b|(?:public|private|protected)\s+(?:static\s+)?(?:void|String|int|boolean|long))\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let match;
  while ((match = re.exec(src))) {
    const name = match[1];
    if (SKIP_METHODS.has(name) || name === className) continue;
    if (!methods.includes(name)) methods.push(name);
  }
  return { className, getName, methods };
}

function freshIdent(rng, used) {
  for (let i = 0; i < 60; i++) {
    const token = identFromRng(rng, 9, 14);
    if (used.has(token)) continue;
    used.add(token);
    return token;
  }
  throw new Error("failed to mint a native identifier");
}

function classIdent(rng, used) {
  const token = freshIdent(rng, used);
  return token.charAt(0).toUpperCase() + token.slice(1);
}

function applyPlan(src, plan, isOwn) {
  let next = src;
  for (const method of plan.methodMap) {
    const call = new RegExp(
      `\\b${escapeReg(plan.getName)}(\\??\\.)\\s*${escapeReg(method.from)}\\b`,
      "g"
    );
    next = next.replace(call, `${plan.newGet}$1${method.to}`);
    if (plan.className !== plan.getName) {
      const typed = new RegExp(
        `\\b${escapeReg(plan.className)}(\\??\\.)\\s*${escapeReg(method.from)}\\b`,
        "g"
      );
      next = next.replace(typed, `${plan.newClass}$1${method.to}`);
    }
  }
  const idents = [{ from: plan.className, to: plan.newClass }];
  if (plan.getName !== plan.className) idents.push({ from: plan.getName, to: plan.newGet });
  for (const method of plan.methodMap) {
    if (method.from.length >= 8 || isOwn) idents.push(method);
  }
  idents.sort((a, b) => b.from.length - a.from.length);
  for (const ident of idents) next = replaceIdent(next, ident.from, ident.to);
  return next;
}

async function renameNativeSurface(rootPath, options = {}) {
  const fragment = options.fragment || "native";
  const rng = rngFor(`${fragment}:native-surface:${randomSeedString()}`);
  const used = new Set();
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const moduleFiles = [];
  await walk(javaRoot, moduleFiles, (file) => /\.(kt|java)$/.test(file));

  const plans = [];
  for (const file of moduleFiles) {
    const src = await fs.readFile(file, "utf8");
    const parsed = parseModule(src);
    if (!parsed) continue;
    used.add(parsed.className);
    used.add(parsed.getName);
    for (const name of parsed.methods) used.add(name);
    plans.push({ file, ...parsed });
  }
  if (plans.length === 0) {
    return { ok: false, details: "no app NativeModule classes found" };
  }

  const byGetName = new Map();
  for (const plan of plans) {
    const owners = byGetName.get(plan.getName) || [];
    owners.push(plan.className);
    byGetName.set(plan.getName, owners);
  }
  const dupes = [...byGetName.entries()].filter(([, owners]) => owners.length > 1);
  if (dupes.length) {
    const detail = dupes
      .map(([name, owners]) => `${name} (${owners.join(", ")})`)
      .join("; ");
    return {
      ok: false,
      details: `NativeModule getName collision, rename aborted: ${detail}`,
    };
  }

  for (const plan of plans) {
    plan.newClass = classIdent(rng, used);
    plan.newGet = plan.getName === plan.className ? plan.newClass : classIdent(rng, used);
    plan.methodMap = plan.methods.map((name) => ({ from: name, to: freshIdent(rng, used) }));
  }

  const sources = [];
  await walk(path.join(rootPath, "android", "app", "src"), sources, (file) =>
    /\.(kt|java)$/.test(file)
  );
  await walk(path.join(rootPath, "services"), sources, (file) =>
    /\.(ts|tsx|js|jsx)$/.test(file)
  );
  await walk(path.join(rootPath, "Layouts"), sources, (file) =>
    /\.(ts|tsx|js|jsx)$/.test(file)
  );
  for (const name of ["index.js", "index.ts", "index.tsx", "App.tsx", "App.js"]) {
    const file = path.join(rootPath, name);
    try {
      await fs.access(file);
      sources.push(file);
    } catch {
      /* absent */
    }
  }

  let touched = 0;
  for (const file of sources) {
    const src = await fs.readFile(file, "utf8");
    let next = src;
    for (const plan of plans) {
      next = applyPlan(next, plan, path.resolve(file) === path.resolve(plan.file));
    }
    if (next !== src) {
      await fs.writeFile(file, next, "utf8");
      touched += 1;
    }
  }

  const renamed = [];
  for (const plan of plans) {
    const ext = path.extname(plan.file);
    const base = path.basename(plan.file, ext);
    if (base !== plan.className) continue;
    const dest = path.join(path.dirname(plan.file), `${plan.newClass}${ext}`);
    await fs.rename(plan.file, dest);
    renamed.push(`${plan.className} → ${plan.newClass}`);
  }

  return {
    ok: true,
    details: `${plans.length} modules, ${touched} files; ${renamed.join(", ")}`,
  };
}

module.exports = { renameNativeSurface };
