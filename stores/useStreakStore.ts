/**
 * Fit Rat — Streak Store (v2 with Persistence)
 * Manages the user's workout streak, rest tickets, and streak history
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StreakDay } from '@/types';
import { STREAK_CONFIG } from '@/constants/gamification';

interface StreakStore {
  currentStreak: number;
  bestStreak: number;
  restTickets: number;
  lastWorkoutDate: string | null;
  streakHistory: StreakDay[];

  // Actions
  recordWorkout: () => void;
  recordMicroWorkout: () => void;
  recordActiveRest: () => void;
  useRestTicket: () => void;
  resetStreak: () => void;
  getStreakCalendar: (month: number, year: number) => StreakDay[];
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function isConsecutive(lastDate: string | null): boolean {
  if (!lastDate) return false;
  const yesterday = getYesterdayStr();
  const today = getTodayStr();
  return lastDate === yesterday || lastDate === today;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 24,
      bestStreak: 37,
      restTickets: STREAK_CONFIG.maxRestTickets,
      lastWorkoutDate: getYesterdayStr(),
      streakHistory: generateMockHistory(),

      recordWorkout: () => {
        const today = getTodayStr();
        const { lastWorkoutDate, currentStreak, bestStreak, streakHistory } = get();

        if (lastWorkoutDate === today) return;

        const newStreak = isConsecutive(lastWorkoutDate) ? currentStreak + 1 : 1;
        const newBest = Math.max(bestStreak, newStreak);

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastWorkoutDate: today,
          streakHistory: [...streakHistory, { date: today, type: 'workout' }],
        });
      },

      recordMicroWorkout: () => {
        const today = getTodayStr();
        const { lastWorkoutDate, currentStreak, bestStreak, streakHistory } = get();

        if (lastWorkoutDate === today) return;

        const newStreak = isConsecutive(lastWorkoutDate) ? currentStreak + 1 : 1;
        const newBest = Math.max(bestStreak, newStreak);

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastWorkoutDate: today,
          streakHistory: [...streakHistory, { date: today, type: 'micro' }],
        });
      },

      recordActiveRest: () => {
        const today = getTodayStr();
        const { lastWorkoutDate, currentStreak, bestStreak, streakHistory } = get();

        if (lastWorkoutDate === today) return;

        const newStreak = isConsecutive(lastWorkoutDate) ? currentStreak + 1 : 1;
        const newBest = Math.max(bestStreak, newStreak);

        set({
          currentStreak: newStreak,
          bestStreak: newBest,
          lastWorkoutDate: today,
          streakHistory: [...streakHistory, { date: today, type: 'active_rest' }],
        });
      },

      useRestTicket: () => {
        const { restTickets } = get();
        if (restTickets <= 0) return;

        const today = getTodayStr();
        const { lastWorkoutDate, currentStreak, bestStreak, streakHistory } = get();

        if (lastWorkoutDate === today) return;

        const newStreak = isConsecutive(lastWorkoutDate) ? currentStreak + 1 : 1;
        const newBest = Math.max(bestStreak, newStreak);

        set({
          restTickets: restTickets - 1,
          currentStreak: newStreak,
          bestStreak: newBest,
          lastWorkoutDate: today,
          streakHistory: [...streakHistory, { date: today, type: 'ticket' }],
        });
      },

      resetStreak: () => {
        set({ currentStreak: 0 });
      },

      getStreakCalendar: (month: number, year: number) => {
        const { streakHistory } = get();
        return streakHistory.filter(day => {
          const d = new Date(day.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });
      },
    }),
    {
      name: 'fitrat-streak',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        restTickets: state.restTickets,
        lastWorkoutDate: state.lastWorkoutDate,
        streakHistory: state.streakHistory,
      }),
    }
  )
);

// Generate mock history for the past 30 days for demo
function generateMockHistory(): StreakDay[] {
  const history: StreakDay[] = [];
  const today = new Date();

  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Simulate a realistic streak pattern
    const rand = Math.random();
    if (rand > 0.15) {
      history.push({ date: dateStr, type: 'workout' });
    } else if (rand > 0.08) {
      history.push({ date: dateStr, type: 'active_rest' });
    } else {
      history.push({ date: dateStr, type: 'rest' });
    }
  }

  return history;
}
