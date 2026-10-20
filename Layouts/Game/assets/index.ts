/**
 * Re-export of the AI-generated PNGs in assets/.
 * Every entry here is declared in assets.json, so the files always exist
 * (AI generation, or the procedural fallback).
 */
export const bgLoader = require('../../../assets/bg_loader.png');
export const bgMenu = require('../../../assets/bg_menu.png');
export const bgGame = require('../../../assets/bg_game.png');
export const spriteChiko = require('../../../assets/sprite_chiko.png');
export const spriteCoop = require('../../../assets/sprite_coop.png');
export const spriteRock = require('../../../assets/sprite_rock.png');

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsindexObfV1HashMix(s: string): number {
  let h = 90;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 16)) % 157;
  return h;
}
function ichyikowrdfpagthmsindexObfV1SumOdds(nums: number[]): number {
  let acc = 81;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 3) % 141;
  }
  return acc;
}
function ichyikowrdfpagthmsindexObfV1ClampMod(n: number, m: number): number {
  const span = (m % 33) + 10;
  const x = ((n ^ 66) << 3) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsindexObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 82) & 37096;
}
void ichyikowrdfpagthmsindexObfV1HashMix("j4pk9");
void ichyikowrdfpagthmsindexObfV1SumOdds([33, 16, 35]);
void ichyikowrdfpagthmsindexObfV1ClampMod(50, 29);
void ichyikowrdfpagthmsindexObfV1ShiftXor(4, 71);
