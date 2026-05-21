import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius } from '@/constants/theme';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { ExerciseDetailsModal } from '@/components/workout/ExerciseDetailsModal';

const MOCK_EXERCISES = [
  { id: '1', name: 'Supino Reto', muscle: 'Peito', equip: 'Barra' },
  { id: '2', name: 'Agachamento Livre', muscle: 'Pernas', equip: 'Barra' },
  { id: '3', name: 'Puxada Frontal', muscle: 'Costas', equip: 'Polia' },
  { id: '4', name: 'Desenvolvimento', muscle: 'Ombros', equip: 'Halteres' },
  { id: '5', name: 'Rosca Direta', muscle: 'Bíceps', equip: 'Barra' },
  { id: '6', name: 'Tríceps Corda', muscle: 'Tríceps', equip: 'Polia' },
  { id: '7', name: 'Leg Press 45', muscle: 'Pernas', equip: 'Máquina' },
];

const MUSCLES = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'];

export default function ExercisesLibraryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = MOCK_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Todos' || ex.muscle === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <MobileContainer>
      <View style={s.screen}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.title}>Biblioteca</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={s.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textDisabled} />
          <TextInput 
            style={s.searchInput}
            placeholder="Buscar exercício..."
            placeholderTextColor={Colors.textDisabled}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={{ paddingBottom: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
            {MUSCLES.map(m => (
              <TouchableOpacity 
                key={m} 
                style={[s.filterChip, filter === m && s.filterChipActive]}
                onPress={() => setFilter(m)}
              >
                <Text style={[s.filterText, filter === m && s.filterTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={s.listContent}>
          {filtered.map(ex => (
            <TouchableOpacity 
              key={ex.id} 
              style={s.exCard}
              onPress={() => setSelectedId(ex.id)}
            >
              <View style={s.exIconBg}>
                <Ionicons name="barbell" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.exName}>{ex.name}</Text>
                <Text style={s.exSub}>{ex.muscle} · {ex.equip}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textDisabled} />
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && (
            <View style={s.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={s.emptyText}>Nenhum exercício encontrado</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {selectedId && (
        <ExerciseDetailsModal 
          visible={true} 
          exerciseId={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 54, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, justifyContent: 'center', alignItems: 'center' },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, marginHorizontal: 20, paddingHorizontal: 16, height: 48, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  searchInput: { flex: 1, color: Colors.textPrimary, marginLeft: 10, fontSize: 15 },
  
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primaryBg, borderColor: Colors.primary },
  filterText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: Colors.primary },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard, padding: 16, borderRadius: BorderRadius.lg, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  exIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  exName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  exSub: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: Colors.textMuted, marginTop: 12, fontWeight: '600' }
});
