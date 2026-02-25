/**
 * MOMENTUM Premium — In-App Purchases
 * 
 * Setup:
 * npm install expo-in-app-purchases
 * 
 * Products to create in Google Play Console:
 * - momentum_pro_monthly  ($2.99/month)  — subscription
 * - momentum_pro_yearly   ($19.99/year)  — subscription  
 * - momentum_pro_lifetime ($29.99 once)  — non-consumable
 * 
 * Premium features:
 * - Unlimited AI Coach messages (free: 10/day)
 * - Advanced analytics (weekly/monthly reports)
 * - Custom habit icons & colors
 * - Export data (CSV)
 * - Remove ads (if ads added later)
 * - Priority in global leaderboard (cosmetic crown)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PRODUCTS = {
  MONTHLY:  'momentum_pro_monthly',
  YEARLY:   'momentum_pro_yearly',
  LIFETIME: 'momentum_pro_lifetime',
} as const;

export const PRICES = {
  [PRODUCTS.MONTHLY]:  '$2.99/mo',
  [PRODUCTS.YEARLY]:   '$19.99/yr',
  [PRODUCTS.LIFETIME]: '$29.99',
} as const;

// Free tier limits
export const FREE_LIMITS = {
  AI_MESSAGES_PER_DAY: 10,
  MAX_HABITS: 8,
  HISTORY_DAYS: 7,
} as const;

interface PremiumState {
  isPro: boolean;
  proType: 'monthly' | 'yearly' | 'lifetime' | null;
  expiresAt: string | null;
  aiMessagesUsedToday: number;
  aiMessagesDate: string;

  // Actions
  setPro: (type: 'monthly' | 'yearly' | 'lifetime', expiresAt?: string) => void;
  clearPro: () => void;
  incrementAiMessages: () => void;
  canSendAiMessage: () => boolean;
  getRemainingAiMessages: () => number;
}

export const usePremium = create<PremiumState>()(
  persist(
    (set, get) => ({
      isPro: false,
      proType: null,
      expiresAt: null,
      aiMessagesUsedToday: 0,
      aiMessagesDate: '',

      setPro: (type, expiresAt) => set({ isPro: true, proType: type, expiresAt: expiresAt ?? null }),
      clearPro: () => set({ isPro: false, proType: null, expiresAt: null }),

      incrementAiMessages: () => {
        const today = new Date().toISOString().split('T')[0];
        const { aiMessagesDate, aiMessagesUsedToday } = get();
        if (aiMessagesDate !== today) {
          set({ aiMessagesUsedToday: 1, aiMessagesDate: today });
        } else {
          set({ aiMessagesUsedToday: aiMessagesUsedToday + 1 });
        }
      },

      canSendAiMessage: () => {
        const { isPro, aiMessagesUsedToday, aiMessagesDate } = get();
        if (isPro) return true;
        const today = new Date().toISOString().split('T')[0];
        if (aiMessagesDate !== today) return true;
        return aiMessagesUsedToday < FREE_LIMITS.AI_MESSAGES_PER_DAY;
      },

      getRemainingAiMessages: () => {
        const { isPro, aiMessagesUsedToday, aiMessagesDate } = get();
        if (isPro) return Infinity;
        const today = new Date().toISOString().split('T')[0];
        if (aiMessagesDate !== today) return FREE_LIMITS.AI_MESSAGES_PER_DAY;
        return Math.max(0, FREE_LIMITS.AI_MESSAGES_PER_DAY - aiMessagesUsedToday);
      },
    }),
    {
      name: 'momentum-premium',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * ACTUAL PURCHASE FLOW (uncomment when expo-in-app-purchases is installed):
 * 
 * import * as InAppPurchases from 'expo-in-app-purchases';
 * 
 * export async function initIAP() {
 *   await InAppPurchases.connectAsync();
 * }
 * 
 * export async function purchasePro(productId: string) {
 *   try {
 *     await InAppPurchases.purchaseItemAsync(productId);
 *   } catch (err) {
 *     console.error('Purchase failed:', err);
 *   }
 * }
 * 
 * export async function restorePurchases() {
 *   const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
 *   if (responseCode === InAppPurchases.IAPResponseCode.OK) {
 *     return results;
 *   }
 *   return [];
 * }
 */
