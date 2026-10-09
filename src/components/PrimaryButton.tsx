import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { IconComponent } from './iconTypes';

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
export function PrimaryButton({
  label,
  onPress,
  colors,
  Icon,
  disabled = false,
  height = 60,
  shadow,
  borderColor,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.955,
      useNativeDriver: true,
      ...theme.spring.press,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...theme.spring.press,
    }).start();
  }, [scale]);

  const gradient = disabled
    ? [theme.colors.border, theme.colors.borderSoft]
    : colors || (theme.gradients.cta as unknown as string[]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.pressable, { height }, disabled ? null : shadow || theme.shadow.cta]}>
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
                ? theme.colors.borderSoft
                : borderColor || theme.colors.accentDeep,
              opacity: disabled ? 0.6 : 1,
            },
          ]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.white} strokeWidth={2.6} /> : null}
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
    color: theme.colors.white,
  },
});

export default PrimaryButton;
