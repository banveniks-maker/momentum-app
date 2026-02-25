import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore, Lang } from '../store';
import { usePremium, PRICES, PRODUCTS } from '../utils/premium';
import { requestPermissions, scheduleDaily, cancelAll, sendTestNotification } from '../utils/notifications';
import { analytics } from '../utils/analytics';
import { t } from '../utils/i18n';
import { C, F, S } from '../utils/design';

const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English',  native: 'EN'   },
  { code: 'ru', label: 'Russian',  native: 'RU'   },
  { code: 'zh', label: 'Chinese',  native: '中文' },
  { code: 'es', label: 'Spanish',  native: 'ES'   },
  { code: 'fr', label: 'French',   native: 'FR'   },
  { code: 'hi', label: 'Hindi',    native: 'हि'  },
];

export default function ProfileScreen() {
  const store = useStore();
  const premium = usePremium();
  const tr = t(store.lang);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const score = store.score;

  const handleLangChange = (code: Lang) => {
    analytics.langChange(store.lang, code);
    store.setLang(code);
  };

  const handleNotifToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow notifications in device settings.');
        return;
      }
      await scheduleDaily({ hour: 9, minute: 0, enabled: true }, store.lang);
    } else {
      await cancelAll();
    }
    setNotifEnabled(value);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tr.profile}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Profile */}
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 16, margin: S.md, marginTop: S.md }]}>
          <View style={styles.avatarBig}><Text style={{ fontSize: 28 }}>{store.userEmoji}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{store.userName}</Text>
            <Text style={styles.userSub}>Level {Math.floor(score / 10) + 1}{premium.isPro ? '  👑 PRO' : ''}</Text>
          </View>
          <View>
            <Text style={styles.bigScore}>{score}</Text>
            <Text style={styles.bigScoreLbl}>ENERGY</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>STATS</Text>
          <View style={styles.statsGrid}>
            {[
              [store.habits.length, 'HABITS'],
              [store.getBestStreak(), 'BEST STREAK'],
              [store.getCompletionRate() + '%', 'COMPLETION'],
              [store.getDoneToday().length, 'DONE TODAY'],
            ].map(([v, l], i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statVal}>{v}</Text>
                <Text style={styles.statLbl}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro */}
        {!premium.isPro && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>MOMENTUM PRO</Text>
            <LinearGradient colors={['rgba(255,204,0,0.15)', 'rgba(255,204,0,0.04)']} style={styles.proCard}>
              <Text style={styles.proTitle}>👑 Unlock Pro</Text>
              <Text style={styles.proSub}>Unlimited AI Coach • Advanced analytics • Custom themes</Text>
              <View style={styles.proBtns}>
                {(['monthly', 'yearly', 'lifetime'] as const).map(type => {
                  const pid = PRODUCTS[type.toUpperCase() as keyof typeof PRODUCTS];
                  const best = type === 'yearly';
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.proBtn, best && styles.proBtnBest]}
                      onPress={() => Alert.alert('Pro', `${PRICES[pid]} — Add expo-in-app-purchases to enable real purchases.`)}
                    >
                      {best && <Text style={styles.bestBadge}>BEST</Text>}
                      <Text style={[styles.proBtnPrice, best && { color: C.gold }]}>{PRICES[pid]}</Text>
                      <Text style={styles.proBtnLbl}>{type}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>LANGUAGE</Text>
          <View style={styles.langGrid}>
            {LANGS.map(l => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langBtn, store.lang === l.code && styles.langBtnOn]}
                onPress={() => handleLangChange(l.code)}
              >
                <Text style={[styles.langNative, store.lang === l.code && { color: C.green }]}>{l.native}</Text>
                <Text style={styles.langLabel}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Daily Reminders</Text>
                <Text style={styles.settingSub}>Push notifications every day at 9:00 AM</Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={handleNotifToggle}
                trackColor={{ false: C.s3, true: C.green }}
                thumbColor={notifEnabled ? '#000' : C.muted}
              />
            </View>
            {notifEnabled && (
              <TouchableOpacity
                style={{ marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: C.s2, alignItems: 'center' }}
                onPress={() => sendTestNotification(store.lang).then(() => Alert.alert('✅', 'Test sent! Check in 3s.'))}
              >
                <Text style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: 1 }}>
                  SEND TEST NOTIFICATION
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* AI quota */}
        {!premium.isPro && (
          <View style={styles.section}>
            <Text style={styles.secTitle}>AI COACH TODAY</Text>
            <View style={styles.card}>
              <Text style={styles.settingLabel}>{premium.getRemainingAiMessages()} / 10 messages left</Text>
              <View style={{ height: 4, backgroundColor: C.s2, borderRadius: 2, overflow: 'hidden', marginTop: 10 }}>
                <View style={{ height: '100%', backgroundColor: C.green, borderRadius: 2, width: `${(premium.getRemainingAiMessages() / 10) * 100}%` as any }} />
              </View>
              <Text style={[styles.settingSub, { marginTop: 6 }]}>Upgrade Pro for unlimited messages</Text>
            </View>
          </View>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>ABOUT</Text>
          <View style={styles.card}>
            <Text style={{ fontFamily: F.title, fontSize: 22, color: C.green, marginBottom: 6 }}>MOMENTUM v1.0</Text>
            <Text style={{ fontSize: 12, fontFamily: F.body, color: C.muted, lineHeight: 20 }}>
              Built for a billion people 🌍{'\n'}
              AI Coach powered by Claude (Anthropic){'\n'}
              {Platform.OS === 'android' ? 'Android' : 'iOS'} • React Native + Expo
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: S.md, paddingVertical: S.md, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: F.mono, fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: 'uppercase' },
  section: { paddingHorizontal: S.md, paddingTop: S.md },
  secTitle: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },
  card: { backgroundColor: C.s1, borderRadius: S.r, borderWidth: 1, borderColor: C.border, padding: S.md },
  avatarBig: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,255,136,0.3)' },
  userName: { fontSize: 20, fontFamily: F.bodyB, color: C.text },
  userSub: { fontSize: 12, fontFamily: F.mono, color: C.muted, marginTop: 2 },
  bigScore: { fontFamily: F.title, fontSize: 40, color: C.green, textAlign: 'right' },
  bigScoreLbl: { fontFamily: F.mono, fontSize: 8, color: C.muted, letterSpacing: 2, textAlign: 'right' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: { flex: 1, minWidth: '45%', backgroundColor: C.s2, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 12, alignItems: 'center' },
  statVal: { fontFamily: F.title, fontSize: 28, color: C.green },
  statLbl: { fontFamily: F.mono, fontSize: 8, color: C.muted, letterSpacing: 1, textAlign: 'center' },
  proCard: { borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,204,0,0.25)', padding: S.md },
  proTitle: { fontFamily: F.title, fontSize: 24, color: C.text, marginBottom: 4 },
  proSub: { fontSize: 12, fontFamily: F.body, color: C.muted, marginBottom: 14 },
  proBtns: { flexDirection: 'row', gap: 8 },
  proBtn: { flex: 1, backgroundColor: C.s2, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 10, alignItems: 'center' },
  proBtnBest: { borderColor: 'rgba(255,204,0,0.4)', backgroundColor: 'rgba(255,204,0,0.06)' },
  bestBadge: { fontFamily: F.mono, fontSize: 7, color: C.gold, marginBottom: 3, letterSpacing: 1 },
  proBtnPrice: { fontFamily: F.title, fontSize: 16, color: C.green },
  proBtnLbl: { fontFamily: F.mono, fontSize: 8, color: C.muted, marginTop: 2, textTransform: 'capitalize' },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn: { flex: 1, minWidth: '28%', backgroundColor: C.s2, borderRadius: 10, borderWidth: 1, borderColor: C.border, paddingVertical: 10, alignItems: 'center' },
  langBtnOn: { borderColor: C.green, backgroundColor: 'rgba(0,255,136,0.08)' },
  langNative: { fontFamily: F.title, fontSize: 20, color: C.text },
  langLabel: { fontFamily: F.mono, fontSize: 8, color: C.muted, marginTop: 2 },
  settingLabel: { fontSize: 15, fontFamily: F.bodyM, color: C.text },
  settingSub: { fontSize: 11, fontFamily: F.body, color: C.muted, marginTop: 2 },
});
