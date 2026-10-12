import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { IconComponent } from './iconTypes';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  tone?: 'solid' | 'ghost';
  height?: number;
};

const ICON = 24;

/** Same press pattern as PrimaryButton: Pressable outside, Animated.View in. */
export function SecondaryButton({ label, onPress, Icon, tone = 'solid', height = 48 }: Props) {
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.pressable, { height }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.surface,
          { height, transform: [{ scale }] },
          tone === 'ghost' ? styles.ghost : styles.solid,
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <Icon size={ICON} color={theme.colors.textSecondary} strokeWidth={2.4} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    borderRadius: 14,
  },
  surface: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textSecondary,
  },
});

export default SecondaryButton;
