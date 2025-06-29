import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Printer, Trash2, Star, Lock, Unlock } from 'lucide-react';
import { Letter } from '../types/Letter';

interface LetterCardProps {
  letter: Letter;
  onClick: () => void;
  onPrint: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ 
  letter, 
  onClick, 
  onPrint, 
  onDelete,
  onToggleFavorite
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [canOpen, setCanOpen] = useState(true);

  useEffect(() => {
    if (letter.scheduledFor) {
      const now = new Date();
      const scheduledDate = new Date(letter.scheduledFor);
      const locked = now < scheduledDate;
      setIsLocked(locked);
      setCanOpen(!locked);
    }
  }, [letter.scheduledFor]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCardClick = () => {
    if (isLocked) {
      // Show locked animation or message
      return;
    }
    onClick();
  };

  return (
    <motion.div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg 
                 border border-pink-100 dark:border-fuchsia-800 hover:border-pink-200 dark:hover:border-fuchsia-700 
                 transition-all duration-300 overflow-hidden cursor-pointer ${
                   isLocked ? 'opacity-75' : ''
                 }`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      layout
    >
      {/* Envelope Design */}
      <div className="relative p-6">
        {/* Envelope Top Flap */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-fuchsia-900/50 dark:to-pink-900/50 
                        transform origin-top group-hover:rotate-12 transition-transform duration-500" />
        
        {/* Seal */}
        <div className={`absolute top-4 right-6 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-md 
                        flex items-center justify-center text-2xl z-10 transition-transform duration-500 ${
                          isLocked ? 'group-hover:animate-pulse' : 'group-hover:rotate-12'
                        }`}>
          {isLocked ? '🔒' : letter.emoji}
        </div>

        {/* Lock Status */}
        {isLocked && (
          <div className="absolute top-16 right-4 bg-pink-600 dark:bg-fuchsia-600 text-white text-xs px-2 py-1 rounded-full font-mono">
            Locked
          </div>
        )}

        {/* Favorite Star */}
        {letter.isFavorite && (
          <div className="absolute top-4 left-4 text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
          </div>
        )}

        {/* Content */}
        <div className="pt-8 space-y-3">
          <h3 className="text-xl font-bold text-pink-900 dark:text-fuchsia-100 line-clamp-2 leading-tight">
            {letter.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>{letter.label}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(letter.timestamp)}</span>
            </div>
          </div>

          {letter.scheduledFor && (
            <div className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
              {isLocked ? (
                <span>🔒 Opens: {formatDate(new Date(letter.scheduledFor))}</span>
              ) : (
                <span>✨ Opened on schedule</span>
              )}
            </div>
          )}

          <p className="text-pink-700 dark:text-fuchsia-200 font-mono text-sm line-clamp-3 leading-relaxed">
            {isLocked ? 'This letter is sealed until its scheduled opening time...' : letter.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 flex space-x-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              letter.isFavorite
                ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className={`w-4 h-4 ${letter.isFavorite ? 'fill-current' : ''}`} />
          </motion.button>

          {!isLocked && (
            <>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrint();
                }}
                className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 rounded-full 
                           flex items-center justify-center text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Printer className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-8 h-8 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 rounded-full 
                           flex items-center justify-center text-red-600 dark:text-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Shadow for Envelope Effect */}
      <div className="absolute bottom-0 left-2 right-2 h-1 bg-pink-200/50 dark:bg-fuchsia-800/50 rounded-full blur-sm" />

      {/* Crack Animation for Unlocking */}
      {letter.scheduledFor && canOpen && !isLocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-4xl"
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};