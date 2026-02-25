import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, S } from '../utils/design';
import { t } from '../utils/i18n';
import type { Lang } from '../store';

const EMOJIS = ['💪','🏃','💧','🧘','📚','🥗','😴','📝','🎯','🔥','⭐','🎵','🎮','✍️','🚴','🌅','🧠','🎨','🏊','🌿'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string) => void;
  lang: Lang;
}

export default function AddHabitModal({ visible, onClose, onAdd, lang }: Props) {
  const tr = t(lang);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⭐');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), emoji);
    setName('');
    setEmoji('⭐');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ justifyContent: 'flex-end' }}
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{tr.newHabit}</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={tr.habitPlaceholder}
            placeholderTextColor={C.muted}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            autoFocus
            maxLength={40}
          />

          <FlatList
            data={EMOJIS}
            numColumns={10}
            keyExtractor={item => item}
            scrollEnabled={false}
            style={{ marginBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.emojiBtn, item === emoji && styles.emojiBtnSel]}
                onPress={() => setEmoji(item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>{tr.addHabitBtn}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)' },
  sheet: {
    backgroundColor: C.s1, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1, borderColor: C.border, padding: 24,
  },
  handle: { width: 32, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontFamily: F.title, fontSize: 26, letterSpacing: 2, color: C.green, marginBottom: 16 },
  input: {
    backgroundColor: C.s2, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    padding: 12, color: C.text, fontFamily: F.body, fontSize: 14, marginBottom: 12,
  },
  emojiBtn: {
    flex: 1, aspectRatio: 1, backgroundColor: C.s2, borderRadius: 10,
    margin: 3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  emojiBtnSel: { borderColor: C.green, backgroundColor: 'rgba(0,255,136,0.1)' },
  emojiText: { fontSize: 18 },
  addBtn: {
    backgroundColor: C.green, borderRadius: 14, padding: 14, alignItems: 'center',
  },
  addBtnText: { fontFamily: F.title, fontSize: 18, letterSpacing: 2, color: '#000' },
});
