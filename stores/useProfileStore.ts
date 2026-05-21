import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Achievement } from '@/types';
import { getLevelFromXP, getXPProgress, getRatStage, ACHIEVEMENTS } from '@/constants/gamification';

interface ProfileStore {
  name: string;
  xp: number;
  totalWorkouts: number;
  totalVolume: number;
  joinedAt: string;
  unlockedAchievements: string[];
  hasCompletedOnboarding: boolean;
  getLevel: () => number;
  getXPProgress: () => { current: number; required: number; percentage: number };
  getRatStage: () => { level: number; label: string; description: string };
  getAchievements: () => (Achievement & { isUnlocked: boolean })[];
  addXP: (amount: number) => void;
  incrementWorkouts: () => void;
  addVolume: (kg: number) => void;
  unlockAchievement: (id: string) => void;
  setName: (name: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      name: 'Rato Maromba',
      xp: 7250,
      totalWorkouts: 48,
      totalVolume: 156000,
      joinedAt: '2026-03-01T00:00:00.000Z',
      unlockedAchievements: ['first_workout', 'streak_7', 'streak_30'],
      hasCompletedOnboarding: false,

      getLevel: () => getLevelFromXP(get().xp),

      getXPProgress: () => getXPProgress(get().xp),

      getRatStage: () => getRatStage(getLevelFromXP(get().xp)),

      getAchievements: () => {
        const { unlockedAchievements } = get();
        return ACHIEVEMENTS.map(a => ({
          ...a,
          isUnlocked: unlockedAchievements.includes(a.id),
        }));
      },

      addXP: (amount: number) => {
        set(state => ({ xp: state.xp + amount }));
      },

      incrementWorkouts: () => {
        set(state => ({ totalWorkouts: state.totalWorkouts + 1 }));
      },

      addVolume: (kg: number) => {
        set(state => ({ totalVolume: state.totalVolume + kg }));
      },

      unlockAchievement: (id: string) => {
        const { unlockedAchievements } = get();
        if (unlockedAchievements.includes(id)) return;
        set({ unlockedAchievements: [...unlockedAchievements, id] });
      },

      setName: (name: string) => {
        set({ name });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },
    }),
    {
      name: 'fitrat-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        name: state.name,
        xp: state.xp,
        totalWorkouts: state.totalWorkouts,
        totalVolume: state.totalVolume,
        joinedAt: state.joinedAt,
        unlockedAchievements: state.unlockedAchievements,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
