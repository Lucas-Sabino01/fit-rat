export const XP_PER_ACTION = {
  completeWorkout: 100,
  completeSet: 5,
  completeExercise: 15,
  microWorkout: 30,
  activeRest: 10,
  streakBonus7: 50,
  streakBonus30: 200,
  streakBonus100: 500,
  personalRecord: 75,
};
export const LEVEL_THRESHOLDS = [
  0,
  100,
  250,
  500,
  800,
  1200,
  1700,
  2300,
  3000,
  3800,
  4700,
  5700,
  6800,
  8000,
  9500,
  11000,
  13000,
  15000,
  17500,
  20000,
];

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = getLevelFromXP(xp);
  if (level >= MAX_LEVEL) return { current: xp, required: xp, percentage: 100 };

  const currentLevelXP = LEVEL_THRESHOLDS[level - 1];
  const nextLevelXP = LEVEL_THRESHOLDS[level];
  const progress = xp - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;

  return {
    current: progress,
    required,
    percentage: Math.round((progress / required) * 100),
  };
}

export const STREAK_CONFIG = {
  maxRestTickets: 3,
  restTicketRechargeEvery: 7,
  microWorkoutDurationSec: 180,
  activeRestOptions: [
    { id: 'stretching', label: 'Alongamento', duration: '5-10 min', icon: '🧘' },
    { id: 'walking', label: 'Caminhada', duration: '20-30 min', icon: '🚶' },
    { id: 'mobility', label: 'Mobilidade', duration: '5-10 min', icon: '🔄' },
  ],
};

export const BELTS = [
  { id: 'white', label: 'Branca', color: '#FFFFFF', requiredStreak: 0 },
  { id: 'blue', label: 'Azul', color: '#42A5F5', requiredStreak: 7 },
  { id: 'red', label: 'Roxa', color: '#AB47BC', requiredStreak: 14 },
  { id: 'brown', label: 'Marrom', color: '#8D6E63', requiredStreak: 30 },
  { id: 'black', label: 'Preta', color: '#37474F', requiredStreak: 60 },
];

export function getCurrentBelt(streakDays: number) {
  for (let i = BELTS.length - 1; i >= 0; i--) {
    if (streakDays >= BELTS[i].requiredStreak) return BELTS[i];
  }
  return BELTS[0];
}

export function getNextBelt(streakDays: number) {
  for (let i = 0; i < BELTS.length; i++) {
    if (streakDays < BELTS[i].requiredStreak) return BELTS[i];
  }
  return null;
}

export const RAT_STAGES = [
  { level: 1, label: 'Rato Iniciante', description: 'Acabou de chegar na academia' },
  { level: 5, label: 'Rato Dedicado', description: 'Já criou o hábito' },
  { level: 10, label: 'Rato Forte', description: 'Músculos começando a aparecer' },
  { level: 15, label: 'Rato Maromba', description: 'Shape de respeito' },
  { level: 20, label: 'Rato Lendário', description: 'O mestre da disciplina' },
];

export function getRatStage(level: number) {
  for (let i = RAT_STAGES.length - 1; i >= 0; i--) {
    if (level >= RAT_STAGES[i].level) return RAT_STAGES[i];
  }
  return RAT_STAGES[0];
}

export const ACHIEVEMENTS = [
  { id: 'first_workout', label: 'Primeiro Treino', icon: '🏋️', description: 'Complete seu primeiro treino' },
  { id: 'streak_7', label: '7 Dias Seguidos', icon: '🔥', description: '7 dias de ofensiva' },
  { id: 'streak_30', label: '30 Dias Seguidos', icon: '💪', description: '30 dias de ofensiva' },
  { id: 'streak_100', label: '100 Dias!', icon: '🏆', description: '100 dias consecutivos' },
  { id: 'micro_saver', label: 'Salva-Ofensiva', icon: '⚡', description: 'Use um micro-treino' },
  { id: 'volume_1k', label: '1K de Volume', icon: '📊', description: 'Levante 1.000kg em um treino' },
  { id: 'level_10', label: 'Nível 10', icon: '⭐', description: 'Alcance o nível 10' },
  { id: 'level_20', label: 'Nível Máximo', icon: '👑', description: 'Alcance o nível 20' },
];
