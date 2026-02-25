import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type Lang = 'en' | 'ru' | 'zh' | 'es' | 'fr' | 'hi';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  pts: number;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ISO date strings
  createdAt: string;
}

export interface DayLog {
  date: string;
  score: number;
  mood: number | null; // -15 to +20
  habitsDone: string[]; // habit ids
}

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  score: number;
  streak: number;
}

interface AppState {
  // Settings
  lang: Lang;
  userName: string;
  userEmoji: string;
  notificationsEnabled: boolean;
  reminderTime: string; // "HH:mm"
  onboardingDone: boolean;

  // Data
  habits: Habit[];
  logs: DayLog[];
  score: number; // today's energy score
  moodToday: number | null;
  friends: Friend[];

  // Actions
  setLang: (lang: Lang) => void;
  setUserName: (name: string) => void;
  setOnboardingDone: () => void;
  addHabit: (name: string, emoji: string) => void;
  removeHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  setMood: (pts: number) => void;
  clearMood: () => void;
  resetDay: () => void;
  getStreak: (habitId: string) => number;
  getTodayLog: () => DayLog | null;
  getWeekScores: () => { day: string; score: number }[];
  getCompletionRate: () => number;
  getBestStreak: () => number;
  getDoneToday: () => Habit[];
  getPendingToday: () => Habit[];
}

const today = () => format(new Date(), 'yyyy-MM-dd');
const dayLabel = (d: Date) => format(d, 'EEE');

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Defaults ──────────────────────────────────
      lang: 'en',
      userName: 'You',
      userEmoji: '😎',
      notificationsEnabled: false,
      reminderTime: '09:00',
      onboardingDone: false,
      score: 50,
      moodToday: null,
      habits: [
        { id: '1', name: 'Morning workout', emoji: '💪', pts: 15, streak: 7, bestStreak: 14, completedDates: [], createdAt: today() },
        { id: '2', name: 'Drink water', emoji: '💧', pts: 5, streak: 14, bestStreak: 14, completedDates: [today()], createdAt: today() },
        { id: '3', name: 'Meditation', emoji: '🧘', pts: 12, streak: 3, bestStreak: 10, completedDates: [], createdAt: today() },
        { id: '4', name: 'Read 30 min', emoji: '📚', pts: 10, streak: 21, bestStreak: 21, completedDates: [], createdAt: today() },
      ],
      logs: [
        { date: format(new Date(Date.now() - 6 * 86400000), 'yyyy-MM-dd'), score: 45, mood: 10, habitsDone: ['2'] },
        { date: format(new Date(Date.now() - 5 * 86400000), 'yyyy-MM-dd'), score: 68, mood: 20, habitsDone: ['1','2'] },
        { date: format(new Date(Date.now() - 4 * 86400000), 'yyyy-MM-dd'), score: 72, mood: 10, habitsDone: ['2','3'] },
        { date: format(new Date(Date.now() - 3 * 86400000), 'yyyy-MM-dd'), score: 55, mood: -8, habitsDone: ['2'] },
        { date: format(new Date(Date.now() - 2 * 86400000), 'yyyy-MM-dd'), score: 80, mood: 20, habitsDone: ['1','2','3','4'] },
        { date: format(new Date(Date.now() - 1 * 86400000), 'yyyy-MM-dd'), score: 73, mood: 10, habitsDone: ['1','2','4'] },
      ],
      friends: [
        { id: 'f1', name: 'Mia K.', emoji: '🦊', score: 88, streak: 14 },
        { id: 'f2', name: 'David R.', emoji: '🐺', score: 71, streak: 7 },
        { id: 'f3', name: 'Sara T.', emoji: '🦁', score: 65, streak: 3 },
      ],

      // ── Actions ──────────────────────────────────
      setLang: (lang) => set({ lang }),
      setUserName: (userName) => set({ userName }),
      setOnboardingDone: () => set({ onboardingDone: true }),

      addHabit: (name, emoji) => {
        const habit: Habit = {
          id: Date.now().toString(),
          name, emoji,
          pts: 10,
          streak: 0,
          bestStreak: 0,
          completedDates: [],
          createdAt: today(),
        };
        set(s => ({ habits: [...s.habits, habit] }));
      },

      removeHabit: (id) => {
        set(s => ({ habits: s.habits.filter(h => h.id !== id) }));
      },

      toggleHabit: (id) => {
        const { habits, score } = get();
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const t = today();
        const isDone = habit.completedDates.includes(t);

        if (!isDone) {
          // Complete
          const newDates = [...habit.completedDates, t];
          const newStreak = habit.streak + 1;
          set(s => ({
            score: Math.min(100, s.score + habit.pts),
            habits: s.habits.map(h => h.id === id ? {
              ...h,
              completedDates: newDates,
              streak: newStreak,
              bestStreak: Math.max(h.bestStreak, newStreak),
            } : h),
          }));
        } else {
          // Undo
          const newDates = habit.completedDates.filter(d => d !== t);
          set(s => ({
            score: Math.max(0, s.score - habit.pts),
            habits: s.habits.map(h => h.id === id ? {
              ...h,
              completedDates: newDates,
              streak: Math.max(0, h.streak - 1),
            } : h),
          }));
        }
      },

      setMood: (pts) => {
        const { moodToday, score } = get();
        // Undo previous mood
        const base = moodToday !== null ? Math.max(0, Math.min(100, score - moodToday)) : score;
        set({ moodToday: pts, score: Math.max(0, Math.min(100, base + pts)) });
      },

      clearMood: () => {
        const { moodToday, score } = get();
        if (moodToday !== null) {
          set({ moodToday: null, score: Math.max(0, score - moodToday) });
        }
      },

      resetDay: () => {
        // Called at midnight — save today's log, reset habits completion
        const { score, moodToday, habits } = get();
        const t = today();
        const log: DayLog = {
          date: t,
          score,
          mood: moodToday,
          habitsDone: habits.filter(h => h.completedDates.includes(t)).map(h => h.id),
        };
        set(s => ({
          logs: [...s.logs.slice(-30), log], // keep 30 days
          score: 50,
          moodToday: null,
        }));
      },

      getStreak: (habitId) => {
        const h = get().habits.find(h => h.id === habitId);
        return h?.streak ?? 0;
      },

      getTodayLog: () => {
        const t = today();
        return get().logs.find(l => l.date === t) ?? null;
      },

      getWeekScores: () => {
        const { logs, score } = get();
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(Date.now() - (6 - i) * 86400000);
          const dateStr = format(d, 'yyyy-MM-dd');
          const isToday = dateStr === today();
          const log = logs.find(l => l.date === dateStr);
          return {
            day: dayLabel(d),
            score: isToday ? score : (log?.score ?? 0),
            isToday,
          };
        });
      },

      getCompletionRate: () => {
        const { habits } = get();
        if (!habits.length) return 0;
        const done = habits.filter(h => h.completedDates.includes(today())).length;
        return Math.round((done / habits.length) * 100);
      },

      getBestStreak: () => {
        const { habits } = get();
        return habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
      },

      getDoneToday: () => {
        const t = today();
        return get().habits.filter(h => h.completedDates.includes(t));
      },

      getPendingToday: () => {
        const t = today();
        return get().habits.filter(h => !h.completedDates.includes(t));
      },
    }),
    {
      name: 'momentum-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
