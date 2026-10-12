import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { bgGame, bgLoader, bgMenu } from '../assets';
import DecorDots from './DecorDots';

export type ShellVariant = 'loader' | 'menu' | 'levels' | 'game' | 'win' | 'lose';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

/**
 * Background + decor layer for every screen. Three layers minimum
 * (gradient or art -> decor -> surfaces), never a flat single colour.
 */
export function AppShell({ variant, children }: Props) {
  if (variant === 'menu' || variant === 'game') {
    const source = variant === 'menu' ? bgMenu : bgGame;
    return (
      <ImageBackground source={source} style={styles.root} resizeMode="cover">
        {variant === 'menu' ? (
          <LinearGradient
            colors={theme.gradients.menuOverlay as unknown as string[]}
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
          colors={theme.gradients.loaderOverlay as unknown as string[]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <DecorDots count={42} color={theme.colors.gold} maxOpacity={0.26} />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    );
  }

  if (variant === 'win' || variant === 'lose') {
    const colors =
      variant === 'win' ? theme.gradients.win : theme.gradients.lose;
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
      colors={theme.gradients.levels as unknown as string[]}
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
    backgroundColor: theme.colors.bg,
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
    backgroundColor: theme.colors.gold,
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

export default AppShell;
