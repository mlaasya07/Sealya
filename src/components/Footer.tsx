import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 bg-gradient-to-t from-pink-50/50 to-transparent dark:from-fuchsia-900/10 dark:to-transparent">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 text-pink-600 dark:text-fuchsia-400 font-mono text-sm"
        >
          <span>Built with</span>
          <motion.a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white px-3 py-1 rounded-full hover:from-blue-700 hover:to-purple-700 
                       transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-semibold">Bolt</span>
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        </motion.div>
      </div>
    </footer>
  );
};