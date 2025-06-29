import { useState, useEffect } from 'react';
import { Letter } from '../types/Letter';

export const useLetters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedLetters = localStorage.getItem('sealya-letters');
    if (savedLetters) {
      const parsedLetters = JSON.parse(savedLetters).map((letter: any) => ({
        ...letter,
        timestamp: new Date(letter.timestamp),
        scheduledFor: letter.scheduledFor ? new Date(letter.scheduledFor) : undefined,
        undoExpiresAt: letter.undoExpiresAt ? new Date(letter.undoExpiresAt) : undefined,
      }));
      setLetters(parsedLetters);
    }
  }, []);

  const saveLetters = (updatedLetters: Letter[]) => {
    setLetters(updatedLetters);
    localStorage.setItem('sealya-letters', JSON.stringify(updatedLetters));
  };

  const addLetter = (letter: Omit<Letter, 'id' | 'timestamp'>) => {
    const now = new Date();
    const newLetter: Letter = {
      ...letter,
      id: crypto.randomUUID(),
      timestamp: now,
      canUndo: true,
      undoExpiresAt: new Date(now.getTime() + 10000), // 10 seconds
    };

    saveLetters([...letters, newLetter]);

    // Set up undo timer
    const timer = setTimeout(() => {
      setLetters(prev => prev.map(l => 
        l.id === newLetter.id 
          ? { ...l, canUndo: false, undoExpiresAt: undefined }
          : l
      ));
    }, 10000);

    setUndoTimer(timer);
    return newLetter;
  };

  const undoSeal = (id: string) => {
    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
    }
    
    const updatedLetters = letters.filter(letter => letter.id !== id);
    saveLetters(updatedLetters);
  };

  const deleteLetter = (id: string) => {
    saveLetters(letters.filter(letter => letter.id !== id));
  };

  const toggleFavorite = (id: string) => {
    saveLetters(letters.map(letter => 
      letter.id === id ? { ...letter, isFavorite: !letter.isFavorite } : letter
    ));
  };

  const sealLetter = (id: string) => {
    saveLetters(letters.map(letter => 
      letter.id === id ? { ...letter, isSealed: true } : letter
    ));
  };

  // Check for anniversary letters (letters from exactly 1 year ago)
  const getAnniversaryLetters = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    return letters.filter(letter => {
      const letterDate = letter.timestamp;
      return letterDate.getFullYear() === oneYearAgo.getFullYear() &&
             letterDate.getMonth() === oneYearAgo.getMonth() &&
             letterDate.getDate() === oneYearAgo.getDate();
    });
  };

  return {
    letters,
    addLetter,
    deleteLetter,
    toggleFavorite,
    sealLetter,
    undoSeal,
    getAnniversaryLetters,
  };
};