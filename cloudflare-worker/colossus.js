/* ============================= */
/* Colossus (Lorenz-inspired)    */
/* https://en.wikipedia.org/wiki/Colossus_computer */
/* ============================= */

const COLOSSUS_KEY_STRING = "UC8W2vuF5ZfTYJwyF4sFrhqsCYDz";
const COLOSSUS_IV_STRING = "y8cCieTQDFiooj6nJz";
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

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

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
