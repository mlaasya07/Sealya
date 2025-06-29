import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, AlertCircle, Zap } from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  limitType: 'letters' | 'scheduled';
}

export const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  limitType
}) => {
  const { getUsageStats } = usePremium();
  const stats = getUsageStats();

  const getMessage = () => {
    if (limitType === 'letters') {
      return {
        title: 'Monthly Letter Limit Reached',
        description: `You've written ${stats.lettersThisMonth} letters this month (limit: ${stats.maxLetters}).`,
        suggestion: 'Upgrade to Plus or Pro to write more letters and unlock premium features.'
      };
    } else {
      return {
        title: 'Scheduled Letter Limit Reached',
        description: `You have ${stats.scheduledLetters} scheduled letters (limit: ${stats.maxScheduled}).`,
        suggestion: 'Upgrade to schedule more letters for the future and never miss an important moment.'
      };
    }
  };

  const message = getMessage();

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
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white rounded-t-3xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full 
                           flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4 pr-12">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{message.title}</h2>
                  <p className="text-white/90 font-mono text-sm">Upgrade to continue</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-700 dark:text-gray-300 font-mono leading-relaxed mb-4">
                  {message.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                  {message.suggestion}
                </p>
              </div>

              {/* Quick Benefits */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                              rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  Premium Benefits
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono">
                      {limitType === 'letters' ? 'Up to 50 letters/month (Plus) or unlimited (Pro)' : 'Up to 10 scheduled letters (Plus) or unlimited (Pro)'}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono">Premium themes & custom seals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300 font-mono">Advanced export options</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                             text-gray-700 dark:text-gray-300 font-mono hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    onUpgrade();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 
                             hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-mono 
                             shadow-lg hover:shadow-xl transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};