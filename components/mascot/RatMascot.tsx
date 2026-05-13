/**
 * Fit Rat — Rat Mascot Component (Animated)
 * Procedural animations using Reanimated to bring the mascot to life
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

export type RatMood = 'default' | 'happy' | 'excited' | 'sad' | 'sleeping' | 'flexing' | 'celebrating';

interface RatMascotProps {
  mood?: RatMood;
  size?: number;
  label?: string;
  showLabel?: boolean;
}

const MOOD_CONFIG: Record<RatMood, { emoji: string; bg: string; border: string; text: string }> = {
  default: { emoji: '🐀', bg: Colors.primaryBg, border: Colors.primary, text: 'Padrão' },
  happy: { emoji: '😊', bg: Colors.successBg, border: Colors.success, text: 'Feliz' },
  excited: { emoji: '🔥', bg: Colors.streakBg, border: Colors.streak, text: 'Animado' },
  sad: { emoji: '😢', bg: 'rgba(88, 166, 255, 0.12)', border: Colors.trail, text: 'Triste' },
  sleeping: { emoji: '😴', bg: 'rgba(110, 118, 129, 0.12)', border: Colors.textMuted, text: 'Dormindo' },
  flexing: { emoji: '💪', bg: Colors.evolutionBg, border: Colors.evolution, text: 'Maromba' },
  celebrating: { emoji: '🎉', bg: Colors.xpBg, border: Colors.xp, text: 'Comemorando' },
};

export function RatMascot({ mood = 'default', size = 100, showLabel = false, label }: RatMascotProps) {
  const config = MOOD_CONFIG[mood];

  // Animation values
  const scaleY = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Reset values on mood change
    scaleY.value = 1;
    translateY.value = 0;
    rotation.value = 0;

    // Breathing effect (squash and stretch)
    scaleY.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.98, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Floating effect based on mood
    if (mood === 'excited' || mood === 'celebrating') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );
      if (mood === 'celebrating') {
        rotation.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 300 }),
            withTiming(15, { duration: 300 })
          ),
          -1,
          true
        );
      }
    } else if (mood === 'sleeping') {
      // Slow breathing for sleeping
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.97, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      // Default subtle float
      translateY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scaleY: scaleY.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.bg,
            borderColor: config.border,
          },
          animatedStyle
        ]}
      >
        <Text style={[styles.placeholder, { fontSize: size * 0.38 }]}>{config.emoji}</Text>
        <Text style={[styles.moodTag, { fontSize: Math.max(8, size * 0.09), color: config.border }]}>
          {label || `RATO_${mood.toUpperCase()}`}
        </Text>
      </Animated.View>
      {showLabel && (
        <Text style={[styles.label, { color: config.border }]}>{config.text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    marginBottom: 2,
  },
  moodTag: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
  },
});
