/**
 * ChikoRoadPath — a calm farmyard route-planning puzzle.
 *
 * App.tsx is the state machine and nothing else: no gameplay lives here.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { LOADER_DURATION_MS, TOTAL_LEVELS } from './src/constants/config';
import theme from './src/constants/theme';
import { auditLevels, getLevel, solutionPlacement } from './src/game/levels';
import { simulate } from './src/game/simulate';
import { useProgress } from './src/hooks/useProgress';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen, { RoundResult } from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';

/** 'result' is this app's game-over state (rule #12) — a real screen, not an overlay. */
type Screen = 'loader' | 'menu' | 'levels' | 'game' | 'result';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [level, setLevel] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);

  const progress = useProgress();
  const failedRef = useRef<Record<number, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => setScreen('menu'), LOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Structural check: every authored level must simulate to a win.
  useEffect(() => {
    if (!__DEV__) {
      return;
    }
    const problems = auditLevels();
    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const candidate = getLevel(i);
      const run = simulate(candidate, solutionPlacement(candidate));
      if (run.outcome !== 'win') {
        problems.push('level ' + i + ': solution does not win (' + run.reason + ')');
      }
    }
    if (problems.length > 0) {
      console.warn('[levels] ' + problems.join(' | '));
    }
  }, []);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goLevels = useCallback(() => setScreen('levels'), []);

  const startRound = useCallback(() => {
    setResult(null);
    setAttempt(prev => prev + 1);
    setScreen('game');
  }, []);

  const pickLevel = useCallback(
    (id: number) => {
      setLevel(id);
      startRound();
    },
    [startRound],
  );

  const handleRoundEnd = useCallback(
    (round: RoundResult) => {
      if (round.outcome === 'win') {
        progress.recordWin(round.levelId, round.stars);
      } else {
        failedRef.current[round.levelId] = (failedRef.current[round.levelId] || 0) + 1;
      }
      setResult(round);
      setScreen('result');
    },
    [progress],
  );

  const handleNext = useCallback(() => {
    if (level >= TOTAL_LEVELS) {
      setScreen('levels');
      return;
    }
    setLevel(level + 1);
    startRound();
  }, [level, startRound]);

  const markTutorialSeen = useCallback(() => setTutorialSeen(true), []);

  // Android back: never drop out to the launcher from the menu.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'menu' || screen === 'loader') {
        return true;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  const dark = screen === 'loader' || (screen === 'result' && result?.outcome !== 'win');

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />

      {screen === 'loader' ? <LoaderScreen /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          level={level}
          totalStars={progress.totalStars}
          onStart={startRound}
          onLevels={goLevels}
        />
      ) : null}

      {screen === 'levels' ? (
        <LevelSelectScreen
          unlocked={progress.unlocked}
          current={level}
          stars={progress.stars}
          totalStars={progress.totalStars}
          onPick={pickLevel}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
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
        <ResultScreen
          outcome={result.outcome}
          reason={result.reason}
          missed={result.missed}
          stars={result.stars}
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
    backgroundColor: theme.colors.bg,
  },
});

export default App;
