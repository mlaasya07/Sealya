import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Calendar, Heart, TrendingUp, AlertTriangle } from 'lucide-react';
import { Letter, EMOJI_SEALS } from '../types/Letter';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: Letter[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  letters,
}) => {
  const sealedLetters = letters.filter(letter => letter.isSealed);
  
  const getMostUsedEmoji = () => {
    const emojiCount: Record<string, number> = {};
    sealedLetters.forEach(letter => {
      emojiCount[letter.emoji] = (emojiCount[letter.emoji] || 0) + 1;
    });
    
    const mostUsed = Object.entries(emojiCount).sort((a, b) => b[1] - a[1])[0];
    return mostUsed ? { emoji: mostUsed[0], count: mostUsed[1] } : null;
  };

  const getLettersThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return sealedLetters.filter(letter => {
      const letterDate = letter.timestamp;
      return letterDate.getMonth() === currentMonth && letterDate.getFullYear() === currentYear;
    }).length;
  };

  const getFirstLetterDate = () => {
    if (sealedLetters.length === 0) return null;
    return sealedLetters.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0].timestamp;
  };

  const mostUsedEmoji = getMostUsedEmoji();
  const lettersThisMonth = getLettersThisMonth();
  const firstLetterDate = getFirstLetterDate();
  const daysSinceFirst = firstLetterDate 
    ? Math.floor((Date.now() - firstLetterDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-6 border-b border-pink-100 dark:border-fuchsia-800">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-full 
                           flex items-center justify-center text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4 pr-12">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                                rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100">Your Profile</h2>
                  <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-sm">Letter writing journey</p>
                </div>
              </div>
            </div>

            {/* Important Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 
                         border border-orange-200 dark:border-orange-700 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-orange-900 dark:text-orange-100 text-sm mb-1">
                    Important Data Warning
                  </h3>
                  <p className="text-orange-800 dark:text-orange-200 text-sm font-mono leading-relaxed">
                    ⚠️ If you delete your browsing data, your letters will be lost forever.
                  </p>
                  <p className="text-orange-700 dark:text-orange-300 text-xs font-mono mt-2">
                    Your letters are stored locally on this device only. Consider exporting them regularly as backup.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Total Letters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-pink-50 dark:bg-fuchsia-900/30 rounded-2xl p-4 text-center"
                >
                  <BookOpen className="w-6 h-6 text-pink-600 dark:text-fuchsia-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100">{sealedLetters.length}</div>
                  <div className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">Letters Sealed</div>
                </motion.div>

                {/* This Month */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-rose-50 dark:bg-pink-900/30 rounded-2xl p-4 text-center"
                >
                  <Calendar className="w-6 h-6 text-rose-600 dark:text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-rose-900 dark:text-pink-100">{lettersThisMonth}</div>
                  <div className="text-sm text-rose-600 dark:text-pink-300 font-mono">This Month</div>
                </motion.div>
              </div>

              {/* Most Used Seal */}
              {mostUsedEmoji && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                      <div className="text-sm text-blue-600 dark:text-blue-300 font-mono">Favorite Seal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl mb-1">{mostUsedEmoji.emoji}</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200 font-mono">
                        {mostUsedEmoji.count} time{mostUsedEmoji.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Journey */}
              {firstLetterDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mb-1" />
                      <div className="text-sm text-green-600 dark:text-green-300 font-mono">Journey Started</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-900 dark:text-green-100">
                        {daysSinceFirst} day{daysSinceFirst !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 font-mono">
                        {firstLetterDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Seal Distribution */}
              {sealedLetters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-pink-50 dark:bg-fuchsia-900/30 rounded-2xl p-4"
                >
                  <h3 className="text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-3">Seal Collection</h3>
                  <div className="flex justify-between">
                    {EMOJI_SEALS.map(emoji => {
                      const count = sealedLetters.filter(letter => letter.emoji === emoji).length;
                      return (
                        <div key={emoji} className="text-center">
                          <div className="text-2xl mb-1">{emoji}</div>
                          <div className="text-xs text-pink-600 dark:text-fuchsia-300 font-mono">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-pink-100 dark:border-fuchsia-800 p-6 bg-pink-50/30 dark:bg-fuchsia-900/20 text-center">
              <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                "Every letter is a piece of your soul, safely sealed in time." ✨
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};