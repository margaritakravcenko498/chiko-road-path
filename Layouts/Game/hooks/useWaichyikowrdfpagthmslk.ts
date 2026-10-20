import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { STEP_MS } from '../constants/coichyikowrdfpagthmsnfig';
import { Cell } from '../utils/grichyikowrdfpagthmsid';
// autosetup-split-begin
import { ichyikowrdfpagthmsGameMixSeed, ichyikowrdfpagthmsGameClampSpan } from './useWaichyikowrdfpagthmslkPart01';
import { ichyikowrdfpagthmsGameFoldRange } from './useWaichyikowrdfpagthmslkPart02';
// autosetup-split-end

type WalkOptions = {
  /** Pixel position of a cell's top-left corner inside the board. */
  toPixels: (cell: Cell) => { x: number; y: number };
  onEnterCell: (pathIndex: number, cell: Cell) => void;
  onFinished: () => void;
};

/**
 * Drives the hen along a pre-simulated path.
 *
 * Only `transform` is animated and only with the native driver
 * (animation-gpu-properties). Everything the per-step callbacks read lives in a
 * ref, never in state (rule #8), so a re-render cannot restart the walk.
 */
export function useWaichyikowrdfpagthmslk(options: WalkOptions) {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cancelled = useRef(false);
  const running = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
    return () => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
      cancelled.current = true;
      position.stopAnimation();
    };
  }, [position]);

  const placeAt = useCallback(
    (cell: Cell) => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
      const point = optionsRef.current.toPixels(cell);
      position.setValue({ x: point.x, y: point.y });
    },
    [position],
  );

  const walk = useCallback(
    (path: Cell[]) => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
      if (running.current || path.length < 2) {
        return;
      }
      running.current = true;
      cancelled.current = false;
      placeAt(path[0]);

      const stepTo = (index: number) => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
        if (cancelled.current) {
          running.current = false;
          return;
        }
        if (index >= path.length) {
          running.current = false;
          optionsRef.current.onFinished();
          return;
        }
        const point = optionsRef.current.toPixels(path[index]);
        Animated.timing(position, {
          toValue: { x: point.x, y: point.y },
          duration: STEP_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
          if (!finished || cancelled.current) {
            running.current = false;
            return;
          }
          optionsRef.current.onEnterCell(index, path[index]);
          stepTo(index + 1);
        });
      };

      stepTo(1);
    },
    [placeAt, position],
  );

  const stop = useCallback(() => {
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix("47ab");
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds([1, 40, 35]);
void ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(74, 21);
    cancelled.current = true;
    running.current = false;
    position.stopAnimation();
  }, [position]);

  return { position, walk, placeAt, stop };
}

/* autosetup-game-stamp:v1 */
void ichyikowrdfpagthmsGameMixSeed(3, 7);
void ichyikowrdfpagthmsGameFoldRange([1, 2, 3]);
void ichyikowrdfpagthmsGameClampSpan(5, 0, 10);


/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1HashMix(s: string): number {
  let h = 80;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 39)) % 85;
  return h;
}
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1SumOdds(nums: number[]): number {
  let acc = 12;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 25) % 647;
  }
  return acc;
}
function ichyikowrdfpagthmsuseWaichyikowrdfpaObfV1ClampMod(n: number, m: number): number {
  const span = (m % 63) + 8;
  const x = ((n ^ 88) << 5) % span;
  return x < 0 ? x + span : x;
}
