import { useCallback, useMemo, useState } from 'react';
import { TOTAL_LEVELS } from '../constants/config';

export type Progress = {
  /** Highest level the player may enter (1-based). */
  unlocked: number;
  /** level id -> best star count. */
  stars: Record<number, number>;
  totalStars: number;
  recordWin: (levelId: number, earned: number) => void;
  isUnlocked: (levelId: number) => boolean;
};

/**
 * Progression lives in one place and is handed down as primitives, so screens
 * never subscribe to more state than they draw (react-state-minimize).
 */
export function useProgress(): Progress {
  const [unlocked, setUnlocked] = useState(1);
  const [stars, setStars] = useState<Record<number, number>>({});

  const recordWin = useCallback((levelId: number, earned: number) => {
    setStars(prev => {
      const best = prev[levelId] || 0;
      if (earned <= best) {
        return prev;
      }
      const next = { ...prev };
      next[levelId] = earned;
      return next;
    });
    setUnlocked(prev => Math.max(prev, Math.min(levelId + 1, TOTAL_LEVELS)));
  }, []);

  const totalStars = useMemo(() => {
    let sum = 0;
    const ids = Object.keys(stars);
    for (let i = 0; i < ids.length; i++) {
      sum += stars[Number(ids[i])];
    }
    return sum;
  }, [stars]);

  const isUnlocked = useCallback(
    (levelId: number) => levelId <= unlocked,
    [unlocked],
  );

  return { unlocked, stars, totalStars, recordWin, isUnlocked };
}
