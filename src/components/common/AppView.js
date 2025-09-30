import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useKeyboardAnimation } from 'react-native-keyboard-controller';
import { useTheme } from '../../context/ThemeContext';

const AppView = ({ children, style }) => {
  const { isDarkMode, colors } = useTheme();
  const { height: keyboardHeight } = useKeyboardAnimation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <View
            style={[
              styles.flex,
              style,
              {
                paddingBottom: Platform.OS === 'ios' ? keyboardHeight : 0,
              },
            ]}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
    marginBottom:18,
  },
});

export default AppView;
