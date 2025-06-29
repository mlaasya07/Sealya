import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles } from 'lucide-react';

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
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white rounded-t-3xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full 
                           flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Crown className="w-8 h-8" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Welcome to {tier}!</h2>
                <p className="text-white/90 font-mono text-sm">Your upgrade was successful</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                  You now have access to all the premium features of Sealya {tier}. 
                  Start exploring your enhanced emotional sanctuary!
                </p>
              </div>

              {/* Unlocked Features */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                              rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  Unlocked Features
                </h3>
                <ul className="space-y-2">
                  {unlockedFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 
                           hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-mono 
                           shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Writing Premium Letters
              </motion.button>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 text-center rounded-b-3xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                "Your premium emotional sanctuary awaits" 💌
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};