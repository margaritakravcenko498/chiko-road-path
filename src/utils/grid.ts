import { BOARD_BORDER, BOARD_PAD, COLS, ROWS } from '../constants/config';

export type Dir = 'up' | 'down' | 'left' | 'right';

export type Cell = { c: number; r: number };

/** rule #4 — the parent's padding + border never counts toward the children's area. */
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;

export const DIRS: Dir[] = ['up', 'right', 'down', 'left'];

export const DIR_ROTATION: Record<Dir, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

export function cellKey(c: number, r: number): string {
  return c + ',' + r;
}

export function keyOf(cell: Cell): string {
  return cellKey(cell.c, cell.r);
}

export function parseKey(key: string): Cell {
  const parts = key.split(',');
  return { c: Number(parts[0]), r: Number(parts[1]) };
}

export function stepCell(cell: Cell, dir: Dir): Cell {
  switch (dir) {
    case 'up':
      return { c: cell.c, r: cell.r - 1 };
    case 'down':
      return { c: cell.c, r: cell.r + 1 };
    case 'left':
      return { c: cell.c - 1, r: cell.r };
    default:
      return { c: cell.c + 1, r: cell.r };
  }
}

export function inBounds(cell: Cell): boolean {
  return cell.c >= 0 && cell.c < COLS && cell.r >= 0 && cell.r < ROWS;
}

export function sameCell(a: Cell, b: Cell): boolean {
  return a.c === b.c && a.r === b.r;
}

/** Direction of an axis-aligned segment a -> b. */
export function dirBetween(a: Cell, b: Cell): Dir {
  if (a.c === b.c) {
    return b.r > a.r ? 'down' : 'up';
  }
  return b.c > a.c ? 'right' : 'left';
}

/** Every cell of an axis-aligned segment, excluding `a`, including `b`. */
export function expandSegment(a: Cell, b: Cell): Cell[] {
  const out: Cell[] = [];
  const dir = dirBetween(a, b);
  let cur = a;
  while (!sameCell(cur, b)) {
    cur = stepCell(cur, dir);
    out.push(cur);
  }
  return out;
}
