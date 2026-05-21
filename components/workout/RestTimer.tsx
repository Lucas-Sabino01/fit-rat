import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { useHaptics } from '@/hooks/useHaptics';

interface RestTimerProps {
  durationSeconds: number;
  onFinish: () => void;
  onSkip: () => void;
}

export function RestTimer({ durationSeconds, onFinish, onSkip }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const progress = useSharedValue(1);
  const { trigger } = useHaptics();
  const [totalDuration, setTotalDuration] = useState(durationSeconds);

  useEffect(() => {
    progress.value = withTiming(0, { duration: timeLeft * 1000, easing: Easing.linear });

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          trigger('success');
          onFinish();
          return 0;
        }
        if (prev <= 4) {
          trigger('light');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const adjustTime = (amount: number) => {
    trigger('light');
    setTimeLeft(prev => {
      const newTime = Math.max(1, prev + amount);
      const newTotal = totalDuration + amount;
      setTotalDuration(newTotal);
      progress.value = newTime / newTotal;
      progress.value = withTiming(0, { duration: newTime * 1000, easing: Easing.linear });
      return newTime;
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={s.container}>
      <View style={s.timerBox}>
        <Ionicons name="timer-outline" size={24} color={Colors.primary} />
        <View style={s.timeInfo}>
          <Text style={s.label}>DESCANSO</Text>
          <Text style={s.timeText}>{formattedTime}</Text>
        </View>
        <View style={s.actions}>
          <TouchableOpacity style={s.adjustBtn} onPress={() => adjustTime(-10)}>
            <Text style={s.adjustText}>-10s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.adjustBtn} onPress={() => adjustTime(30)}>
            <Text style={s.adjustText}>+30s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.skipBtn} onPress={() => { trigger('medium'); onSkip(); }}>
            <Text style={s.skipText}>PULAR</Text>
            <Ionicons name="play-forward" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={s.barOuter}>
        <Animated.View style={[s.barInner, animatedStyle]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { backgroundColor: Colors.bgCard, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  timerBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeInfo: { flex: 1 },
  label: { color: Colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  timeText: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  adjustBtn: { backgroundColor: Colors.bgSurface, paddingHorizontal: 10, paddingVertical: 8, borderRadius: BorderRadius.sm },
  adjustText: { color: Colors.textPrimary, fontSize: 11, fontWeight: '700' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.bgSurface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  skipText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700' },
  barOuter: { height: 4, backgroundColor: Colors.bgSurface, borderRadius: 2, marginTop: 14, overflow: 'hidden' },
  barInner: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
});
