/**
 * Fit Rat — Trail Node Component
 * Visual node for the trail/path screen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors, BorderRadius } from '@/constants/theme';

export type NodeStatus = 'locked' | 'current' | 'completed';

interface TrailNodeProps {
  number: number;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  status: NodeStatus;
  progress?: number; // 0–100 for current node
  totalRequired?: number;
  currentCount?: number;
  onPress?: () => void;
}

function PulsingNode({ color, children }: { color: string; children: React.ReactNode }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animStyle}>{children}</Animated.View>;
}

export function TrailNode({
  number,
  name,
  subtitle,
  color,
  icon,
  status,
  progress = 0,
  totalRequired,
  currentCount,
  onPress,
}: TrailNodeProps) {
  const nodeContent = (
    <View style={[
      styles.node,
      status === 'completed' && { backgroundColor: color, borderColor: color },
      status === 'current' && { borderColor: color, borderWidth: 3 },
      status === 'locked' && styles.nodeLocked,
    ]}>
      {status === 'completed' ? (
        <Ionicons name="checkmark" size={24} color="#fff" />
      ) : status === 'locked' ? (
        <Ionicons name="lock-closed" size={20} color={Colors.textDisabled} />
      ) : (
        <Text style={[styles.nodeNumber, { color }]}>{number}</Text>
      )}
    </View>
  );

  const wrappedNode = status === 'current' ? (
    <PulsingNode color={color}>{nodeContent}</PulsingNode>
  ) : nodeContent;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={status === 'locked' ? 1 : 0.7}
      onPress={status !== 'locked' ? onPress : undefined}
      disabled={status === 'locked'}
    >
      <View style={styles.row}>
        {wrappedNode}

        <View style={[styles.info, status === 'locked' && { opacity: 0.3 }]}>
          <View style={styles.nameRow}>
            <Ionicons
              name={icon as any}
              size={18}
              color={status === 'current' ? color : status === 'completed' ? color : Colors.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={[
                styles.name,
                status === 'current' && { color },
                status === 'completed' && { color: Colors.textSecondary },
              ]}>
                {name}
              </Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

          {status === 'current' && totalRequired != null && currentCount != null && (
            <View style={styles.progressWrap}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
              </View>
              <Text style={[styles.progressText, { color }]}>
                {currentCount}/{totalRequired} treinos
              </Text>
            </View>
          )}

          {status === 'completed' && (
            <View style={styles.doneRow}>
              <Ionicons name="checkmark-circle" size={14} color={color} />
              <Text style={[styles.doneText, { color }]}>Concluída!</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  node: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.bgCard,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeLocked: {
    opacity: 0.35,
    backgroundColor: Colors.bgSurface,
    borderColor: Colors.border,
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    paddingTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  progressWrap: {
    marginTop: 10,
    marginLeft: 28,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 28,
  },
  doneText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
