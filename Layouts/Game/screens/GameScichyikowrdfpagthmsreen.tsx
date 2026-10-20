import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Play, Undo2, Wheat } from 'lucide-react-native';
import {
  AUTO_DEMO_MS,
  AUTO_DEMO_STEP_MS,
  COLS,
  ROWS,
  TUTORIAL_AUTO_CLOSE_MS,
  TUTORIAL_OPEN_MS,
} from '../constants/coichyikowrdfpagthmsnfig';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { BOARD_FRAME, Dir, keyOf } from '../utils/grichyikowrdfpagthmsid';
import { Level, blockedCells, solutionPlacement } from '../game/lichyikowrdfpagthmsevels';
import { LoseReason, Outcome, simulichyikowrdfpagthmsate } from '../game/simulichyikowrdfpagthmsate';
import { starsFor } from '../game/stichyikowrdfpagthmsars';
import { useWaichyikowrdfpagthmslk } from '../hooks/useWaichyikowrdfpagthmslk';
import AppShichyikowrdfpagthmsell from '../components/AppShichyikowrdfpagthmsell';
import PrimaryBichyikowrdfpagthmsutton from '../components/PrimaryBichyikowrdfpagthmsutton';
import ScreenHeadichyikowrdfpagthmser from '../components/ScreenHeadichyikowrdfpagthmser';
import StatPichyikowrdfpagthmsill from '../components/StatPichyikowrdfpagthmsill';
import TilichyikowrdfpagthmseTray from '../components/TilichyikowrdfpagthmseTray';
import TutorialOverlaichyikowrdfpagthmsy from '../components/TutorialOverlaichyikowrdfpagthmsy';
import YardBoardichyikowrdfpagthms, { cellToPixels } from '../components/YardBoardichyikowrdfpagthms';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

const HEADER_H = 116;
const PANEL_H = 232;

/** rule #4/#5 — the frame is subtracted BEFORE the tile size is derived. */
const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
const AVAIL_H = SCREEN_H - HEADER_H - PANEL_H - 16;
const TILE = Math.max(
  34,
  Math.floor(
    Math.min(
      (BOARD_MAX_W - 2 * BOARD_FRAME) / COLS,
      (AVAIL_H - 2 * BOARD_FRAME) / ROWS,
    ),
  ),
);
const HEN_INSET = 5;

export type RoundResult = {
  outcome: Outcome;
  reason: LoseReason | null;
  missed: number;
  stichyikowrdfpagthmsars: number;
  tilesUsed: number;
  par: number;
  levelId: number;
};

type Props = {
  level: Level;
  failedAttempts: number;
  showTutorial: boolean;
  onTutorialSeen: () => void;
  onRoundEnd: (result: RoundResult) => void;
  onBack: () => void;
};

/** GameScichyikowrdfpagthmsreen — archetype G3 (split panel): board above, controls below. */
export function GameScichyikowrdfpagthmsreen({
  level,
  failedAttempts,
  showTutorial,
  onTutorialSeen,
  onRoundEnd,
  onBack,
}: Props) {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
  const [placed, setPlaced] = useState<Record<string, Dir>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [armed, setArmed] = useState<Dir | null>(null);
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);
  const [tutorial, setTutorial] = useState(showTutorial);

  const blocked = useMemo(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (blockedCells(level));
}, [level]);

  const placedRef = useRef(placed);
  placedRef.current = placed;
  const armedRef = useRef<Dir | null>(armed);
  armedRef.current = armed;
  const runningRef = useRef(false);
  const resultRef = useRef<ReturnType<typeof simulichyikowrdfpagthmsate> | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishedRef = useRef(false);

  const counts = useMemo(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    const left: Record<Dir, number> = { ...level.tray };
    const keys = Object.keys(placed);
    for (let i = 0; i < keys.length; i++) {
      left[placed[keys[i]]] -= 1;
    }
    return left;
  }, [level, placed]);

  const countsRef = useRef(counts);
  countsRef.current = counts;

  const tilesUsed = order.length;
  const visitedCount = Object.keys(visited).length;

  const walk = useWaichyikowrdfpagthmslk({
    toPixels: cell => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (cellToPixels(cell, TILE, HEN_INSET));
},
    onEnterCell: index => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      const result = resultRef.current;
      if (!result) {
        return;
      }
      const key = result.collected[index];
      if (key) {
        setVisited(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
          const next = { ...prev };
          next[key] = true;
          return next;
        });
      }
    },
    onFinished: () => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      const result = resultRef.current;
      if (!result) {
        return;
      }
      const used = Object.keys(placedRef.current).length;
      onRoundEnd({
        outcome: result.outcome,
        reason: result.reason,
        missed: result.missed,
        stichyikowrdfpagthmsars: result.outcome === 'win' ? starsFor(used, level.par, failedAttempts) : 0,
        tilesUsed: used,
        par: level.par,
        levelId: level.id,
      });
    },
  });

  const { placeAt, walk: startWalk, stop: stopWalk } = walk;

  // Reset the yard whenever the level changes.
  useEffect(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    finishedRef.current = false;
    runningRef.current = false;
    resultRef.current = null;
    setPlaced({});
    setOrder([]);
    setArmed(null);
    setVisited({});
    setRunning(false);
    placeAt(level.start);
  }, [level, placeAt]);

  const launchWith = useCallback(
    (placement: Record<string, Dir>) => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (runningRef.current || Object.keys(placement).length === 0) {
        return;
      }
      runningRef.current = true;
      setRunning(true);
      setArmed(null);
      const result = simulichyikowrdfpagthmsate(level, placement);
      resultRef.current = result;
      startWalk(result.path);
    },
    [level, startWalk],
  );

  const handleLaunch = useCallback(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    launchWith(placedRef.current);
  }, [launchWith]);

  /**
   * Idle backstop. ONE timer, armed on mount, never re-armed by input — a
   * re-armed timer would starve the result frame.
   */
  useEffect(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    const pending = timers.current;
    const demo = setTimeout(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (runningRef.current) {
        return;
      }
      setTutorial(false);
      const solution = level.solution;
      for (let i = 0; i < solution.length; i++) {
        const tile = solution[i];
        const key = keyOf(tile.cell);
        const id = setTimeout(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
          setPlaced(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
            const next = { ...prev };
            next[key] = tile.dir;
            return next;
          });
          setOrder(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (prev.indexOf(key) >= 0 ? prev : prev.concat(key));
});
        }, (i + 1) * AUTO_DEMO_STEP_MS);
        pending.push(id);
      }
      const launchId = setTimeout(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
        launchWith(solutionPlacement(level));
      }, (solution.length + 1) * AUTO_DEMO_STEP_MS + 420);
      pending.push(launchId);
    }, AUTO_DEMO_MS);
    pending.push(demo);

    return () => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      for (let i = 0; i < pending.length; i++) {
        clearTimeout(pending[i]);
      }
      pending.length = 0;
      stopWalk();
    };
    // Armed exactly once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The tutorial shows itself once and steps out of the way on its own.
  useEffect(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    if (!showTutorial) {
      return;
    }
    const open = setTimeout(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (setTutorial(true));
}, TUTORIAL_OPEN_MS);
    const close = setTimeout(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      setTutorial(false);
      onTutorialSeen();
    }, TUTORIAL_AUTO_CLOSE_MS);
    return () => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      clearTimeout(open);
      clearTimeout(close);
    };
  }, [showTutorial, onTutorialSeen]);

  const dismissTutorial = useCallback(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    setTutorial(false);
    onTutorialSeen();
  }, [onTutorialSeen]);

  const handleArm = useCallback(
    (dir: Dir) => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (runningRef.current) {
        return;
      }
      setArmed(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (prev === dir ? null : dir);
});
    },
    [],
  );

  const handleCellPress = useCallback(
    (col: number, row: number) => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (runningRef.current) {
        return;
      }
      const key = col + ',' + row;
      if (blocked.has(key)) {
        return;
      }
      const dir = armedRef.current;
      if (!dir) {
        return;
      }
      const existing = placedRef.current[key];
      if (existing === dir) {
        return;
      }
      if (!existing && countsRef.current[dir] <= 0) {
        return;
      }
      setPlaced(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
        const next = { ...prev };
        next[key] = dir;
        return next;
      });
      setOrder(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
return (prev.indexOf(key) >= 0 ? prev : prev.concat(key));
});
    },
    [blocked],
  );

  const handleUndo = useCallback(() => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
    if (runningRef.current) {
      return;
    }
    setOrder(prev => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
      if (prev.length === 0) {
        return prev;
      }
      const key = prev[prev.length - 1];
      setPlaced(current => {
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(50, 61);
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold("ih63g1");
void ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix("lobaf");
        const next = { ...current };
        delete next[key];
        return next;
      });
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  const canLaunch = tilesUsed > 0 && !running;

  return (
    <AppShichyikowrdfpagthmsell variant="game">
      <ScreenHeadichyikowrdfpagthmser
        title={'YARD ' + level.id}
        subtitle={'PAR ' + level.par + ' TILES'}
        onBack={onBack}
        right={
          <View style={styles.counter}>
            <Wheat size={16} color={thichyikowrdfpagthmseme.colors.success} strokeWidth={2.6} />
            <Text style={styles.counterText}>
              {visitedCount + '/' + level.feeders.length}
            </Text>
          </View>
        }
      />

      <View style={styles.boardArea}>
        <YardBoardichyikowrdfpagthms
          level={level}
          tile={TILE}
          placed={placed}
          visited={visited}
          blocked={blocked}
          armed={armed}
          henPosition={walk.position}
          henBob={!running}
          onCellPress={handleCellPress}
        />
      </View>

      <View style={styles.panel}>
        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatPichyikowrdfpagthmsill
              label="TILES"
              value={tilesUsed + '/' + (level.par + 1)}
              valueColor={thichyikowrdfpagthmseme.colors.gold}
            />
          </View>
          <View style={styles.statSlot}>
            <StatPichyikowrdfpagthmsill
              label="FEEDERS"
              value={visitedCount + '/' + level.feeders.length}
              valueColor={thichyikowrdfpagthmseme.colors.success}
            />
          </View>
          <View style={styles.statSlot}>
            <StatPichyikowrdfpagthmsill
              label="PAR"
              value={String(level.par)}
              valueColor={thichyikowrdfpagthmseme.colors.accent}
            />
          </View>
        </View>

        <View style={styles.trayZone}>
          {running ? (
            <View style={styles.walkingStrip}>
              <Text style={styles.walkingText}>CHIKO IS WALKING</Text>
            </View>
          ) : (
            <TilichyikowrdfpagthmseTray counts={counts} armed={armed} onArm={handleArm} />
          )}
        </View>

        <View style={styles.actionRow}>
          {running ? null : (
            <Pressable
              onPress={handleUndo}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Undo last tile"
              style={styles.undo}>
              <Undo2 size={22} color={thichyikowrdfpagthmseme.colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          )}

          <View style={styles.ctaSlot}>
            <PrimaryBichyikowrdfpagthmsutton
              label="LAUNCH CHIKO"
              onPress={handleLaunch}
              Icon={Play}
              disabled={!canLaunch}
              height={56}
              colors={[thichyikowrdfpagthmseme.colors.success, thichyikowrdfpagthmseme.colors.successMid]}
              borderColor={thichyikowrdfpagthmseme.colors.successDeep}
              shadow={thichyikowrdfpagthmseme.shadow.launch}
            />
          </View>
        </View>
      </View>

      <TutorialOverlaichyikowrdfpagthmsy visible={tutorial} onDismiss={dismissTutorial} />
    </AppShichyikowrdfpagthmsell>
  );
}

const styles = StyleSheet.create({
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: thichyikowrdfpagthmseme.colors.surface,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
  },
  counterText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: thichyikowrdfpagthmseme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: thichyikowrdfpagthmseme.colors.surface,
    borderTopWidth: 2,
    borderTopColor: thichyikowrdfpagthmseme.colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: '#322B3B',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statSlot: {
    flex: 1,
  },
  trayZone: {
    marginTop: 10,
    height: 64,
    justifyContent: 'center',
  },
  walkingStrip: {
    height: 48,
    borderRadius: 12,
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkingText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: thichyikowrdfpagthmseme.colors.textSecondary,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  undo: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: thichyikowrdfpagthmseme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSlot: {
    flex: 1,
  },
});

export default GameScichyikowrdfpagthmsreen;

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
function ichyikowrdfpagthmsGameScichyikowrdfpObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 230) & 17109;
}
function ichyikowrdfpagthmsGameScichyikowrdfpObfV1ByteFold(s: string): number {
  let x = 78;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 3) & 18423;
  return x;
}
function ichyikowrdfpagthmsGameScichyikowrdfpObfV1HashMix(s: string): number {
  let h = 44;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 20)) % 343;
  return h;
}
