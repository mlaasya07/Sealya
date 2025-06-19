import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortDesc, Search } from 'lucide-react';
import { Letter, EMOJI_SEALS } from '../types/Letter';
import { LetterCard } from './LetterCard';

interface LetterLibraryProps {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  onPrintLetter: (letter: Letter) => void;
  onDeleteLetter: (id: string) => void;
}

export const LetterLibrary: React.FC<LetterLibraryProps> = ({
  letters,
  onLetterClick,
  onPrintLetter,
  onDeleteLetter,
}) => {
  const [filterEmoji, setFilterEmoji] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const sealedLetters = letters.filter(letter => letter.isSealed);

  const filteredAndSortedLetters = sealedLetters
    .filter(letter => {
      const matchesEmoji = !filterEmoji || letter.emoji === filterEmoji;
      const matchesSearch = !searchTerm || 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesEmoji && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.title.localeCompare(b.title);
    });

  if (sealedLetters.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-3xl font-bold text-pink-900 dark:text-fuchsia-100 mb-4">No Letters Yet</h2>
            <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-lg max-w-md mx-auto">
              Your sealed letters will appear here. Start by writing your first letter above.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-transparent to-pink-50/30 dark:to-fuchsia-900/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-pink-900 dark:text-fuchsia-100 mb-4">
            Your Seals
          </h2>
          <p className="text-pink-600 dark:text-fuchsia-300 font-mono text-lg">
            {sealedLetters.length} letter{sealedLetters.length !== 1 ? 's' : ''} safely sealed and stored
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between 
                     bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-pink-100 dark:border-fuchsia-800"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-pink-400 dark:text-fuchsia-400" />
            <input
              type="text"
              placeholder="Search letters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-pink-200 dark:border-fuchsia-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono
                         bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100 placeholder-pink-400 dark:placeholder-fuchsia-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Emoji Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-pink-600 dark:text-fuchsia-400" />
              <select
                value={filterEmoji}
                onChange={(e) => setFilterEmoji(e.target.value)}
                className="border border-pink-200 dark:border-fuchsia-700 rounded-lg px-3 py-2 focus:outline-none 
                           focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono text-sm
                           bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
              >
                <option value="">All Seals</option>
                {EMOJI_SEALS.map(emoji => (
                  <option key={emoji} value={emoji}>{emoji} {emoji}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortDesc className="w-5 h-5 text-pink-600 dark:text-fuchsia-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="border border-pink-200 dark:border-fuchsia-700 rounded-lg px-3 py-2 focus:outline-none 
                           focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono text-sm
                           bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Letters Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedLetters.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-pink-600 dark:text-fuchsia-300 font-mono">No letters match your search criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAndSortedLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LetterCard
                    letter={letter}
                    onClick={() => onLetterClick(letter)}
                    onPrint={() => onPrintLetter(letter)}
                    onDelete={() => onDeleteLetter(letter.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};