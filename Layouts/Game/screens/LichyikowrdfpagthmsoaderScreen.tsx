import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { spriteChiko } from '../assets';
import AppShichyikowrdfpagthmsell from '../components/AppShichyikowrdfpagthmsell';

const BAR_W = 190;
const MAX_BURSTS = 3;
const BAR_WORDS = ['LOADING…', 'ROUTING…', 'WALKING…'] as const;
const PATH_DOTS = [
  thichyikowrdfpagthmseme.colors.gold,
  thichyikowrdfpagthmseme.colors.accent,
] as const;

type PathBit = {
  id: number;
  burstId: number;
  x: number;
  y: number;
  size: number;
  color: string;
  drift: number;
  life: number;
};

type LoaderProps = {
  onDichyikowrdfpagthmsone?: () => void;
  dichyikowrdfpagthmsoneOnFirstCycle?: boolean;
};

function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}

/**
 * Short-lived path dots. They rise off a background tap and die.
 * Loading does not wait on them.
 */
function PathDotRise({ bit, onGone }: { bit: PathBit; onGone: (id: number) => void }) {
  const opacity = useRef(new Animated.Value(0.95)).current;
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: bit.life,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: -bit.drift,
        duration: bit.life,
        useNativeDriver: true,
      }),
    ]);
    anim.start(({ finished }) => {
      if (alive && finished) onGone(bit.id);
    });
    return () => {
      alive = false;
      anim.stop();
    };
  }, [bit.drift, bit.id, bit.life, onGone, opacity, rise]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dot,
        {
          left: bit.x,
          top: bit.y,
          width: bit.size,
          height: bit.size,
          borderRadius: bit.size / 2,
          backgroundColor: bit.color,
          opacity,
          transform: [{ translateY: rise }],
        },
      ]}
    />
  );
}

/**
 * Splash stays fully opaque until the host unmounts it.
 * Persona: tap-forward on the Chiko sign (bounce / pulse / squash),
 * path dots that rise and fade, pulse-head bar that keeps filling.
 */
export function LichyikowrdfpagthmsoaderScreen({
  onDichyikowrdfpagthmsone,
  dichyikowrdfpagthmsoneOnFirstCycle,
}: LoaderProps = {}) {
  const insets = useSafeAreaInsets();
  const { width: winW, height: winH } = useWindowDimensions();
  const sizeRef = useRef({ width: winW, height: winH });
  sizeRef.current = { width: winW, height: winH };

  const progress = useRef(new Animated.Value(0)).current;
  const tip = useRef(new Animated.Value(0.45)).current;
  const entrance = useRef(new Animated.Value(0.72)).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const scaleY = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const holdScale = useRef(new Animated.Value(1)).current;

  const [bits, setBits] = useState<PathBit[]>([]);
  const [barWord, setBarWord] = useState<(typeof BAR_WORDS)[number]>('LOADING…');

  const onDoneRef = useRef(onDichyikowrdfpagthmsone);
  onDoneRef.current = onDichyikowrdfpagthmsone;
  const armFirstRef = useRef(Boolean(dichyikowrdfpagthmsoneOnFirstCycle));
  armFirstRef.current = Boolean(dichyikowrdfpagthmsoneOnFirstCycle);

  const touchedRef = useRef(false);
  const shotRef = useRef(0);
  const burstSeq = useRef(1);
  const bitSeq = useRef(1);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdingRef = useRef(false);
  const playTapRef = useRef<() => void>(() => {});
  const playBounceRef = useRef<() => void>(() => {});

  const barWidth = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, BAR_W],
      }),
    [progress],
  );
  const tiltSpin = useMemo(
    () =>
      tilt.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-7deg', '0deg', '7deg'],
      }),
    [tilt],
  );
  const posedX = useMemo(
    () => Animated.multiply(Animated.multiply(entrance, scaleX), holdScale),
    [entrance, scaleX, holdScale],
  );
  const posedY = useMemo(
    () => Animated.multiply(Animated.multiply(entrance, scaleY), holdScale),
    [entrance, scaleY, holdScale],
  );

  const dropBit = useCallback((id: number) => {
    setBits(prev => (prev.some(bit => bit.id === id) ? prev.filter(bit => bit.id !== id) : prev));
  }, []);

  const resetPose = useCallback(() => {
    lift.stopAnimation();
    scaleX.stopAnimation();
    scaleY.stopAnimation();
    lift.setValue(0);
    scaleX.setValue(1);
    scaleY.setValue(1);
  }, [lift, scaleX, scaleY]);

  const playBounce = useCallback(() => {
    resetPose();
    const up = 280 + Math.floor(Math.random() * 80);
    Animated.sequence([
      Animated.timing(lift, { toValue: -12, duration: up, useNativeDriver: true }),
      Animated.spring(lift, {
        toValue: 0,
        useNativeDriver: true,
        ...thichyikowrdfpagthmseme.spring.pop,
      }),
    ]).start();
  }, [lift, resetPose]);

  const playPulse = useCallback(() => {
    resetPose();
    const half = 140 + Math.floor(Math.random() * 80);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 1.08, duration: half, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 1.08, duration: half, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 1, duration: half + 40, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 1, duration: half + 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, [resetPose, scaleX, scaleY]);

  const playSquash = useCallback(() => {
    resetPose();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleX, { toValue: 1.14, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleY, { toValue: 0.86, duration: 150, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scaleX, {
          toValue: 1,
          useNativeDriver: true,
          ...thichyikowrdfpagthmseme.spring.pop,
        }),
        Animated.spring(scaleY, {
          toValue: 1,
          useNativeDriver: true,
          ...thichyikowrdfpagthmseme.spring.pop,
        }),
      ]),
    ]).start();
  }, [resetPose, scaleX, scaleY]);

  const playTap = useCallback(() => {
    const which = shotRef.current % 3;
    shotRef.current += 1;
    if (which === 0) playBounce();
    else if (which === 1) playPulse();
    else playSquash();
  }, [playBounce, playPulse, playSquash]);

  playTapRef.current = playTap;
  playBounceRef.current = playBounce;

  const spawnDots = useCallback((x: number, y: number) => {
    const { width, height } = sizeRef.current;
    const cx = clamp(x, 8, Math.max(8, width - 8));
    const cy = clamp(y, 8, Math.max(8, height - 8));
    const burstId = burstSeq.current++;
    const count = 8 + Math.floor(Math.random() * 5);
    const spread = 24 + Math.random() * 48;
    const order = Math.random() < 0.5 ? [0, 1] : [1, 0];
    const fresh: PathBit[] = [];
    for (let i = 0; i < count; i++) {
      const along = count === 1 ? 0 : (i / (count - 1)) * spread - spread / 2;
      const size = 3 + Math.random() * 5;
      fresh.push({
        id: bitSeq.current++,
        burstId,
        x: clamp(cx + along, 4, Math.max(4, width - size - 4)),
        y: clamp(cy + (Math.random() - 0.5) * 10, 4, Math.max(4, height - size - 4)),
        size,
        color: PATH_DOTS[order[i % 2]],
        drift: 20 + Math.random() * 28,
        life: 300 + Math.floor(Math.random() * 400),
      });
    }
    setBits(prev => {
      const seen: number[] = [];
      for (const bit of prev) {
        if (!seen.includes(bit.burstId)) seen.push(bit.burstId);
      }
      const keep = new Set(seen.slice(-(MAX_BURSTS - 1)));
      return prev.filter(bit => keep.has(bit.burstId)).concat(fresh);
    });
  }, []);

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      useNativeDriver: true,
      ...thichyikowrdfpagthmseme.spring.pop,
    }).start();
  }, [entrance]);

  useEffect(() => {
    const delay = 2000 + Math.floor(Math.random() * 2000);
    const id = setTimeout(() => {
      if (!touchedRef.current) playBounceRef.current();
    }, delay);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let stopped = false;
    let word = 0;
    const fired = { done: false };
    const fillOnce = () => {
      if (stopped) return;
      progress.setValue(0);
      setBarWord(BAR_WORDS[word % BAR_WORDS.length]);
      word += 1;
      tip.stopAnimation();
      tip.setValue(0.4);
      Animated.sequence([
        Animated.timing(tip, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(tip, { toValue: 0.55, duration: 260, useNativeDriver: true }),
      ]).start();
      const ms = 1300 + Math.floor(Math.random() * 900);
      Animated.timing(progress, {
        toValue: 1,
        duration: ms,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished || stopped) return;
        if (armFirstRef.current && !fired.done) {
          fired.done = true;
          onDoneRef.current?.();
        }
        fillOnce();
      });
    };
    fillOnce();
    return () => {
      stopped = true;
      progress.stopAnimation();
      tip.stopAnimation();
    };
  }, [progress, tip]);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        touchedRef.current = true;
        holdingRef.current = false;
        if (holdTimer.current) clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => {
          holdingRef.current = true;
          Animated.spring(holdScale, {
            toValue: 1.05,
            useNativeDriver: true,
            ...thichyikowrdfpagthmseme.spring.press,
          }).start();
        }, 220);
      },
      onPanResponderRelease: (_evt, g) => {
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
        const wasHold = holdingRef.current;
        holdingRef.current = false;
        if (wasHold) {
          Animated.spring(holdScale, {
            toValue: 1,
            useNativeDriver: true,
            ...thichyikowrdfpagthmseme.spring.pop,
          }).start();
        }
        const moved = Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8;
        if (moved) {
          const tiltTo = clamp(g.dx / 72, -1, 1);
          Animated.sequence([
            Animated.timing(tilt, { toValue: tiltTo, duration: 140, useNativeDriver: true }),
            Animated.spring(tilt, {
              toValue: 0,
              useNativeDriver: true,
              ...thichyikowrdfpagthmseme.spring.pop,
            }),
          ]).start();
          return;
        }
        if (!wasHold) playTapRef.current();
      },
      onPanResponderTerminate: () => {
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
        holdingRef.current = false;
        Animated.spring(holdScale, { toValue: 1, useNativeDriver: true }).start();
        Animated.spring(tilt, { toValue: 0, useNativeDriver: true }).start();
      },
    }),
  ).current;

  const onBackground = (event: GestureResponderEvent) => {
    spawnDots(event.nativeEvent.locationX, event.nativeEvent.locationY);
  };

  return (
    <AppShichyikowrdfpagthmsell variant="loader">
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onBackground} />

        <View style={styles.column} pointerEvents="box-none">
          <View style={styles.signHit} {...pan.panHandlers}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.sign,
                {
                  transform: [
                    { translateY: lift },
                    { scaleX: posedX },
                    { scaleY: posedY },
                    { rotate: tiltSpin },
                  ],
                },
              ]}>
              <Image source={spriteChiko} style={styles.sprite} resizeMode="contain" />
            </Animated.View>
          </View>

          <Text style={styles.brand}>CHIKO ROAD</Text>
          <Text style={styles.brandSecond}>PATH</Text>
          <Text style={styles.tagline}>PLAN THE ROUTE · WALK IT HOME</Text>

          <View
            style={styles.barTrack}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}>
            <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={[thichyikowrdfpagthmseme.colors.gold, thichyikowrdfpagthmseme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barFill}
              />
              <Animated.View pointerEvents="none" style={[styles.barTip, { opacity: tip }]} />
            </Animated.View>
          </View>
          <Text style={styles.loading}>{barWord}</Text>
        </View>

        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {bits.map(bit => (
            <PathDotRise key={bit.id} bit={bit} onGone={dropBit} />
          ))}
        </View>

        <Text
          pointerEvents="none"
          style={[styles.hint, { bottom: Math.max(22, insets.bottom + 14) }]}>
          TAP THE PATH
        </Text>
      </View>
    </AppShichyikowrdfpagthmsell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  signHit: {
    width: 132,
    height: 132,
    marginBottom: 26,
  },
  sign: {
    width: 132,
    height: 132,
    borderRadius: 16,
    backgroundColor: thichyikowrdfpagthmseme.colors.woodDark,
    borderWidth: 3,
    borderColor: thichyikowrdfpagthmseme.colors.woodLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  sprite: {
    width: 92,
    height: 92,
  },
  brand: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    color: thichyikowrdfpagthmseme.colors.textOnDark,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  brandSecond: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    color: thichyikowrdfpagthmseme.colors.gold,
  },
  tagline: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: 'rgba(255,241,213,0.62)',
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,241,213,0.16)',
    overflow: 'hidden',
  },
  barFillWrap: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    flex: 1,
    borderRadius: 3,
  },
  barTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF6D4',
  },
  loading: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: 'rgba(255,241,213,0.5)',
  },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: 'rgba(255,241,213,0.42)',
  },
  dot: {
    position: 'absolute',
  },
});

export default LichyikowrdfpagthmsoaderScreen;

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
