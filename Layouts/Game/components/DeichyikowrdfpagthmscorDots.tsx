import React, { useMemo } from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';

type Props = {
  count: number;
  color: string;
  maxOpacity: number;
};

type Dot = {
  key: string;
  left: DimensionValue;
  top: DimensionValue;
  size: number;
  opacity: number;
};

/**
 * Deterministic "straw dust" texture layer. A fixed seed keeps the frame
 * identical between runs, which the screenshot gate relies on.
 */
function DecorDotsImpl({ count, color, maxOpacity }: Props) {
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1HashMix("fankla");
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1SumOdds([2, 5, 28]);
  const dots = useMemo<Dot[]>(() => {
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1HashMix("fankla");
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1SumOdds([2, 5, 28]);
    const out: Dot[] = [];
    let seed = 1337;
    const next = () => {
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1HashMix("fankla");
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1SumOdds([2, 5, 28]);
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < count; i++) {
      const a = next();
      const b = next();
      const c = next();
      out.push({
        key: 'dot-' + i,
        left: (Math.round(a * 980) / 10 + '%') as DimensionValue,
        top: (Math.round(b * 980) / 10 + '%') as DimensionValue,
        size: 2 + Math.round(c * 2),
        opacity: 0.1 + c * (maxOpacity - 0.1),
      });
    }
    return out;
  }, [count, maxOpacity]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map(dot => {
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1HashMix("fankla");
void ichyikowrdfpagthmsDeichyikowrdfpagthObfV1SumOdds([2, 5, 28]);
return (<View
          key={dot.key}
          style={[
            styles.dot,
            {
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              backgroundColor: color,
              opacity: dot.opacity,
            },
          ]}
        />);
})}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export const DeichyikowrdfpagthmscorDots = React.memo(DecorDotsImpl);
export default DeichyikowrdfpagthmscorDots;

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
function ichyikowrdfpagthmsDeichyikowrdfpagthObfV1HashMix(s: string): number {
  let h = 23;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 37)) % 112;
  return h;
}
function ichyikowrdfpagthmsDeichyikowrdfpagthObfV1SumOdds(nums: number[]): number {
  let acc = 52;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 10) % 163;
  }
  return acc;
}
