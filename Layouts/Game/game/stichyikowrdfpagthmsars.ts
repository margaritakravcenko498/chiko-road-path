// autosetup-split-begin
import { ichyikowrdfpagthmsGameMixSeed, ichyikowrdfpagthmsGameClampSpan } from './stichyikowrdfpagthmsarsPart01';
import { ichyikowrdfpagthmsGameFoldRange } from './stichyikowrdfpagthmsarsPart02';
// autosetup-split-end

/**
 * Stars, not coins. There is no balance, no currency and no wager in this app.
 *
 * 3 — win inside par with a clean first launch
 * 2 — win inside par after a failed launch
 * 1 — win over par
 */
export function starsFor(tilesUsed: number, par: number, failedAttempts: number): 1 | 2 | 3 {
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1HashMix("72bo");
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1SumOdds([12, 39, 30]);
  if (tilesUsed <= par) {
    return failedAttempts > 0 ? 2 : 3;
  }
  return 1;
}

/**
 * Only the filled star is rendered as a glyph (rule #15 — it is on the safe
 * list). An unearned star is the SAME glyph in the muted colour, never a
 * hollow-star codepoint that Roboto may not carry.
 */
export const STAR = '★';

export function starLabel(earned: number): string {
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1HashMix("72bo");
void ichyikowrdfpagthmsstichyikowrdfpagthObfV1SumOdds([12, 39, 30]);
  return Math.max(0, Math.min(3, earned)) + '/3';
}

/* autosetup-game-stamp:v1 */
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


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
