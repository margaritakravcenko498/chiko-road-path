import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Compass, Trophy } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOTAL_LEVELS } from '../constants/config';
import { LoseReason, Outcome, reasonLabel } from '../game/simulate';
import AppShell from '../components/AppShell';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StarRow from '../components/StarRow';
import StatPill from '../components/StatPill';

type Props = {
  outcome: Outcome;
  reason: LoseReason | null;
  missed: number;
  stars: number;
  tilesUsed: number;
  par: number;
  levelId: number;
  onNext: () => void;
  onAgain: () => void;
  onMenu: () => void;
};

/** Grain motes, pinned to the outer edges so nothing ever crosses the headline (rule #17). */
const GRAINS = [
  { key: 'g0', left: '6%', delay: 0, size: 7 },
  { key: 'g1', left: '11%', delay: 420, size: 5 },
  { key: 'g2', left: '91%', delay: 180, size: 6 },
  { key: 'g3', left: '95%', delay: 640, size: 4 },
  { key: 'g4', left: '3%', delay: 900, size: 5 },
] as const;

function Grains() {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(drift, { toValue: 1, duration: 2600, useNativeDriver: true }),
      { iterations: 3 },
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, [drift]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {GRAINS.map((grain, i) => {
        const translateY = drift.interpolate({
          inputRange: [0, 1],
          outputRange: [-40 - i * 20, 420 + i * 30],
        });
        return (
          <Animated.View
            key={grain.key}
            style={[
              styles.grain,
              {
                left: grain.left,
                width: grain.size,
                height: grain.size,
                transform: [{ translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

/**
 * The round's own screen (rule #12). Win and loss are visually unmistakable:
 * a meadow-green gradient against a deep plum one.
 */
export function ResultScreen({
  outcome,
  reason,
  missed,
  stars,
  tilesUsed,
  par,
  levelId,
  onNext,
  onAgain,
  onMenu,
}: Props) {
  const win = outcome === 'win';
  const badgeScale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.spring(badgeScale, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.spring.badge,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [fade, badgeScale]);

  const isLast = levelId >= TOTAL_LEVELS;

  return (
    <AppShell variant={win ? 'win' : 'lose'}>
      {win ? <Grains /> : null}

      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <View style={styles.top}>
          <Animated.View
            pointerEvents="none"
            style={[styles.badge, { transform: [{ scale: badgeScale }] }]}>
            {win ? (
              <Trophy size={64} color={theme.colors.gold} strokeWidth={2.2} />
            ) : (
              <Compass size={64} color={theme.colors.textMuted} strokeWidth={2.2} />
            )}
          </Animated.View>

          <Text style={[styles.headline, win ? styles.headlineWin : styles.headlineLose]}>
            {win ? 'ROUTE COMPLETE' : 'WRONG TURN'}
          </Text>
          <Text style={[styles.subline, win ? styles.sublineWin : styles.sublineLose]}>
            {reasonLabel(win ? null : reason, missed)}
          </Text>

          <View style={styles.stars}>
            <StarRow earned={stars} size={44} animated={win} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatPill
                label="TILES USED"
                value={String(tilesUsed)}
                valueColor={theme.colors.gold}
              />
            </View>
            <View style={styles.statSlot}>
              <StatPill label="PAR" value={String(par)} valueColor={theme.colors.accent} />
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          {win ? (
            <>
              <PrimaryButton
                label={isLast ? 'CHOOSE A YARD' : 'NEXT LEVEL'}
                onPress={onNext}
                height={56}
              />
              <View style={styles.gap}>
                <SecondaryButton label="PLAY AGAIN" onPress={onAgain} height={48} />
              </View>
              <View style={styles.gap}>
                <SecondaryButton label="MENU" onPress={onMenu} tone="ghost" height={48} />
              </View>
            </>
          ) : (
            <>
              <PrimaryButton label="PLAY AGAIN" onPress={onAgain} height={56} />
              <View style={styles.gap}>
                <SecondaryButton label="MENU" onPress={onMenu} height={48} />
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
  },
  badge: {
    width: 118,
    height: 118,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 3,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#322B3B',
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  headline: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1.4,
    textAlign: 'center',
    textShadowColor: 'rgba(50,43,59,0.4)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  headlineWin: {
    color: theme.colors.white,
  },
  headlineLose: {
    color: theme.colors.textOnDark,
  },
  subline: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  sublineWin: {
    color: 'rgba(255,255,255,0.86)',
  },
  sublineLose: {
    color: 'rgba(255,241,213,0.8)',
  },
  stars: {
    marginTop: 22,
  },
  statsRow: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    paddingHorizontal: 24,
  },
  statSlot: {
    flex: 1,
  },
  actions: {
    width: '100%',
  },
  gap: {
    marginTop: 12,
  },
  grain: {
    position: 'absolute',
    top: 0,
    borderRadius: 4,
    backgroundColor: theme.colors.gold,
    opacity: 0.55,
  },
});

export default ResultScreen;
