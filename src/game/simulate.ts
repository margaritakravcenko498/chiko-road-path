import { MAX_STEPS } from '../constants/config';
import { Cell, Dir, inBounds, keyOf, sameCell, stepCell } from '../utils/grid';
import { Level } from './levels';

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
export function simulate(level: Level, placed: Record<string, Dir>): WalkResult {
  const feederKeys = new Set(level.feeders.map(keyOf));
  const rockKeys = new Set(level.rocks.map(keyOf));

  const path: Cell[] = [level.start];
  const collected: Record<number, string> = {};
  const visited = new Set<string>();

  let cur: Cell = level.start;
  let dir: Dir = level.startDir;

  const finish = (outcome: Outcome, reason: LoseReason | null): WalkResult => ({
    outcome,
    reason,
    path,
    collected,
    missed: feederKeys.size - visited.size,
  });

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
  if (!reason) {
    return 'ALL FEEDERS VISITED';
  }
  if (reason === 'missedFeeders' && missed > 0) {
    return missed + ' FEEDERS MISSED';
  }
  return REASON_TEXT[reason];
}
