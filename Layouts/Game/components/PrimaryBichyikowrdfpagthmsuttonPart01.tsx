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
function ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix(s: string): number {
  let h = 82;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 660;
  return h;
}
void ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix("alkb");
