/**
 * Fit Rat — Trail Path Connector
 * Visual line connecting trail nodes
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface TrailPathProps {
  completed: boolean;
  color: string;
}

export function TrailPath({ completed, color }: TrailPathProps) {
  return (
    <View style={styles.container}>
      <View style={[
        styles.line,
        completed && { backgroundColor: color },
      ]}>
        {/* Dot decorations */}
        <View style={[styles.dot, completed && { backgroundColor: color }]} />
        <View style={[styles.dot, completed && { backgroundColor: color }, { top: '50%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  line: {
    width: 3,
    height: '100%',
    backgroundColor: Colors.bgSurface,
    borderRadius: 2,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.bgSurface,
    left: -2,
    top: 0,
  },
});
