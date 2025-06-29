import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Crown, LogIn } from 'lucide-react';
import { Letter } from '../types/Letter';
import { usePremium } from '../contexts/PremiumContext';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  letters: Letter[];
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onPremiumClick: () => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  letters, 
  onProfileClick, 
  onSettingsClick,
  onPremiumClick,
  onLoginClick
}) => {
  const sealedLetters = letters.filter(letter => letter.isSealed);
  const { subscription, getUsageStats } = usePremium();
  const { isLoggedIn, user } = useAuth();
  const stats = getUsageStats();
  const isPremium = subscription?.tier !== 'free';
  
  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-pink-100 dark:border-fuchsia-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-2xl">✉️</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent">
            Sealya
          </h1>
          {isPremium && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-mono">
              <Crown className="w-3 h-3" />
              <span>{subscription?.tier.toUpperCase()}</span>
            </div>
          )}
        </motion.div>

        <div className="flex items-center space-x-3">
          {!isLoggedIn ? (
            <motion.button
              onClick={onLoginClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 
                         text-white px-4 py-2 rounded-full font-mono text-sm shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </motion.button>
          ) : (
            <>
              {/* Premium Button for non-premium users */}
              {!isPremium && (
                <motion.button
                  onClick={onPremiumClick}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                             text-white px-4 py-2 rounded-full font-mono text-sm shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </motion.button>
              )}

              {/* User Menu */}
              <UserMenu
                onProfileClick={onProfileClick}
                onSettingsClick={onSettingsClick}
                onPremiumClick={onPremiumClick}
              />

              {/* Letter Stats (visible when logged in) */}
              <motion.div
                className="hidden md:flex flex-col items-end text-xs text-pink-700 dark:text-fuchsia-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-3 h-3" />
                  <span className="font-mono">{sealedLetters.length} sealed</span>
                </div>
                <div className="text-pink-500 dark:text-fuchsia-400 font-mono">
                  {stats.lettersThisMonth}/{stats.maxLetters === 'unlimited' ? '∞' : stats.maxLetters} this month
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};