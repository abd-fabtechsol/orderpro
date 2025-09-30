// src/components/common/AppInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { moderateScale } from 'react-native-size-matters';
import { fonts } from '../../constants';


const AppInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[
        styles.input,
        {
          borderColor: colors.border,
          color: colors.text,
          fontFamily: fonts['roboto']["regular"],
         
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 8,

    paddingHorizontal: moderateScale(12),
    height:56,
    paddingVertical: moderateScale(10),
    fontSize: moderateScale(14),
    marginVertical: moderateScale(6),
  },
});

export default AppInput;
