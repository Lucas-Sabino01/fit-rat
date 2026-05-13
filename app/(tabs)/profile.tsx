/**
 * Fit Rat — Profile Screen (v2 Redesign)
 * Premium profile with colored sections, mascot moods & Body Tracker
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors, Gradients, BorderRadius, Spacing } from '@/constants/theme';
import { Stagger } from '@/constants/animations';
import { useProfileStore } from '@/stores/useProfileStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { BELTS, getCurrentBelt, RAT_STAGES } from '@/constants/gamification';
import { RatMascot } from '@/components/mascot/RatMascot';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { useRouter } from 'expo-router';
import { useHaptics } from '@/hooks/useHaptics';

export default function ProfileScreen() {
  const router = useRouter();
  const { trigger } = useHaptics();
  const { name, xp, totalWorkouts, totalVolume, getLevel, getXPProgress, getRatStage, getAchievements } = useProfileStore();
  const { currentStreak, bestStreak } = useStreakStore();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'measurements'>('stats');
  
  // Fake state for measurements demo
  const [weight, setWeight] = useState('75.5');
  const [bodyFat, setBodyFat] = useState('15');

  const level = getLevel();
  const xpProgress = getXPProgress();
  const ratStage = getRatStage();
  const currentBelt = getCurrentBelt(currentStreak);
  const achievements = getAchievements();

  const stats = [
    { value: totalWorkouts, label: 'Treinos', icon: 'barbell' as const, color: Colors.primary },
    { value: currentStreak, label: 'Ofensiva', icon: 'flame' as const, color: Colors.streak },
    { value: bestStreak, label: 'Melhor', icon: 'trophy' as const, color: Colors.xp },
    { value: `${(totalVolume / 1000).toFixed(0)}t`, label: 'Volume', icon: 'trending-up' as const, color: Colors.evolution },
  ];

  const getMascotMood = () => {
    if (level >= 15) return 'flexing';
    if (level >= 10) return 'excited';
    if (level >= 5) return 'happy';
    return 'default';
  };

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" />
        <View style={s.header}>
          <Text style={s.title}>PERFIL</Text>
          <View style={s.tabContainer}>
            <TouchableOpacity 
              style={[s.tabBtn, activeTab === 'stats' && s.tabBtnActive]} 
              onPress={() => { trigger('select'); setActiveTab('stats'); }}
            >
              <Text style={[s.tabText, activeTab === 'stats' && s.tabTextActive]}>Estatísticas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[s.tabBtn, activeTab === 'measurements' && s.tabBtnActive]} 
              onPress={() => { trigger('select'); setActiveTab('measurements'); }}
            >
              <Text style={[s.tabText, activeTab === 'measurements' && s.tabTextActive]}>Medidas</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'stats' ? (
            <Animated.View entering={FadeIn.duration(300)} key="stats">
              {/* Profile Card */}
              <Animated.View entering={FadeInDown.duration(400)}>
                <LinearGradient colors={[Colors.evolution + '15', Colors.bg]} style={s.profileCard}>
                  <RatMascot mood={getMascotMood() as any} size={100} />
                  <Text style={s.profileName}>{name}</Text>
                  <View style={s.levelRow}>
                    <Text style={s.levelText}>Nível {level}</Text>
                    <LinearGradient colors={[...Gradients.evolutionPurple]} style={s.levelBadge}>
                      <Text style={s.levelNum}>{level}</Text>
                    </LinearGradient>
                  </View>
                  {/* XP Bar */}
                  <View style={s.xpContainer}>
                    <View style={s.xpRow}>
                      <Text style={s.xpLabel}>{xp.toLocaleString('pt-BR')} XP</Text>
                      <Text style={s.xpTarget}>{(xp + xpProgress.required - xpProgress.current).toLocaleString('pt-BR')} XP</Text>
                    </View>
                    <View style={s.xpBarOuter}>
                      <LinearGradient
                        colors={[...Gradients.xpGold]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[s.xpBarInner, { width: `${Math.max(5, xpProgress.percentage)}%` }]}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Stats */}
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast)} style={s.statsRow}>
                {stats.map((st, i) => (
                  <View key={i} style={s.statCard}>
                    <View style={[s.statIconBg, { backgroundColor: st.color + '18' }]}>
                      <Ionicons name={st.icon} size={16} color={st.color} />
                    </View>
                    <Text style={s.statValue}>{st.value}</Text>
                    <Text style={s.statLabel}>{st.label}</Text>
                  </View>
                ))}
              </Animated.View>

              {/* Rat Evolution */}
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 2)}>
                <Text style={[s.sectionTitle, { color: Colors.evolution }]}>
                  <Ionicons name="sparkles" size={14} color={Colors.evolution} /> EVOLUÇÃO DO RATO
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.evoRow}>
                  {RAT_STAGES.map((stage) => {
                    const isActive = level >= stage.level;
                    const isCurrent = ratStage.level === stage.level;
                    const stageIcon = stage.level >= 20 ? 'ribbon' : stage.level >= 15 ? 'trophy' : stage.level >= 10 ? 'fitness' : stage.level >= 5 ? 'flame' : 'paw';
                    return (
                      <View key={stage.level} style={[s.evoCard, !isActive && { opacity: 0.2 }]}>
                        <View style={[
                          s.evoCircle,
                          isCurrent && { borderColor: Colors.evolution, borderWidth: 2.5 },
                          isActive && !isCurrent && { borderColor: Colors.success },
                        ]}>
                          <Ionicons name={stageIcon as any} size={22} color={isCurrent ? Colors.evolution : isActive ? Colors.success : Colors.textDisabled} />
                        </View>
                        <Text style={[s.evoLabel, isCurrent && { color: Colors.evolution }]}>
                          {stage.label.split(' ')[1] || stage.label}
                        </Text>
                        <Text style={s.evoLevel}>Nv. {stage.level}+</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </Animated.View>

              {/* Belts */}
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 3)}>
                <Text style={[s.sectionTitle, { color: Colors.xp }]}>
                  <Ionicons name="ribbon" size={14} color={Colors.xp} /> MINHAS FAIXAS
                </Text>
                <View style={s.beltsRow}>
                  {BELTS.map((belt) => {
                    const isUnlocked = currentStreak >= belt.requiredStreak;
                    const isCurrent = currentBelt.id === belt.id;
                    return (
                      <View key={belt.id} style={[s.beltItem, !isUnlocked && { opacity: 0.15 }]}>
                        <View style={[
                          s.beltCircle,
                          { borderColor: belt.color },
                          isCurrent && { backgroundColor: belt.color + '20' },
                        ]}>
                          <Ionicons name={isUnlocked ? 'ribbon' : 'lock-closed'} size={18} color={belt.color} />
                        </View>
                        <Text style={[s.beltLabel, { color: belt.color }]}>{belt.label}</Text>
                        <Text style={s.beltReq}>{belt.requiredStreak}d</Text>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
              
              <TouchableOpacity 
                style={s.resetBtn}
                onPress={() => {
                  useProfileStore.getState().resetOnboarding();
                  router.replace('/onboarding');
                }}
              >
                <Ionicons name="refresh" size={16} color={Colors.textMuted} />
                <Text style={s.resetBtnText}>Refazer Onboarding</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(300)} key="measurements">
              {/* Fake Weight Chart Placeholder */}
              <Animated.View entering={FadeInDown.duration(400)}>
                <View style={s.graphCard}>
                  <View style={s.graphHeader}>
                    <Ionicons name="scale-outline" size={24} color={Colors.primary} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={s.graphTitle}>Evolução de Peso</Text>
                      <Text style={s.graphSubtitle}>Últimos 30 dias</Text>
                    </View>
                  </View>
                  <View style={s.graphPlaceholder}>
                    <Ionicons name="analytics" size={48} color={Colors.border} />
                    <Text style={s.graphPlaceholderText}>Gráfico em breve</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Inputs */}
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast)}>
                <Text style={s.sectionTitle}>MEDIDAS ATUAIS</Text>
                <View style={s.measurementsGrid}>
                  <View style={s.inputWrap}>
                    <Text style={s.inputLabel}>Peso (kg)</Text>
                    <TextInput style={s.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
                  </View>
                  <View style={s.inputWrap}>
                    <Text style={s.inputLabel}>Gordura (%)</Text>
                    <TextInput style={s.input} value={bodyFat} onChangeText={setBodyFat} keyboardType="numeric" />
                  </View>
                  <View style={s.inputWrap}>
                    <Text style={s.inputLabel}>Braço (cm)</Text>
                    <TextInput style={s.input} placeholder="ex: 38" placeholderTextColor={Colors.textDisabled} keyboardType="numeric" />
                  </View>
                  <View style={s.inputWrap}>
                    <Text style={s.inputLabel}>Cintura (cm)</Text>
                    <TextInput style={s.input} placeholder="ex: 80" placeholderTextColor={Colors.textDisabled} keyboardType="numeric" />
                  </View>
                </View>
                
                <TouchableOpacity style={s.saveMeasureBtn} onPress={() => trigger('success')}>
                  <Text style={s.saveMeasureText}>SALVAR MEDIDAS</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Photos */}
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 2)}>
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>FOTOS DE PROGRESSO</Text>
                <View style={s.photosGrid}>
                  <TouchableOpacity style={s.photoAddBtn} activeOpacity={0.8} onPress={() => trigger('light')}>
                    <Ionicons name="camera" size={32} color={Colors.textDisabled} />
                    <Text style={s.photoAddText}>Adicionar</Text>
                  </TouchableOpacity>
                  <View style={s.photoDummy}>
                    <Text style={s.photoDummyDate}>01/Jan</Text>
                  </View>
                  <View style={s.photoDummy}>
                    <Text style={s.photoDummyDate}>15/Fev</Text>
                  </View>
                </View>
              </Animated.View>

            </Animated.View>
          )}

          <View style={{ height: 110 }} />
        </ScrollView>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16, paddingHorizontal: 20 },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '900', letterSpacing: 1, marginBottom: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: BorderRadius.md },
  tabBtnActive: { backgroundColor: Colors.bgCard, ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: Colors.textPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  
  // Profile card
  profileCard: { borderRadius: BorderRadius['2xl'], padding: 28, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  profileName: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800', marginTop: 16 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 20 },
  levelText: { color: Colors.textSecondary, fontSize: 14 },
  levelBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  levelNum: { color: '#fff', fontSize: 13, fontWeight: '900' },
  xpContainer: { width: '100%' },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  xpTarget: { color: Colors.xp, fontSize: 12, fontWeight: '600' },
  xpBarOuter: { height: 8, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.full, overflow: 'hidden' },
  xpBarInner: { height: '100%', borderRadius: BorderRadius.full },
  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statIconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statValue: { color: Colors.textPrimary, fontSize: 18, fontWeight: '900' },
  statLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600', marginTop: 3 },
  // Section titles
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 14, marginTop: 4, color: Colors.textMuted },
  // Evolution
  evoRow: { gap: 14, paddingRight: 20, marginBottom: 20 },
  evoCard: { alignItems: 'center', width: 72 },
  evoCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  evoLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  evoLevel: { color: Colors.textDisabled, fontSize: 10, marginTop: 2 },
  // Belts
  beltsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  beltItem: { alignItems: 'center', flex: 1 },
  beltCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgCard },
  beltLabel: { fontSize: 10, fontWeight: '600', marginTop: 6 },
  beltReq: { color: Colors.textDisabled, fontSize: 9, marginTop: 2 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, paddingVertical: 12 },
  resetBtnText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  
  // Measurements
  graphCard: { backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  graphHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  graphTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },
  graphSubtitle: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  graphPlaceholder: { height: 120, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.border },
  graphPlaceholderText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 8 },
  
  measurementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  inputWrap: { width: '48%', backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 12, borderWidth: 1, borderColor: Colors.border },
  inputLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 1 },
  input: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  saveMeasureBtn: { backgroundColor: Colors.primaryBg, borderRadius: BorderRadius.lg, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary + '40' },
  saveMeasureText: { color: Colors.primary, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  
  photosGrid: { flexDirection: 'row', gap: 12 },
  photoAddBtn: { width: 100, height: 140, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  photoAddText: { color: Colors.textDisabled, fontSize: 12, fontWeight: '600', marginTop: 8 },
  photoDummy: { width: 100, height: 140, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, justifyContent: 'flex-end', padding: 8, borderWidth: 1, borderColor: Colors.border },
  photoDummyDate: { color: '#fff', fontSize: 10, fontWeight: '800', backgroundColor: 'rgba(0,0,0,0.5)', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});
