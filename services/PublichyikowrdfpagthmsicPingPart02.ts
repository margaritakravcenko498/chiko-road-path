/* autosetup-split:v1 */

export function PichyikowrdfpagthmsublicPingObfV25ClampMod(n: number, m: number): number {
const span = (m % 30) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicPingObfV18ByteichyikowrdfpagthmsFold(s: string): number {
              let x = 69;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 24) ^ 143;
return x & 4040;
}

export function PublicPingObfV21ichyikowrdfpagthmsShiftXor(n: number, k: number): number {
              const x = (n ^ k) << 1;
return (x ^ 108) & 38456;
}

export function PublicPingObfV24ShiftXoichyikowrdfpagthmsr(n: number, k: number): number {
  const x = (n ^ k) << 1;
return (x ^ 176) & 15860;
}

export function ichyikowrdfpagthmsPublicPingObfV15SumOdds(nums: number[]): number {
let acc = 73;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 25) % 612;
}
return acc;
}

export function PublichyikowrdfpagthmsicPingPart01ObfV17ByteFold(s: string): number {
let x = 79;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 34) ^ 156;
return x & 16690;
}

export function PublicPingPartichyikowrdfpagthms01ObfV23HashMix1(s: string): number {
let h = 13;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 14) % 390;
return h;
}

export function PublicPinichyikowrdfpagthmsgPart03ObfV25ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 3;
return (x ^ 141) & 35594;
}

/* obfuscation-batch:v26 */
function PublicPiichyikowrdfpagthmsnObfV26Mix(a: number, b: number): number {
  const base = 31;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function PubichyikowrdfpagthmslicPinObfV26Fold(text: string): number {
  let acc = 31;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v27 */
function ichyikowrdfpagthmsPublpmvqkrmwismgemObfV27ByteFold(s: string): number {
  let x = 40;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 16) & 26712;
  return x;
}
function ichyikowrdfpagthmsPublpmvqkrmwismgemObfV27HashMix(s: string): number {
  let h = 37;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 28)) % 402;
  return h;
}
function ichyikowrdfpagthmsPublpmvqkrmwismgemObfV27SumOdds(nums: number[]): number {
  let acc = 51;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 30) % 502;
  }
  return acc;
}
function ichyikowrdfpagthmsPublpmvqkrmwismgemObfV27ClampMod(n: number, m: number): number {
  const span = (m % 63) + 8;
  const x = ((n ^ 61) << 3) % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsPublichyikowrdfpagObfV28ByteFold(s: string): number {
  let x = 73;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 24) & 3781;
  return x;
}
function ichyikowrdfpagthmsPublichyikowrdfpagObfV28HashMix(s: string): number {
  let h = 80;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 407;
  return h;
}
function ichyikowrdfpagthmsPublichyikowrdfpagObfV28SumOdds(nums: number[]): number {
  let acc = 71;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 24) % 740;
  }
  return acc;
}
