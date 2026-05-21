import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Colors, BorderRadius, Gradients } from '@/constants/theme';
import { useProfileStore } from '@/stores/useProfileStore';
import { useRouter } from 'expo-router';
import { useHaptics } from '@/hooks/useHaptics';
import { MobileContainer } from '@/components/ui/MobileContainer';
import { RatMascot } from '@/components/mascot/RatMascot';

type OnboardingData = {
  gender: string;
  objective: string;
  focusArea: string;
  coach: string;
  birthYear: number;
  height: number;
  weight: number;
  targetWeight: number;
  currentBody: string;
  targetBody: string;
  location: string;
  experience: string;
  days: string[];
};

const SECTIONS = [
  { title: '01 META E FOCO', start: 0, end: 4 },
  { title: '02 SOBRE O SEU CORPO', start: 5, end: 10 },
  { title: '03 AVALIAÇÃO FÍSICA', start: 11, end: 13 },
  { title: '04 SINCRONIZAR', start: 14, end: 14 }
];

export default function SuperOnboarding() {
  const router = useRouter();
  const { trigger } = useHaptics();
  const { completeOnboarding } = useProfileStore();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    days: []
  });

  const nextStep = () => {
    trigger('medium');
    if (step < 14) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const prevStep = () => {
    trigger('light');
    if (step > 0) setStep(s => s - 1);
  };

  const finish = () => {
    trigger('success');
    completeOnboarding();
    router.replace('/(tabs)/');
  };

  const currentSection = SECTIONS.find(s => step >= s.start && step <= s.end);
  const progressPerc = currentSection ? ((step - currentSection.start + 1) / (currentSection.end - currentSection.start + 1)) * 100 : 0;

  const updateData = (key: keyof OnboardingData, value: any) => {
    trigger('select');
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: string) => {
    trigger('select');
    setData(prev => {
      const days = prev.days || [];
      if (days.includes(day)) return { ...prev, days: days.filter(d => d !== day) };
      return { ...prev, days: [...days, day] };
    });
  };

  const renderHeader = () => {
    if (step === 0 || step === 14) return null;
    return (
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={prevStep}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.sectionTitle}>{currentSection?.title}</Text>
          <View style={s.progressBar}>
            <Animated.View style={[s.progressFill, { width: `${progressPerc}%` }]} />
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={s.centerScreen}>
            <View style={s.welcomeMascotBox}>
              <RatMascot mood="happy" size={140} />
            </View>
            <Text style={s.titleCenter}>Olá, sou o Fit!</Text>
            <Text style={s.subtitleCenter}>Seu treinador de IA pessoal. Aqui estão algumas perguntas para montarmos seu treino personalizado.</Text>
            <TouchableOpacity style={s.mainBtn} onPress={nextStep}>
              <Text style={s.mainBtnText}>Estou pronto</Text>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é o seu sexo?</Text>
            <Text style={s.subtitleCenter}>Conte mais sobre você</Text>
            <View style={s.rowOptions}>
              <TouchableOpacity style={[s.card, data.gender === 'M' && s.cardActive]} onPress={() => updateData('gender', 'M')}>
                <RatMascot mood="flexing" size={120} />
                <Text style={[s.cardText, data.gender === 'M' && s.cardTextActive]}>Masculino</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, data.gender === 'F' && s.cardActive]} onPress={() => updateData('gender', 'F')}>
                <RatMascot mood="excited" size={120} />
                <Text style={[s.cardText, data.gender === 'F' && s.cardTextActive]}>Feminino</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => updateData('gender', 'O')} style={{ marginTop: 20 }}>
               <Text style={s.textLink}>Outros / Prefiro não dizer</Text>
            </TouchableOpacity>
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.gender && s.btnDisabled]} onPress={nextStep} disabled={!data.gender}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é o seu principal objetivo?</Text>
            {['Perder peso', 'Aumentar os músculos', 'Manter a forma'].map(opt => (
              <TouchableOpacity key={opt} style={[s.listCard, data.objective === opt && s.listCardActive]} onPress={() => updateData('objective', opt)}>
                <Text style={[s.listCardText, data.objective === opt && s.listCardTextActive]}>{opt}</Text>
                {data.objective === opt && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
              </TouchableOpacity>
            ))}
            {data.objective && (
              <View style={s.feedbackBox}>
                <Text style={s.feedbackText}>💪 Ótima escolha! Nosso plano adaptativo fará isso acontecer.</Text>
              </View>
            )}
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.objective && s.btnDisabled]} onPress={nextStep} disabled={!data.objective}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é a sua área de foco?</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, gap: 10 }}>
                {['Corpo todo', 'Braço', 'Peito', 'Abdômen', 'Perna'].map(opt => (
                  <TouchableOpacity key={opt} style={[s.pillBtn, data.focusArea === opt && s.pillBtnActive]} onPress={() => updateData('focusArea', opt)}>
                    <Text style={[s.pillText, data.focusArea === opt && s.pillTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RatMascot mood="flexing" size={150} />
              </View>
            </View>
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.focusArea && s.btnDisabled]} onPress={nextStep} disabled={!data.focusArea}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Escolha a personalidade do seu coach</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {[
                { id: 'partner', title: 'Parceiro de treinos', desc: 'Motivação na parceria para treinar com você todos os dias', icon: 'happy' },
                { id: 'general', title: 'General dos Ganhos', desc: 'Disciplina, ordem e foco absolutos. Sem desculpas.', icon: 'flexing' },
                { id: 'architect', title: 'Arquiteto do Shape', desc: 'Estratégia e eficiência para construir o melhor shape.', icon: 'flexing' },
                { id: 'zen', title: 'Rato Zen', desc: 'Equilíbrio, bem estar e conexão. Cuidar de corpo e mente.', icon: 'happy' },
              ].map(coach => (
                <TouchableOpacity key={coach.id} style={[s.coachCard, data.coach === coach.id && s.coachCardActive]} onPress={() => updateData('coach', coach.id)}>
                   <View style={s.coachIcon}><RatMascot mood={coach.icon as any} size={50}/></View>
                   <View style={{ flex: 1 }}>
                     <Text style={[s.coachTitle, data.coach === coach.id && s.coachTitleActive]}>{coach.title}</Text>
                     <Text style={[s.coachDesc, data.coach === coach.id && s.coachDescActive]}>{coach.desc}</Text>
                   </View>
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
            <TouchableOpacity style={[s.mainBtn, !data.coach && s.btnDisabled]} onPress={nextStep} disabled={!data.coach}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 5:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Em que ano você nasceu?</Text>
            <View style={s.feedbackBox}>
              <Text style={s.feedbackText}>Isso nos ajudará a ajustar o treino mais adequado para a sua faixa etária.</Text>
            </View>
            <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>
               {Array.from({ length: 50 }).map((_, i) => 2010 - i).map(year => (
                 <TouchableOpacity key={year} style={[s.yearRow, data.birthYear === year && s.yearRowActive]} onPress={() => updateData('birthYear', year)}>
                   <Text style={[s.yearText, data.birthYear === year && s.yearTextActive]}>{year}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>
            <TouchableOpacity style={[s.mainBtn, !data.birthYear && s.btnDisabled]} onPress={nextStep} disabled={!data.birthYear}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 6:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é sua altura?</Text>
            <View style={s.bigInputBox}>
              <Text style={s.bigInputLabel}>Centímetros (cm)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => updateData('height', Math.max(100, (data.height || 170) - 1))} style={s.adjBtn}><Ionicons name="remove" size={24} color="#fff" /></TouchableOpacity>
                <Text style={s.bigInputValue}>{data.height || 170}</Text>
                <TouchableOpacity onPress={() => updateData('height', Math.min(250, (data.height || 170) + 1))} style={s.adjBtn}><Ionicons name="add" size={24} color="#fff" /></TouchableOpacity>
              </View>
            </View>
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.height && s.btnDisabled]} onPress={nextStep} disabled={!data.height}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 7:
        const imc = data.weight && data.height ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1) : 0;
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é seu peso atual?</Text>
            <View style={s.bigInputBox}>
              <Text style={s.bigInputLabel}>Quilos (kg)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => updateData('weight', Math.max(30, (data.weight || 70) - 1))} style={s.adjBtn}><Ionicons name="remove" size={24} color="#fff" /></TouchableOpacity>
                <Text style={s.bigInputValue}>{data.weight || 70}</Text>
                <TouchableOpacity onPress={() => updateData('weight', Math.min(200, (data.weight || 70) + 1))} style={s.adjBtn}><Ionicons name="add" size={24} color="#fff" /></TouchableOpacity>
              </View>
            </View>
            {data.weight && data.height ? (
              <View style={[s.feedbackBox, { backgroundColor: Colors.trailBg, borderColor: Colors.trail }]}>
                <Text style={[s.feedbackText, { color: Colors.trail }]}>Seu IMC: {imc} {'\n'}Vamos ajustar os treinos para sua estrutura.</Text>
              </View>
            ) : null}
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.weight && s.btnDisabled]} onPress={nextStep} disabled={!data.weight}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 8:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é seu peso alvo?</Text>
            <View style={s.bigInputBox}>
              <Text style={s.bigInputLabel}>Quilos (kg)</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => updateData('targetWeight', Math.max(30, (data.targetWeight || data.weight || 70) - 1))} style={s.adjBtn}><Ionicons name="remove" size={24} color="#fff" /></TouchableOpacity>
                <Text style={s.bigInputValue}>{data.targetWeight || data.weight || 70}</Text>
                <TouchableOpacity onPress={() => updateData('targetWeight', Math.min(200, (data.targetWeight || data.weight || 70) + 1))} style={s.adjBtn}><Ionicons name="add" size={24} color="#fff" /></TouchableOpacity>
              </View>
            </View>
            {data.targetWeight && data.weight && (
              <View style={s.feedbackBox}>
                <Text style={s.feedbackTitle}>Objetivo sensato!</Text>
                <Text style={s.feedbackText}>Você buscará uma variação de {Math.abs(data.targetWeight - data.weight).toFixed(1)}kg. Nós ajudaremos com passos seguros.</Text>
              </View>
            )}
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.targetWeight && s.btnDisabled]} onPress={nextStep} disabled={!data.targetWeight}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 9:
      case 10:
        const isTarget = step === 10;
        const stateKey = isTarget ? 'targetBody' : 'currentBody';
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Qual é seu tipo de corpo {isTarget ? 'alvo' : 'no momento'}?</Text>
            <View style={s.rowOptions}>
              <TouchableOpacity style={[s.card, data[stateKey] === 'magro' && s.cardActive]} onPress={() => updateData(stateKey, 'magro')}>
                <Ionicons name="body-outline" size={60} color={data[stateKey] === 'magro' ? '#fff' : Colors.textSecondary} />
                <Text style={[s.cardText, data[stateKey] === 'magro' && s.cardTextActive]}>Magro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, data[stateKey] === 'atletico' && s.cardActive]} onPress={() => updateData(stateKey, 'atletico')}>
                <Ionicons name="body" size={60} color={data[stateKey] === 'atletico' ? '#fff' : Colors.textSecondary} />
                <Text style={[s.cardText, data[stateKey] === 'atletico' && s.cardTextActive]}>Atlético</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.card, data[stateKey] === 'cheinho' && s.cardActive]} onPress={() => updateData(stateKey, 'cheinho')}>
                <Ionicons name="accessibility" size={60} color={data[stateKey] === 'cheinho' ? '#fff' : Colors.textSecondary} />
                <Text style={[s.cardText, data[stateKey] === 'cheinho' && s.cardTextActive]}>Cheinho</Text>
              </TouchableOpacity>
            </View>
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data[stateKey] && s.btnDisabled]} onPress={nextStep} disabled={!data[stateKey]}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 11:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Onde pretende se exercitar?</Text>
            {['Em casa', 'Na academia', 'Calistenia'].map(opt => (
              <TouchableOpacity key={opt} style={[s.listCard, data.location === opt && s.listCardActive]} onPress={() => updateData('location', opt)}>
                <Text style={[s.listCardText, data.location === opt && s.listCardTextActive]}>{opt}</Text>
                {data.location === opt && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
              </TouchableOpacity>
            ))}
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.location && s.btnDisabled]} onPress={nextStep} disabled={!data.location}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 12:
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Você já teve alguma experiência com treinos?</Text>
            {['Sim, treino regularmente', 'Sim, há menos de um ano', 'Sim, há mais de um ano', 'Não, nenhuma experiência'].map(opt => (
              <TouchableOpacity key={opt} style={[s.listCard, data.experience === opt && s.listCardActive]} onPress={() => updateData('experience', opt)}>
                <Text style={[s.listCardText, data.experience === opt && s.listCardTextActive]}>{opt}</Text>
                {data.experience === opt && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
              </TouchableOpacity>
            ))}
            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, !data.experience && s.btnDisabled]} onPress={nextStep} disabled={!data.experience}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 13:
        const allDays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
        return (
          <View style={s.content}>
            <Text style={s.titleCenter}>Escolha os dias de treino!</Text>
            <Text style={s.subtitleCenter}>Com base em seus dados, recomendamos 4 treinos por semana.</Text>
            
            <View style={s.daysGrid}>
              {allDays.map(day => (
                <TouchableOpacity key={day} style={[s.dayBox, data.days?.includes(day) && s.dayBoxActive]} onPress={() => toggleDay(day)}>
                  <Text style={[s.dayText, data.days?.includes(day) && s.dayTextActive]}>{day}</Text>
                  {data.days?.includes(day) && (
                     <View style={s.dayCheck}><Ionicons name="checkmark" size={12} color="#fff" /></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.spacer} />
            <TouchableOpacity style={[s.mainBtn, (!data.days || data.days.length === 0) && s.btnDisabled]} onPress={nextStep} disabled={!data.days || data.days.length === 0}>
              <Text style={s.mainBtnText}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        );

      case 14:
        return (
          <View style={s.centerScreen}>
            <Text style={s.titleCenter}>Plano Pronto!</Text>
            <Text style={s.subtitleCenter}>Nós construímos o plano perfeito para você. {'\n'}Deseja sincronizar seu perfil?</Text>
            
            <View style={s.authBox}>
              <TouchableOpacity style={s.authBtn} onPress={finish}>
                <Ionicons name="logo-google" size={20} color={Colors.textPrimary} />
                <Text style={s.authText}>Iniciar sessão com Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.authBtn} onPress={finish}>
                <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
                <Text style={s.authText}>Iniciar sessão com Apple</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={s.skipAuthBtn} onPress={finish}>
              <Text style={s.skipAuthText}>PULAR POR ENQUANTO</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <MobileContainer>
      <View style={s.screen}>
        {renderHeader()}
        <Animated.View key={step} entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(300)} style={s.slideContainer}>
          {renderStep()}
        </Animated.View>
      </View>
    </MobileContainer>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  slideContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 20 : 60, paddingBottom: 20 },
  backBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center' },
  sectionTitle: { color: Colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  progressBar: { width: 120, height: 4, backgroundColor: Colors.bgSurface, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  centerScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  titleCenter: { color: Colors.textPrimary, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitleCenter: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  welcomeMascotBox: { width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.primaryBg, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  mainBtn: { backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: BorderRadius.full, alignItems: 'center', width: '100%', marginBottom: Platform.OS === 'web' ? 20 : 40 },
  btnDisabled: { opacity: 0.5 },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  spacer: { flex: 1 },
  rowOptions: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 20 },
  card: { flex: 1, backgroundColor: Colors.bgCard, padding: 20, borderRadius: BorderRadius.lg, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  cardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  cardText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700', marginTop: 16 },
  cardTextActive: { color: Colors.primary },
  textLink: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', textDecorationLine: 'underline' },
  listCard: { backgroundColor: Colors.bgCard, padding: 20, borderRadius: BorderRadius.lg, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listCardActive: { backgroundColor: Colors.primary },
  listCardText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  listCardTextActive: { color: '#fff' },
  feedbackBox: { backgroundColor: Colors.successBg, padding: 16, borderRadius: BorderRadius.md, marginTop: 20, borderWidth: 1, borderColor: Colors.success },
  feedbackTitle: { color: Colors.success, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  feedbackText: { color: Colors.success, fontSize: 14, lineHeight: 20 },
  pillBtn: { backgroundColor: Colors.bgCard, paddingVertical: 14, paddingHorizontal: 20, borderRadius: BorderRadius.full },
  pillBtnActive: { backgroundColor: Colors.primary },
  pillText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  coachCard: { backgroundColor: Colors.bgCard, padding: 16, borderRadius: BorderRadius.lg, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 2, borderColor: 'transparent' },
  coachCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  coachIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  coachTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  coachTitleActive: { color: Colors.primary },
  coachDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  coachDescActive: { color: Colors.textPrimary },
  yearRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  yearRowActive: { backgroundColor: Colors.primaryBg, borderRadius: BorderRadius.md, borderBottomWidth: 0 },
  yearText: { color: Colors.textSecondary, fontSize: 20, fontWeight: '600' },
  yearTextActive: { color: Colors.primary, fontSize: 24, fontWeight: '800' },
  bigInputBox: { alignItems: 'center', marginTop: 40 },
  bigInputLabel: { color: Colors.textMuted, fontSize: 14, fontWeight: '700', marginBottom: 20 },
  bigInputValue: { color: Colors.textPrimary, fontSize: 54, fontWeight: '900', marginHorizontal: 30 },
  adjBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.bgSurface, justifyContent: 'center', alignItems: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 20 },
  dayBox: { width: '30%', backgroundColor: Colors.bgCard, paddingVertical: 20, borderRadius: BorderRadius.md, alignItems: 'center', position: 'relative' },
  dayBoxActive: { backgroundColor: Colors.primary },
  dayText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  dayTextActive: { color: '#fff' },
  dayCheck: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.bg },
  authBox: { width: '100%', gap: 12, marginBottom: 30 },
  authBtn: { flexDirection: 'row', backgroundColor: Colors.bgCard, padding: 16, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', gap: 12 },
  authText: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  skipAuthBtn: { padding: 16 },
  skipAuthText: { color: Colors.textMuted, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
