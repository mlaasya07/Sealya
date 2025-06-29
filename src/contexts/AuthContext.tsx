import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  age?: number;
  loginTimestamp: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  updateAge: (age: number) => void;
  saveUserData: (userData: Partial<UserData>) => void;
  restoreFromBackup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with actual client ID

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    // Check if Google script is loaded
    if (window.google) {
      initializeGoogleAuth();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initializeGoogleAuth();
          clearInterval(checkGoogle);
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, []);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  // Auto-save user data periodically
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        saveUserDataToStorage(user);
        createDataBackup();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle page visibility change to save data
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && user) {
        saveUserDataToStorage(user);
        createDataBackup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Handle beforeunload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        saveUserDataToStorage(user);
        createDataBackup();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem('sealya-user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Try to restore from backup
      restoreFromBackup();
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserDataToStorage = (userData: UserData) => {
    try {
      localStorage.setItem('sealya-user', JSON.stringify(userData));
      
      // Also save to IndexedDB for better persistence
      saveToIndexedDB(userData);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const saveToIndexedDB = async (userData: UserData) => {
    try {
      const request = indexedDB.open('SealyaDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');
        store.put({ ...userData, id: 'current-user' });
      };
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error);
    }
  };

  const loadFromIndexedDB = async (): Promise<UserData | null> => {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('SealyaDB', 1);
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['userData'], 'readonly');
          const store = transaction.objectStore('userData');
          const getRequest = store.get('current-user');
          
          getRequest.onsuccess = () => {
            resolve(getRequest.result || null);
          };
          
          getRequest.onerror = () => {
            resolve(null);
          };
        };
        
        request.onerror = () => {
          resolve(null);
        };
      } catch (error) {
        console.error('Failed to load from IndexedDB:', error);
        resolve(null);
      }
    });
  };

  const createDataBackup = () => {
    try {
      const backupData = {
        user,
        letters: localStorage.getItem('sealya-letters'),
        subscription: localStorage.getItem('sealya-subscription'),
        settings: localStorage.getItem('sealya-theme-mode'),
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('sealya-backup', JSON.stringify(backupData));
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const restoreFromBackup = async () => {
    try {
      // First try IndexedDB
      const indexedDBUser = await loadFromIndexedDB();
      if (indexedDBUser) {
        setUser(indexedDBUser);
        setIsLoggedIn(true);
        return;
      }

      // Then try localStorage backup
      const backup = localStorage.getItem('sealya-backup');
      if (backup) {
        const backupData = JSON.parse(backup);
        if (backupData.user) {
          setUser(backupData.user);
          setIsLoggedIn(true);
          
          // Restore other data if available
          if (backupData.letters) {
            localStorage.setItem('sealya-letters', backupData.letters);
          }
          if (backupData.subscription) {
            localStorage.setItem('sealya-subscription', backupData.subscription);
          }
          if (backupData.settings) {
            localStorage.setItem('sealya-theme-mode', backupData.settings);
          }
        }
      }
    } catch (error) {
      console.error('Failed to restore from backup:', error);
    }
  };

  const handleGoogleResponse = (response: any) => {
    try {
      // Decode the JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData: UserData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        loginTimestamp: new Date().toISOString()
      };

      setUser(userData);
      setIsLoggedIn(true);
      saveUserDataToStorage(userData);
      createDataBackup();
      
      // Show success message
      console.log('Login successful:', userData.name);
    } catch (error) {
      console.error('Failed to process Google response:', error);
    }
  };

  const login = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Identity Services not loaded');
    }
  };

  const logout = () => {
    try {
      // Clear user data
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear localStorage
      localStorage.removeItem('sealya-user');
      
      // Clear IndexedDB
      const request = indexedDB.open('SealyaDB', 1);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');
        store.delete('current-user');
      };

      // Sign out from Google
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const updateAge = (age: number) => {
    if (user) {
      const updatedUser = { ...user, age };
      setUser(updatedUser);
      saveUserDataToStorage(updatedUser);
    }
  };

  const saveUserData = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveUserDataToStorage(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isLoggedIn,
      login,
      logout,
      updateAge,
      saveUserData,
      restoreFromBackup,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google: any;
  }
}