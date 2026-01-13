import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { sizes } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';
import AppButton from '../../components/common/AppButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import CustomAlert from '../../components/common/CustomAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { showLoading, hideLoading } = useLoading();
  const { alertConfig, hideAlert, showSuccess, showError } = useCustomAlert();
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  // Get email from navigation params
  const email = route.params?.email || '';

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

    if (!email) {
      showError('Email not found. Please go back and try again.');
      return;
    }

    // Start loading
    showLoading('Verifying OTP...');
    setError('');

    try {
      const result = await apiClient.post('auth/verify-email/', {
        email: email,
        otp: otpCode
      });

      if (result.ok) {
        // OTP verified successfully - navigate to Login screen
        showSuccess(
          'Email verified successfully! Please login to continue.',
          'Success',
          () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        );
      } else {
        // API returned error
        const errorMessage = result.data?.message || result.data?.error || 'Invalid OTP. Please try again.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error) {
      // Network or other error
      console.error('OTP Verify Error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      // Stop loading
      hideLoading();
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return; // Don't allow resend if timer is still running

    showLoading('Resending OTP...');
    setError('');

    try {
      const result = await apiClient.post('auth/resend-otp/', { email: email });

      if (result.ok) {
        // Reset timer
        setTimer(59);
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        showSuccess('OTP has been resent to your email.');
      } else {
        const errorMessage = result.data?.message || 'Failed to resend OTP.';
        showError(errorMessage);
      }
    } catch (error) {
      showError('Failed to resend OTP. Please try again.');
    } finally {
      hideLoading();
    }
  };

  return (
    <AppView style={styles.container}>
      <View style={{flex:1}}>
        <AppText style={[styles.title, {color:colors.text}]}>Verify OTP</AppText>
        <AppText style={[styles.subtitle, {color:colors.secondaryText}]}>
          We've sent an OTP to {email}. Please verify your email to
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
          <TouchableOpacity onPress={handleResendOTP}>
            <AppText style={[styles.resendText, {color: colors.primary, fontSize:sizes.small, fontWeight: '600'}]}>
              Resend OTP
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <AppButton
        onPress={handleVerifyOTP}
        title="Verify"
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        onClose={hideAlert}
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
