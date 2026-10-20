/* autosetup-split:v1 */

export function iniichyikowrdfpagthmstializationFlowObfV17ByteFold(s: string): number {
      let x = 18;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 35) ^ 4;
return x & 3083;
}

export function initializationFlowObfV20ichyikowrdfpagthmsSumOdds(nums: number[]): number {
let acc = 11;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 42) % 725;
}
return acc;
}

export function initializationFlowObfV22ByteFoichyikowrdfpagthmsld(s: string): number {
      let x = 22;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 17) & 65535;
return x;
}

export function initiaichyikowrdfpagthmslizatObfV1HashMix(s: string): number {
      return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 17) % 997, 0);
}

export function initializationFlowObichyikowrdfpagthmsfV8HashMix(s: string): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(78, 73);
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold("2dm");
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix("g1a");
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV28ClampMod(72, 27);
      return Array.from(s).reduce((a, c) => {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(78, 73);
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold("2dm");
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix("g1a");
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV28ClampMod(72, 27);
return ((a + c.charCodeAt(0) * 43) % 991);
}, 0);
}

export function initializationFlowPart01ObfichyikowrdfpagthmsV5ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(78, 73);
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold("2dm");
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix("g1a");
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function initializaichyikowrdfpagthmstObfV1SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n, 0);
}

export function initializaichyikowrdfpagthmstionFlowObfV13HashMix(s: string): number {
let h = 57;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 12) % 626;
return h;
}

export function initializationFlowObfichyikowrdfpagthmsV15HashMix(s: string): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(78, 73);
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold("2dm");
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix("g1a");
      let h = 90;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 43) % 501;
return h;
}

export function inichyikowrdfpagthmsitializationFlowObfV5ClampMod(n: number, m: number): number {
const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowichyikowrdfpagthmsObfV6SumOdds(nums: number[]): number {
let acc = 0;
for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
return acc;
}

export function iichyikowrdfpagthmsnitializationFlowPart02ObfV12HashMix(n: number, m: number): number {
      const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializaichyikowrdfpagthmstionFlowPart01ObfV5SumOdds(nums: number[]): number {
let acc = 0;
for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
return acc;
}

export function ichyikowrdfpagthmsinitbchlipsoqiyrodObfV4HashMix(s: string): number {
let h = 19;
for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) & 65535;
return h;
}

export function ichyikowrdfpagthmsinitbchlipsoqiyrodObfV3ClampMod(n: number, m: number): number {
const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowPart01ObfV22ShichyikowrdfpagthmsiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
return (x ^ 124) & 15756;
}

export function initializatiichyikowrdfpagthmsonFlowPart02ObfV24ShiftXor(n: number, k: number): number {
      const x = (n ^ k) << 3;
return (x ^ 240) & 56653;
}

export function initializationFlowPart02ObfV25ClampMoichyikowrdfpagthmsd(n: number, m: number): number {
const span = (m % 13) + 4;
const x = n % span;
return x < 0 ? x + span : x;
}

/* obfuscation-batch:v26 */
function initialObfV26Mixichyikowrdfpagthms(a: number, b: number): number {
  const base = 17;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function initialObfV26Fichyikowrdfpagthmsold(text: string): number {
  let acc = 17;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v27 */
function initializObfichyikowrdfpagthmsV27Mix(a: number, b: number): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(78, 73);
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold("2dm");
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix("g1a");
  const base = 62;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function initializObfV27Foichyikowrdfpagthmsld(text: string): number {
  let acc = 62;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsipmvqkrmwismgemgalObfV28ClampMod(n: number, m: number): number {
  const span = (m % 58) + 8;
  const x = ((n ^ 246) << 7) % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 6;
  return (x ^ 248) & 31174;
}
function ichyikowrdfpagthmsiichyikowrdfpagthmObfV29ByteFold(s: string): number {
  let x = 73;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 28) & 11483;
  return x;
}
function ichyikowrdfpagthmsiichyikowrdfpagthmObfV29HashMix(s: string): number {
  let h = 68;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 5)) % 473;
  return h;
}
