#!/usr/bin/env node
/**
 * Generates XTEA (CBC + PKCS7) modules for app + worker, patches CryptoService / worker index,
 * and syncs helper cipher file.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HELPER_ROOT = path.resolve('E:/TD/CursorExtensions/ReactNativeAppHelperExtension');
const HELPER_EXT = path.join(HELPER_ROOT, 'vscode-rn-app-helper-xtea');
const CIPHER_SRC = path.join(HELPER_ROOT, 'scripts', 'xtea-cipher-node.js');

const jsModule = fs.readFileSync(CIPHER_SRC, 'utf8');

const tsContent = `/**
 * XTEA block cipher (CBC + PKCS7), random 8-byte IV prefix.
 * https://en.wikipedia.org/wiki/XTEA
 * Key 128-bit (16 UTF-8 bytes), block/IV 64-bit (8 bytes), 32 cycles.
 */

export const XTEA_BLOCK_SIZE = 8;
export const XTEA_ROUNDS = 32;
export const XTEA_DELTA = 0x9e3779b9;

export const XTEA_KEY_STRING = '1234567890ABCDEF';
export const XTEA_IV_STRING = 'ABCDEF12';
export const XTEA_KEY_BYTES = new TextEncoder().encode(XTEA_KEY_STRING);
export const XTEA_IV_BYTES = new TextEncoder().encode(XTEA_IV_STRING);

const BLOCK_SIZE = XTEA_BLOCK_SIZE;
const KEY_BYTES = XTEA_KEY_BYTES;
const IV_BYTES = XTEA_IV_BYTES;

const u32 = (x: number): number => x >>> 0;

function bytesToWordLE(bytes: Uint8Array, offset: number): number {
  return u32(
    bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24),
  );
}

function wordToBytesLE(word: number, out: Uint8Array, offset: number): void {
  out[offset] = word & 0xff;
  out[offset + 1] = (word >>> 8) & 0xff;
  out[offset + 2] = (word >>> 16) & 0xff;
  out[offset + 3] = (word >>> 24) & 0xff;
}

function keyToWords(key: Uint8Array): number[] {
  if (key.length !== 16) {
    throw new Error('XTEA key must be exactly 16 bytes');
  }
  return [
    bytesToWordLE(key, 0),
    bytesToWordLE(key, 4),
    bytesToWordLE(key, 8),
    bytesToWordLE(key, 12),
  ];
}

function xteaEncryptWords(v0: number, v1: number, key: number[]): { left: number; right: number } {
  let y = u32(v0);
  let z = u32(v1);
  let sum = 0;
  for (let i = 0; i < XTEA_ROUNDS; i++) {
    y = u32(y + ((((z << 4) ^ (z >>> 5)) + z) ^ (sum + key[sum & 3])));
    sum = u32(sum + XTEA_DELTA);
    z = u32(z + ((((y << 4) ^ (y >>> 5)) + y) ^ (sum + key[(sum >>> 11) & 3])));
  }
  return { left: y, right: z };
}

function xteaDecryptWords(v0: number, v1: number, key: number[]): { left: number; right: number } {
  let y = u32(v0);
  let z = u32(v1);
  let sum = u32(XTEA_DELTA * XTEA_ROUNDS);
  for (let i = 0; i < XTEA_ROUNDS; i++) {
    z = u32(z - ((((y << 4) ^ (y >>> 5)) + y) ^ (sum + key[(sum >>> 11) & 3])));
    sum = u32(sum - XTEA_DELTA);
    y = u32(y - ((((z << 4) ^ (z >>> 5)) + z) ^ (sum + key[sum & 3])));
  }
  return { left: y, right: z };
}

function encryptBlock(
  block: Uint8Array,
  offset: number,
  keyWords: number[],
  out: Uint8Array,
  outOffset: number,
): void {
  const left = bytesToWordLE(block, offset);
  const right = bytesToWordLE(block, offset + 4);
  const res = xteaEncryptWords(left, right, keyWords);
  wordToBytesLE(res.left, out, outOffset);
  wordToBytesLE(res.right, out, outOffset + 4);
}

function decryptBlock(
  block: Uint8Array,
  offset: number,
  keyWords: number[],
  out: Uint8Array,
  outOffset: number,
): void {
  const left = bytesToWordLE(block, offset);
  const right = bytesToWordLE(block, offset + 4);
  const res = xteaDecryptWords(left, right, keyWords);
  wordToBytesLE(res.left, out, outOffset);
  wordToBytesLE(res.right, out, outOffset + 4);
}

function pkcs7Pad(data: Uint8Array): Uint8Array {
  const remainder = data.length % BLOCK_SIZE;
  const padLen = remainder === 0 ? BLOCK_SIZE : BLOCK_SIZE - remainder;
  const out = new Uint8Array(data.length + padLen);
  out.set(data);
  out.fill(padLen, data.length);
  return out;
}

function pkcs7Unpad(data: Uint8Array): Uint8Array {
  if (!data.length) throw new Error('Empty data');
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > BLOCK_SIZE) throw new Error('Invalid PKCS7 padding');
  for (let i = data.length - padLen; i < data.length; i++) {
    if (data[i] !== padLen) throw new Error('Invalid PKCS7 padding');
  }
  return data.subarray(0, data.length - padLen);
}

function xorBlock(
  a: Uint8Array,
  aOffset: number,
  b: Uint8Array,
  bOffset: number,
  out: Uint8Array,
  outOffset: number,
): void {
  for (let i = 0; i < BLOCK_SIZE; i++) {
    out[outOffset + i] = a[aOffset + i] ^ b[bOffset + i];
  }
}

function cbcEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (key.length !== 16) throw new Error('XTEA key must be exactly 16 bytes');
  if (iv.length !== BLOCK_SIZE) throw new Error('XTEA CBC requires an 8-byte IV');
  const keyWords = keyToWords(key);
  const padded = pkcs7Pad(data);
  const out = new Uint8Array(padded.length);
  const work = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE) {
    xorBlock(padded, offset, prev, 0, work, 0);
    encryptBlock(work, 0, keyWords, out, offset);
    prev = out.subarray(offset, offset + BLOCK_SIZE);
  }
  return out;
}

function cbcDecrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (key.length !== 16) throw new Error('XTEA key must be exactly 16 bytes');
  if (iv.length !== BLOCK_SIZE) throw new Error('XTEA CBC requires an 8-byte IV');
  if (data.length % BLOCK_SIZE !== 0) throw new Error('Ciphertext length must be a multiple of 8');
  const keyWords = keyToWords(key);
  const out = new Uint8Array(data.length);
  const block = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < data.length; offset += BLOCK_SIZE) {
    decryptBlock(data, offset, keyWords, block, 0);
    xorBlock(block, 0, prev, 0, out, offset);
    prev = data.subarray(offset, offset + BLOCK_SIZE);
  }
  return pkcs7Unpad(out);
}

function canUseEmbeddedIv(data: Uint8Array, ivSize: number, blockSize: number): boolean {
  return data.length > ivSize && (data.length - ivSize) % blockSize === 0;
}

function createRandomBytes(length: number): Uint8Array {
  const out = new Uint8Array(length);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(out);
    return out;
  }
  for (let i = 0; i < length; i++) out[i] = Math.floor(Math.random() * 256);
  return out;
}

function encryptBytes(data: Uint8Array, key: Uint8Array = KEY_BYTES): Uint8Array {
  const iv = createRandomBytes(BLOCK_SIZE);
  const ciphertext = cbcEncrypt(data, key, iv);
  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv, 0);
  out.set(ciphertext, iv.length);
  return out;
}

function decryptBytes(
  data: Uint8Array,
  key: Uint8Array = KEY_BYTES,
  legacyIv: Uint8Array = IV_BYTES,
): Uint8Array {
  if (canUseEmbeddedIv(data, BLOCK_SIZE, BLOCK_SIZE)) {
    try {
      const iv = data.subarray(0, BLOCK_SIZE);
      const ciphertext = data.subarray(BLOCK_SIZE);
      return cbcDecrypt(ciphertext, key, iv);
    } catch {
      // fall through to legacy fixed IV
    }
  }
  return cbcDecrypt(data, key, legacyIv);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.trim();
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function encryptHex(plain: string, key: Uint8Array = XTEA_KEY_BYTES): string {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

export function xteaCbcEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  return cbcEncrypt(data, key, iv);
}

export function xteaCbcDecrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  return cbcDecrypt(data, key, iv);
}

export function xteaEncryptBytes(data: Uint8Array, key: Uint8Array = XTEA_KEY_BYTES): Uint8Array {
  return encryptBytes(data, key);
}

export function xteaDecryptBytes(
  data: Uint8Array,
  key: Uint8Array = XTEA_KEY_BYTES,
  legacyIv: Uint8Array = XTEA_IV_BYTES,
): Uint8Array {
  return decryptBytes(data, key, legacyIv);
}

export function xteaEncryptHex(plain: string, key: Uint8Array = XTEA_KEY_BYTES): string {
  return encryptHex(plain, key);
}

export function xteaDecryptHex(hex: string, key: Uint8Array = XTEA_KEY_BYTES): string {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) {
      return '';
    }
    const decrypted = xteaDecryptBytes(hexToBytes(normalized), key);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

export { bytesToHex, hexToBytes };
`;

fs.writeFileSync(path.join(ROOT, 'services/xtea.ts'), tsContent);
fs.writeFileSync(path.join(ROOT, 'cloudflare-worker/xtea.js'), jsModule);

// Inline worker block for index.js
const workerInline = `/* ============================= */
/* XTEA (CBC + PKCS7)            */
/* https://en.wikipedia.org/wiki/XTEA */
/* ============================= */

const XTEA_BLOCK_SIZE = 8;
const XTEA_ROUNDS = 32;
const XTEA_DELTA = 0x9e3779b9;

const XTEA_KEY_STRING = "1234567890ABCDEF";
const XTEA_IV_STRING = "ABCDEF12";
const XTEA_KEY_BYTES = new TextEncoder().encode(XTEA_KEY_STRING);
const XTEA_IV_BYTES = new TextEncoder().encode(XTEA_IV_STRING);

const BLOCK_SIZE = XTEA_BLOCK_SIZE;
const KEY_BYTES = XTEA_KEY_BYTES;
const IV_BYTES = XTEA_IV_BYTES;

const u32 = (x) => x >>> 0;

function bytesToWordLE(bytes, offset) {
  return u32(
    bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24),
  );
}

function wordToBytesLE(word, out, offset) {
  out[offset] = word & 0xff;
  out[offset + 1] = (word >>> 8) & 0xff;
  out[offset + 2] = (word >>> 16) & 0xff;
  out[offset + 3] = (word >>> 24) & 0xff;
}

function keyToWords(key) {
  if (key.length !== 16) throw new Error("XTEA key must be exactly 16 bytes");
  return [
    bytesToWordLE(key, 0),
    bytesToWordLE(key, 4),
    bytesToWordLE(key, 8),
    bytesToWordLE(key, 12),
  ];
}

function xteaEncryptWords(v0, v1, key) {
  let y = u32(v0);
  let z = u32(v1);
  let sum = 0;
  for (let i = 0; i < XTEA_ROUNDS; i++) {
    y = u32(y + ((((z << 4) ^ (z >>> 5)) + z) ^ (sum + key[sum & 3])));
    sum = u32(sum + XTEA_DELTA);
    z = u32(z + ((((y << 4) ^ (y >>> 5)) + y) ^ (sum + key[(sum >>> 11) & 3])));
  }
  return { left: y, right: z };
}

function xteaDecryptWords(v0, v1, key) {
  let y = u32(v0);
  let z = u32(v1);
  let sum = u32(XTEA_DELTA * XTEA_ROUNDS);
  for (let i = 0; i < XTEA_ROUNDS; i++) {
    z = u32(z - ((((y << 4) ^ (y >>> 5)) + y) ^ (sum + key[(sum >>> 11) & 3])));
    sum = u32(sum - XTEA_DELTA);
    y = u32(y - ((((z << 4) ^ (z >>> 5)) + z) ^ (sum + key[sum & 3])));
  }
  return { left: y, right: z };
}

function encryptBlock(block, offset, keyWords, out, outOffset) {
  const left = bytesToWordLE(block, offset);
  const right = bytesToWordLE(block, offset + 4);
  const res = xteaEncryptWords(left, right, keyWords);
  wordToBytesLE(res.left, out, outOffset);
  wordToBytesLE(res.right, out, outOffset + 4);
}

function decryptBlock(block, offset, keyWords, out, outOffset) {
  const left = bytesToWordLE(block, offset);
  const right = bytesToWordLE(block, offset + 4);
  const res = xteaDecryptWords(left, right, keyWords);
  wordToBytesLE(res.left, out, outOffset);
  wordToBytesLE(res.right, out, outOffset + 4);
}

function pkcs7Pad(data) {
  const remainder = data.length % BLOCK_SIZE;
  const padLen = remainder === 0 ? BLOCK_SIZE : BLOCK_SIZE - remainder;
  const out = new Uint8Array(data.length + padLen);
  out.set(data);
  out.fill(padLen, data.length);
  return out;
}

function pkcs7Unpad(data) {
  if (!data.length) throw new Error("Empty data");
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > BLOCK_SIZE) throw new Error("Invalid PKCS7 padding");
  for (let i = data.length - padLen; i < data.length; i++) {
    if (data[i] !== padLen) throw new Error("Invalid PKCS7 padding");
  }
  return data.subarray(0, data.length - padLen);
}

function xorBlock(a, aOffset, b, bOffset, out, outOffset) {
  for (let i = 0; i < BLOCK_SIZE; i++) {
    out[outOffset + i] = a[aOffset + i] ^ b[bOffset + i];
  }
}

function cbcEncrypt(data, key, iv) {
  const keyWords = keyToWords(key);
  const padded = pkcs7Pad(data);
  const out = new Uint8Array(padded.length);
  const work = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE) {
    xorBlock(padded, offset, prev, 0, work, 0);
    encryptBlock(work, 0, keyWords, out, offset);
    prev = out.subarray(offset, offset + BLOCK_SIZE);
  }
  return out;
}

function cbcDecrypt(data, key, iv) {
  const keyWords = keyToWords(key);
  const out = new Uint8Array(data.length);
  const block = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < data.length; offset += BLOCK_SIZE) {
    decryptBlock(data, offset, keyWords, block, 0);
    xorBlock(block, 0, prev, 0, out, offset);
    prev = data.subarray(offset, offset + BLOCK_SIZE);
  }
  return pkcs7Unpad(out);
}

function canUseEmbeddedIv(data, ivSize, blockSize) {
  return data.length > ivSize && (data.length - ivSize) % blockSize === 0;
}

function createRandomBytes(length) {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
}

function encryptBytes(data, key = KEY_BYTES) {
  const iv = createRandomBytes(BLOCK_SIZE);
  const ciphertext = cbcEncrypt(data, key, iv);
  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv, 0);
  out.set(ciphertext, iv.length);
  return out;
}

function decryptBytes(data, key = KEY_BYTES, legacyIv = IV_BYTES) {
  if (canUseEmbeddedIv(data, BLOCK_SIZE, BLOCK_SIZE)) {
    try {
      const iv = data.subarray(0, BLOCK_SIZE);
      const ciphertext = data.subarray(BLOCK_SIZE);
      return cbcDecrypt(ciphertext, key, iv);
    } catch {
      // fall through
    }
  }
  return cbcDecrypt(data, key, legacyIv);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

function encryptHex(plain, key = XTEA_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function xteaDecrypt(buffer) {
  return decryptBytes(buffer, XTEA_KEY_BYTES, XTEA_IV_BYTES);
}

function xteaEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, XTEA_KEY_BYTES);
}
`;

const indexPath = path.join(ROOT, 'cloudflare-worker/index.js');
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent
  .replace(/Triple DES \(CBC \+ PKCS7\)\. /g, 'XTEA (CBC + PKCS7). ')
  .replace(/url-encoded TripleDES hex/g, 'url-encoded XTEA hex')
  .replace(/TripleDES hex/g, 'XTEA hex');

const inlineRe =
  /\/\* =+\s*\*\/\s*\n\/\* (?:Blowfish|Triple DES|XTEA) \(CBC \+ PKCS7\)[\s\S]*?function (?:blowfish|tripledes|xtea)EncryptToHex\(jsonStr\) \{[\s\S]*?\}\s*\n/;

if (inlineRe.test(indexContent)) {
  indexContent = indexContent.replace(inlineRe, `${workerInline}\n\n`);
} else {
  throw new Error('Could not find cipher inline block in cloudflare-worker/index.js');
}

indexContent = indexContent
  .replace(/\btripledesDecrypt\b/g, 'xteaDecrypt')
  .replace(/\btripledesEncryptToHex\b/g, 'xteaEncryptToHex')
  .replace(/TRIPLEDES_KEY_BYTES/g, 'XTEA_KEY_BYTES')
  .replace(/TRIPLEDES_IV_BYTES/g, 'XTEA_IV_BYTES');

fs.writeFileSync(indexPath, indexContent);

// Patch CryptoService
const servicesDir = path.join(ROOT, 'services');
for (const name of fs.readdirSync(servicesDir)) {
  if (!/Crypto.+Service\.ts$/i.test(name) && !/toService\.ts$/i.test(name)) continue;
  const filePath = path.join(servicesDir, name);
  let content = fs.readFileSync(filePath, 'utf8');
  const importRe = /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/(?:rc6|gost|blowfish|rc4|tripledes|fernet|ascon|rot47|xtea)['"]\s*;/;
  if (!importRe.test(content)) continue;
  content = content.replace(
    importRe,
    `import {
  hexToBytes,
  xteaDecryptBytes,
  xteaEncryptBytes,
  xteaEncryptHex,
} from './xtea';`,
  );
  for (const algo of ['gost', 'rc6', 'blowfish', 'rc4', 'tripledes', 'fernet', 'ascon', 'rot47']) {
    content = content.replace(new RegExp(`${algo}EncryptHex`, 'g'), 'xteaEncryptHex');
    content = content.replace(new RegExp(`${algo}DecryptBytes`, 'g'), 'xteaDecryptBytes');
    content = content.replace(new RegExp(`${algo}EncryptBytes`, 'g'), 'xteaEncryptBytes');
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched', path.relative(ROOT, filePath));
}

if (fs.existsSync(HELPER_EXT)) {
  fs.writeFileSync(path.join(HELPER_EXT, 'xtea.js'), jsModule);
  console.log('Synced helper xtea.js');
}

// Self-test
const xtea = require(path.join(ROOT, 'cloudflare-worker/xtea.js'));
const sample = 'roundtrip-xtea';
const enc = xtea.xteaEncryptHex(sample);
const dec = xtea.xteaDecryptHex(enc);
if (dec !== sample) {
  console.error('Self-test failed', { enc, dec });
  process.exit(1);
}

console.log('Wrote services/xtea.ts');
console.log('Wrote cloudflare-worker/xtea.js');
console.log('Patched cloudflare-worker/index.js');
console.log('Self-test OK');
