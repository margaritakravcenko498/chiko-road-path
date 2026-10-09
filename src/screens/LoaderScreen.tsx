import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { spriteChiko } from '../assets';
import AppShell from '../components/AppShell';

const BAR_W = 190;

/**
 * Splash. Deliberately dark where the Menu is cream (rule #14) and completely
 * static from ~2.6s onward (rule: no perpetual loop) — the capture tool
 * attaches long after every animation here has come to rest.
 */
export function LoaderScreen() {
  const signScale = useRef(new Animated.Value(0.72)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.spring(signScale, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.spring.soft,
      }),
      Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]);

    // Finite: three beats, then the brand mark holds still.
    const beat = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 380, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
      { iterations: 3 },
    );

    // width cannot run on the native driver (animation-gpu-properties).
    const bar = Animated.timing(barWidth, {
      toValue: BAR_W,
      duration: 2200,
      useNativeDriver: false,
    });

    entry.start();
    beat.start();
    bar.start();

    return () => {
      entry.stop();
      beat.stop();
      bar.stop();
    };
  }, [signScale, fade, pulse, barWidth]);

  return (
    <AppShell variant="loader">
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.sign,
            { opacity: fade, transform: [{ scale: Animated.multiply(signScale, pulse) }] },
          ]}>
          <Image source={spriteChiko} style={styles.sprite} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={{ opacity: fade }}>
          <Text style={styles.brand}>CHIKO ROAD</Text>
          <Text style={styles.brandSecond}>PATH</Text>
          <Text style={styles.tagline}>PLAN THE ROUTE · WALK IT HOME</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={[theme.colors.gold, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sign: {
    width: 132,
    height: 132,
    borderRadius: 16,
    backgroundColor: theme.colors.woodDark,
    borderWidth: 3,
    borderColor: theme.colors.woodLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
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
    color: theme.colors.textOnDark,
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
    color: theme.colors.gold,
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
  loading: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: 'rgba(255,241,213,0.5)',
  },
});

export default LoaderScreen;
