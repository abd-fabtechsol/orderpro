import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { colors, sizes } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import AppButton from '../../components/common/AppButton';
import { useNavigation } from '@react-navigation/native';

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigation = useNavigation();
  const [timer, setTimer] = useState(59);
const {colors}=useTheme()
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <AppView style={styles.container}>
        <View style={{flex:1}}>
      <AppText style={[styles.title,{color:colors.text}]}>Verify OTP</AppText>
      <AppText style={[styles.subtitle,{color:colors.text}]}>
        We’ve sent an OTP to +15034923647. Please verify your phone number to
        activate your account.
      </AppText>
      </View>
      <View style={{flex:1}}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput,{color:colors.text}]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={val => handleChange(val, index)}
          />
        ))}
      </View>

      <AppText style={[styles.resendText,{color:colors.text,fontSize:sizes.small}]}>
        Resend code in {timer} sec
      </AppText>
      </View>
      <AppButton onPress={() => navigation.navigate('PasskeyScreen')} title="Verify" />
      
    </AppView>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   padding:20
    
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  resendText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  verifyButton: {
    backgroundColor: '#1DBF72',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  verifyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
