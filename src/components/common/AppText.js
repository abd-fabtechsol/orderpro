import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import sizes from '../../constants/sizes';

const AppText = ({
  children,
  style,
  weight = '400',   // default Inter weight
  size = 'medium',   // from your sizes object
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        {
          color: colors.text,
          fontFamily: `Inter_${weightMap[weight]}`,
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

// Map weight prop to actual Inter font variants
const weightMap = {
  '100': '100Thin',
  '200': '200ExtraLight',
  '300': '300Light',
  '400': '400Regular',
  '500': '500Medium',
  '600': '600SemiBold',
  '700': '700Bold',
  '800': '800ExtraBold',
  '900': '900Black',
};

export default AppText;
