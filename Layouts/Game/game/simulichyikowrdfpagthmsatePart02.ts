/* autosetup-split:v1 */

export function ichyikowrdfpagthmsGameFoldRange(nums: number[]): number {
return nums.reduce((acc, n) => acc + n, 0);
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmssimulichyikowrdfpaObfV1HashMix(s: string): number {
  let h = 51;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 30)) % 304;
  return h;
}
function ichyikowrdfpagthmssimulichyikowrdfpaObfV1SumOdds(nums: number[]): number {
  let acc = 43;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 29) % 186;
  }
  return acc;
}
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1HashMix("pep");
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1SumOdds([17, 40, 11]);
