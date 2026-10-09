/** Tunable gameplay + pipeline constants. */

/** rule #13 — exactly 8000ms, shorter races the screenshot capture window. */
export const LOADER_DURATION_MS = 8000;

/**
 * Single-shot idle backstop on GameScreen. Armed once on mount, never re-armed.
 * Long enough that the slow UI capture gets at least one frame of the untouched
 * board before the demo solves the level and jumps to the result screen.
 */
export const AUTO_DEMO_MS = 90000;

/** Delay between the auto-demo's tile placements. */
export const AUTO_DEMO_STEP_MS = 120;

/** One walk step, cell to cell. */
export const STEP_MS = 380;

/** Feeder collect pop. */
export const FEEDER_POP_MS = 220;

/** Loop guard for the walk simulation. */
export const MAX_STEPS = 64;

export const COLS = 6;
export const ROWS = 6;

export const BOARD_PAD = 6;
export const BOARD_BORDER = 3;

export const TOTAL_LEVELS = 12;

/** Tutorial overlay: shown once on level 1, then auto-dismissed. */
export const TUTORIAL_OPEN_MS = 600;
export const TUTORIAL_AUTO_CLOSE_MS = 3500;
