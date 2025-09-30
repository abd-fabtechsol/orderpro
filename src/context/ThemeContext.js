import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import colors from '../constants/colors'; // <-- now using this

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = isDarkMode ? colors.dark : colors.light;
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove?.(); // safe cleanup
  }, []);
  return (
    <ThemeContext.Provider value={{ isDarkMode, colors: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
