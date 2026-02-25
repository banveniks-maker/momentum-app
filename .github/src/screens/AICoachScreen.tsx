import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store';
import { t } from '../utils/i18n';
import { C, F, S } from '../utils/design';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

async function callClaude(messages: Message[], systemPrompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.slice(-14), // last 14 messages for context
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? 'No response';
}

export default function AICoachScreen() {
  const store = useStore();
  const tr = t(store.lang);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const systemPrompt = `You are MOMENTUM AI Coach — an expert habit coach and behavioral psychologist. 
Always respond in the same language as the user's message (detect language automatically).

USER'S CURRENT DATA:
- Energy score: ${store.score}/100
- Habits completed today: ${store.getDoneToday().map(h => h.name).join(', ') || 'none'}
- Habits pending: ${store.getPendingToday().map(h => h.name).join(', ') || 'none'}
- Best streak: ${store.getBestStreak()} days
- Weekly completion: ${store.getCompletionRate()}%
- Total habits tracked: ${store.habits.length}

Rules:
- Respond in 2-4 sentences max
- Be specific to THEIR data — don't give generic advice
- Sound like a real coach (warm but direct)
- Use 1-2 relevant emojis
- Never say "I'm just an AI" — you ARE their coach`;

  React.useEffect(() => {
    // Init greeting
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: tr.aiGreeting }]);
    }
  }, []);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const reply = await callClaude(newMessages, systemPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: store.lang === 'ru'
          ? 'Ошибка соединения. Проверь интернет и попробуй снова. 💪'
          : 'Connection error. Check your internet and try again. 💪',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, messages, loading, systemPrompt, store.lang]);

  const score = store.score;
  const done = store.getDoneToday().length;
  const total = store.habits.length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{tr.aiCoach}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{done}/{total}</Text>
            <Text style={styles.statLbl}>{tr.daysDone}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{store.getBestStreak()}</Text>
            <Text style={styles.statLbl}>{tr.bestStreak}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{score}%</Text>
            <Text style={styles.statLbl}>{tr.completion}</Text>
          </View>
        </View>

        {/* Chat card */}
        <View style={styles.chatCard}>
          <LinearGradient
            colors={[C.blue, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.cardAccent}
          />
          <Text style={styles.cardLabel}>{tr.aiCoach}</Text>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              style={styles.qpScroll} contentContainerStyle={{ gap: 6 }}
            >
              {tr.quickPrompts.map((p, i) => (
                <TouchableOpacity key={i} style={styles.qp} onPress={() => send(p)}>
                  <Text style={styles.qpText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.chatScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {messages.map((m, i) => (
              <View key={i} style={[styles.msgRow, m.role === 'user' && styles.msgRowUser]}>
                <View style={[styles.avatar, m.role === 'user' && styles.avatarUser]}>
                  <Text>{m.role === 'ai' || m.role === 'assistant' ? '🤖' : '😎'}</Text>
                </View>
                <View style={[styles.bubble, m.role === 'user' && styles.bubbleUser]}>
                  <Text style={[styles.bubbleText, m.role === 'user' && styles.bubbleTextUser]}>
                    {m.content}
                  </Text>
                </View>
              </View>
            ))}
            {loading && (
              <View style={styles.msgRow}>
                <View style={styles.avatar}><Text>🤖</Text></View>
                <View style={styles.bubble}>
                  <ActivityIndicator size="small" color={C.muted} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={tr.aiInputPlaceholder}
              placeholderTextColor={C.muted}
              returnKeyType="send"
              onSubmitEditing={() => send()}
              multiline={false}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.sendBtn, loading && { opacity: 0.4 }]}
              onPress={() => send()}
              disabled={loading}
            >
              <Text style={styles.sendBtnText}>{tr.sendBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingHorizontal: S.md, paddingVertical: S.md,
    borderBottomWidth: 1, borderBottomColor: C.border,
    backgroundColor: 'rgba(10,10,15,0.95)',
  },
  headerTitle: { fontFamily: F.mono, fontSize: 10, letterSpacing: 3, color: C.blue, textTransform: 'uppercase' },

  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: S.md, paddingTop: S.md },
  statCard: {
    flex: 1, backgroundColor: C.s2, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, padding: 12, alignItems: 'center',
  },
  statVal: { fontFamily: F.title, fontSize: 28, color: C.green },
  statLbl: { fontFamily: F.mono, fontSize: 8, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },

  chatCard: {
    flex: 1, backgroundColor: C.s1, borderRadius: S.r, borderWidth: 1,
    borderColor: C.border, margin: S.md, padding: S.md, overflow: 'hidden',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  cardLabel: { fontFamily: F.mono, fontSize: 9, letterSpacing: 3, color: C.blue, textTransform: 'uppercase', marginBottom: 10 },

  qpScroll: { maxHeight: 40, marginBottom: 10 },
  qp: {
    backgroundColor: C.s2, borderRadius: 20, borderWidth: 1,
    borderColor: C.border, paddingHorizontal: 12, paddingVertical: 6,
  },
  qpText: { fontFamily: F.mono, fontSize: 10, color: C.muted },

  chatScroll: { flex: 1, marginBottom: 10 },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.s2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarUser: { backgroundColor: 'rgba(255,51,102,0.2)' },
  bubble: {
    maxWidth: '78%', backgroundColor: C.s2, borderRadius: 16,
    borderTopLeftRadius: 4, padding: 10, borderWidth: 1, borderColor: C.border,
  },
  bubbleUser: {
    backgroundColor: 'rgba(0,255,136,0.1)', borderColor: 'rgba(0,255,136,0.2)',
    borderTopLeftRadius: 16, borderTopRightRadius: 4,
  },
  bubbleText: { fontSize: 13, fontFamily: F.body, color: C.text, lineHeight: 19 },
  bubbleTextUser: { textAlign: 'right' },

  inputRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  input: {
    flex: 1, backgroundColor: C.s2, borderRadius: 12, borderWidth: 1,
    borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10,
    color: C.text, fontFamily: F.body, fontSize: 13,
  },
  sendBtn: {
    backgroundColor: C.green, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center',
  },
  sendBtnText: { fontFamily: F.title, fontSize: 16, letterSpacing: 1, color: '#000' },
});
