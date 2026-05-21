import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, Modal, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, BorderRadius, Gradients } from '@/constants/theme';
import { EXERCISES, MUSCLE_GROUP_LABELS, MuscleGroup, WorkoutTemplate } from '@/constants/exercises';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { useHaptics } from '@/hooks/useHaptics';

export default function WorkoutBuilderScreen() {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const { saveUserTemplate, addCustomExercise, customExercises } = useWorkoutStore();
  const { trigger } = useHaptics();

  const handleSave = () => {
    if (!name.trim() || selectedExercises.length === 0) {
      trigger('error');
      return;
    }
    const mGroups = new Set<MuscleGroup>();
    selectedExercises.forEach(id => {
      const ex = EXERCISES.find(e => e.id === id);
      if (ex) mGroups.add(ex.muscleGroup);
    });

    const newTemplate: WorkoutTemplate = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: 'Treino Personalizado',
      muscleGroups: Array.from(mGroups),
      exerciseIds: selectedExercises,
      isCustom: true,
    };

    saveUserTemplate(newTemplate);
    trigger('success');
    router.back();
  };

  const toggleExercise = (id: string) => {
    trigger('select');
    setSelectedExercises(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const allAvailableExercises = [...EXERCISES, ...customExercises];
  const filteredLibrary = filterMuscle === 'all' 
    ? allAvailableExercises 
    : allAvailableExercises.filter(e => e.muscleGroup === filterMuscle);

  const handleCreateCustomExercise = () => {
    if (!newExName.trim()) return;
    const newEx = {
      id: `custom_ex_${Date.now()}`,
      name: newExName.trim(),
      muscleGroup: filterMuscle === 'all' ? 'outros' as MuscleGroup : filterMuscle,
      equipment: 'Peso Corporal',
      defaultSets: 3,
      defaultReps: '10',
      icon: '🏋️'
    };
    addCustomExercise(newEx);
    setNewExName('');
    setIsCreatingExercise(false);
    toggleExercise(newEx.id);
  };

  const renderExerciseModal = () => (
    <Modal visible={isModalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsModalOpen(false)}>
      <View style={s.modalContainer}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitle}>Adicionar Exercícios</Text>
          <TouchableOpacity onPress={() => setIsModalOpen(false)} style={s.modalCloseBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterContent}>
          <TouchableOpacity 
            style={[s.filterChip, filterMuscle === 'all' && s.filterChipActive]} 
            onPress={() => setFilterMuscle('all')}
          >
            <Text style={[s.filterChipText, filterMuscle === 'all' && s.filterChipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {(Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[]).map(mg => (
            <TouchableOpacity 
              key={mg} 
              style={[s.filterChip, filterMuscle === mg && s.filterChipActive]} 
              onPress={() => setFilterMuscle(mg)}
            >
              <Text style={[s.filterChipText, filterMuscle === mg && s.filterChipTextActive]}>{MUSCLE_GROUP_LABELS[mg]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={s.libraryScroll} contentContainerStyle={s.libraryContent}>
          <View style={s.createExContainer}>
            {isCreatingExercise ? (
              <View style={s.createExForm}>
                <TextInput
                  style={s.createExInput}
                  placeholder="Nome do Exercício..."
                  placeholderTextColor={Colors.textMuted}
                  value={newExName}
                  onChangeText={setNewExName}
                  autoFocus
                />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <TouchableOpacity style={[s.createExBtn, { backgroundColor: Colors.bgSurface }]} onPress={() => setIsCreatingExercise(false)}>
                    <Text style={{ color: Colors.textPrimary }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.createExBtn, { backgroundColor: Colors.primary }]} onPress={handleCreateCustomExercise}>
                    <Text style={{ color: '#fff' }}>Criar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={s.createExInitBtn} onPress={() => setIsCreatingExercise(true)}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
                <Text style={s.createExInitText}>Criar exercício personalizado</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredLibrary.map(ex => {
            const isSelected = selectedExercises.includes(ex.id);
            return (
              <TouchableOpacity 
                key={ex.id} 
                style={[s.libraryItem, isSelected && s.libraryItemActive]}
                onPress={() => toggleExercise(ex.id)}
                activeOpacity={0.7}
              >
                <View style={s.libraryIconBg}>
                  <Text style={{ fontSize: 18 }}>{ex.icon}</Text>
                </View>
                <View style={s.libraryInfo}>
                  <Text style={s.libraryItemName}>{ex.name}</Text>
                  <Text style={s.libraryItemSub}>{MUSCLE_GROUP_LABELS[ex.muscleGroup as MuscleGroup] || 'Outros'} · {ex.equipment}</Text>
                </View>
                <Ionicons 
                  name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                  size={24} 
                  color={isSelected ? Colors.success : Colors.textMuted} 
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <View style={s.modalFooter}>
          <TouchableOpacity style={s.modalConfirmBtn} onPress={() => setIsModalOpen(false)}>
            <Text style={s.modalConfirmText}>Concluir ({selectedExercises.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" />
        
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.title}>Novo Treino</Text>
          <TouchableOpacity onPress={handleSave} style={s.headerBtn}>
            <Text style={[s.saveText, (!name.trim() || selectedExercises.length === 0) && s.saveTextDisabled]}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={s.inputLabel}>NOME DO TREINO</Text>
            <TextInput
              style={s.input}
              placeholder="Ex: Treino de Força A"
              placeholderTextColor={Colors.textDisabled}
              value={name}
              onChangeText={setName}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>EXERCÍCIOS ({selectedExercises.length})</Text>
            </View>

            {selectedExercises.length === 0 ? (
              <View style={s.emptyState}>
                <Ionicons name="barbell-outline" size={48} color={Colors.border} />
                <Text style={s.emptyText}>Nenhum exercício adicionado</Text>
              </View>
            ) : (
              <View style={s.selectedList}>
                {selectedExercises.map((id, index) => {
                  const ex = allAvailableExercises.find(e => e.id === id);
                  if (!ex) return null;
                  return (
                    <View key={id} style={s.selectedItem}>
                      <View style={s.selectedNum}><Text style={s.selectedNumText}>{index + 1}</Text></View>
                      <View style={s.selectedInfo}>
                        <Text style={s.selectedName}>{ex.name}</Text>
                        <Text style={s.selectedSub}>{ex.defaultSets} séries · {ex.defaultReps}</Text>
                      </View>
                      <TouchableOpacity onPress={() => toggleExercise(id)} style={s.removeBtn}>
                        <Ionicons name="trash-outline" size={20} color={Colors.xp} />
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            )}

            <TouchableOpacity style={s.addBtn} onPress={() => setIsModalOpen(true)} activeOpacity={0.8}>
              <LinearGradient colors={[...Gradients.primaryCta]} style={s.addBtnGradient} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={s.addBtnText}>ADICIONAR EXERCÍCIO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
        {renderExerciseModal()}
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerBtn: { padding: 8, marginHorizontal: -8 },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  saveText: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  saveTextDisabled: { color: Colors.textDisabled },
  content: { padding: 20 },
  inputLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: 16, color: Colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 24 },
  section: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  emptyState: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: BorderRadius.lg, padding: 32, alignItems: 'center', marginBottom: 16 },
  emptyText: { color: Colors.textMuted, fontSize: 14, marginTop: 12, fontWeight: '500' },
  selectedList: { gap: 10, marginBottom: 16 },
  selectedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg, padding: 14, gap: 12 },
  selectedNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  selectedNumText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '700' },
  selectedInfo: { flex: 1 },
  selectedName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  selectedSub: { color: Colors.primary, fontSize: 12, marginTop: 2 },
  removeBtn: { padding: 8 },
  addBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  addBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  modalContainer: { flex: 1, backgroundColor: Colors.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  modalCloseBtn: { padding: 4 },
  filterScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  libraryScroll: { flex: 1 },
  libraryContent: { padding: 16, gap: 10 },
  libraryItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 14 },
  libraryItemActive: { borderColor: Colors.success, backgroundColor: Colors.success + '10' },
  libraryIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  libraryInfo: { flex: 1 },
  libraryItemName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  libraryItemSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.bgCard },
  modalConfirmBtn: { backgroundColor: Colors.success, borderRadius: BorderRadius.lg, paddingVertical: 16, alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  
  createExContainer: { marginBottom: 12 },
  createExInitBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary + '15', padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.primary + '40' },
  createExInitText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  createExForm: { backgroundColor: Colors.bgCard, padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.primary },
  createExInput: { backgroundColor: Colors.bgSurface, color: Colors.textPrimary, padding: 12, borderRadius: BorderRadius.md, fontSize: 15 },
  createExBtn: { flex: 1, paddingVertical: 12, borderRadius: BorderRadius.md, alignItems: 'center' },
});
