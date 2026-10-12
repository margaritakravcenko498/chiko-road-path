import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Map as MapIcon, Play, Star } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOTAL_LEVELS } from '../constants/config';
import { spriteChiko } from '../assets';
import AppShell from '../components/AppShell';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const SCREEN_H = Dimensions.get('window').height;

type Props = {
  level: number;
  totalStars: number;
  onStart: () => void;
  onLevels: () => void;
};

/**
 * Menu — archetype M2 (bottom sheet): hero art on top, a wooden sheet with the
 * title and the CTA below.
 *
 * rule #11a — `START ROUTE` is the ONLY string on this screen carrying the
 * token PLAY or START, and it goes straight into the game.
 */
export function MenuScreen({ level, totalStars, onStart, onLevels }: Props) {
  const sheetY = useRef(new Animated.Value(90)).current;
  const sheetFade = useRef(new Animated.Value(0)).current;
  const chipFade = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entry = Animated.sequence([
      Animated.delay(60),
      Animated.parallel([
        Animated.spring(sheetY, {
          toValue: 0,
          useNativeDriver: true,
          ...theme.spring.sheet,
        }),
        Animated.timing(sheetFade, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(90),
          Animated.timing(chipFade, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]);

    // Finite bob — at rest well before the screenshot window.
    const bob = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: -7, duration: 900, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
      { iterations: 4 },
    );

    entry.start();
    bob.start();
    return () => {
      entry.stop();
      bob.stop();
    };
  }, [sheetY, sheetFade, chipFade, hop]);

  return (
    <AppShell variant="menu">
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.henWrap}>
            <View style={styles.henShadow} />
            <Animated.Image
              source={spriteChiko}
              style={[styles.hen, { transform: [{ translateY: hop }] }]}
              resizeMode="contain"
            />
          </View>
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.sheet,
            { opacity: sheetFade, transform: [{ translateY: sheetY }] },
          ]}>
          <Text style={styles.title}>CHIKO ROAD PATH</Text>
          <Text style={styles.tagline}>LAY THE ARROWS · FEED THE FLOCK</Text>

          <Animated.View
            pointerEvents="box-none"
            style={[styles.chips, { opacity: chipFade }]}>
            <View style={styles.chip}>
              <MapIcon size={16} color={theme.colors.textSecondary} strokeWidth={2.4} />
              <Text style={styles.chipText}>
                {'YARD ' + level + ' / ' + TOTAL_LEVELS}
              </Text>
            </View>
            <View style={styles.chip}>
              <Star size={16} color={theme.colors.gold} strokeWidth={2.6} />
              <Text style={styles.chipText}>{totalStars + ' STARS'}</Text>
            </View>
          </Animated.View>

          <Text style={styles.hint}>TAP A TILE, THEN THE BOARD</Text>

          <PrimaryButton label="START ROUTE" onPress={onStart} Icon={Play} height={60} />

          <View style={styles.secondary}>
            <SecondaryButton label="LEVELS" onPress={onLevels} height={48} />
          </View>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Math.round(SCREEN_H * 0.04),
  },
  henWrap: {
    width: 170,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
  },
  henShadow: {
    position: 'absolute',
    bottom: 4,
    width: 110,
    height: 18,
    borderRadius: 55,
    backgroundColor: 'rgba(50,43,59,0.18)',
  },
  hen: {
    width: 150,
    height: 150,
  },
  sheet: {
    borderTopLeftRadius: theme.radius.sheet,
    borderTopRightRadius: theme.radius.sheet,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 26,
    shadowColor: '#322B3B',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: theme.colors.textPrimary,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: '#8A7B62',
  },
  chips: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.textSecondary,
  },
  hint: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: theme.colors.textMuted,
  },
  secondary: {
    marginTop: 12,
  },
});

export default MenuScreen;
