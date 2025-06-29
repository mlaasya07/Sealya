import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Clock, Sunrise } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, themeMode, timeFormat, currentTime, setThemeMode, setTimeFormat } = useTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'sync':
        return <Sunrise className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Always Light';
      case 'dark':
        return 'Always Dark';
      case 'sync':
        return 'Sync with Clock';
      default:
        return 'Light Mode';
    }
  };

  const cycleThemeMode = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('sync');
    } else {
      setThemeMode('light');
    }
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
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-6 border-b border-pink-100 dark:border-fuchsia-800">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full 
                           flex items-center justify-center text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4 pr-12">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                                rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100">Settings</h2>
                  <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-sm">Customize your experience</p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6">
              {/* Theme Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-fuchsia-900/50 rounded-full flex items-center justify-center text-pink-600 dark:text-fuchsia-400">
                    {getThemeIcon()}
                  </div>
                  <div>
                    <h3 className="font-mono text-pink-900 dark:text-fuchsia-100 font-semibold">Theme</h3>
                    <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                      {getThemeLabel()}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={cycleThemeMode}
                  className="relative w-16 h-8 rounded-full bg-pink-200 dark:bg-fuchsia-800 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                    animate={{
                      x: themeMode === 'light' ? 2 : themeMode === 'dark' ? 18 : 34,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {getThemeIcon()}
                  </motion.div>
                </motion.button>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-fuchsia-900/50 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-pink-600 dark:text-fuchsia-400" />
                  </div>
                  <div>
                    <h3 className="font-mono text-pink-900 dark:text-fuchsia-100 font-semibold">Time Format</h3>
                    <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                      {timeFormat === '12h' ? '12-hour format' : '24-hour format'}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setTimeFormat(timeFormat === '12h' ? '24h' : '12h')}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    timeFormat === '24h' 
                      ? 'bg-fuchsia-500' 
                      : 'bg-pink-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                    animate={{
                      x: timeFormat === '24h' ? 24 : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="text-xs font-mono font-bold text-pink-600 dark:text-fuchsia-600">
                      {timeFormat === '12h' ? '12' : '24'}
                    </span>
                  </motion.div>
                </motion.button>
              </div>

              {/* Current Time Display */}
              <div className="bg-pink-50 dark:bg-fuchsia-900/30 rounded-2xl p-4 text-center">
                <div className="text-sm font-mono text-pink-600 dark:text-fuchsia-400 mb-1">Current Time</div>
                <div className="text-2xl font-mono font-bold text-pink-900 dark:text-fuchsia-100">
                  {currentTime}
                </div>
              </div>

              {/* Sync Mode Info */}
              {themeMode === 'sync' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 
                             rounded-2xl p-4 border border-pink-200 dark:border-fuchsia-700"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Sunrise className="w-4 h-4 text-pink-600 dark:text-fuchsia-400" />
                    <span className="text-sm font-mono font-semibold text-pink-800 dark:text-fuchsia-200">
                      Dynamic Theme Active
                    </span>
                  </div>
                  <p className="text-xs font-mono text-pink-600 dark:text-fuchsia-300 leading-relaxed">
                    Theme automatically transitions from light pink + white during the day to pure black + fuchsia pink at night, 
                    creating a gentle shift that matches your natural rhythm.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-pink-100 dark:border-fuchsia-800 p-6 bg-pink-50/30 dark:bg-fuchsia-900/20 text-center">
              <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                "Customize your sanctuary to match your mood." ✨
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};