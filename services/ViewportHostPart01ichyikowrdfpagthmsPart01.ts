/* autosetup-split:v1 */

export function ViewportHostPart01ichyikowrdfpagthmsObfV27ByteFold(s: string): number {
let x = 17;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 11) & 24013;
return x;
}

export function ichyikowrdfpagthmsViewportHostPart01ObfV31SumOdds(nums: number[]): number {
let acc = 17;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 33) % 457;
}
return acc;
}

export function ichyikowrdfpagthmsViewportHostPart01ObfV31ClampMod(n: number, m: number): number {
const span = (m % 52) + 9;
const x = ((n ^ 229) << 3) % span;
return x < 0 ? x + span : x;
}

export function ichyikowrdfpagthmsViewportHostPart01ObfV31ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 7;
return (x ^ 189) & 7111;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsViewportHostPart01ObfV32ClampMod(n: number, m: number): number {
  const span = (m % 27) + 9;
  const x = ((n ^ 1) << 5) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 9) & 47061;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32ByteFold(s: string): number {
  let x = 31;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 34) & 42266;
  return x;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32HashMix(s: string): number {
  let h = 81;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 26)) % 722;
  return h;
}
void ichyikowrdfpagthmsViewportHostPart01ObfV32ClampMod(47, 54);
void ichyikowrdfpagthmsViewportHostPart01ObfV32ShiftXor(9, 40);
void ichyikowrdfpagthmsViewportHostPart01ObfV32ByteFold("f0d");
void ichyikowrdfpagthmsViewportHostPart01ObfV32HashMix("fk");
