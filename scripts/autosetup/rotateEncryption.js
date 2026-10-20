const fs = require("node:fs/promises");
const path = require("node:path");
const { safeStat } = require("./fsUtils");
const { collectWorkspaceFiles } = require("./replaceFragment");

const DEFAULT_HELPER_EXT =
  "E:\\TD\\CursorExtensions\\ReactNativeAppHelperExtension";
const DEFAULT_HELPER_ROOT = path.join(
  DEFAULT_HELPER_EXT,
  "vscode-rn-app-helper-root"
);

function resolveHelperRoot(meta, projectRoot) {
  const candidates = [];
  if (meta?.helperRoot) candidates.push(path.resolve(meta.helperRoot));
  candidates.push(DEFAULT_HELPER_ROOT);
  candidates.push(path.join(DEFAULT_HELPER_EXT));
  candidates.push(path.resolve(projectRoot, "..", "ReactNativeAppHelperExtension"));
  candidates.push(
    path.resolve(projectRoot, "..", "ReactNativeAppHelperExtension", "vscode-rn-app-helper-root")
  );
  return candidates;
}

/**
 * Prefer multi-algo root helper (vscode-rn-app-helper-root/projectCrypto.js).
 * Fall back to per-algo packages vscode-rn-app-helper-${algo}/projectCrypto.js.
 */
function candidateCryptoPaths(root, algo) {
  const paths = [];
  const base = path.basename(root).toLowerCase();
  // meta.helperRoot points directly at vscode-rn-app-helper-root
  paths.push(path.join(root, "projectCrypto.js"));
  // meta.helperRoot points at extension parent
  if (base !== "vscode-rn-app-helper-root") {
    paths.push(path.join(root, "vscode-rn-app-helper-root", "projectCrypto.js"));
    paths.push(path.join(root, `vscode-rn-app-helper-${algo}`, "projectCrypto.js"));
  }
  return paths;
}

function loadProjectCrypto(mode, meta, projectRoot) {
  const algo = String(mode || "rc4").toLowerCase();
  const errors = [];
  for (const root of resolveHelperRoot(meta, projectRoot)) {
    for (const cryptoPath of candidateCryptoPaths(root, algo)) {
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const mod = require(cryptoPath);
        return { ok: true, crypto: mod, helperRoot: root, cryptoPath };
      } catch (err) {
        errors.push(`${cryptoPath}: ${err.message}`);
      }
    }
  }
  return {
    ok: false,
    details:
      `Не найден projectCrypto для ${algo}. Укажи meta.helperRoot (vscode-rn-app-helper-root).\n` +
      errors.join("\n"),
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectConstantsNaming(constantsContent, fragment) {
  const naming = {
    linkConstName: `li${fragment}nk`,
    cruxDocKeyConstName: `CRUX_${fragment}_DOC_KEY`,
  };
  if (!constantsContent || !fragment) return naming;

  const linkMatch = constantsContent.match(
    new RegExp(`export const (li${escapeRegExp(fragment)}nk)\\s*=`)
  );
  if (linkMatch?.[1]) naming.linkConstName = linkMatch[1];

  const docKeyMatch = constantsContent.match(
    new RegExp(`export const (CRUX_${escapeRegExp(fragment)}_DOC_KEY)\\s*=`)
  );
  if (docKeyMatch?.[1]) naming.cruxDocKeyConstName = docKeyMatch[1];

  return naming;
}

function shouldSkipEncryptionRotationFile(filePath) {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  if (normalized.includes("/scripts/")) return true;
  if (normalized.endsWith("/projectcrypto.js")) return true;
  return false;
}

async function findAllFilesContainingSnippet(rootPath, snippet) {
  const filePaths = await collectWorkspaceFiles(rootPath);
  const matches = [];
  for (const filePath of filePaths) {
    if (shouldSkipEncryptionRotationFile(filePath)) continue;
    try {
      const content = await fs.readFile(filePath, "utf8");
      if (content.includes(snippet)) matches.push(filePath);
    } catch {
      // skip
    }
  }
  return matches;
}

/**
 * Prefer a real `const NAME = 'hex'` assignment, not a string mention in comments/scripts.
 */
async function findFileWithEncConst(rootPath, constName) {
  const assignRe = new RegExp(
    `(?:export\\s+)?const\\s+${escapeRegExp(constName)}\\s*=\\s*'[0-9A-Fa-f]+'`
  );
  const candidates = await findAllFilesContainingSnippet(rootPath, constName);
  for (const filePath of candidates) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      if (assignRe.test(content)) return filePath;
    } catch {
      // skip
    }
  }
  return null;
}

async function collectEncryptedArrayFilePaths(rootPath, crypto) {
  const snippets = [
    "UNSUPPORTED_DEVICES_ENCRYPTED",
    "FORBIDDEN_DEVICE_KEYWORDS_ENCRYPTED",
    "FORBIDDEN_GPU_KEYWORDS_ENCRYPTED",
  ];
  const paths = new Set();

  for (const snippet of snippets) {
    const matches = await findAllFilesContainingSnippet(rootPath, snippet);
    for (const filePath of matches) {
      if (shouldSkipEncryptionRotationFile(filePath)) continue;
      const content = await fs.readFile(filePath, "utf8");
      if (crypto.fileHasEncryptedConstArrays(content)) paths.add(filePath);
    }
  }

  const allFiles = await collectWorkspaceFiles(rootPath);
  for (const filePath of allFiles) {
    if (path.basename(filePath) !== "deviceBlockLists.generated.ts") continue;
    if (shouldSkipEncryptionRotationFile(filePath)) continue;
    const content = await fs.readFile(filePath, "utf8");
    if (crypto.fileIsDeviceBlockListsGenerated(filePath, content)) {
      paths.add(filePath);
    }
  }

  return [...paths];
}

async function resolveConstantsPath(rootPath, fragment) {
  const expected = `const${fragment}ntsVariable.ts`;
  const dirs = [
    path.join(rootPath, "services", "constants"),
    path.join(rootPath, "constants"),
  ];
  for (const dir of dirs) {
    const full = path.join(dir, expected);
    if (await safeStat(full)) return full;
  }
  return null;
}

/**
 * Same as RN App Helper «Обновить шифрование».
 * Deterministic ciphers (typex, fernet, …) may verify without rewriting hex —
 * that still counts as success when at least one value decrypts cleanly.
 */
async function rotateProjectEncryption(rootPath, { mode, fragment, meta }) {
  const loaded = loadProjectCrypto(mode, meta, rootPath);
  if (!loaded.ok) return { ok: false, details: loaded.details };

  const crypto = loaded.crypto;
  let credentials = undefined;
  if (String(mode).toLowerCase() === "colossus") {
    try {
      const { readProjectColossusCredentials } = require("./applyColossus");
      credentials = await readProjectColossusCredentials(rootPath);
    } catch {
      credentials = undefined;
    }
  }
  const updated = [];
  const warnings = [];
  let totalRotated = 0;
  let totalChecked = 0;
  let decryptErrors = 0;
  let filesChanged = 0;

  const encryptedArrayPaths = await collectEncryptedArrayFilePaths(rootPath, crypto);
  const sharedInitPath = await findFileWithEncConst(
    rootPath,
    "FACEBOOK_REFERRER_HOST_ENC"
  );
  const webViewPath = await findFileWithEncConst(rootPath, "DIIA_APP_HOST_ENC");

  for (const targetPath of encryptedArrayPaths) {
    const content = await fs.readFile(targetPath, "utf8");
    const result = crypto.rotateInitFlowEncryptedConstants(content, mode, credentials);
    totalChecked += result.count || 0;
    decryptErrors += result.errors?.length || 0;
    if (result.changed) {
      await fs.writeFile(targetPath, result.content, "utf8");
      filesChanged += 1;
      totalRotated += result.count;
      updated.push(`${path.relative(rootPath, targetPath)} (${result.count})`);
    } else if (result.count > 0) {
      updated.push(
        `${path.relative(rootPath, targetPath)} (проверено ${result.count}, без изменений)`
      );
    }
    if (result.errors?.length) {
      warnings.push(`${path.basename(targetPath)} decrypt errors: ${result.errors.join(", ")}`);
    }
  }

  if (sharedInitPath) {
    const content = await fs.readFile(sharedInitPath, "utf8");
    const result = crypto.rotateEncStringConstants(content, mode, credentials);
    totalChecked += result.count || 0;
    decryptErrors += result.errors?.length || 0;
    if (result.changed) {
      await fs.writeFile(sharedInitPath, result.content, "utf8");
      filesChanged += 1;
      totalRotated += result.count;
      updated.push(`${path.relative(rootPath, sharedInitPath)} (${result.count})`);
    } else if (result.count > 0) {
      updated.push(
        `${path.relative(rootPath, sharedInitPath)} (проверено ${result.count}, без изменений)`
      );
    }
    if (result.errors?.length) {
      warnings.push(`sharedInit decrypt errors: ${result.errors.join(", ")}`);
    }
  } else {
    warnings.push("FACEBOOK_REFERRER_HOST_ENC не найден (опционально)");
  }

  if (webViewPath) {
    const content = await fs.readFile(webViewPath, "utf8");
    const result = crypto.rotateWebViewEncConstants(content, mode, credentials);
    totalChecked += result.count || 0;
    decryptErrors += result.errors?.length || 0;
    if (result.changed) {
      await fs.writeFile(webViewPath, result.content, "utf8");
      filesChanged += 1;
      totalRotated += result.count;
      updated.push(`${path.relative(rootPath, webViewPath)} (${result.count})`);
    } else if (result.count > 0) {
      updated.push(
        `${path.relative(rootPath, webViewPath)} (проверено ${result.count}, без изменений)`
      );
    }
    if (result.errors?.length) {
      warnings.push(`WebView decrypt errors: ${result.errors.join(", ")}`);
    }
  } else {
    warnings.push("DIIA_APP_HOST_ENC не найден (опционально)");
  }

  const frag = String(fragment || "").trim();
  let hasLinkOrCrux = false;
  if (frag) {
    const constantsPath = await resolveConstantsPath(rootPath, frag);
    if (!constantsPath) {
      warnings.push(`const${frag}ntsVariable.ts не найден`);
    } else {
      let constantsContent = await fs.readFile(constantsPath, "utf8");
      const naming = detectConstantsNaming(constantsContent, frag);

      // Legacy local encrypted worker URL const (optional after Crux migration).
      if (
        new RegExp(`export const ${escapeRegExp(naming.linkConstName)}\\s*=`).test(
          constantsContent
        )
      ) {
        const result = crypto.rotateLinkConstInConstants(
          constantsContent,
          naming.linkConstName,
          mode,
          credentials
        );
        totalChecked += result.count || 0;
        // Const is present. A stale hex (encrypted before the colossus seed
        // rotation) is a warning: run.js rewrites it from the Jira URL.
        // Do not abort the rest of autosetup on this alone.
        hasLinkOrCrux = true;
        if (result.changed) {
          constantsContent = result.content;
          await fs.writeFile(constantsPath, constantsContent, "utf8");
          filesChanged += 1;
          totalRotated += result.count;
          updated.push(
            `${path.relative(rootPath, constantsPath)} → ${naming.linkConstName}`
          );
        } else if (result.count > 0) {
          updated.push(
            `${path.relative(rootPath, constantsPath)} → ${naming.linkConstName} (проверено, без изменений)`
          );
        }
        if (result.errors?.length) {
          warnings.push(`link const errors: ${result.errors.join(", ")}`);
        }
      }

      // Crux document key (encrypted "link") — CRUX_{fragment}_DOC_KEY
      if (
        new RegExp(
          `export const ${escapeRegExp(naming.cruxDocKeyConstName)}\\s*=`
        ).test(constantsContent)
      ) {
        const result = crypto.rotateLinkConstInConstants(
          constantsContent,
          naming.cruxDocKeyConstName,
          mode,
          credentials
        );
        totalChecked += result.count || 0;
        decryptErrors += result.errors?.length || 0;
        if (result.count > 0) hasLinkOrCrux = true;
        if (result.changed) {
          constantsContent = result.content;
          await fs.writeFile(constantsPath, constantsContent, "utf8");
          filesChanged += 1;
          totalRotated += result.count;
          updated.push(
            `${path.relative(rootPath, constantsPath)} → ${naming.cruxDocKeyConstName}`
          );
        } else if (result.count > 0) {
          updated.push(
            `${path.relative(rootPath, constantsPath)} → ${naming.cruxDocKeyConstName} (проверено, без изменений)`
          );
        }
        if (result.errors?.length) {
          warnings.push(`CRUX DOC_KEY errors: ${result.errors.join(", ")}`);
        }
      } else if (!hasLinkOrCrux) {
        warnings.push(`li${frag}nk / CRUX DOC_KEY не найдены`);
      }
    }
  }

  if (filesChanged === 0) {
    if (decryptErrors === 0) {
      return {
        ok: true,
        details:
          `проверено ${totalChecked} values / ${updated.length} files (${String(mode).toUpperCase()}, без изменений)` +
          (warnings.length ? `; warn: ${warnings.join("; ")}` : ""),
      };
    }
    return {
      ok: false,
      details:
        `Шифрование не обновлено (${String(mode).toUpperCase()}). ` +
        (updated.length ? `Проверено: ${updated.join("; ")}. ` : "") +
        (warnings.length ? warnings.join("; ") : "Нет подходящих *_ENC / arrays"),
    };
  }

  return {
    ok: true,
    details:
      `${totalRotated} values / ${filesChanged} files via ${loaded.helperRoot}` +
      (warnings.length ? `; warn: ${warnings.join("; ")}` : ""),
  };
}

module.exports = {
  rotateProjectEncryption,
  loadProjectCrypto,
  DEFAULT_HELPER_ROOT,
};
