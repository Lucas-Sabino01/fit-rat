/**
 * Fit Rat — TypeScript Type Definitions
 */

import type { MuscleGroup } from '@/constants/exercises';

// ─── Profile ─────────────────────────────────────────────────
export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  avatarStage: number;
  joinedAt: string;
  totalWorkouts: number;
  totalVolume: number; // kg total levantado
}

// ─── Streak ──────────────────────────────────────────────────
export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  restTickets: number;
  lastWorkoutDate: string | null; // ISO date
  streakHistory: StreakDay[];
}

export interface StreakDay {
  date: string; // YYYY-MM-DD
  type: 'workout' | 'active_rest' | 'micro' | 'ticket' | 'rest' | 'missed';
}

// ─── Workout ─────────────────────────────────────────────────
export type WorkoutStatus = 'idle' | 'active' | 'paused' | 'completed';

export interface ActiveWorkout {
  id: string;
  templateId: string | null;
  name: string;
  startedAt: string;
  completedAt?: string;
  exercises: WorkoutExercise[];
  status: WorkoutStatus;
  totalXP: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
  isCompleted: boolean;
}

export interface WorkoutSet {
  id: number;
  reps: number;
  weight: number;
  isCompleted: boolean;
  setType: 'warmup' | 'normal' | 'dropset' | 'failure';
  isPersonalRecord?: boolean;
}

// ─── Workout History ─────────────────────────────────────────
export interface WorkoutHistory {
  id: string;
  name: string;
  date: string;
  duration: number; // seconds
  exercises: number;
  sets: number;
  volume: number; // kg
  xpEarned: number;
  rating?: 1 | 2 | 3; // Fácil, Bom, Pesado
}

// ─── Achievements ────────────────────────────────────────────
export interface Achievement {
  id: string;
  label: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

// ─── Trail (Trilha) ──────────────────────────────────────────
export interface TrailPhase {
  id: number;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  workoutsRequired: number;
  workoutsCompleted: number;
}
