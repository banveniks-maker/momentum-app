import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import TodayScreen from '../screens/TodayScreen';
import GlobalScreen from '../screens/GlobalScreen';
import SocialScreen from '../screens/SocialScreen';
import AICoachScreen from '../screens/AICoachScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useStore } from '../store';
import { t } from '../utils/i18n';
import { C, F } from '../utils/design';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function MainNavigator() {
  const store = useStore();
  const tr = t(store.lang);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(10,10,15,0.97)',
            borderTopColor: C.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" label={tr.today} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Global"
          component={GlobalScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🌍" label={tr.global} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="👥" label={tr.social} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="AI"
          component={AICoachScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" label={tr.ai} focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="😎" label={tr.profile} focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', gap: 2, opacity: 0.4, paddingTop: 4 },
  tabItemActive: { opacity: 1 },
  tabEmoji: { fontSize: 20 },
  tabLabel: { fontFamily: F.mono, fontSize: 7, letterSpacing: 1.5, color: C.text, textTransform: 'uppercase' },
  tabLabelActive: { color: C.green },
});
