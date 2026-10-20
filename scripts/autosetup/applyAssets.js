const fs = require("node:fs/promises");
const path = require("node:path");
const {
  safeStat,
  ensureDir,
  rmrf,
  emptyDir,
  copyFile,
  copyDir,
  extractArchive,
  withTempDir,
  findFirstFile,
} = require("./fsUtils");

function parseKeystoreProperties(text) {
  const map = {};
  for (const line of String(text).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    map[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return map;
}

async function patchGradleProperties(gradlePropertiesPath, { alias, storePassword, keyPassword }) {
  let content = await fs.readFile(gradlePropertiesPath, "utf8");
  const setProp = (key, value) => {
    const re = new RegExp(`^${key}=.*$`, "m");
    if (re.test(content)) {
      content = content.replace(re, `${key}=${value}`);
    } else {
      content = `${content.replace(/\s*$/, "")}\n${key}=${value}\n`;
    }
  };
  setProp("MYAPP_RELEASE_STORE_FILE", "keystore.keystore");
  setProp("MYAPP_RELEASE_KEY_ALIAS", alias);
  setProp("MYAPP_RELEASE_STORE_PASSWORD", storePassword);
  setProp("MYAPP_RELEASE_KEY_PASSWORD", keyPassword || storePassword);
  await fs.writeFile(gradlePropertiesPath, content, "utf8");
}

async function applyIcons(rootPath, iconsZip) {
  const resDir = path.join(rootPath, "android", "app", "src", "main", "res");
  await withTempDir("autosetup-icons", async (tmp) => {
    extractArchive(iconsZip, tmp);
    const androidDir = path.join(tmp, "android");
    const source = (await safeStat(androidDir)) ? androidDir : tmp;
    await copyDir(source, resDir, { skipDirNames: ["values"] });
  });
  return { ok: true, details: `Icons → ${path.relative(rootPath, resDir)} (без values)` };
}

async function applyKeystore(rootPath, keystoreTar) {
  const appDir = path.join(rootPath, "android", "app");
  const destKeystore = path.join(appDir, "keystore.keystore");
  const gradleProperties = path.join(rootPath, "android", "gradle.properties");

  return withTempDir("autosetup-keystore", async (tmp) => {
    extractArchive(keystoreTar, tmp);
    const keystoreFile = await findFirstFile(tmp, (name) => /\.keystore$/i.test(name));
    const propsFile = await findFirstFile(tmp, (name) => /\.properties$/i.test(name));
    if (!keystoreFile) throw new Error("В tar.gz нет .keystore");
    if (!propsFile) throw new Error("В tar.gz нет .properties");

    const props = parseKeystoreProperties(await fs.readFile(propsFile, "utf8"));
    const alias = props.keyAlias || props.KEY_ALIAS;
    const storePassword = props.storePassword || props.STORE_PASSWORD;
    const keyPassword = props.keyPassword || props.KEY_PASSWORD || storePassword;
    if (!alias || !storePassword) {
      throw new Error("В .properties нет keyAlias/storePassword");
    }

    await copyFile(keystoreFile, destKeystore);
    await patchGradleProperties(gradleProperties, { alias, storePassword, keyPassword });
    return {
      ok: true,
      details: `keystore.keystore + gradle.properties (alias=${alias})`,
    };
  });
}

async function applyGoogleServices(rootPath, googleServicesPath) {
  const dest = path.join(rootPath, "android", "app", "google-services.json");
  await copyFile(googleServicesPath, dest);
  return { ok: true, details: `google-services.json → android/app/` };
}

/**
 * Rewrite standalone App.tsx into Layouts/Game/GameInit.tsx.
 */
function rewriteGameInitContent(appTsx) {
  let next = String(appTsx);
  next = next.replace(/(from\s+['"])\.\/src\//g, "$1./");
  next = next.replace(/(require\s*\(\s*['"])\.\/src\//g, "$1./");
  return next;
}

/**
 * From Layouts/Game/assets, root assets are ../../../assets (not ../../assets).
 * Supports both require('…') and import … from '…'.
 */
function fixGameAssetsRequires(content) {
  return String(content)
    .replace(
      /require\(\s*(['"])\.\.\/\.\.\/assets\//g,
      "require($1../../../assets/"
    )
    .replace(
      /(from\s+)(['"])\.\.\/\.\.\/assets\//g,
      "$1$2../../../assets/"
    );
}

async function clearGameKeepInit(gameDir) {
  const entries = await fs.readdir(gameDir, { withFileTypes: true });
  for (const entry of entries) {
    // Keep plain or already-stamped GameInit host.
    if (/^Game([A-Za-z0-9]+)?Init\.tsx$/i.test(entry.name)) continue;
    await rmrf(path.join(gameDir, entry.name));
  }
}

async function applyGame(rootPath, sourceZip) {
  const gameDir = path.join(rootPath, "Layouts", "Game");
  const rootAssets = path.join(rootPath, "assets");
  await ensureDir(gameDir);

  return withTempDir("autosetup-source", async (tmp) => {
    extractArchive(sourceZip, tmp);

    const archiveAssets = path.join(tmp, "assets");
    const archiveSrc = path.join(tmp, "src");
    const archiveApp = path.join(tmp, "App.tsx");

    if (!(await safeStat(archiveAssets))) {
      throw new Error("В *_source нет папки assets/");
    }
    if (!(await safeStat(archiveSrc))) {
      throw new Error("В *_source нет папки src/");
    }
    if (!(await safeStat(archiveApp))) {
      throw new Error("В *_source нет App.tsx");
    }

    await emptyDir(rootAssets);
    await copyDir(archiveAssets, rootAssets);

    await clearGameKeepInit(gameDir);
    await copyDir(archiveSrc, gameDir);

    const assetsIndex = path.join(gameDir, "assets", "index.ts");
    if (await safeStat(assetsIndex)) {
      const raw = await fs.readFile(assetsIndex, "utf8");
      await fs.writeFile(assetsIndex, fixGameAssetsRequires(raw), "utf8");
    }

    const appRaw = await fs.readFile(archiveApp, "utf8");
    await fs.writeFile(
      path.join(gameDir, "GameInit.tsx"),
      rewriteGameInitContent(appRaw),
      "utf8"
    );

    return {
      ok: true,
      details: "assets/ заменены; Layouts/Game из src/; GameInit.tsx из App.tsx",
    };
  });
}

module.exports = {
  applyIcons,
  applyKeystore,
  applyGoogleServices,
  applyGame,
};
