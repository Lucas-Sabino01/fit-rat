/**
 * Fit Rat — Default Exercise Library
 * Organized by muscle group with metadata for tracking
 */

export type MuscleGroup = 
  | 'peito' 
  | 'costas' 
  | 'ombros' 
  | 'biceps' 
  | 'triceps' 
  | 'pernas' 
  | 'abdomen' 
  | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  defaultSets: number;
  defaultReps: string; // e.g. "8-12"
  icon: string;
}

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  pernas: 'Pernas',
  abdomen: 'Abdômen',
  cardio: 'Cardio',
};

export const MUSCLE_GROUP_ICONS: Record<MuscleGroup, string> = {
  peito: '🫁',
  costas: '🔙',
  ombros: '🦾',
  biceps: '💪',
  triceps: '💪',
  pernas: '🦵',
  abdomen: '🎯',
  cardio: '❤️',
};

export const EXERCISES: Exercise[] = [
  // Peito
  { id: 'supino_reto', name: 'Supino Reto', muscleGroup: 'peito', equipment: 'Barra', defaultSets: 4, defaultReps: '8-12', icon: '🏋️' },
  { id: 'supino_inclinado', name: 'Supino Inclinado', muscleGroup: 'peito', equipment: 'Halter', defaultSets: 4, defaultReps: '8-12', icon: '🏋️' },
  { id: 'supino_declinado', name: 'Supino Declinado', muscleGroup: 'peito', equipment: 'Barra', defaultSets: 3, defaultReps: '10-12', icon: '🏋️' },
  { id: 'crucifixo', name: 'Crucifixo', muscleGroup: 'peito', equipment: 'Halter', defaultSets: 3, defaultReps: '12-15', icon: '🦋' },
  { id: 'crossover', name: 'Crossover', muscleGroup: 'peito', equipment: 'Cabo', defaultSets: 3, defaultReps: '12-15', icon: '🔗' },
  { id: 'flexao', name: 'Flexão de Braço', muscleGroup: 'peito', equipment: 'Corpo', defaultSets: 3, defaultReps: '15-20', icon: '🤸' },

  // Costas
  { id: 'remada_curvada', name: 'Remada Curvada', muscleGroup: 'costas', equipment: 'Barra', defaultSets: 4, defaultReps: '8-12', icon: '🚣' },
  { id: 'puxada_frontal', name: 'Puxada Frontal', muscleGroup: 'costas', equipment: 'Cabo', defaultSets: 4, defaultReps: '8-12', icon: '⬇️' },
  { id: 'remada_unilateral', name: 'Remada Unilateral', muscleGroup: 'costas', equipment: 'Halter', defaultSets: 3, defaultReps: '10-12', icon: '🚣' },
  { id: 'pulldown', name: 'Pulldown', muscleGroup: 'costas', equipment: 'Cabo', defaultSets: 3, defaultReps: '10-12', icon: '⬇️' },
  { id: 'barra_fixa', name: 'Barra Fixa', muscleGroup: 'costas', equipment: 'Corpo', defaultSets: 3, defaultReps: '6-10', icon: '🧗' },

  // Ombros
  { id: 'desenvolvimento', name: 'Desenvolvimento', muscleGroup: 'ombros', equipment: 'Halter', defaultSets: 4, defaultReps: '8-12', icon: '🔝' },
  { id: 'elevacao_lateral', name: 'Elevação Lateral', muscleGroup: 'ombros', equipment: 'Halter', defaultSets: 3, defaultReps: '12-15', icon: '↔️' },
  { id: 'elevacao_frontal', name: 'Elevação Frontal', muscleGroup: 'ombros', equipment: 'Halter', defaultSets: 3, defaultReps: '12-15', icon: '⬆️' },
  { id: 'remada_alta', name: 'Remada Alta', muscleGroup: 'ombros', equipment: 'Barra', defaultSets: 3, defaultReps: '10-12', icon: '🔝' },

  // Bíceps
  { id: 'rosca_direta', name: 'Rosca Direta', muscleGroup: 'biceps', equipment: 'Barra', defaultSets: 3, defaultReps: '8-12', icon: '💪' },
  { id: 'rosca_alternada', name: 'Rosca Alternada', muscleGroup: 'biceps', equipment: 'Halter', defaultSets: 3, defaultReps: '10-12', icon: '💪' },
  { id: 'rosca_martelo', name: 'Rosca Martelo', muscleGroup: 'biceps', equipment: 'Halter', defaultSets: 3, defaultReps: '10-12', icon: '🔨' },
  { id: 'rosca_scott', name: 'Rosca Scott', muscleGroup: 'biceps', equipment: 'Barra', defaultSets: 3, defaultReps: '10-12', icon: '💪' },

  // Tríceps
  { id: 'triceps_corda', name: 'Tríceps Corda', muscleGroup: 'triceps', equipment: 'Cabo', defaultSets: 3, defaultReps: '10-15', icon: '🔗' },
  { id: 'triceps_testa', name: 'Tríceps Testa', muscleGroup: 'triceps', equipment: 'Barra', defaultSets: 3, defaultReps: '10-12', icon: '🧠' },
  { id: 'triceps_frances', name: 'Tríceps Francês', muscleGroup: 'triceps', equipment: 'Halter', defaultSets: 3, defaultReps: '10-12', icon: '🇫🇷' },
  { id: 'mergulho', name: 'Mergulho', muscleGroup: 'triceps', equipment: 'Corpo', defaultSets: 3, defaultReps: '8-12', icon: '⬇️' },

  // Pernas
  { id: 'agachamento', name: 'Agachamento', muscleGroup: 'pernas', equipment: 'Barra', defaultSets: 4, defaultReps: '8-12', icon: '🦵' },
  { id: 'leg_press', name: 'Leg Press', muscleGroup: 'pernas', equipment: 'Máquina', defaultSets: 4, defaultReps: '10-15', icon: '🦵' },
  { id: 'extensora', name: 'Cadeira Extensora', muscleGroup: 'pernas', equipment: 'Máquina', defaultSets: 3, defaultReps: '12-15', icon: '🦵' },
  { id: 'flexora', name: 'Mesa Flexora', muscleGroup: 'pernas', equipment: 'Máquina', defaultSets: 3, defaultReps: '12-15', icon: '🦵' },
  { id: 'stiff', name: 'Stiff', muscleGroup: 'pernas', equipment: 'Barra', defaultSets: 3, defaultReps: '10-12', icon: '🦵' },
  { id: 'panturrilha', name: 'Panturrilha', muscleGroup: 'pernas', equipment: 'Máquina', defaultSets: 4, defaultReps: '15-20', icon: '🦵' },

  // Abdômen
  { id: 'abdominal', name: 'Abdominal', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: '15-20', icon: '🎯' },
  { id: 'prancha', name: 'Prancha', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: '30-60s', icon: '🎯' },
  { id: 'abdominal_infra', name: 'Infra Abdominal', muscleGroup: 'abdomen', equipment: 'Corpo', defaultSets: 3, defaultReps: '15-20', icon: '🎯' },

  // Cardio
  { id: 'esteira', name: 'Esteira', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: '20-30min', icon: '🏃' },
  { id: 'bicicleta', name: 'Bicicleta', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: '20-30min', icon: '🚴' },
  { id: 'eliptico', name: 'Elíptico', muscleGroup: 'cardio', equipment: 'Máquina', defaultSets: 1, defaultReps: '20-30min', icon: '🏃' },
];

// Pre-built workout templates
export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  exerciseIds: string[];
  isCustom?: boolean;
}

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'treino_a',
    name: 'Treino A',
    description: 'Peito e Tríceps',
    muscleGroups: ['peito', 'triceps'],
    exerciseIds: ['supino_reto', 'supino_inclinado', 'crucifixo', 'crossover', 'triceps_corda', 'triceps_testa'],
  },
  {
    id: 'treino_b',
    name: 'Treino B',
    description: 'Costas e Bíceps',
    muscleGroups: ['costas', 'biceps'],
    exerciseIds: ['remada_curvada', 'puxada_frontal', 'remada_unilateral', 'pulldown', 'rosca_direta', 'rosca_alternada'],
  },
  {
    id: 'treino_c',
    name: 'Treino C',
    description: 'Pernas',
    muscleGroups: ['pernas'],
    exerciseIds: ['agachamento', 'leg_press', 'extensora', 'flexora', 'stiff', 'panturrilha'],
  },
  {
    id: 'treino_d',
    name: 'Treino D',
    description: 'Ombros e Abdômen',
    muscleGroups: ['ombros', 'abdomen'],
    exerciseIds: ['desenvolvimento', 'elevacao_lateral', 'elevacao_frontal', 'remada_alta', 'abdominal', 'prancha'],
  },
];

// Micro-workout exercises (3 min)
export const MICRO_WORKOUT_EXERCISES = [
  { name: 'Polichinelos', reps: 50 },
  { name: 'Flexões', reps: 20 },
  { name: 'Agachamento Livre', reps: 30 },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id);
}

export function getExercisesByGroup(group: MuscleGroup): Exercise[] {
  return EXERCISES.filter(e => e.muscleGroup === group);
}
