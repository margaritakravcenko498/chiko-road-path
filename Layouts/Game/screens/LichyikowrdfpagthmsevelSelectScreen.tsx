import React, { useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { TOTAL_LEVELS } from '../constants/coichyikowrdfpagthmsnfig';
import AppShichyikowrdfpagthmsell from '../components/AppShichyikowrdfpagthmsell';
import ScreenHeadichyikowrdfpagthmser from '../components/ScreenHeadichyikowrdfpagthmser';
import SecondaryButichyikowrdfpagthmston from '../components/SecondaryButichyikowrdfpagthmston';
import LevichyikowrdfpagthmselCard, { LevelState } from '../components/LevichyikowrdfpagthmselCard';

const SCREEN_W = Dimensions.get('window').width;
const GRID_GAP = 12;
const GRID_W = Math.min(SCREEN_W - 32, 380);
const CARD_W = Math.floor((GRID_W - 2 * GRID_GAP) / 3);

type Props = {
  unlocked: number;
  current: number;
  stichyikowrdfpagthmsars: Record<number, number>;
  totalStars: number;
  onPick: (level: number) => void;
  onBack: () => void;
};

/** A fixed 3 x 4 grichyikowrdfpagthmsid that fits the viewport — no ScrollView (rule #3). */
export function LichyikowrdfpagthmsevelSelectScreen({
  unlocked,
  current,
  stichyikowrdfpagthmsars,
  totalStars,
  onPick,
  onBack,
}: Props) {
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ByteFold("5c5mp");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1HashMix("bchg5");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1SumOdds([31, 22, 25]);
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ClampMod(24, 43);
  const ids = useMemo(() => {
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ByteFold("5c5mp");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1HashMix("bchg5");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1SumOdds([31, 22, 25]);
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ClampMod(24, 43);
    const out: number[] = [];
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      out.push(i);
    }
    return out;
  }, []);

  const handlePick = useCallback(
    (index: number) => {
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ByteFold("5c5mp");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1HashMix("bchg5");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1SumOdds([31, 22, 25]);
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ClampMod(24, 43);
      onPick(index);
    },
    [onPick],
  );

  return (
    <AppShichyikowrdfpagthmsell variant="levels">
      <ScreenHeadichyikowrdfpagthmser
        title="CHOOSE A YARD"
        onBack={onBack}
        tone="light"
        right={
          <View style={styles.starChip}>
            <Star size={14} color={thichyikowrdfpagthmseme.colors.gold} strokeWidth={2.6} />
            <Text style={styles.starChipText}>{totalStars}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <View style={styles.grichyikowrdfpagthmsid}>
          {ids.map(id => {
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ByteFold("5c5mp");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1HashMix("bchg5");
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1SumOdds([31, 22, 25]);
void ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ClampMod(24, 43);
            let state: LevelState = 'locked';
            if (id === current && id <= unlocked) {
              state = 'current';
            } else if (id <= unlocked) {
              state = 'open';
            }
            return (
              <LevichyikowrdfpagthmselCard
                key={'lvl-' + id}
                index={id}
                stichyikowrdfpagthmsars={stichyikowrdfpagthmsars[id] || 0}
                state={state}
                size={CARD_W}
                onPress={handlePick}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <SecondaryButichyikowrdfpagthmston label="MENU" onPress={onBack} tone="ghost" height={48} />
      </View>
    </AppShichyikowrdfpagthmsell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  grichyikowrdfpagthmsid: {
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
    backgroundColor: thichyikowrdfpagthmseme.colors.surface,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
  },
  starChipText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    color: thichyikowrdfpagthmseme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});

export default LichyikowrdfpagthmsevelSelectScreen;

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
function ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ByteFold(s: string): number {
  let x = 22;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 18) & 29561;
  return x;
}
function ichyikowrdfpagthmsLichyikowrdfpagthmObfV1HashMix(s: string): number {
  let h = 74;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 271;
  return h;
}
function ichyikowrdfpagthmsLichyikowrdfpagthmObfV1SumOdds(nums: number[]): number {
  let acc = 35;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 16) % 394;
  }
  return acc;
}
function ichyikowrdfpagthmsLichyikowrdfpagthmObfV1ClampMod(n: number, m: number): number {
  const span = (m % 27) + 6;
  const x = ((n ^ 148) << 4) % span;
  return x < 0 ? x + span : x;
}
