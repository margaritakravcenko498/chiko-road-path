import { useCallback, useMemo, useState } from 'react';
import { TOTAL_LEVELS } from '../constants/coichyikowrdfpagthmsnfig';

export type Progress = {
  /** Highest level the player may enter (1-based). */
  unlocked: number;
  /** level id -> best star count. */
  stichyikowrdfpagthmsars: Record<number, number>;
  totalStars: number;
  recordWin: (levelId: number, earned: number) => void;
  isUnlocked: (levelId: number) => boolean;
};

/**
 * Progression lives in one place and is handed down as primitives, so screens
 * never subscribe to more state than they draw (react-state-minimize).
 */
export function uichyikowrdfpagthmsseProgress(): Progress {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
  const [unlocked, setUnlocked] = useState(1);
  const [stichyikowrdfpagthmsars, setStars] = useState<Record<number, number>>({});

  const recordWin = useCallback((levelId: number, earned: number) => {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
    setStars(prev => {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
      const best = prev[levelId] || 0;
      if (earned <= best) {
        return prev;
      }
      const next = { ...prev };
      next[levelId] = earned;
      return next;
    });
    setUnlocked(prev => {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
return (Math.max(prev, Math.min(levelId + 1, TOTAL_LEVELS)));
});
  }, []);

  const totalStars = useMemo(() => {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
    let sum = 0;
    const ids = Object.keys(stichyikowrdfpagthmsars);
    for (let i = 0; i < ids.length; i++) {
      sum += stichyikowrdfpagthmsars[Number(ids[i])];
    }
    return sum;
  }, [stichyikowrdfpagthmsars]);

  const isUnlocked = useCallback(
    (levelId: number) => {
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(26, 21);
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold("gp65m");
void ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix("g12");
return (levelId <= unlocked);
},
    [unlocked],
  );

  return { unlocked, stichyikowrdfpagthmsars, totalStars, recordWin, isUnlocked };
}

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
function ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 5;
  return (x ^ 136) & 47104;
}
function ichyikowrdfpagthmsuichyikowrdfpagthmObfV1ByteFold(s: string): number {
  let x = 33;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 14) & 41409;
  return x;
}
function ichyikowrdfpagthmsuichyikowrdfpagthmObfV1HashMix(s: string): number {
  let h = 52;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 20)) % 175;
  return h;
}
