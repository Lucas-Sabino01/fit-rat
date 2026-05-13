/**
 * Fit Rat — Trail Screen (v2 Redesign)
 * Duolingo-inspired visual trail with colored nodes and path connectors
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Gradients, BorderRadius, Spacing } from '@/constants/theme';
import { Stagger } from '@/constants/animations';
import { useProfileStore } from '@/stores/useProfileStore';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { TrailNode, type NodeStatus } from '@/components/trail/TrailNode';
import { TrailPath } from '@/components/trail/TrailPath';

const PHASES = [
  { id: 1, name: 'BASE SÓLIDA', sub: 'Fundamentos', icon: 'fitness-outline', req: 10, color: Colors.success },
  { id: 2, name: 'FORÇA', sub: 'Construção muscular', icon: 'barbell-outline', req: 25, color: Colors.primary },
  { id: 3, name: 'RESISTÊNCIA', sub: 'Condicionamento', icon: 'sync-outline', req: 50, color: Colors.streak },
  { id: 4, name: 'DEFINIÇÃO', sub: 'Esculpir o shape', icon: 'cut-outline', req: 80, color: Colors.evolution },
  { id: 5, name: 'PERFORMANCE', sub: 'Superar limites', icon: 'rocket-outline', req: 120, color: Colors.xp },
];

export default function TrailScreen() {
  const { totalWorkouts } = useProfileStore();

  const getStatus = (phase: (typeof PHASES)[0]): NodeStatus => {
    if (totalWorkouts >= phase.req) return 'completed';
    const prev = PHASES.find(x => x.id === phase.id - 1);
    if (!prev || totalWorkouts >= prev.req) return 'current';
    return 'locked';
  };

  const getCurrentPhase = () => {
    for (let i = PHASES.length - 1; i >= 0; i--) {
      const st = getStatus(PHASES[i]);
      if (st === 'current' || st === 'completed') return PHASES[i];
    }
    return PHASES[0];
  };

  const currentPhase = getCurrentPhase();

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
            <Text style={s.title}>TRILHA</Text>
            <Text style={s.subtitle}>Sua jornada fitness</Text>
          </Animated.View>

          {/* Current phase summary */}
          <Animated.View entering={FadeInDown.duration(400).delay(Stagger.normal)}>
            <LinearGradient colors={[currentPhase.color + '15', Colors.bg]} style={s.currentCard}>
              <View style={[s.currentIcon, { backgroundColor: currentPhase.color + '20' }]}>
                <Ionicons name={currentPhase.icon as any} size={24} color={currentPhase.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.currentLabel}>FASE ATUAL</Text>
                <Text style={[s.currentName, { color: currentPhase.color }]}>{currentPhase.name}</Text>
                <Text style={s.currentSub}>{totalWorkouts}/{currentPhase.req} treinos</Text>
              </View>
              <View style={s.currentProgress}>
                <Text style={[s.currentPercent, { color: currentPhase.color }]}>
                  {Math.min(100, Math.round((totalWorkouts / currentPhase.req) * 100))}%
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Trail */}
          <Animated.View entering={FadeInDown.duration(400).delay(Stagger.normal * 2)} style={s.trail}>
            <Text style={s.trailTitle}>Fases da Jornada</Text>
            {PHASES.map((phase, i) => {
              const status = getStatus(phase);
              const progress = status === 'completed' ? 100 : status === 'current' ? Math.min(100, (totalWorkouts / phase.req) * 100) : 0;

              return (
                <View key={phase.id}>
                  <TrailNode
                    number={phase.id}
                    name={phase.name}
                    subtitle={phase.sub}
                    color={phase.color}
                    icon={phase.icon}
                    status={status}
                    progress={progress}
                    totalRequired={phase.req}
                    currentCount={totalWorkouts}
                  />
                  {i < PHASES.length - 1 && (
                    <TrailPath completed={status === 'completed'} color={phase.color} />
                  )}
                </View>
              );
            })}
          </Animated.View>

          {/* Motivation */}
          <Animated.View entering={FadeInDown.duration(400).delay(Stagger.normal * 3)}>
            <View style={s.motivCard}>
              <Ionicons name="sparkles" size={20} color={Colors.xp} />
              <Text style={s.motivText}>
                {totalWorkouts < 10
                  ? 'Cada treino te leva mais perto da Fase 1!'
                  : totalWorkouts < 25
                  ? 'Você já construiu uma base sólida. Bora ficar forte!'
                  : 'Máquina! Continue escalando essa trilha! 💪'
                }
              </Text>
            </View>
          </Animated.View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20 },
  header: { paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16 },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: Colors.trail, fontSize: 14, fontWeight: '600', marginTop: 4 },
  // Current phase
  currentCard: { borderRadius: BorderRadius.xl, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  currentIcon: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  currentLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  currentName: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  currentSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  currentProgress: { alignItems: 'center' },
  currentPercent: { fontSize: 22, fontWeight: '900' },
  // Trail
  trail: { paddingLeft: 4, marginBottom: 20 },
  trailTitle: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' },
  // Motivation
  motivCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.border },
  motivText: { color: Colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 19 },
});
