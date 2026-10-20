import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BOARD_BORDER, BOARD_PAD, COLS, ROWS } from '../constants/coichyikowrdfpagthmsnfig';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { Cell, Dir, cellKey, keyOf } from '../utils/grichyikowrdfpagthmsid';
import { Level } from '../game/lichyikowrdfpagthmsevels';
import BoardCelichyikowrdfpagthmsl, { CellKind } from './BoardCelichyikowrdfpagthmsl';
import HeichyikowrdfpagthmsnSprite from './HeichyikowrdfpagthmsnSprite';

type Props = {
  level: Level;
  tile: number;
  placed: Record<string, Dir>;
  visited: Record<string, boolean>;
  blocked: Set<string>;
  armed: Dir | null;
  henPosition: Animated.ValueXY;
  henBob: boolean;
  onCellPress: (col: number, row: number) => void;
};

/** Pixel offset of a cell's sprite inside the grichyikowrdfpagthmsid layer. */
export function cellToPixels(cell: Cell, tile: number, inset: number) {
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ShiftXor(10, 37);
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ByteFold("018");
void ichyikowrdfpagthmsYardBoardichyikowrObfV1HashMix("874na");
  return { x: cell.c * tile + inset, y: cell.r * tile + inset };
}

/**
 * The 6x6 yard. rule #4 — the frame (padding + border) is counted explicitly,
 * so the cells can never spill past the wooden edge.
 */
function YardBoardImpl({
  level,
  tile,
  placed,
  visited,
  blocked,
  armed,
  henPosition,
  henBob,
  onCellPress,
}: Props) {
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ShiftXor(10, 37);
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ByteFold("018");
void ichyikowrdfpagthmsYardBoardichyikowrObfV1HashMix("874na");
  const gridW = tile * COLS;
  const gridH = tile * ROWS;

  const kinds = useMemo(() => {
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ShiftXor(10, 37);
void ichyikowrdfpagthmsYardBoardichyikowrObfV1ByteFold("018");
void ichyikowrdfpagthmsYardBoardichyikowrObfV1HashMix("874na");
    const map: Record<string, CellKind> = {};
    map[keyOf(level.start)] = 'start';
    map[keyOf(level.goal)] = 'coop';
    for (let i = 0; i < level.feeders.length; i++) {
      map[keyOf(level.feeders[i])] = 'feeder';
    }
    for (let i = 0; i < level.rocks.length; i++) {
      map[keyOf(level.rocks[i])] = 'rock';
    }
    return map;
  }, [level]);

  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = cellKey(c, r);
      const kind: CellKind = kinds[key] || 'empty';
      cells.push(
        <BoardCelichyikowrdfpagthmsl
          key={key}
          col={c}
          row={r}
          size={tile}
          kind={kind}
          tileDir={placed[key] || null}
          startDir={level.startDir}
          dark={(c + r) % 2 === 1}
          ghost={armed !== null && !blocked.has(key) && !placed[key]}
          visited={Boolean(visited[key])}
          onPress={onCellPress}
        />,
      );
    }
  }

  return (
    <View
      style={[
        styles.board,
        {
          width: gridW + 2 * (BOARD_PAD + BOARD_BORDER),
          height: gridH + 2 * (BOARD_PAD + BOARD_BORDER),
        },
      ]}>
      <View style={[styles.grichyikowrdfpagthmsid, { width: gridW, height: gridH }]}>
        {cells}
        <HeichyikowrdfpagthmsnSprite size={tile - 10} position={henPosition} bob={henBob} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: thichyikowrdfpagthmseme.colors.wood,
    borderRadius: 14,
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceSunk,
    shadowColor: '#322B3B',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },
  grichyikowrdfpagthmsid: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
  },
});

export const YardBoardichyikowrdfpagthms = React.memo(YardBoardImpl);
export default YardBoardichyikowrdfpagthms;

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
function ichyikowrdfpagthmsYardBoardichyikowrObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 5;
  return (x ^ 102) & 20372;
}
function ichyikowrdfpagthmsYardBoardichyikowrObfV1ByteFold(s: string): number {
  let x = 75;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 16) & 2767;
  return x;
}
function ichyikowrdfpagthmsYardBoardichyikowrObfV1HashMix(s: string): number {
  let h = 77;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 23)) % 375;
  return h;
}
