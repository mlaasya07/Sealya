import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Star, Zap, Check, Sparkles, IndianRupee } from 'lucide-react';
import { SUBSCRIPTION_TIERS, PREMIUM_THEMES, CUSTOM_SEALS } from '../types/Premium';
import { usePremium } from '../contexts/PremiumContext';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'plans' | 'themes' | 'seals';
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'plans'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { subscription, upgradeToPremium, getUsageStats } = usePremium();
  const stats = getUsageStats();

  const handleUpgrade = (tierId: string) => {
    // In a real app, this would integrate with Stripe/Razorpay
    upgradeToPremium(tierId);
    onClose();
  };

  const tabs = [
    { id: 'plans', label: 'Premium Plans', icon: Crown },
    { id: 'themes', label: 'Premium Themes', icon: Sparkles },
    { id: 'seals', label: 'Custom Seals', icon: Star }
  ];

  const formatPrice = (price: number) => {
    if (price >= 100) {
      return `₹${price}`;
    }
    return `$${price}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full 
                           flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4 pr-12">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Sealya Premium</h2>
                  <p className="text-white/90 font-mono">Unlock the full potential of your emotional sanctuary</p>
                </div>
              </div>

              {/* Current Usage */}
              <div className="mt-6 bg-white/10 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.lettersThisMonth}</div>
                    <div className="text-sm text-white/80">
                      Letters this month ({stats.maxLetters === 'unlimited' ? '∞' : stats.maxLetters} limit)
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.scheduledLetters}</div>
                    <div className="text-sm text-white/80">
                      Scheduled letters ({stats.maxScheduled === 'unlimited' ? '∞' : stats.maxScheduled} limit)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-mono transition-colors ${
                        activeTab === tab.id
                          ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <motion.div
                      key={tier.id}
                      className={`relative rounded-2xl border-2 p-6 ${
                        tier.popular
                          ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-mono">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                        <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {formatPrice(tier.price)}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                          {tier.price === 0 ? 'Forever free' : 'per month'}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={subscription?.tier === tier.id}
                        className={`w-full py-3 rounded-lg font-mono transition-all ${
                          subscription?.tier === tier.id
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : tier.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                            : tier.price === 0
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                        }`}
                      >
                        {subscription?.tier === tier.id ? 'Current Plan' : tier.price === 0 ? 'Current Plan' : 'Upgrade Now'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'themes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PREMIUM_THEMES.map((theme) => (
                    <motion.div
                      key={theme.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div 
                        className="h-32 flex items-center justify-center text-4xl"
                        style={{ backgroundColor: theme.colors.accent }}
                      >
                        {theme.preview}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{theme.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
                          {theme.category} • {theme.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400 flex items-center">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            {theme.price}
                          </span>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-mono transition-colors">
                            Purchase
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'seals' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {CUSTOM_SEALS.map((seal) => (
                    <motion.div
                      key={seal.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl mb-2" style={{ color: seal.color }}>
                        {seal.emoji}
                      </div>
                      <h3 className="font-mono font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {seal.name}
                      </h3>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 capitalize">
                        {seal.style}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {seal.price}
                        </span>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-mono transition-colors">
                          Buy
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mb-2">
                "Unlock premium features to enhance your emotional journey" ✨
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                All purchases are one-time payments. Cancel anytime. 30-day money-back guarantee.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};