import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Calendar, Volume2, VolumeX, Headphones } from 'lucide-react';
import { EMOJI_SEALS, EmojiSeal } from '../types/Letter';
import { useSoundscape } from '../contexts/SoundscapeContext';
import { SoundscapeControls } from './SoundscapeControls';
import { DatePicker } from './DatePicker';

interface LetterWriterProps {
  isOpen: boolean;
  onClose: () => void;
  onSeal: (title: string, label: string, content: string, emoji: EmojiSeal, scheduledFor?: Date) => void;
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
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSoundscape, setShowSoundscape] = useState(false);
  const { isPlaying } = useSoundscape();

  // Auto-save drafts
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (title.trim() || content.trim()) {
        const draft = {
          title: title.trim(),
          label: label.trim(),
          content: content.trim(),
          emoji: selectedEmoji,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('sealya-draft', JSON.stringify(draft));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [title, label, content, selectedEmoji, isOpen]);

  // Load draft on open
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('sealya-draft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || '');
          setLabel(draft.label || '');
          setContent(draft.content || '');
          setSelectedEmoji(draft.emoji || '❤️');
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [isOpen]);

  const handleSeal = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSealing(true);
    
    // Simulate sealing animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSeal(title.trim(), label.trim() || 'Untitled', content.trim(), selectedEmoji, scheduledFor || undefined);
    
    // Clear draft and reset form
    localStorage.removeItem('sealya-draft');
    setTitle('');
    setLabel('');
    setContent('');
    setSelectedEmoji('❤️');
    setScheduledFor(null);
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
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Soundscape Sidebar */}
            <AnimatePresence>
              {showSoundscape && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-pink-50/50 dark:bg-fuchsia-900/20 border-r border-pink-100 dark:border-fuchsia-800 overflow-hidden"
                >
                  <SoundscapeControls />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-6 border-b border-pink-100 dark:border-fuchsia-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100">
                      Write Your Letter
                    </h2>
                    
                    {/* Soundscape Toggle */}
                    <motion.button
                      onClick={() => setShowSoundscape(!showSoundscape)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        showSoundscape || isPlaying
                          ? 'bg-pink-200 dark:bg-fuchsia-700 text-pink-700 dark:text-fuchsia-200'
                          : 'bg-pink-100 dark:bg-fuchsia-900/50 text-pink-600 dark:text-fuchsia-400 hover:bg-pink-200 dark:hover:bg-fuchsia-800'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Headphones className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 rounded-full 
                               flex items-center justify-center text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300"
                    disabled={isSealing}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-sm mt-2">
                  Pour your heart onto paper. Choose a seal to make it yours forever.
                </p>
              </div>

              {/* Form */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
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

                {/* Schedule for Later */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-mono text-pink-700 dark:text-fuchsia-300">
                      Schedule for Later (Optional)
                    </label>
                    <motion.button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-mono transition-colors ${
                        scheduledFor
                          ? 'bg-pink-200 dark:bg-fuchsia-800 text-pink-800 dark:text-fuchsia-200'
                          : 'bg-pink-100 dark:bg-fuchsia-900/50 text-pink-600 dark:text-fuchsia-400 hover:bg-pink-200 dark:hover:bg-fuchsia-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{scheduledFor ? 'Change Date' : 'Pick Date'}</span>
                    </motion.button>
                  </div>

                  {scheduledFor && (
                    <div className="bg-pink-50 dark:bg-fuchsia-900/30 rounded-lg p-3 mb-3">
                      <p className="text-sm font-mono text-pink-700 dark:text-fuchsia-300">
                        🔒 This letter will be locked until: {scheduledFor.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <button
                        onClick={() => setScheduledFor(null)}
                        className="text-xs text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300 mt-1"
                      >
                        Remove schedule
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {showDatePicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <DatePicker
                          selectedDate={scheduledFor}
                          onDateSelect={(date) => {
                            setScheduledFor(date);
                            setShowDatePicker(false);
                          }}
                          onClose={() => setShowDatePicker(false)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                        <span>{scheduledFor ? 'Schedule & Lock' : 'Seal Letter'}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};