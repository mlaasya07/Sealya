import React from 'react';
import { motion } from 'framer-motion';
import { PenTool } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                 text-white rounded-full shadow-lg hover:shadow-xl z-50 flex items-center justify-center
                 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative">
        <span className="text-2xl group-hover:scale-110 transition-transform">💌</span>
        <PenTool className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                      bg-gray-800 dark:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm
                      opacity-0 group-hover:opacity-100 transition-opacity
                      whitespace-nowrap pointer-events-none">
        Write a New Letter
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                        border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700" />
      </div>
    </motion.button>
  );
};