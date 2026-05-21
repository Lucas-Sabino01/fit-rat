import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { EXERCISES, MUSCLE_GROUP_LABELS } from '@/constants/exercises';
import { RatMascot } from '@/components/mascot/RatMascot';

interface ExerciseDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseId: string;
}

export function ExerciseDetailsModal({ visible, onClose, exerciseId }: ExerciseDetailsModalProps) {
  const exercise = EXERCISES.find(e => e.id === exerciseId);

  if (!exercise) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.modalContainer}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.mainInfo}>
            <View style={s.iconBg}>
              <Text style={{ fontSize: 40 }}>{exercise.icon}</Text>
            </View>
            <Text style={s.title}>{exercise.name}</Text>
            <Text style={s.subtitle}>{MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {exercise.equipment}</Text>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>ANIMAÇÃO DE EXECUÇÃO</Text>
            <View style={s.gifPlaceholder}>
              <Ionicons name="play-circle-outline" size={48} color={Colors.textDisabled} />
              <Text style={s.gifText}>GIF Animado 3D</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>DICA DO RATO 🐀</Text>
            <View style={s.ratTipCard}>
              <RatMascot mood="happy" size={60} />
              <View style={s.ratTipBubble}>
                <Text style={s.ratTipText}>
                  "Esmaga que cresce! Mas não esquece a postura: mantenha o core sempre contraído para não machucar a lombar, fechou?"
                </Text>
              </View>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>PROGRESSÃO (1RM ESTIMADO)</Text>
            <View style={s.graphPlaceholder}>
              <Ionicons name="trending-up" size={32} color={Colors.primary} />
              <Text style={s.graphText}>Seu recorde atual é de 45kg</Text>
              <Text style={s.graphSub}>+5kg neste mês!</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>HISTÓRICO RECENTE</Text>
            {[
              { date: 'Há 2 dias', sets: '3 séries', vol: '20kg x 12' },
              { date: 'Há 5 dias', sets: '4 séries', vol: '18kg x 10' },
              { date: 'Há 8 dias', sets: '3 séries', vol: '15kg x 12' },
            ].map((hist, i) => (
              <View key={i} style={s.historyRow}>
                <View style={s.histDot} />
                <View style={s.histInfo}>
                  <Text style={s.histDate}>{hist.date}</Text>
                  <Text style={s.histVol}>{hist.sets} · {hist.vol}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>COMO EXECUTAR</Text>
            <View style={s.instructionBox}>
              <Text style={s.instructionText}>
                1. Mantenha as costas retas e o core contraído.{'\n'}
                2. Controle a fase excêntrica do movimento.{'\n'}
                3. Não use impulso, foque na contração do músculo.
              </Text>
            </View>
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: Colors.bg },
  header: { alignItems: 'flex-end', padding: 20 },
  closeBtn: { padding: 4, backgroundColor: Colors.bgSurface, borderRadius: 20 },
  content: { paddingHorizontal: 20 },
  mainInfo: { alignItems: 'center', marginBottom: 30 },
  iconBg: { width: 90, height: 90, borderRadius: 24, backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: Colors.primary, fontSize: 14, fontWeight: '600', marginTop: 4 },
  section: { marginBottom: 28 },
  sectionTitle: { color: Colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  gifPlaceholder: { height: 160, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  gifText: { color: Colors.textDisabled, fontSize: 13, fontWeight: '600', marginTop: 8 },
  ratTipCard: { flexDirection: 'row', backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary + '30' },
  ratTipBubble: { flex: 1, marginLeft: 16, backgroundColor: Colors.bgCard, padding: 12, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  ratTipText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600', fontStyle: 'italic', lineHeight: 20 },
  graphPlaceholder: { backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  graphText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: 12 },
  graphSub: { color: Colors.success, fontSize: 13, fontWeight: '600', marginTop: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, marginLeft: 8 },
  histDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  histInfo: { flex: 1 },
  histDate: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  histVol: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  instructionBox: { backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, padding: 16 },
  instructionText: { color: Colors.textSecondary, fontSize: 14, lineHeight: 24 },
});
