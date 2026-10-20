const keyBytes = Buffer.from("V5bDsNikWKK3RTHzY5MTcFhsnTN5", "utf8");
const CHI_LENS = [41, 31, 29, 26, 23, 43, 47, 37];
const PSI_LENS = [43, 47, 51, 53, 59, 61, 67, 71];
const MU_LENS = [61, 37];

function seedState(bytes) {
  let s = 0x811c9dc5 | 0;
  for (const b of bytes) {
    s = (s ^ (b & 0xff)) | 0;
    s = Math.imul(s, 16777619);
  }
  if (!bytes.length) s = (s ^ 0xa5a5a5a5) | 0;
  return s;
}
function nextU32(state) {
  let x = state[0];
  x = (x ^ (x << 13)) | 0;
  x = (x ^ (x >>> 17)) | 0;
  x = (x ^ (x << 5)) | 0;
  state[0] = x;
  return x;
}
function u32Mod(value, len) {
  return Number(BigInt(value >>> 0) % BigInt(len));
}
function fillWheel(st, len) {
  const pins = new Array(len);
  let ones = 0;
  for (let i = 0; i < len; i++) {
    pins[i] = nextU32(st) & 1;
    ones += pins[i];
  }
  if (ones === 0) pins[0] = 1;
  if (ones === len) pins[0] = 0;
  return { pins, pos: u32Mod(nextU32(st), len), len };
}
function transform(data) {
  const st = [seedState(keyBytes)];
  const chi = CHI_LENS.map((l) => fillWheel(st, l));
  const psi = PSI_LENS.map((l) => fillWheel(st, l));
  const mu = MU_LENS.map((l) => fillWheel(st, l));
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    let chiB = 0;
    let psiB = 0;
    for (let b = 0; b < 8; b++) {
      chiB |= chi[b].pins[chi[b].pos] << b;
      psiB |= psi[b].pins[psi[b].pos] << b;
    }
    out[i] = data[i] ^ chiB ^ psiB;
    for (let b = 0; b < 8; b++) chi[b].pos = (chi[b].pos + 1) % chi[b].len;
    const mu0 = mu[0].pins[mu[0].pos];
    mu[0].pos = (mu[0].pos + 1) % mu[0].len;
    if (mu0 !== 0) mu[1].pos = (mu[1].pos + 1) % mu[1].len;
    if (mu[1].pins[mu[1].pos] !== 0) {
      for (let b = 0; b < 8; b++) psi[b].pos = (psi[b].pos + 1) % psi[b].len;
    }
  }
  return out;
}
const hex = "47030ED2871593A37CA1D89459D36CBCD1F99815383F26CC";
const plain = transform(Buffer.from(hex, "hex")).toString("utf8");
console.log(JSON.stringify(plain));
