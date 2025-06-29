import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubscription, SubscriptionTier, SUBSCRIPTION_TIERS } from '../types/Premium';

interface UpgradeResult {
  success: boolean;
  tier: string;
  unlockedFeatures: string[];
  message: string;
}

interface PremiumContextType {
  subscription: UserSubscription | null;
  hasFeature: (feature: string) => boolean;
  canCreateLetter: () => boolean;
  canScheduleLetter: () => boolean;
  canUseTheme: (themeId: string) => boolean;
  canUseCustomSeal: (sealId: string) => boolean;
  canAttachMedia: () => boolean;
  canPasswordProtect: () => boolean;
  canBulkExport: () => boolean;
  hasAdvancedAnalytics: () => boolean;
  hasPrioritySupport: () => boolean;
  hasEarlyAccess: () => boolean;
  removeBranding: () => boolean;
  getUsageStats: () => {
    lettersThisMonth: number;
    scheduledLetters: number;
    maxLetters: number | 'unlimited';
    maxScheduled: number | 'unlimited';
  };
  upgradeToPremium: (tierId: string) => Promise<UpgradeResult>;
  getAccountHistory: () => any[];
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

  // Plus and Pro specific features
  const canAttachMedia = (): boolean => {
    return subscription?.tier === 'pro';
  };

  const canPasswordProtect = (): boolean => {
    return subscription?.tier === 'pro';
  };

  const canBulkExport = (): boolean => {
    return subscription?.tier === 'pro';
  };

  const hasAdvancedAnalytics = (): boolean => {
    return subscription?.tier === 'pro';
  };

  const hasPrioritySupport = (): boolean => {
    return subscription?.tier === 'plus' || subscription?.tier === 'pro';
  };

  const hasEarlyAccess = (): boolean => {
    return subscription?.tier === 'plus' || subscription?.tier === 'pro';
  };

  const removeBranding = (): boolean => {
    return subscription?.tier === 'plus' || subscription?.tier === 'pro';
  };

  const logUpgradeEvent = (tierId: string, features: string[]) => {
    const history = getAccountHistory();
    const newEvent = {
      id: crypto.randomUUID(),
      type: 'upgrade',
      tier: tierId,
      features,
      timestamp: new Date().toISOString(),
      description: `Upgraded to ${tierId.charAt(0).toUpperCase() + tierId.slice(1)} plan`
    };
    
    const updatedHistory = [newEvent, ...history];
    localStorage.setItem('sealya-account-history', JSON.stringify(updatedHistory));
  };

  const getAccountHistory = () => {
    const saved = localStorage.getItem('sealya-account-history');
    return saved ? JSON.parse(saved) : [];
  };

  const upgradeToPremium = async (tierId: string): Promise<UpgradeResult> => {
    const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
    if (!tier) {
      return {
        success: false,
        tier: tierId,
        unlockedFeatures: [],
        message: 'Invalid subscription tier'
      };
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSubscription: UserSubscription = {
        tier: tierId,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        features: tier.features
      };

      // Update subscription immediately
      setSubscription(newSubscription);
      localStorage.setItem('sealya-subscription', JSON.stringify(newSubscription));

      // Log the upgrade event
      logUpgradeEvent(tierId, tier.features);

      // Update usage stats to reflect new limits immediately
      const currentStats = getUsageStats();
      localStorage.setItem('sealya-usage-stats', JSON.stringify({
        ...currentStats,
        tier: tierId,
        upgradeDate: new Date().toISOString()
      }));

      return {
        success: true,
        tier: tierId,
        unlockedFeatures: tier.features,
        message: `Successfully upgraded to ${tier.name}! All features are now active.`
      };
    } catch (error) {
      return {
        success: false,
        tier: tierId,
        unlockedFeatures: [],
        message: 'Payment processing failed. Please try again.'
      };
    }
  };

  return (
    <PremiumContext.Provider value={{
      subscription,
      hasFeature,
      canCreateLetter,
      canScheduleLetter,
      canUseTheme,
      canUseCustomSeal,
      canAttachMedia,
      canPasswordProtect,
      canBulkExport,
      hasAdvancedAnalytics,
      hasPrioritySupport,
      hasEarlyAccess,
      removeBranding,
      getUsageStats,
      upgradeToPremium,
      getAccountHistory,
    }}>
      {children}
    </PremiumContext.Provider>
  );
};