import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';

interface PlateCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  targetWeight: number; // Peso inicial vindo da série
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]; // Anilhas disponíveis
const PLATE_COLORS: Record<number, string> = {
  25: '#FF3B30', // Vermelho
  20: '#007AFF', // Azul
  15: '#FFCC00', // Amarelo
  10: '#34C759', // Verde
  5: '#FFFFFF',  // Branco
  2.5: '#000000', // Preto
  1.25: '#8E8E93', // Prata
};

export function PlateCalculatorModal({ visible, onClose, targetWeight: initialWeight }: PlateCalculatorModalProps) {
  const [weight, setWeight] = useState(initialWeight.toString());
  const [barWeight, setBarWeight] = useState(20);

  // Sincroniza se a prop mudar enquanto estiver aberto
  useEffect(() => {
    setWeight(initialWeight.toString());
  }, [initialWeight]);

  // Calcula quais anilhas usar
  const calculatePlates = () => {
    const numWeight = Number(weight) || 0;
    let weightToFill = (numWeight - barWeight) / 2; // Peso para CADA lado
    const platesUsed: { weight: number; count: number }[] = [];

    if (weightToFill <= 0) return [];

    for (const plate of AVAILABLE_PLATES) {
      if (weightToFill >= plate) {
        const count = Math.floor(weightToFill / plate);
        platesUsed.push({ weight: plate, count });
        weightToFill -= plate * count;
      }
    }
    return platesUsed;
  };

  const plates = calculatePlates();
  const numWeight = Number(weight) || 0;
  const error = numWeight > 0 && numWeight < barWeight ? `O peso é menor que a barra vazia (${barWeight}kg).` : '';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
        <View style={s.modal}>
          <View style={s.header}>
            <Text style={s.title}>Calculadora de Anilhas</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
            <View style={s.inputsRow}>
              <View style={s.inputContainer}>
                <Text style={s.inputLabel}>PESO TOTAL (KG)</Text>
                <TextInput
                  style={s.textInput}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  maxLength={5}
                />
              </View>
              <View style={s.inputContainer}>
                <Text style={s.inputLabel}>BARRA (KG)</Text>
                <TextInput
                  style={s.textInput}
                  keyboardType="numeric"
                  value={barWeight.toString()}
                  onChangeText={(val) => setBarWeight(Number(val) || 0)}
                  maxLength={3}
                />
              </View>
            </View>

            {error ? (
              <Text style={s.error}>{error}</Text>
            ) : (
              <>
                {/* Representação Visual da Barra */}
                <View style={s.barVisualizer}>
                  <View style={s.barbellLeft} />
                  <View style={s.platesContainer}>
                    {plates.map((p, i) => (
                      Array.from({ length: p.count }).map((_, j) => (
                        <View 
                          key={`${i}-${j}`} 
                          style={[
                            s.visualPlate, 
                            { 
                              backgroundColor: PLATE_COLORS[p.weight],
                              height: 60 + (p.weight * 1.5), // Maior peso = anilha mais alta
                              width: p.weight >= 10 ? 16 : 10 // Maior peso = mais grossa
                            }
                          ]} 
                        />
                      ))
                    ))}
                  </View>
                  <View style={s.barbellRight} />
                </View>

                {/* Lista de Anilhas para cada lado */}
                <View style={s.platesList}>
                  <Text style={s.listTitle}>COLOQUE DE CADA LADO:</Text>
                  {numWeight === 0 && <Text style={s.listEmpty}>Digite um peso acima.</Text>}
                  {numWeight > 0 && plates.length === 0 && <Text style={s.listEmpty}>Apenas a barra vazia.</Text>}
                  {plates.map(p => (
                    <View key={p.weight} style={s.plateRow}>
                      <View style={[s.plateColorDot, { backgroundColor: PLATE_COLORS[p.weight] }]} />
                      <Text style={s.plateRowText}>{p.count}x Anilha de {p.weight}kg</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { width: '100%', backgroundColor: Colors.bgCard, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800' },
  closeBtn: { padding: 4 },
  content: { padding: 20, alignItems: 'center' },
  
  inputsRow: { flexDirection: 'row', gap: 12, marginBottom: 24, width: '100%' },
  inputContainer: { flex: 1, backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.md, padding: 12, borderWidth: 1, borderColor: Colors.border },
  inputLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  textInput: { color: Colors.primary, fontSize: 24, fontWeight: '900', padding: 0 },
  
  error: { color: Colors.streak, fontSize: 14, textAlign: 'center', padding: 20 },
  // Visualizer
  barVisualizer: { flexDirection: 'row', alignItems: 'center', height: 120, marginBottom: 24, paddingHorizontal: 20 },
  barbellLeft: { width: 40, height: 12, backgroundColor: '#8E8E93', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 },
  barbellRight: { flex: 1, height: 12, backgroundColor: '#8E8E93', minWidth: 60 },
  platesContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  visualPlate: { borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.3)' },
  // List
  platesList: { width: '100%', backgroundColor: Colors.bgSurface, borderRadius: BorderRadius.lg, padding: 16 },
  listTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  listEmpty: { color: Colors.textSecondary, fontSize: 14 },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  plateColorDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  plateRowText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
