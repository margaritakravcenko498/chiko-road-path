import React, { useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import theme from '../constants/theme';
import { TOTAL_LEVELS } from '../constants/config';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import LevelCard, { LevelState } from '../components/LevelCard';

const SCREEN_W = Dimensions.get('window').width;
const GRID_GAP = 12;
const GRID_W = Math.min(SCREEN_W - 32, 380);
const CARD_W = Math.floor((GRID_W - 2 * GRID_GAP) / 3);

type Props = {
  unlocked: number;
  current: number;
  stars: Record<number, number>;
  totalStars: number;
  onPick: (level: number) => void;
  onBack: () => void;
};

/** A fixed 3 x 4 grid that fits the viewport — no ScrollView (rule #3). */
export function LevelSelectScreen({
  unlocked,
  current,
  stars,
  totalStars,
  onPick,
  onBack,
}: Props) {
  const ids = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      out.push(i);
    }
    return out;
  }, []);

  const handlePick = useCallback(
    (index: number) => {
      onPick(index);
    },
    [onPick],
  );

  return (
    <AppShell variant="levels">
      <ScreenHeader
        title="CHOOSE A YARD"
        onBack={onBack}
        tone="light"
        right={
          <View style={styles.starChip}>
            <Star size={14} color={theme.colors.gold} strokeWidth={2.6} />
            <Text style={styles.starChipText}>{totalStars}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.grid}>
          {ids.map(id => {
            let state: LevelState = 'locked';
            if (id === current && id <= unlocked) {
              state = 'current';
            } else if (id <= unlocked) {
              state = 'open';
            }
            return (
              <LevelCard
                key={'lvl-' + id}
                index={id}
                stars={stars[id] || 0}
                state={state}
                size={CARD_W}
                onPress={handlePick}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <SecondaryButton label="MENU" onPress={onBack} tone="ghost" height={48} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  grid: {
    width: GRID_W,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 26,
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  starChipText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});

export default LevelSelectScreen;
