import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Printer } from 'lucide-react';
import { Letter } from '../types/Letter';

interface LetterModalProps {
  letter: Letter | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  letter,
  isOpen,
  onClose,
  onPrint,
}) => {
  if (!letter) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
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

              <div className="flex items-start justify-between pr-12">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center 
                                    justify-center text-2xl">
                      {letter.emoji}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100 leading-tight">
                        {letter.title}
                      </h2>
                    </div>
                  </div>

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
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="prose prose-pink dark:prose-invert max-w-none">
                <p className="text-pink-800 dark:text-fuchsia-200 font-mono leading-relaxed whitespace-pre-wrap text-base">
                  {letter.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-pink-100 dark:border-fuchsia-800 p-6 bg-pink-50/30 dark:bg-fuchsia-900/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                  Sealed with {letter.emoji}
                </p>
                <button
                  onClick={onPrint}
                  className="flex items-center space-x-2 bg-pink-600 dark:bg-fuchsia-600 hover:bg-pink-700 dark:hover:bg-fuchsia-700 
                             text-white px-4 py-2 rounded-lg transition-colors font-mono"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};