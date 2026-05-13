/**
 * Fit Rat — Streak Counter Component
 * Animated counter showing current streak with fire effect
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';
import { getCurrentBelt, getNextBelt } from '@/constants/gamification';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  const currentBelt = getCurrentBelt(currentStreak);
  const nextBelt = getNextBelt(currentStreak);

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <View style={styles.streakLeft}>
          <Text style={styles.label}>OFENSIVA ATIVA</Text>
          <View style={styles.numberRow}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakUnit}>DIAS{'\n'}SEGUIDOS</Text>
          </View>
          <Text style={styles.bestStreak}>Melhor: {bestStreak} dias</Text>
        </View>

        <View style={styles.streakRight}>
          <Text style={styles.nextBeltLabel}>PRÓXIMA FAIXA</Text>
          <View style={[styles.beltBadge, { borderColor: nextBelt?.color || currentBelt.color }]}>
            <Text style={styles.beltNumber}>
              {nextBelt ? nextBelt.requiredStreak : '🏆'}
            </Text>
          </View>
          <Text style={[styles.beltName, { color: nextBelt?.color || currentBelt.color }]}>
            Faixa {nextBelt?.label || currentBelt.label}
          </Text>
          {nextBelt && (
            <View style={styles.progressBarOuter}>
              <View
                style={[
                  styles.progressBarInner,
                  {
                    width: `${Math.min(100, (currentStreak / nextBelt.requiredStreak) * 100)}%`,
                    backgroundColor: nextBelt.color,
                  },
                ]}
              />
            </View>
          )}
          <Text style={styles.progressText}>
            {currentStreak}/{nextBelt?.requiredStreak || currentStreak} dias
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  streakLeft: {
    flex: 1,
  },
  streakRight: {
    alignItems: 'center',
    marginLeft: Spacing.base,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakNumber: {
    color: Colors.textPrimary,
    fontSize: FontSizes['5xl'],
    fontWeight: FontWeights.black,
  },
  streakUnit: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    lineHeight: 14,
  },
  bestStreak: {
    color: Colors.textMuted,
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  nextBeltLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  beltBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardLight,
  },
  beltNumber: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  beltName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.xs,
  },
  progressBarOuter: {
    width: 80,
    height: 4,
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
});
