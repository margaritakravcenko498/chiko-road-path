/**
 * Switch the project to Colossus (Lorenz-inspired) and rotate the seed so
 * this app's worker script cannot decrypt another app's payload.
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomSeedString } = require("./rng");
const { detectFragmentFromConstants } = require("./applyMeta");
const { collectWorkspaceFiles } = require("./replaceFragment");
const { loadProjectCrypto } = require("./rotateEncryption");
const { detectProjectEncryptionMode } = require("./detectEncryption");
const { safeStat } = require("./fsUtils");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function workerBytesToHexImpl() {
  return `function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}`;
}

function kotlinQuote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\$/g, "\\$")}"`;
}

function renderTsModule(frag, stem) {
  const className = `C${frag}Cipher`;
  return `/* cipher-id:colossus */
import { NativeModules } from 'react-native';

const cipher = NativeModules.${className};

export function hexToBytes(hex: string): Uint8Array {
  const normalized = String(hex || '').trim();
  const out = new Uint8Array(Math.floor(normalized.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

export function ${stem}EncryptBytes(data: Uint8Array): Uint8Array {
  const hex = String(cipher?.transformHex(bytesToHex(data)) ?? '');
  return hexToBytes(hex);
}

export function ${stem}DecryptBytes(data: Uint8Array): Uint8Array {
  return ${stem}EncryptBytes(data);
}

export function ${stem}EncryptHex(plain: string): string {
  try {
    return String(cipher.encryptHex(String(plain ?? '')) ?? '');
  } catch {
    return '';
  }
}

export function ${stem}DecryptHex(hex: string): string {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) return '';
    return String(cipher.decryptHex(normalized) ?? '');
  } catch {
    return '';
  }
}
`;
}

function renderWorkerInline(key, iv) {
  return `/* ============================= */
/* Colossus (Lorenz-inspired)    */
/* https://en.wikipedia.org/wiki/Colossus_computer */
/* ============================= */

const COLOSSUS_KEY_STRING = "${key}";
const COLOSSUS_IV_STRING = "${iv}";
const COLOSSUS_KEY_BYTES = new TextEncoder().encode(COLOSSUS_KEY_STRING);
const COLOSSUS_IV_BYTES = new TextEncoder().encode(COLOSSUS_IV_STRING);

const CHI_LENS = [41, 31, 29, 26, 23, 43, 47, 37];
const PSI_LENS = [43, 47, 51, 53, 59, 61, 67, 71];
const MU_LENS = [61, 37];

function seedState(keyBytes) {
  let s = 2166136261;
  const bytes = keyBytes instanceof Uint8Array ? keyBytes : new Uint8Array(keyBytes || []);
  for (let i = 0; i < bytes.length; i++) {
    s ^= bytes[i];
    s = Math.imul(s, 16777619);
  }
  if (bytes.length === 0) s ^= 0xa5a5a5a5;
  return s >>> 0;
}

function nextU32(state) {
  let x = state[0] >>> 0;
  x ^= x << 13;
  x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;
  x >>>= 0;
  state[0] = x;
  return x;
}

function fillWheel(st, len) {
  const pins = new Uint8Array(len);
  let ones = 0;
  for (let i = 0; i < len; i++) {
    pins[i] = nextU32(st) & 1;
    ones += pins[i];
  }
  if (ones === 0) pins[0] = 1;
  if (ones === len) pins[0] = 0;
  const pos = nextU32(st) % len;
  return { pins, pos, len };
}

function colossusTransform(data, keyBytes) {
  const src = data instanceof Uint8Array ? data : new Uint8Array(data || []);
  const st = [seedState(keyBytes)];
  const chi = CHI_LENS.map((len) => fillWheel(st, len));
  const psi = PSI_LENS.map((len) => fillWheel(st, len));
  const mu = MU_LENS.map((len) => fillWheel(st, len));
  const out = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) {
    let chiB = 0;
    let psiB = 0;
    for (let b = 0; b < 8; b++) {
      chiB |= chi[b].pins[chi[b].pos] << b;
      psiB |= psi[b].pins[psi[b].pos] << b;
    }
    out[i] = src[i] ^ chiB ^ psiB;
    for (let b = 0; b < 8; b++) {
      chi[b].pos = (chi[b].pos + 1) % chi[b].len;
    }
    const mu0 = mu[0].pins[mu[0].pos];
    mu[0].pos = (mu[0].pos + 1) % mu[0].len;
    if (mu0) {
      mu[1].pos = (mu[1].pos + 1) % mu[1].len;
    }
    if (mu[1].pins[mu[1].pos]) {
      for (let b = 0; b < 8; b++) {
        psi[b].pos = (psi[b].pos + 1) % psi[b].len;
      }
    }
  }
  return out;
}

function encryptBytes(data, key = COLOSSUS_KEY_BYTES) {
  return colossusTransform(data, key);
}

function decryptBytes(data, key = COLOSSUS_KEY_BYTES, _legacyIv = COLOSSUS_IV_BYTES) {
  return colossusTransform(data, key);
}

${workerBytesToHexImpl()}

function encryptHex(plain, key = COLOSSUS_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function colossusDecrypt(buffer) {
  return decryptBytes(buffer, COLOSSUS_KEY_BYTES, COLOSSUS_IV_BYTES);
}

function colossusEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, COLOSSUS_KEY_BYTES);
}

function typexDecrypt(buffer) {
  return colossusDecrypt(buffer);
}

function typexEncryptToHex(jsonStr) {
  return colossusEncryptToHex(jsonStr);
}
`;
}

function parseKeyPair(content) {
  const key =
    content.match(/export const COLOSSUS_KEY_STRING = '([^']*)';/)?.[1] ||
    content.match(/const COLOSSUS_KEY_STRING = ["']([^"']*)["']/)?.[1] ||
    content.match(/private val keyString = "([^"]*)"/)?.[1] ||
    "";
  const iv =
    content.match(/export const COLOSSUS_IV_STRING = '([^']*)';/)?.[1] ||
    content.match(/const COLOSSUS_IV_STRING = ["']([^"']*)["']/)?.[1] ||
    content.match(/private val ivString = "([^"]*)"/)?.[1] ||
    "";
  if (key && iv) return { key, iv };
  return null;
}

async function readKeyPairFromCipherTs(filePath) {
  try {
    return parseKeyPair(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function walkKt(dir, out = []) {
  if (!(await safeStat(dir))) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "build") continue;
      await walkKt(full, out);
    } else if (entry.name.endsWith(".kt")) out.push(full);
  }
  return out;
}

async function findCipherKt(rootPath) {
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  for (const file of await walkKt(javaRoot)) {
    const src = await fs.readFile(file, "utf8");
    if (src.includes("cf-cipher:v1")) return file;
  }
  return null;
}

async function findRegistry(javaRoot) {
  const files = await walkKt(javaRoot);
  for (const file of files) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("fun createNativeModules")) continue;
    if (src.includes("autosetup-decoy")) continue;
    const pkg = (src.match(/^package\s+([A-Za-z0-9_.]+)/m) || [])[1];
    if (pkg) return { file, src, pkg };
  }
  return null;
}

function stripRegistryEntries(src, names) {
  let next = src;
  for (const name of names) {
    next = next.replace(new RegExp(`^[ \\t]*${name}\\(reactContext\\),?[ \\t]*\\r?\\n`, "gm"), "");
  }
  return next;
}

function registerCipher(src, className) {
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  let next = stripRegistryEntries(src, [className]);
  if (next.includes(`${className}(reactContext)`)) return next;
  const funAt = next.search(/fun createNativeModules\s*\(/);
  if (funAt < 0) throw new Error("ModuleRegistry.createNativeModules not found");
  const listAt = next.indexOf("listOf(", funAt);
  if (listAt < 0) throw new Error("ModuleRegistry listOf( not found");
  const paren = next.indexOf("(", listAt);
  let depth = 0;
  let close = -1;
  for (let i = paren; i < next.length; i++) {
    if (next[i] === "(") depth += 1;
    else if (next[i] === ")") {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close < 0) throw new Error("ModuleRegistry listOf( not closed");
  const before = next.slice(0, close).replace(/\s*$/, "");
  const needsComma = !before.endsWith(",") && !before.endsWith("(");
  return `${before}${needsComma ? "," : ""}${nl}            ${className}(reactContext),${nl}        ${next.slice(close)}`;
}

function renderCipherKotlin(pkg, className, key, iv) {
  return `/* cf-cipher:v1 */
package ${pkg}

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets

class ${className}(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = ${kotlinQuote(className)}

    private val keyString = ${kotlinQuote(key)}
    @Suppress("unused")
    private val ivString = ${kotlinQuote(iv)}
    private val keyBytes = keyString.toByteArray(StandardCharsets.UTF_8)

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun encryptHex(plain: String): String {
        return try {
            bytesToHex(transform(plain.toByteArray(StandardCharsets.UTF_8)))
        } catch (_: Exception) {
            ""
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun decryptHex(hex: String): String {
        return try {
            val normalized = hex.trim()
            if (normalized.isEmpty() || normalized.length % 2 != 0) return ""
            String(transform(hexToBytes(normalized)), StandardCharsets.UTF_8)
        } catch (_: Exception) {
            ""
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun transformHex(hex: String): String {
        return try {
            val normalized = hex.trim()
            if (normalized.isEmpty() || normalized.length % 2 != 0) return ""
            bytesToHex(transform(hexToBytes(normalized)))
        } catch (_: Exception) {
            ""
        }
    }

    private class Wheel(val pins: IntArray, var pos: Int) {
        val len: Int = pins.size
    }

    private fun transform(data: ByteArray): ByteArray {
        val st = intArrayOf(seedState(keyBytes))
        val chi = CHI_LENS.map { fillWheel(st, it) }
        val psi = PSI_LENS.map { fillWheel(st, it) }
        val mu = MU_LENS.map { fillWheel(st, it) }
        val out = ByteArray(data.size)
        for (i in data.indices) {
            var chiB = 0
            var psiB = 0
            for (b in 0 until 8) {
                chiB = chiB or (chi[b].pins[chi[b].pos] shl b)
                psiB = psiB or (psi[b].pins[psi[b].pos] shl b)
            }
            out[i] = (data[i].toInt() xor chiB xor psiB).toByte()
            for (b in 0 until 8) {
                chi[b].pos = (chi[b].pos + 1) % chi[b].len
            }
            val mu0 = mu[0].pins[mu[0].pos]
            mu[0].pos = (mu[0].pos + 1) % mu[0].len
            if (mu0 != 0) {
                mu[1].pos = (mu[1].pos + 1) % mu[1].len
            }
            if (mu[1].pins[mu[1].pos] != 0) {
                for (b in 0 until 8) {
                    psi[b].pos = (psi[b].pos + 1) % psi[b].len
                }
            }
        }
        return out
    }

    private fun seedState(bytes: ByteArray): Int {
        var s = 0x811C9DC5.toInt()
        for (b in bytes) {
            s = s xor (b.toInt() and 0xFF)
            s *= 16777619
        }
        if (bytes.isEmpty()) s = s xor 0xA5A5A5A5.toInt()
        return s
    }

    private fun nextU32(state: IntArray): Int {
        var x = state[0]
        x = x xor (x shl 13)
        x = x xor (x ushr 17)
        x = x xor (x shl 5)
        state[0] = x
        return x
    }

    private fun fillWheel(st: IntArray, len: Int): Wheel {
        val pins = IntArray(len)
        var ones = 0
        for (i in 0 until len) {
            pins[i] = nextU32(st) and 1
            ones += pins[i]
        }
        if (ones == 0) pins[0] = 1
        if (ones == len) pins[0] = 0
        val pos = u32Mod(nextU32(st), len)
        return Wheel(pins, pos)
    }

    private fun u32Mod(value: Int, len: Int): Int {
        return ((value.toLong() and 0xFFFFFFFFL) % len.toLong()).toInt()
    }

    private fun hexToBytes(hex: String): ByteArray {
        val out = ByteArray(hex.length / 2)
        var i = 0
        while (i < out.size) {
            val at = i * 2
            out[i] = hex.substring(at, at + 2).toInt(16).toByte()
            i += 1
        }
        return out
    }

    private fun bytesToHex(bytes: ByteArray): String {
        val hex = "0123456789ABCDEF"
        val chars = CharArray(bytes.size * 2)
        for (i in bytes.indices) {
            val v = bytes[i].toInt() and 0xFF
            chars[i * 2] = hex[v ushr 4]
            chars[i * 2 + 1] = hex[v and 0x0F]
        }
        return String(chars)
    }

    companion object {
        private val CHI_LENS = intArrayOf(41, 31, 29, 26, 23, 43, 47, 37)
        private val PSI_LENS = intArrayOf(43, 47, 51, 53, 59, 61, 67, 71)
        private val MU_LENS = intArrayOf(61, 37)
    }
}
`;
}

async function writeCipherModule(rootPath, frag, key, iv) {
  const javaRoot = path.join(rootPath, "android", "app", "src", "main", "java");
  const registry = await findRegistry(javaRoot);
  if (!registry) throw new Error("ModuleRegistry.createNativeModules not found");
  const className = `C${frag}Cipher`;
  const removed = [];
  for (const file of await walkKt(javaRoot)) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes("cf-cipher:v1")) continue;
    const previous = (src.match(/\bclass\s+([A-Za-z0-9_]+)/) || [])[1];
    if (previous) removed.push(previous);
    await fs.unlink(file);
  }
  const modulePath = path.join(path.dirname(registry.file), `${className}.kt`);
  await fs.writeFile(modulePath, renderCipherKotlin(registry.pkg, className, key, iv), "utf8");
  let registrySrc = stripRegistryEntries(await fs.readFile(registry.file, "utf8"), removed);
  registrySrc = registerCipher(registrySrc, className);
  await fs.writeFile(registry.file, registrySrc, "utf8");
  return className;
}

async function findCipherTs(rootPath, kind) {
  const dir = path.join(rootPath, "services");
  if (!(await safeStat(dir))) return null;
  const entries = await fs.readdir(dir);
  const re =
    kind === "colossus" ? /^co[A-Za-z0-9]*lossus\.ts$/i : /^ty[A-Za-z0-9]*pex\.ts$/i;
  const hit = entries.find((name) => re.test(name));
  return hit ? path.join(dir, hit) : null;
}

async function convertFileHexes(crypto, content, fromMode, fromCreds, toMode, toCreds) {
  let next = content;
  let count = 0;
  let changed = false;
  const errors = [];

  next = next.replace(
    /^((?:export\s+)?const \w+_EN[A-Za-z0-9]*C = ')([0-9A-Fa-f]+)(';)$/gm,
    (full, prefix, hex, suffix) => {
      const converted = crypto.convertHexValue(hex, fromMode, fromCreds, toMode, toCreds);
      if (!converted.ok) {
        errors.push(hex.slice(0, 12));
        return full;
      }
      count += 1;
      if (!converted.changed) return full;
      changed = true;
      return `${prefix}${converted.hex}${suffix}`;
    }
  );

  next = next.replace(
    /^((?:export\s+)?const li\w+nk = ')([0-9A-Fa-f]+)(';)$/gm,
    (full, prefix, hex, suffix) => {
      const converted = crypto.convertHexValue(hex, fromMode, fromCreds, toMode, toCreds);
      if (!converted.ok) {
        errors.push("link/sdk");
        return full;
      }
      count += 1;
      if (!converted.changed) return full;
      changed = true;
      return `${prefix}${converted.hex}${suffix}`;
    }
  );

  next = next.replace(/'([0-9A-Fa-f]{16,})'/g, (full, hex, offset) => {
    const around = next.slice(Math.max(0, offset - 80), offset);
    if (!/ENCRYPTED|_ENC|DevicesEncrypted|KeywordsEncrypted/.test(around)) {
      return full;
    }
    const converted = crypto.convertHexValue(hex, fromMode, fromCreds, toMode, toCreds);
    if (!converted.ok) return full;
    count += 1;
    if (!converted.changed) return full;
    changed = true;
    return `'${converted.hex}'`;
  });

  return { content: next, count, changed, errors };
}

async function patchCryptoService(rootPath, stem) {
  const dir = path.join(rootPath, "services");
  const entries = await fs.readdir(dir);
  const patched = [];
  const importRe =
    /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/(?:rc6|gost|blowfish|rc4|tripledes|fernet|ascon|rot47|xtea|bacon|bombe|typex|sigaba|colossus|xt[A-Za-z0-9]*ea|ba[A-Za-z0-9]*con|bo[A-Za-z0-9]*mbe|ty[A-Za-z0-9]*pex|si[A-Za-z0-9]*aba|co[A-Za-z0-9]*lossus|rot[A-Za-z0-9]*47)['"]\s*;/;
  for (const name of entries) {
    if (!/Crypto.+Service\.ts$/i.test(name) && !/toService\.ts$/i.test(name)) continue;
    const filePath = path.join(dir, name);
    let content = await fs.readFile(filePath, "utf8");
    if (!importRe.test(content)) continue;
    content = content.replace(
      importRe,
      `import {
  hexToBytes,
  ${stem}DecryptHex,
  ${stem}EncryptHex,
} from './${stem}';`
    );
    const algos = [
      "gost",
      "rc6",
      "blowfish",
      "rc4",
      "tripledes",
      "fernet",
      "ascon",
      "rot47",
      "xtea",
      "bacon",
      "bombe",
      "typex",
      "sigaba",
      "colossus",
    ];
    for (const algo of algos) {
      content = content.replace(new RegExp(`\\b${algo}EncryptHex\\b`, "g"), `${stem}EncryptHex`);
      content = content.replace(new RegExp(`\\b${algo}DecryptHex\\b`, "g"), `${stem}DecryptHex`);
      content = content.replace(new RegExp(`\\b${algo}DecryptBytes\\b`, "g"), `${stem}DecryptBytes`);
      content = content.replace(new RegExp(`\\b${algo}EncryptBytes\\b`, "g"), `${stem}EncryptBytes`);
    }
    content = content.replace(/\bxt[A-Za-z0-9]*eaEncryptHex\b/g, `${stem}EncryptHex`);
    content = content.replace(/\bxt[A-Za-z0-9]*eaDecryptBytes\b/g, `${stem}DecryptBytes`);
    content = content.replace(/\bxt[A-Za-z0-9]*eaEncryptBytes\b/g, `${stem}EncryptBytes`);
    content = content.replace(/\bty[A-Za-z0-9]*pexEncryptHex\b/g, `${stem}EncryptHex`);
    content = content.replace(/\bty[A-Za-z0-9]*pexDecryptBytes\b/g, `${stem}DecryptBytes`);
    content = content.replace(/\bty[A-Za-z0-9]*pexEncryptBytes\b/g, `${stem}EncryptBytes`);
    content = content.replace(/\bco[A-Za-z0-9]*lossusEncryptHex\b/g, `${stem}EncryptHex`);
    content = content.replace(/\bco[A-Za-z0-9]*lossusDecryptHex\b/g, `${stem}DecryptHex`);
    content = content.replace(/\bco[A-Za-z0-9]*lossusDecryptBytes\b/g, `${stem}DecryptBytes`);
    content = content.replace(/\bco[A-Za-z0-9]*lossusEncryptBytes\b/g, `${stem}EncryptBytes`);
    await fs.writeFile(filePath, content, "utf8");
    patched.push(path.relative(rootPath, filePath));
  }
  return patched;
}

async function patchWorker(rootPath, key, iv) {
  const indexPath = path.join(rootPath, "cloudflare-worker", "index.js");
  let indexContent = await fs.readFile(indexPath, "utf8");
  const inline = renderWorkerInline(key, iv);
  const inlineRe =
    /\/\* =+\s*\*\/\s*\n\/\* (?:Blowfish|Triple DES|XTEA|Typex|Colossus)[^\n]*\n\/\* https:\/\/en\.wikipedia\.org\/wiki\/(?:Blowfish|Triple_DES|XTEA|Typex|Colossus_computer) \*\/\s*\n\/\* =+\s*\*\/\s*\n[\s\S]*?function (?:blowfish|tripledes|xtea|typex|colossus)EncryptToHex\(jsonStr\) \{[\s\S]*?\}\s*\n(?:function typexDecrypt\(buffer\) \{[\s\S]*?\}\s*\n)?(?:function typexEncryptToHex\(jsonStr\) \{[\s\S]*?\}\s*\n)?/;

  if (inlineRe.test(indexContent)) {
    indexContent = indexContent.replace(inlineRe, `${inline}\n`);
  } else {
    const keyRe = /const COLOSSUS_KEY_STRING = "[^"]*";/;
    const ivRe = /const COLOSSUS_IV_STRING = "[^"]*";/;
    if (keyRe.test(indexContent) && ivRe.test(indexContent)) {
      indexContent = indexContent
        .replace(keyRe, `const COLOSSUS_KEY_STRING = "${key}";`)
        .replace(ivRe, `const COLOSSUS_IV_STRING = "${iv}";`);
    } else {
      throw new Error("Could not find cipher inline block in cloudflare-worker/index.js");
    }
  }

  indexContent = indexContent
    .replace(/Typex \(5-rotor byte cipher\)\. /g, "Colossus (Lorenz-inspired). ")
    .replace(/url-encoded Typex hex/g, "url-encoded Colossus hex")
    .replace(/Typex hex/g, "Colossus hex")
    .replace(/TYPEX_KEY_BYTES/g, "COLOSSUS_KEY_BYTES")
    .replace(/TYPEX_IV_BYTES/g, "COLOSSUS_IV_BYTES");

  await fs.writeFile(indexPath, indexContent, "utf8");
  await fs.writeFile(path.join(rootPath, "cloudflare-worker", "colossus.js"), inline, "utf8");
}

async function applyColossus(rootPath, { fragment, meta } = {}) {
  const frag = String(fragment || (await detectFragmentFromConstants(rootPath)) || "").trim();
  if (!frag) {
    return { ok: false, details: "fragment не найден" };
  }

  const fromMode = (await detectProjectEncryptionMode(rootPath)) || "typex";
  const loadedFrom = loadProjectCrypto(fromMode, meta, rootPath);
  const loadedTo = loadProjectCrypto("colossus", meta, rootPath);
  if (!loadedTo.ok) {
    return { ok: false, details: loadedTo.details || "colossus helper не найден" };
  }
  if (!loadedFrom.ok) {
    return { ok: false, details: loadedFrom.details };
  }

  const oldColossus = await findCipherTs(rootPath, "colossus");
  const oldTypex = await findCipherTs(rootPath, "typex");
  const fromCreds = (await readProjectColossusCredentials(rootPath)) || undefined;

  const key = randomSeedString(28);
  const iv = randomSeedString(18);
  const toCreds = { key, iv };
  const stem = `co${frag}lossus`;

  const tsPath = path.join(rootPath, "services", `${stem}.ts`);
  await fs.writeFile(tsPath, renderTsModule(frag, stem), "utf8");
  await writeCipherModule(rootPath, frag, key, iv);
  await patchWorker(rootPath, key, iv);
  const patchedCrypto = await patchCryptoService(rootPath, stem);

  const files = await collectWorkspaceFiles(rootPath);
  let converted = 0;
  let filesChanged = 0;
  const warnings = [];
  for (const filePath of files) {
    const normalized = filePath.replace(/\\/g, "/").toLowerCase();
    if (normalized.includes("/scripts/")) continue;
    if (normalized.includes("/cloudflare-worker/")) continue;
    if (!/\.(ts|tsx|js)$/i.test(filePath)) continue;
    let content;
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }
    if (!/[0-9A-Fa-f]{16,}/.test(content)) continue;
    const result = await convertFileHexes(
      loadedTo.crypto,
      content,
      fromMode,
      fromCreds,
      "colossus",
      toCreds
    );
    converted += result.count;
    if (result.changed) {
      await fs.writeFile(filePath, result.content, "utf8");
      filesChanged += 1;
    }
    if (result.errors.length) {
      warnings.push(`${path.basename(filePath)}: ${result.errors.slice(0, 3).join(",")}`);
    }
  }

  if (oldTypex && path.basename(oldTypex) !== `${stem}.ts`) {
    await fs.unlink(oldTypex).catch(() => {});
  }
  if (oldColossus && path.resolve(oldColossus) !== path.resolve(tsPath)) {
    await fs.unlink(oldColossus).catch(() => {});
  }
  const oldWorkerTypex = path.join(rootPath, "cloudflare-worker", "typex.js");
  if (await safeStat(oldWorkerTypex)) {
    await fs.unlink(oldWorkerTypex).catch(() => {});
  }

  if (meta && typeof meta === "object") {
    meta.encryption = "colossus";
  }

  const sample = "colossus-roundtrip";
  const enc = loadedTo.crypto.projectEncrypt(sample, "colossus", toCreds);
  const dec = loadedTo.crypto.projectDecrypt(enc, "colossus", toCreds);
  if (dec !== sample) {
    return { ok: false, details: `self-test failed: ${dec}` };
  }

  return {
    ok: true,
    details:
      `colossus seed rotated; stem ${stem}; converted ${converted} values / ${filesChanged} files` +
      (patchedCrypto.length ? `; crypto ${patchedCrypto.join(",")}` : "") +
      (warnings.length ? `; warn ${warnings.slice(0, 3).join("; ")}` : ""),
    key,
    iv,
    stem,
  };
}

async function readProjectColossusCredentials(rootPath) {
  const kt = await findCipherKt(rootPath);
  if (kt) {
    const pair = await readKeyPairFromCipherTs(kt);
    if (pair) return pair;
  }
  const file = await findCipherTs(rootPath, "colossus");
  if (!file) return undefined;
  return (await readKeyPairFromCipherTs(file)) || undefined;
}

module.exports = {
  applyColossus,
  readProjectColossusCredentials,
  findCipherTs,
};
