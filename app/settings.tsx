/**
 * Fit Rat — Settings Modal
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '@/constants/theme';
import { MobileContainer } from '@/components/ui/MobileContainer';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);
  const [metricUnit, setMetricUnit] = useState(true);

  return (
    <MobileContainer>
      <View style={s.screen}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.title}>Configurações</Text>
          <View style={{ width: 40 }} /> {/* Spacer */}
        </View>

        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.sectionTitle}>CONTA</Text>
          <View style={s.card}>
            <TouchableOpacity style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name="person" size={18} color={Colors.primary} />
                </View>
                <Text style={s.rowText}>Editar Perfil</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textDisabled} />
            </TouchableOpacity>
            <View style={s.divider} />
            <TouchableOpacity style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: Colors.evolution + '20' }]}>
                  <Ionicons name="shield-checkmark" size={18} color={Colors.evolution} />
                </View>
                <Text style={s.rowText}>Privacidade e Dados</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textDisabled} />
            </TouchableOpacity>
          </View>

          <Text style={s.sectionTitle}>PREFERÊNCIAS</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: Colors.xp + '20' }]}>
                  <Ionicons name="notifications" size={18} color={Colors.xp} />
                </View>
                <Text style={s.rowText}>Notificações</Text>
              </View>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor="#fff"
              />
            </View>
            <View style={s.divider} />
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: Colors.trail + '20' }]}>
                  <Ionicons name="moon" size={18} color={Colors.trail} />
                </View>
                <Text style={s.rowText}>Tema Escuro</Text>
              </View>
              <Switch 
                value={darkTheme} 
                onValueChange={setDarkTheme}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor="#fff"
              />
            </View>
            <View style={s.divider} />
            <View style={s.row}>
              <View style={s.rowLeft}>
                <View style={[s.iconBg, { backgroundColor: Colors.streak + '20' }]}>
                  <Ionicons name="scale" size={18} color={Colors.streak} />
                </View>
                <Text style={s.rowText}>Usar Kilos (kg)</Text>
              </View>
              <Switch 
                value={metricUnit} 
                onValueChange={setMetricUnit}
                trackColor={{ false: Colors.border, true: Colors.success }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <TouchableOpacity style={s.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={s.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center' },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  content: { padding: 20 },
  sectionTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12, marginLeft: 8 },
  card: { backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBg: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.error + '15', padding: 16, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.error + '40', marginTop: 10 },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: '700' },
});
