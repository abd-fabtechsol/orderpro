import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from 'react-native';

const initialState = {
  isDarkMode: Appearance.getColorScheme() === 'dark',
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTheme: (state, { payload }) => {
      state.isDarkMode = payload;
    },
    setSystemTheme: (state) => {
      state.isDarkMode = Appearance.getColorScheme() === 'dark';
    },
  },
});

export const { toggleTheme, setTheme, setSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;
