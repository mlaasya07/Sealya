import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, PenTool, Sparkles, Archive, Heart } from 'lucide-react';
import { EMOJI_SEALS } from '../types/Letter';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Sealya',
    description: 'Your digital sanctuary for sealed emotions',
    icon: '💌',
    content: 'A quiet place for the letters you never sent, the thoughts you needed to write down, and the feelings that deserve to be sealed.',
  },
  {
    id: 'write',
    title: 'Write Your Heart',
    description: 'Pour your emotions onto paper',
    icon: '✍️',
    content: 'Write freely about anything - letters to yourself, loved ones, or simply thoughts that need a safe space.',
  },
  {
    id: 'seal',
    title: 'Choose Your Seal',
    description: 'Pick an emoji that represents your feelings',
    icon: '🌸',
    content: 'Each letter gets a special seal that captures the essence of your emotions in that moment.',
  },
  {
    id: 'fold',
    title: 'Watch It Fold',
    description: 'See your letter transform into a sealed envelope',
    icon: '📮',
    content: 'Your words are carefully folded and sealed, creating a beautiful digital envelope that preserves your thoughts.',
  },
  {
    id: 'archive',
    title: 'Safe in Your Archive',
    description: 'All your letters are stored securely',
    icon: '📚',
    content: 'Your sealed letters live in your personal archive, ready to be revisited whenever you need them.',
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('❤️');

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      localStorage.setItem('sealya-onboarding-completed', 'true');
    }
  };

  const skipOnboarding = () => {
    onComplete();
    localStorage.setItem('sealya-onboarding-completed', 'true');
  };

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="h-1 bg-pink-100 dark:bg-fuchsia-900">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 dark:from-fuchsia-500 dark:to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="text-6xl mb-4"
                >
                  {currentStepData.icon}
                </motion.div>

                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-pink-900 dark:text-fuchsia-100 mb-2"
                >
                  {currentStepData.title}
                </motion.h2>

                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-pink-600 dark:text-fuchsia-300 font-mono text-sm mb-4"
                >
                  {currentStepData.description}
                </motion.p>

                <motion.p
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-pink-700 dark:text-fuchsia-200 leading-relaxed"
                >
                  {currentStepData.content}
                </motion.p>
              </div>

              {/* Interactive Demo for Seal Step */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <p className="text-sm font-mono text-pink-700 dark:text-fuchsia-300 mb-3 text-center">
                    Try selecting a seal:
                  </p>
                  <div className="flex justify-center space-x-3">
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
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Folding Animation Demo */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 flex justify-center"
                >
                  <motion.div
                    className="relative"
                    animate={{
                      rotateY: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-20 h-16 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-fuchsia-900/50 dark:to-pink-900/50 
                                    rounded-lg border border-pink-200 dark:border-fuchsia-700 flex items-center justify-center">
                      <span className="text-2xl">💌</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={skipOnboarding}
                  className="text-sm font-mono text-pink-600 dark:text-fuchsia-400 hover:text-pink-800 dark:hover:text-fuchsia-300"
                >
                  Skip tour
                </button>

                <div className="flex items-center space-x-4">
                  {/* Step Indicators */}
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentStep
                            ? 'bg-pink-500 dark:bg-fuchsia-500'
                            : index < currentStep
                            ? 'bg-pink-300 dark:bg-fuchsia-700'
                            : 'bg-pink-200 dark:bg-fuchsia-800'
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-fuchsia-500 dark:to-pink-500 
                               hover:from-pink-600 hover:to-rose-600 dark:hover:from-fuchsia-600 dark:hover:to-pink-600
                               text-white px-6 py-2 rounded-full font-mono text-sm shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{currentStep === steps.length - 1 ? 'Start Writing' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Final Step Special Content */}
            {currentStep === steps.length - 1 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-6 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-800 dark:text-fuchsia-200 font-mono text-lg font-semibold"
                >
                  "Welcome to your emotional archive. Seal what matters."
                </motion.p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};