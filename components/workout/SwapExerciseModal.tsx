import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { EXERCISES, MuscleGroup, MUSCLE_GROUP_LABELS } from '@/constants/exercises';

interface SwapExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  currentExerciseId: string;
  muscleGroup: MuscleGroup;
  onSwap: (newExerciseId: string) => void;
}

export function SwapExerciseModal({ visible, onClose, currentExerciseId, muscleGroup, onSwap }: SwapExerciseModalProps) {
  const [search, setSearch] = useState('');

  // Filtra por grupo muscular, remove o atual, e permite busca
  const availableExercises = EXERCISES.filter(ex => 
    ex.muscleGroup === muscleGroup && 
    ex.id !== currentExerciseId &&
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.modalContainer}>
        <View style={s.header}>
          <View>
            <Text style={s.title}>Substituir Exercício</Text>
            <Text style={s.subtitle}>Foco: {MUSCLE_GROUP_LABELS[muscleGroup]}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={s.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar exercício..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={s.listScroll} contentContainerStyle={s.listContent}>
          {availableExercises.length === 0 ? (
            <Text style={s.emptyText}>Nenhum exercício encontrado para substituir.</Text>
          ) : (
            availableExercises.map(ex => (
              <TouchableOpacity 
                key={ex.id} 
                style={s.exerciseItem}
                activeOpacity={0.7}
                onPress={() => {
                  onSwap(ex.id);
                  onClose();
                }}
              >
                <View style={s.iconBg}>
                  <Text style={{ fontSize: 20 }}>{ex.icon}</Text>
                </View>
                <View style={s.exInfo}>
                  <Text style={s.exName}>{ex.name}</Text>
                  <Text style={s.exEquipment}>{ex.equipment}</Text>
                </View>
                <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  subtitle: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginTop: 2 },
  closeBtn: { padding: 4, backgroundColor: Colors.bgSurface, borderRadius: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, margin: 16, paddingHorizontal: 16, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  searchInput: { flex: 1, paddingVertical: 14, color: Colors.textPrimary, fontSize: 15 },
  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 10 },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  exerciseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 14, borderWidth: 1, borderColor: Colors.border, gap: 14 },
  iconBg: { width: 46, height: 46, borderRadius: 12, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  exInfo: { flex: 1 },
  exName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  exEquipment: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
});
