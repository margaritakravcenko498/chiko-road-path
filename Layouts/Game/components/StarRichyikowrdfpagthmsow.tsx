import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { STAR } from '../game/stichyikowrdfpagthmsars';
// autosetup-split-begin
import { ichyikowrdfpagthmsGameMixSeed, ichyikowrdfpagthmsGameFoldRange, ichyikowrdfpagthmsGameClampSpan } from './StarRichyikowrdfpagthmsowPart01';
// autosetup-split-end

type Props = {
  earned: number;
  size: number;
  animated?: boolean;
};

const SLOTS = [0, 1, 2];

/**
 * rule #15 — the filled star glyph is on the safe list; an unearned star is
 * the SAME glyph in the muted colour, never a second codepoint.
 */
function StarRowImpl({ earned, size, animated = false }: Props) {
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
  const a0 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const a1 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const a2 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const values = useRef([a0, a1, a2]).current;

  useEffect(() => {
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
    if (!animated) {
      return;
    }
    const steps = SLOTS.map(i =>
      {
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
return (Animated.sequence([
        Animated.delay(i * 160),
        Animated.spring(values[i], {
          toValue: 1,
          useNativeDriver: true,
          ...thichyikowrdfpagthmseme.spring.pop,
        }),
      ]));
},
    );
    const anim = Animated.parallel(steps);
    anim.start();
    return () => {
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
      anim.stop();
    };
  }, [animated, values]);

  return (
    <View style={[styles.row, { gap: Math.round(size * 0.27) }]}>
      {SLOTS.map(i => {
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(21, 4);
void ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold("5m78");
return (<Animated.Text
          key={'star-' + i}
          style={[
            styles.star,
            {
              fontSize: size,
              lineHeight: Math.round(size * 1.15),
              color: i < earned ? thichyikowrdfpagthmseme.colors.gold : thichyikowrdfpagthmseme.colors.borderSoft,
              transform: [{ scale: values[i] }],
            },
          ]}>
          {STAR}
        </Animated.Text>);
})}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    textShadowColor: 'rgba(50,43,59,0.25)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 2 },
  },
});

export const StarRichyikowrdfpagthmsow = React.memo(StarRowImpl);
export default StarRichyikowrdfpagthmsow;

/* autosetup-game-stamp:v1 */
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 7;
  return (x ^ 249) & 1840;
}
function ichyikowrdfpagthmsStarRichyikowrdfpaObfV1ByteFold(s: string): number {
  let x = 82;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 11) & 56087;
  return x;
}
