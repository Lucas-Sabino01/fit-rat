import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Gradients, Spacing, BorderRadius } from '@/constants/theme';
import { Stagger } from '@/constants/animations';
import { useStreakStore } from '@/stores/useStreakStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { getCurrentBelt, getNextBelt } from '@/constants/gamification';
import { RatMascot } from '@/components/mascot/RatMascot';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { useHaptics } from '@/hooks/useHaptics';

const TIPS = [
  '"Não espere motivação, crie disciplina. O shape é construído nos dias que você não quer ir."',
  '"Melhor treinar 70% e ser consistente do que 100% e desistir em 2 semanas."',
  '"Cada série conta. Cada rep importa. Cada dia é uma vitória."',
  '"A dor que você sente hoje é a força que você terá amanhã."',
  '"Você não precisa ser perfeito, só precisa não parar."',
];

export default function HomeScreen() {
  const { currentStreak, bestStreak, restTickets, recordActiveRest, recordMicroWorkout, useRestTicket } =
    useStreakStore();
  const { name, xp, getLevel, getXPProgress, getRatStage } = useProfileStore();
  const { trigger } = useHaptics();

  const level = getLevel();
  const xpProgress = getXPProgress();
  const ratStage = getRatStage();
  const currentBelt = getCurrentBelt(currentStreak);
  const nextBelt = getNextBelt(currentStreak);
  const tipOfDay = TIPS[new Date().getDay() % TIPS.length];
  const mascotMood = currentStreak >= 14 ? 'flexing' : currentStreak >= 7 ? 'excited' : currentStreak >= 1 ? 'happy' : 'sad';

  const handleMicroWorkout = () => {
    trigger('success');
    recordMicroWorkout();
  };

  const handleActiveRest = () => {
    trigger('medium');
    recordActiveRest();
  };

  const handleUseTicket = () => {
    if (restTickets <= 0) {
      trigger('error');
      return;
    }
    trigger('medium');
    useRestTicket();
  };

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          <Animated.View entering={FadeInDown.duration(400)} style={s.header}>
            <View>
              <Text style={s.logo}>
                <Text style={s.logoFit}>FIT</Text>
                <Text style={s.logoRat}>RAT</Text>
              </Text>
            </View>
            <View style={s.headerBadges}>
              <View style={[s.badge, { borderColor: Colors.streak + '40' }]}>
                <Ionicons name="flame" size={14} color={Colors.streak} />
                <Text style={[s.badgeText, { color: Colors.streak }]}>{currentStreak}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/leaderboard' as any)}>
                <View style={[s.badge, { borderColor: Colors.evolution + '40', paddingHorizontal: 10 }]}>
                  <Ionicons name="shield" size={14} color={Colors.evolution} />
                </View>
              </TouchableOpacity>
              <View style={[s.badge, { borderColor: Colors.xp + '40' }]}>
                <Ionicons name="star" size={14} color={Colors.xp} />
                <Text style={[s.badgeText, { color: Colors.xp }]}>{xp.toLocaleString('pt-BR')}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal)}>
            <LinearGradient
              colors={['#1A1222', '#15101E', Colors.bg]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.hero}
            >
              <View style={s.heroContent}>
                <View style={s.heroText}>
                  <Text style={s.heroGreeting}>BORA TREINAR,</Text>
                  <Text style={s.heroName}>{name.split(' ')[0].toUpperCase()}!</Text>
                  <Text style={s.heroSub}>
                    Consistência é o que{'\n'}vence qualquer talento.
                  </Text>
                </View>
                <RatMascot mood={mascotMood as any} size={110} />
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal * 2)} style={s.xpSection}>
            <View style={s.xpHeader}>
              <View style={s.levelBadgeWrap}>
                <LinearGradient colors={[...Gradients.evolutionPurple]} style={s.levelBadge}>
                  <Text style={s.levelNumber}>{level}</Text>
                </LinearGradient>
              </View>
              <View style={s.xpInfo}>
                <View style={s.xpRow}>
                  <Text style={s.xpLabel}>Nível {level}</Text>
                  <Text style={s.xpValue}>{xp.toLocaleString('pt-BR')} / {(xp + xpProgress.required - xpProgress.current).toLocaleString('pt-BR')} XP</Text>
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
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal * 3)}>
            <TouchableOpacity
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Começar treino agora"
              onPress={() => { trigger('heavy'); router.push('/(tabs)/workout'); }}
            >
              <LinearGradient colors={[...Gradients.primaryCta]} style={s.ctaButton}>
                <Ionicons name="barbell" size={24} color="#fff" />
                <Text style={s.ctaText}>COMEÇAR TREINO</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal * 4)} style={s.actionsRow}>
            <TouchableOpacity 
              style={s.actionCard} 
              activeOpacity={0.7} 
              accessibilityRole="button"
              accessibilityLabel="Realizar um micro treino rápido de 3 minutos"
              onPress={handleMicroWorkout}
            >
              <View style={[s.actionIconBg, { backgroundColor: Colors.streakBg }]}>
                <Ionicons name="flash" size={22} color={Colors.streak} />
              </View>
              <Text style={s.actionLabel}>Micro{'\n'}Treino</Text>
              <Text style={[s.actionSub, { color: Colors.streak }]}>3 min</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={s.actionCard} 
              activeOpacity={0.7} 
              accessibilityRole="button"
              accessibilityLabel="Fazer descanso ativo para manter a ofensiva"
              onPress={handleActiveRest}
            >
              <View style={[s.actionIconBg, { backgroundColor: Colors.successBg }]}>
                <Ionicons name="body" size={22} color={Colors.success} />
              </View>
              <Text style={s.actionLabel}>Descanso{'\n'}Ativo</Text>
              <Text style={[s.actionSub, { color: Colors.success }]}>Manter ofensiva</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={s.actionCard} 
              activeOpacity={0.7} 
              accessibilityRole="button"
              accessibilityLabel={`Usar ticket de descanso. Você tem ${restTickets} restantes`}
              onPress={handleUseTicket}
            >
              <View style={[s.actionIconBg, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="ticket" size={22} color={Colors.primary} />
                <View style={s.ticketBadge}>
                  <Text style={s.ticketBadgeText}>{restTickets}</Text>
                </View>
              </View>
              <Text style={s.actionLabel}>Ticket de{'\n'}Descanso</Text>
              <Text style={[s.actionSub, { color: Colors.primary }]}>{restTickets} restantes</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal * 5)}>
            <View style={s.streakCard}>
              <View style={s.streakTop}>
                <View>
                  <Text style={s.streakLabel}>OFENSIVA ATIVA</Text>
                  <View style={s.streakRow}>
                    <View style={s.fireIconWrap}>
                      <Ionicons name="flame" size={28} color={Colors.streak} />
                    </View>
                    <Text style={s.streakNumber}>{currentStreak}</Text>
                    <Text style={s.streakDays}>dias{'\n'}seguidos</Text>
                  </View>
                  <Text style={s.streakBest}>
                    <Ionicons name="trophy" size={12} color={Colors.xp} /> Melhor: {bestStreak} dias
                  </Text>
                </View>

                <View style={s.nextBeltContainer}>
                  <Text style={s.nextBeltLabel}>PRÓXIMA FAIXA</Text>
                  <View style={[s.beltCircle, { borderColor: nextBelt?.color || currentBelt.color }]}>
                    <Ionicons name="ribbon" size={20} color={nextBelt?.color || currentBelt.color} />
                  </View>
                  <Text style={[s.beltName, { color: nextBelt?.color || currentBelt.color }]}>
                    {nextBelt?.label || currentBelt.label}
                  </Text>
                  {nextBelt && (
                    <View style={s.beltProgress}>
                      <View style={[s.beltProgressFill, {
                        width: `${Math.min(100, (currentStreak / nextBelt.requiredStreak) * 100)}%`,
                        backgroundColor: nextBelt.color,
                      }]} />
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(450).delay(Stagger.normal * 6)}>
            <View style={s.tipCard}>
              <View style={s.tipIconBg}>
                <Ionicons name="bulb" size={18} color={Colors.xp} />
              </View>
              <View style={s.tipContent}>
                <Text style={s.tipTitle}>DICA DO RATO</Text>
                <Text style={s.tipText}>{tipOfDay}</Text>
              </View>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 12 },
  logo: { fontSize: 24, fontWeight: '900' },
  logoFit: { color: Colors.textPrimary },
  logoRat: { color: Colors.primary },
  headerBadges: { flexDirection: 'row', gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.bgCard, paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full, borderWidth: 1 },
  badgeText: { fontSize: 13, fontWeight: '700' },
  hero: { borderRadius: BorderRadius.xl, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  heroText: { flex: 1, marginRight: 10 },
  heroGreeting: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  heroName: { color: Colors.textPrimary, fontSize: 34, fontWeight: '900', lineHeight: 40, marginTop: 2 },
  heroSub: { color: Colors.textMuted, fontSize: 13, marginTop: 10, lineHeight: 19 },
  xpSection: { marginBottom: 16 },
  xpHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadgeWrap: { ...({ shadowColor: Colors.evolution, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }) },
  levelBadge: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
  levelNumber: { color: '#fff', fontSize: 18, fontWeight: '900' },
  xpInfo: { flex: 1 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  xpValue: { color: Colors.xp, fontSize: 12, fontWeight: '600' },
  xpBarOuter: { height: 8, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.full, overflow: 'hidden' },
  xpBarInner: { height: '100%', borderRadius: BorderRadius.full },
  ctaButton: { borderRadius: BorderRadius.lg, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16, ...({ shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 }) },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1.5 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionCard: { flex: 1, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard, paddingVertical: 18, paddingHorizontal: 10, alignItems: 'center', gap: 8 },
  actionIconBg: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  actionSub: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  ticketBadge: { position: 'absolute', top: -5, right: -7, backgroundColor: Colors.primary, borderRadius: 8, width: 17, height: 17, justifyContent: 'center', alignItems: 'center' },
  ticketBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  streakCard: { borderRadius: BorderRadius.xl, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, backgroundColor: Colors.bgCard },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  streakLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fireIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.streakBg, justifyContent: 'center', alignItems: 'center' },
  streakNumber: { color: Colors.textPrimary, fontSize: 44, fontWeight: '900' },
  streakDays: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', lineHeight: 14 },
  streakBest: { color: Colors.textDisabled, fontSize: 12, marginTop: 8 },
  nextBeltContainer: { alignItems: 'center' },
  nextBeltLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  beltCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgSurface },
  beltName: { fontSize: 11, fontWeight: '700', marginTop: 6 },
  beltProgress: { width: 70, height: 4, backgroundColor: Colors.bgSurface, borderRadius: 4, marginTop: 6, overflow: 'hidden' },
  beltProgressFill: { height: '100%', borderRadius: 4 },
  tipCard: { flexDirection: 'row', gap: 14, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.border, borderLeftWidth: 3, borderLeftColor: Colors.xp },
  tipIconBg: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.xpBg, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { color: Colors.xp, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  tipText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});
