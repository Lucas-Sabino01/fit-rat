import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors, BorderRadius } from '@/constants/theme';
import { Stagger } from '@/constants/animations';
import { useStreakStore } from '@/stores/useStreakStore';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { RatMascot } from '@/components/mascot/RatMascot';
import { Skeleton } from '@/components/ui/Skeleton';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<'gamification' | 'strength'>('gamification');
  const { currentStreak, bestStreak, streakHistory } = useStreakStore();
  const { workoutHistory } = useWorkoutStore();
  const { totalWorkouts, totalVolume } = useProfileStore();

  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const todayDate = new Date().getDate();

  const getDayType = (day: number): string => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return streakHistory.find(h => h.date === dateStr)?.type || 'none';
  };

  const dayColors: Record<string, string> = {
    workout: Colors.primary,
    micro: Colors.streak,
    active_rest: Colors.success,
    ticket: Colors.xp,
    rest: Colors.bgSurface,
    missed: 'transparent',
    none: 'transparent',
  };

  const stats = [
    { icon: 'flame' as const, value: currentStreak, label: 'Ofensiva', color: Colors.streak },
    { icon: 'trophy' as const, value: bestStreak, label: 'Melhor', color: Colors.xp },
    { icon: 'barbell' as const, value: totalWorkouts, label: 'Treinos', color: Colors.primary },
    { icon: 'trending-up' as const, value: `${(totalVolume / 1000).toFixed(0)}t`, label: 'Volume', color: Colors.evolution },
  ];

  const hasHistory = workoutHistory.length > 0;
  const recentWorkouts = [...workoutHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
  const maxVolume = recentWorkouts.length > 0 ? Math.max(...recentWorkouts.map(w => w.volume)) : 1000;

  return (
    <MobileContainer>
      <View style={s.screen}>
        <StatusBar barStyle="light-content" />
        <View style={s.header}>
          <Text style={s.title}>PROGRESSO</Text>
          <View style={s.tabContainer}>
            <TouchableOpacity 
              style={[s.tabBtn, activeTab === 'gamification' && s.tabBtnActive]} 
              onPress={() => setActiveTab('gamification')}
            >
              <Text style={[s.tabText, activeTab === 'gamification' && s.tabTextActive]}>Gamificação</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[s.tabBtn, activeTab === 'strength' && s.tabBtnActive]} 
              onPress={() => setActiveTab('strength')}
            >
              <Text style={[s.tabText, activeTab === 'strength' && s.tabTextActive]}>Força</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'gamification' ? (
            <Animated.View entering={FadeIn.duration(300)} key="gamification">
              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast)} style={s.statsRow}>
                {stats.map((st, i) => (
                  <View key={i} style={s.statCard}>
                    <View style={[s.statIconBg, { backgroundColor: st.color + '18' }]}>
                      <Ionicons name={st.icon} size={18} color={st.color} />
                    </View>
                    <Text style={s.statValue}>{st.value}</Text>
                    <Text style={s.statLabel}>{st.label}</Text>
                  </View>
                ))}
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 2)}>
                <View style={s.calCard}>
                  <Text style={s.calTitle}>{MONTHS[currentMonth]} {currentYear}</Text>
                  <View style={s.weekHeader}>
                    {WEEK_DAYS.map((d, i) => <Text key={i} style={s.weekDay}>{d}</Text>)}
                  </View>
                  <View style={s.calGrid}>
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => <View key={`e-${i}`} style={s.calCell} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const type = getDayType(day);
                      const isToday = day === todayDate;
                      const bg = dayColors[type] || 'transparent';
                      return (
                        <View key={day} style={s.calCell}>
                          <View style={[
                            s.calDay,
                            bg !== 'transparent' && { backgroundColor: bg },
                            isToday && s.calToday,
                          ]}>
                            <Text style={[s.calDayText, (type !== 'none' || isToday) && { color: '#fff' }]}>{day}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <View style={s.legend}>
                    {[
                      { c: Colors.primary, l: 'Treino' },
                      { c: Colors.streak, l: 'Micro' },
                      { c: Colors.success, l: 'Descanso' },
                      { c: Colors.xp, l: 'Ticket' },
                    ].map((it, i) => (
                      <View key={i} style={s.legendItem}>
                        <View style={[s.legendDot, { backgroundColor: it.c }]} />
                        <Text style={s.legendText}>{it.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 3)}>
                <Text style={s.histTitle}>HISTÓRICO RECENTE</Text>
              </Animated.View>

              {!hasHistory && !isLoading ? (
                <Animated.View entering={FadeInDown.duration(400).delay(Stagger.fast * 4)} style={s.emptyState}>
                  <RatMascot mood="sad" size={80} />
                  <Text style={s.emptyTitle}>Nenhum treino ainda</Text>
                  <Text style={s.emptyText}>Complete seu primeiro treino para ver o histórico aqui!</Text>
                </Animated.View>
              ) : isLoading ? (
                <View>
                  {[1, 2, 3].map((_, i) => (
                    <View key={`skel-${i}`} style={[s.histCard, { borderColor: 'transparent' }]}>
                      <Skeleton width={40} height={40} borderRadius={12} />
                      <View style={{ flex: 1, gap: 6 }}>
                        <Skeleton width="60%" height={14} />
                        <Skeleton width="40%" height={12} />
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                workoutHistory.slice(0, 5).map((h, i) => (
                  <Animated.View key={h.id} entering={FadeInDown.duration(300).delay(Stagger.fast * 4 + i * 50)}>
                    <TouchableOpacity 
                      style={s.histCard}
                      accessibilityRole="button"
                      accessibilityLabel={`Ver detalhes do treino ${h.name}`}
                    >
                      <View style={s.histIconBg}>
                        <Ionicons name="barbell" size={18} color={Colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.histName}>{h.name}</Text>
                        <Text style={s.histDate}>{new Date(h.date).getDate()}/{new Date(h.date).getMonth() + 1} · {Math.floor(h.duration / 60)} min</Text>
                      </View>
                      <View style={s.histRight}>
                        <Text style={s.histXP}>+{h.xpEarned} XP</Text>
                        <Text style={s.histVol}>{Math.round(h.volume).toLocaleString()}kg</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(300)} key="strength">
              <Text style={s.histTitle}>EVOLUÇÃO DE VOLUME (Últimos 7 treinos)</Text>
              <View style={s.chartCard}>
                {recentWorkouts.length === 0 ? (
                  <Text style={s.emptyText}>Sem dados suficientes para gráficos.</Text>
                ) : (
                  <View style={s.chartContainer}>
                    <View style={s.chartYAxis}>
                      <Text style={s.chartYLabel}>{Math.round(maxVolume / 1000)}k</Text>
                      <Text style={s.chartYLabel}>{Math.round((maxVolume / 2) / 1000)}k</Text>
                      <Text style={s.chartYLabel}>0</Text>
                    </View>
                    <View style={s.chartBars}>
                      {recentWorkouts.map((w, i) => {
                        const heightPerc = (w.volume / maxVolume) * 100;
                        return (
                          <View key={i} style={s.chartBarCol}>
                            <View style={s.chartBarBg}>
                              <Animated.View 
                                entering={FadeInDown.duration(600).delay(i * 100)} 
                                style={[s.chartBarFill, { height: `${heightPerc}%` }]} 
                              />
                            </View>
                            <Text style={s.chartXLabel}>{new Date(w.date).getDate()}/{new Date(w.date).getMonth() + 1}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>

              <Text style={[s.histTitle, { marginTop: 20 }]}>CARGA MÁXIMA ESTIMADA (1RM)</Text>
              <View style={s.calCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View>
                    <Text style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '800' }}>Supino Reto</Text>
                    <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}>Últimos 6 meses</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: Colors.streak, fontSize: 20, fontWeight: '900' }}>80 kg</Text>
                    <Text style={{ color: Colors.success, fontSize: 12, fontWeight: '700' }}>+20kg (Ano)</Text>
                  </View>
                </View>
                
                <View style={s.chartContainer}>
                  <View style={s.chartYAxis}>
                    <Text style={s.chartYLabel}>80</Text>
                    <Text style={s.chartYLabel}>70</Text>
                    <Text style={s.chartYLabel}>60</Text>
                  </View>
                  <View style={s.chartBars}>
                    {[60, 62, 65, 70, 75, 80].map((weight, i) => {
                      const heightPerc = ((weight - 50) / 35) * 100; // Mock normalization
                      return (
                        <View key={i} style={[s.chartBarCol, { width: 35 }]}>
                          <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center', marginBottom: 8 }}>
                            <Animated.View 
                              entering={FadeInDown.duration(600).delay(i * 100)} 
                              style={{ height: `${heightPerc}%`, width: 4, backgroundColor: Colors.streak, borderRadius: 2 }}
                            />
                            <Animated.View 
                              entering={FadeInDown.duration(600).delay(i * 100 + 100)} 
                              style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.bgCard, borderWidth: 3, borderColor: Colors.streak, position: 'absolute', bottom: `${heightPerc}%`, transform: [{translateY: 6}] }}
                            />
                          </View>
                          <Text style={s.chartXLabel}>{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][i]}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
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
  header: { paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 12, paddingHorizontal: 20, backgroundColor: Colors.bg },
  title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '900', letterSpacing: 1, marginBottom: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: BorderRadius.md },
  tabBtnActive: { backgroundColor: Colors.bgCard, ...({ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }) },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: Colors.textPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statIconBg: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { color: Colors.textPrimary, fontSize: 20, fontWeight: '900' },
  statLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600', marginTop: 4 },
  calCard: { borderRadius: BorderRadius.xl, padding: 18, borderWidth: 1, borderColor: Colors.border, marginBottom: 20, backgroundColor: Colors.bgCard },
  calTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 14 },
  weekHeader: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', color: Colors.textDisabled, fontSize: 11, fontWeight: '700' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, padding: 2, justifyContent: 'center', alignItems: 'center' },
  calDay: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  calToday: { borderWidth: 2, borderColor: Colors.trail },
  calDayText: { color: Colors.textDisabled, fontSize: 12, fontWeight: '600' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  chartCard: { borderRadius: BorderRadius.xl, padding: 18, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  chartContainer: { flexDirection: 'row', height: 180 },
  chartYAxis: { justifyContent: 'space-between', paddingRight: 10, paddingVertical: 16 },
  chartYLabel: { color: Colors.textDisabled, fontSize: 10, fontWeight: '700' },
  chartBars: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: 16 },
  chartBarCol: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: 30 },
  chartBarBg: { flex: 1, width: 14, backgroundColor: Colors.bgSurface, borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 8 },
  chartBarFill: { width: '100%', backgroundColor: Colors.primary, borderRadius: 7 },
  chartXLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  histTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  histCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  histIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center' },
  histName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  histDate: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  histRight: { alignItems: 'flex-end' },
  histXP: { color: Colors.xp, fontSize: 13, fontWeight: '700' },
  histVol: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  placeholderFeature: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  placeholderTitle: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700' },
  placeholderSub: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  emptyText: { color: Colors.textMuted, fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
});
