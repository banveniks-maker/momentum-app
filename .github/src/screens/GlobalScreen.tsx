import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { t } from '../utils/i18n';
import { C, F, S } from '../utils/design';

const COUNTRIES = [
  { f:'🇯🇵', n:'Japan',         avg:82, p:12840, up:true  },
  { f:'🇰🇷', n:'South Korea',   avg:80, p:9230,  up:true  },
  { f:'🇩🇪', n:'Germany',       avg:78, p:14200, up:false },
  { f:'🇸🇪', n:'Sweden',        avg:77, p:5100,  up:true  },
  { f:'🇨🇭', n:'Switzerland',   avg:76, p:3800,  up:true  },
  { f:'🇫🇮', n:'Finland',       avg:75, p:4200,  up:false },
  { f:'🇳🇱', n:'Netherlands',   avg:74, p:6700,  up:true  },
  { f:'🇺🇸', n:'United States', avg:73, p:48000, up:false },
  { f:'🇦🇺', n:'Australia',     avg:72, p:8900,  up:true  },
  { f:'🇬🇧', n:'UK',            avg:71, p:15000, up:false },
  { f:'🇫🇷', n:'France',        avg:70, p:17000, up:true  },
  { f:'🇪🇸', n:'Spain',         avg:69, p:13000, up:false },
  { f:'🇧🇷', n:'Brazil',        avg:68, p:22000, up:true  },
  { f:'🇮🇳', n:'India',         avg:67, p:51000, up:true  },
  { f:'🇨🇳', n:'China',         avg:66, p:89000, up:true  },
  { f:'🇷🇺', n:'Russia',        avg:65, p:19000, up:false },
];

const MY_COUNTRY_MAP: Record<string, string> = {
  en: 'United States', ru: 'Russia', zh: 'China',
  es: 'Spain', fr: 'France', hi: 'India',
};

export default function GlobalScreen() {
  const store = useStore();
  const tr = t(store.lang);
  const myCountryName = MY_COUNTRY_MAP[store.lang];
  const myRank = useMemo(() => COUNTRIES.findIndex(c => c.n === myCountryName) + 1, [myCountryName]);
  const myCountry = COUNTRIES.find(c => c.n === myCountryName);
  const score = store.score;

  const top3 = COUNTRIES.slice(0, 3);
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumHeights = [52, 72, 36];
  const podiumColors: [string, string][] = [
    ['rgba(170,170,170,0.3)', 'rgba(170,170,170,0.05)'],
    ['rgba(255,204,0,0.35)', 'rgba(255,204,0,0.08)'],
    ['rgba(205,127,50,0.3)', 'rgba(205,127,50,0.05)'],
  ];
  const podiumLabels = ['2nd', '1st', '3rd'];
  const podiumTextColors = ['#aaa', C.gold, '#cd7f32'];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tr.topCountries}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* My rank card */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.yourRanking}</Text>
          <LinearGradient
            colors={['rgba(0,255,136,0.1)', 'rgba(0,204,255,0.05)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.myRankCard}
          >
            <Text style={styles.myRankNum}>#{myRank}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.myRankLabel}>{tr.yourRanking}</Text>
              <Text style={styles.myRankCountry}>{myCountry?.f} {myCountryName}</Text>
              <Text style={styles.myRankSub}>
                {tr.top} {score > 80 ? '5' : score > 60 ? '12' : '30'}% • {tr.ptsWeek(Math.round(score * 11))}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Podium */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.topCountries}</Text>
          <View style={styles.podium}>
            {podiumOrder.map((c, i) => c && (
              <View key={i} style={styles.podiumCol}>
                <Text style={styles.podiumFlag}>{c.f}</Text>
                <Text style={[styles.podiumRank, { color: podiumTextColors[i] }]}>{podiumLabels[i]}</Text>
                <Text style={styles.podiumAvg}>{c.avg} avg</Text>
                <Text style={styles.podiumName} numberOfLines={1}>{c.n}</Text>
                <LinearGradient
                  colors={podiumColors[i]}
                  style={[styles.podiumBar, { height: podiumHeights[i] }]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <Text style={styles.secTitle}>{tr.leaderboard}</Text>
          {COUNTRIES.map((c, i) => {
            const isMe = c.n === myCountryName;
            return (
              <View key={i} style={[styles.rankRow, isMe && styles.rankRowMe]}>
                <Text style={styles.rankNum}>{i + 1}</Text>
                <Text style={styles.rankFlag}>{c.f}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankCountry}>{c.n}{isMe ? ` ${tr.youLabel}` : ''}</Text>
                  <Text style={styles.rankPlayers}>{tr.players(c.p)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.rankScore}>{c.avg}</Text>
                  <Text style={{ color: c.up ? C.green : C.red, fontSize: 12 }}>{c.up ? '▲' : '▼'}</Text>
                </View>
              </View>
            );
          })}
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
  headerTitle: { fontFamily: F.mono, fontSize: 10, letterSpacing: 3, color: C.gold, textTransform: 'uppercase' },
  section: { paddingHorizontal: S.md, paddingTop: S.md },
  secTitle: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },

  myRankCard: {
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,255,136,0.2)',
    padding: S.md, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4,
  },
  myRankNum: { fontFamily: F.title, fontSize: 48, color: C.green },
  myRankLabel: { fontFamily: F.mono, fontSize: 9, letterSpacing: 2, color: C.muted, marginBottom: 4 },
  myRankCountry: { fontSize: 16, fontFamily: F.bodyM, color: C.text },
  myRankSub: { fontSize: 12, fontFamily: F.body, color: C.muted },

  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginVertical: 8 },
  podiumCol: { alignItems: 'center', gap: 4 },
  podiumFlag: { fontSize: 26 },
  podiumRank: { fontFamily: F.title, fontSize: 26 },
  podiumAvg: { fontFamily: F.mono, fontSize: 9, color: C.muted },
  podiumName: { fontSize: 11, fontFamily: F.bodyM, color: C.text, textAlign: 'center', maxWidth: 72 },
  podiumBar: { width: 60, borderRadius: 8, borderWidth: 1, borderColor: 'transparent', marginTop: 4 },

  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.s2, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, padding: 12, marginBottom: 6,
  },
  rankRowMe: { borderColor: 'rgba(0,255,136,0.3)', backgroundColor: 'rgba(0,255,136,0.04)' },
  rankNum: { fontFamily: F.title, fontSize: 20, color: C.muted, width: 28 },
  rankFlag: { fontSize: 22 },
  rankCountry: { fontSize: 14, fontFamily: F.bodyM, color: C.text },
  rankPlayers: { fontFamily: F.mono, fontSize: 10, color: C.muted },
  rankScore: { fontFamily: F.title, fontSize: 22, color: C.green },
});
