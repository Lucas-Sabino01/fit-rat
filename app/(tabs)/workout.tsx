/**
 * Fit Rat — Workout Screen (v2 Redesign)
 * Advanced Active Workout & Custom Templates (Premium Features)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Gradients, Spacing, BorderRadius } from '@/constants/theme';
import { Stagger } from '@/constants/animations';
import { WORKOUT_TEMPLATES, MICRO_WORKOUT_EXERCISES, MuscleGroup } from '@/constants/exercises';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { CelebrationScreen } from '@/components/celebration/CelebrationScreen';
import { RestTimer } from '@/components/workout/RestTimer';
import { useHaptics } from '@/hooks/useHaptics';

// Premium Modals
import { ExerciseDetailsModal } from '@/components/workout/ExerciseDetailsModal';
import { SwapExerciseModal } from '@/components/workout/SwapExerciseModal';
import { PlateCalculatorModal } from '@/components/workout/PlateCalculatorModal';

export default function WorkoutScreen() {
  const { 
    activeWorkout, startWorkout, completeSet, addSet, removeSet, finishWorkout, cancelWorkout, 
    updateSetWeight, updateSetReps, updateSetType, userTemplates, deleteUserTemplate, swapExercise 
  } = useWorkoutStore();
  
  const { recordWorkout, currentStreak } = useStreakStore();
  const { addXP, incrementWorkouts, addVolume } = useProfileStore();
  const { trigger } = useHaptics();
  
  const [celebration, setCelebration] = useState<null | { xp: number; sets: number; volume: number; streak: number }>(null);
  
  // Timer State
  const [restTime, setRestTime] = useState<number | null>(null);
  const [userRestPreference, setUserRestPreference] = useState(60);
  
  // Modals State
  const [detailsExerciseId, setDetailsExerciseId] = useState<string | null>(null);
  const [swapData, setSwapData] = useState<{ index: number; id: string; muscle: MuscleGroup } | null>(null);
  const [plateWeight, setPlateWeight] = useState<number | null>(null);

  // ─── Celebration Overlay ───
  if (celebration) {
    return (
      <CelebrationScreen
        xpEarned={celebration.xp}
        totalSets={celebration.sets}
        totalVolume={celebration.volume}
        streakDays={celebration.streak}
        onClose={() => setCelebration(null)}
      />
    );
  }

  // ─── Active Workout View (FOCUS MODE) ───
  if (activeWorkout) {
    const totalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length, 0);
    const progressPerc = totalSets === 0 ? 0 : (completedSets / totalSets) * 100;

    const getSetTypeColor = (type: string) => {
      switch(type) {
        case 'warmup': return Colors.xp;
        case 'dropset': return Colors.primary;
        case 'failure': return Colors.streak;
        default: return Colors.textPrimary;
      }
    };

    const getSetTypeLabel = (type: string) => {
      switch(type) {
        case 'warmup': return 'Aquec.';
        case 'dropset': return 'Drop';
        case 'failure': return 'Falha';
        default: return 'Normal';
      }
    };
    
    const cycleSetType = (exIdx: number, setIdx: number, currentType: string) => {
      trigger('select');
      Alert.alert(
        'Tipo de Série',
        'Selecione a intensidade desta série:',
        [
          { text: 'Normal', onPress: () => updateSetType(exIdx, setIdx, 'normal') },
          { text: 'Aquecimento', onPress: () => updateSetType(exIdx, setIdx, 'warmup') },
          { text: 'Drop-set', onPress: () => updateSetType(exIdx, setIdx, 'dropset') },
          { text: 'Falha', onPress: () => updateSetType(exIdx, setIdx, 'failure'), style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    };

    const cycleRestPreference = () => {
      trigger('select');
      const options = [30, 60, 90, 120];
      const nextIdx = (options.indexOf(userRestPreference) + 1) % options.length;
      setUserRestPreference(options[nextIdx]);
    };

    return (
      <MobileContainer>
        <KeyboardAvoidingView 
          style={s.focusScreen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <StatusBar barStyle="light-content" />
          <View style={s.activeHeader}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cancelar treino"
              onPress={() => {
                trigger('medium');
                Alert.alert('Cancelar treino?', 'Você perderá o progresso.', [
                  { text: 'Não', style: 'cancel' },
                  { text: 'Sim', onPress: cancelWorkout, style: 'destructive' },
                ]);
              }}
              style={s.backBtn}
            >
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={s.activeHeaderCenter}>
              <Text style={s.activeTitle}>{activeWorkout.name}</Text>
              <TouchableOpacity onPress={cycleRestPreference} style={s.restPrefBtn}>
                <Ionicons name="timer-outline" size={12} color={Colors.textMuted} />
                <Text style={s.restPrefText}>Descanso: {userRestPreference}s</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={s.finishBtn}
              accessibilityRole="button"
              accessibilityLabel="Finalizar treino"
              onPress={() => {
                trigger('success');
                const result = finishWorkout(2);
                if (result) {
                  recordWorkout();
                  addXP(result.xpEarned);
                  incrementWorkouts();
                  addVolume(result.volume);
                  setCelebration({
                    xp: result.xpEarned,
                    sets: result.sets,
                    volume: result.volume,
                    streak: currentStreak + 1,
                  });
                }
              }}
            >
              <LinearGradient colors={[...Gradients.successGreen]} style={s.finishBtnGradient}>
                <Ionicons name="checkmark-done" size={18} color="#fff" />
                <Text style={s.finishBtnText}>FINALIZAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={s.progressBarOuter}>
             <Animated.View style={[s.progressBarInner, { width: `${progressPerc}%` }]} />
          </View>

          <ScrollView contentContainerStyle={s.activeContent} showsVerticalScrollIndicator={false}>
            {activeWorkout.exercises.map((ex, exIdx) => (
              <Animated.View key={ex.exerciseId} entering={FadeInDown.duration(400).delay(exIdx * Stagger.fast)} style={s.exCard}>
                <View style={s.exHeader}>
                  <View style={s.exNameRow}>
                    <View style={s.exIconBg}>
                      <Ionicons name="fitness" size={18} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity onPress={() => setDetailsExerciseId(ex.exerciseId)}>
                        <Text style={[s.exName, { textDecorationLine: 'underline', textDecorationColor: Colors.textDisabled }]}>{ex.name}</Text>
                      </TouchableOpacity>
                      <Text style={s.exHistory}>Último treino: 3 séries x 12 reps @ 20kg</Text>
                    </View>
                    <TouchableOpacity 
                      accessibilityRole="button"
                      accessibilityLabel={`Trocar exercício ${ex.name}`}
                      onPress={() => setSwapData({ index: exIdx, id: ex.exerciseId, muscle: ex.muscleGroup })}
                      style={s.swapBtn}
                    >
                      <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={s.setsHeader}>
                  <Text style={[s.setH, { flex: 0.3 }]}>SÉRIE</Text>
                  <Text style={[s.setH, { flex: 0.5 }]}>TIPO</Text>
                  <Text style={[s.setH, { flex: 0.8 }]}>KG</Text>
                  <Text style={[s.setH, { flex: 0.8 }]}>REPS</Text>
                  <Text style={[s.setH, { flex: 0.4 }]}></Text>
                </View>

                {ex.sets.map((set, setIdx) => (
                  <View key={set.id} style={[s.setRow, set.isCompleted && s.setRowDone]}>
                    <Text style={[s.setNum, { flex: 0.3 }]}>{set.id}</Text>
                    
                    <TouchableOpacity 
                      style={[s.setTypeBtn, { flex: 0.5 }]} 
                      accessibilityRole="button"
                      accessibilityLabel={`Alterar tipo da série ${set.id}, atual é ${getSetTypeLabel(set.setType)}`}
                      onPress={() => cycleSetType(exIdx, setIdx, set.setType)}
                    >
                      <Text style={[s.setTypeText, { color: getSetTypeColor(set.setType) }]}>
                        {getSetTypeLabel(set.setType)}
                      </Text>
                    </TouchableOpacity>

                    <View style={[s.inputWrap, { flex: 0.8 }]}>
                      <TouchableOpacity style={s.calcBtn} onPress={() => setPlateWeight(set.weight || 20)}>
                        <Ionicons name="calculator" size={14} color={Colors.textDisabled} />
                      </TouchableOpacity>
                      <TextInput
                        style={s.textInput}
                        keyboardType="numeric"
                        placeholder="—"
                        placeholderTextColor={Colors.textDisabled}
                        accessibilityLabel={`Peso da série ${set.id} em quilos`}
                        value={set.weight ? String(set.weight) : ''}
                        onChangeText={(val) => {
                          const num = val.replace(/[^0-9.]/g, '');
                          updateSetWeight(exIdx, setIdx, num ? Number(num) : 0);
                        }}
                      />
                    </View>

                    <View style={[s.inputWrap, { flex: 0.8, marginLeft: 4 }]}>
                      <TextInput
                        style={[s.textInput, { paddingLeft: 0, textAlign: 'center' }]}
                        keyboardType="numeric"
                        placeholder="—"
                        placeholderTextColor={Colors.textDisabled}
                        accessibilityLabel={`Repetições da série ${set.id}`}
                        value={set.reps ? String(set.reps) : ''}
                        onChangeText={(val) => {
                          const num = val.replace(/[^0-9]/g, '');
                          updateSetReps(exIdx, setIdx, num ? Number(num) : 0);
                        }}
                      />
                    </View>

                    <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Remover Série?', '', [
                            { text: 'Não', style: 'cancel' },
                            { text: 'Sim', onPress: () => { trigger('light'); removeSet(exIdx, setIdx); }, style: 'destructive' },
                          ]);
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color={Colors.textDisabled} style={{ marginRight: 6 }} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={set.isCompleted ? `Desmarcar série ${set.id}` : `Concluir série ${set.id}`}
                        onPress={() => {
                          if (!set.isCompleted) {
                            trigger('success');
                            completeSet(exIdx, setIdx, set.reps || 10, set.weight || 20);
                            setRestTime(userRestPreference);
                          }
                        }}
                      >
                        <Ionicons
                          name={set.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                          size={28}
                          color={set.isCompleted ? Colors.success : Colors.textDisabled}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={s.addSetBtn} onPress={() => { trigger('light'); addSet(exIdx); }}>
                  <Ionicons name="add-circle-outline" size={18} color={Colors.textMuted} />
                  <Text style={s.addSetText}>Adicionar série</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
            <View style={{ height: 180 }} />
          </ScrollView>

          {restTime !== null && (
            <Animated.View entering={FadeInDown.duration(300)} style={s.floatingTimer}>
              <RestTimer 
                durationSeconds={restTime} 
                onFinish={() => setRestTime(null)} 
                onSkip={() => setRestTime(null)} 
              />
            </Animated.View>
          )}
        </KeyboardAvoidingView>

        {/* Premium Modals */}
        {detailsExerciseId && (
          <ExerciseDetailsModal visible={true} exerciseId={detailsExerciseId} onClose={() => setDetailsExerciseId(null)} />
        )}
        {swapData && (
          <SwapExerciseModal 
            visible={true} 
            currentExerciseId={swapData.id} 
            muscleGroup={swapData.muscle} 
            onClose={() => setSwapData(null)}
            onSwap={(newId) => swapExercise(swapData.index, newId)}
          />
        )}
        {plateWeight !== null && (
          <PlateCalculatorModal visible={true} targetWeight={plateWeight} onClose={() => setPlateWeight(null)} />
        )}
      </MobileContainer>
    );
  }

  // ─── Workout Selection View ───
  const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;
  const templateColors = [Colors.primary, Colors.trail, Colors.streak, Colors.evolution, Colors.success];
  const allTemplates = [...userTemplates, ...WORKOUT_TEMPLATES];

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
            <View>
              <Text style={s.title}>TREINAR</Text>
              <Text style={s.subtitle}>Força · Construção</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/workout/builder' as any)} style={s.createBtn}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={s.createBtnText}>NOVO</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Week days */}
          <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast)} style={s.weekRow}>
            {weekDays.map((d, i) => (
              <TouchableOpacity key={d} style={[s.dayBtn, i === adjustedToday && s.dayBtnActive]} activeOpacity={0.8}>
                <Text style={[s.dayLabel, i === adjustedToday && s.dayLabelActive]}>{d}</Text>
                <Text style={[s.dayNum, i === adjustedToday && s.dayNumActive]}>
                  {new Date(Date.now() + (i - adjustedToday) * 86400000).getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Templates */}
          {allTemplates.map((t, i) => (
            <Animated.View key={t.id} entering={FadeInDown.duration(400).delay(i * Stagger.fast + 100)}>
              <TouchableOpacity
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`Iniciar treino ${t.name}`}
                onPress={() => { trigger('heavy'); startWorkout(t.id); }}
              >
                <View style={[s.templateCard, t.isCustom && s.customTemplateCard]}>
                  <View style={[s.templateBadge, { backgroundColor: templateColors[i % templateColors.length] + '20' }]}>
                    <Ionicons name="barbell" size={20} color={templateColors[i % templateColors.length]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.templateName}>{t.name} {t.isCustom && <Text style={s.customLabel}>(Seu)</Text>}</Text>
                    <Text style={s.templateDesc}>{t.description}</Text>
                  </View>
                  {t.isCustom ? (
                    <TouchableOpacity onPress={() => {
                      Alert.alert('Excluir', 'Deseja excluir este treino personalizado?', [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Excluir', style: 'destructive', onPress: () => { trigger('medium'); deleteUserTemplate(t.id); } }
                      ]);
                    }} style={{ padding: 8 }}>
                      <Ionicons name="trash-outline" size={20} color={Colors.streak} />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={Colors.textDisabled} />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
          <View style={{ height: 110 }} />
        </ScrollView>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  focusScreen: { flex: 1, backgroundColor: '#050505' }, 
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16 },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.primary, fontSize: 14, fontWeight: '600', marginTop: 4 },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  createBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  // Week
  weekRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dayBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: BorderRadius.md, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  dayLabelActive: { color: '#fff' },
  dayNum: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginTop: 3 },
  dayNumActive: { color: '#fff' },
  // Template
  templateCard: { borderRadius: BorderRadius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  customTemplateCard: { borderColor: Colors.primary + '50' },
  templateBadge: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  templateName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  customLabel: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  templateDesc: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  // Active workout
  activeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Platform.OS === 'web' ? 16 : 54, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#050505' },
  backBtn: { width: 42, height: 42, borderRadius: BorderRadius.md, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  activeHeaderCenter: { alignItems: 'center' },
  activeTitle: { color: Colors.textPrimary, fontSize: 17, fontWeight: '800' },
  restPrefBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1A1A1A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  restPrefText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' },
  finishBtn: { overflow: 'hidden', borderRadius: BorderRadius.md },
  finishBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10 },
  finishBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  progressBarOuter: { height: 4, backgroundColor: '#111', width: '100%' },
  progressBarInner: { height: '100%', backgroundColor: Colors.primary },
  activeContent: { paddingHorizontal: 16, paddingTop: 16 },
  exCard: { backgroundColor: '#111', borderRadius: BorderRadius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  exHeader: { marginBottom: 14 },
  exNameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center' },
  exName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  exHistory: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  swapBtn: { padding: 8, backgroundColor: '#1A1A1A', borderRadius: 8 },
  setsHeader: { flexDirection: 'row', paddingHorizontal: 4, marginBottom: 8, alignItems: 'center' },
  setH: { color: Colors.textDisabled, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderRadius: BorderRadius.sm, marginBottom: 4, paddingHorizontal: 4 },
  setRowDone: { backgroundColor: Colors.successBg },
  setNum: { color: Colors.textMuted, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  setTypeBtn: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A', paddingVertical: 4, borderRadius: 6, marginHorizontal: 2 },
  setTypeText: { fontSize: 10, fontWeight: '800' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: BorderRadius.sm, marginHorizontal: 2, height: 36 },
  calcBtn: { paddingHorizontal: 8, height: '100%', justifyContent: 'center' },
  textInput: { flex: 1, color: Colors.textPrimary, fontSize: 15, fontWeight: '600', height: '100%', paddingLeft: 4 },
  addSetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, marginTop: 4 },
  addSetText: { color: Colors.textMuted, fontSize: 13 },
  floatingTimer: { position: 'absolute', bottom: 20, left: 20, right: 20, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
});
