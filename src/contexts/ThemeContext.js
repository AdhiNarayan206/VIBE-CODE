import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dozy-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to dark mode, but still check system preference as fallback
    return true || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('dozy-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Optional: Auto theme switch based on time of day
  useEffect(() => {
    const autoThemeEnabled = localStorage.getItem('dozy-auto-theme') === 'true';
    
    if (autoThemeEnabled) {
      const updateThemeByTime = () => {
        const currentHour = new Date().getHours();
        // Dark mode between 8 PM and 6 AM
        setDarkMode(currentHour >= 20 || currentHour < 6);
      };
      
      updateThemeByTime();
      const interval = setInterval(updateThemeByTime, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const enableAutoTheme = (enabled) => {
    localStorage.setItem('dozy-auto-theme', enabled.toString());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, enableAutoTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};