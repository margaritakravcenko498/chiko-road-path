import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BOARD_BORDER, BOARD_PAD, COLS, ROWS } from '../constants/config';
import theme from '../constants/theme';
import { Cell, Dir, cellKey, keyOf } from '../utils/grid';
import { Level } from '../game/levels';
import BoardCell, { CellKind } from './BoardCell';
import HenSprite from './HenSprite';

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

/** Pixel offset of a cell's sprite inside the grid layer. */
export function cellToPixels(cell: Cell, tile: number, inset: number) {
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
  const gridW = tile * COLS;
  const gridH = tile * ROWS;

  const kinds = useMemo(() => {
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
        <BoardCell
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
      <View style={[styles.grid, { width: gridW, height: gridH }]}>
        {cells}
        <HenSprite size={tile - 10} position={henPosition} bob={henBob} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.wood,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceSunk,
    shadowColor: '#322B3B',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },
  grid: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
  },
});

export const YardBoard = React.memo(YardBoardImpl);
export default YardBoard;
