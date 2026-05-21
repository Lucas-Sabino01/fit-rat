import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

interface XPBarProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  percentage: number;
}

export function XPBar({ level, currentXP, requiredXP, totalXP, percentage }: XPBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
        <View style={styles.xpInfo}>
          <View style={styles.xpTextRow}>
            <Text style={styles.xpLabel}>Nível {level}</Text>
            <Text style={styles.xpValue}>
              {totalXP.toLocaleString('pt-BR')} / {(totalXP + requiredXP - currentXP).toLocaleString('pt-BR')} XP
            </Text>
          </View>
          <View style={styles.barOuter}>
            <View style={[styles.barInner, { width: `${percentage}%` }]} />
            <View style={[styles.barGlow, { width: `${percentage}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  levelNumber: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.black,
  },
  xpInfo: {
    flex: 1,
  },
  xpTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  xpLabel: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  xpValue: {
    color: Colors.xpGold,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  barOuter: {
    height: 8,
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  barInner: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  barGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: BorderRadius.full,
    opacity: 0.4,
    backgroundColor: Colors.primaryLight,
  },
});
