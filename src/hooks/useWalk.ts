import { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { STEP_MS } from '../constants/config';
import { Cell } from '../utils/grid';

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
export function useWalk(options: WalkOptions) {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cancelled = useRef(false);
  const running = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    return () => {
      cancelled.current = true;
      position.stopAnimation();
    };
  }, [position]);

  const placeAt = useCallback(
    (cell: Cell) => {
      const point = optionsRef.current.toPixels(cell);
      position.setValue({ x: point.x, y: point.y });
    },
    [position],
  );

  const walk = useCallback(
    (path: Cell[]) => {
      if (running.current || path.length < 2) {
        return;
      }
      running.current = true;
      cancelled.current = false;
      placeAt(path[0]);

      const stepTo = (index: number) => {
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
    cancelled.current = true;
    running.current = false;
    position.stopAnimation();
  }, [position]);

  return { position, walk, placeAt, stop };
}
