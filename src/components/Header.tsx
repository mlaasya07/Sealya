import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Settings } from 'lucide-react';
import { Letter } from '../types/Letter';

interface HeaderProps {
  letters: Letter[];
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ letters, onProfileClick, onSettingsClick }) => {
  const sealedLetters = letters.filter(letter => letter.isSealed);
  
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
        </motion.div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onSettingsClick}
            className="w-10 h-10 bg-pink-50 dark:bg-fuchsia-900/50 hover:bg-pink-100 dark:hover:bg-fuchsia-900/70 
                       rounded-full flex items-center justify-center transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Settings className="w-4 h-4 text-pink-600 dark:text-fuchsia-400" />
          </motion.button>

          <motion.button
            onClick={onProfileClick}
            className="flex items-center space-x-3 bg-pink-50 dark:bg-fuchsia-900/50 hover:bg-pink-100 dark:hover:bg-fuchsia-900/70 
                       px-4 py-2 rounded-full transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-2 text-sm text-pink-700 dark:text-fuchsia-300">
              <BookOpen className="w-4 h-4" />
              <span className="font-mono">{sealedLetters.length} sealed</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                            rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};