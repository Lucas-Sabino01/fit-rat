/**
 * Fit Rat — Animation Constants
 * Standardized timing and easing for consistent feel
 */

import { Easing } from 'react-native-reanimated';

// ─── Durations ──────────────────────────────────────────────
export const Duration = {
  instant: 100,
  fast: 200,
  normal: 350,
  slow: 500,
  celebration: 800,
  pageTransition: 400,
} as const;

// ─── Easings ────────────────────────────────────────────────
export const Easings = {
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0, 1, 1),
} as const;

// ─── Stagger delays for list animations ─────────────────────
export const Stagger = {
  fast: 50,
  normal: 80,
  slow: 120,
} as const;

// ─── Reanimated entering presets ─────────────────────────────
// Use with: entering={Presets.fadeSlideIn(delay)}
export const AnimConfig = {
  fadeSlideInDuration: 450,
  celebrationDuration: 1200,
  pulseScale: { min: 0.95, max: 1.05 },
  shimmerDuration: 1500,
} as const;
