import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import theme from '../constants/theme';
import { STAR } from '../game/stars';

export type LevelState = 'locked' | 'open' | 'current';

type Props = {
  index: number;
  stars: number;
  state: LevelState;
  size: number;
  onPress: (index: number) => void;
};

const SLOTS = [0, 1, 2];

function LevelCardImpl({ index, stars, state, size, onPress }: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  const handle = useCallback(() => {
    if (state === 'locked') {
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
      return;
    }
    onPress(index);
  }, [state, shake, onPress, index]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  });

  return (
    <Pressable
      onPress={handle}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      style={{ width: size, height: size + 16 }}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.card,
          { width: size, height: size + 16, transform: [{ translateX }] },
          state === 'locked' ? styles.locked : styles.open,
          state === 'current' ? styles.current : null,
        ]}>
        {state === 'locked' ? (
          <Lock size={22} color={theme.colors.textMuted} strokeWidth={2.2} />
        ) : (
          <View style={styles.inner}>
            <Text style={styles.number}>{index}</Text>
            <View style={styles.starRow}>
              {SLOTS.map(i => (
                <Text
                  key={'s' + i}
                  style={[
                    styles.star,
                    { color: i < stars ? theme.colors.gold : theme.colors.borderSoft },
                  ]}>
                  {STAR}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  open: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: '#322B3B',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  current: {
    borderWidth: 2.5,
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  locked: {
    backgroundColor: '#EFE6D2',
    borderColor: theme.colors.borderSoft,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  starRow: {
    marginTop: 3,
    flexDirection: 'row',
    gap: 3,
  },
  star: {
    fontSize: 13,
    lineHeight: 16,
  },
});

export const LevelCard = React.memo(LevelCardImpl);
export default LevelCard;
