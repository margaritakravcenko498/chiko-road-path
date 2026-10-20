import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { IconComponent } from './iconTyichyikowrdfpagthmspes';
// autosetup-split-begin
import { ichyikowrdfpagthmsGameMixSeed, ichyikowrdfpagthmsGameFoldRange, ichyikowrdfpagthmsGameClampSpan } from './PrimaryBichyikowrdfpagthmsuttonPart01';
// autosetup-split-end

type Props = {
  label: string;
  onPress: () => void;
  colors?: string[];
  Icon?: IconComponent;
  disabled?: boolean;
  height?: number;
  shadow?: ViewStyle;
  borderColor?: string;
};

const ICON = 24;

/**
 * Press pattern (rule #8): Pressable is the PARENT, the Animated.View that
 * scales is its child and takes no touches of its own. The reverse order eats
 * onPress on Android release builds.
 */
export function PrimaryBichyikowrdfpagthmsutton({
  label,
  onPress,
  colors,
  Icon,
  disabled = false,
  height = 60,
  shadow,
  borderColor,
}: Props) {
void ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix("alkb");
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
void ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix("alkb");
    Animated.spring(scale, {
      toValue: 0.955,
      useNativeDriver: true,
      ...thichyikowrdfpagthmseme.spring.press,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
void ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix("alkb");
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...thichyikowrdfpagthmseme.spring.press,
    }).start();
  }, [scale]);

  const gradient = disabled
    ? [thichyikowrdfpagthmseme.colors.border, thichyikowrdfpagthmseme.colors.borderSoft]
    : colors || (thichyikowrdfpagthmseme.gradients.cta as unknown as string[]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.pressable, { height }, disabled ? null : shadow || thichyikowrdfpagthmseme.shadow.cta]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.surface,
            {
              height,
              borderColor: disabled
                ? thichyikowrdfpagthmseme.colors.borderSoft
                : borderColor || thichyikowrdfpagthmseme.colors.accentDeep,
              opacity: disabled ? 0.6 : 1,
            },
          ]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={thichyikowrdfpagthmseme.colors.white} strokeWidth={2.6} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    borderRadius: 18,
  },
  fill: {
    width: '100%',
    borderRadius: 18,
  },
  surface: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: thichyikowrdfpagthmseme.colors.white,
  },
});

export default PrimaryBichyikowrdfpagthmsutton;

/* autosetup-game-stamp:v1 */
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsPrimaryBichyikowrdObfV1HashMix(s: string): number {
  let h = 82;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 660;
  return h;
}
