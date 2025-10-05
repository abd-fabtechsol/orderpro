// src/components/common/AppInput.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { moderateScale } from 'react-native-size-matters';
import { fonts } from '../../constants';

const AppInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  icon,
  multiline = false,
  numberOfLines = 4,
  minHeight = moderateScale(56),
  maxHeight = moderateScale(200),
  onContentSizeChange,
  ...props
}) => {
  const { colors } = useTheme();
  const [height, setHeight] = useState(multiline ? minHeight : undefined);

  // secureTextEntry + multiline is unsupported on Android — disable it automatically
  const effectiveSecureTextEntry = multiline && Platform.OS === 'android' && secureTextEntry
    ? false
    : secureTextEntry;

  if (multiline && Platform.OS === 'android' && secureTextEntry) {
    console.warn('secureTextEntry is not supported with multiline on Android — it has been disabled for this input.');
  }

  const handleContentSizeChange = (e) => {
    if (!multiline) return;
    const newHeight = Math.min(Math.max(e.nativeEvent.contentSize.height, minHeight), maxHeight);
    setHeight(newHeight);
    if (onContentSizeChange) onContentSizeChange(e);
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.border, alignItems: multiline ? 'flex-start' : 'center' },
        style,
      ]}
    >
      {icon && (
        <Image
          source={icon}
          style={[
            styles.icon,
            {
              tintColor: colors.placeholder,
              marginTop: multiline ? moderateScale(8) : 0,
            },
          ]}
        />
      )}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={effectiveSecureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        onContentSizeChange={handleContentSizeChange}
        style={[
          styles.input,
          {
            color: colors.text,
            fontFamily: fonts.roboto?.regular || fonts.roboto['regular'],
            textAlignVertical: multiline ? 'top' : 'center', // Android
            height: multiline ? height : undefined,
            minHeight: multiline ? minHeight : undefined,
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
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
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
    paddingVertical: moderateScale(8),
  },
});

export default AppInput;
