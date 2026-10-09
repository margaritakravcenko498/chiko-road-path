import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { IconComponent } from './iconTypes';

type Props = {
  label: string;
  value: string;
  valueColor?: string;
  Icon?: IconComponent;
};

/**
 * The ONE stat component, shared by GameScreen and ResultScreen so the two
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
  const tint = valueColor || theme.colors.textPrimary;
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
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.textMuted,
  },
  value: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export const StatPill = React.memo(StatPillImpl);
export default StatPill;
