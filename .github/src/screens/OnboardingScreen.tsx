import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { C, F, S } from '../utils/design';

const { width } = Dimensions.get('window');

const EMOJIS = ['😎','🦊','🐺','🦁','🐯','🦅','🦋','🐉','⚡','🔥'];

export default function OnboardingScreen() {
  const store = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('😎');

  const finish = () => {
    store.setUserName(name.trim() || 'Champion');
    store.setOnboardingDone();
  };

  if (step === 0) {
    return (
      <View style={styles.screen}>
        <LinearGradient colors={['rgba(0,255,136,0.15)','transparent']} style={styles.topGlow} />
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: S.xl }}>
          <Text style={styles.logo}>MOMENTUM</Text>
          <Text style={styles.tagline}>Build habits.{'\n'}Track energy.{'\n'}Conquer your goals.</Text>
          <View style={styles.features}>
            {['⚡ Real-time energy score','🌍 Global country ranking','🤖 AI coach powered by Claude','👥 Compete with friends'].map((f,i) => (
              <Text key={i} style={styles.feature}>{f}</Text>
            ))}
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => setStep(1)}>
            <Text style={styles.btnText}>LET'S GO →</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: S.xl }}>
        <Text style={styles.logo}>MOMENTUM</Text>
        <Text style={styles.question}>What's your name?</Text>

        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name..."
          placeholderTextColor={C.muted}
          autoFocus
          maxLength={24}
          returnKeyType="done"
        />

        <Text style={[styles.question, { marginTop: 24 }]}>Pick your avatar</Text>
        <View style={styles.emojiGrid}>
          {EMOJIS.map(e => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiOpt, e === emoji && styles.emojiOptSel]}
              onPress={() => setEmoji(e)}
            >
              <Text style={styles.emojiChar}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={finish}>
          <Text style={styles.btnText}>START →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  topGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  logo: {
    fontFamily: F.title, fontSize: 48, letterSpacing: 4, color: C.green,
    textShadowColor: 'rgba(0,255,136,0.4)', textShadowOffset: {width:0,height:0}, textShadowRadius: 30,
    marginBottom: 16,
  },
  tagline: {
    fontFamily: F.title, fontSize: 32, letterSpacing: 1, color: C.text,
    lineHeight: 38, marginBottom: 32,
  },
  features: { gap: 12, marginBottom: 40, alignSelf: 'flex-start' },
  feature: { fontFamily: F.body, fontSize: 16, color: C.muted },
  btn: {
    backgroundColor: C.green, borderRadius: 16, padding: 18,
    alignItems: 'center', width: '100%',
  },
  btnText: { fontFamily: F.title, fontSize: 22, letterSpacing: 2, color: '#000' },
  question: { fontFamily: F.title, fontSize: 28, color: C.text, letterSpacing: 1, marginBottom: 16 },
  nameInput: {
    backgroundColor: C.s2, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: 16, color: C.text, fontFamily: F.bodyM, fontSize: 18,
  },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  emojiOpt: {
    width: 52, height: 52, backgroundColor: C.s2, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },
  emojiOptSel: { borderColor: C.green, backgroundColor: 'rgba(0,255,136,0.1)' },
  emojiChar: { fontSize: 26 },
});
