import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'sync';
type TimeFormat = '12h' | '24h';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  timeFormat: TimeFormat;
  currentTime: string;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>('12h');
  const [currentTime, setCurrentTime] = useState('');

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h'
      };
      
      const timeString = now.toLocaleDateString('en-GB', options);
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeFormat]);

  // Load saved preferences
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('sealya-theme-mode') as ThemeMode;
    const savedTimeFormat = localStorage.getItem('sealya-time-format') as TimeFormat;
    
    if (savedThemeMode) {
      setThemeModeState(savedThemeMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeModeState(prefersDark ? 'dark' : 'light');
    }
    
    if (savedTimeFormat) {
      setTimeFormatState(savedTimeFormat);
    }
  }, []);

  // Handle theme changes based on mode
  useEffect(() => {
    let newTheme: Theme = 'light';
    
    if (themeMode === 'sync') {
      // Dynamic theme based on time of day
      const hour = new Date().getHours();
      // Gradual transition: 6 AM = light, 8 PM = dark
      if (hour >= 20 || hour < 6) {
        newTheme = 'dark';
      } else if (hour >= 18) {
        // Transition period - could add gradual color changes here
        newTheme = 'dark';
      } else {
        newTheme = 'light';
      }
    } else {
      newTheme = themeMode as Theme;
    }
    
    setTheme(newTheme);
    localStorage.setItem('sealya-theme-mode', themeMode);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Apply dynamic background for sync mode
    if (themeMode === 'sync') {
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      const totalMinutes = hour * 60 + minute;
      
      // Calculate transition progress (0 = full light, 1 = full dark)
      let progress = 0;
      if (totalMinutes >= 18 * 60) { // After 6 PM
        progress = Math.min(1, (totalMinutes - 18 * 60) / (2 * 60)); // 2 hour transition
      } else if (totalMinutes < 6 * 60) { // Before 6 AM
        progress = 1;
      }
      
      // Apply CSS custom properties for dynamic background
      document.documentElement.style.setProperty('--theme-transition-progress', progress.toString());
    } else {
      document.documentElement.style.removeProperty('--theme-transition-progress');
    }
  }, [themeMode]);

  // Update time format preference
  useEffect(() => {
    localStorage.setItem('sealya-time-format', timeFormat);
  }, [timeFormat]);

  // Set up interval for sync mode to update theme throughout the day
  useEffect(() => {
    if (themeMode === 'sync') {
      const interval = setInterval(() => {
        // Trigger theme recalculation
        setThemeModeState(prev => prev === 'sync' ? 'sync' : prev);
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    if (themeMode === 'light') {
      setThemeModeState('dark');
    } else if (themeMode === 'dark') {
      setThemeModeState('sync');
    } else {
      setThemeModeState('light');
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const setTimeFormat = (format: TimeFormat) => {
    setTimeFormatState(format);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      themeMode,
      timeFormat,
      currentTime,
      toggleTheme,
      setThemeMode,
      setTimeFormat,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};