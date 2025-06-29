import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onWriteClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onWriteClick }) => {
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-fuchsia-900/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3e8ff%22%20fill-opacity%3D%220.3%22%3E%3Cpath%20d%3D%22m36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50 dark:opacity-20" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex justify-center space-x-2 text-4xl mb-4">
            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🌸</motion.span>
            <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>✨</motion.span>
            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>💌</motion.span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 dark:from-fuchsia-400 dark:via-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent leading-tight">
            {isLoggedIn ? `Welcome back, ${user?.name?.split(' ')[0]}!` : 'Welcome to Sealya'}
          </h1>

          <div className="max-w-2xl mx-auto space-y-4 text-lg md:text-xl text-pink-700 dark:text-fuchsia-300 font-mono leading-relaxed">
            {isLoggedIn ? (
              <>
                <p>Your digital sanctuary awaits,</p>
                <p>ready to hold your thoughts and feelings</p>
                <p>in beautifully sealed letters.</p>
              </>
            ) : (
              <>
                <p>A quiet place for the letters you never sent,</p>
                <p>the thoughts you needed to write down,</p>
                <p>and the feelings that deserve to be sealed.</p>
              </>
            )}
          </div>

          <div className="pt-6">
            <p className="text-pink-600 dark:text-fuchsia-400 font-mono text-lg mb-8">
              {isLoggedIn 
                ? "Your letters are safely stored and ready to revisit."
                : "Write from the heart. Choose a seal. Save it forever."
              }
            </p>

            <motion.button
              onClick={onWriteClick}
              className="bg-gradient-to-r from-pink-500 to-rose-500 dark:from-fuchsia-500 dark:to-pink-500 hover:from-pink-600 hover:to-rose-600 dark:hover:from-fuchsia-600 dark:hover:to-pink-600
                         text-white px-8 py-4 rounded-full font-mono text-lg shadow-lg hover:shadow-xl
                         transition-all duration-300 flex items-center space-x-3 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">💌</span>
              <span>{isLoggedIn ? 'Write a New Letter' : 'Sign In to Start Writing'}</span>
            </motion.button>

            {!isLoggedIn && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-pink-500 dark:text-fuchsia-400 font-mono text-sm mt-4"
              >
                Sign in with Google to save your letters securely on your device
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};