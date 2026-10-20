import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import thichyikowrdfpagthmseme from '../constants/thichyikowrdfpagthmseme';
import { bgGame, bgLoader, bgMenu } from '../assets';
import DeichyikowrdfpagthmscorDots from './DeichyikowrdfpagthmscorDots';

export type ShellVariant = 'loader' | 'menu' | 'levels' | 'game' | 'win' | 'lose';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

/**
 * Background + decor layer for every screen. Three layers minimum
 * (gradient or art -> decor -> surfaces), never a flat single colour.
 */
export function AppShichyikowrdfpagthmsell({ variant, children }: Props) {
void ichyikowrdfpagthmsAppShichyikowrdfpaObfV1ByteFold("56");
void ichyikowrdfpagthmsAppShichyikowrdfpaObfV1HashMix("i5");
void ichyikowrdfpagthmsAppShichyikowrdfpaObfV1SumOdds([1, 24, 35]);
void ichyikowrdfpagthmsAppShichyikowrdfpaObfV1ClampMod(58, 53);
  if (variant === 'menu' || variant === 'game') {
    const source = variant === 'menu' ? bgMenu : bgGame;
    return (
      <ImageBackground source={source} style={styles.root} resizeMode="cover">
        {variant === 'menu' ? (
          <LinearGradient
            colors={thichyikowrdfpagthmseme.gradients.menuOverlay as unknown as string[]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        ) : (
          <View style={styles.gameWash} />
        )}
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    );
  }

  if (variant === 'loader') {
    // Same artwork as @drawable/splash_screen, so the pre-bridge window and the
    // first JS frame are one continuous image instead of a black cut.
    return (
      <ImageBackground source={bgLoader} style={styles.root} resizeMode="cover">
        <LinearGradient
          colors={thichyikowrdfpagthmseme.gradients.loaderOverlay as unknown as string[]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <DeichyikowrdfpagthmscorDots count={42} color={thichyikowrdfpagthmseme.colors.gold} maxOpacity={0.26} />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    );
  }

  if (variant === 'win' || variant === 'lose') {
    const colors =
      variant === 'win' ? thichyikowrdfpagthmseme.gradients.win : thichyikowrdfpagthmseme.gradients.lose;
    return (
      <LinearGradient
        colors={colors as unknown as string[]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.root}>
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={thichyikowrdfpagthmseme.gradients.lichyikowrdfpagthmsevels as unknown as string[]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.root}>
      <View style={[styles.blob, styles.blobOne]} pointerEvents="none" />
      <View style={[styles.blob, styles.blobTwo]} pointerEvents="none" />
      <View style={[styles.blob, styles.blobThree]} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: thichyikowrdfpagthmseme.colors.bg,
  },
  content: {
    flex: 1,
  },
  gameWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,241,213,0.42)',
  },
  blob: {
    position: 'absolute',
    backgroundColor: thichyikowrdfpagthmseme.colors.gold,
    opacity: 0.07,
    borderRadius: 999,
  },
  blobOne: {
    width: 240,
    height: 240,
    top: -60,
    right: -70,
  },
  blobTwo: {
    width: 200,
    height: 200,
    top: '38%',
    left: -80,
  },
  blobThree: {
    width: 180,
    height: 180,
    bottom: -50,
    right: -40,
  },
});

export default AppShichyikowrdfpagthmsell;

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
function ichyikowrdfpagthmsAppShichyikowrdfpaObfV1ByteFold(s: string): number {
  let x = 42;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 37) & 13327;
  return x;
}
function ichyikowrdfpagthmsAppShichyikowrdfpaObfV1HashMix(s: string): number {
  let h = 77;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 28)) % 516;
  return h;
}
function ichyikowrdfpagthmsAppShichyikowrdfpaObfV1SumOdds(nums: number[]): number {
  let acc = 82;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 11) % 413;
  }
  return acc;
}
function ichyikowrdfpagthmsAppShichyikowrdfpaObfV1ClampMod(n: number, m: number): number {
  const span = (m % 29) + 8;
  const x = ((n ^ 8) << 5) % span;
  return x < 0 ? x + span : x;
}
