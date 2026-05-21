import type { MuscleGroup } from '@/constants/exercises';

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  avatarStage: number;
  joinedAt: string;
  totalWorkouts: number;
  totalVolume: number;
}

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  restTickets: number;
  lastWorkoutDate: string | null;
  streakHistory: StreakDay[];
}

export interface StreakDay {
  date: string;
  type: 'workout' | 'active_rest' | 'micro' | 'ticket' | 'rest' | 'missed';
}

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

export interface WorkoutHistory {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: number;
  sets: number;
  volume: number;
  xpEarned: number;
  rating?: 1 | 2 | 3;
}

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

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
