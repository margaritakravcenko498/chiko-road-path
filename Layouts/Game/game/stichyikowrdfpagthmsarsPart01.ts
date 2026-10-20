/* autosetup-split:v1 */

export function ichyikowrdfpagthmsGameMixSeed(x: number, y: number): number {
return ((x % (y || 1)) + y) % (y || 1);
}

export function ichyikowrdfpagthmsGameClampSpan(n: number, lo: number, hi: number): number {
return n < lo ? lo : n > hi ? hi : n;
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsstichyikowrdfpagthObfV1HashMix(s: string): number {
  let h = 18;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 27)) % 604;
  return h;
}
function ichyikowrdfpagthmsstichyikowrdfpagthObfV1SumOdds(nums: number[]): number {
  let acc = 15;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 352;
  }
  return acc;
}
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1HashMix("72bo");
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1SumOdds([12, 39, 30]);
