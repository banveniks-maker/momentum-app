import React, { useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Vibration, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store';
import { t } from '../utils/i18n';
import { C, F, S } from '../utils/design';
import AddHabitModal from '../components/AddHabitModal';
import WeekChart from '../components/WeekChart';
import Toast from '../components/Toast';

export default function TodayScreen() {
  const store = useStore();
  const tr = t(store.lang);
  const [modalOpen, setModalOpen] = React.useState(false);
  const toastRef = useRef<any>(null);

  const score = Math.max(0, Math.min(100, store.score));
  const statusIdx = score >= 80 ? 0 : score >= 65 ? 1 : score >= 45 ? 2 : score >= 25 ? 3 : 4;

  const handleToggleHabit = useCallback((id: string, pts: number, isDone: boolean) => {
    Haptics.impactAsync(isDone
      ? Haptics.ImpactFeedbackStyle.Light
      : Haptics.ImpactFeedbackStyle.Medium
    );
    store.toggleHabit(id);
    if (!isDone) {
      toastRef.current?.show(tr.toastHabitDone(pts));
    }
  }, [store, tr]);

  const handleMood = useCallback((pts: number) => {
    Haptics.selectionAsync();
    if (store.moodToday === pts) {
      store.clearMood();
    } else {
      store.setMood(pts);
      if (pts > 0) toastRef.current?.show(`+${pts} ENERGY`);
    }
  }, [store]);

  const today = new Date();
  const dateStr = today.toLocaleDateString(store.lang === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'short', day: '2-digit', month: '2-digit',
  }).toUpperCase();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Toast ref={toastRef} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>MOMENTUM</Text>
          <Text style={styles.logoSub}>ENERGY TRACKER</Text>
        </View>
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Energy Hero Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#00ff88', '#00ccff', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.cardAccent}
          />
          <Text style={styles.cardLabel}>{tr.energyLabel}</Text>
          <View style={styles.energyRow}>
            <Text style={styles.bigScore}>{score}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusText}>{tr.statuses[statusIdx]}</Text>
              <Text style={styles.countryText}>{tr.moods[tr.moods.findIndex(m => m.pts === store.moodToday) < 0 ? 1 : tr.moods.findIndex(m => m.pts === store.moodToday)]?.emoji || '🌍'}</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.barTrack}>
            <LinearGradient
              colors={['#00ff88', '#00ffcc']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.barFill, { width: `${score}%` as any }]}
            />
          </View>
          {/* Level dots */}
          <View style={styles.dotsRow}>
            {Array.from({ length: 10 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < score / 10 && {
                    backgroundColor: score >= 70 ? C.green : score >= 40 ? C.gold : C.red,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Mood */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.howFeel}</Text>
          <View style={styles.moodRow}>
            {tr.moods.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.moodBtn, store.moodToday === m.pts && styles.moodBtnOn]}
                onPress={() => handleMood(m.pts)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Week Chart */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.thisWeek}</Text>
          <WeekChart scores={store.getWeekScores()} />
        </View>

        {/* Habits */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.habitsToday}</Text>
          {store.habits.map(h => {
            const isDone = h.completedDates.includes(new Date().toISOString().split('T')[0]);
            return (
              <TouchableOpacity
                key={h.id}
                style={[styles.habit, isDone && styles.habitDone]}
                onPress={() => handleToggleHabit(h.id, h.pts, isDone)}
                activeOpacity={0.75}
              >
                {isDone && (
                  <View style={styles.habitAccent} />
                )}
                <View style={[styles.habitCheck, isDone && styles.habitCheckDone]}>
                  {isDone && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitName, isDone && styles.habitNameDone]}>
                    {h.emoji} {h.name}
                  </Text>
                  <Text style={styles.habitStreak}>{tr.dayStreak(h.streak)}</Text>
                </View>
                <Text style={[styles.habitPts, isDone && { opacity: 0.35 }]}>
                  +{h.pts}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Text style={styles.addBtnText}>{tr.addHabit}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AddHabitModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(name, emoji) => {
          store.addHabit(name, emoji);
          setModalOpen(false);
          toastRef.current?.show(tr.toastAdded);
        }}
        lang={store.lang}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', paddingHorizontal: S.md,
    paddingTop: S.sm, paddingBottom: S.md,
    backgroundColor: 'rgba(10,10,15,0.95)',
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  logo: {
    fontFamily: F.title, fontSize: 32, letterSpacing: 3,
    color: C.green, textShadowColor: 'rgba(0,255,136,0.4)',
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20,
  },
  logoSub: { fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.muted },
  datePill: {
    backgroundColor: C.s1, borderRadius: 20, borderWidth: 1,
    borderColor: C.border, paddingHorizontal: 12, paddingVertical: 6,
  },
  dateText: { fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: 1 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: C.s1, borderRadius: S.r, borderWidth: 1, borderColor: C.border,
    padding: S.lg, marginHorizontal: S.md, marginTop: S.md, overflow: 'hidden',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  cardLabel: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginBottom: 10 },
  energyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  bigScore: {
    fontFamily: F.title, fontSize: 80, lineHeight: 80, color: C.green,
    textShadowColor: 'rgba(0,255,136,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30,
  },
  statusText: { fontSize: 17, fontFamily: F.bodyM, color: C.text, marginBottom: 4 },
  countryText: { fontSize: 20 },
  barTrack: { backgroundColor: C.s2, borderRadius: 3, height: 5, overflow: 'hidden', marginBottom: 10 },
  barFill: { height: '100%', borderRadius: 3 },
  dotsRow: { flexDirection: 'row', gap: 5, marginTop: 10 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: C.s2 },

  section: { paddingHorizontal: S.md, paddingTop: S.md },
  secTitle: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },

  moodRow: { flexDirection: 'row', gap: 6 },
  moodBtn: {
    flex: 1, backgroundColor: C.s2, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center',
  },
  moodBtnOn: { borderColor: C.green, backgroundColor: 'rgba(0,255,136,0.08)' },
  moodEmoji: { fontSize: 20 },
  moodLabel: { fontFamily: F.mono, fontSize: 7, color: C.muted, marginTop: 5, letterSpacing: 0.3 },

  habit: {
    backgroundColor: C.s1, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 8, overflow: 'hidden',
  },
  habitDone: { backgroundColor: 'rgba(0,255,136,0.03)', borderColor: 'rgba(0,255,136,0.12)' },
  habitAccent: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: C.green, borderRadius: 2,
  },
  habitCheck: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: C.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  habitCheckDone: { backgroundColor: C.green, borderColor: C.green },
  checkMark: { color: '#000', fontFamily: F.bodyB, fontSize: 12 },
  habitName: { fontSize: 14, fontFamily: F.bodyM, color: C.text, marginBottom: 2 },
  habitNameDone: { color: C.muted, textDecorationLine: 'line-through' },
  habitStreak: { fontFamily: F.mono, fontSize: 10, color: C.muted },
  habitPts: { fontFamily: F.title, fontSize: 20, color: C.green },

  addBtn: {
    borderWidth: 1, borderColor: C.muted, borderStyle: 'dashed', borderRadius: 14,
    padding: 14, alignItems: 'center', marginTop: 4,
  },
  addBtnText: { fontFamily: F.body, fontSize: 13, color: C.muted },
});
