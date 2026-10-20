const path = require("node:path");

/**
 * Folder title before " (digits..." → lowercase alphanumeric slug.
 * "AutoSetupProject (0763 v8 rmsBV)" → "autosetupproject"
 * "Pulse Road (2999 v8 rmsBV)" → "pulseroad"
 */
function folderSlugFromRoot(rootPath) {
  const base = path.basename(rootPath);
  const title = base.replace(/\s*\(\d+[\s\S]*$/, "").trim();
  return title.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Keep all base letters in order, insert random a-z letters between them.
 */
function mixFragment(baseSlug, opts = {}) {
  const base = String(baseSlug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base) {
    throw new Error("Cannot build fragment: empty folder slug");
  }

  const minInserts = opts.minInserts ?? 4;
  const maxInserts = opts.maxInserts ?? 8;
  const inserts =
    minInserts + Math.floor(Math.random() * (maxInserts - minInserts + 1));

  const chars = base.split("");
  for (let n = 0; n < inserts; n++) {
    const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const at = Math.floor(Math.random() * (chars.length + 1));
    chars.splice(at, 0, letter);
  }
  return chars.join("");
}

function suggestFragment(rootPath) {
  return mixFragment(folderSlugFromRoot(rootPath));
}

module.exports = {
  folderSlugFromRoot,
  mixFragment,
  suggestFragment,
};
