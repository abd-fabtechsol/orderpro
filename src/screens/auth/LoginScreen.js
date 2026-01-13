import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import marketImage from "../../../assets/market.png";
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
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";

const LoginScreen = () => {
    const { colors } = useTheme();
    const { showLoading, hideLoading } = useLoading();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { alertConfig, hideAlert, showSuccess, showError } = useCustomAlert();

    const [email, setEmail] = useState(__DEV__ ? 'test@example.com' : '');
    const [password, setPassword] = useState(__DEV__ ? 'password123' : '');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        showLoading('Logging in...');

        try {
            const result = await apiClient.post('auth/login/', {
                email: email.trim().toLowerCase(),
                password: password
            });

            if (result.problem === 'TIMEOUT_ERROR') {
                throw new Error('Request timeout');
            }

            if (result.problem === 'NETWORK_ERROR') {
                throw new Error('Network error');
            }

            if (result.ok) {
                const { access, refresh, user } = result.data;

                // Store token and user data in Redux
                dispatch(login({
                    token: access,
                    refreshToken: refresh,
                    userData: user
                }));

                showSuccess(
                    'Login successful!',
                    'Success',
                    () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'MainTabs' }],
                        });
                    }
                );
            } else {
                const errorMessage = result.data?.message || result.data?.error || 'Login failed. Please try again.';
                showError(errorMessage);
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
                    <Image source={marketImage} style={styles.image} resizeMode="contain" />
                    <AppText style={styles.title}>Welcome Back</AppText>
                    <AppText style={[styles.subtitle, { color: colors.secondaryText }]}>
                        Sign in to continue
                    </AppText>
                </View>

                <View style={styles.formContainer}>
                    <AppText style={styles.label}>Email</AppText>
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
                </View>

                <AppButton
                    onPress={handleLogin}
                    title="Login"
                    style={{ marginTop: hp(4) }}
                />

                <View style={styles.signupContainer}>
                    <AppText style={{ color: colors.secondaryText }}>
                        Don't have an account?{' '}
                    </AppText>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <AppText style={[styles.signupText, { color: colors.buttonColor }]}>
                            Sign Up
                        </AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

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

export default LoginScreen;

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
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width * 0.5,
        height: hp(20),
        marginBottom: 20,
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(3),
    },
    signupText: {
        fontWeight: '600',
    },
});
