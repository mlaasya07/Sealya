import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { EMOJI_SEALS, EmojiSeal } from '../types/Letter';

interface LetterWriterProps {
  isOpen: boolean;
  onClose: () => void;
  onSeal: (title: string, label: string, content: string, emoji: EmojiSeal) => void;
}

export const LetterWriter: React.FC<LetterWriterProps> = ({
  isOpen,
  onClose,
  onSeal,
}) => {
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiSeal>('❤️');
  const [isSealing, setIsSealing] = useState(false);

  const handleSeal = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSealing(true);
    
    // Simulate sealing animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSeal(title.trim(), label.trim() || 'Untitled', content.trim(), selectedEmoji);
    
    // Reset form
    setTitle('');
    setLabel('');
    setContent('');
    setSelectedEmoji('❤️');
    setIsSealing(false);
  };

  const isValid = title.trim() && content.trim();

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
                disabled={isSealing}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-12">
                <h2 className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100 mb-2">
                  Write Your Letter
                </h2>
                <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-sm">
                  Pour your heart onto paper. Choose a seal to make it yours forever.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-96">
              {/* Title */}
              <div>
                <label className="block text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What would you call this letter?"
                  className="w-full px-4 py-3 border border-pink-200 dark:border-fuchsia-700 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono placeholder-pink-400 dark:placeholder-fuchsia-400
                             bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
                  disabled={isSealing}
                  maxLength={100}
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="To Myself, Goodbye, Love Letter..."
                  className="w-full px-4 py-3 border border-pink-200 dark:border-fuchsia-700 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono placeholder-pink-400 dark:placeholder-fuchsia-400
                             bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
                  disabled={isSealing}
                  maxLength={50}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-2">
                  Your Letter *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear...&#10;&#10;Write from your heart. This is your safe space."
                  className="w-full px-4 py-3 border border-pink-200 dark:border-fuchsia-700 rounded-lg focus:outline-none 
                             focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono placeholder-pink-400 dark:placeholder-fuchsia-400 
                             resize-none h-40 leading-relaxed bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
                  disabled={isSealing}
                />
              </div>

              {/* Emoji Seal Selection */}
              <div>
                <label className="block text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-3">
                  Choose Your Seal
                </label>
                <div className="flex space-x-3">
                  {EMOJI_SEALS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center 
                                  text-2xl transition-all ${
                        selectedEmoji === emoji
                          ? 'border-pink-500 dark:border-fuchsia-500 bg-pink-50 dark:bg-fuchsia-900/50 scale-110'
                          : 'border-pink-200 dark:border-fuchsia-700 hover:border-pink-300 dark:hover:border-fuchsia-600 hover:bg-pink-50 dark:hover:bg-fuchsia-900/30'
                      }`}
                      whileHover={{ scale: selectedEmoji === emoji ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSealing}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-pink-100 dark:border-fuchsia-800 p-6 bg-pink-50/30 dark:bg-fuchsia-900/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                  {isValid ? `Ready to seal with ${selectedEmoji}` : 'Please fill in title and content'}
                </p>
                
                <AnimatePresence mode="wait">
                  {isSealing ? (
                    <motion.div
                      key="sealing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2 text-pink-600 dark:text-fuchsia-400"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      <span className="font-mono">Sealing your letter...</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="seal-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleSeal}
                      disabled={!isValid}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-mono 
                                  transition-all ${
                        isValid
                          ? 'bg-pink-600 dark:bg-fuchsia-600 hover:bg-pink-700 dark:hover:bg-fuchsia-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-pink-200 dark:bg-fuchsia-800 text-pink-400 dark:text-fuchsia-400 cursor-not-allowed'
                      }`}
                      whileHover={isValid ? { scale: 1.02 } : {}}
                      whileTap={isValid ? { scale: 0.98 } : {}}
                    >
                      <span className="text-xl">{selectedEmoji}</span>
                      <span>Seal Letter</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};