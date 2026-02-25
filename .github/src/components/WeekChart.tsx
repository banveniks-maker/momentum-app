import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from '../utils/design';

interface Props {
  scores: { day: string; score: number; isToday?: boolean }[];
}

export default function WeekChart({ scores }: Props) {
  const BAR_H = 54;
  return (
    <View style={styles.row}>
      {scores.map((s, i) => {
        const fillH = Math.max(2, (s.score / 100) * BAR_H);
        const isToday = s.isToday ?? false;
        return (
          <View key={i} style={styles.col}>
            <View style={[styles.track, { height: BAR_H }]}>
              <LinearGradient
                colors={isToday ? ['#00ff88', '#00ffcc'] : ['#00ff88', 'rgba(0,255,136,0.3)']}
                start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
                style={[
                  styles.fill,
                  { height: fillH },
                  isToday && styles.fillToday,
                ]}
              />
            </View>
            <Text style={[styles.label, isToday && styles.labelToday]}>{s.day}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'flex-end', height: 70, paddingHorizontal: 2 },
  col: { flex: 1, alignItems: 'center', gap: 5 },
  track: {
    width: '100%', backgroundColor: C.s2,
    borderRadius: 5, overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fill: { width: '100%', borderRadius: 5 },
  fillToday: {
    shadowColor: C.green, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8,
  },
  label: { fontFamily: F.mono, fontSize: 8, color: C.muted },
  labelToday: { color: C.green },
});
