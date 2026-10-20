/**
 * Activity package is com.{hostFragment} (namespace + MainActivity/MainApplication).
 * Legacy trees used com.{hostFragment}abpp; that suffix was the same in every DEX, so it is stripped.
 * hostFragment is its own mix and must not contain the project fragment (or the reverse):
 * the next global fragment replace would otherwise rewrite the activity package back.
 * applicationId and taskAffinity stay put. The JS component name drops a trailing abpp
 * when it is exactly {projectFragment}abpp.
 *
 * Keep hostFragment only when it is still bound to this app (jiraIssue + packageName).
 * Cloned templates that reuse the same meta.hostFragment otherwise share one Class Name.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { folderSlugFromRoot, mixFragment } = require("./fragment");

const NAMESPACE_RE = /^([ \t]*namespace\s+)(["'])(com\.[A-Za-z0-9]+)\2/m;
const PACKAGE_RE = /^package\s+(com\.[A-Za-z0-9]+)[ \t]*;?[ \t]*(\r?\n|$)/m;

function fragmentsOverlap(host, project) {
  const a = String(host || "").toLowerCase();
  const b = String(project || "").toLowerCase();
  if (!a || !b) return true;
  return a === b || a.includes(b) || b.includes(a);
}

function isUsableHost(host, projectFragment) {
  return /^[a-z0-9]+$/i.test(String(host || "")) && !fragmentsOverlap(host, projectFragment);
}

/** Stable per-app key so clones don't keep another task's Class Name. */
function hostBindingKey(meta) {
  const issue = String(meta?.jiraIssue || "").trim();
  const pkg = String(meta?.packageName || "").trim();
  if (!issue && !pkg) return "";
  return `${issue}|${pkg}`;
}

function suggestHostFragment(rootPath, projectFragment, meta) {
  const issueDigits = String(meta?.jiraIssue || "").replace(/\D/g, "");
  const base = `${folderSlugFromRoot(rootPath)}${issueDigits}`;
  for (let i = 0; i < 48; i++) {
    const host = mixFragment(base);
    if (!fragmentsOverlap(host, projectFragment)) return host;
  }
  throw new Error(
    `Не удалось сгенерировать hostFragment без пересечения с «${projectFragment}»`
  );
}

function rewriteDeclaredPackage(content, fromPkg, targetPackage) {
  let next = String(content);
  if (fromPkg && fromPkg !== targetPackage) next = next.split(fromPkg).join(targetPackage);
  return next.replace(/com\.[A-Za-z0-9]+abpp/g, targetPackage);
}

function rewriteNamespace(content, targetPackage) {
  const match = content.match(NAMESPACE_RE);
  if (!match) return null;
  const fromPkg = match[3];
  return rewriteDeclaredPackage(content.replace(NAMESPACE_RE, `$1$2${targetPackage}$2`), fromPkg, targetPackage);
}

function rewritePackageLine(content, targetPackage) {
  const match = content.match(PACKAGE_RE);
  if (!match) return null;
  const fromPkg = match[1];
  if (fromPkg !== targetPackage && !fromPkg.endsWith("abpp") && fromPkg.split(".").length !== 2) {
    return null;
  }
  return content.replace(PACKAGE_RE, `package ${targetPackage}$2`);
}

async function findNamedFile(dir, name) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "build" || entry.name === ".gradle") continue;
      const found = await findNamedFile(full, name);
      if (found) return found;
      continue;
    }
    if (entry.isFile() && entry.name === name) return full;
  }
  return null;
}

async function findActivitySource(javaRoot, baseName) {
  return (
    (await findNamedFile(javaRoot, `${baseName}.kt`)) ||
    (await findNamedFile(javaRoot, `${baseName}.java`))
  );
}

function samePath(a, b) {
  return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

/**
 * @param {string} rootPath
 * @param {object} meta mutated: meta.hostFragment, meta.hostFragmentBoundTo
 * @param {string} projectFragment live project fragment (after fragment replace)
 */
async function applyHostFragment(rootPath, meta, projectFragment) {
  const project = String(projectFragment || "").trim();
  if (!/^[a-zA-Z0-9]+$/.test(project)) {
    return { ok: false, details: "fragment проекта не найден" };
  }

  const binding = hostBindingKey(meta);
  const previous = String(meta.hostFragment || "").trim();
  const previousBound = String(meta.hostFragmentBoundTo || "").trim();
  const boundOk = Boolean(binding) && previousBound === binding;
  const kept = boundOk && isUsableHost(previous, project);
  const generated = !kept;
  const host = kept ? previous : suggestHostFragment(rootPath, project, meta);
  const targetPackage = `com.${host}`;
  const appMarker = `${project}abpp`;

  const gradlePath = path.join(rootPath, "android", "app", "build.gradle");
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const mainActivityPath = await findActivitySource(javaRoot, "MainActivity");
  const mainApplicationPath = await findActivitySource(javaRoot, "MainApplication");
  if (!mainActivityPath || !mainApplicationPath) {
    return { ok: false, details: "MainActivity / MainApplication не найдены" };
  }

  const activityDir = path.dirname(mainActivityPath);
  if (path.resolve(path.dirname(mainApplicationPath)) !== path.resolve(activityDir)) {
    return {
      ok: false,
      details: "MainActivity и MainApplication лежат в разных каталогах",
    };
  }

  const gradleRaw = await fs.readFile(gradlePath, "utf8");
  const appIdBefore = (gradleRaw.match(/applicationId\s+"[^"]+"/) || [])[0] || "";
  const gradleNext = rewriteNamespace(gradleRaw, targetPackage);
  if (gradleNext == null) {
    return { ok: false, details: "namespace com.* не найден в android/app/build.gradle" };
  }
  const appIdAfter = (gradleNext.match(/applicationId\s+"[^"]+"/) || [])[0] || "";
  if (appIdBefore !== appIdAfter) {
    return { ok: false, details: "applicationId изменился при смене namespace" };
  }

  const sources = [mainActivityPath, mainApplicationPath];
  const rewritten = [];
  for (const filePath of sources) {
    const raw = await fs.readFile(filePath, "utf8");
    const componentBefore = (raw.match(/^.*getMainComponentName\(\).*$/m) || [])[0] || "";
    const packaged = rewritePackageLine(raw, targetPackage);
    if (packaged == null) {
      return {
        ok: false,
        details: `${path.basename(filePath)}: нет package com.*`,
      };
    }
    const next = packaged.split(appMarker).join(project);
    const componentAfter = (next.match(/^.*getMainComponentName\(\).*$/m) || [])[0] || "";
    if (componentBefore.split(appMarker).join(project) !== componentAfter) {
      return {
        ok: false,
        details: `${path.basename(filePath)}: getMainComponentName() изменился не только суффиксом abpp`,
      };
    }
    rewritten.push({ filePath, raw, next });
  }

  const targetDir = path.join(javaRoot, "com", host);
  const dirMoves = !samePath(activityDir, targetDir);
  if (dirMoves) {
    try {
      await fs.access(targetDir);
      return { ok: false, details: `каталог уже есть: ${path.relative(rootPath, targetDir)}` };
    } catch {
      // target free
    }
  }

  if (gradleNext !== gradleRaw) {
    await fs.writeFile(gradlePath, gradleNext, "utf8");
  }
  for (const item of rewritten) {
    if (item.next !== item.raw) {
      await fs.writeFile(item.filePath, item.next, "utf8");
    }
  }
  if (dirMoves) {
    await fs.mkdir(path.dirname(targetDir), { recursive: true });
    await fs.rename(activityDir, targetDir);
  }

  const { syncNativeHostPackages } = require("./relocateNativePackage");
  const fromPkg = ((gradleRaw.match(NAMESPACE_RE) || [])[3]) || "";
  await syncNativeHostPackages(rootPath, targetPackage, projectFragment, fromPkg);
  await stripAppMarker(rootPath, appMarker, project);

  meta.hostFragment = host;
  if (binding) meta.hostFragmentBoundTo = binding;
  else delete meta.hostFragmentBoundTo;

  const nsBefore = (gradleRaw.match(NAMESPACE_RE) || [])[3] || "?";
  if (!generated && !dirMoves && gradleNext === gradleRaw && rewritten.every((item) => item.next === item.raw)) {
    return {
      ok: true,
      details: `hostFragment ${host} без изменений (${targetPackage})`,
      hostFragment: host,
      generated: false,
    };
  }
  const why = generated ? "новый" : "сохранён";
  return {
    ok: true,
    details: `hostFragment ${host} (${why}), пакет ${nsBefore} → ${targetPackage}`,
    hostFragment: host,
    generated,
  };
}

function stripMarkerText(raw, marker, project) {
  const exact = raw.replace(new RegExp(`\\b${marker}\\b`, "g"), project);
  const alias = new RegExp(
    `^[ \\t]*export const ${marker}(\\w+) = ${project}\\1;?[ \\t]*\\r?\\n`,
    "gm"
  );
  return exact.replace(alias, "");
}

async function stripAppMarker(rootPath, marker, project) {
  if (!marker || marker === project) return;
  const files = [
    "app.json",
    "package.json",
    "package-lock.json",
    "index.js",
    "index.ts",
    "index.tsx",
    path.join("android", "settings.gradle"),
  ];
  const services = path.join(rootPath, "services");
  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(path.relative(rootPath, full));
    }
  }
  await walk(services);
  for (const rel of files) {
    const file = path.join(rootPath, rel);
    let raw;
    try {
      raw = await fs.readFile(file, "utf8");
    } catch {
      continue;
    }
    if (!raw.includes(marker)) continue;
    await fs.writeFile(file, stripMarkerText(raw, marker, project), "utf8");
  }
}

module.exports = {
  applyHostFragment,
  fragmentsOverlap,
  suggestHostFragment,
  hostBindingKey,
};
