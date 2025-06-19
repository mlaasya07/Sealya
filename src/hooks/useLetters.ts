import { useState, useEffect } from 'react';
import { Letter } from '../types/Letter';

export const useLetters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);

  useEffect(() => {
    const savedLetters = localStorage.getItem('sealya-letters');
    if (savedLetters) {
      const parsedLetters = JSON.parse(savedLetters).map((letter: any) => ({
        ...letter,
        timestamp: new Date(letter.timestamp)
      }));
      setLetters(parsedLetters);
    }
  }, []);

  const saveLetters = (updatedLetters: Letter[]) => {
    setLetters(updatedLetters);
    localStorage.setItem('sealya-letters', JSON.stringify(updatedLetters));
  };

  const addLetter = (letter: Omit<Letter, 'id' | 'timestamp'>) => {
    const newLetter: Letter = {
      ...letter,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    saveLetters([...letters, newLetter]);
    return newLetter;
  };

  const deleteLetter = (id: string) => {
    saveLetters(letters.filter(letter => letter.id !== id));
  };

  const sealLetter = (id: string) => {
    saveLetters(letters.map(letter => 
      letter.id === id ? { ...letter, isSealed: true } : letter
    ));
  };

  return {
    letters,
    addLetter,
    deleteLetter,
    sealLetter,
  };
};