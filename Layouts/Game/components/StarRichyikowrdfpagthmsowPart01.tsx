/* autosetup-split:v1 */

export function ichyikowrdfpagthmsGameMixSeed(x: number, y: number): number {
return ((x % (y || 1)) + y) % (y || 1);
}

export function ichyikowrdfpagthmsGameFoldRange(nums: number[]): number {
return nums.reduce((acc, n) => acc + n, 0);
}

export function ichyikowrdfpagthmsGameClampSpan(n: number, lo: number, hi: number): number {
return n < lo ? lo : n > hi ? hi : n;
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 7;
  return (x ^ 249) & 1840;
}
function ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold(s: string): number {
  let x = 82;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 11) & 56087;
  return x;
}
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
