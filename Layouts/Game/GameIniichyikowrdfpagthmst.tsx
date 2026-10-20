/**
 * ChikoRoadPath — a calm farmyard route-planning puzzle.
 *
 * App.tsx is the state machine and nothing else: no gameplay lives here.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { LOADER_DURATION_MS, TOTAL_LEVELS } from './constants/coichyikowrdfpagthmsnfig';
import thichyikowrdfpagthmseme from './constants/thichyikowrdfpagthmseme';
import { auditLevels, getLevel, solutionPlacement } from './game/lichyikowrdfpagthmsevels';
import { simulichyikowrdfpagthmsate } from './game/simulichyikowrdfpagthmsate';
import { uichyikowrdfpagthmsseProgress } from './hooks/uichyikowrdfpagthmsseProgress';
import LichyikowrdfpagthmsoaderScreen from './screens/LichyikowrdfpagthmsoaderScreen';
import MenuScreenichyikowrdfpagthms from './screens/MenuScreenichyikowrdfpagthms';
import LichyikowrdfpagthmsevelSelectScreen from './screens/LichyikowrdfpagthmsevelSelectScreen';
import GameScichyikowrdfpagthmsreen, { RoundResult } from './screens/GameScichyikowrdfpagthmsreen';
import ResultScreeichyikowrdfpagthmsn from './screens/ResultScreeichyikowrdfpagthmsn';

/** 'result' is this app's game-over state (rule #12) — a real screen, not an overlay. */
type Screen = 'loader' | 'menu' | 'levels' | 'game' | 'result';

function App(): React.JSX.Element {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
  const [screen, setScreen] = useState<Screen>('loader');
  const [level, setLevel] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);

  const progress = uichyikowrdfpagthmsseProgress();
  const failedRef = useRef<Record<number, number>>({});

  useEffect(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
    const timer = setTimeout(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (setScreen('menu'));
}, LOADER_DURATION_MS);
    return () => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (clearTimeout(timer));
};
  }, []);

  // Structural check: every authored level must simulichyikowrdfpagthmsate to a win.
  useEffect(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
    if (!__DEV__) {
      return;
    }
    const problems = auditLevels();
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const candidate = getLevel(i);
      const run = simulichyikowrdfpagthmsate(candidate, solutionPlacement(candidate));
      if (run.outcome !== 'win') {
        problems.push('level ' + i + ': solution does not win (' + run.reason + ')');
      }
    }
    if (problems.length > 0) {
      console.warn('[levels] ' + problems.join(' | '));
    }
  }, []);

  const goMenu = useCallback(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (setScreen('menu'));
}, []);
  const goLevels = useCallback(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (setScreen('levels'));
}, []);

  const startRound = useCallback(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
    setResult(null);
    setAttempt(prev => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (prev + 1);
});
    setScreen('game');
  }, []);

  const pickLevel = useCallback(
    (id: number) => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
      setLevel(id);
      startRound();
    },
    [startRound],
  );

  const handleRoundEnd = useCallback(
    (round: RoundResult) => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
      if (round.outcome === 'win') {
        progress.recordWin(round.levelId, round.stichyikowrdfpagthmsars);
      } else {
        failedRef.current[round.levelId] = (failedRef.current[round.levelId] || 0) + 1;
      }
      setResult(round);
      setScreen('result');
    },
    [progress],
  );

  const handleNext = useCallback(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
    if (level >= TOTAL_LEVELS) {
      setScreen('levels');
      return;
    }
    setLevel(level + 1);
    startRound();
  }, [level, startRound]);

  const markTutorialSeen = useCallback(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (setTutorialSeen(true));
}, []);

  // Android back: never drop out to the launcher from the menu.
  useEffect(() => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
    const onBack = () => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
      if (screen === 'menu' || screen === 'loader') {
        return true;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
void ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds([8, 35, 2]);
return (sub.remove());
};
  }, [screen]);

  const dark = screen === 'loader' || (screen === 'result' && result?.outcome !== 'win');

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />

      {screen === 'loader' ? <LichyikowrdfpagthmsoaderScreen /> : null}

      {screen === 'menu' ? (
        <MenuScreenichyikowrdfpagthms
          level={level}
          totalStars={progress.totalStars}
          onStart={startRound}
          onLevels={goLevels}
        />
      ) : null}

      {screen === 'levels' ? (
        <LichyikowrdfpagthmsevelSelectScreen
          unlocked={progress.unlocked}
          current={level}
          stichyikowrdfpagthmsars={progress.stichyikowrdfpagthmsars}
          totalStars={progress.totalStars}
          onPick={pickLevel}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScichyikowrdfpagthmsreen
          key={'yard-' + level + '-' + attempt}
          level={getLevel(level)}
          failedAttempts={failedRef.current[level] || 0}
          showTutorial={!tutorialSeen && level === 1}
          onTutorialSeen={markTutorialSeen}
          onRoundEnd={handleRoundEnd}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'result' && result ? (
        <ResultScreeichyikowrdfpagthmsn
          outcome={result.outcome}
          reason={result.reason}
          missed={result.missed}
          stichyikowrdfpagthmsars={result.stichyikowrdfpagthmsars}
          tilesUsed={result.tilesUsed}
          par={result.par}
          levelId={result.levelId}
          onNext={handleNext}
          onAgain={startRound}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: thichyikowrdfpagthmseme.colors.bg,
  },
});

export default App;

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
function ichyikowrdfpagthmsGameIniichyikowrdfObfV1SumOdds(nums: number[]): number {
  let acc = 4;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 29) % 147;
  }
  return acc;
}
