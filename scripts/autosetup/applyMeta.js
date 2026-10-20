const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { loadProjectCrypto } = require("./rotateEncryption");

function replaceOne(source, regex, replacement) {
  return regex.test(source) ? source.replace(regex, replacement) : source;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeSingleQuotedTs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getFileMap(rootPath) {
  return {
    gradle: path.join(rootPath, "android", "app", "build.gradle"),
    manifest: path.join(rootPath, "android", "app", "src", "main", "AndroidManifest.xml"),
    appJson: path.join(rootPath, "app.json"),
    stringsXml: path.join(
      rootPath,
      "android",
      "app",
      "src",
      "main",
      "res",
      "values",
      "strings.xml"
    ),
    constantsDir: path.join(rootPath, "services", "constants"),
  };
}

async function detectFragmentFromConstants(rootPath) {
  const dir = path.join(rootPath, "services", "constants");
  if (!(await safeStat(dir))) return "";
  const entries = await fs.readdir(dir);
  for (const name of entries) {
    const m = name.match(/^const([a-zA-Z0-9]+)ntsVariable\.ts$/);
    if (m) return m[1];
  }
  return "";
}

async function applyAppName(rootPath, appName) {
  const files = getFileMap(rootPath);
  const updated = [];

  const appJsonRaw = await fs.readFile(files.appJson, "utf8");
  let appJsonNext = appJsonRaw;
  try {
    const parsed = JSON.parse(appJsonRaw);
    parsed.displayName = appName;
    appJsonNext = `${JSON.stringify(parsed, null, 2)}\n`;
  } catch {
    appJsonNext = replaceOne(
      appJsonRaw,
      /"displayName"\s*:\s*"[^"]*"/,
      `"displayName": "${String(appName).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
    );
  }
  if (appJsonNext !== appJsonRaw) {
    await fs.writeFile(files.appJson, appJsonNext, "utf8");
    updated.push("app.json");
  }

  const stringsRaw = await fs.readFile(files.stringsXml, "utf8");
  const stringsNext = replaceOne(
    stringsRaw,
    /<string\s+name="app_name">[\s\S]*?<\/string>/,
    `<string name="app_name">${escapeXml(appName)}</string>`
  );
  if (stringsNext !== stringsRaw) {
    await fs.writeFile(files.stringsXml, stringsNext, "utf8");
    updated.push("strings.xml");
  }

  return { ok: updated.length > 0, details: updated.join(", ") || "без изменений" };
}

async function applyPackageName(rootPath, packageName) {
  const files = getFileMap(rootPath);
  const updated = [];

  const gradleRaw = await fs.readFile(files.gradle, "utf8");
  const gradleNext = replaceOne(
    gradleRaw,
    /applicationId\s+"[^"]+"/,
    `applicationId "${packageName}"`
  );
  if (gradleNext !== gradleRaw) {
    await fs.writeFile(files.gradle, gradleNext, "utf8");
    updated.push("applicationId");
  }

  if (await safeStat(files.manifest)) {
    const manifestRaw = await fs.readFile(files.manifest, "utf8");
    if (/android:taskAffinity=/.test(manifestRaw)) {
      const manifestNext = replaceOne(
        manifestRaw,
        /android:taskAffinity="[^"]+"/,
        `android:taskAffinity="${packageName}"`
      );
      if (manifestNext !== manifestRaw) {
        await fs.writeFile(files.manifest, manifestNext, "utf8");
        updated.push("taskAffinity");
      }
    }
  }

  return { ok: updated.length > 0, details: updated.join(", ") || "без изменений" };
}

async function applyVersionCode(rootPath, versionCode) {
  const files = getFileMap(rootPath);
  const raw = await fs.readFile(files.gradle, "utf8");
  const next = replaceOne(raw, /versionCode\s+\d+/, `versionCode ${versionCode}`);
  if (next === raw) return { ok: true, details: "без изменений" };
  await fs.writeFile(files.gradle, next, "utf8");
  return { ok: true, details: `versionCode ${versionCode}` };
}

async function applyVersionName(rootPath, versionName) {
  const files = getFileMap(rootPath);
  const raw = await fs.readFile(files.gradle, "utf8");
  const next = replaceOne(raw, /versionName\s+"[^"]+"/, `versionName "${versionName}"`);
  if (next === raw) return { ok: true, details: "без изменений" };
  await fs.writeFile(files.gradle, next, "utf8");
  return { ok: true, details: `versionName ${versionName}` };
}

/**
 * Encrypt Cloudflare Worker URL and write into li{fragment}nk
 * (same as RN App Helper «Из Jira» + «Применить»).
 */
async function applyCloudflareWorkerLink(
  rootPath,
  url,
  fragmentHint,
  encryptionMode,
  meta
) {
  const plainUrl = String(url || "").trim();
  if (!plainUrl) return { ok: true, details: "url пустой — пропуск" };

  const fragment = fragmentHint || (await detectFragmentFromConstants(rootPath));
  if (!fragment) {
    return { ok: false, details: "не найден текущий fragment для li*nk" };
  }

  const constantsPath = path.join(
    rootPath,
    "services",
    "constants",
    `const${fragment}ntsVariable.ts`
  );
  if (!(await safeStat(constantsPath))) {
    return { ok: false, details: `нет файла ${path.basename(constantsPath)}` };
  }

  let raw = await fs.readFile(constantsPath, "utf8");
  const constName = `li${fragment}nk`;
  if (!new RegExp(`export const ${escapeRegExp(constName)}\\s*=`).test(raw)) {
    raw = `${raw.replace(/\s*$/, "")}\n\nexport const ${constName} = '';\n`;
    await fs.writeFile(constantsPath, raw, "utf8");
  }

  const mode = String(
    encryptionMode || meta?.encryptionResolved || meta?.encryption || ""
  )
    .trim()
    .toLowerCase();
  if (!mode || mode === "auto" || mode === "detect") {
    return {
      ok: false,
      details: "не задан encryptionMode для шифрования Worker URL",
    };
  }

  const loaded = loadProjectCrypto(mode, meta, rootPath);
  if (!loaded.ok) {
    return { ok: false, details: loaded.details };
  }

  let credentials;
  if (mode === "colossus") {
    const { readProjectColossusCredentials } = require("./applyColossus");
    credentials = await readProjectColossusCredentials(rootPath);
  }

  let encrypted;
  try {
    encrypted = loaded.crypto.projectEncrypt(plainUrl, mode, credentials);
  } catch (err) {
    return {
      ok: false,
      details: `projectEncrypt failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (!encrypted) {
    return { ok: false, details: "projectEncrypt вернул пустое значение" };
  }

  const line = `export const ${constName} = '${escapeSingleQuotedTs(encrypted)}';`;
  const pattern = new RegExp(
    `export const ${escapeRegExp(constName)}\\s*=\\s*['"][^'"]*['"]\\s*;`
  );
  if (!pattern.test(raw)) {
    return { ok: false, details: `${constName} не найден (строка export)` };
  }

  const next = raw.replace(pattern, line);
  if (next !== raw) {
    await fs.writeFile(constantsPath, next, "utf8");
  }
  return {
    ok: true,
    details: `${constName} ← ${plainUrl} (${mode})`,
  };
}

/**
 * Apply appName / packageName / versions from meta.json.
 * Cloudflare Worker URL from Jira comments is encrypted into li{fragment}nk.
 */
async function applyMetaFields(rootPath, meta, options = {}) {
  const results = [];
  if (meta.appName != null && meta.appName !== "") {
    results.push(["appName", await applyAppName(rootPath, meta.appName)]);
  }
  if (meta.packageName) {
    results.push(["packageName", await applyPackageName(rootPath, meta.packageName)]);
  }
  if (meta.versionCode != null && meta.versionCode !== "") {
    results.push(["versionCode", await applyVersionCode(rootPath, meta.versionCode)]);
  }
  if (meta.versionName) {
    results.push(["versionName", await applyVersionName(rootPath, meta.versionName)]);
  }
  if (options.cloudflareWorkerUrl) {
    results.push([
      "cloudflareWorkerUrl",
      await applyCloudflareWorkerLink(
        rootPath,
        options.cloudflareWorkerUrl,
        await detectFragmentFromConstants(rootPath),
        options.encryptionMode,
        meta
      ),
    ]);
  }
  return results;
}

module.exports = {
  applyMetaFields,
  applyAppName,
  applyPackageName,
  applyVersionCode,
  applyVersionName,
  applyCloudflareWorkerLink,
  detectFragmentFromConstants,
};
