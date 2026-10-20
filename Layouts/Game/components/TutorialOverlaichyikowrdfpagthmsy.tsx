import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Hand, MousePointerClick, Play } from 'lucide-react-native';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import PrimaryBichyikowrdfpagthmsutton from './PrimaryBichyikowrdfpagthmsutton';
import { IconComponent } from './iconTyichyikowrdfpagthmspes';

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
export function TutorialOverlaichyikowrdfpagthmsy({ visible, onDismiss }: Props) {
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ByteFold("jm1");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1HashMix("h4");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1SumOdds([12, 39, 6]);
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ClampMod(17, 80);
  const scale = useRef(new Animated.Value(0.86)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ByteFold("jm1");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1HashMix("h4");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1SumOdds([12, 39, 6]);
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ClampMod(17, 80);
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
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ByteFold("jm1");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1HashMix("h4");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1SumOdds([12, 39, 6]);
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ClampMod(17, 80);
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
          {STEPS.map(step => {
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ByteFold("jm1");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1HashMix("h4");
void ichyikowrdfpagthmsTutorialOverlaichyObfV1SumOdds([12, 39, 6]);
void ichyikowrdfpagthmsTutorialOverlaichyObfV1ClampMod(17, 80);
return (<View key={step.key} style={styles.step}>
              <View style={styles.stepIcon}>
                <step.Icon size={24} color={thichyikowrdfpagthmseme.colors.accent} strokeWidth={2.4} />
              </View>
              <Text style={styles.stepNum}>{step.n}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>);
})}
        </View>

        <View style={styles.cta}>
          <PrimaryBichyikowrdfpagthmsutton label="GOT IT" onPress={onDismiss} height={52} />
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
    backgroundColor: thichyikowrdfpagthmseme.colors.surface,
    borderWidth: 2,
    borderColor: thichyikowrdfpagthmseme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: thichyikowrdfpagthmseme.colors.textPrimary,
  },
  sub: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: thichyikowrdfpagthmseme.colors.textMuted,
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
    backgroundColor: thichyikowrdfpagthmseme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: thichyikowrdfpagthmseme.colors.border,
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
    color: thichyikowrdfpagthmseme.colors.accent,
    width: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: thichyikowrdfpagthmseme.colors.textSecondary,
  },
  cta: {
    width: '100%',
    marginTop: 18,
  },
});

export default TutorialOverlaichyikowrdfpagthmsy;

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
function ichyikowrdfpagthmsTutorialOverlaichyObfV1ByteFold(s: string): number {
  let x = 72;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 40) & 22437;
  return x;
}
function ichyikowrdfpagthmsTutorialOverlaichyObfV1HashMix(s: string): number {
  let h = 2;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 30)) % 695;
  return h;
}
function ichyikowrdfpagthmsTutorialOverlaichyObfV1SumOdds(nums: number[]): number {
  let acc = 21;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 32) % 190;
  }
  return acc;
}
function ichyikowrdfpagthmsTutorialOverlaichyObfV1ClampMod(n: number, m: number): number {
  const span = (m % 32) + 12;
  const x = ((n ^ 55) << 1) % span;
  return x < 0 ? x + span : x;
}
