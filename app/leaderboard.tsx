/**
 * Fit Rat — Leaderboard/Ranking Screen
 * Duolingo-inspired Leagues
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Gradients } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MobileContainer } from '@/components/ui/MobileContainer';

const MOCK_LEADERBOARD = [
  { id: 1, name: 'Marcos P.', xp: 4500, isMe: false, streak: 45 },
  { id: 2, name: 'Lucas S.', xp: 4120, isMe: true, streak: 12 },
  { id: 3, name: 'Julia R.', xp: 3800, isMe: false, streak: 8 },
  { id: 4, name: 'Pedro H.', xp: 3550, isMe: false, streak: 21 },
  { id: 5, name: 'Amanda T.', xp: 3100, isMe: false, streak: 5 },
  { id: 6, name: 'Carlos M.', xp: 2900, isMe: false, streak: 3 },
];

export default function LeaderboardScreen() {
  const router = useRouter();

  return (
    <MobileContainer>
      <View style={s.screen}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.title}>Ranking</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {/* League Banner */}
          <LinearGradient colors={['#161B22', '#0D1117']} style={s.leagueBanner}>
            <View style={s.shieldBg}>
              <Ionicons name="shield" size={48} color={Colors.evolution} />
            </View>
            <Text style={s.leagueName}>LIGA DE PRATA</Text>
            <Text style={s.leagueSub}>Os top 3 avançam para a Liga de Ouro</Text>
            
            <View style={s.timerBox}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
              <Text style={s.timerText}>Termina em 2d 14h</Text>
            </View>
          </LinearGradient>

          {/* List */}
          <View style={s.listContainer}>
            {MOCK_LEADERBOARD.map((user, index) => {
              const isTop3 = index < 3;
              const positionColor = index === 0 ? Colors.xp : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : Colors.textMuted;
              
              return (
                <View key={user.id} style={[s.userRow, user.isMe && s.meRow]}>
                  <Text style={[s.position, { color: positionColor, fontWeight: isTop3 ? '900' : '700' }]}>
                    {index + 1}
                  </Text>
                  
                  <View style={[s.avatar, { borderColor: positionColor, borderWidth: isTop3 ? 2 : 0 }]}>
                    <Text style={s.avatarInitials}>{user.name.charAt(0)}</Text>
                  </View>
                  
                  <View style={s.userInfo}>
                    <Text style={[s.userName, user.isMe && { color: Colors.evolution }]}>{user.name}</Text>
                    <View style={s.streakBadge}>
                      <Ionicons name="flame" size={10} color={Colors.streak} />
                      <Text style={s.streakText}>{user.streak}</Text>
                    </View>
                  </View>
                  
                  <Text style={[s.xpText, user.isMe && { color: Colors.textPrimary }]}>{user.xp} XP</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center' },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  
  leagueBanner: { alignItems: 'center', padding: 24, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  shieldBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.evolution + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  leagueName: { color: Colors.evolution, fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  leagueSub: { color: Colors.textMuted, fontSize: 13, marginTop: 4, marginBottom: 16 },
  timerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.bgCard, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  timerText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  
  listContainer: { backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  meRow: { backgroundColor: Colors.evolution + '15' },
  position: { width: 24, textAlign: 'center', fontSize: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12 },
  avatarInitials: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  streakText: { color: Colors.streak, fontSize: 11, fontWeight: '700' },
  xpText: { color: Colors.textMuted, fontSize: 14, fontWeight: '800' },
});
