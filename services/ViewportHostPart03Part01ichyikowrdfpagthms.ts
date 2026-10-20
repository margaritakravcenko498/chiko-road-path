/* autosetup-split:v1 */

export function ViewportHostPart03ObfV27ShiftXorichyikowrdfpagthms(n: number, k: number): number {
const x = (n ^ k) << 4;
return (x ^ 53) & 31807;
}

export function ViewpichyikowrdfpagthmsortObfV15Mix(a: number, b: number): number {
const base = 27;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function ViewportObfV15Fichyikowrdfpagthmsold(text: string): number {
let acc = 27;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

export function ichyikowrdfpagthmsViewportHostPartdgpnrismgemgObfV29Mix(a: number, b: number): number {
const base = 19;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function ichyikowrdfpagthmsViewportHostPartdgpnrismgemgObfV29Fold(text: string): number {
let acc = 19;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30ByteFold(s: string): number {
  let x = 83;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 32) & 41021;
  return x;
}
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30HashMix(s: string): number {
  let h = 29;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 33)) % 898;
  return h;
}
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30SumOdds(nums: number[]): number {
  let acc = 78;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 19) % 215;
  }
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsViewportHostPart03ObfV31ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 1;
  return (x ^ 52) & 4114;
}
