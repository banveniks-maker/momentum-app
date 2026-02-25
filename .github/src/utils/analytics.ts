/**
 * Analytics — lightweight event tracker
 * 
 * In production: replace sendEvent() with your analytics provider:
 * - Firebase Analytics (free, Google): https://docs.expo.dev/guides/using-firebase/
 * - Amplitude: npm install @amplitude/analytics-react-native
 * - Mixpanel: npm install mixpanel-react-native
 * - PostHog (open source): npm install posthog-react-native
 * 
 * For now: logs to console in dev, silent in prod.
 */

import { Platform } from 'react-native';

type EventName =
  // Onboarding
  | 'onboarding_start'
  | 'onboarding_complete'
  | 'name_set'
  // Core actions
  | 'habit_complete'
  | 'habit_undo'
  | 'habit_add'
  | 'habit_delete'
  | 'mood_set'
  // Navigation
  | 'tab_today'
  | 'tab_global'
  | 'tab_social'
  | 'tab_ai'
  | 'tab_profile'
  // AI Coach
  | 'ai_message_sent'
  | 'ai_quick_prompt'
  | 'ai_error'
  // Social
  | 'challenge_join'
  | 'challenge_leave'
  | 'invite_code_copied'
  // Settings
  | 'lang_change'
  | 'notifications_enable'
  | 'notifications_disable'
  // Retention
  | 'streak_milestone'   // 7, 14, 30, 100 days
  | 'score_milestone'    // first 100, first 80+
  | 'app_open'
  | 'session_end';

type EventProps = Record<string, string | number | boolean>;

class Analytics {
  private sessionStart = Date.now();
  private eventQueue: { name: EventName; props: EventProps; ts: number }[] = [];
  private enabled = true;

  track(name: EventName, props: EventProps = {}) {
    if (!this.enabled) return;

    const event = {
      name,
      props: {
        ...props,
        platform: Platform.OS,
        ts: Date.now(),
      },
      ts: Date.now(),
    };

    this.eventQueue.push(event);

    if (__DEV__) {
      console.log(`📊 [Analytics] ${name}`, props);
    }

    // In production: flush to your analytics backend
    // this.flush();
  }

  // Common tracking helpers
  habitComplete(habitName: string, pts: number, streak: number) {
    this.track('habit_complete', { habitName, pts, streak });
    if (streak === 7 || streak === 14 || streak === 30 || streak === 100) {
      this.track('streak_milestone', { habitName, streak });
    }
  }

  aiMessage(isQuickPrompt: boolean) {
    this.track(isQuickPrompt ? 'ai_quick_prompt' : 'ai_message_sent');
  }

  langChange(from: string, to: string) {
    this.track('lang_change', { from, to });
  }

  appOpen() {
    this.sessionStart = Date.now();
    this.track('app_open');
  }

  sessionEnd() {
    const duration = Math.round((Date.now() - this.sessionStart) / 1000);
    this.track('session_end', { duration_seconds: duration });
  }

  // Opt out (GDPR compliance)
  disable() {
    this.enabled = false;
    this.eventQueue = [];
  }

  enable() {
    this.enabled = true;
  }

  // For debugging
  getQueue() {
    return [...this.eventQueue];
  }
}

export const analytics = new Analytics();
