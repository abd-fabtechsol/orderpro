// src/components/common/AppInput.js
import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { moderateScale } from 'react-native-size-matters';
import { fonts } from '../../constants';

// import iko from '../../../assets/Search.png';

const AppInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  icon, // default icon
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border }, style]}>
      {icon && <Image source={icon} style={[styles.icon, { tintColor: colors.placeholder }]} />}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: fonts.roboto['regular'],
          },
        ]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: moderateScale(12),
    height: 56,
    marginVertical: moderateScale(6),
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    marginRight: moderateScale(8),
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    paddingVertical: moderateScale(10),
  },
});

export default AppInput;
