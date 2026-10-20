/* autosetup-split:v1 */

export function OfferichyikowrdfpagthmsResolveObfV17ByteFold(s: string): number {
      let x = 68;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 10) ^ 200;
return x & 35035;
}

export function OffeichyikowrdfpagthmsrResolveObfV18HashMix(s: string): number {
let h = 52;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 22) % 254;
return h;
}

export function OfferResolveObfV20HasichyikowrdfpagthmshMix(s: string): number {
let h = 90;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 36) % 675;
return h;
}

export function OfferResolveichyikowrdfpagthmsObfV21ByteFold(s: string): number {
            let x = 13;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 29) & 65535;
return x;
}

export function ichyikowrdfpagthmsOfferResolvObfV1HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 17) % 997, 0);
}

export function ichyikowrdfpagthmsOfferResolvObfV1SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n, 0);
}

export function ichyikowrdfpagthmsOfferResolveObfV8ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsOfferResolvePart01ObfV15ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 3;
return (x ^ 117) & 58189;
}

export function ichyikowrdfpagthmsOffObfV4HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 29) % 977, 0);
}

export function ichyikowrdfpagthmsOfferResolveObfV8SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 19, 0);
}

export function ichyikowrdfpagthmsOfferResolvePart03ObfV11SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((acc, n) => acc + n * 31, 0);
}

export function ichyikowrdfpagthmsOfferResolvePart02ObfV15ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 1;
return (x ^ 205) & 53104;
}

export function ichyikowrdfpagthmsMixSeed(a: number, b: number): number {
      
return ((a % (b || 1)) + b) % (b || 1);
}

export function ichyikowrdfpagthmsClampSpan(n: number, lo: number, hi: number): number {
      
return n < lo ? lo : n > hi ? hi : n;
}

export function ichyikowrdfpagthmsOfferResolveObfV14HashMix(s: string): number {
let h = 6;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 4) % 682;
return h;
}

export function OfferResolvePart02ObfV20CichyikowrdfpagthmslampMod(n: number, m: number): number {
const span = (m % 61) + 3;
const x = n % span;
return x < 0 ? x + span : x;
}

export function OfferResolichyikowrdfpagthmsvePart02ObfV21ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 1;
return (x ^ 226) & 41844;
}

export function OfferResolvePart02ObfV21ichyikowrdfpagthmsSumOdds(nums: number[]): number {
let acc = 47;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 35) % 500;
}
return acc;
}

export function OfferRichyikowrdfpagthmsesolveObfV22SumOdds(nums: number[]): number {
let acc = 46;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 37) % 181;
}
return acc;
}

export function OfferResolveichyikowrdfpagthmsObfV23ClampMod2(n: number, m: number): number {

const span = (m % 15) + 3;
const x = n % span;
return x < 0 ? x + span : x;
}

export function OfferResolveObfV24SumOddichyikowrdfpagthmss(nums: number[]): number {
            let acc = 21;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 14) % 716;
}
return acc;
}


/* obfuscation-batch:v25 */
function OffeichyikowrdfpagthmsrResolvePart02ObfV25ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 2;
  return (x ^ 129) & 18363;
}

function OfferResolichyikowrdfpagthmsvePart02ObfV25ByteFold(s: string): number {
  let x = 23;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 20) & 33788;
  return x;
}

function OfferResolveParichyikowrdfpagthmst02ObfV25HashMix(s: string): number {
        let h = 41;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 16) % 807;
  return h;
}
void OffeichyikowrdfpagthmsrResolvePart02ObfV25ShiftXor(3, 27);
void OfferResolichyikowrdfpagthmsvePart02ObfV25ByteFold('u4');
void OfferResolveParichyikowrdfpagthmst02ObfV25HashMix('r2');


/* obfuscation-batch:v26 */
function OfferResolvePart02ObichyikowrdfpagthmsfV26ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsOichyikowrdfpagthmObfV32ByteFold("e58");
  const x = (n ^ k) << 2;
  return (x ^ 29) & 30538;
}

function OffichyikowrdfpagthmserResolvePart02ObfV26ByteFold(s: string): number {
  let x = 74;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 31) & 32919;
  return x;
}

function OfferResolvePart02ObfichyikowrdfpagthmsV26HashMix(s: string): number {
void ichyikowrdfpagthmsOichyikowrdfpagthmObfV32ByteFold("e58");
  let h = 47;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 10) % 562;
  return h;
}

/* obfuscation-batch:v27 */
function OfferResolvePart02ObfV27SumichyikowrdfpagthmsOdds(nums: number[]): number {
  let acc = 77;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 5) % 121;
  }
  return acc;
}
function OfferResolvePart02ObfV27ClaichyikowrdfpagthmsmpMod(n: number, m: number): number {
  const span = (m % 39) + 13;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function OfferResolvePart02ObfV27ShiftXichyikowrdfpagthmsor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 197) & 18497;
}

/* obfuscation-batch:v28 */
function OfferResObfV28Mixichyikowrdfpagthms(a: number, b: number): number {
  const base = 79;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function OffichyikowrdfpagthmserResObfV28Fold(text: string): number {
  let acc = 79;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsOfferResolvepzurisymgeqmgallObfV29Mix(a: number, b: number): number {
  const base = 32;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsOfferResolvepzurisymgeqmgallObfV29Fold(text: string): number {
  let acc = 32;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function OfferichyikowrdfpagthmsResoObfV30Mix(a: number, b: number): number {
  const base = 36;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function OfferResoObichyikowrdfpagthmsfV30Fold(text: string): number {
void ichyikowrdfpagthmsOichyikowrdfpagthmObfV32ByteFold("e58");
  let acc = 36;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsOfferResolpmvqkrmwObfV31HashMix(s: string): number {
  let h = 43;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 38)) % 133;
  return h;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsOichyikowrdfpagthmObfV32ByteFold(s: string): number {
  let x = 52;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 40) & 52177;
  return x;
}
