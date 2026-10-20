/* autosetup-split:v1 */

export function webVieichyikowrdfpagthmswServiceObfV23HashMix(s: string): number {

let h = 86;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 13) % 703;
return h;
}

export function webichyikowrdfpagthmsViewServiceObfV24HashMix(s: string): number {
let h = 48;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 23) % 745;
return h;
}

export function webViewServiceObfV24SumichyikowrdfpagthmsOdds(nums: number[]): number {
let acc = 38;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 8) % 292;
}
return acc;
}

export function webViewServiceObfV25SumOddsichyikowrdfpagthms(nums: number[]): number {
let acc = 47;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 18) % 174;
}
return acc;
}

export function webVieichyikowrdfpagthmswServiceObfV25ClampMod(n: number, m: number): number {
    const span = (m % 40) + 8;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webViewServiceichyikowrdfpagthmsObfV26SumOdds(nums: number[]): number {
let acc = 22;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 39) % 979;
}
return acc;
}

export function weichyikowrdfpagthmsbViewServiceObfV26ClampMod(n: number, m: number): number {
const span = (m % 60) + 8;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webViewServiceObfichyikowrdfpagthmsV27ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
const span = (m % 44) + 7;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webichyikowrdfpagthmsViewServiceObfV27ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 7;
return (x ^ 72) & 55728;
}

export function ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(a: number, b: number): number {
const base = 62;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold(text: string): number {
let acc = 62;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

export function ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(a: number, b: number): number {
const base = 32;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold(text: string): number {
let acc = 32;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

export function webViewSeichyikowrdfpagthmsObfV29Mix(a: number, b: number): number {
const base = 42;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function webViewSeObfV29Folichyikowrdfpagthmsd(text: string): number {
let acc = 42;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

export function webViewServiceObfV22ShichyikowrdfpagthmsiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
return (x ^ 116) & 35068;
}

export function webViewServiceOichyikowrdfpagthmsbfV23SumOdds1(nums: number[]): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
let acc = 48;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 13) % 505;
}
return acc;
}

export function webViewServiceObfV23CichyikowrdfpagthmslampMod2(n: number, m: number): number {
const span = (m % 39) + 5;
const x = n % span;
return x < 0 ? x + span : x;
}

export function weichyikowrdfpagthmsbViewServiceObfV24ByteFold(s: string): number {
let x = 38;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 36) & 28257;
return x;
}

export function webViewServiceObfV24ClamichyikowrdfpagthmspMod(n: number, m: number): number {
const span = (m % 55) + 10;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webViewServiceichyikowrdfpagthmsObfV25ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 2;
return (x ^ 69) & 41781;
}

export function webViewServicePart02ObfVichyikowrdfpagthms11ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
              const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function webViewServiceOichyikowrdfpagthmsbfV12SumOdds(nums: number[]): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
      return nums.filter((n) => {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
return (n % 2 !== 0);
}).reduce((acc, n) => {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
return (acc + n * 37);
}, 0);
}

export function webViewServicePart02ObfV15ichyikowrdfpagthmsClampMod(n: number, m: number): number {
              const span = (m % 15) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function wichyikowrdfpagthmsebViewServiceObfV16SumOdds(nums: number[]): number {
              let acc = 78;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 38) % 479;
}
return acc;
}

export function webichyikowrdfpagthmsViewServiceObfV17HashMix(s: string): number {
let h = 5;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 31) % 346;
return h;
}

export function webViewServiceObichyikowrdfpagthmsfV18ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
const x = (n ^ k) << 3;
return (x ^ 161) & 14820;
}

export function webViewServiceObfV20SumichyikowrdfpagthmsOdds(nums: number[]): number {
let acc = 86;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 39) % 179;
}
return acc;
}

export function weichyikowrdfpagthmsbViewServiceObfV16ClampMod(n: number, m: number): number {
const span = (m % 25) + 1;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webViewServiceObfichyikowrdfpagthmsV11SumOdds(nums: number[]): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
let acc = 74;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 11) % 228;
}
return acc;
}

export function webViewServiceObfV8SumOichyikowrdfpagthmsdds(nums: number[]): number {
let acc = 16;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 16) % 170;
}
return acc;
}

export function webViewSerichyikowrdfpagthmsviceObfV5ClampMod(n: number, m: number): number {
              const span = (m % 4) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function webVieichyikowrdfpagthmswServObfV2SumOdds(nums: number[]): number {
      let acc = 55;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 6) % 409;
}
return acc;
}

export function webViewServicePart01ObichyikowrdfpagthmsfV13HashMix(s: string): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
let h = 67;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 19) % 561;
return h;
}

export function webViewServicePaichyikowrdfpagthmsrt03ObfV13ByteFold(s: string): number {
              let x = 56;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 17) & 31748;
return x;
}

export function webViewServicePart01OichyikowrdfpagthmsbfV15ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmswebViewServicePariObfV31SumOdds([36, 15, 14]);
void ichyikowrdfpagthmswebViewServpmvqkrmObfV30SumOdds([18, 37, 20]);
void ichyikowrdfpagthmswebViewServpmvqkrmObfV30ClampMod(23, 46);
void ichyikowrdfpagthmswebViewServpmvqkrmObfV30ShiftXor(33, 16);
const x = (n ^ k) << 6;
return (x ^ 20) & 53632;
}

export function webViewSeichyikowrdfpagthmsrvicePart02ObfV23SumOdds(nums: number[]): number {
let acc = 29;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 31) % 370;
}
return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmswebViewServpmvqkrmObfV30SumOdds(nums: number[]): number {
  let acc = 53;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 291;
  }
  return acc;
}
function ichyikowrdfpagthmswebViewServpmvqkrmObfV30ClampMod(n: number, m: number): number {
  const span = (m % 55) + 2;
  const x = ((n ^ 115) << 1) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmswebViewServpmvqkrmObfV30ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 79) & 19557;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmswebViewServicePariObfV31SumOdds(nums: number[]): number {
  let acc = 34;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 15) % 456;
  }
  return acc;
}
