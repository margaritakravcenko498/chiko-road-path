#!/usr/bin/env node
/**
 * Generates Triple DES (3DES-EDE3) CBC+PKCS7 modules for app + worker + helper.
 * Validates against Node crypto des-ede3-cbc.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const BLOCK_SIZE = 8;
const KEY_STRING = '1234567890ABCDEF12345678';
const IV_STRING = 'ABCDEF12';

const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
];
const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32,
];
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
];
const FP = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25,
];
const E = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1,
];
const P = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
];
const SBOX = [
  [
    14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7, 0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8, 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0, 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13,
  ],
  [
    15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10, 3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5, 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15, 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9,
  ],
  [
    10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8, 13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1, 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7, 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12,
  ],
  [
    7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15, 13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9, 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4, 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14,
  ],
  [
    2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9, 14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6, 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14, 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3,
  ],
  [
    12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11, 10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8, 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6, 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13,
  ],
  [
    4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1, 13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6, 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2, 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12,
  ],
  [
    13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7, 1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2, 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8, 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11,
  ],
];
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function getBit(bytes, bitIndex1) {
  const i = bitIndex1 - 1;
  return (bytes[Math.floor(i / 8)] >>> (7 - (i % 8))) & 1;
}

function setBit(bytes, bitIndex1, value) {
  const i = bitIndex1 - 1;
  const byteIndex = Math.floor(i / 8);
  const bit = 7 - (i % 8);
  if (value) bytes[byteIndex] |= 1 << bit;
  else bytes[byteIndex] &= ~(1 << bit);
}

function permute(input, table) {
  const out = new Uint8Array(Math.ceil(table.length / 8));
  for (let i = 0; i < table.length; i++) {
    setBit(out, i + 1, getBit(input, table[i]));
  }
  return out;
}

function leftRotate28(bits7, shifts) {
  // 28 bits packed into first 3.5 bytes of 4-byte buffer (bits 1..28)
  const bits = [];
  for (let i = 1; i <= 28; i++) bits.push(getBit(bits7, i));
  const rotated = bits.slice(shifts).concat(bits.slice(0, shifts));
  const out = new Uint8Array(4);
  for (let i = 0; i < 28; i++) setBit(out, i + 1, rotated[i]);
  return out;
}

function combine28(c, d) {
  const out = new Uint8Array(7);
  for (let i = 1; i <= 28; i++) setBit(out, i, getBit(c, i));
  for (let i = 1; i <= 28; i++) setBit(out, 28 + i, getBit(d, i));
  return out;
}

function desExpandKey(key8) {
  const keyPerm = permute(key8, PC1);
  let c = new Uint8Array(4);
  let d = new Uint8Array(4);
  for (let i = 1; i <= 28; i++) setBit(c, i, getBit(keyPerm, i));
  for (let i = 1; i <= 28; i++) setBit(d, i, getBit(keyPerm, 28 + i));

  const subkeys = [];
  for (let round = 0; round < 16; round++) {
    c = leftRotate28(c, SHIFTS[round]);
    d = leftRotate28(d, SHIFTS[round]);
    subkeys.push(permute(combine28(c, d), PC2));
  }
  return subkeys;
}

function desF(r4, subkey) {
  const expanded = permute(r4, E);
  const xored = new Uint8Array(6);
  for (let i = 0; i < 6; i++) xored[i] = expanded[i] ^ subkey[i];

  const sOut = new Uint8Array(4);
  for (let s = 0; s < 8; s++) {
    const bitOffset = s * 6;
    const b1 = getBit(xored, bitOffset + 1);
    const b2 = getBit(xored, bitOffset + 2);
    const b3 = getBit(xored, bitOffset + 3);
    const b4 = getBit(xored, bitOffset + 4);
    const b5 = getBit(xored, bitOffset + 5);
    const b6 = getBit(xored, bitOffset + 6);
    const row = (b1 << 1) | b6;
    const col = (b2 << 3) | (b3 << 2) | (b4 << 1) | b5;
    const val = SBOX[s][row * 16 + col];
    for (let bit = 0; bit < 4; bit++) {
      setBit(sOut, s * 4 + bit + 1, (val >>> (3 - bit)) & 1);
    }
  }
  return permute(sOut, P);
}

function desCryptBlock(block8, subkeys, decrypt) {
  let state = permute(block8, IP);
  let left = state.subarray(0, 4);
  let right = state.subarray(4, 8);
  left = new Uint8Array(left);
  right = new Uint8Array(right);

  for (let round = 0; round < 16; round++) {
    const sk = subkeys[decrypt ? 15 - round : round];
    const newLeft = new Uint8Array(right);
    const f = desF(right, sk);
    const newRight = new Uint8Array(4);
    for (let i = 0; i < 4; i++) newRight[i] = left[i] ^ f[i];
    left = newLeft;
    right = newRight;
  }

  const preout = new Uint8Array(8);
  preout.set(right, 0);
  preout.set(left, 4);
  return permute(preout, FP);
}

function splitTripleKeys(keyBytes) {
  if (keyBytes.length === 24) {
    return [keyBytes.subarray(0, 8), keyBytes.subarray(8, 16), keyBytes.subarray(16, 24)];
  }
  if (keyBytes.length === 16) {
    return [keyBytes.subarray(0, 8), keyBytes.subarray(8, 16), keyBytes.subarray(0, 8)];
  }
  throw new Error('Triple DES key must be 16 or 24 bytes');
}

function expandTripleKey(keyBytes) {
  const [k1, k2, k3] = splitTripleKeys(keyBytes);
  return {
    k1: desExpandKey(k1),
    k2: desExpandKey(k2),
    k3: desExpandKey(k3),
  };
}

function encryptBlock(block, offset, ctx, out, outOffset) {
  const input = block.subarray(offset, offset + 8);
  const step1 = desCryptBlock(input, ctx.k1, false);
  const step2 = desCryptBlock(step1, ctx.k2, true);
  const step3 = desCryptBlock(step2, ctx.k3, false);
  out.set(step3, outOffset);
}

function decryptBlock(block, offset, ctx, out, outOffset) {
  const input = block.subarray(offset, offset + 8);
  const step1 = desCryptBlock(input, ctx.k3, true);
  const step2 = desCryptBlock(step1, ctx.k2, false);
  const step3 = desCryptBlock(step2, ctx.k1, true);
  out.set(step3, outOffset);
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
  if (!data.length) throw new Error('Empty data');
  const padLen = data[data.length - 1];
  if (padLen < 1 || padLen > BLOCK_SIZE) throw new Error('Invalid PKCS7 padding');
  for (let i = data.length - padLen; i < data.length; i++) {
    if (data[i] !== padLen) throw new Error('Invalid PKCS7 padding');
  }
  return data.subarray(0, data.length - padLen);
}

function xorBlock(a, aOffset, b, bOffset, out, outOffset) {
  for (let i = 0; i < BLOCK_SIZE; i++) {
    out[outOffset + i] = a[aOffset + i] ^ b[bOffset + i];
  }
}

function cbcEncrypt(data, key, iv) {
  const ctx = expandTripleKey(key);
  const padded = pkcs7Pad(data);
  const out = new Uint8Array(padded.length);
  const work = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < padded.length; offset += BLOCK_SIZE) {
    xorBlock(padded, offset, prev, 0, work, 0);
    encryptBlock(work, 0, ctx, out, offset);
    prev = out.subarray(offset, offset + BLOCK_SIZE);
  }
  return out;
}

function cbcDecrypt(data, key, iv) {
  const ctx = expandTripleKey(key);
  const out = new Uint8Array(data.length);
  const block = new Uint8Array(BLOCK_SIZE);
  let prev = iv;
  for (let offset = 0; offset < data.length; offset += BLOCK_SIZE) {
    decryptBlock(data, offset, ctx, block, 0);
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
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(out);
    return out;
  }
  try {
    const { randomBytes } = require('crypto');
    out.set(randomBytes(length));
    return out;
  } catch {
    for (let i = 0; i < length; i++) out[i] = Math.floor(Math.random() * 256);
    return out;
  }
}

const KEY_BYTES = new TextEncoder().encode(KEY_STRING);
const IV_BYTES = new TextEncoder().encode(IV_STRING);

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
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hexToBytes(hex) {
  const normalized = hex.trim();
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function encryptHex(plain, key = KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

// --- Self-tests vs Node crypto ---
{
  const fixedIv = Buffer.from(IV_STRING, 'utf8');
  const keyBuf = Buffer.from(KEY_STRING, 'utf8');
  const plain = Buffer.from('hello Triple DES!', 'utf8');
  const padded = pkcs7Pad(plain);
  const ours = Buffer.from(cbcEncrypt(plain, KEY_BYTES, IV_BYTES));
  const cipher = crypto.createCipheriv('des-ede3-cbc', keyBuf, fixedIv);
  cipher.setAutoPadding(true);
  const nodeEnc = Buffer.concat([cipher.update(plain), cipher.final()]);
  if (!ours.equals(nodeEnc)) {
    console.error('CBC encrypt mismatch vs Node crypto');
    console.error('ours', ours.toString('hex'));
    console.error('node', nodeEnc.toString('hex'));
    process.exit(1);
  }
  const back = Buffer.from(cbcDecrypt(ours, KEY_BYTES, IV_BYTES));
  if (!back.equals(plain)) {
    console.error('CBC decrypt failed');
    process.exit(1);
  }
  const testHex = encryptHex('hello');
  const testDec = new TextDecoder().decode(decryptBytes(hexToBytes(testHex)));
  if (testDec !== 'hello') {
    console.error('Embedded-IV self-test failed:', testDec);
    process.exit(1);
  }
}

const TABLES = `const PC1 = ${JSON.stringify(PC1)};
const PC2 = ${JSON.stringify(PC2)};
const IP = ${JSON.stringify(IP)};
const FP = ${JSON.stringify(FP)};
const E = ${JSON.stringify(E)};
const P = ${JSON.stringify(P)};
const SBOX = ${JSON.stringify(SBOX)};
const SHIFTS = ${JSON.stringify(SHIFTS)};`;

const fnNames = [
  getBit,
  setBit,
  permute,
  leftRotate28,
  combine28,
  desExpandKey,
  desF,
  desCryptBlock,
  splitTripleKeys,
  expandTripleKey,
  encryptBlock,
  decryptBlock,
  pkcs7Pad,
  pkcs7Unpad,
  xorBlock,
  cbcEncrypt,
  cbcDecrypt,
  canUseEmbeddedIv,
  createRandomBytes,
  encryptBytes,
  decryptBytes,
];

const fnBlock = fnNames.map((fn) => fn.toString()).join('\n\n');

const jsModule = `/**
 * Triple DES (3DES-EDE3) block cipher (CBC + PKCS7).
 * https://en.wikipedia.org/wiki/Triple_DES
 */
const TRIPLEDES_BLOCK_SIZE = ${BLOCK_SIZE};

${TABLES}

const TRIPLEDES_KEY_STRING = '${KEY_STRING}';
const TRIPLEDES_IV_STRING = '${IV_STRING}';
const TRIPLEDES_KEY_BYTES = new TextEncoder().encode(TRIPLEDES_KEY_STRING);
const TRIPLEDES_IV_BYTES = new TextEncoder().encode(TRIPLEDES_IV_STRING);

const BLOCK_SIZE = TRIPLEDES_BLOCK_SIZE;
const KEY_BYTES = TRIPLEDES_KEY_BYTES;
const IV_BYTES = TRIPLEDES_IV_BYTES;

${fnBlock}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hexToBytes(hex) {
  const normalized = hex.trim();
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function encryptHex(plain, key = TRIPLEDES_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function tripledesCredentialsToBuffers(credentials) {
  const key = String(credentials?.key ?? TRIPLEDES_KEY_STRING);
  const iv = String(credentials?.iv ?? TRIPLEDES_IV_STRING);
  return {
    keyBytes: new TextEncoder().encode(key),
    ivBytes: new TextEncoder().encode(iv),
  };
}

function tripledesDecrypt(buffer) {
  return decryptBytes(buffer, TRIPLEDES_KEY_BYTES, TRIPLEDES_IV_BYTES);
}

function tripledesEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, TRIPLEDES_KEY_BYTES);
}

function tripledesCbcEncrypt(data, key, iv) {
  if (key.length !== 16 && key.length !== 24) throw new Error('Triple DES key must be 16 or 24 bytes');
  if (iv.length !== TRIPLEDES_BLOCK_SIZE) throw new Error('Triple DES CBC requires an 8-byte IV');
  return cbcEncrypt(data, key, iv);
}

function tripledesCbcDecrypt(data, key, iv) {
  if (key.length !== 16 && key.length !== 24) throw new Error('Triple DES key must be 16 or 24 bytes');
  if (iv.length !== TRIPLEDES_BLOCK_SIZE) throw new Error('Triple DES CBC requires an 8-byte IV');
  if (data.length % TRIPLEDES_BLOCK_SIZE !== 0) throw new Error('Ciphertext length must be a multiple of 8');
  return cbcDecrypt(data, key, iv);
}

function tripledesEncryptBytes(data, key = TRIPLEDES_KEY_BYTES) {
  return encryptBytes(data, key);
}

function tripledesDecryptBytes(data, key = TRIPLEDES_KEY_BYTES, legacyIv = TRIPLEDES_IV_BYTES) {
  return decryptBytes(data, key, legacyIv);
}

function tripledesEncryptHex(plain, key = TRIPLEDES_KEY_BYTES) {
  return encryptHex(plain, key);
}

function tripledesDecryptHex(hex, key = TRIPLEDES_KEY_BYTES) {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) return '';
    const decrypted = decryptBytes(hexToBytes(normalized), key);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

const DEFAULT_TRIPLEDES_KEY = TRIPLEDES_KEY_STRING;
const DEFAULT_TRIPLEDES_IV = TRIPLEDES_IV_STRING;

module.exports = {
  DEFAULT_TRIPLEDES_KEY,
  DEFAULT_TRIPLEDES_IV,
  TRIPLEDES_BLOCK_SIZE,
  TRIPLEDES_IV_BYTES,
  TRIPLEDES_KEY_BYTES,
  TRIPLEDES_IV_STRING,
  TRIPLEDES_KEY_STRING,
  tripledesCredentialsToBuffers,
  bytesToHex,
  cbcEncrypt,
  cbcDecrypt,
  decryptBytes,
  encryptBytes,
  encryptHex,
  hexToBytes,
  tripledesDecrypt,
  tripledesEncryptToHex,
  tripledesCbcEncrypt,
  tripledesCbcDecrypt,
  tripledesEncryptBytes,
  tripledesDecryptBytes,
  tripledesEncryptHex,
  tripledesDecryptHex,
};
`;

const tsContent = `/**
 * Triple DES (3DES-EDE3) block cipher (CBC + PKCS7).
 * https://en.wikipedia.org/wiki/Triple_DES
 */

export const TRIPLEDES_BLOCK_SIZE = ${BLOCK_SIZE};

${TABLES}

export const TRIPLEDES_KEY_STRING = '${KEY_STRING}';
export const TRIPLEDES_IV_STRING = '${IV_STRING}';
export const TRIPLEDES_KEY_BYTES = new TextEncoder().encode(TRIPLEDES_KEY_STRING);
export const TRIPLEDES_IV_BYTES = new TextEncoder().encode(TRIPLEDES_IV_STRING);

const BLOCK_SIZE = TRIPLEDES_BLOCK_SIZE;
const KEY_BYTES = TRIPLEDES_KEY_BYTES;
const IV_BYTES = TRIPLEDES_IV_BYTES;

${fnBlock}

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

function encryptHex(plain: string, key: Uint8Array = TRIPLEDES_KEY_BYTES): string {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

export function tripledesCbcEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (key.length !== 16 && key.length !== 24) throw new Error('Triple DES key must be 16 or 24 bytes');
  if (iv.length !== TRIPLEDES_BLOCK_SIZE) throw new Error('Triple DES CBC requires an 8-byte IV');
  return cbcEncrypt(data, key, iv);
}

export function tripledesCbcDecrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  if (key.length !== 16 && key.length !== 24) throw new Error('Triple DES key must be 16 or 24 bytes');
  if (iv.length !== TRIPLEDES_BLOCK_SIZE) throw new Error('Triple DES CBC requires an 8-byte IV');
  if (data.length % TRIPLEDES_BLOCK_SIZE !== 0) throw new Error('Ciphertext length must be a multiple of 8');
  return cbcDecrypt(data, key, iv);
}

export function tripledesEncryptBytes(data: Uint8Array, key: Uint8Array = TRIPLEDES_KEY_BYTES): Uint8Array {
  const iv = createRandomBytes(TRIPLEDES_BLOCK_SIZE);
  const ciphertext = tripledesCbcEncrypt(data, key, iv);
  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv, 0);
  out.set(ciphertext, iv.length);
  return out;
}

export function tripledesDecryptBytes(
  data: Uint8Array,
  key: Uint8Array = TRIPLEDES_KEY_BYTES,
  legacyIv: Uint8Array = TRIPLEDES_IV_BYTES,
): Uint8Array {
  if (canUseEmbeddedIv(data, TRIPLEDES_BLOCK_SIZE, TRIPLEDES_BLOCK_SIZE)) {
    try {
      const iv = data.subarray(0, TRIPLEDES_BLOCK_SIZE);
      const ciphertext = data.subarray(TRIPLEDES_BLOCK_SIZE);
      return tripledesCbcDecrypt(ciphertext, key, iv);
    } catch {
      // fall through to legacy fixed IV
    }
  }
  return tripledesCbcDecrypt(data, key, legacyIv);
}

export function tripledesEncryptHex(plain: string, key: Uint8Array = TRIPLEDES_KEY_BYTES): string {
  return encryptHex(plain, key);
}

export function tripledesDecryptHex(hex: string, key: Uint8Array = TRIPLEDES_KEY_BYTES): string {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) {
      return '';
    }
    const decrypted = tripledesDecryptBytes(hexToBytes(normalized), key);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

export { bytesToHex, hexToBytes };
`;

fs.writeFileSync(path.join(ROOT, 'services/tripledes.ts'), tsContent);
fs.writeFileSync(path.join(ROOT, 'cloudflare-worker/tripledes.js'), jsModule);

const workerCreateRandomBytes = function createRandomBytes(length) {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
};

const workerFnBlock = [
  getBit,
  setBit,
  permute,
  leftRotate28,
  combine28,
  desExpandKey,
  desF,
  desCryptBlock,
  splitTripleKeys,
  expandTripleKey,
  encryptBlock,
  decryptBlock,
  pkcs7Pad,
  pkcs7Unpad,
  xorBlock,
  cbcEncrypt,
  cbcDecrypt,
  canUseEmbeddedIv,
  workerCreateRandomBytes,
  encryptBytes,
  decryptBytes,
]
  .map((fn) => fn.toString())
  .join('\n\n');

const workerInlineBlock = `/* ============================= */
/* Triple DES (CBC + PKCS7)      */
/* https://en.wikipedia.org/wiki/Triple_DES */
/* ============================= */

const TRIPLEDES_BLOCK_SIZE = ${BLOCK_SIZE};

${TABLES}

const TRIPLEDES_KEY_STRING = "${KEY_STRING}";
const TRIPLEDES_IV_STRING = "${IV_STRING}";
const TRIPLEDES_KEY_BYTES = new TextEncoder().encode(TRIPLEDES_KEY_STRING);
const TRIPLEDES_IV_BYTES = new TextEncoder().encode(TRIPLEDES_IV_STRING);

const BLOCK_SIZE = TRIPLEDES_BLOCK_SIZE;
const KEY_BYTES = TRIPLEDES_KEY_BYTES;
const IV_BYTES = TRIPLEDES_IV_BYTES;

${workerFnBlock}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

function encryptHex(plain, key = TRIPLEDES_KEY_BYTES) {
  return bytesToHex(encryptBytes(new TextEncoder().encode(plain), key));
}

function tripledesDecrypt(buffer) {
  return decryptBytes(buffer, TRIPLEDES_KEY_BYTES, TRIPLEDES_IV_BYTES);
}

function tripledesEncryptToHex(jsonStr) {
  return encryptHex(jsonStr, TRIPLEDES_KEY_BYTES);
}`;

const indexPath = path.join(ROOT, 'cloudflare-worker/index.js');
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(
  /Self-contained single file for manual deploy \(.*?\)\./,
  'Self-contained single file for manual deploy (Triple DES inlined below).',
);

const importRe = /import \{ (?:blowfish|tripledes)Decrypt, (?:blowfish|tripledes)EncryptToHex \} from "\.\/(?:blowfish|tripledes)\.js";\s*\n/;
const inlineRe =
  /\/\* =+\s*\*\/\s*\n\/\* (?:Blowfish|Triple DES) \(CBC \+ PKCS7\)\s*\*\/[\s\S]*?function (?:blowfish|tripledes)EncryptToHex\(jsonStr\) \{[\s\S]*?\}\s*\n/;

if (importRe.test(indexContent)) {
  indexContent = indexContent.replace(importRe, `${workerInlineBlock}\n\n`);
} else if (inlineRe.test(indexContent)) {
  indexContent = indexContent.replace(inlineRe, `${workerInlineBlock}\n\n`);
} else {
  indexContent = indexContent.replace(
    /const PUSH_DATA_KEY = "eb";\s*\n/,
    `const PUSH_DATA_KEY = "eb";\n\n${workerInlineBlock}\n\n`,
  );
}

indexContent = indexContent
  .replace(/\bblowfishDecrypt\b/g, 'tripledesDecrypt')
  .replace(/\bblowfishEncryptToHex\b/g, 'tripledesEncryptToHex');

fs.writeFileSync(indexPath, indexContent);

const extDir = path.resolve(
  ROOT,
  '../../CursorExtensions/ReactNativeAppHelperExtension/vscode-rn-app-helper-tripledes',
);
fs.mkdirSync(extDir, { recursive: true });
fs.writeFileSync(path.join(extDir, 'tripledes.js'), jsModule);

console.log('Self-test OK (matches Node des-ede3-cbc)');
console.log('Wrote services/tripledes.ts');
console.log('Wrote cloudflare-worker/tripledes.js');
console.log('Wrote cloudflare-worker/index.js (Triple DES inlined)');
console.log('Wrote extension tripledes.js');
