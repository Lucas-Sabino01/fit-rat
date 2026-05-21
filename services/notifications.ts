import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('streak-reminders', {
      name: 'Lembretes de Ofensiva',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F85149',
    });

    await Notifications.setNotificationChannelAsync('workout-motivation', {
      name: 'Motivação de Treino',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

const STREAK_MESSAGES = [
  { title: '🐀 Seu rato está triste!', body: 'Você ainda não treinou hoje. Nem um micro-treino de 3 min?' },
  { title: '🔥 Não deixe a chama apagar!', body: 'Sua ofensiva de {streak} dias está em risco!' },
  { title: '💪 Bora treinar, Ratão!', body: 'Um treino rápido é melhor que nenhum. 3 minutos salvam sua ofensiva!' },
  { title: '🎯 Falta pouco!', body: 'Você está quase na próxima faixa. Não pare agora!' },
  { title: '😴 O rato está dormindo...', body: 'Acorde ele! Um micro-treino de 3 min mantém sua ofensiva.' },
];

const CELEBRATION_MESSAGES = [
  { title: '🏆 Parabéns!', body: 'Mais um dia de ofensiva! Você é uma máquina.' },
  { title: '🐀💪 O rato está ficando forte!', body: 'Continue assim e desbloqueie a próxima evolução!' },
];

export async function scheduleStreakReminder(streakDays: number): Promise<string | null> {
  try {
    await cancelStreakReminders();

    const message = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
    const body = message.body.replace('{streak}', String(streakDays));
    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(20, 0, 0, 0);
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body,
        data: { type: 'streak-reminder', streakDays },
        ...(Platform.OS === 'android' && { channelId: 'streak-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return id;
  } catch (e) {
    console.warn('Failed to schedule streak reminder:', e);
    return null;
  }
}

export async function scheduleDailyMotivation(): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🐀 Bom dia, Ratão!',
        body: 'Hoje é dia de treino? Seu rato está esperando!',
        data: { type: 'daily-motivation' },
        ...(Platform.OS === 'android' && { channelId: 'workout-motivation' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7,
        minute: 0,
      },
    });

    return id;
  } catch (e) {
    console.warn('Failed to schedule daily motivation:', e);
    return null;
  }
}

export async function cancelStreakReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'streak-reminder') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}
