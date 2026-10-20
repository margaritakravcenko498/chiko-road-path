/**
 * Repairs two autosetup/obfuscation drifts that survive a green path check:
 * 1. Fragment inserted into an Animated / React Native member (.current.stop,
 *    addListener's { value }).
 * 2. Two Part files in one directory declaring the same object or class.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");

const PLATFORM_METHODS = new Set([
  "stop",
  "start",
  "reset",
  "setValue",
  "setOffset",
  "flattenOffset",
  "extractOffset",
  "addListener",
  "removeListener",
  "removeAllListeners",
  "interpolate",
  "stopAnimation",
]);

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripFragment(token, fragment) {
  return String(token).split(fragment).join("");
}

async function walkCode(dir, out = []) {
  const stat = await safeStat(dir);
  if (!stat) return out;
  if (stat.isFile()) {
    if (CODE_EXT.has(path.extname(dir))) out.push(dir);
    return out;
  }
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "build") continue;
      await walkCode(full, out);
    } else if (entry.isFile() && CODE_EXT.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function repairPlatformText(content, fragment) {
  if (!fragment || !content.includes(fragment)) return { content, fixes: 0 };
  const frag = escapeRegExp(fragment);
  let fixes = 0;
  let next = content.replace(
    new RegExp(`\\.current\\??\\.([A-Za-z_]\\w*${frag}\\w*)(?=\\s*\\()`, "g"),
    (full, name) => {
      const stem = stripFragment(name, fragment);
      if (!PLATFORM_METHODS.has(stem)) return full;
      fixes += 1;
      return full.replace(name, stem);
    }
  );
  next = next.replace(
    new RegExp(
      `addListener\\(\\(\\s*\\{\\s*(?!value\\s*:)([A-Za-z_]\\w*${frag}\\w*)\\s*\\}`,
      "g"
    ),
    (full, name) => {
      if (stripFragment(name, fragment) !== "value") return full;
      fixes += 1;
      return full.replace(`{ ${name}`, `{ value: ${name}`).replace(`{${name}`, `{ value: ${name}`);
    }
  );
  return { content: next, fixes };
}

function declaredTypeNames(text) {
  const names = [];
  const re = /\b(?:object|class|interface)\s+([A-Za-z_]\w*)/g;
  let m;
  while ((m = re.exec(text))) names.push(m[1]);
  return names;
}

function functionNames(text) {
  const names = new Set();
  const re = /\b(?:fun|function)\s+([A-Za-z_]\w*)/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return names;
}

async function dedupePartTypes(rootPath) {
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const removed = [];
  if (!(await safeStat(javaRoot))) return removed;

  /** @type {Map<string, string[]>} */
  const byDir = new Map();
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "build") continue;
        await walk(full);
        continue;
      }
      if (!/Part\d+\.(kt|java)$/.test(entry.name)) continue;
      const key = dir;
      if (!byDir.has(key)) byDir.set(key, []);
      byDir.get(key).push(full);
    }
  }
  await walk(javaRoot);

  for (const files of byDir.values()) {
    /** @type {Map<string, { file: string, text: string, fns: Set<string> }[]>} */
    const groups = new Map();
    for (const file of files) {
      const text = await fs.readFile(file, "utf8");
      const base = path.basename(file, path.extname(file));
      for (const name of declaredTypeNames(text)) {
        if (name !== base && !files.some((f) => path.basename(f, path.extname(f)) === name)) {
          continue;
        }
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push({ file, text, fns: functionNames(text) });
      }
    }
    for (const [typeName, decls] of groups) {
      if (decls.length < 2) continue;
      const keeper = decls.find(
        (d) => path.basename(d.file, path.extname(d.file)) === typeName
      );
      if (!keeper) continue;
      for (const other of decls) {
        if (other.file === keeper.file) continue;
        let subset = true;
        for (const fn of other.fns) {
          if (!keeper.fns.has(fn)) {
            subset = false;
            break;
          }
        }
        if (!subset || other.fns.size === 0) continue;
        await fs.unlink(other.file);
        removed.push(path.relative(rootPath, other.file).replace(/\\/g, "/"));
      }
    }
  }
  return removed;
}

/**
 * @param {string} rootPath
 * @param {{ fragment?: string }} [options]
 */
async function repairObfDrift(rootPath, options = {}) {
  const fragment = String(options.fragment || "").trim();
  const roots = [
    path.join(rootPath, "Layouts", "Game"),
    path.join(rootPath, "services"),
  ];
  let fixes = 0;
  let files = 0;
  if (fragment) {
    for (const root of roots) {
      for (const file of await walkCode(root)) {
        const raw = await fs.readFile(file, "utf8");
        const result = repairPlatformText(raw, fragment);
        if (result.fixes === 0) continue;
        await fs.writeFile(file, result.content, "utf8");
        fixes += result.fixes;
        files += 1;
      }
    }
  }
  const removed = await dedupePartTypes(rootPath);
  return {
    ok: true,
    details:
      `repair: platform ${fixes} in ${files} file(s)` +
      (removed.length ? `; dropped duplicate parts ${removed.join(", ")}` : ""),
    fixes,
    files,
    removed,
  };
}

module.exports = {
  repairObfDrift,
  repairPlatformText,
  PLATFORM_METHODS,
};
