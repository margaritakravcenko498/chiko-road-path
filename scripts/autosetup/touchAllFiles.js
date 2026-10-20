/**
 * Recreate source files so creation timestamps change (Windows keeps
 * birthtime on in-place writeFile).
 *
 * On Windows, IDE / Gradle / AV often lock a file (EBUSY). Retry, then skip
 * that file instead of aborting the whole autosetup.
 */
const fs = require("node:fs/promises");
const path = require("node:path");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".expo",
  ".idea",
  ".vscode",
  "dist",
  ".gradle",
  "build",
  androidBuildLike("android"),
]);

function androidBuildLike() {
  return "build";
}

const SKIP_EXT = new Set([
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
  ".so",
  ".dex",
]);

const SKIP_NAMES = new Set([
  "gradle-wrapper.properties",
  "gradle-wrapper.jar",
]);

function isLockError(err) {
  const code = err && err.code;
  return code === "EBUSY" || code === "EPERM" || code === "EACCES";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryLock(fn, attempts = 8) {
  let last;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (!isLockError(err) && err.code !== "EEXIST") throw err;
      await sleep(Math.min(1000, 40 * 2 ** i));
    }
  }
  throw last;
}

async function collect(rootDir) {
  const files = [];
  async function walk(current) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name.endsWith(".touchtmp")) {
        await fs.unlink(full).catch(() => {});
        continue;
      }
      if (SKIP_NAMES.has(entry.name)) continue;
      if (SKIP_EXT.has(path.extname(full).toLowerCase())) continue;
      files.push(full);
    }
  }
  await walk(rootDir);
  return files;
}

async function recreateFile(filePath) {
  let buf;
  try {
    buf = await fs.readFile(filePath);
  } catch {
    return "skip-read";
  }
  const tmp = `${filePath}.${process.pid}.touchtmp`;
  try {
    await fs.writeFile(tmp, buf);
    await retryLock(() => fs.unlink(filePath));
    try {
      await retryLock(() => fs.rename(tmp, filePath));
    } catch (err) {
      if (err.code === "EEXIST" || isLockError(err)) {
        await retryLock(() => fs.unlink(filePath)).catch(() => {});
        await retryLock(() => fs.rename(tmp, filePath));
      } else {
        throw err;
      }
    }
    return "ok";
  } catch (err) {
    await fs.unlink(tmp).catch(() => {});
    if (isLockError(err)) return "skip-busy";
    throw err;
  }
}

async function touchAllFiles(rootPath) {
  const files = await collect(rootPath);
  let recreated = 0;
  let skippedBusy = 0;
  for (const filePath of files) {
    const status = await recreateFile(filePath);
    if (status === "ok") recreated += 1;
    else if (status === "skip-busy") skippedBusy += 1;
  }
  const details =
    `recreated ${recreated} files` +
    (skippedBusy ? `; skipped locked ${skippedBusy}` : "");
  return {
    ok: true,
    details,
  };
}

module.exports = { touchAllFiles };
