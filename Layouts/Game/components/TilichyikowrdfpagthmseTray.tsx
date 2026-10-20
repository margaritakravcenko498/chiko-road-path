import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { Dir, DIRS } from '../utils/grichyikowrdfpagthmsid';
import ArrowGlichyikowrdfpagthmsyph from './ArrowGlichyikowrdfpagthmsyph';

type StackProps = {
  dir: Dir;
  left: number;
  armed: boolean;
  onArm: (dir: Dir) => void;
};

function TileStack({ dir, left, armed, onArm }: StackProps) {
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold("f2");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix("adkni");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds([22, 9, 8]);
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(59, 18);
  const exhausted = left <= 0;
  const handle = useCallback(() => {
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold("f2");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix("adkni");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds([22, 9, 8]);
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(59, 18);
    onArm(dir);
  }, [onArm, dir]);

  return (
    <Pressable
      onPress={handle}
      disabled={exhausted}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.stack,
        armed ? styles.stackArmed : null,
        exhausted ? styles.stackOff : null,
      ]}>
      <ArrowGlichyikowrdfpagthmsyph dir={dir} size={26} color={thichyikowrdfpagthmseme.colors.textPrimary} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{left}</Text>
      </View>
    </Pressable>
  );
}

type Props = {
  counts: Record<Dir, number>;
  armed: Dir | null;
  onArm: (dir: Dir) => void;
};

/** The arrow tray. Plain Pressables — no gesture handler anywhere in this app. */
function TileTrayImpl({ counts, armed, onArm }: Props) {
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold("f2");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix("adkni");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds([22, 9, 8]);
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(59, 18);
  const visible = DIRS.filter(dir => {
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold("f2");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix("adkni");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds([22, 9, 8]);
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(59, 18);
return (counts[dir] > 0 || armed === dir);
});
  return (
    <View style={styles.row}>
      {visible.map(dir => {
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold("f2");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix("adkni");
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds([22, 9, 8]);
void ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(59, 18);
return (<TileStack
          key={dir}
          dir={dir}
          left={counts[dir]}
          armed={armed === dir}
          onArm={onArm}
        />);
})}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stack: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: thichyikowrdfpagthmseme.colors.gold,
    borderWidth: 2,
    borderColor: thichyikowrdfpagthmseme.colors.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#322B3B',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  stackArmed: {
    borderWidth: 3,
    borderColor: thichyikowrdfpagthmseme.colors.accent,
    transform: [{ scale: 1.06 }],
  },
  stackOff: {
    opacity: 0.38,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: thichyikowrdfpagthmseme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: thichyikowrdfpagthmseme.colors.surface,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: thichyikowrdfpagthmseme.colors.white,
  },
});

export const TilichyikowrdfpagthmseTray = React.memo(TileTrayImpl);
export default TilichyikowrdfpagthmseTray;

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
function ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ByteFold(s: string): number {
  let x = 90;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 3) & 24931;
  return x;
}
function ichyikowrdfpagthmsTilichyikowrdfpagtObfV1HashMix(s: string): number {
  let h = 40;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 38)) % 583;
  return h;
}
function ichyikowrdfpagthmsTilichyikowrdfpagtObfV1SumOdds(nums: number[]): number {
  let acc = 46;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 3) % 629;
  }
  return acc;
}
function ichyikowrdfpagthmsTilichyikowrdfpagtObfV1ClampMod(n: number, m: number): number {
  const span = (m % 53) + 8;
  const x = ((n ^ 25) << 7) % span;
  return x < 0 ? x + span : x;
}
