import { StyleSheet } from 'react-native';

export const C = {
  bg:      '#0a0a0f',
  s1:      '#13131c',
  s2:      '#1c1c2e',
  s3:      '#252540',
  green:   '#00ff88',
  red:     '#ff3366',
  gold:    '#ffcc00',
  blue:    '#00ccff',
  text:    '#e8e8f0',
  muted:   '#5a5a7a',
  border:  'rgba(255,255,255,0.07)',
  greenBg: 'rgba(0,255,136,0.08)',
  redBg:   'rgba(255,51,102,0.08)',
};

export const F = {
  title:  'BebasNeue_400Regular',
  mono:   'SpaceMono_400Regular',
  body:   'DMSans_400Regular',
  bodyM:  'DMSans_500Medium',
  bodyB:  'DMSans_700Bold',
};

export const S = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  r:  16,
  rLg: 24,
};

export const cardStyle = {
  backgroundColor: C.s1,
  borderRadius: S.r,
  borderWidth: 1,
  borderColor: C.border,
  padding: S.md,
  marginHorizontal: S.md,
  marginTop: S.md,
};

export const sectionTitle = {
  fontFamily: F.mono,
  fontSize: 9,
  letterSpacing: 3,
  color: C.muted,
  textTransform: 'uppercase' as const,
  marginBottom: 12,
};

export const base = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  card: {
    ...cardStyle,
  },
  secTitle: {
    ...sectionTitle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
