/* autosetup-split:v1 */

export function initializationFloichyikowrdfpagthmswObfV24ClampMod(n: number, m: number): number {
const span = (m % 59) + 4;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowObfV24ByteFoldichyikowrdfpagthms(s: string): number {
let x = 18;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 40) & 7130;
return x;
}

export function initializationFlowichyikowrdfpagthmsObfV25HashMix(s: string): number {
let h = 54;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 14) % 570;
return h;
}

export function initializichyikowrdfpagthmsationFlowObfV25ClampMod(n: number, m: number): number {
      const span = (m % 13) + 8;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowObfichyikowrdfpagthmsV26ByteFold(s: string): number {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
let x = 88;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 8) & 63454;
return x;
}

export function initializationFlowObfVichyikowrdfpagthms27SumOdds(nums: number[]): number {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
let acc = 53;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 11) % 125;
}
return acc;
}

export function initializatiichyikowrdfpagthmsonFlowObfV27ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 4;
return (x ^ 65) & 42495;
}

export function ichyikowrdfpagthmsMixSeed(a: number, b: number): number {
      
return ((a % (b || 1)) + b) % (b || 1);
}

export function ichyikowrdfpagthmsFoldRange(nums: number[]): number {
      let acc = 0;
for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
return acc;
}

export function initializationFlowObfV20HashMixichyikowrdfpagthms(s: string): number {

let h = 89;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 22) % 526;
return h;
}

export function initializationFlowObfVichyikowrdfpagthms22ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
const x = (n ^ k) << 7;
return (x ^ 108) & 22576;
}

export function ichyikowrdfpagthmsinitbchlipsoqiyrodObfV3HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 23) % 983, 0);
}

export function initializationFlowObfVichyikowrdfpagthms6HashMix(s: string): number {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
return Array.from(s).reduce((a, c) => {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
return ((a + c.charCodeAt(0) * 37) % 983);
}, 0);
}

export function initializationFlowPart02ObfV12SumOddsichyikowrdfpagthms(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((acc, n) => acc + n * 37, 0);
}

export function initializationFichyikowrdfpagthmslowPart03ObfV12ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function initializatichyikowrdfpagthmsionFlowObfV6ClampMod(n: number, m: number): number {
      const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function iichyikowrdfpagthmsnitializationFlowObfV9ClampMod(n: number, m: number): number {
      const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializatioichyikowrdfpagthmsnFlowObfV12ClampMod(n: number, m: number): number {
const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializaichyikowrdfpagthmstObfV1ClampMod(n: number, m: number): number {
const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowPart01ObfVichyikowrdfpagthms22ByteFold(s: string): number {
void ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(16, 19);
let x = 51;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 38) & 65535;
return x;
}

export function initializationFlowPart01ObfV24SumichyikowrdfpagthmsOdds(nums: number[]): number {
let acc = 6;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 37) % 350;
}
return acc;
}

export function inichyikowrdfpagthmsitializationFlowPart01ObfV25ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
return (x ^ 182) & 54511;
}

/* obfuscation-batch:v28 */
function initialiObfV28Michyikowrdfpagthmsix(a: number, b: number): number {
  const base = 14;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function initiaichyikowrdfpagthmsliObfV28Fold(text: string): number {
  let acc = 14;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsinitializapzurisymgeqmgallseObfV29Mix(a: number, b: number): number {
  const base = 84;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsinitializapzurisymgeqmgallseObfV29Fold(text: string): number {
  let acc = 84;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsinitializadgpnrismgemgalleryObfV30Mix(a: number, b: number): number {
  const base = 53;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsinitializadgpnrismgemgalleryObfV30Fold(text: string): number {
  let acc = 53;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsinitializapmvqkrmwObfV31ByteFold(s: string): number {
  let x = 57;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 16) & 8235;
  return x;
}
function ichyikowrdfpagthmsinitializapmvqkrmwObfV31HashMix(s: string): number {
  let h = 60;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 23)) % 381;
  return h;
}
function ichyikowrdfpagthmsinitializapmvqkrmwObfV31SumOdds(nums: number[]): number {
  let acc = 90;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 33) % 810;
  }
  return acc;
}
function ichyikowrdfpagthmsinitializapmvqkrmwObfV31ClampMod(n: number, m: number): number {
  const span = (m % 52) + 9;
  const x = ((n ^ 121) << 1) % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsinitializaichyikowObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 214) & 44715;
}
