import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Hand, MousePointerClick, Play } from 'lucide-react-native';
import theme from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import { IconComponent } from './iconTypes';

const SCREEN_W = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

type Step = { key: string; n: string; text: string; Icon: IconComponent };

const STEPS: Step[] = [
  { key: 'arm', n: '1', text: 'TAP AN ARROW IN THE TRAY', Icon: Hand },
  { key: 'drop', n: '2', text: 'TAP A CELL ON THE BOARD', Icon: MousePointerClick },
  { key: 'go', n: '3', text: 'LAUNCH AND WATCH HER WALK', Icon: Play },
];

/**
 * Shown once on the first yard. A component, not a screen — a sixth screen
 * that is only ever reachable once would starve the screenshot gate.
 */
export function TutorialOverlay({ visible, onDismiss }: Props) {
  const scale = useRef(new Animated.Value(0.86)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }
    scale.setValue(0.86);
    fade.setValue(0);
    const anim = Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 46, friction: 8 }),
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [visible, scale, fade]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View pointerEvents="box-none" style={[styles.scrim, { opacity: fade }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.title}>THREE ARROWS</Text>
        <Text style={styles.sub}>LAY THEM DOWN, THEN SET HER OFF</Text>

        <View style={styles.steps}>
          {STEPS.map(step => (
            <View key={step.key} style={styles.step}>
              <View style={styles.stepIcon}>
                <step.Icon size={24} color={theme.colors.accent} strokeWidth={2.4} />
              </View>
              <Text style={styles.stepNum}>{step.n}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cta}>
          <PrimaryButton label="GOT IT" onPress={onDismiss} height={52} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(50,43,59,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  card: {
    width: Math.min(SCREEN_W - 56, 320),
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: theme.colors.textPrimary,
  },
  sub: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: theme.colors.textMuted,
  },
  steps: {
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(237,126,69,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    color: theme.colors.accent,
    width: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: theme.colors.textSecondary,
  },
  cta: {
    width: '100%',
    marginTop: 18,
  },
});

export default TutorialOverlay;
