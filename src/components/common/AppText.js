import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../constants/fonts';
import sizes from '../../constants/sizes';

const AppText = ({ children, style, weight = 'regular', size = 'medium', font = 'roboto', ...props }) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        {
          color: colors.text,
          fontFamily: fonts[font][weight],
          fontSize: sizes[size],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
