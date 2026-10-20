/* autosetup-split:v1 */

export function initiaichyikowrdfpagthmslizationFlowObfV17ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 1;
return (x ^ 230) & 383;
}

export function initializaichyikowrdfpagthmstionFlowObfV17SumOdds(nums: number[]): number {
let acc = 6;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 8) % 759;
}
return acc;
}

export function initializationFlowObfV21ichyikowrdfpagthmsHashMix(s: string): number {
let h = 71;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 17) % 805;
return h;
}

export function initializationFlowObfV7ichyikowrdfpagthmsHashMix(s: string): number {
return Array.from(s).reduce((a, c) => {
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ShiftXor(26, 53);
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ByteFold("cl");
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26HashMix("1g3a9m");
return ((a + c.charCodeAt(0) * 41) % 989);
}, 0);
}

export function initializationFlowObfV5HashichyikowrdfpagthmsMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 31) % 971, 0);
}

export function initializationFlowPart01ObfV12ClampMichyikowrdfpagthmsod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function initialichyikowrdfpagthmsizationFlowObfV9SumOdds(nums: number[]): number {
      return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 29, 0);
}

export function ichyikowrdfpagthmsinitbchlipsoqiyrodObfV3SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 5, 0);
}

export function initializationFlowOichyikowrdfpagthmsbfV14ByteFold(s: string): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV27ByteFold("6j");
let x = 28;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 32) ^ 9;
return x & 5400;
}

export function initializationFlowichyikowrdfpagthmsObfV15ClampMod(n: number, m: number): number {

const span = (m % 46) + 3;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlichyikowrdfpagthmsowPart02ObfV12ClampMod(n: number, m: number): number {
const span = (m % 17) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function initializationFlowPart03ObfV12HashMixichyikowrdfpagthms(s: string): number {
            let h = 19;
for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) & 65535;
return h;
}

export function ichyikowrdfpagthmsinitbchlipsoqiyrodObfV4SumOdds(nums: number[]): number {
let acc = 0;
for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
return acc;
}

export function initializationFlowPart03ObfV12SuichyikowrdfpagthmsmOdds(nums: number[]): number {
let acc = 0;
for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
return acc;
}

export function initializationFlowPart01ObfV12HashMixichyikowrdfpagthms(s: string): number {
      let h = 19;
for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) & 65535;
return h;
}

export function initializationichyikowrdfpagthmsFlowPart01ObfV21ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
return (x ^ 207) & 16338;
}

export function initializationFlowPart01ObfV22HashMiichyikowrdfpagthmsx(s: string): number {
let h = 23;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 21) % 806;
return h;
}

export function initializationFlowPart02ObfV24ByteichyikowrdfpagthmsFold(s: string): number {
let x = 75;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 14) & 15390;
return x;
}

/* obfuscation-batch:v23 */
function inichyikowrdfpagthmsitialObfV23Mix(a: number, b: number): number {
  const base = 17;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function initialObichyikowrdfpagthmsfV23Fold(text: string): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV27ByteFold("6j");
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ShiftXor(26, 53);
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ByteFold("cl");
void ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26HashMix("1g3a9m");
  let acc = 17;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v25 */
function initichyikowrdfpagthmsializObfV25Mix(a: number, b: number): number {
  const base = 62;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function initializOichyikowrdfpagthmsbfV25Fold(text: string): number {
void ichyikowrdfpagthmsiichyikowrdfpagthmObfV27ByteFold("6j");
  let acc = 62;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v26 */
function ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 7;
  return (x ^ 144) & 11811;
}
function ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26ByteFold(s: string): number {
  let x = 7;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 14) & 53465;
  return x;
}
function ichyikowrdfpagthmsipmvqkrmwismgemgalObfV26HashMix(s: string): number {
  let h = 40;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 26)) % 126;
  return h;
}

/* obfuscation-batch:v27 */
function ichyikowrdfpagthmsiichyikowrdfpagthmObfV27ByteFold(s: string): number {
  let x = 48;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 35) & 30013;
  return x;
}
