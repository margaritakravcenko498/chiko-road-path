import { MAX_STEPS } from '../constants/coichyikowrdfpagthmsnfig';
import { Cell, Dir, inBounds, keyOf, sameCell, stepCell } from '../utils/grichyikowrdfpagthmsid';
import { Level } from './lichyikowrdfpagthmsevels';
// autosetup-split-begin
import { ichyikowrdfpagthmsGameMixSeed, ichyikowrdfpagthmsGameClampSpan } from './simulichyikowrdfpagthmsatePart01';
import { ichyikowrdfpagthmsGameFoldRange } from './simulichyikowrdfpagthmsatePart02';
// autosetup-split-end

export type Outcome = 'win' | 'lose';

export type LoseReason = 'offEdge' | 'rock' | 'missedFeeders' | 'circles';

export type WalkResult = {
  outcome: Outcome;
  reason: LoseReason | null;
  /** Cells the hen stands on, start first. */
  path: Cell[];
  /** path index -> the feeder key collected on arriving there. */
  collected: Record<number, string>;
  /** Feeders left unvisited when the walk ended. */
  missed: number;
};

/**
 * Pure walk simulation. No React, no animation — the same function drives the
 * on-screen walk and the level audit.
 *
 * The arrow under the hen sets her heading BEFORE she steps; tiles never
 * rotate once the walk has started. This is route planning, not a reaction game.
 */
export function simulichyikowrdfpagthmsate(level: Level, placed: Record<string, Dir>): WalkResult {
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1HashMix("pep");
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1SumOdds([17, 40, 11]);
  const feederKeys = new Set(level.feeders.map(keyOf));
  const rockKeys = new Set(level.rocks.map(keyOf));

  const path: Cell[] = [level.start];
  const collected: Record<number, string> = {};
  const visited = new Set<string>();

  let cur: Cell = level.start;
  let dir: Dir = level.startDir;

  const finish = (outcome: Outcome, reason: LoseReason | null): WalkResult => {
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1HashMix("pep");
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1SumOdds([17, 40, 11]);
return ({
    outcome,
    reason,
    path,
    collected,
    missed: feederKeys.size - visited.size,
  });
};

  for (let step = 0; step < MAX_STEPS; step++) {
    const tile = placed[keyOf(cur)];
    if (tile) {
      dir = tile;
    }

    const next = stepCell(cur, dir);
    if (!inBounds(next)) {
      return finish('lose', 'offEdge');
    }

    path.push(next);
    const nextKey = keyOf(next);

    if (rockKeys.has(nextKey)) {
      return finish('lose', 'rock');
    }

    if (feederKeys.has(nextKey) && !visited.has(nextKey)) {
      visited.add(nextKey);
      collected[path.length - 1] = nextKey;
    }

    if (sameCell(next, level.goal)) {
      if (visited.size === feederKeys.size) {
        return finish('win', null);
      }
      return finish('lose', 'missedFeeders');
    }

    cur = next;
  }

  return finish('lose', 'circles');
}

const REASON_TEXT: Record<LoseReason, string> = {
  offEdge: 'CHIKO LEFT THE YARD',
  rock: 'CHIKO HIT A ROCK',
  missedFeeders: 'FEEDERS MISSED',
  circles: 'CHIKO WALKED IN CIRCLES',
};

export function reasonLabel(reason: LoseReason | null, missed: number): string {
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1HashMix("pep");
void ichyikowrdfpagthmssimulichyikowrdfpaObfV1SumOdds([17, 40, 11]);
  if (!reason) {
    return 'ALL FEEDERS VISITED';
  }
  if (reason === 'missedFeeders' && missed > 0) {
    return missed + ' FEEDERS MISSED';
  }
  return REASON_TEXT[reason];
}

/* autosetup-game-stamp:v1 */
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


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
