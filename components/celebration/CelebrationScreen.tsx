import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors, FontFamily, Gradients, BorderRadius, Spacing } from '@/constants/theme';
import { RatMascot } from '@/components/mascot/RatMascot';

interface CelebrationScreenProps {
  xpEarned: number;
  totalSets: number;
  totalVolume: number;
  streakDays: number;
  leveledUp?: boolean;
  newLevel?: number;
  onClose: () => void;
}

const { width: SCREEN_W } = Dimensions.get('window');
function ConfettiParticle({ delay, color, left }: { delay: number; color: string; left: number }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(600, { duration: 2500 }));
    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 1000 }));
    rotate.value = withDelay(delay, withRepeat(withTiming(360, { duration: 1200 }), -1));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left, top: -10, width: 10, height: 10, borderRadius: 2, backgroundColor: color }, style]} />
  );
}

export function CelebrationScreen({
  xpEarned,
  totalSets,
  totalVolume,
  streakDays,
  leveledUp,
  newLevel,
  onClose,
}: CelebrationScreenProps) {
  const confettiColors = [Colors.primary, Colors.xp, Colors.success, Colors.streak, Colors.trail, Colors.evolution];

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={['rgba(13,17,23,0.97)', 'rgba(13,17,23,1)']} style={styles.gradient}>
        {Array.from({ length: 24 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            delay={i * 80}
            color={confettiColors[i % confettiColors.length]}
            left={Math.random() * (SCREEN_W - 20)}
          />
        ))}

        <Animated.View entering={ZoomIn.duration(500).delay(200)} style={styles.mascotWrap}>
          <RatMascot mood="celebrating" size={120} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.duration(500).delay(400)} style={styles.title}>
          TREINO CONCLUÍDO! 🎉
        </Animated.Text>

        <Animated.Text entering={FadeInDown.duration(400).delay(600)} style={styles.subtitle}>
          Você é uma máquina, Ratão!
        </Animated.Text>

        <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: Colors.xpBg }]}>
              <Ionicons name="star" size={22} color={Colors.xp} />
            </View>
            <Text style={styles.statValue}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primaryBg }]}>
              <Ionicons name="barbell" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: Colors.successBg }]}>
              <Ionicons name="trending-up" size={22} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{Math.round(totalVolume)}kg</Text>
            <Text style={styles.statLabel}>Volume</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: Colors.streakBg }]}>
              <Ionicons name="flame" size={22} color={Colors.streak} />
            </View>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Ofensiva</Text>
          </View>
        </Animated.View>

        {leveledUp && newLevel && (
          <Animated.View entering={ZoomIn.duration(600).delay(1200)} style={styles.levelUp}>
            <LinearGradient colors={[...Gradients.evolutionPurple]} style={styles.levelUpGradient}>
              <Ionicons name="arrow-up-circle" size={24} color="#fff" />
              <Text style={styles.levelUpText}>NÍVEL {newLevel}!</Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.duration(400).delay(1400)} style={styles.ctaWrap}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <LinearGradient colors={[...Gradients.primaryCta]} style={styles.ctaBtn}>
              <Text style={styles.ctaText}>CONTINUAR</Text>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  mascotWrap: {
    marginBottom: 24,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 36,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  levelUp: {
    marginBottom: 28,
  },
  levelUpGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
  },
  levelUpText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  ctaWrap: {
    width: '100%',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: BorderRadius.lg,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
