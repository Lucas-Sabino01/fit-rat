/**
 * Fit Rat — Haptics Hook
 * Wrapper around expo-haptics for standardized feedback
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type FeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'select';

export function useHaptics() {
  const trigger = (type: FeedbackType = 'light') => {
    if (Platform.OS === 'web') return; // No haptics on web

    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'select':
        Haptics.selectionAsync();
        break;
    }
  };

  return { trigger };
}
