import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/theme';

interface QuickActionsProps {
  restTickets: number;
  onStartWorkout: () => void;
  onMicroWorkout: () => void;
  onActiveRest: () => void;
  onUseTicket: () => void;
}

export function QuickActions({
  restTickets,
  onStartWorkout,
  onMicroWorkout,
  onActiveRest,
  onUseTicket,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainButton} onPress={onStartWorkout} activeOpacity={0.8}>
        <Text style={styles.mainButtonIcon}>🏋️</Text>
        <Text style={styles.mainButtonText}>COMEÇAR TREINO</Text>
      </TouchableOpacity>

      <View style={styles.secondaryRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onMicroWorkout} activeOpacity={0.7}>
          <Text style={styles.secondaryIcon}>⚡</Text>
          <Text style={styles.secondaryLabel}>Micro{'\n'}Treino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onActiveRest} activeOpacity={0.7}>
          <Text style={styles.secondaryIcon}>🧘</Text>
          <Text style={styles.secondaryLabel}>Descanso{'\n'}Ativo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onUseTicket} activeOpacity={0.7}>
          <View style={styles.ticketBadge}>
            <Text style={styles.secondaryIcon}>🎟️</Text>
            <View style={styles.ticketCount}>
              <Text style={styles.ticketCountText}>{restTickets}</Text>
            </View>
          </View>
          <Text style={styles.secondaryLabel}>Ticket de{'\n'}Descanso</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ticketInfo}>
        <Text style={styles.ticketInfoIcon}>🎟️</Text>
        <Text style={styles.ticketInfoText}>
          {restTickets} ticket{restTickets !== 1 ? 's' : ''} — Use para manter sua ofensiva
        </Text>
        <Text style={styles.ticketInfoArrow}>›</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  mainButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButtonIcon: {
    fontSize: 24,
  },
  mainButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.extrabold,
    letterSpacing: 1,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    gap: Spacing.xs,
  },
  secondaryIcon: {
    fontSize: 24,
  },
  secondaryLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
    lineHeight: 14,
  },
  ticketBadge: {
    position: 'relative',
  },
  ticketCount: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketCountText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
  },
  ticketInfo: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  ticketInfoIcon: {
    fontSize: 18,
  },
  ticketInfoText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  ticketInfoArrow: {
    color: Colors.textMuted,
    fontSize: FontSizes.xl,
  },
});
