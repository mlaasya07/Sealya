import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortDesc, Search, Star, Download, Calendar } from 'lucide-react';
import { Letter, EMOJI_SEALS } from '../types/Letter';
import { LetterCard } from './LetterCard';
import { exportAllLettersAsZip } from '../utils/exportUtils';

interface LetterLibraryProps {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
  onPrintLetter: (letter: Letter) => void;
  onDeleteLetter: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const LetterLibrary: React.FC<LetterLibraryProps> = ({
  letters,
  onLetterClick,
  onPrintLetter,
  onDeleteLetter,
  onToggleFavorite,
}) => {
  const [filterEmoji, setFilterEmoji] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'favorites'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const sealedLetters = letters.filter(letter => letter.isSealed);

  const filteredAndSortedLetters = sealedLetters
    .filter(letter => {
      const matchesEmoji = !filterEmoji || letter.emoji === filterEmoji;
      const matchesSearch = !searchTerm || 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || letter.isFavorite;
      return matchesEmoji && matchesSearch && matchesFavorites;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else if (sortBy === 'favorites') {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const handleExportAll = async () => {
    if (sealedLetters.length === 0) return;
    
    setIsExporting(true);
    try {
      await exportAllLettersAsZip(sealedLetters);
    } catch (error) {
      console.error('Failed to export letters:', error);
      alert('Failed to export letters. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const favoriteCount = sealedLetters.filter(letter => letter.isFavorite).length;
  const lockedCount = sealedLetters.filter(letter => {
    if (!letter.scheduledFor) return false;
    return new Date() < new Date(letter.scheduledFor);
  }).length;

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
          <div className="flex items-center justify-center space-x-6 text-pink-600 dark:text-fuchsia-300 font-mono text-sm">
            <span>{sealedLetters.length} letter{sealedLetters.length !== 1 ? 's' : ''} sealed</span>
            {favoriteCount > 0 && (
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span>{favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}</span>
              </span>
            )}
            {lockedCount > 0 && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{lockedCount} scheduled</span>
              </span>
            )}
          </div>
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
            {/* Favorites Toggle */}
            <motion.button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-mono text-sm transition-colors ${
                showFavoritesOnly
                  ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                  : 'bg-pink-50 dark:bg-fuchsia-900/30 text-pink-600 dark:text-fuchsia-400 hover:bg-pink-100 dark:hover:bg-fuchsia-900/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span>Favorites</span>
            </motion.button>

            {/* Export All */}
            <motion.button
              onClick={handleExportAll}
              disabled={isExporting || sealedLetters.length === 0}
              className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900/70 
                         text-green-700 dark:text-green-300 px-3 py-2 rounded-lg font-mono text-sm transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export All'}</span>
            </motion.button>

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
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'favorites')}
                className="border border-pink-200 dark:border-fuchsia-700 rounded-lg px-3 py-2 focus:outline-none 
                           focus:ring-2 focus:ring-pink-500 dark:focus:ring-fuchsia-500 font-mono text-sm
                           bg-white dark:bg-gray-700 text-pink-900 dark:text-fuchsia-100"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="favorites">Favorites First</option>
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
                    onToggleFavorite={() => onToggleFavorite(letter.id)}
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