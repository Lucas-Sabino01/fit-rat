/**
 * Fit Rat — Mobile Container v2
 * Constrains content to mobile width on web/desktop
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: Colors.bg,
    // Subtle phone frame effect on web
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
});
