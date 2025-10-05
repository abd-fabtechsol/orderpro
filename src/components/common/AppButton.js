import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../constants/fonts';
import sizes from '../../constants/sizes';
// import pic from "../../../assets/splash-icon.png";
import { Image } from 'react-native';
const AppButton = ({ title, onPress, style, textStyle ,image}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          gap:12,
          backgroundColor: colors.buttonColor,
          padding: 12,
          height:54,
          borderRadius: 8,
          alignItems: 'center',
        },
        style,
      ]}
      onPress={onPress} 
    >
      {image && <Image source={image} style={{width: 23, height: 23}} resizeMode="contain" />}
      <Text
        style={[
          {
            color: colors.buttonText,
            fontFamily: fonts.roboto.bold,
            fontSize: sizes.medium,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default AppButton;
