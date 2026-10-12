/**
 * @format
 *
 * A level that does not simulate to a win is a build-blocking bug, so the
 * whole table is checked here rather than trusted.
 */
import { expect, it } from '@jest/globals';
import { TOTAL_LEVELS } from '../src/constants/config';
import { LEVELS, auditLevels, getLevel, solutionPlacement } from '../src/game/levels';
import { simulate } from '../src/game/simulate';
import { starsFor } from '../src/game/stars';

it('ships twelve structurally sound levels', () => {
  expect(LEVELS.length).toBe(TOTAL_LEVELS);
  expect(auditLevels()).toEqual([]);
});

it('wins every authored solution', () => {
  for (let id = 1; id <= TOTAL_LEVELS; id++) {
    const level = getLevel(id);
    const run = simulate(level, solutionPlacement(level));
    expect(run.outcome).toBe('win');
    expect(run.missed).toBe(0);
    expect(level.solution.length).toBe(level.par);
  }
});

it('loses when the hen walks off an empty board', () => {
  const level = getLevel(1);
  const run = simulate(level, {});
  expect(run.outcome).toBe('lose');
});

it('awards stars by tile budget', () => {
  expect(starsFor(3, 3, 0)).toBe(3);
  expect(starsFor(3, 3, 1)).toBe(2);
  expect(starsFor(4, 3, 0)).toBe(1);
});
