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
  const hop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

export const HenSprite = React.memo(HenSpriteImpl);
export default HenSprite;
