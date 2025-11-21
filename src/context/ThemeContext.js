import React, { createContext, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggleThemeAction, setSystemTheme } from '../redux/themeSlice';
import colors from '../constants/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Optionally update theme when system theme changes
      // Uncomment the line below if you want to sync with system theme automatically
      // dispatch(setSystemTheme());
    });

    return () => subscription?.remove?.(); // safe cleanup
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
