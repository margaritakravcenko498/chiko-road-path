import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  tone?: 'light' | 'sunk';
};

/**
 * The one header every screen uses (rule #6 — paddingTop 44 under the status
 * bar). Screens differ only by their slots, never by re-implementing the bar.
 */
export function ScreenHeadichyikowrdfpagthmser({ title, subtitle, onBack, right, tone = 'sunk' }: Props) {
void ichyikowrdfpagthmsScreenHeadichyikowObfV1ClampMod(16, 19);
  return (
    <View style={[styles.header, tone === 'light' ? styles.headerLight : null]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <ArrowLeft size={20} color={thichyikowrdfpagthmseme.colors.textSecondary} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50,43,59,0.055)',
    borderBottomWidth: 1,
    borderBottomColor: thichyikowrdfpagthmseme.colors.border,
  },
  headerLight: {
    backgroundColor: 'rgba(255,249,236,0.55)',
  },
  side: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: thichyikowrdfpagthmseme.radius.md,
    backgroundColor: thichyikowrdfpagthmseme.colors.surface,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: thichyikowrdfpagthmseme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: thichyikowrdfpagthmseme.colors.textMuted,
  },
});

export default ScreenHeadichyikowrdfpagthmser;

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
function ichyikowrdfpagthmsScreenHeadichyikowObfV1ClampMod(n: number, m: number): number {
  const span = (m % 32) + 11;
  const x = ((n ^ 44) << 5) % span;
  return x < 0 ? x + span : x;
}
