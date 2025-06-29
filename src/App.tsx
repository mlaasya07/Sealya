import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLetters } from './hooks/useLetters';
import { Letter, EmojiSeal } from './types/Letter';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundscapeProvider } from './contexts/SoundscapeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LetterLibrary } from './components/LetterLibrary';
import { LetterWriter } from './components/LetterWriter';
import { LetterModal } from './components/LetterModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { FloatingActionButton } from './components/FloatingActionButton';
import { generateLetterPDF } from './utils/pdfExport';

function AppContent() {
  const { letters, addLetter, deleteLetter, toggleFavorite, undoSeal } = useLetters();
  const [isWriterOpen, setIsWriterOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showUndoNotification, setShowUndoNotification] = useState<Letter | null>(null);

  // Check if onboarding should be shown
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('sealya-onboarding-completed');
    if (!onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleSealLetter = (title: string, label: string, content: string, emoji: EmojiSeal, scheduledFor?: Date) => {
    const newLetter = addLetter({
      title,
      label,
      content,
      emoji,
      isSealed: true,
      scheduledFor,
      isFavorite: false,
    });
    
    setIsWriterOpen(false);
    
    // Show undo notification
    setShowUndoNotification(newLetter);
    setTimeout(() => setShowUndoNotification(null), 10000);
    
    // Show success animation or notification
    setTimeout(() => {
      setSelectedLetter(newLetter);
      setIsLetterModalOpen(true);
    }, 500);
  };

  const handleLetterClick = (letter: Letter) => {
    // Check if letter is locked
    if (letter.scheduledFor && new Date() < new Date(letter.scheduledFor)) {
      return; // Don't open locked letters
    }
    
    setSelectedLetter(letter);
    setIsLetterModalOpen(true);
  };

  const handlePrintLetter = (letter: Letter) => {
    generateLetterPDF(letter);
  };

  const handleDeleteLetter = (id: string) => {
    if (window.confirm('Are you sure you want to delete this letter? This action cannot be undone.')) {
      deleteLetter(id);
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
        setIsLetterModalOpen(false);
      }
    }
  };

  const handleUndoSeal = (letter: Letter) => {
    undoSeal(letter.id);
    setShowUndoNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
      <Header 
        letters={letters} 
        onProfileClick={() => setIsProfileModalOpen(true)}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
      />
      
      <main>
        <Hero onWriteClick={() => setIsWriterOpen(true)} />
        <LetterLibrary
          letters={letters}
          onLetterClick={handleLetterClick}
          onPrintLetter={handlePrintLetter}
          onDeleteLetter={handleDeleteLetter}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      <FloatingActionButton onClick={() => setIsWriterOpen(true)} />

      {/* Undo Notification */}
      {showUndoNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40
                     bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-pink-200 dark:border-fuchsia-700 p-4
                     flex items-center space-x-4 max-w-sm"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{showUndoNotification.emoji}</span>
            <div>
              <p className="font-mono text-sm text-pink-900 dark:text-fuchsia-100">Letter sealed!</p>
              <p className="font-mono text-xs text-pink-600 dark:text-fuchsia-300">"{showUndoNotification.title}"</p>
            </div>
          </div>
          <button
            onClick={() => handleUndoSeal(showUndoNotification)}
            className="bg-pink-100 dark:bg-fuchsia-900/50 hover:bg-pink-200 dark:hover:bg-fuchsia-900/70 
                       text-pink-700 dark:text-fuchsia-300 px-3 py-1 rounded-lg font-mono text-sm transition-colors"
          >
            Undo
          </button>
        </motion.div>
      )}

      <LetterWriter
        isOpen={isWriterOpen}
        onClose={() => setIsWriterOpen(false)}
        onSeal={handleSealLetter}
      />

      <LetterModal
        letter={selectedLetter}
        isOpen={isLetterModalOpen}
        onClose={() => {
          setIsLetterModalOpen(false);
          setSelectedLetter(null);
        }}
        onPrint={() => selectedLetter && handlePrintLetter(selectedLetter)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        letters={letters}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => setIsOnboardingOpen(false)}
      />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-300 dark:bg-fuchsia-400 rounded-full opacity-30"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-3 h-3 bg-rose-300 dark:bg-pink-400 rounded-full opacity-20"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400 dark:bg-fuchsia-500 rounded-full opacity-40"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SoundscapeProvider>
        <AppContent />
      </SoundscapeProvider>
    </ThemeProvider>
  );
}

export default App;