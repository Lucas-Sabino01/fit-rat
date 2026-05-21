import { Platform } from 'react-native';

export const Colors = {
  bg: '#0D1117',
  bgCard: '#161B22',
  bgCardHover: '#1C2333',
  bgSurface: '#21262D',
  bgElevated: '#2D333B',
  border: '#30363D',
  borderLight: '#3D444D',
  borderFocus: '#58A6FF',
  primary: '#F85149',
  primaryDark: '#DA3633',
  primaryLight: '#FF7B72',
  primaryBg: 'rgba(248, 81, 73, 0.12)',
  primaryGlow: 'rgba(248, 81, 73, 0.4)',
  streak: '#F0883E',
  streakDark: '#DB6D28',
  streakLight: '#FFA657',
  streakBg: 'rgba(240, 136, 62, 0.12)',
  xp: '#F4C145',
  xpDark: '#D29922',
  xpLight: '#F7D76E',
  xpBg: 'rgba(244, 193, 69, 0.12)',
  success: '#3FB950',
  successDark: '#2EA043',
  successLight: '#56D364',
  successBg: 'rgba(63, 185, 80, 0.12)',
  trail: '#58A6FF',
  trailDark: '#388BFD',
  trailLight: '#79C0FF',
  trailBg: 'rgba(88, 166, 255, 0.12)',
  evolution: '#BC8CFF',
  evolutionDark: '#A371F7',
  evolutionLight: '#D2A8FF',
  evolutionBg: 'rgba(188, 140, 255, 0.12)',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  textDisabled: '#484F58',
  error: '#F85149',
  warning: '#F0883E',
  info: '#58A6FF',
  beltWhite: '#F0F6FC',
  beltBlue: '#58A6FF',
  beltPurple: '#BC8CFF',
  beltBrown: '#C69026',
  beltBlack: '#8B949E',
  overlay: 'rgba(0, 0, 0, 0.65)',
  overlayLight: 'rgba(0, 0, 0, 0.35)',
  background: '#0D1117',
  card: '#161B22',
  cardBorder: '#30363D',
  textDark: '#484F58',
  streakFire: '#F0883E',
  xpGold: '#F4C145',
  tabBarActive: '#F85149',
  tabBarInactive: '#6E7681',
} as const;
export const FontFamily = {
  regular: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_400Regular',
  }) as string,
  medium: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_500Medium',
  }) as string,
  semibold: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_600SemiBold',
  }) as string,
  bold: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_700Bold',
  }) as string,
  extrabold: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_800ExtraBold',
  }) as string,
  black: Platform.select({
    web: "'Inter', 'Segoe UI', system-ui, sans-serif",
    default: 'Inter_900Black',
  }) as string,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,
  '6xl': 52,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  }),
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const Gradients = {
  primaryCta: ['#F85149', '#DA3633'] as const,
  streakFire: ['#F0883E', '#DB6D28'] as const,
  xpGold: ['#F4C145', '#D29922'] as const,
  successGreen: ['#3FB950', '#2EA043'] as const,
  trailBlue: ['#58A6FF', '#388BFD'] as const,
  evolutionPurple: ['#BC8CFF', '#A371F7'] as const,
  cardSubtle: ['#161B22', '#0D1117'] as const,
  heroOverlay: ['rgba(13,17,23,0)', 'rgba(13,17,23,0.95)'] as const,
  celebration: ['#F85149', '#F0883E', '#F4C145'] as const,
} as const;
