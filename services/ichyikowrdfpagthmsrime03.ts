/* autosetup-decoy:v1 */

export function ichyikowrdfpagthmsrime03Touch(seed: number): number {
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(62, 25);
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold("g1");
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix("3el4f");
  const tag = "ichyikowrdfpagthmsrime03Touch";
  let x = (seed ^ 64136) & 0xffff;
  for (let i = 0; i < tag.length; i++) {
    x = (x + tag.charCodeAt(i) * 83) & 0xffff;
  }
  return x ^ 2475;
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 160) & 43445;
}
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold(s: string): number {
  let x = 21;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 29) & 29304;
  return x;
}
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix(s: string): number {
  let h = 21;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 14)) % 443;
  return h;
}
