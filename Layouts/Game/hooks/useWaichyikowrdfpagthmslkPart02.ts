/* autosetup-split:v1 */

export function ichyikowrdfpagthmsGameFoldRange(nums: number[]): number {
return nums.reduce((acc, n) => acc + n, 0);
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix(s: string): number {
  let h = 80;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 39)) % 85;
  return h;
}
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds(nums: number[]): number {
  let acc = 12;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 25) % 647;
  }
  return acc;
}
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(n: number, m: number): number {
  const span = (m % 63) + 8;
  const x = ((n ^ 88) << 5) % span;
  return x < 0 ? x + span : x;
}
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
