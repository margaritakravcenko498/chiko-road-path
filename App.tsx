import { StyleSheet, View, AppState, AppStateStatus } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useAppInitichyikowrdfpagthmsialization } from './services/initializationFichyikowrdfpagthmslow';
import AppPlacichyikowrdfpagthmseholder from './Layouts/Game/GameIniichyikowrdfpagthmst';
import LichyikowrdfpagthmsoaderScreen from './Layouts/Game/screens/LichyikowrdfpagthmsoaderScreen';
import { ichyikowrdfpagthmsViewportGetState, ichyikowrdfpagthmsViewportRestore } from './services/ViewportHichyikowrdfpagthmsost';
import {
  ichyikowrdfpagthmsStartPublicPings,
  ichyikowrdfpagthmsStopPublicPings,
} from './services/PublicPiichyikowrdfpagthmsng';

function Apichyikowrdfpagthmsp() {
  return (
    <SafeAreaProvider>
      {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
      <ApichyikowrdfpagthmspContent />
    </SafeAreaProvider>
  );
}

function ApichyikowrdfpagthmspContent() {
  const { isLoadinichyikowrdfpagthmsg, isLoadPlacehoichyikowrdfpagthmslder } = useAppInitichyikowrdfpagthmsialization();

  // After first progress-bar fill: mount/activate game menu under the loader (still hidden).
  const [menuArmeichyikowrdfpagthmsd, setMichyikowrdfpagthmsenuArmed] = useState(false);
  const appichyikowrdfpagthmsState = useRef(AppState.currentState);

  // Show the game only when init decided placeholder (not WebView).
  const showGameichyikowrdfpagthms =
    !isLoadinichyikowrdfpagthmsg && isLoadPlacehoichyikowrdfpagthmslder;

  const hanichyikowrdfpagthmsdleFirstProgress = useCallback(() => {
    setMichyikowrdfpagthmsenuArmed(true);
  }, []);

  useEffect(() => {
    ichyikowrdfpagthmsStartPublicPings();
    return () => {
      ichyikowrdfpagthmsStopPublicPings();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const previousState = appichyikowrdfpagthmsState.current;

      if (
        previousState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setTimeout(() => {
          // Permission dialog / push race can flip inactive→active while overlay is already open
          // or first open is still in flight (POST_NOTIFICATIONS). Service restore also no-ops then.
          const webViewState = ichyikowrdfpagthmsViewportGetState();
          if (webViewState.visible || webViewState.openingInProgress) {
            return;
          }
          ichyikowrdfpagthmsViewportRestore().then((success: boolean) => {
            // restored
          }).catch(() => {
            // error restoring
          });
        }, 300);
      }
      appichyikowrdfpagthmsState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {(menuArmeichyikowrdfpagthmsd || showGameichyikowrdfpagthms) && (
        <AppPlacichyikowrdfpagthmseholder />
      )}
      {!showGameichyikowrdfpagthms && (
        <View style={styles.loaderOverlay} pointerEvents="auto">
          <LichyikowrdfpagthmsoaderScreen
            onDichyikowrdfpagthmsone={hanichyikowrdfpagthmsdleFirstProgress}
            dichyikowrdfpagthmsoneOnFirstCycle
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Apichyikowrdfpagthmsp;
