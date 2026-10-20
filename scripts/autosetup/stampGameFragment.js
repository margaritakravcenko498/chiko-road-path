/**
 * Stamp project fragment into Layouts/Game when missing.
 * Fresh Jira *_source.zip games have plain names (LoaderScreen, theme) —
 * without this, fragment replace is a no-op in Layouts and split finds nothing.
 *
 * - Renames .ts/.tsx basenames (Henway-style mid-insert)
 * - Rewrites imports / exported component & hook identifiers
 * - Updates App.tsx paths
 * - Injects void dummy helpers so decoy split can carve Part files
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { rngFor } = require("./rng");

const STAMP_MARKER = "/* autosetup-game-stamp:v1 */";
const CODE_EXTS = new Set([".ts", ".tsx"]);
const SKIP_BASENAME = /^(index)$/i;

const SUFFIXES = [
  "Screen",
  "Button",
  "Card",
  "Panel",
  "Layer",
  "Strip",
  "Tile",
  "Row",
  "Controls",
  "Header",
  "Init",
  "Engine",
  "Scale",
  "Puzzle",
  "Segment",
  "Background",
  "Overlay",
  "Indicator",
];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walkFiles(rootDir, { exts = null } = {}) {
  const files = [];
  if (!(await safeStat(rootDir))) return files;
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (exts && !exts.has(ext)) continue;
      files.push(full);
    }
  }
  await walk(rootDir);
  return files;
}

function insertFragmentInBasename(base, fragment, salt = "") {
  if (!base || !fragment || base.includes(fragment)) return base;
  if (SKIP_BASENAME.test(base)) return base;
  const rng = rngFor(`gamestamp:${salt}:${base}:${fragment}`);
  if (base.length < 2) return `${base}${fragment}`;
  const at = 1 + Math.floor(rng() * base.length);
  return `${base.slice(0, at)}${fragment}${base.slice(at)}`;
}

function gameAlreadyHasFragment(files, fragment) {
  if (!fragment) return false;
  return files.some((f) => path.basename(f).includes(fragment));
}

function replaceIdentifier(content, from, to) {
  if (!from || from === to) return content;
  const re = new RegExp(`\\b${escapeRegExp(from)}\\b`, "g");
  return content.replace(re, to);
}

function stripFragment(token, fragment) {
  return String(token).split(fragment).join("");
}

/**
 * Root App.tsx often still has a previous stamp (fragment in a different slot)
 * after applyGame replaces Layouts/Game from a fresh zip. Also rewrite those.
 */
function replaceIdentifierAndVariants(content, from, to, fragment) {
  let next = replaceIdentifier(content, from, to);
  if (!fragment || !from || from === to) return next;
  const identRe = new RegExp(
    `\\b[A-Za-z_][A-Za-z0-9_]*${escapeRegExp(fragment)}[A-Za-z0-9_]*\\b`,
    "g"
  );
  return next.replace(identRe, (token) => {
    if (token === to) return token;
    if (stripFragment(token, fragment) === from) return to;
    return token;
  });
}

function buildStampHelpers(fragment) {
  const a = `${fragment}GameMixSeed`;
  const b = `${fragment}GameFoldRange`;
  const c = `${fragment}GameClampSpan`;
  return `

${STAMP_MARKER}
function ${a}(x: number, y: number): number {
  return ((x % (y || 1)) + y) % (y || 1);
}
function ${b}(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}
function ${c}(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}
void ${a}(3, 7);
void ${b}([1, 2, 3]);
void ${c}(5, 0, 10);
`;
}

function ensureStampHelpers(content, fragment) {
  if (!fragment) return { content, injected: false };
  if (content.includes(STAMP_MARKER)) return { content, injected: false };
  if (content.includes(`${fragment}GameMixSeed`)) return { content, injected: false };
  // Skip pure type/barrel re-exports with almost no logic — still OK to inject at EOF.
  const next = `${content.replace(/\s*$/, "")}${buildStampHelpers(fragment)}\n`;
  return { content: next, injected: true };
}

/**
 * @param {string} rootPath
 * @param {{ fragment?: string }} [options]
 */
async function stampGameFragment(rootPath, options = {}) {
  const fragment = String(options.fragment || "").trim();
  if (!fragment) {
    return { ok: false, details: "stampGameFragment: нужен fragment" };
  }

  const gameDir = path.join(rootPath, "Layouts", "Game");
  if (!(await safeStat(gameDir))) {
    return { ok: true, details: "Layouts/Game нет — пропуск" };
  }

  const files = await walkFiles(gameDir, { exts: CODE_EXTS });
  if (files.length === 0) {
    return { ok: true, details: "Layouts/Game пуст — пропуск" };
  }

  if (gameAlreadyHasFragment(files, fragment)) {
    // Still ensure helpers exist for split.
    let injected = 0;
    for (const file of files) {
      const base = path.basename(file, path.extname(file));
      if (SKIP_BASENAME.test(base) || /Part\d+$/.test(base)) continue;
      let raw = await fs.readFile(file, "utf8");
      const result = ensureStampHelpers(raw, fragment);
      if (result.injected) {
        await fs.writeFile(file, result.content, "utf8");
        injected += 1;
      }
    }
    return {
      ok: true,
      details:
        `Layouts/Game уже с фрагментом «${fragment}»` +
        (injected ? `; +helpers в ${injected} файл(ах)` : ""),
      renamed: 0,
      injected,
    };
  }

  /** @type {Map<string, string>} oldBase → newBase */
  const renameMap = new Map();
  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (SKIP_BASENAME.test(base) || /Part\d+$/.test(base)) continue;
    const next = insertFragmentInBasename(base, fragment, String(options.salt || ""));
    if (next !== base) renameMap.set(base, next);
  }

  if (renameMap.size === 0) {
    return { ok: true, details: "нечего штамповать в Layouts/Game" };
  }

  // Longest first — avoid partial identifier collisions.
  const pairs = [...renameMap.entries()].sort((a, b) => b[0].length - a[0].length);

  const rewriteTargets = new Set(files);
  const appTsx = path.join(rootPath, "App.tsx");
  if (await safeStat(appTsx)) rewriteTargets.add(appTsx);

  let rewritten = 0;
  let injected = 0;
  for (const file of rewriteTargets) {
    let raw = await fs.readFile(file, "utf8");
    const before = raw;
    for (const [from, to] of pairs) {
      raw = replaceIdentifierAndVariants(raw, from, to, fragment);
    }
    const inGame = file.replace(/\\/g, "/").includes("/Layouts/Game/");
    if (inGame) {
      const base = path.basename(file, path.extname(file));
      if (!SKIP_BASENAME.test(base) && !/Part\d+$/.test(base)) {
        const helperFrag = renameMap.get(base)
          ? fragment
          : fragment;
        // Helpers use live fragment; after rename file may still be old path until fs.rename.
        const ensured = ensureStampHelpers(raw, helperFrag);
        raw = ensured.content;
        if (ensured.injected) injected += 1;
      }
    }
    if (raw !== before) {
      await fs.writeFile(file, raw, "utf8");
      rewritten += 1;
    }
  }

  // Rename files deepest-first (stable on Windows).
  const renameJobs = files
    .map((file) => {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const nextBase = renameMap.get(base);
      if (!nextBase) return null;
      return { from: file, to: path.join(path.dirname(file), `${nextBase}${ext}`) };
    })
    .filter(Boolean)
    .sort((a, b) => b.from.length - a.from.length);

  let renamed = 0;
  for (const job of renameJobs) {
    if (job.from === job.to) continue;
    if (await safeStat(job.to)) {
      throw new Error(
        `stampGameFragment: цель уже есть ${path.relative(rootPath, job.to)}`
      );
    }
    await fs.rename(job.from, job.to);
    renamed += 1;
  }

  return {
    ok: true,
    details:
      `Layouts/Game: штамп «${fragment}» → rename ${renamed}, rewrite ${rewritten}, helpers ${injected}`,
    renamed,
    rewritten,
    injected,
  };
}

module.exports = {
  stampGameFragment,
  insertFragmentInBasename,
  gameAlreadyHasFragment,
  STAMP_MARKER,
};
