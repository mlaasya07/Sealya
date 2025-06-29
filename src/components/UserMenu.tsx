import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Crown, ChevronDown, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

interface UserMenuProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onPremiumClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onProfileClick,
  onSettingsClick,
  onPremiumClick
}) => {
  const { user, logout } = useAuth();
  const { subscription } = usePremium();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const isPremium = subscription?.tier !== 'free';
  const memberSince = new Date(user.loginTimestamp).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-pink-50 dark:bg-fuchsia-900/50 hover:bg-pink-100 dark:hover:bg-fuchsia-900/70 
                   px-4 py-2 rounded-full transition-colors group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-pink-200 dark:border-fuchsia-600"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                            rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className="text-left hidden sm:block">
            <div className="text-sm font-mono font-semibold text-pink-900 dark:text-fuchsia-100">
              {user.name.split(' ')[0]}
            </div>
            {isPremium && (
              <div className="flex items-center space-x-1 text-xs">
                <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400 font-mono">
                  {subscription?.tier.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-pink-600 dark:text-fuchsia-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
                         border border-pink-100 dark:border-fuchsia-800 z-50 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-4">
                <div className="flex items-center space-x-3">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-pink-200 dark:border-fuchsia-600"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 dark:from-fuchsia-500 dark:to-pink-500 
                                    rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-mono font-bold text-pink-900 dark:text-fuchsia-100">
                      {user.name}
                    </h3>
                    <p className="text-sm text-pink-600 dark:text-fuchsia-300 font-mono">
                      {user.email}
                    </p>
                    {user.age && (
                      <p className="text-xs text-pink-500 dark:text-fuchsia-400 font-mono">
                        Age: {user.age}
                      </p>
                    )}
                  </div>
                  
                  {isPremium && (
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full">
                      <Crown className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-xs text-pink-600 dark:text-fuchsia-300 font-mono">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Member since {memberSince}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Data secured locally</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <motion.button
                  onClick={() => {
                    onProfileClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-pink-50 dark:hover:bg-fuchsia-900/30 
                             text-left transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <User className="w-5 h-5 text-pink-600 dark:text-fuchsia-400" />
                  <div>
                    <div className="font-mono font-semibold text-pink-900 dark:text-fuchsia-100">
                      View Profile
                    </div>
                    <div className="text-xs text-pink-600 dark:text-fuchsia-300">
                      See your writing statistics
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    onSettingsClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-pink-50 dark:hover:bg-fuchsia-900/30 
                             text-left transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <Settings className="w-5 h-5 text-pink-600 dark:text-fuchsia-400" />
                  <div>
                    <div className="font-mono font-semibold text-pink-900 dark:text-fuchsia-100">
                      Settings
                    </div>
                    <div className="text-xs text-pink-600 dark:text-fuchsia-300">
                      Customize your experience
                    </div>
                  </div>
                </motion.button>

                {!isPremium && (
                  <motion.button
                    onClick={() => {
                      onPremiumClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                               dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 text-left transition-colors group"
                    whileHover={{ x: 4 }}
                  >
                    <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-mono font-semibold text-purple-900 dark:text-purple-100">
                        Upgrade to Premium
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-300">
                        Unlock unlimited letters & features
                      </div>
                    </div>
                  </motion.button>
                )}

                <div className="border-t border-pink-100 dark:border-fuchsia-800 my-2" />

                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 
                             text-left transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <div className="font-mono font-semibold text-red-900 dark:text-red-100">
                      Sign Out
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-300">
                      Your data will remain saved locally
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};