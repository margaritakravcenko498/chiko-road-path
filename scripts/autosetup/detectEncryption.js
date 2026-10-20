const fs = require("node:fs/promises");
const path = require("node:path");

async function safeStat(targetPath) {
  try {
    return await fs.stat(targetPath);
  } catch {
    return null;
  }
}

async function safeRead(targetPath) {
  try {
    return await fs.readFile(targetPath, "utf8");
  } catch {
    return null;
  }
}

function hasModuleImport(content, moduleName) {
  return (
    content.includes(`from './${moduleName}'`) ||
    content.includes(`from "./${moduleName}"`)
  );
}

/** Plain `xtea` or fragment form `xt{fragment}ea` (e.g. xtichyikowrdfpagthmsea). */
function hasXteaModuleImport(content) {
  if (hasModuleImport(content, "xtea")) return true;
  return /from\s*['"]\.\/xt[A-Za-z0-9]*ea['"]/.test(content);
}

/** Plain `typex` or fragment form `ty{fragment}pex` (e.g. tyichyikowrdfpagthmspex). */
function hasTypexModuleImport(content) {
  if (hasModuleImport(content, "typex")) return true;
  return /from\s*['"]\.\/ty[A-Za-z0-9]*pex['"]/.test(content);
}

/** Plain `colossus` or fragment form `co{fragment}lossus`. */
function hasColossusModuleImport(content) {
  if (hasModuleImport(content, "colossus")) return true;
  if (/cipher-id:colossus/.test(content)) return true;
  if (/\bCOLOSSUS_KEY_STRING\b/.test(content)) return true;
  return /from\s*['"]\.\/co[A-Za-z0-9]*lossus['"]/.test(content);
}

/**
 * Same logic as RN App Helper projectDetection.js:
 * looks at services/*Crypto*Service.ts / *toService.ts imports.
 * @returns {Promise<"gost" | "rc6" | "rc4" | "blowfish" | "tripledes" | "fernet" | "ascon" | "rot47" | "xtea" | "typex" | "colossus" | null>}
 */
async function detectProjectEncryptionMode(rootPath) {
  if (!rootPath) return null;

  const servicesDir = path.join(rootPath, "services");
  const stat = await safeStat(servicesDir);
  if (!stat?.isDirectory()) return null;

  const entries = await fs.readdir(servicesDir);
  for (const name of entries) {
    if (!name.endsWith(".ts") && !name.endsWith(".js")) continue;
    if (!/Crypto.+Service\.ts$/i.test(name) && !/toService\.ts$/i.test(name)) continue;

    const content = await safeRead(path.join(servicesDir, name));
    if (!content) continue;

    // order matters: more specific names first (typex/xtea before generic stems)
    if (hasColossusModuleImport(content)) return "colossus";
    if (hasTypexModuleImport(content)) return "typex";
    if (hasXteaModuleImport(content)) return "xtea";
    if (hasModuleImport(content, "ascon")) return "ascon";
    if (hasModuleImport(content, "rot47")) return "rot47";
    if (hasModuleImport(content, "fernet")) return "fernet";
    if (hasModuleImport(content, "tripledes")) return "tripledes";
    if (hasModuleImport(content, "blowfish")) return "blowfish";
    if (hasModuleImport(content, "rc6")) return "rc6";
    if (hasModuleImport(content, "rc4")) return "rc4";
    if (hasModuleImport(content, "gost")) return "gost";
  }

  return null;
}

const HELPER_BY_MODE = {
  rc4: "RN App Helper (RC4)",
  rc6: "RN App Helper (RC6)",
  gost: "RN App Helper (GOST)",
  blowfish: "RN App Helper (Blowfish)",
  tripledes: "RN App Helper (TripleDES)",
  fernet: "RN App Helper (Fernet)",
  ascon: "RN App Helper (Ascon)",
  rot47: "RN App Helper (ROT47)",
  xtea: "RN App Helper (XTEA)",
  typex: "RN App Helper (Typex)",
  colossus: "RN App Helper (Colossus)",
};

function helperNameForMode(mode) {
  return HELPER_BY_MODE[mode] || "RN App Helper (?)";
}

module.exports = {
  detectProjectEncryptionMode,
  helperNameForMode,
};
