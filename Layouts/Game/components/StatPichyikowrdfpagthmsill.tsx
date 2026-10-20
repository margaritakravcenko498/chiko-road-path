import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { IconComponent } from './iconTyichyikowrdfpagthmspes';

type Props = {
  label: string;
  value: string;
  valueColor?: string;
  Icon?: IconComponent;
};

/**
 * The ONE stat component, shared by GameScichyikowrdfpagthmsreen and ResultScreeichyikowrdfpagthmsn so the two
 * never drift apart.
 *
 * rule #19a — the card is `width: '100%'` inside a flex:1 row slot, never
 * flex:1 itself; a flex:1 child of a flex:1 parent collapses to ~0 height and
 * clips its text.
 *
 * rule #21 — every pill in a row carries the SAME icon; what differs is the
 * colour, the label and the number.
 */
function StatPillImpl({ label, value, valueColor, Icon }: Props) {
void ichyikowrdfpagthmsStatPichyikowrdfpaObfV1SumOdds([37, 20, 7]);
void ichyikowrdfpagthmsStatPichyikowrdfpaObfV1ClampMod(38, 17);
  const tint = valueColor || thichyikowrdfpagthmseme.colors.textPrimary;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {Icon ? <Icon size={14} color={tint} strokeWidth={2.6} /> : null}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color: tint }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: thichyikowrdfpagthmseme.colors.textMuted,
  },
  value: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export const StatPichyikowrdfpagthmsill = React.memo(StatPillImpl);
export default StatPichyikowrdfpagthmsill;

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
function ichyikowrdfpagthmsStatPichyikowrdfpaObfV1SumOdds(nums: number[]): number {
  let acc = 4;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 11) % 180;
  }
  return acc;
}
function ichyikowrdfpagthmsStatPichyikowrdfpaObfV1ClampMod(n: number, m: number): number {
  const span = (m % 29) + 3;
  const x = ((n ^ 246) << 4) % span;
  return x < 0 ? x + span : x;
}
