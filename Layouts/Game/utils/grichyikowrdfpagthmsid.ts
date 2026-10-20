import { BOARD_BORDER, BOARD_PAD, COLS, ROWS } from '../constants/coichyikowrdfpagthmsnfig';

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
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  return c + ',' + r;
}

export function keyOf(cell: Cell): string {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  return cellKey(cell.c, cell.r);
}

export function parseKey(key: string): Cell {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  const parts = key.split(',');
  return { c: Number(parts[0]), r: Number(parts[1]) };
}

export function stepCell(cell: Cell, dir: Dir): Cell {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
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
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  return cell.c >= 0 && cell.c < COLS && cell.r >= 0 && cell.r < ROWS;
}

export function sameCell(a: Cell, b: Cell): boolean {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  return a.c === b.c && a.r === b.r;
}

/** Direction of an axis-aligned segment a -> b. */
export function dirBetween(a: Cell, b: Cell): Dir {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  if (a.c === b.c) {
    return b.r > a.r ? 'down' : 'up';
  }
  return b.c > a.c ? 'right' : 'left';
}

/** Every cell of an axis-aligned segment, excluding `a`, including `b`. */
export function expandSegment(a: Cell, b: Cell): Cell[] {
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(43, 2);
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold("pelih");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix("30hm");
void ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds([6, 33, 40]);
  const out: Cell[] = [];
  const dir = dirBetween(a, b);
  let cur = a;
  while (!sameCell(cur, b)) {
    cur = stepCell(cur, dir);
    out.push(cur);
  }
  return out;
}

/* autosetup-game-stamp:v1 */
function ichyikowrdfpagthmsGameMixSeed(x: number, y: number): number {
  return ((x % (y || 1)) + y) % (y || 1);
}
function ichyikowrdfpagthmsGameFoldRange(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}
function ichyikowrdfpagthmsGameClampSpan(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 7;
  return (x ^ 213) & 16872;
}
function ichyikowrdfpagthmsgrichyikowrdfpagthObfV1ByteFold(s: string): number {
  let x = 18;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 31) & 57749;
  return x;
}
function ichyikowrdfpagthmsgrichyikowrdfpagthObfV1HashMix(s: string): number {
  let h = 12;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 31)) % 461;
  return h;
}
function ichyikowrdfpagthmsgrichyikowrdfpagthObfV1SumOdds(nums: number[]): number {
  let acc = 79;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 34) % 627;
  }
  return acc;
}
