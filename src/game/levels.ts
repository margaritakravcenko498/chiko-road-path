import { TOTAL_LEVELS } from '../constants/config';
import {
  Cell,
  Dir,
  dirBetween,
  expandSegment,
  keyOf,
  sameCell,
} from '../utils/grid';

export type PlacedTile = { cell: Cell; dir: Dir };

export type Level = {
  id: number;
  start: Cell;
  startDir: Dir;
  goal: Cell;
  feeders: Cell[];
  rocks: Cell[];
  /** The authored solution: one arrow per turn of the authored route. */
  solution: PlacedTile[];
  /** How many arrows of each direction the tray hands out. */
  tray: Record<Dir, number>;
  /** Tile budget for a 3-star win. */
  par: number;
  /** Every cell the authored route walks through, start first. */
  path: Cell[];
};

type Pt = [number, number];

type RouteSpec = {
  /** Corner points of the authored route: start, every turn, then the coop. */
  route: Pt[];
  feeders: Pt[];
  rocks: Pt[];
};

function pt(p: Pt): Cell {
  return { c: p[0], r: p[1] };
}

/**
 * Levels are BUILT from an authored route, never generated and filtered.
 * The turns of the route become the required arrows, so a level cannot ship
 * unsolvable: the solution is the thing the level is made of.
 */
function buildLevel(id: number, spec: RouteSpec): Level {
  const corners = spec.route.map(pt);
  const start = corners[0];
  const goal = corners[corners.length - 1];
  const startDir = dirBetween(corners[0], corners[1]);

  const solution: PlacedTile[] = [];
  for (let i = 1; i < corners.length - 1; i++) {
    solution.push({ cell: corners[i], dir: dirBetween(corners[i], corners[i + 1]) });
  }

  const path: Cell[] = [start];
  for (let i = 0; i < corners.length - 1; i++) {
    const seg = expandSegment(corners[i], corners[i + 1]);
    for (let j = 0; j < seg.length; j++) {
      path.push(seg[j]);
    }
  }

  const tray: Record<Dir, number> = { up: 0, down: 0, left: 0, right: 0 };
  for (let i = 0; i < solution.length; i++) {
    tray[solution[i].dir] += 1;
  }
  // One spare of whichever direction the solution leans on most.
  const order: Dir[] = ['up', 'right', 'down', 'left'];
  let spare: Dir = order[0];
  let best = -1;
  for (let i = 0; i < order.length; i++) {
    if (tray[order[i]] > best) {
      best = tray[order[i]];
      spare = order[i];
    }
  }
  tray[spare] += 1;

  return {
    id,
    start,
    startDir,
    goal,
    feeders: spec.feeders.map(pt),
    rocks: spec.rocks.map(pt),
    solution,
    tray,
    par: solution.length,
    path,
  };
}

const SPECS: RouteSpec[] = [
  {
    route: [[0, 5], [0, 3], [2, 3], [2, 1], [4, 1]],
    feeders: [[0, 4], [1, 3], [2, 2]],
    rocks: [[4, 4], [1, 0], [5, 5]],
  },
  {
    route: [[0, 0], [0, 3], [3, 3], [3, 5], [5, 5]],
    feeders: [[0, 1], [2, 3], [3, 4]],
    rocks: [[1, 1], [5, 0], [2, 5]],
  },
  {
    route: [[5, 5], [5, 2], [1, 2], [1, 0], [4, 0], [4, 1]],
    feeders: [[5, 3], [3, 2], [1, 1], [3, 0]],
    rocks: [[0, 5], [2, 4], [5, 0]],
  },
  {
    route: [[0, 5], [3, 5], [3, 3], [1, 3], [1, 1], [4, 1]],
    feeders: [[2, 5], [3, 4], [1, 2], [3, 1]],
    rocks: [[5, 5], [0, 2], [4, 4]],
  },
  {
    route: [[0, 0], [0, 2], [2, 2], [2, 4], [4, 4], [4, 1], [2, 1]],
    feeders: [[0, 1], [1, 2], [2, 3], [4, 3], [3, 1]],
    rocks: [[5, 0], [0, 5], [5, 5]],
  },
  {
    route: [[5, 0], [5, 3], [3, 3], [3, 1], [1, 1], [1, 4], [0, 4]],
    feeders: [[5, 2], [4, 3], [3, 2], [1, 2], [1, 3]],
    rocks: [[0, 0], [2, 5], [4, 5]],
  },
  {
    route: [[0, 5], [0, 0], [2, 0], [2, 2], [4, 2], [4, 4], [1, 4], [1, 3]],
    feeders: [[0, 3], [1, 0], [2, 1], [3, 2], [4, 3], [2, 4]],
    rocks: [[5, 5], [5, 0], [3, 5]],
  },
  {
    route: [[5, 5], [0, 5], [0, 2], [3, 2], [3, 0], [5, 0], [5, 2], [4, 2]],
    feeders: [[3, 5], [0, 4], [1, 2], [3, 1], [4, 0], [5, 1]],
    rocks: [[2, 0], [1, 3], [4, 4]],
  },
  {
    route: [[0, 0], [2, 0], [2, 2], [0, 2], [0, 4], [4, 4], [4, 1], [3, 1]],
    feeders: [[1, 0], [2, 1], [1, 2], [0, 3], [2, 4], [4, 2]],
    rocks: [[5, 5], [3, 0], [5, 3]],
  },
  {
    route: [[0, 5], [5, 5], [5, 3], [2, 3], [2, 1], [0, 1], [0, 0], [3, 0], [3, 1]],
    feeders: [[2, 5], [5, 4], [3, 3], [2, 2], [1, 1], [1, 0]],
    rocks: [[0, 3], [4, 1], [1, 3]],
  },
  {
    route: [[5, 0], [5, 5], [1, 5], [1, 3], [4, 3], [4, 2], [0, 2], [0, 0], [2, 0]],
    feeders: [[5, 2], [3, 5], [1, 4], [3, 3], [3, 2], [0, 1], [1, 0]],
    rocks: [[0, 4], [2, 1], [4, 0]],
  },
  {
    route: [
      [0, 0],
      [0, 5],
      [2, 5],
      [2, 3],
      [5, 3],
      [5, 1],
      [3, 1],
      [3, 0],
      [1, 0],
      [1, 1],
    ],
    feeders: [[0, 2], [0, 4], [2, 4], [3, 3], [5, 2], [4, 1], [2, 0]],
    rocks: [[4, 5], [1, 2], [4, 0]],
  },
];

export const LEVELS: Level[] = SPECS.map((spec, i) => buildLevel(i + 1, spec));

export function getLevel(id: number): Level {
  const index = Math.min(Math.max(id, 1), TOTAL_LEVELS) - 1;
  return LEVELS[index];
}

/** The solution laid out as the placed-tile map the board and simulator use. */
export function solutionPlacement(level: Level): Record<string, Dir> {
  const placed: Record<string, Dir> = {};
  for (let i = 0; i < level.solution.length; i++) {
    placed[keyOf(level.solution[i].cell)] = level.solution[i].dir;
  }
  return placed;
}

/** Cells a tile may never be dropped on. */
export function blockedCells(level: Level): Set<string> {
  const blocked = new Set<string>();
  blocked.add(keyOf(level.start));
  blocked.add(keyOf(level.goal));
  for (let i = 0; i < level.feeders.length; i++) {
    blocked.add(keyOf(level.feeders[i]));
  }
  for (let i = 0; i < level.rocks.length; i++) {
    blocked.add(keyOf(level.rocks[i]));
  }
  return blocked;
}

/**
 * Structural self-check. A level table that does not simulate to a win is a
 * build-blocking bug, so the shape of every level is asserted by the jest
 * suite and, in dev, at module load.
 */
export function auditLevels(): string[] {
  const problems: string[] = [];
  for (let i = 0; i < LEVELS.length; i++) {
    const level = LEVELS[i];
    const pathKeys = new Set(level.path.map(keyOf));
    const turnKeys = new Set(level.solution.map(t => keyOf(t.cell)));

    if (level.path.length !== pathKeys.size) {
      problems.push('level ' + level.id + ': route visits a cell twice');
    }
    for (let f = 0; f < level.feeders.length; f++) {
      const key = keyOf(level.feeders[f]);
      if (!pathKeys.has(key)) {
        problems.push('level ' + level.id + ': feeder ' + key + ' is off the route');
      }
      if (turnKeys.has(key)) {
        problems.push('level ' + level.id + ': feeder ' + key + ' sits on a turn cell');
      }
      if (
        sameCell(level.feeders[f], level.start) ||
        sameCell(level.feeders[f], level.goal)
      ) {
        problems.push('level ' + level.id + ': feeder ' + key + ' sits on start/goal');
      }
    }
    for (let k = 0; k < level.rocks.length; k++) {
      const key = keyOf(level.rocks[k]);
      if (pathKeys.has(key)) {
        problems.push('level ' + level.id + ': rock ' + key + ' blocks the route');
      }
    }
    for (let s = 0; s < level.solution.length; s++) {
      const tile = level.solution[s];
      if (sameCell(tile.cell, level.start) || sameCell(tile.cell, level.goal)) {
        problems.push('level ' + level.id + ': an arrow lands on start/goal');
      }
    }
    for (let p = 0; p < level.path.length - 1; p++) {
      if (sameCell(level.path[p], level.goal)) {
        problems.push('level ' + level.id + ': the route crosses the coop early');
      }
    }
    if (sameCell(level.start, level.goal)) {
      problems.push('level ' + level.id + ': start equals goal');
    }
  }
  return problems;
}
