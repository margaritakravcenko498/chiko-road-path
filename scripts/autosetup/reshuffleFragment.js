/**
 * After fragment replace, move the fragment to a new random index inside
 * each unique identifier / basename (except structural sandwich names).
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { collectWorkspaceFiles, SKIP_DIRS } = require("./replaceFragment");
const { rngFor } = require("./rng");
const { safeStat } = require("./fsUtils");

const STRUCTURAL = [
  /^li.+nk$/i,
  /^ty.+pex$/i,
  /^co.+lossus$/i,
  /^xt.+ea$/i,
  /^ba.+con$/i,
  /^bo.+mbe$/i,
  /^si.+aba$/i,
  /ntsVariable$/i,
  /^CRUX_/i,
  /CfProtocol$/i,
  /^cfg.+Cat/i,
];

const SKIP_EXT = new Set([".png", ".jpg", ".keystore", ".aab", ".apk", ".zip"]);

function isStructural(token) {
  return STRUCTURAL.some((re) => re.test(token));
}

function stripFragment(token, fragment) {
  return String(token).split(fragment).join("");
}

function insertAt(stem, fragment, at) {
  return `${stem.slice(0, at)}${fragment}${stem.slice(at)}`;
}

function pickIndex(stem, rng) {
  if (stem.length < 2) return 1;
  const lo = 1;
  const hi = stem.length;
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function mapToken(token, fragment, salt, stemOwners) {
  if (!token.includes(fragment) || isStructural(token)) return token;
  const stem = stripFragment(token, fragment);
  if (!stem) return token;
  // Two on-disk files can strip to the same stem (Part02{frag} and Part{frag}02).
  // Those are different modules. Collapsing them points every import at one file
  // and leaves the other declaring the same object.
  const owners = stemOwners && stemOwners.get(stem);
  if (owners && owners.size > 1) return token;
  // Key by stem, not the current slot: import paths and filenames that already
  // diverged (GameI{frag}nit vs G{frag}ameInit) must land on the same name.
  const rng = rngFor(`reshuf:${salt}:${stem}`);
  return insertAt(stem, fragment, pickIndex(stem, rng));
}

function noteStemOwner(stemOwners, base, fragment) {
  if (!base || !base.includes(fragment)) return;
  const stem = stripFragment(base, fragment);
  if (!stemOwners.has(stem)) stemOwners.set(stem, new Set());
  stemOwners.get(stem).add(base);
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
      if (entry.isFile() && entry.name.includes(fragment)) files.push(fullPath);
    }
  }
  await walk(rootDir);
  return { files, directories };
}

async function reshuffleFragmentPositions(rootPath, fragment, salt = String(Date.now())) {
  const frag = String(fragment || "").trim();
  if (!frag) return { ok: false, details: "fragment пуст" };

  const identRe = new RegExp(`\\b[A-Za-z_][A-Za-z0-9_]*${frag}[A-Za-z0-9_]*\\b`, "g");
  const mapping = new Map();

  const names = await collectRenameCandidates(rootPath, frag);
  const stemOwners = new Map();
  for (const filePath of names.files) {
    noteStemOwner(stemOwners, path.basename(filePath, path.extname(filePath)), frag);
  }
  for (const dirPath of names.directories) {
    noteStemOwner(stemOwners, path.basename(dirPath), frag);
  }

  const filePaths = await collectWorkspaceFiles(rootPath);
  for (const filePath of filePaths) {
    let content;
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }
    if (!content.includes(frag)) continue;
    const matches = content.match(identRe) || [];
    for (const token of matches) {
      if (mapping.has(token)) continue;
      mapping.set(token, mapToken(token, frag, salt, stemOwners));
    }
  }

  for (const filePath of names.files) {
    const base = path.basename(filePath, path.extname(filePath));
    if (!mapping.has(base)) mapping.set(base, mapToken(base, frag, salt, stemOwners));
  }
  for (const dirPath of names.directories) {
    const base = path.basename(dirPath);
    if (!mapping.has(base)) mapping.set(base, mapToken(base, frag, salt, stemOwners));
  }

  const pairs = [...mapping.entries()]
    .filter(([from, to]) => from !== to)
    .sort((a, b) => b[0].length - a[0].length);

  if (pairs.length === 0) {
    return { ok: true, details: "reshuffle: нечего двигать" };
  }

  let filesChanged = 0;
  let replacements = 0;
  for (const filePath of filePaths) {
    let content;
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }
    if (!content.includes(frag)) continue;
    let next = content;
    for (const [from, to] of pairs) {
      const re = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      next = next.replace(re, () => {
        replacements += 1;
        return to;
      });
    }
    if (next !== content) {
      await fs.writeFile(filePath, next, "utf8");
      filesChanged += 1;
    }
  }

  let renamed = 0;
  const renameList = [...names.files, ...names.directories].sort((a, b) => b.length - a.length);
  for (const oldPath of renameList) {
    const ext = path.extname(oldPath);
    const isDir = names.directories.includes(oldPath);
    const base = isDir ? path.basename(oldPath) : path.basename(oldPath, ext);
    const nextBase = mapping.get(base);
    if (!nextBase || nextBase === base) continue;
    const nextPath = path.join(path.dirname(oldPath), isDir ? nextBase : `${nextBase}${ext}`);
    if (await safeStat(nextPath)) continue;
    await fs.rename(oldPath, nextPath);
    renamed += 1;
  }

  return {
    ok: true,
    details: `reshuffle: ${pairs.length} имён, файлов ${filesChanged}, rename ${renamed}, замен ${replacements}`,
  };
}

module.exports = { reshuffleFragmentPositions };
