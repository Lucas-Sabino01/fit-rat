/**
 * Fit Rat — Rat Mascot Component
 * SVG placeholder with labeled states.
 * User will replace with actual mascot images later.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, BorderRadius } from '@/constants/theme';

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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.bg,
            borderColor: config.border,
          },
        ]}
      >
        {/* Placeholder: replace with actual mascot SVG/image */}
        <Text style={[styles.placeholder, { fontSize: size * 0.38 }]}>{config.emoji}</Text>
        <Text style={[styles.moodTag, { fontSize: Math.max(8, size * 0.09), color: config.border }]}>
          {label || `RATO_${mood.toUpperCase()}`}
        </Text>
      </View>
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
