/**
 * Stars, not coins. There is no balance, no currency and no wager in this app.
 *
 * 3 — win inside par with a clean first launch
 * 2 — win inside par after a failed launch
 * 1 — win over par
 */
export function starsFor(tilesUsed: number, par: number, failedAttempts: number): 1 | 2 | 3 {
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
  return Math.max(0, Math.min(3, earned)) + '/3';
}
