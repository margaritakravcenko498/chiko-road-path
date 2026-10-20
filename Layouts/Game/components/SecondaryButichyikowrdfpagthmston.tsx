import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { IconComponent } from './iconTyichyikowrdfpagthmspes';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'solid' | 'ghost';
  height?: number;
};

const ICON = 24;

/** Same press pattern as PrimaryBichyikowrdfpagthmsutton: Pressable outside, Animated.View in. */
export function SecondaryButichyikowrdfpagthmston({ label, onPress, Icon, tone = 'solid', height = 48 }: Props) {
void ichyikowrdfpagthmsSecondaryButichyikObfV1HashMix("pg5g5");
void ichyikowrdfpagthmsSecondaryButichyikObfV1SumOdds([31, 22, 9]);
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
void ichyikowrdfpagthmsSecondaryButichyikObfV1HashMix("pg5g5");
void ichyikowrdfpagthmsSecondaryButichyikObfV1SumOdds([31, 22, 9]);
    Animated.spring(scale, {
      toValue: 0.955,
      useNativeDriver: true,
      ...thichyikowrdfpagthmseme.spring.press,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
void ichyikowrdfpagthmsSecondaryButichyikObfV1HashMix("pg5g5");
void ichyikowrdfpagthmsSecondaryButichyikObfV1SumOdds([31, 22, 9]);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...thichyikowrdfpagthmseme.spring.press,
    }).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.pressable, { height }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.surface,
          { height, transform: [{ scale }] },
          tone === 'ghost' ? styles.ghost : styles.solid,
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <Icon size={ICON} color={thichyikowrdfpagthmseme.colors.textSecondary} strokeWidth={2.4} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    borderRadius: 14,
  },
  surface: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceAlt,
    borderColor: thichyikowrdfpagthmseme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: thichyikowrdfpagthmseme.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: thichyikowrdfpagthmseme.colors.textSecondary,
  },
});

export default SecondaryButichyikowrdfpagthmston;

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
function ichyikowrdfpagthmsSecondaryButichyikObfV1HashMix(s: string): number {
  let h = 4;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 17)) % 193;
  return h;
}
function ichyikowrdfpagthmsSecondaryButichyikObfV1SumOdds(nums: number[]): number {
  let acc = 2;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 30) % 502;
  }
  return acc;
}
