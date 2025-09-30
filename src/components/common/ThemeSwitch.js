// src/components/common/ThemeSwitch.js
import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitch = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleTheme}
        value={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default ThemeSwitch;
