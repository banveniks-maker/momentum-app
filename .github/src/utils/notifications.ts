import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationConfig {
  hour: number;
  minute: number;
  enabled: boolean;
}

const CHANNEL_ID = 'momentum-daily';

async function createAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00ff88',
      sound: 'default',
    });
  }
}

export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on real devices');
    return false;
  }

  await createAndroidChannel();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleDaily(config: NotificationConfig, lang: string) {
  // Cancel all existing scheduled notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!config.enabled) return;

  const messages = getMessages(lang);

  // Schedule 7 different messages (one per day of week, cycling)
  for (let i = 0; i < 7; i++) {
    const msg = messages[i % messages.length];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        sound: 'default',
        badge: 1,
        data: { screen: 'Today' },
      },
      trigger: {
        channelId: CHANNEL_ID,
        weekday: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7, // 1=Sunday ... 7=Saturday
        hour: config.hour,
        minute: config.minute,
        repeats: true,
      },
    });
  }
}

export async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendTestNotification(lang: string) {
  const messages = getMessages(lang);
  const msg = messages[0];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧪 ' + msg.title,
      body: 'Test notification — it works! ' + msg.body,
      sound: 'default',
    },
    trigger: { seconds: 3 },
  });
}

function getMessages(lang: string) {
  const all: Record<string, { title: string; body: string }[]> = {
    en: [
      { title: '⚡ Energy check!', body: "Don't let your streak die. 30 seconds to check off your habits." },
      { title: '🔥 Streak at risk!', body: 'Your habits are waiting. Keep the momentum going!' },
      { title: '💪 Champion mindset', body: 'Winners show up every day. Your turn.' },
      { title: '🎯 Daily mission', body: 'Complete your habits and watch your energy score soar.' },
      { title: '🌅 New day, new score', body: 'Yesterday is gone. Today is your clean slate.' },
      { title: '⚡ Your energy is low', body: 'Time to recharge. Complete a habit in the next 5 minutes.' },
      { title: '🏆 Leaderboard waiting', body: 'Help your country climb the global ranking today.' },
    ],
    ru: [
      { title: '⚡ Проверка энергии!', body: 'Не дай стрику умереть. 30 секунд на привычки.' },
      { title: '🔥 Стрик под угрозой!', body: 'Привычки ждут тебя. Держи momentum!' },
      { title: '💪 Настрой чемпиона', body: 'Победители приходят каждый день. Твой черёд.' },
      { title: '🎯 Ежедневная миссия', body: 'Выполни привычки и смотри как растёт твой счёт.' },
      { title: '🌅 Новый день — новый счёт', body: 'Вчера прошло. Сегодня — чистый лист.' },
      { title: '⚡ Твоя энергия низкая', body: 'Время зарядиться. Выполни привычку за 5 минут.' },
      { title: '🏆 Рейтинг ждёт', body: 'Помоги своей стране подняться в мировом рейтинге.' },
    ],
    zh: [
      { title: '⚡ 能量检查！', body: '不要让连续记录中断。30秒完成你的习惯。' },
      { title: '🔥 连续记录有风险！', body: '你的习惯在等待。保持动力！' },
      { title: '💪 冠军心态', body: '赢家每天都会出现。轮到你了。' },
      { title: '🎯 每日任务', body: '完成你的习惯，看看你的能量分数飙升。' },
      { title: '🌅 新的一天，新的分数', body: '昨天已经过去。今天是新的开始。' },
      { title: '⚡ 你的能量很低', body: '是时候充电了。在接下来的5分钟内完成一个习惯。' },
      { title: '🏆 排行榜在等待', body: '今天帮助你的国家攀登全球排名。' },
    ],
    es: [
      { title: '⚡ ¡Control de energía!', body: 'No dejes morir tu racha. 30 segundos para tus hábitos.' },
      { title: '🔥 ¡Racha en riesgo!', body: 'Tus hábitos te esperan. ¡Mantén el momentum!' },
      { title: '💪 Mentalidad de campeón', body: 'Los ganadores aparecen cada día. Tu turno.' },
      { title: '🎯 Misión diaria', body: 'Completa tus hábitos y ve cómo sube tu puntuación.' },
      { title: '🌅 Nuevo día, nueva puntuación', body: 'Ayer quedó atrás. Hoy es tu pizarra limpia.' },
      { title: '⚡ Tu energía está baja', body: 'Hora de recargar. Completa un hábito en 5 minutos.' },
      { title: '🏆 El ranking espera', body: 'Ayuda a tu país a subir en el ranking global hoy.' },
    ],
    fr: [
      { title: '⚡ Vérification énergie !', body: "Ne laisse pas mourir ta série. 30 secondes pour tes habitudes." },
      { title: '🔥 Série en danger !', body: 'Tes habitudes t\'attendent. Garde le momentum !' },
      { title: '💪 Mentalité de champion', body: 'Les gagnants se montrent chaque jour. À ton tour.' },
      { title: '🎯 Mission du jour', body: 'Complète tes habitudes et regarde ton score monter.' },
      { title: '🌅 Nouveau jour, nouveau score', body: 'Hier est passé. Aujourd\'hui est ton nouveau départ.' },
      { title: '⚡ Ton énergie est basse', body: 'Il est temps de recharger. Fais une habitude en 5 min.' },
      { title: '🏆 Le classement attend', body: 'Aide ton pays à monter dans le classement mondial.' },
    ],
    hi: [
      { title: '⚡ ऊर्जा जांच!', body: 'अपनी स्ट्रीक मत मरने दो। 30 सेकंड में आदतें पूरी करो।' },
      { title: '🔥 स्ट्रीक खतरे में!', body: 'तुम्हारी आदतें इंतजार कर रही हैं। momentum बनाए रखो!' },
      { title: '💪 चैंपियन की सोच', body: 'विजेता हर दिन आते हैं। अब तुम्हारी बारी।' },
      { title: '🎯 दैनिक मिशन', body: 'आदतें पूरी करो और अपना ऊर्जा स्कोर बढ़ते देखो।' },
      { title: '🌅 नया दिन, नया स्कोर', body: 'कल बीत गया। आज एक नई शुरुआत है।' },
      { title: '⚡ तुम्हारी ऊर्जा कम है', body: 'रिचार्ज करने का समय। 5 मिनट में एक आदत पूरी करो।' },
      { title: '🏆 लीडरबोर्ड इंतजार कर रहा है', body: 'आज अपने देश को वैश्विक रैंकिंग में ऊपर चढ़ाओ।' },
    ],
  };

  return all[lang] ?? all.en;
}

// Handle notification tap — navigate to correct screen
export function addNotificationResponseListener(
  onResponse: (screen: string) => void
) {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const screen = response.notification.request.content.data?.screen as string;
    if (screen) onResponse(screen);
  });
}
