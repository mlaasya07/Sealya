import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubscription, SubscriptionTier, SUBSCRIPTION_TIERS } from '../types/Premium';

interface PremiumContextType {
  subscription: UserSubscription | null;
  hasFeature: (feature: string) => boolean;
  canCreateLetter: () => boolean;
  canScheduleLetter: () => boolean;
  canUseTheme: (themeId: string) => boolean;
  canUseCustomSeal: (sealId: string) => boolean;
  getUsageStats: () => {
    lettersThisMonth: number;
    scheduledLetters: number;
    maxLetters: number | 'unlimited';
    maxScheduled: number | 'unlimited';
  };
  upgradeToPremium: (tierId: string) => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  // Load subscription from localStorage
  useEffect(() => {
    const savedSubscription = localStorage.getItem('sealya-subscription');
    if (savedSubscription) {
      const parsed = JSON.parse(savedSubscription);
      setSubscription({
        ...parsed,
        expiresAt: new Date(parsed.expiresAt)
      });
    } else {
      // Default to free tier
      setSubscription({
        tier: 'free',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        features: SUBSCRIPTION_TIERS[0].features
      });
    }
  }, []);

  const getCurrentTier = (): SubscriptionTier => {
    return SUBSCRIPTION_TIERS.find(tier => tier.id === subscription?.tier) || SUBSCRIPTION_TIERS[0];
  };

  const hasFeature = (feature: string): boolean => {
    if (!subscription) return false;
    return subscription.features.includes(feature) && subscription.status === 'active';
  };

  const getUsageStats = () => {
    const currentTier = getCurrentTier();
    const savedStats = localStorage.getItem('sealya-usage-stats');
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    let stats = {
      month: currentMonth,
      lettersThisMonth: 0,
      scheduledLetters: 0
    };

    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      if (parsed.month === currentMonth) {
        stats = parsed;
      }
    }

    return {
      lettersThisMonth: stats.lettersThisMonth,
      scheduledLetters: stats.scheduledLetters,
      maxLetters: currentTier.limits.lettersPerMonth,
      maxScheduled: currentTier.limits.scheduledLetters
    };
  };

  const canCreateLetter = (): boolean => {
    const currentTier = getCurrentTier();
    const stats = getUsageStats();
    
    if (currentTier.limits.lettersPerMonth === 'unlimited') return true;
    return stats.lettersThisMonth < (currentTier.limits.lettersPerMonth as number);
  };

  const canScheduleLetter = (): boolean => {
    const currentTier = getCurrentTier();
    const stats = getUsageStats();
    
    if (currentTier.limits.scheduledLetters === 'unlimited') return true;
    return stats.scheduledLetters < (currentTier.limits.scheduledLetters as number);
  };

  const canUseTheme = (themeId: string): boolean => {
    const currentTier = getCurrentTier();
    // Basic themes are always available
    const basicThemes = ['default', 'light', 'dark'];
    if (basicThemes.includes(themeId)) return true;
    
    return currentTier.id !== 'free';
  };

  const canUseCustomSeal = (sealId: string): boolean => {
    const currentTier = getCurrentTier();
    return currentTier.id !== 'free';
  };

  const upgradeToPremium = (tierId: string) => {
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
    if (!tier) return;

    const newSubscription: UserSubscription = {
      tier: tierId,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      features: tier.features
    };

    setSubscription(newSubscription);
    localStorage.setItem('sealya-subscription', JSON.stringify(newSubscription));
  };

  return (
    <PremiumContext.Provider value={{
      subscription,
      hasFeature,
      canCreateLetter,
      canScheduleLetter,
      canUseTheme,
      canUseCustomSeal,
      getUsageStats,
      upgradeToPremium,
    }}>
      {children}
    </PremiumContext.Provider>
  );
};