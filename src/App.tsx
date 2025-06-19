import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLetters } from './hooks/useLetters';
import { Letter, EmojiSeal } from './types/Letter';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LetterLibrary } from './components/LetterLibrary';
import { LetterWriter } from './components/LetterWriter';
import { LetterModal } from './components/LetterModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { FloatingActionButton } from './components/FloatingActionButton';
import { generateLetterPDF } from './utils/pdfExport';

function AppContent() {
  const { letters, addLetter, deleteLetter, sealLetter } = useLetters();
  const [isWriterOpen, setIsWriterOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSealLetter = (title: string, label: string, content: string, emoji: EmojiSeal) => {
    const newLetter = addLetter({
      title,
      label,
      content,
      emoji,
      isSealed: true,
    });
    
    setIsWriterOpen(false);
    
    // Show success animation or notification
    setTimeout(() => {
      setSelectedLetter(newLetter);
      setIsLetterModalOpen(true);
    }, 500);
  };

  const handleLetterClick = (letter: Letter) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-fuchsia-900/20 transition-colors duration-300">
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
        />
      </main>

      <FloatingActionButton onClick={() => setIsWriterOpen(true)} />

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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;