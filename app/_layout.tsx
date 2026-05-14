/**
 * Fit Rat — Root Layout (v2)
 * Dark theme, loads Inter font on web
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  // Inject Inter font on web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof document === 'undefined') return;
    if (document.getElementById('inter-font-link')) return;

    const link = document.createElement('link');
    link.id = 'inter-font-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `* { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }`;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="leaderboard" options={{ presentation: 'modal' }} />
        <Stack.Screen name="exercises" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" backgroundColor={Colors.bg} />
    </>
  );
}
