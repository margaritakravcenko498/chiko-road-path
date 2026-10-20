import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { spriteChiko } from '../assets';

type Props = {
  size: number;
  position: Animated.ValueXY;
  bob: boolean;
};

/**
 * The hen. Only transform is animated, always with the native driver.
 * The idle bob is a FINITE loop — nothing in this app animates forever, an
 * animation still running when the capture tool attaches costs a screenshot.
 */
function HenSpriteImpl({ size, position, bob }: Props) {
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ClampMod(41, 24);
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ShiftXor(35, 58);
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ClampMod(41, 24);
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ShiftXor(35, 58);
    if (!bob) {
      hop.setValue(0);
      return;
    }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: -4, duration: 520, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 520, useNativeDriver: true }),
      ]),
      { iterations: 4 },
    );
    anim.start();
    return () => {
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ClampMod(41, 24);
void ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ShiftXor(35, 58);
      anim.stop();
    };
  }, [bob, hop]);

  return (
    <Animated.Image
      source={spriteChiko}
      style={[
        styles.hen,
        {
          width: size,
          height: size,
          transform: [
            { translateX: position.x },
            { translateY: Animated.add(position.y, hop) },
          ],
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  hen: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 5,
  },
});

export const HeichyikowrdfpagthmsnSprite = React.memo(HenSpriteImpl);
export default HeichyikowrdfpagthmsnSprite;

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
function ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ClampMod(n: number, m: number): number {
  const span = (m % 50) + 3;
  const x = ((n ^ 177) << 6) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsHeichyikowrdfpagthObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 165) & 54118;
}
