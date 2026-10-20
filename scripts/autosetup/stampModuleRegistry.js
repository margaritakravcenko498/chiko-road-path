/**
 * The host ReactPackage name is not part of fragment replace: the legacy
 * class has no project fragment, so autosetup never rewrites it and every
 * build keeps the same Class Name. Stamp S{fragment}ModuleRegistry once.
 * Later fragment replace / reshuffle move that fragment like the other modules.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { collectWorkspaceFiles } = require("./replaceFragment");

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walkKt(dir, out = []) {
  if (!(await safeStat(dir))) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "build") continue;
      await walkKt(full, out);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".kt") && !/Part\d+\.kt$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function readRegistryClass(src) {
  const match = src.match(
    /\b(?:class|object)\s+([A-Za-z_][A-Za-z0-9_]*)\s*:[^{;\n]*\bReactPackage\b/
  );
  return match ? match[1] : "";
}

async function findRegistries(rootPath) {
  const javaRoot = path.join(rootPath, "android", "app", "src");
  const files = await walkKt(javaRoot);
  const found = [];
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (src.includes("autosetup-decoy")) continue;
    if (!src.includes("fun createNativeModules")) continue;
    const className = readRegistryClass(src);
    if (!className) continue;
    found.push({ file, className });
  }
  return found;
}

async function replaceIdentifier(rootPath, from, to) {
  const re = new RegExp(`\\b${escapeRegExp(from)}\\b`, "g");
  const filePaths = await collectWorkspaceFiles(rootPath);
  let filesChanged = 0;
  let replacements = 0;
  for (const filePath of filePaths) {
    let content;
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }
    if (content.includes("\u0000") || !content.includes(from)) continue;
    let count = 0;
    const next = content.replace(re, () => {
      count += 1;
      return to;
    });
    if (count === 0) continue;
    await fs.writeFile(filePath, next, "utf8");
    filesChanged += 1;
    replacements += count;
  }
  return { filesChanged, replacements };
}

async function stampModuleRegistry(rootPath, { fragment } = {}) {
  const frag = String(fragment || "").trim();
  if (!frag) return { ok: false, details: "fragment пуст" };
  if (!/^[a-zA-Z0-9]+$/.test(frag)) {
    return { ok: false, details: "fragment: только латиница и цифры" };
  }

  const registries = await findRegistries(rootPath);
  if (registries.length === 0) {
    return { ok: false, details: "ReactPackage с createNativeModules не найден" };
  }

  const pending = registries.filter((item) => !item.className.includes(frag));
  if (pending.length === 0) {
    return { ok: true, details: "ModuleRegistry уже с фрагментом" };
  }

  const renamed = [];
  for (const item of pending) {
    const nextName = `S${frag}ModuleRegistry`;
    if (nextName === item.className) continue;
    const nextPath = path.join(path.dirname(item.file), `${nextName}.kt`);
    if (path.basename(item.file, ".kt") !== item.className) {
      return {
        ok: false,
        details: `${path.basename(item.file)} не совпадает с классом ${item.className}`,
      };
    }
    if (await safeStat(nextPath)) {
      return { ok: false, details: `уже есть ${nextName}.kt` };
    }
    const replaced = await replaceIdentifier(rootPath, item.className, nextName);
    if (replaced.replacements === 0) {
      return { ok: false, details: `не удалось заменить ${item.className}` };
    }
    await fs.rename(item.file, nextPath);
    renamed.push(`${item.className} → ${nextName}`);
  }

  if (renamed.length === 0) {
    return { ok: true, details: "ModuleRegistry уже с фрагментом" };
  }
  return { ok: true, details: renamed.join("; ") };
}

module.exports = { stampModuleRegistry };
