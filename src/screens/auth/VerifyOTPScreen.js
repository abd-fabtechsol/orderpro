import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { sizes } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import AppButton from '../../components/common/AppButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import { login } from '../../redux/authSlice';

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  // Get phone number from navigation params
  const phoneNumber = route.params?.phone || '';

  // Refs for auto-focus
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value, index) => {
    // Clear error when user types
    setError('');

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace - move to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    // Validation
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      setError('Please enter the complete OTP');
      return;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not found. Please go back and try again.');
      return;
    }

    // Start loading
    setLoading(true);
    setError('');

    try {
      const result = await apiClient.post('auth/verify_otp/', {
        phone: phoneNumber,
        otp: otpCode
      });

      console.log('OTP Verify Result:', result?.data);

      if (result.ok) {
        const { access, refreshToken, user } = result.data;

        // Dispatch login action to Redux
        dispatch(login({
          token: access,
          refreshToken: refreshToken,
          userData: user
        }));

        // Show success message
        Alert.alert(
          'Success',
          'OTP verified successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate based on profile completion status
                
                  navigation.navigate('PasskeyScreen', { phone: phoneNumber });
               
              }
            }
          ]
        );
      } else {
        // API returned error
        const errorMessage = result.data?.message || result.data?.error || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      // Network or other error
      console.error('OTP Verify Error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return; // Don't allow resend if timer is still running

    setLoading(true);
    setError('');

    try {
      const result = await apiClient.post('auth/login/', { phone: phoneNumber });

      if (result.ok) {
        // Reset timer
        setTimer(59);
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        Alert.alert('Success', 'OTP has been resent to your phone number.');
      } else {
        const errorMessage = result.data?.message || 'Failed to resend OTP.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView style={styles.container}>
      <View style={{flex:1}}>
        <AppText style={[styles.title, {color:colors.text}]}>Verify OTP</AppText>
        <AppText style={[styles.subtitle, {color:colors.secondaryText}]}>
          We've sent an OTP to {phoneNumber}. Please verify your phone number to
          activate your account.
        </AppText>
      </View>

      <View style={{flex:1}}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                {
                  color: colors.text,
                  borderColor: error ? 'red' : colors.border
                }
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={val => handleChange(val, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              editable={!loading}
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Error Message */}
        {error ? (
          <AppText style={styles.errorText}>{error}</AppText>
        ) : null}

        {/* Resend OTP */}
        {timer > 0 ? (
          <AppText style={[styles.resendText, {color:colors.secondaryText, fontSize:sizes.small}]}>
            Resend code in {timer} sec
          </AppText>
        ) : (
          <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
            <AppText style={[styles.resendText, {color: colors.primary, fontSize:sizes.small, fontWeight: '600'}]}>
              Resend OTP
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <AppButton
        onPress={loading ? null : handleVerifyOTP}
        title={loading ? "Verifying..." : "Verify"}
        style={{ opacity: loading ? 0.7 : 1 }}
      />
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
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  resendText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    fontSize: sizes.small,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
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
