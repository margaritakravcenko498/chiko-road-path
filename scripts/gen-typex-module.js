#!/usr/bin/env node
/**
 * Generates Typex modules for Suspended v3 app + worker, patches CryptoService / worker index,
 * and syncs helper cipher file.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HELPER_ROOT = path.resolve("E:/TD/CursorExtensions/ReactNativeAppHelperExtension");
const HELPER_EXT = path.join(HELPER_ROOT, "vscode-rn-app-helper-typex");
const CIPHER_SRC = path.join(HELPER_ROOT, "scripts", "typex-cipher-node.js");

const metaPath = path.join(ROOT, "meta.json");
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
const FRAG = String(meta.fragmentTo || "ichyikowrdfpagthms").trim();
const STEM = `ty${FRAG}pex`;
const CONST_PREFIX = `TY${FRAG}PEX`;

const jsModule = fs.readFileSync(CIPHER_SRC, "utf8");

/** Buffer-free bytesToHex for RN / Workers */
function workerBytesToHexImpl() {
  return `function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}`;
}

const tsContent = `/**
 * Typex-inspired byte cipher (5 rotors, 256 positions, multi-notch stepping).
 * https://en.wikipedia.org/wiki/Typex
 *
 * R0/R1 stationary (pos 0); R2/R3/R4 step. Self-reciprocal (encrypt == decrypt).
 * Wire format: uppercase hex. Key/IV placeholders unused (helper UI parity).
 */

function utf8Encode(str: string): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode < 0x80) {
      bytes.push(charCode);
    } else if (charCode < 0x800) {
      bytes.push(0xc0 | (charCode >> 6));
      bytes.push(0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      bytes.push(0xe0 | (charCode >> 12));
      bytes.push(0x80 | ((charCode >> 6) & 0x3f));
      bytes.push(0x80 | (charCode & 0x3f));
    } else {
      i++;
      const charCode2 = str.charCodeAt(i);
      const codePoint = 0x10000 + (((charCode & 0x3ff) << 10) | (charCode2 & 0x3ff));
      bytes.push(0xf0 | (codePoint >> 18));
      bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

function utf8Decode(bytes: Uint8Array): string {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const byte1 = bytes[i++];
    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
    } else if ((byte1 >> 5) === 0x06) {
      const byte2 = bytes[i++];
      result += String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
    } else if ((byte1 >> 4) === 0x0e) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      result += String.fromCharCode(
        ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f),
      );
    } else if ((byte1 >> 3) === 0x1e) {
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];
      const byte4 = bytes[i++];
      const codePoint =
        ((byte1 & 0x07) << 18) |
        ((byte2 & 0x3f) << 12) |
        ((byte3 & 0x3f) << 6) |
        (byte4 & 0x3f);
      if (codePoint > 0xffff) {
        const surrogate1 = 0xd800 + ((codePoint - 0x10000) >> 10);
        const surrogate2 = 0xdc00 + ((codePoint - 0x10000) & 0x3ff);
        result += String.fromCharCode(surrogate1, surrogate2);
      } else {
        result += String.fromCharCode(codePoint);
      }
    }
  }
  return result;
}

export const ${CONST_PREFIX}_KEY_STRING = 'TYPEX-NO-KEY!!!';
export const ${CONST_PREFIX}_IV_STRING = 'TYPEX-NO-IV!!!!';
export const ${CONST_PREFIX}_KEY_BYTES = utf8Encode(${CONST_PREFIX}_KEY_STRING);
export const ${CONST_PREFIX}_IV_BYTES = utf8Encode(${CONST_PREFIX}_IV_STRING);

/** Plain aliases for helper / replaceFragment parity. */
export const TYPEX_KEY_STRING = ${CONST_PREFIX}_KEY_STRING;
export const TYPEX_IV_STRING = ${CONST_PREFIX}_IV_STRING;
export const TYPEX_KEY_BYTES = ${CONST_PREFIX}_KEY_BYTES;
export const TYPEX_IV_BYTES = ${CONST_PREFIX}_IV_BYTES;

function buildPerm(seed: number): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const a = new Uint8Array(256);
  for (let i = 0; i < 256; i++) a[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function invertPerm(perm: Uint8Array): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const inv = new Uint8Array(256);
  for (let i = 0; i < 256; i++) inv[perm[i]] = i;
  return inv;
}

function buildReflector(seed: number): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const order = buildPerm(seed);
  const ref = new Uint8Array(256);
  for (let i = 0; i < 256; i += 2) {
    const a = order[i];
    const b = order[i + 1];
    ref[a] = b;
    ref[b] = a;
  }
  return ref;
}

function buildNotchSet(seed: number, count: number): Set<number> {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const order = buildPerm(seed);
  const set = new Set<number>();
  for (let i = 0; i < count; i++) set.add(order[i]);
  return set;
}

const R0_FWD = buildPerm(0x54595045);
const R1_FWD = buildPerm(0x58524f54);
const R2_FWD = buildPerm(0x42524954);
const R3_FWD = buildPerm(0x4e4f5443);
const R4_FWD = buildPerm(0x53544550);
const R0_INV = invertPerm(R0_FWD);
const R1_INV = invertPerm(R1_FWD);
const R2_INV = invertPerm(R2_FWD);
const R3_INV = invertPerm(R3_FWD);
const R4_INV = invertPerm(R4_FWD);
const REFLECTOR = buildReflector(0x5245464c);
const NOTCHES3 = buildNotchSet(0x4e544348, 5);
const NOTCHES4 = buildNotchSet(0x4d4c5449, 7);

function throughRotorFwd(wiring: Uint8Array, pos: number, v: number): number {
  return (wiring[(v + pos) & 255] - pos + 256) & 255;
}

function throughRotorInv(invWiring: Uint8Array, pos: number, v: number): number {
  return (invWiring[(v + pos) & 255] - pos + 256) & 255;
}

function typexTransformBytes(data: Uint8Array): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const src = data instanceof Uint8Array ? data : new Uint8Array(data || []);
  const out = new Uint8Array(src.length);
  const p0 = 0;
  const p1 = 0;
  let p2 = 0;
  let p3 = 0;
  let p4 = 0;

  for (let i = 0; i < src.length; i++) {
    p4 = (p4 + 1) & 255;
    if (NOTCHES4.has(p4)) {
      p3 = (p3 + 1) & 255;
      if (NOTCHES3.has(p3)) {
        p2 = (p2 + 1) & 255;
      }
    }

    let v = src[i];
    v = throughRotorFwd(R0_FWD, p0, v);
    v = throughRotorFwd(R1_FWD, p1, v);
    v = throughRotorFwd(R2_FWD, p2, v);
    v = throughRotorFwd(R3_FWD, p3, v);
    v = throughRotorFwd(R4_FWD, p4, v);
    v = REFLECTOR[v];
    v = throughRotorInv(R4_INV, p4, v);
    v = throughRotorInv(R3_INV, p3, v);
    v = throughRotorInv(R2_INV, p2, v);
    v = throughRotorInv(R1_INV, p1, v);
    v = throughRotorInv(R0_INV, p0, v);
    out[i] = v;
  }
  return out;
}

function encryptBytes(data: Uint8Array, _key?: Uint8Array): Uint8Array {
  return typexTransformBytes(data);
}

function decryptBytes(data: Uint8Array, _key?: Uint8Array, _legacyIv?: Uint8Array): Uint8Array {
  return typexTransformBytes(data);
}

function bytesToHex(bytes: Uint8Array): string {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hexToBytes(hex: string): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  const normalized = hex.trim();
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function encryptHex(plain: string, key: Uint8Array = TYPEX_KEY_BYTES): string {
  return bytesToHex(encryptBytes(utf8Encode(String(plain)), key));
}

export function ${STEM}EncryptBytes(
  data: Uint8Array,
  key: Uint8Array = ${CONST_PREFIX}_KEY_BYTES,
): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  return encryptBytes(data, key);
}

export function ${STEM}DecryptBytes(
  data: Uint8Array,
  key: Uint8Array = ${CONST_PREFIX}_KEY_BYTES,
  legacyIv: Uint8Array = ${CONST_PREFIX}_IV_BYTES,
): Uint8Array {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  return decryptBytes(data, key, legacyIv);
}

export function ${STEM}EncryptHex(
  plain: string,
  key: Uint8Array = ${CONST_PREFIX}_KEY_BYTES,
): string {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  return encryptHex(plain, key);
}

export function ${STEM}DecryptHex(
  hex: string,
  key: Uint8Array = ${CONST_PREFIX}_KEY_BYTES,
): string {
  void ${FRAG}MixSeed(3, 7);
  void ${FRAG}FoldRange([1, 2, 3]);
  void ${FRAG}ClampSpan(5, 0, 10);

  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) {
      return '';
    }
    const decrypted = ${STEM}DecryptBytes(hexToBytes(normalized), key);
    return utf8Decode(decrypted);
  } catch {
    return '';
  }
}

export { bytesToHex, hexToBytes };

function ${FRAG}MixSeed(a: number, b: number): number {
  return ((a % (b || 1)) + b) % (b || 1);
}

function ${FRAG}FoldRange(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

function ${FRAG}ClampSpan(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}
`;

const servicesOut = path.join(ROOT, "services", `${STEM}.ts`);
fs.writeFileSync(servicesOut, tsContent);
console.log("Wrote", path.relative(ROOT, servicesOut));

fs.writeFileSync(path.join(ROOT, "cloudflare-worker", "typex.js"), jsModule);
console.log("Wrote cloudflare-worker/typex.js");

const workerInline = `/* ============================= */
/* Typex (5-rotor byte cipher)   */
/* https://en.wikipedia.org/wiki/Typex */
/* ============================= */

const TYPEX_KEY_STRING = "TYPEX-NO-KEY!!!";
const TYPEX_IV_STRING = "TYPEX-NO-IV!!!!";
const TYPEX_KEY_BYTES = new TextEncoder().encode(TYPEX_KEY_STRING);
const TYPEX_IV_BYTES = new TextEncoder().encode(TYPEX_IV_STRING);

function buildPerm(seed) {
  const a = new Uint8Array(256);
  for (let i = 0; i < 256; i++) a[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function invertPerm(perm) {
  const inv = new Uint8Array(256);
  for (let i = 0; i < 256; i++) inv[perm[i]] = i;
  return inv;
}

function buildReflector(seed) {
  const order = buildPerm(seed);
  const ref = new Uint8Array(256);
  for (let i = 0; i < 256; i += 2) {
    const a = order[i];
    const b = order[i + 1];
    ref[a] = b;
    ref[b] = a;
  }
  return ref;
}

function buildNotchSet(seed, count) {
  const order = buildPerm(seed);
  const set = new Set();
  for (let i = 0; i < count; i++) set.add(order[i]);
  return set;
}

const R0_FWD = buildPerm(0x54595045);
const R1_FWD = buildPerm(0x58524f54);
const R2_FWD = buildPerm(0x42524954);
const R3_FWD = buildPerm(0x4e4f5443);
const R4_FWD = buildPerm(0x53544550);
const R0_INV = invertPerm(R0_FWD);
const R1_INV = invertPerm(R1_FWD);
const R2_INV = invertPerm(R2_FWD);
const R3_INV = invertPerm(R3_FWD);
const R4_INV = invertPerm(R4_FWD);
const REFLECTOR = buildReflector(0x5245464c);
const NOTCHES3 = buildNotchSet(0x4e544348, 5);
const NOTCHES4 = buildNotchSet(0x4d4c5449, 7);

function throughRotorFwd(wiring, pos, v) {
  return (wiring[(v + pos) & 255] - pos + 256) & 255;
}

function throughRotorInv(invWiring, pos, v) {
  return (invWiring[(v + pos) & 255] - pos + 256) & 255;
}

function typexTransformBytes(data) {
  const src = data instanceof Uint8Array ? data : new Uint8Array(data || []);
  const out = new Uint8Array(src.length);
  const p0 = 0;
  const p1 = 0;
  let p2 = 0;
  let p3 = 0;
  let p4 = 0;

  for (let i = 0; i < src.length; i++) {
    p4 = (p4 + 1) & 255;
    if (NOTCHES4.has(p4)) {
      p3 = (p3 + 1) & 255;
      if (NOTCHES3.has(p3)) {
        p2 = (p2 + 1) & 255;
      }
    }

    let v = src[i];
    v = throughRotorFwd(R0_FWD, p0, v);
    v = throughRotorFwd(R1_FWD, p1, v);
    v = throughRotorFwd(R2_FWD, p2, v);
    v = throughRotorFwd(R3_FWD, p3, v);
    v = throughRotorFwd(R4_FWD, p4, v);
    v = REFLECTOR[v];
    v = throughRotorInv(R4_INV, p4, v);
    v = throughRotorInv(R3_INV, p3, v);
    v = throughRotorInv(R2_INV, p2, v);
    v = throughRotorInv(R1_INV, p1, v);
    v = throughRotorInv(R0_INV, p0, v);
    out[i] = v;
  }
  return out;
}

function encryptBytes(data, _key = TYPEX_KEY_BYTES) {
  return typexTransformBytes(data);
}

function decryptBytes(data, _key = TYPEX_KEY_BYTES, _legacyIv = TYPEX_IV_BYTES) {
  return typexTransformBytes(data);
}

${workerBytesToHexImpl()}

function encryptHex(plain, key = TYPEX_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function typexDecrypt(buffer) {
  return decryptBytes(buffer, TYPEX_KEY_BYTES, TYPEX_IV_BYTES);
}

function typexEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, TYPEX_KEY_BYTES);
}
`;

const indexPath = path.join(ROOT, "cloudflare-worker", "index.js");
let indexContent = fs.readFileSync(indexPath, "utf8");
indexContent = indexContent
  .replace(/XTEA \(CBC \+ PKCS7\)\. /g, "Typex (5-rotor byte cipher). ")
  .replace(/url-encoded XTEA hex/g, "url-encoded Typex hex")
  .replace(/XTEA hex/g, "Typex hex");

const inlineRe =
  /\/\* =+\s*\*\/\s*\n\/\* (?:Blowfish|Triple DES|XTEA|Typex)[^\n]*\n\/\* https:\/\/en\.wikipedia\.org\/wiki\/(?:Blowfish|Triple_DES|XTEA|Typex) \*\/\s*\n\/\* =+\s*\*\/\s*\n[\s\S]*?function (?:blowfish|tripledes|xtea|typex)EncryptToHex\(jsonStr\) \{[\s\S]*?\}\s*\n/;

if (inlineRe.test(indexContent)) {
  indexContent = indexContent.replace(inlineRe, `${workerInline}\n\n`);
} else {
  throw new Error("Could not find cipher inline block in cloudflare-worker/index.js");
}

indexContent = indexContent
  .replace(/\bxteaDecrypt\b/g, "typexDecrypt")
  .replace(/\bxteaEncryptToHex\b/g, "typexEncryptToHex")
  .replace(/XTEA_KEY_BYTES/g, "TYPEX_KEY_BYTES")
  .replace(/XTEA_IV_BYTES/g, "TYPEX_IV_BYTES")
  .replace(/XTEA_KEY_STRING/g, "TYPEX_KEY_STRING")
  .replace(/XTEA_IV_STRING/g, "TYPEX_IV_STRING");

fs.writeFileSync(indexPath, indexContent);
console.log("Patched cloudflare-worker/index.js");

// Patch CryptoService / toService
const servicesDir = path.join(ROOT, "services");
for (const name of fs.readdirSync(servicesDir)) {
  if (!/Crypto.+Service\.ts$/i.test(name) && !/toService\.ts$/i.test(name)) continue;
  const filePath = path.join(servicesDir, name);
  let content = fs.readFileSync(filePath, "utf8");
  const importRe =
    /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/(?:rc6|gost|blowfish|rc4|tripledes|fernet|ascon|rot47|xtea|bacon|bombe|typex|xt[A-Za-z0-9]*ea|ba[A-Za-z0-9]*con|bo[A-Za-z0-9]*mbe|ty[A-Za-z0-9]*pex)['"]\s*;/;
  if (!importRe.test(content)) continue;
  content = content.replace(
    importRe,
    `import {
  hexToBytes,
  ${STEM}DecryptBytes,
  ${STEM}EncryptBytes,
  ${STEM}EncryptHex,
} from './${STEM}';`,
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
  ];
  for (const algo of algos) {
    content = content.replace(new RegExp(`\\b${algo}EncryptHex\\b`, "g"), `${STEM}EncryptHex`);
    content = content.replace(new RegExp(`\\b${algo}DecryptBytes\\b`, "g"), `${STEM}DecryptBytes`);
    content = content.replace(new RegExp(`\\b${algo}EncryptBytes\\b`, "g"), `${STEM}EncryptBytes`);
  }
  content = content.replace(/\bxt[A-Za-z0-9]*eaEncryptHex\b/g, `${STEM}EncryptHex`);
  content = content.replace(/\bxt[A-Za-z0-9]*eaDecryptBytes\b/g, `${STEM}DecryptBytes`);
  content = content.replace(/\bxt[A-Za-z0-9]*eaEncryptBytes\b/g, `${STEM}EncryptBytes`);
  fs.writeFileSync(filePath, content);
  console.log("Patched", path.relative(ROOT, filePath));
}

if (fs.existsSync(HELPER_EXT)) {
  fs.writeFileSync(path.join(HELPER_EXT, "typex.js"), jsModule);
  console.log("Synced helper typex.js");
}

// Delete old xtea fragment module if present
const oldXtea = path.join(ROOT, "services", `xt${FRAG}ea.ts`);
if (fs.existsSync(oldXtea)) {
  fs.unlinkSync(oldXtea);
  console.log("Deleted", path.relative(ROOT, oldXtea));
}

// Update meta.json
meta.encryption = "typex";
meta.encryptionResolved = "typex";
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
console.log("Updated meta.json encryption → typex");

// Self-test via node cipher
const typex = require(CIPHER_SRC);
const sample = "roundtrip-typex";
const enc = typex.typexEncryptHex(sample);
const dec = typex.typexDecryptHex(enc);
if (dec !== sample) {
  console.error("Self-test failed", { enc, dec });
  process.exit(1);
}
console.log("Self-test OK");
