import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import theme from '../constants/theme';

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
export function ScreenHeader({ title, subtitle, onBack, right, tone = 'sunk' }: Props) {
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
            <ArrowLeft size={20} color={theme.colors.textSecondary} strokeWidth={2.4} />
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
    borderBottomColor: theme.colors.border,
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
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
});

export default ScreenHeader;
