import { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import AppView from "../../components/common/AppView";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";
import { hp } from "../../constants/dimension";
import { sizes } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../api/apiClient";
import CustomAlert from "../../components/common/CustomAlert";
import { useCustomAlert } from "../../hooks/useCustomAlert";
import RbSheetComponet from "../../components/common/RbSheetComponet";
import CountrySelectionSheet from "../../components/BottomSheet/CountrySelectionSheet";

const countryCodes = [
    { id: 222, code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸' },
    { id: 2, code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦' },
    { id: 221, code: 'GB', name: 'United Kingdom', callingCode: '+44', flag: '🇬🇧' },
    { id: 96, code: 'IN', name: 'India', callingCode: '+91', flag: '🇮🇳' },
    { id: 160, code: 'PK', name: 'Pakistan', callingCode: '+92', flag: '🇵🇰' },
    { id: 4, code: 'AU', name: 'Australia', callingCode: '+61', flag: '🇦🇺' },
    { id: 78, code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪' },
    { id: 72, code: 'FR', name: 'France', callingCode: '+33', flag: '🇫🇷' },
];

const SignupScreen = () => {
    const { colors } = useTheme();
    const { showLoading, hideLoading } = useLoading();
    const navigation = useNavigation();
    const { alertConfig, hideAlert, showSuccess, showError } = useCustomAlert();
    const countryCodeSheetRef = useRef();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [countryCodeData, setCountryCodeData] = useState(countryCodes);
    const [country, setCountry] = useState({
        id: 222,
        code: 'US',
        name: 'United States',
        callingCode: '+1',
        flag: '🇺🇸',
    });

    const handleSelectCountry = (item) => {
        setCountry(item);
        countryCodeSheetRef?.current?.close();
    };

    const handleSearch = (text) => {
        const filteredData = countryCodes.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setCountryCodeData(filteredData);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!name || name.trim().length === 0) {
            newErrors.name = 'Please enter your name';
        }

        if (!email || email.trim().length === 0) {
            newErrors.email = 'Please enter your email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password || password.trim().length === 0) {
            newErrors.password = 'Please enter your password';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword || confirmPassword.trim().length === 0) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!phoneNumber || phoneNumber.trim().length === 0) {
            newErrors.phoneNumber = 'Please enter your phone number';
        } else if (phoneNumber.length < 8) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        showLoading('Creating account...');

        try {
            const fullPhone = country.callingCode + phoneNumber;
            const result = await apiClient.post('auth/register/', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: fullPhone,
                password: password,
                password_confirm: confirmPassword
            });
            console.log("first",result)
            if (result.problem === 'TIMEOUT_ERROR') {
                throw new Error('Request timeout');
            }

            if (result.problem === 'NETWORK_ERROR') {
                throw new Error('Network error');
            }

            if (result.ok) {
                showSuccess(
                    'An OTP has been sent to your email.',
                    'Account Created',
                    () => navigation.navigate('otp', { email: email.trim().toLowerCase() })
                );
            } else {
                // Handle field-specific errors from API
                const apiErrors = result.data?.errors;
                if (apiErrors) {
                    const newErrors = {};
                    let errorMessages = [];

                    if (apiErrors.email && Array.isArray(apiErrors.email)) {
                        newErrors.email = apiErrors.email[0];
                        errorMessages.push(apiErrors.email[0]);
                    }
                    if (apiErrors.name && Array.isArray(apiErrors.name)) {
                        newErrors.name = apiErrors.name[0];
                        errorMessages.push(apiErrors.name[0]);
                    }
                    if (apiErrors.phone && Array.isArray(apiErrors.phone)) {
                        newErrors.phoneNumber = apiErrors.phone[0];
                        errorMessages.push(apiErrors.phone[0]);
                    }
                    if (apiErrors.password && Array.isArray(apiErrors.password)) {
                        newErrors.password = apiErrors.password[0];
                        errorMessages.push(apiErrors.password[0]);
                    }
                    if (apiErrors.password_confirm && Array.isArray(apiErrors.password_confirm)) {
                        newErrors.confirmPassword = apiErrors.password_confirm[0];
                        errorMessages.push(apiErrors.password_confirm[0]);
                    }

                    setErrors(newErrors);
                    showError(errorMessages.join('\n') || 'Signup failed. Please try again.');
                } else {
                    const errorMessage = result.data?.message || result.data?.error || 'Signup failed. Please try again.';
                    showError(errorMessage);
                }
            }
        } catch (error) {
            let errorMessage = 'Network error. Please check your connection and try again.';
            if (error.message === 'Request timeout') {
                errorMessage = 'Request timed out. Please try again.';
            }
            showError(errorMessage);
        } finally {
            hideLoading();
        }
    };

    return (
        <AppView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerContainer}>
                    <AppText style={styles.title}>Create Account</AppText>
                    <AppText style={[styles.subtitle, { color: colors.secondaryText }]}>
                        Sign up to get started
                    </AppText>
                </View>

                <View style={styles.formContainer}>
                    <AppText style={styles.label}>Name</AppText>
                    <AppInput
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        autoCapitalize="words"
                        style={errors.name ? { borderColor: 'red' } : {}}
                    />
                    {errors.name ? (
                        <AppText style={styles.errorText}>{errors.name}</AppText>
                    ) : null}

                    <AppText style={[styles.label, { marginTop: hp(2) }]}>Email</AppText>
                    <AppInput
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={errors.email ? { borderColor: 'red' } : {}}
                    />
                    {errors.email ? (
                        <AppText style={styles.errorText}>{errors.email}</AppText>
                    ) : null}

                    <AppText style={[styles.label, { marginTop: hp(2) }]}>Password</AppText>
                    <AppInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors({ ...errors, password: '' });
                        }}
                        secureTextEntry
                        style={errors.password ? { borderColor: 'red' } : {}}
                    />
                    {errors.password ? (
                        <AppText style={styles.errorText}>{errors.password}</AppText>
                    ) : null}

                    <AppText style={[styles.label, { marginTop: hp(2) }]}>Confirm Password</AppText>
                    <AppInput
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                        }}
                        secureTextEntry
                        style={errors.confirmPassword ? { borderColor: 'red' } : {}}
                    />
                    {errors.confirmPassword ? (
                        <AppText style={styles.errorText}>{errors.confirmPassword}</AppText>
                    ) : null}

                    <AppText style={[styles.label, { marginTop: hp(2) }]}>Phone Number</AppText>
                    <View style={[
                        styles.phoneContainer,
                        { borderColor: errors.phoneNumber ? 'red' : colors.border }
                    ]}>
                        <TouchableOpacity
                            style={styles.flagWithCode}
                            onPress={() => countryCodeSheetRef?.current?.open()}
                        >
                            <AppText style={{ color: colors.text, fontSize: sizes.medium }}>
                                {country.flag} {country.callingCode}
                            </AppText>
                        </TouchableOpacity>
                        <View style={{ width: 10, height: hp(3), borderRightWidth: 2, borderRightColor: colors.border }} />
                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor={colors.placeholder}
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                            }}
                            keyboardType="phone-pad"
                            style={[styles.phoneInput, { color: colors.text }]}
                        />
                    </View>
                    {errors.phoneNumber ? (
                        <AppText style={styles.errorText}>{errors.phoneNumber}</AppText>
                    ) : null}
                </View>

                <AppButton
                    onPress={handleSignup}
                    title="Sign Up"
                    style={{ marginTop: hp(4) }}
                />

                <View style={styles.loginContainer}>
                    <AppText style={{ color: colors.secondaryText }}>
                        Already have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <AppText style={[styles.loginText, { color: colors.buttonColor }]}>
                            Login
                        </AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <RbSheetComponet
                ref={countryCodeSheetRef}
                height={hp(70)}
                bgColor={"green"}
                children={
                    <View style={{ flex: 1, backgroundColor: colors.background }}>
                        <CountrySelectionSheet
                            data={countryCodeData}
                            handlePressItem={handleSelectCountry}
                            handleSearch={handleSearch}
                            onClose={() => countryCodeSheetRef?.current?.close()}
                        />
                    </View>
                }
                wrapperColor={"red"}
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

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: hp(4),
    },
    headerContainer: {
        marginBottom: hp(4),
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },
    formContainer: {
        marginBottom: hp(2),
    },
    label: {
        fontSize: sizes.medium,
        fontWeight: '600',
        marginBottom: 4,
    },
    errorText: {
        color: 'red',
        fontSize: sizes.small,
        marginTop: 4,
    },
    phoneContainer: {
        flexDirection: 'row',
        height: 56,
        borderWidth: 2,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: hp(1),
        marginVertical: 6,
    },
    flagWithCode: {
        paddingRight: 10,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: sizes.medium,
        fontFamily: 'OpenSans-Regular',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(3),
    },
    loginText: {
        fontWeight: '600',
    },
});
