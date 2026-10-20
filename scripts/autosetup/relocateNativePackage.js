/**
 * Move com.{projectFragment} native sources into com.{hostFragment}.
 * Legacy com.{host}abpp packages are rewritten to the same target.
 * so DEX no longer fingerprints the JS fragment as a Java package.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");

async function walkFiles(dir) {
  const out = [];
  if (!(await safeStat(dir))) return out;
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(java|kt)$/i.test(entry.name)) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function rewritePackages(src, fromPkg, toPkg) {
  const fromRe = new RegExp(
    `(^|\\s)(package|import)\\s+${fromPkg.replace(/\./g, "\\.")}(\\.[\\w.]+)?`,
    "gm"
  );
  return src.replace(fromRe, (full, lead, kw, rest) => `${lead}${kw} ${toPkg}${rest || ""}`);
}

function rewriteAnyHostOrFragment(src, targetPackage, projectFragment, fromPackage = "") {
  let next = src;
  next = next.replace(
    /^([ \t]*(?:package|import)[ \t]+)com\.[A-Za-z0-9]+abpp(\.[\w.]+)?/gm,
    (full, lead, rest) => `${lead}${targetPackage}${rest || ""}`
  );
  if (fromPackage && fromPackage !== targetPackage) {
    const fromRe = new RegExp(
      `^([ \\t]*(?:package|import)[ \\t]+)${fromPackage.replace(/\./g, "\\.")}(\\.[\\w.]+)?`,
      "gm"
    );
    next = next.replace(fromRe, (full, lead, rest) => `${lead}${targetPackage}${rest || ""}`);
  }
  if (projectFragment) {
    const fromPkg = `com.${projectFragment}`;
    const fromRe = new RegExp(
      `^([ \\t]*(?:package|import)[ \\t]+)${fromPkg.replace(/\./g, "\\.")}(\\.[\\w.]+)?`,
      "gm"
    );
    next = next.replace(fromRe, (full, lead, rest) => `${lead}${targetPackage}${rest || ""}`);
  }
  return next;
}

async function syncNativeHostPackages(rootPath, hostPackage, projectFragment = "", fromPackage = "") {
  const targetPackage = String(hostPackage || "").trim();
  if (!targetPackage) return { ok: true, details: "sync skip" };
  const files = await walkFiles(path.join(rootPath, "android", "app", "src"));
  let rewritten = 0;
  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const next = rewriteAnyHostOrFragment(raw, targetPackage, projectFragment, fromPackage);
    if (next !== raw) {
      await fs.writeFile(file, next, "utf8");
      rewritten += 1;
    }
  }
  return {
    ok: true,
    details: `sync → ${targetPackage} (rewritten ${rewritten})`,
    rewritten,
  };
}

async function relocateNativePackage(rootPath, projectFragment, hostPackage) {
  const project = String(projectFragment || "").trim();
  const targetPackage = String(hostPackage || "").trim();
  if (!project || !targetPackage) {
    return { ok: true, details: "native package: skip" };
  }
  const fromPkg = `com.${project}`;
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");

  if (fromPkg !== targetPackage) {
    const fromDir = path.join(javaRoot, "com", project);
    if (await safeStat(fromDir)) {
      const srcRoot = path.join(rootPath, "android", "app", "src");
      const all = await walkFiles(srcRoot);
      for (const file of all) {
        const raw = await fs.readFile(file, "utf8");
        const next = rewritePackages(raw, fromPkg, targetPackage);
        if (next !== raw) await fs.writeFile(file, next, "utf8");
      }
      const destDir = path.join(javaRoot, ...targetPackage.split("."));
      await fs.mkdir(destDir, { recursive: true });
      async function moveTree(src, dest) {
        const entries = await fs.readdir(src, { withFileTypes: true });
        await fs.mkdir(dest, { recursive: true });
        for (const entry of entries) {
          const from = path.join(src, entry.name);
          const to = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            await moveTree(from, to);
            continue;
          }
          if (await safeStat(to)) {
            await fs.unlink(from);
            continue;
          }
          await fs.rename(from, to);
        }
      }
      await moveTree(fromDir, destDir);
      await fs.rm(fromDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  return syncNativeHostPackages(rootPath, targetPackage, project);
}

module.exports = { relocateNativePackage, syncNativeHostPackages };
