import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Shield, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, user, updateAge } = useAuth();
  const [showAgePrompt, setShowAgePrompt] = useState(false);
  const [age, setAge] = useState('');

  useEffect(() => {
    if (user && !user.age) {
      setShowAgePrompt(true);
    }
  }, [user]);

  const handleAgeSubmit = () => {
    const ageNumber = parseInt(age);
    if (ageNumber && ageNumber >= 13 && ageNumber <= 120) {
      updateAge(ageNumber);
      setShowAgePrompt(false);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    login();
  };

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
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {!showAgePrompt ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-8 text-white text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    💌
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold mb-2">Welcome to Sealya</h2>
                  <p className="text-pink-100 font-mono">Your digital sanctuary for sealed emotions</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Sign in to start your journey
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm leading-relaxed">
                      Securely save your letters, access them anywhere, and never lose your precious thoughts.
                    </p>
                  </div>

                  {/* Privacy Features */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        Your data stays on your device
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        No external servers or tracking
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                        Auto-backup and sync protection
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <motion.button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 
                               hover:border-gray-300 dark:hover:border-gray-500 rounded-2xl p-4 
                               flex items-center justify-center space-x-3 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                      Continue with Google
                    </span>
                  </motion.button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 font-mono">
                    We only access your name and email. No other data is collected.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Age Prompt */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-6 text-white text-center">
                  <User className="w-12 h-12 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
                  <p className="text-purple-100 font-mono text-sm">Help us personalize your experience</p>
                </div>

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      What's your age?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                      This helps us provide age-appropriate features and is stored locally on your device.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      min="13"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 
                                 font-mono text-center text-lg bg-white dark:bg-gray-700 
                                 text-gray-900 dark:text-white"
                    />

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowAgePrompt(false)}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                                   text-gray-700 dark:text-gray-300 font-mono hover:bg-gray-50 dark:hover:bg-gray-800 
                                   transition-colors"
                      >
                        Skip for now
                      </button>
                      
                      <button
                        onClick={handleAgeSubmit}
                        disabled={!age || parseInt(age) < 13 || parseInt(age) > 120}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 
                                   hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-mono 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 font-mono">
                    You must be at least 13 years old to use Sealya.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};