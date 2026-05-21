import { create } from 'zustand';
import type { ActiveWorkout, WorkoutExercise, WorkoutSet, WorkoutStatus, WorkoutHistory } from '@/types';
import { getExerciseById, WORKOUT_TEMPLATES, WorkoutTemplate, Exercise } from '@/constants/exercises';
import { XP_PER_ACTION } from '@/constants/gamification';

interface WorkoutStore {
  activeWorkout: ActiveWorkout | null;
  workoutHistory: WorkoutHistory[];
  userTemplates: WorkoutTemplate[];
  customExercises: Exercise[];
  restTimerSeconds: number;
  isRestTimerRunning: boolean;
  startWorkout: (templateId: string) => void;
  startCustomWorkout: (name: string, exerciseIds: string[]) => void;
  completeSet: (exerciseIndex: number, setIndex: number, reps: number, weight: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  completeExercise: (exerciseIndex: number) => void;
  addCustomExercise: (exercise: Exercise) => void;
  finishWorkout: (rating?: 1 | 2 | 3) => WorkoutHistory | null;
  cancelWorkout: () => void;
  startRestTimer: (seconds: number) => void;
  tickRestTimer: () => void;
  stopRestTimer: () => void;
  updateSetWeight: (exerciseIndex: number, setIndex: number, weight: number) => void;
  updateSetReps: (exerciseIndex: number, setIndex: number, reps: number) => void;
  updateSetType: (exerciseIndex: number, setIndex: number, type: 'warmup' | 'normal' | 'dropset' | 'failure') => void;
  swapExercise: (exerciseIndex: number, newExerciseId: string) => void;
  saveUserTemplate: (template: WorkoutTemplate) => void;
  deleteUserTemplate: (id: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  activeWorkout: null,
  workoutHistory: generateMockWorkoutHistory(),
  userTemplates: [],
  customExercises: [],
  restTimerSeconds: 0,
  isRestTimerRunning: false,

  startWorkout: (templateId: string) => {
    const { userTemplates, customExercises } = get();
    const template = WORKOUT_TEMPLATES.find(t => t.id === templateId) || userTemplates.find(t => t.id === templateId);
    if (!template) return;

    const exercises: WorkoutExercise[] = template.exerciseIds
      .map((id: string) => {
        const exercise = getExerciseById(id) || customExercises.find(e => e.id === id);
        if (!exercise) return null;
        return {
          exerciseId: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: Array.from({ length: exercise.defaultSets }, (_, i) => ({
            id: i + 1,
            reps: 0,
            weight: 0,
            isCompleted: false,
            setType: 'normal' as const,
          })),
          isCompleted: false,
        };
      })
      .filter(Boolean) as WorkoutExercise[];

    set({
      activeWorkout: {
        id: generateId(),
        templateId,
        name: template.name,
        startedAt: new Date().toISOString(),
        exercises,
        status: 'active',
        totalXP: 0,
      },
    });
  },

  startCustomWorkout: (name: string, exerciseIds: string[]) => {
    const { customExercises } = get();
    const exercises: WorkoutExercise[] = exerciseIds
      .map(id => {
        const exercise = getExerciseById(id) || customExercises.find(e => e.id === id);
        if (!exercise) return null;
        return {
          exerciseId: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: Array.from({ length: exercise.defaultSets }, (_, i) => ({
            id: i + 1,
            reps: 0,
            weight: 0,
            isCompleted: false,
            setType: 'normal' as const,
          })),
          isCompleted: false,
        };
      })
      .filter(Boolean) as WorkoutExercise[];

    set({
      activeWorkout: {
        id: generateId(),
        templateId: null,
        name,
        startedAt: new Date().toISOString(),
        exercises,
        status: 'active',
        totalXP: 0,
      },
    });
  },

  completeSet: (exerciseIndex: number, setIndex: number, reps: number, weight: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], reps, weight, isCompleted: true };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises,
        totalXP: activeWorkout.totalXP + XP_PER_ACTION.completeSet,
      },
    });
  },

  addSet: (exerciseIndex: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets.push({
      id: sets.length + 1,
      reps: 0,
      weight: sets.length > 0 ? sets[sets.length - 1].weight : 0,
      isCompleted: false,
      setType: 'normal',
    });
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  removeSet: (exerciseIndex: number, setIndex: number) => {
    const { activeWorkout } = get();
    if (activeWorkout) {
      const exercises = [...activeWorkout.exercises];
      const sets = [...exercises[exerciseIndex].sets];
      
      sets.splice(setIndex, 1);
      const updatedSets = sets.map((s, i) => ({ ...s, id: i + 1 }));

      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        sets: updatedSets,
      };
      set({ activeWorkout: { ...activeWorkout, exercises } });
    }
  },

  completeExercise: (exerciseIndex: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], isCompleted: true };

    set({
      activeWorkout: {
        ...activeWorkout,
        exercises,
        totalXP: activeWorkout.totalXP + XP_PER_ACTION.completeExercise,
      },
    });
  },

  finishWorkout: (rating?: 1 | 2 | 3) => {
    const { activeWorkout, workoutHistory } = get();
    if (!activeWorkout) return null;

    const now = new Date();
    const startTime = new Date(activeWorkout.startedAt);
    const duration = Math.round((now.getTime() - startTime.getTime()) / 1000);

    const completedSets = activeWorkout.exercises.reduce(
      (total, ex) => total + ex.sets.filter(s => s.isCompleted).length,
      0
    );
    const totalVolume = activeWorkout.exercises.reduce(
      (total, ex) =>
        total + ex.sets.filter(s => s.isCompleted).reduce((v, s) => v + s.reps * s.weight, 0),
      0
    );
    const totalXP = activeWorkout.totalXP + XP_PER_ACTION.completeWorkout;

    const historyEntry: WorkoutHistory = {
      id: activeWorkout.id,
      name: activeWorkout.name,
      date: activeWorkout.startedAt,
      duration,
      exercises: activeWorkout.exercises.length,
      sets: completedSets,
      volume: totalVolume,
      xpEarned: totalXP,
      rating,
    };

    set({
      activeWorkout: null,
      workoutHistory: [historyEntry, ...workoutHistory],
      restTimerSeconds: 0,
      isRestTimerRunning: false,
    });

    return historyEntry;
  },

  cancelWorkout: () => {
    set({ activeWorkout: null, restTimerSeconds: 0, isRestTimerRunning: false });
  },

  startRestTimer: (seconds: number) => {
    set({ restTimerSeconds: seconds, isRestTimerRunning: true });
  },

  tickRestTimer: () => {
    const { restTimerSeconds } = get();
    if (restTimerSeconds <= 0) {
      set({ isRestTimerRunning: false, restTimerSeconds: 0 });
      return;
    }
    set({ restTimerSeconds: restTimerSeconds - 1 });
  },

  stopRestTimer: () => {
    set({ restTimerSeconds: 0, isRestTimerRunning: false });
  },

  updateSetWeight: (exerciseIndex: number, setIndex: number, weight: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], weight };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  updateSetReps: (exerciseIndex: number, setIndex: number, reps: number) => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], reps };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  updateSetType: (exerciseIndex: number, setIndex: number, type: 'warmup' | 'normal' | 'dropset' | 'failure') => {
    const { activeWorkout } = get();
    if (!activeWorkout) return;

    const exercises = [...activeWorkout.exercises];
    const sets = [...exercises[exerciseIndex].sets];
    sets[setIndex] = { ...sets[setIndex], setType: type };
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets };

    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  swapExercise: (exerciseIndex: number, newExerciseId: string) => {
    const { activeWorkout, customExercises } = get();
    if (!activeWorkout) return;

    const newExercise = getExerciseById(newExerciseId) || customExercises.find(e => e.id === newExerciseId);
    if (!newExercise) return;

    const exercises = [...activeWorkout.exercises];
    exercises[exerciseIndex] = {
      ...exercises[exerciseIndex],
      exerciseId: newExercise.id,
      name: newExercise.name,
      muscleGroup: newExercise.muscleGroup,
    };

    set({ activeWorkout: { ...activeWorkout, exercises } });
  },

  saveUserTemplate: (template: WorkoutTemplate) => {
    const { userTemplates } = get();
    set({ userTemplates: [...userTemplates, template] });
  },

  deleteUserTemplate: (id: string) => {
    const { userTemplates } = get();
    set({ userTemplates: userTemplates.filter(t => t.id !== id) });
  },

  addCustomExercise: (exercise: Exercise) => {
    const { customExercises } = get();
    set({ customExercises: [...customExercises, exercise] });
  },
}));

function generateMockWorkoutHistory(): WorkoutHistory[] {
  const history: WorkoutHistory[] = [];
  const templateNames = ['Treino A', 'Treino B', 'Treino C', 'Treino D'];

  for (let i = 1; i <= 15; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (Math.random() > 0.3) {
      history.push({
        id: `hist_${i}`,
        name: templateNames[i % templateNames.length],
        date: d.toISOString(),
        duration: 2400 + Math.floor(Math.random() * 3600),
        exercises: 4 + Math.floor(Math.random() * 3),
        sets: 12 + Math.floor(Math.random() * 8),
        volume: 3000 + Math.floor(Math.random() * 7000),
        xpEarned: 80 + Math.floor(Math.random() * 100),
        rating: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
      });
    }
  }

  return history;
}
