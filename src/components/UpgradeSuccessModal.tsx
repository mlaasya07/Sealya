import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Zap } from 'lucide-react';

interface UpgradeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: string;
  unlockedFeatures: string[];
}

export const UpgradeSuccessModal: React.FC<UpgradeSuccessModalProps> = ({
  isOpen,
  onClose,
  tier,
  unlockedFeatures
}) => {
  const getTierInfo = () => {
    switch (tier) {
      case 'plus':
        return {
          name: 'Plus',
          color: 'from-purple-600 to-pink-600',
          icon: '💎',
          price: '$2.49/month'
        };
      case 'pro':
        return {
          name: 'Pro',
          color: 'from-yellow-500 to-orange-600',
          icon: '👑',
          price: '$5.99/month'
        };
      default:
        return {
          name: 'Premium',
          color: 'from-purple-600 to-pink-600',
          icon: '✨',
          price: ''
        };
    }
  };

  const tierInfo = getTierInfo();

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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`relative bg-gradient-to-r ${tierInfo.color} p-8 text-white text-center`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full 
                           flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                {tierInfo.icon}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
              >
                Welcome to {tierInfo.name}!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 font-mono"
              >
                Your upgrade is complete and all features are now active
              </motion.p>

              {tierInfo.price && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 bg-white/20 rounded-full px-4 py-2 inline-block"
                >
                  <span className="font-mono text-sm">{tierInfo.price}</span>
                </motion.div>
              )}
            </div>

            {/* Features List */}
            <div className="p-6">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center"
              >
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                Unlocked Features
              </motion.h3>

              <div className="space-y-3 mb-6">
                {unlockedFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Immediate Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                           rounded-2xl p-4 mb-6"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-gray-900 dark:text-white">Immediate Benefits</span>
                </div>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Dashboard updated with new limits and features</li>
                  <li>• All premium themes and seals now available</li>
                  <li>• Enhanced letter creation experience</li>
                  {tier === 'pro' && <li>• Advanced features like media attachments enabled</li>}
                </ul>
              </motion.div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={onClose}
                className={`w-full py-4 rounded-2xl font-mono font-semibold text-white shadow-lg hover:shadow-xl 
                           transition-all bg-gradient-to-r ${tierInfo.color} hover:scale-105`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Creating Premium Letters
              </motion.button>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                Need help? Contact our priority support team anytime! 💌
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};