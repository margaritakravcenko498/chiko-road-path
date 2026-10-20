/* autosetup-split:v1 */

export function ichyikowrdfpagthmsGameFoldRange(nums: number[]): number {
return nums.reduce((acc, n) => acc + n, 0);
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsArrowGlichyikowrdfObfV1SumOdds(nums: number[]): number {
  let acc = 66;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 343;
  }
  return acc;
}
function ichyikowrdfpagthmsArrowGlichyikowrdfObfV1ClampMod(n: number, m: number): number {
  const span = (m % 26) + 11;
  const x = ((n ^ 127) << 3) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsArrowGlichyikowrdfObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 29) & 4959;
}
void ichyikowrdfpagthmsArrowGlichyikowrdfObfV1SumOdds([34, 29, 28]);
void ichyikowrdfpagthmsArrowGlichyikowrdfObfV1ClampMod(39, 30);
void ichyikowrdfpagthmsArrowGlichyikowrdfObfV1ShiftXor(49, 16);
