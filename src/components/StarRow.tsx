import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { STAR } from '../game/stars';

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
  const a0 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const a1 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const a2 = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const values = useRef([a0, a1, a2]).current;

  useEffect(() => {
    if (!animated) {
      return;
    }
    const steps = SLOTS.map(i =>
      Animated.sequence([
        Animated.delay(i * 160),
        Animated.spring(values[i], {
          toValue: 1,
          useNativeDriver: true,
          ...theme.spring.pop,
        }),
      ]),
    );
    const anim = Animated.parallel(steps);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [animated, values]);

  return (
    <View style={[styles.row, { gap: Math.round(size * 0.27) }]}>
      {SLOTS.map(i => (
        <Animated.Text
          key={'star-' + i}
          style={[
            styles.star,
            {
              fontSize: size,
              lineHeight: Math.round(size * 1.15),
              color: i < earned ? theme.colors.gold : theme.colors.borderSoft,
              transform: [{ scale: values[i] }],
            },
          ]}>
          {STAR}
        </Animated.Text>
      ))}
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

export const StarRow = React.memo(StarRowImpl);
export default StarRow;
