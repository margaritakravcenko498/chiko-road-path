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
  const dots = useMemo<Dot[]>(() => {
    const out: Dot[] = [];
    let seed = 1337;
    const next = () => {
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
      {dots.map(dot => (
        <View
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
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export const DecorDots = React.memo(DecorDotsImpl);
export default DecorDots;
