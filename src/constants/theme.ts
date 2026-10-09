/**
 * WARM_EARTHY preset (design-system/presets.ts) with the brief's accent overrides.
 * rule #11b — the `name` field stays exactly as it is in the preset.
 */
export const PRESET = 'WARM_EARTHY';

export const theme = {
  name: 'warm-earthy',

  colors: {
    /** base cream */
    bg: '#FFF1D5',
    /** deep ink — loader / loss gradient */
    bgDeep: '#322B3B',
    bgDeepAlt: '#453A4E',
    bgDeepLow: '#2A2433',

    surface: '#FFF9EC',
    surfaceAlt: '#F2EAD8',
    surfaceSunk: '#E8DDC4',

    border: '#D8C9A8',
    borderSoft: '#DCD2BE',
    wood: '#A8824F',
    woodDark: '#5C4A3A',
    woodLight: '#8A6B4E',

    accent: '#ED7E45',
    accentDeep: '#C96434',
    gold: '#F6C64B',
    goldDeep: '#C99A2E',
    success: '#62B86B',
    successDeep: '#3E8A48',
    successMid: '#4A9D55',
    info: '#4B9ED2',

    textPrimary: '#322B3B',
    textSecondary: '#6B5B45',
    textMuted: '#A4937A',
    textOnDark: '#FFF1D5',
    white: '#FFFFFF',
  },

  gradients: {
    loader: ['#322B3B', '#453A4E', '#2A2433'],
    /** darkening wash over bg_loader art so the brand type stays legible */
    loaderOverlay: ['rgba(50,43,59,0.80)', 'rgba(50,43,59,0.52)', 'rgba(42,36,51,0.88)'],
    menuOverlay: ['rgba(255,241,213,0.10)', 'rgba(255,241,213,0.55)', '#FFF1D5'],
    levels: ['#FFF1D5', '#F2EAD8', '#E8DDC4'],
    cta: ['#F6C64B', '#ED7E45'],
    launch: ['#62B86B', '#4A9D55'],
    win: ['#3E8A48', '#62B86B', '#FFF1D5'],
    lose: ['#322B3B', '#5A4A52', '#E8DDC4'],
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    sheet: 28,
    pill: 999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    xxl: 32,
  },

  type: {
    hero: { fontSize: 34, fontWeight: '900' as const, letterSpacing: 3 },
    headline: { fontSize: 30, fontWeight: '900' as const, letterSpacing: 1.4 },
    title: { fontSize: 28, fontWeight: '900' as const, letterSpacing: 1.2 },
    screenTitle: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1.4 },
    button: { fontSize: 17, fontWeight: '900' as const, letterSpacing: 1.6 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    value: { fontSize: 13, fontWeight: '800' as const },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.4 },
  },

  shadow: {
    card: {
      shadowColor: '#322B3B',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    board: {
      shadowColor: '#322B3B',
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 7 },
      elevation: 8,
    },
    sheet: {
      shadowColor: '#322B3B',
      shadowOpacity: 0.16,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -6 },
      elevation: 12,
    },
    panel: {
      shadowColor: '#322B3B',
      shadowOpacity: 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: -5 },
      elevation: 10,
    },
    cta: {
      shadowColor: '#ED7E45',
      shadowOpacity: 0.42,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 9,
    },
    launch: {
      shadowColor: '#62B86B',
      shadowOpacity: 0.4,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 9,
    },
    sign: {
      shadowColor: '#000000',
      shadowOpacity: 0.45,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
    },
  },

  spring: {
    soft: { tension: 42, friction: 7 },
    press: { tension: 300, friction: 12 },
    drop: { tension: 180, friction: 9 },
    pop: { tension: 120, friction: 8 },
    sheet: { tension: 50, friction: 9 },
    badge: { tension: 40, friction: 6 },
  },
} as const;

export type Theme = typeof theme;
export default theme;
