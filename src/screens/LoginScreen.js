import React, { useState } from 'react';
import { View ,StyleSheet, Text} from 'react-native';
import AppText from '../components/common/AppText';
import AppInput from '../components/common/AppInput';
import AppButton from '../components/common/AppButton';
// import ThemeSwitch from '../components/common/ThemeSwitch';
// import { useTheme } from '../context/ThemeContext';
// import { ScaledSheet } from '../utils/responsive';
import AppView from '../components/common/AppView';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitch from '../components/common/ThemeSwitch';

const LoginScreen = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
console.log("lkmjnhb");
  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  return (
    <AppView style={styles.container}>
      <View >
        <AppText size="xlarge" weight="bold" font="roboto" style={{ marginBottom: 20 }}>
          Login
        </AppText>
        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AppInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton title="Login" onPress={handleLogin} />

        <ThemeSwitch  style={styles.switch}/> 
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '20',
  },
  switch: {
    marginTop: '24',
    alignSelf: 'center',
  },
});

export default LoginScreen;
