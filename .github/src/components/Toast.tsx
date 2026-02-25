import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { C, F } from '../utils/design';

export interface ToastHandle {
  show: (msg: string) => void;
}

const Toast = forwardRef<ToastHandle>((_, ref) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useImperativeHandle(ref, () => ({
    show(message: string) {
      setMsg(message);
      clearTimeout(timer.current);
      opacity.setValue(0);
      translateY.setValue(-20);
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();
      timer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start();
      }, 2200);
    },
  }));

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.text}>{msg}</Text>
    </Animated.View>
  );
});

Toast.displayName = 'Toast';
export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', top: 12, alignSelf: 'center', zIndex: 9999,
    backgroundColor: C.green, borderRadius: 100,
    paddingHorizontal: 22, paddingVertical: 10,
  },
  text: { fontFamily: F.mono, fontSize: 11, letterSpacing: 1, color: '#000', fontWeight: '700' },
});
