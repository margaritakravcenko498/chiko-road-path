const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".expo",
  ".idea",
  ".vscode",
  "dist",
  ".gradle",
  "build",
]);

const SKIP_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".keystore",
  ".jks",
  ".p12",
  ".jar",
  ".aar",
  ".apk",
  ".aab",
  ".zip",
  ".gz",
  ".pdf",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
]);

const ENC_CONST_LINE_RE =
  /^\s*(?:export\s+)?const\s+\w+_ENC\s*=\s*'[0-9A-Fa-f]+'\s*;?\s*$/;

/** Encrypted hex consts that must not be fragment-substituted inside the value. */
const ENCRYPTED_HEX_CONST_LINE_RE =
  /^\s*(?:export\s+)?const\s+(?:\w+_ENC|CRUX_\w+_DOC_KEY|li\w+nk)\s*=\s*'[0-9A-Fa-f]+'\s*;?\s*$/;

function isTextReplaceCandidate(filePath) {
  return !SKIP_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function collectWorkspaceFiles(rootDir) {
  const files = [];
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(fullPath);
        continue;
      }
      if (entry.isFile() && isTextReplaceCandidate(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  await walk(rootDir);
  return files;
}

function replaceFragmentOutsideEncConstants(content, from, to) {
  let replacements = 0;
  const next = content
    .split(/\r?\n/)
    .map((line) => {
      // Encrypted hex payloads: rename identifier only, never touch the hex value.
      if (ENC_CONST_LINE_RE.test(line) || ENCRYPTED_HEX_CONST_LINE_RE.test(line)) {
        const idMatch = line.match(
          /^(\s*(?:export\s+)?const\s+)(\w+)(\s*=\s*')([0-9A-Fa-f]+)('.*)$/
        );
        if (idMatch && idMatch[2].includes(from)) {
          const nextId = idMatch[2].split(from).join(to);
          replacements += idMatch[2].split(from).length - 1;
          return `${idMatch[1]}${nextId}${idMatch[3]}${idMatch[4]}${idMatch[5]}`;
        }
        return line;
      }
      if (!line.includes(from)) return line;
      const parts = line.split(from);
      replacements += parts.length - 1;
      return parts.join(to);
    })
    .join("\n");
  return { content: next, replacements };
}

async function collectRenameCandidates(rootDir, fragment) {
  const files = [];
  const directories = [];
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (entry.name.includes(fragment)) directories.push(fullPath);
        await walk(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.includes(fragment)) {
        files.push(fullPath);
      }
    }
  }
  await walk(rootDir);
  return { files, directories };
}

async function renamePathByFragment(oldPath, from, to) {
  const basename = path.basename(oldPath);
  const nextBasename = basename.split(from).join(to);
  if (nextBasename === basename) return { renamed: false };

  const nextPath = path.join(path.dirname(oldPath), nextBasename);
  if (await safeStat(nextPath)) {
    return { renamed: false, skippedPath: oldPath };
  }
  await fs.rename(oldPath, nextPath);
  return { renamed: true };
}

async function renamePathsInWorkspace(rootPath, from, to) {
  const candidates = await collectRenameCandidates(rootPath, from);
  let filesRenamed = 0;
  let directoriesRenamed = 0;
  const skipped = [];

  for (const filePath of candidates.files.sort((a, b) => b.length - a.length)) {
    const result = await renamePathByFragment(filePath, from, to);
    if (result.renamed) filesRenamed += 1;
    if (result.skippedPath) skipped.push(path.relative(rootPath, result.skippedPath));
  }
  for (const dirPath of candidates.directories.sort((a, b) => b.length - a.length)) {
    const result = await renamePathByFragment(dirPath, from, to);
    if (result.renamed) directoriesRenamed += 1;
    if (result.skippedPath) skipped.push(path.relative(rootPath, result.skippedPath));
  }

  return { filesRenamed, directoriesRenamed, skipped };
}

/**
 * Same behavior as RN App Helper «Сохранить и заменить».
 */
async function replaceFragmentInProject(rootPath, from, to) {
  const fromFragment = String(from || "").trim();
  const toFragment = String(to || "").trim();
  if (!fromFragment || !toFragment) {
    return { ok: false, details: "Нужны fragmentFrom и fragmentTo" };
  }
  if (fromFragment === toFragment) {
    return { ok: true, details: "fragmentFrom === fragmentTo — пропуск" };
  }
  if (!/^[a-zA-Z0-9]+$/.test(toFragment)) {
    return { ok: false, details: "fragmentTo: только латиница и цифры" };
  }

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
    if (content.includes("\u0000")) continue;
    if (!content.includes(fromFragment)) continue;

    const { content: next, replacements: n } = replaceFragmentOutsideEncConstants(
      content,
      fromFragment,
      toFragment
    );
    if (n === 0) continue;
    await fs.writeFile(filePath, next, "utf8");
    filesChanged += 1;
    replacements += n;
  }

  const renameResult = await renamePathsInWorkspace(rootPath, fromFragment, toFragment);
  const totalRenamed = renameResult.filesRenamed + renameResult.directoriesRenamed;

  if (filesChanged === 0 && totalRenamed === 0) {
    return {
      ok: false,
      details: `Фрагмент "${fromFragment}" не найден в тексте и именах`,
    };
  }

  return {
    ok: true,
    details:
      `файлов: ${filesChanged}, замен: ${replacements}; ` +
      `rename files: ${renameResult.filesRenamed}, dirs: ${renameResult.directoriesRenamed}` +
      (renameResult.skipped.length
        ? `; skip: ${renameResult.skipped.join(", ")}`
        : ""),
  };
}

module.exports = {
  replaceFragmentInProject,
  collectWorkspaceFiles,
  SKIP_DIRS,
};
