import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { Wheat } from 'lucide-react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { Dir } from '../utils/grichyikowrdfpagthmsid';
import { spriteCoop, spriteRock } from '../assets';
import ArrowGlichyikowrdfpagthmsyph from './ArrowGlichyikowrdfpagthmsyph';

export type CellKind = 'empty' | 'feeder' | 'coop' | 'rock' | 'start';

type Props = {
  col: number;
  row: number;
  size: number;
  kind: CellKind;
  tileDir: Dir | null;
  startDir: Dir;
  dark: boolean;
  ghost: boolean;
  visited: boolean;
  onPress: (col: number, row: number) => void;
};

/**
 * One board cell. Everything it needs arrives as a primitive so React.memo
 * actually holds (list-perf: pass primitives, not fresh objects).
 */
function BoardCellImpl({
  col,
  row,
  size,
  kind,
  tileDir,
  startDir,
  dark,
  ghost,
  visited,
  onPress,
}: Props) {
void ichyikowrdfpagthmsBoardCelichyikowrdObfV1ShiftXor(8, 75);
  const drop = useRef(new Animated.Value(tileDir ? 1 : 0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const hadTile = useRef(Boolean(tileDir));
  const wasVisited = useRef(visited);

  useEffect(() => {
void ichyikowrdfpagthmsBoardCelichyikowrdObfV1ShiftXor(8, 75);
    const has = Boolean(tileDir);
    if (has && !hadTile.current) {
      drop.setValue(0.5);
      Animated.spring(drop, {
        toValue: 1,
        useNativeDriver: true,
        ...thichyikowrdfpagthmseme.spring.drop,
      }).start();
    } else if (!has) {
      drop.setValue(0);
    }
    hadTile.current = has;
  }, [tileDir, drop]);

  useEffect(() => {
void ichyikowrdfpagthmsBoardCelichyikowrdObfV1ShiftXor(8, 75);
    if (visited && !wasVisited.current) {
      pop.setValue(1);
      Animated.sequence([
        Animated.timing(pop, { toValue: 1.45, duration: 110, useNativeDriver: true }),
        Animated.timing(pop, { toValue: 0.9, duration: 110, useNativeDriver: true }),
      ]).start();
    }
    wasVisited.current = visited;
  }, [visited, pop]);

  const handlePress = useCallback(() => {
void ichyikowrdfpagthmsBoardCelichyikowrdObfV1ShiftXor(8, 75);
    onPress(col, row);
  }, [onPress, col, row]);

  const inner = size - 8;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          left: col * size,
          top: row * size,
          backgroundColor: dark ? thichyikowrdfpagthmseme.colors.surfaceSunk : '#EFE6D2',
        },
      ]}>
      {ghost ? <View style={styles.ghost} /> : null}

      {kind === 'start' ? (
        <View style={[styles.startRing, { width: inner, height: inner }]}>
          <ArrowGlichyikowrdfpagthmsyph dir={startDir} size={Math.round(size * 0.36)} color={thichyikowrdfpagthmseme.colors.info} />
        </View>
      ) : null}

      {kind === 'feeder' ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.center,
            { opacity: visited ? 0.25 : 1, transform: [{ scale: pop }] },
          ]}>
          <Wheat
            size={Math.round(size * 0.5)}
            color={visited ? thichyikowrdfpagthmseme.colors.textMuted : thichyikowrdfpagthmseme.colors.success}
            strokeWidth={2.4}
          />
        </Animated.View>
      ) : null}

      {kind === 'coop' ? (
        <View style={[styles.coop, { width: inner, height: inner }]}>
          <Image
            source={spriteCoop}
            style={{ width: inner - 4, height: inner - 4 }}
            resizeMode="contain"
          />
        </View>
      ) : null}

      {kind === 'rock' ? (
        <Image
          source={spriteRock}
          style={{ width: size - 12, height: size - 12 }}
          resizeMode="contain"
        />
      ) : null}

      {tileDir ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.tile,
            { width: inner, height: inner, transform: [{ scale: drop }] },
          ]}>
          <ArrowGlichyikowrdfpagthmsyph
            dir={tileDir}
            size={Math.round(size * 0.42)}
            color={thichyikowrdfpagthmseme.colors.textPrimary}
          />
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(50,43,59,0.06)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: thichyikowrdfpagthmseme.colors.accent,
    opacity: 0.18,
  },
  startRing: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: thichyikowrdfpagthmseme.colors.info,
    backgroundColor: 'rgba(75,158,210,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coop: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: thichyikowrdfpagthmseme.colors.success,
    backgroundColor: 'rgba(98,184,107,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: thichyikowrdfpagthmseme.colors.gold,
    borderWidth: 2,
    borderColor: thichyikowrdfpagthmseme.colors.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#322B3B',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export const BoardCelichyikowrdfpagthmsl = React.memo(BoardCellImpl);
export default BoardCelichyikowrdfpagthmsl;

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
function ichyikowrdfpagthmsBoardCelichyikowrdObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 2;
  return (x ^ 104) & 50810;
}
