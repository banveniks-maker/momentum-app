import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { t } from '../utils/i18n';
import { C, F, S } from '../utils/design';
import Toast from '../components/Toast';

const CHALLENGES = [
  { id:'1', icon:'🌅', title:'Morning Warriors', desc:'Wake up before 7am for 7 days',   pct:68, count:2847  },
  { id:'2', icon:'💧', title:'Hydration Nation',  desc:'Drink 2L water daily for 30 days', pct:34, count:8421  },
  { id:'3', icon:'📚', title:'Book a Week',        desc:'Read 30 min every day this week',  pct:52, count:1204  },
  { id:'4', icon:'🏃', title:'5K Every Day',       desc:'Walk or run 5000 steps minimum',   pct:81, count:15600 },
];

const INVITE_CODE = 'MOM-7X9K';

export default function SocialScreen() {
  const store = useStore();
  const tr = t(store.lang);
  const toastRef = React.useRef<any>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set(['1','3']));

  const toggleChallenge = (id: string) => {
    const next = new Set(joined);
    if (next.has(id)) { next.delete(id); toastRef.current?.show(tr.toastLeft); }
    else { next.add(id); toastRef.current?.show(tr.toastJoined); }
    setJoined(next);
  };

  const copyCode = async () => {
    try {
      await Clipboard.setStringAsync(INVITE_CODE);
      toastRef.current?.show(tr.toastCopied);
    } catch {
      await Share.share({ message: `Join me on MOMENTUM! Code: ${INVITE_CODE}` });
    }
  };

  const myScore = store.score;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Toast ref={toastRef} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tr.social}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Challenges */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.challenges}</Text>
          {CHALLENGES.map(ch => {
            const isJoined = joined.has(ch.id);
            const isHot = ch.pct > 70;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.challengeCard, isJoined && styles.challengeCardJoined]}
                onPress={() => toggleChallenge(ch.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chHeader}>
                  <Text style={styles.chIcon}>{ch.icon}</Text>
                  <Text style={styles.chTitle}>{ch.title}</Text>
                  <View style={[styles.chBadge, isHot && !isJoined && styles.chBadgeHot]}>
                    <Text style={[styles.chBadgeText, isHot && !isJoined && { color: C.red }]}>
                      {isJoined ? tr.joined : isHot ? '🔥HOT' : tr.joinBtn}
                    </Text>
                  </View>
                </View>
                <Text style={styles.chDesc}>{ch.desc}</Text>
                <View style={styles.chProgressRow}>
                  <View style={styles.chTrack}>
                    <View style={[styles.chFill, { width: `${ch.pct}%` as any }]} />
                  </View>
                  <Text style={styles.chPct}>{ch.pct}%</Text>
                </View>
                <View style={styles.chBottom}>
                  {['😊','🔥','💪','⚡','🎯'].slice(0, Math.min(5, Math.ceil(ch.count/3000))).map((e,i) => (
                    <View key={i} style={[styles.miniAvatar, i > 0 && { marginLeft: -6 }]}>
                      <Text style={{ fontSize: 10 }}>{e}</Text>
                    </View>
                  ))}
                  <Text style={styles.chCount}>{ch.count.toLocaleString()} players</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Friends */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.friends}</Text>
          {store.friends.map(f => {
            const diff = myScore - f.score;
            return (
              <View key={f.id} style={styles.friendRow}>
                <View style={styles.friendAvatar}>
                  <Text style={{ fontSize: 18 }}>{f.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{f.name}</Text>
                  <Text style={styles.friendStreak}>🔥 {f.streak} day streak</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.friendScore}>{f.score}</Text>
                  <Text style={[styles.vsText, { color: diff >= 0 ? C.green : C.red }]}>
                    {tr.vsYou(diff)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Invite */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.inviteFriend}</Text>
          <TouchableOpacity style={styles.inviteBox} onPress={copyCode} activeOpacity={0.8}>
            <Text style={styles.inviteCode}>{INVITE_CODE}</Text>
            <Text style={styles.inviteLabel}>{tr.tapToCopy}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingHorizontal: S.md, paddingVertical: S.md,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontFamily: F.mono, fontSize: 10, letterSpacing: 3, color: C.green, textTransform: 'uppercase' },
  section: { paddingHorizontal: S.md, paddingTop: S.md },
  secTitle: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },

  challengeCard: {
    backgroundColor: C.s2, borderRadius: 14, borderWidth: 1,
    borderColor: C.border, padding: S.md, marginBottom: 8,
  },
  challengeCardJoined: { borderColor: 'rgba(0,255,136,0.35)', backgroundColor: 'rgba(0,255,136,0.03)' },
  chHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  chIcon: { fontSize: 22 },
  chTitle: { flex: 1, fontSize: 15, fontFamily: F.bodyM, color: C.text },
  chBadge: { backgroundColor: 'rgba(0,255,136,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  chBadgeHot: { backgroundColor: 'rgba(255,51,102,0.15)' },
  chBadgeText: { fontFamily: F.mono, fontSize: 9, letterSpacing: 1, color: C.green },
  chDesc: { fontSize: 12, fontFamily: F.body, color: C.muted, marginBottom: 10 },
  chProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chTrack: { flex: 1, height: 4, backgroundColor: C.s3, borderRadius: 2, overflow: 'hidden' },
  chFill: { height: '100%', backgroundColor: C.green, borderRadius: 2 },
  chPct: { fontFamily: F.mono, fontSize: 10, color: C.muted },
  chBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  miniAvatar: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: C.s3,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.s2,
  },
  chCount: { fontSize: 12, fontFamily: F.body, color: C.muted, marginLeft: 8 },

  friendRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.s2, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, padding: 12, marginBottom: 6,
  },
  friendAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.s3,
    alignItems: 'center', justifyContent: 'center',
  },
  friendName: { fontSize: 14, fontFamily: F.bodyM, color: C.text },
  friendStreak: { fontFamily: F.mono, fontSize: 10, color: C.muted },
  friendScore: { fontFamily: F.title, fontSize: 22, color: C.green },
  vsText: { fontSize: 10, fontFamily: F.mono, textAlign: 'right' },

  inviteBox: {
    backgroundColor: C.s2, borderRadius: 14, borderWidth: 1,
    borderColor: C.muted, borderStyle: 'dashed', padding: 20, alignItems: 'center',
  },
  inviteCode: {
    fontFamily: F.title, fontSize: 32, letterSpacing: 6, color: C.green,
    textShadowColor: 'rgba(0,255,136,0.3)', textShadowOffset: {width:0,height:0}, textShadowRadius: 12,
  },
  inviteLabel: { fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.muted, marginTop: 6 },
});
