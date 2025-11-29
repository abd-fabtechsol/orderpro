import React, { useRef, useState } from "react";
import { View, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import pic1 from "../../../assets/market.png";
import pic from "../../../assets/order.png";
import googleImage from "../../../assets/google.png";
import { useTheme } from "../../context/ThemeContext";
import { useLoading } from "../../context/LoadingContext";
import AppView from "../../components/common/AppView";
import ThemeSwitch from "../../components/common/ThemeSwitch";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import { hp } from "../../constants/dimension";
import CountrySelectionSheet from "../../components/BottomSheet/CountrySelectionSheet";
import RbSheetComponet from "../../components/common/RbSheetComponet";
import { sizes } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../api/apiClient";
import CustomAlert from "../../components/common/CustomAlert";
import { useCustomAlert } from "../../hooks/useCustomAlert";
import { useDispatch } from "react-redux";
import { clearToken } from "../../redux/authSlice";
const { width } = Dimensions.get("window");

const slides = [
    {
        id: 1,
        image: pic1, // replace with your asset
        title: "All Your Suppliers, One Place",
        subtitle: "Add and manage suppliers in one place."
    },
    {
        id: 2,
        image: pic, // replace with your asset
        title: "Simple & Fast Ordering",
        subtitle: "Send orders in just a few taps."
    }
];

const LoginScreen = () => {
    const { colors } = useTheme();
    const { showLoading, hideLoading } = useLoading();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { alertConfig, hideAlert, showSuccess, showError, showAlert } = useCustomAlert();
    const countryCodeSheetRef = useRef();
    const [countryCodeData, setCountryCodeData] = useState(countryCodes);
    const [phoneNumer, setPhoneNumber] = useState(__DEV__ ? '3176144904' : '');
    const [phoneError, setPhoneError] = useState('');
    const [country, setCountry] = useState({
        id: 222,
        code: 'US',
        name: 'United States',
        callingCode: '+1',
        flag: '🇺🇸',
    });

    const handleSelectCountry = item => {
        setCountry(item);
        countryCodeSheetRef?.current?.close();
    };

    const handleSearch = text => {
        const filteredData = countryCodes.filter(item => {
            return item.name.toLowerCase().includes(text.toLowerCase());
        });
        setCountryCodeData(filteredData);
    };

    const handleSubmit = async () => {
        // Clear previous errors
        setPhoneError('');

        // Validation
        if (!phoneNumer || phoneNumer.trim().length === 0) {
            setPhoneError('Please enter your phone number');
            return;
        }

        if (phoneNumer.length < 8) {
            setPhoneError('Please enter a valid phone number');
            return;
        }

        // Start loading
        showLoading('Sending OTP...');

        // Clear token before login API call
        dispatch(clearToken());

        try {
            const fullPhone = country.callingCode + phoneNumer;
            const result = await apiClient.post('auth/login/', { phone: fullPhone });

            console.log("Login API Result:", result);

            if (result.ok) {
                // Success - navigate to OTP screen
                showSuccess(
                    'An OTP has been sent to your phone number.',
                    'OTP Sent',
                    () => navigation.navigate('otp', { phone: fullPhone })
                );
            } else {
                // API returned error
                const errorMessage = result.data?.message || result.data?.error || 'Failed to send OTP. Please try again.';
                setPhoneError(errorMessage);
                showError(errorMessage);
            }
        } catch (error) {
            // Network or other error
            console.error('Login error:', error);
            const errorMessage = 'Network error. Please check your connection and try again.';
            setPhoneError(errorMessage);
            showError(errorMessage);
        } finally {
            // Stop loading
            hideLoading();
        }
    }
    return (
        <AppView style={styles.container}>
            {/* <ThemeSwitch style={styles.switch} /> */}
            <Swiper
                style={styles.wrapper}
                showsPagination={true}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                loop={false}
            >
                {slides.map((item) => (
                    <View key={item.id} style={styles.slide}>
                        <Image source={item.image} style={styles.image} resizeMode="contain" />
                        <AppText style={[styles.title]}>{item.title}</AppText>
                        <AppText style={[styles.subtitle, { color: colors.secondaryText }]}>{item.subtitle}</AppText>
                    </View>
                ))}
            </Swiper>

            {/* Input */}


            <View style={[styles.inputContainer, { borderColor: phoneError ? 'red' : colors.border, marginBottom: hp(2) }]}>
                <TouchableOpacity
                    style={styles.flagWithCode}
                    onPress={() => countryCodeSheetRef?.current?.open()}>
                    <AppText style={{ color: colors.text, fontSize: sizes.medium }} >
                        {country.flag}
                        {country.callingCode}
                    </AppText>
                </TouchableOpacity>
                <View style={{ width: 10,height:hp(3),borderRightWidth:2,borderRightColor:colors.border }} />
                <TextInput
                    placeholder={'Phone number'}
                    placeholderTextColor={colors.secondaryText}
                    value={phoneNumer}
                    onChangeText={text => {
                        setPhoneNumber(text);
                        setPhoneError('');
                    }}
                    keyboardType="phone-pad"
                    style={[styles.input,{ color: colors.text }]}
                />
            </View>

            {/* Error Message */}
            {phoneError ? (
                <AppText style={styles.errorText}>{phoneError}</AppText>
            ) : null}

            {/* Continue Button */}
            <AppButton
                onPress={handleSubmit}
                title="Continue with phone"
            />

            <AppButton
                image={googleImage}
                title="Continue with google"
                onPress={() => showAlert({
                    title: 'Coming Soon',
                    message: 'Google sign-in will be available soon!',
                    type: 'info',
                })}
                style={{
                    marginTop: 10,
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderColor: colors.border
                }}
                textStyle={{ color: colors.text }}
            />
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

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '20',
    },
    wrapper: {
        flexGrow: 0,
        height: "65%",
    },
    slide: {
        // flex: 1,
       
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    image: {
        width: width * 0.6,
        height: hp(30),
        alignSelf: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    dot: {
        backgroundColor: "#ccc",
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: "#1DBF72",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        height: 56,
        borderWidth: 2,
        borderRadius: hp(1),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hp(1),

    },
    input: {
        flex: 1,
        paddingHorizontal: 5,
        fontSize: sizes.medium,
        fontFamily: 'OpenSans-Regular',
        color: 'black',
        // backgroundColor:"red",
    },
    flagWithCode: {
        paddingRight: 10,
    },
    errorText: {
        color: 'red',
        fontSize: sizes.small,
        marginBottom: 10,
        marginTop: -10,
        paddingHorizontal: 5,
    },

});
export const countryCodes = [
    { id: 2, code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦' },
    { id: 4, code: 'AU', name: 'Australia', callingCode: '+61', flag: '🇦🇺' },
    { id: 5, code: 'AF', name: 'Afghanistan', callingCode: '+93', flag: '🇦🇫' },
    { id: 6, code: 'AL', name: 'Albania', callingCode: '+355', flag: '🇦🇱' },
    { id: 7, code: 'DZ', name: 'Algeria', callingCode: '+213', flag: '🇩🇿' },
    { id: 8, code: 'AS', name: 'American Samoa', callingCode: '+1684', flag: '🇦🇸' },
    { id: 9, code: 'AD', name: 'Andorra', callingCode: '+376', flag: '🇦🇩' },
    { id: 10, code: 'AO', name: 'Angola', callingCode: '+244', flag: '🇦🇴' },
    { id: 11, code: 'AI', name: 'Anguilla', callingCode: '+1264', flag: '🇦🇮' },
    { id: 12, code: 'AQ', name: 'Antarctica', callingCode: '+672', flag: '🇦🇶' },
    {
        id: 13,
        code: 'AG',
        name: 'Antigua and Barbuda',
        callingCode: '+1268',
        flag: '🇦🇬',
    },
    { id: 14, code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷' },
    { id: 15, code: 'AM', name: 'Armenia', callingCode: '+374', flag: '🇦🇲' },
    { id: 16, code: 'AW', name: 'Aruba', callingCode: '+297', flag: '🇦🇼' },
    { id: 17, code: 'AT', name: 'Austria', callingCode: '+43', flag: '🇦🇹' },
    { id: 18, code: 'AZ', name: 'Azerbaijan', callingCode: '+994', flag: '🇦🇿' },
    { id: 19, code: 'BS', name: 'Bahamas', callingCode: '+1242', flag: '🇧🇸' },
    { id: 20, code: 'BH', name: 'Bahrain', callingCode: '+973', flag: '🇧🇭' },
    { id: 21, code: 'BD', name: 'Bangladesh', callingCode: '+880', flag: '🇧🇩' },
    { id: 22, code: 'BB', name: 'Barbados', callingCode: '+1246', flag: '🇧🇧' },
    { id: 23, code: 'BY', name: 'Belarus', callingCode: '+375', flag: '🇧🇾' },
    { id: 24, code: 'BE', name: 'Belgium', callingCode: '+32', flag: '🇧🇪' },
    { id: 25, code: 'BZ', name: 'Belize', callingCode: '+501', flag: '🇧🇿' },
    { id: 26, code: 'BJ', name: 'Benin', callingCode: '+229', flag: '🇧🇯' },
    { id: 27, code: 'BM', name: 'Bermuda', callingCode: '+1441', flag: '🇧🇲' },
    { id: 28, code: 'BT', name: 'Bhutan', callingCode: '+975', flag: '🇧🇹' },
    { id: 29, code: 'BO', name: 'Bolivia', callingCode: '+591', flag: '🇧🇴' },
    {
        id: 30,
        code: 'BA',
        name: 'Bosnia and Herzegovina',
        callingCode: '+387',
        flag: '🇧🇦',
    },
    { id: 31, code: 'BW', name: 'Botswana', callingCode: '+267', flag: '🇧🇼' },
    { id: 32, code: 'BR', name: 'Brazil', callingCode: '+55', flag: '🇧🇷' },
    {
        id: 33,
        code: 'IO',
        name: 'British Indian Ocean Territory',
        callingCode: '+246',
        flag: '🇮🇴',
    },
    { id: 34, code: 'BN', name: 'Brunei', callingCode: '+673', flag: '🇧🇳' },
    { id: 35, code: 'BG', name: 'Bulgaria', callingCode: '+359', flag: '🇧🇬' },
    { id: 36, code: 'BF', name: 'Burkina Faso', callingCode: '+226', flag: '🇧🇫' },
    { id: 37, code: 'BI', name: 'Burundi', callingCode: '+257', flag: '🇧🇮' },
    { id: 38, code: 'KH', name: 'Cambodia', callingCode: '+855', flag: '🇰🇭' },
    { id: 39, code: 'CM', name: 'Cameroon', callingCode: '+237', flag: '🇨🇲' },
    { id: 40, code: 'CV', name: 'Cape Verde', callingCode: '+238', flag: '🇨🇻' },
    {
        id: 41,
        code: 'KY',
        name: 'Cayman Islands',
        callingCode: '+1345',
        flag: '🇰🇾',
    },
    {
        id: 42,
        code: 'CF',
        name: 'Central African Republic',
        callingCode: '+236',
        flag: '🇨🇫',
    },
    { id: 43, code: 'TD', name: 'Chad', callingCode: '+235', flag: '🇹🇩' },
    { id: 44, code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱' },
    { id: 45, code: 'CN', name: 'China', callingCode: '+86', flag: '🇨🇳' },
    { id: 46, code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴' },
    { id: 47, code: 'miles', name: 'Comoros', callingCode: '+269', flag: '🇰🇲' },
    { id: 48, code: 'CG', name: 'Congo', callingCode: '+242', flag: '🇨🇬' },
    { id: 49, code: 'CD', name: 'Congo (DRC)', callingCode: '+243', flag: '🇨🇩' },
    { id: 50, code: 'CK', name: 'Cook Islands', callingCode: '+682', flag: '🇨🇰' },
    { id: 51, code: 'CR', name: 'Costa Rica', callingCode: '+506', flag: '🇨🇷' },
    { id: 52, code: 'CI', name: 'Côte d’Ivoire', callingCode: '+225', flag: '🇨🇮' },
    { id: 53, code: 'HR', name: 'Croatia', callingCode: '+385', flag: '🇭🇷' },
    { id: 54, code: 'CU', name: 'Cuba', callingCode: '+53', flag: '🇨🇺' },
    { id: 55, code: 'CY', name: 'Cyprus', callingCode: '+357', flag: '🇨🇾' },
    { id: 56, code: 'CZ', name: 'Czech Republic', callingCode: '+420', flag: '🇨🇿' },
    { id: 57, code: 'DK', name: 'Denmark', callingCode: '+45', flag: '🇩🇰' },
    { id: 58, code: 'DJ', name: 'Djibouti', callingCode: '+253', flag: '🇩🇯' },
    { id: 59, code: 'DM', name: 'Dominica', callingCode: '+1767', flag: '🇩🇲' },
    {
        id: 60,
        code: 'DO',
        name: 'Dominican Republic',
        callingCode: '+1',
        flag: '🇩🇴',
    },
    { id: 61, code: 'EC', name: 'Ecuador', callingCode: '+593', flag: '🇪🇨' },
    { id: 62, code: 'EG', name: 'Egypt', callingCode: '+20', flag: '🇪🇬' },
    { id: 63, code: 'SV', name: 'El Salvador', callingCode: '+503', flag: '🇸🇻' },
    {
        id: 64,
        code: 'GQ',
        name: 'Equatorial Guinea',
        callingCode: '+240',
        flag: '🇬🇶',
    },
    { id: 65, code: 'ER', name: 'Eritrea', callingCode: '+291', flag: '🇪🇷' },
    { id: 66, code: 'EE', name: 'Estonia', callingCode: '+372', flag: '🇪🇪' },
    { id: 67, code: 'ET', name: 'Ethiopia', callingCode: '+251', flag: '🇪🇹' },
    {
        id: 68,
        code: 'FK',
        name: 'Falkland Islands',
        callingCode: '+500',
        flag: '🇫🇰',
    },
    { id: 69, code: 'FO', name: 'Faroe Islands', callingCode: '+298', flag: '🇫🇴' },
    { id: 70, code: 'FJ', name: 'Fiji', callingCode: '+679', flag: '🇫🇯' },
    { id: 71, code: 'FI', name: 'Finland', callingCode: '+358', flag: '🇫🇮' },
    { id: 72, code: 'FR', name: 'France', callingCode: '+33', flag: '🇫🇷' },
    { id: 73, code: 'GF', name: 'French Guiana', callingCode: '+594', flag: '🇬🇫' },
    {
        id: 74,
        code: 'PF',
        name: 'French Polynesia',
        callingCode: '+689',
        flag: '🇵🇫',
    },
    { id: 75, code: 'GA', name: 'Gabon', callingCode: '+241', flag: '🇬🇦' },
    { id: 76, code: 'GM', name: 'Gambia', callingCode: '+220', flag: '🇬🇲' },
    { id: 77, code: 'GE', name: 'Georgia', callingCode: '+995', flag: '🇬🇪' },
    { id: 78, code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪' },
    { id: 79, code: 'GH', name: 'Ghana', callingCode: '+233', flag: '🇬🇭' },
    { id: 80, code: 'GI', name: 'Gibraltar', callingCode: '+350', flag: '🇬🇮' },
    { id: 81, code: 'GR', name: 'Greece', callingCode: '+30', flag: '🇬🇷' },
    { id: 82, code: 'GL', name: 'Greenland', callingCode: '+299', flag: '🇬🇱' },
    { id: 83, code: 'GD', name: 'Grenada', callingCode: '+1473', flag: '🇬🇩' },
    { id: 84, code: 'GP', name: 'Guadeloupe', callingCode: '+590', flag: '🇬🇵' },
    { id: 85, code: 'GU', name: 'Guam', callingCode: '+1671', flag: '🇬🇺' },
    { id: 86, code: 'GT', name: 'Guatemala', callingCode: '+502', flag: '🇬🇹' },
    { id: 87, code: 'GG', name: 'Guernsey', callingCode: '+44', flag: '🇬🇬' },
    { id: 88, code: 'GN', name: 'Guinea', callingCode: '+224', flag: '🇬🇳' },
    { id: 89, code: 'GW', name: 'Guinea-Bissau', callingCode: '+245', flag: '🇬🇼' },
    { id: 90, code: 'GY', name: 'Guyana', callingCode: '+592', flag: '🇬🇾' },
    { id: 91, code: 'HT', name: 'Haiti', callingCode: '+509', flag: '🇭🇹' },
    { id: 92, code: 'HN', name: 'Honduras', callingCode: '+504', flag: '🇭🇳' },
    { id: 93, code: 'HK', name: 'Hong Kong', callingCode: '+852', flag: '🇭🇰' },
    { id: 94, code: 'HU', name: 'Hungary', callingCode: '+36', flag: '🇭🇺' },
    { id: 95, code: 'IS', name: 'Iceland', callingCode: '+354', flag: '🇮🇸' },
    { id: 96, code: 'IN', name: 'India', callingCode: '+91', flag: '🇮🇳' },
    { id: 97, code: 'ID', name: 'Indonesia', callingCode: '+62', flag: '🇮🇩' },
    { id: 98, code: 'IR', name: 'Iran', callingCode: '+98', flag: '🇮🇷' },
    { id: 99, code: 'IQ', name: 'Iraq', callingCode: '+964', flag: '🇮🇶' },
    { id: 100, code: 'IE', name: 'Ireland', callingCode: '+353', flag: '🇮🇪' },
    { id: 101, code: 'IL', name: 'Israel', callingCode: '+972', flag: '🇮🇱' },
    { id: 102, code: 'IT', name: 'Italy', callingCode: '+39', flag: '🇮🇹' },
    { id: 103, code: 'JM', name: 'Jamaica', callingCode: '+1876', flag: '🇯🇲' },
    { id: 104, code: 'JP', name: 'Japan', callingCode: '+81', flag: '🇯🇵' },
    { id: 105, code: 'JE', name: 'Jersey', callingCode: '+44', flag: '🇯🇪' },
    { id: 106, code: 'JO', name: 'Jordan', callingCode: '+962', flag: '🇯🇴' },
    { id: 107, code: 'KZ', name: 'Kazakhstan', callingCode: '+7', flag: '🇰🇿' },
    { id: 108, code: 'KE', name: 'Kenya', callingCode: '+254', flag: '🇰🇪' },
    { id: 109, code: 'KI', name: 'Kiribati', callingCode: '+686', flag: '🇰🇮' },
    { id: 110, code: 'KP', name: 'North Korea', callingCode: '+850', flag: '🇰🇵' },
    { id: 111, code: 'KR', name: 'South Korea', callingCode: '+82', flag: '🇰🇷' },
    { id: 112, code: 'KW', name: 'Kuwait', callingCode: '+965', flag: '🇰🇼' },
    { id: 113, code: 'KG', name: 'Kyrgyzstan', callingCode: '+996', flag: '🇰🇬' },
    { id: 114, code: 'LA', name: 'Laos', callingCode: '+856', flag: '🇱🇦' },
    { id: 115, code: 'LV', name: 'Latvia', callingCode: '+371', flag: '🇱🇻' },
    { id: 116, code: 'LB', name: 'Lebanon', callingCode: '+961', flag: '🇱🇧' },
    { id: 117, code: 'LS', name: 'Lesotho', callingCode: '+266', flag: '🇱🇸' },
    { id: 118, code: 'LR', name: 'Liberia', callingCode: '+231', flag: '🇱🇷' },
    { id: 119, code: 'LY', name: 'Libya', callingCode: '+218', flag: '🇱🇾' },
    { id: 120, code: 'LI', name: 'Liechtenstein', callingCode: '+423', flag: '🇱🇮' },
    { id: 121, code: 'LT', name: 'Lithuania', callingCode: '+370', flag: '🇱🇹' },
    { id: 122, code: 'LU', name: 'Luxembourg', callingCode: '+352', flag: '🇱🇺' },
    { id: 123, code: 'MO', name: 'Macau', callingCode: '+853', flag: '🇲🇴' },
    {
        id: 124,
        code: 'MK',
        name: 'North Macedonia',
        callingCode: '+389',
        flag: '🇲🇰',
    },
    { id: 125, code: 'MG', name: 'Madagascar', callingCode: '+261', flag: '🇲🇬' },
    { id: 126, code: 'MW', name: 'Malawi', callingCode: '+265', flag: '🇲🇼' },
    { id: 127, code: 'MY', name: 'Malaysia', callingCode: '+60', flag: '🇲🇾' },
    { id: 128, code: 'MV', name: 'Maldives', callingCode: '+960', flag: '🇲🇻' },
    { id: 129, code: 'ML', name: 'Mali', callingCode: '+223', flag: '🇲🇱' },
    { id: 130, code: 'MT', name: 'Malta', callingCode: '+356', flag: '🇲🇹' },
    {
        id: 131,
        code: 'MH',
        name: 'Marshall Islands',
        callingCode: '+692',
        flag: '🇲🇭',
    },
    { id: 132, code: 'MQ', name: 'Martinique', callingCode: '+596', flag: '🇲🇶' },
    { id: 133, code: 'MR', name: 'Mauritania', callingCode: '+222', flag: '🇲🇷' },
    { id: 134, code: 'MU', name: 'Mauritius', callingCode: '+230', flag: '🇲🇺' },
    { id: 135, code: 'YT', name: 'Mayotte', callingCode: '+262', flag: '🇾🇹' },
    { id: 136, code: 'MX', name: 'Mexico', callingCode: '+52', flag: '🇲🇽' },
    { id: 137, code: 'FM', name: 'Micronesia', callingCode: '+691', flag: '🇫🇲' },
    { id: 138, code: 'MD', name: 'Moldova', callingCode: '+373', flag: '🇲🇩' },
    { id: 139, code: 'MC', name: 'Monaco', callingCode: '+377', flag: '🇲🇨' },
    { id: 140, code: 'MN', name: 'Mongolia', callingCode: '+976', flag: '🇲🇳' },
    { id: 141, code: 'ME', name: 'Montenegro', callingCode: '+382', flag: '🇲🇪' },
    { id: 142, code: 'MS', name: 'Montserrat', callingCode: '+1664', flag: '🇲🇸' },
    { id: 143, code: 'MA', name: 'Morocco', callingCode: '+212', flag: '🇲🇦' },
    { id: 144, code: 'MZ', name: 'Mozambique', callingCode: '+258', flag: '🇲🇿' },
    { id: 145, code: 'MM', name: 'Myanmar', callingCode: '+95', flag: '🇲🇲' },
    { id: 146, code: 'NA', name: 'Namibia', callingCode: '+264', flag: '🇳🇦' },
    { id: 147, code: 'NR', name: 'Nauru', callingCode: '+674', flag: '🇳🇷' },
    { id: 148, code: 'NP', name: 'Nepal', callingCode: '+977', flag: '🇳🇵' },
    { id: 149, code: 'NL', name: 'Netherlands', callingCode: '+31', flag: '🇳🇱' },
    { id: 150, code: 'NC', name: 'New Caledonia', callingCode: '+687', flag: '🇳🇨' },
    { id: 151, code: 'NZ', name: 'New Zealand', callingCode: '+64', flag: '🇳🇿' },
    { id: 152, code: 'NI', name: 'Nicaragua', callingCode: '+505', flag: '🇳🇮' },
    { id: 153, code: 'NE', name: 'Niger', callingCode: '+227', flag: '🇳🇪' },
    { id: 154, code: 'NG', name: 'Nigeria', callingCode: '+234', flag: '🇳🇬' },
    { id: 155, code: 'NU', name: 'Niue', callingCode: '+683', flag: '🇳🇺' },
    {
        id: 156,
        code: 'NF',
        name: 'Norfolk Island',
        callingCode: '+672',
        flag: '🇳🇫',
    },
    {
        id: 157,
        code: 'MP',
        name: 'Northern Mariana Islands',
        callingCode: '+1670',
        flag: '🇲🇵',
    },
    { id: 158, code: 'NO', name: 'Norway', callingCode: '+47', flag: '🇳🇴' },
    { id: 159, code: 'OM', name: 'Oman', callingCode: '+968', flag: '🇴🇲' },
    { id: 160, code: 'PK', name: 'Pakistan', callingCode: '+92', flag: '🇵🇰' },
    { id: 161, code: 'PW', name: 'Palau', callingCode: '+680', flag: '🇵🇼' },
    { id: 162, code: 'PS', name: 'Palestine', callingCode: '+970', flag: '🇵🇸' },
    { id: 163, code: 'PA', name: 'Panama', callingCode: '+507', flag: '🇵🇦' },
    {
        id: 164,
        code: 'PG',
        name: 'Papua New Guinea',
        callingCode: '+675',
        flag: '🇵🇬',
    },
    { id: 165, code: 'PY', name: 'Paraguay', callingCode: '+595', flag: '🇵🇾' },
    { id: 166, code: 'PE', name: 'Peru', callingCode: '+51', flag: '🇵🇪' },
    { id: 167, code: 'PH', name: 'Philippines', callingCode: '+63', flag: '🇵🇭' },
    { id: 168, code: 'PL', name: 'Poland', callingCode: '+48', flag: '🇵🇱' },
    { id: 169, code: 'PT', name: 'Portugal', callingCode: '+351', flag: '🇵🇹' },
    { id: 170, code: 'PR', name: 'Puerto Rico', callingCode: '+1', flag: '🇵🇷' },
    { id: 171, code: 'QA', name: 'Qatar', callingCode: '+974', flag: '🇶🇦' },
    { id: 172, code: 'RE', name: 'Reunion', callingCode: '+262', flag: '🇷🇪' },
    { id: 173, code: 'RO', name: 'Romania', callingCode: '+40', flag: '🇷🇴' },
    { id: 174, code: 'RU', name: 'Russia', callingCode: '+7', flag: '🇷🇺' },
    { id: 175, code: 'RW', name: 'Rwanda', callingCode: '+250', flag: '🇷🇼' },
    { id: 176, code: 'SH', name: 'Saint Helena', callingCode: '+290', flag: '🇸🇭' },
    {
        id: 177,
        code: 'KN',
        name: 'Saint Kitts and Nevis',
        callingCode: '+1869',
        flag: '🇰🇳',
    },
    { id: 178, code: 'LC', name: 'Saint Lucia', callingCode: '+1758', flag: '🇱🇨' },
    {
        id: 179,
        code: 'PM',
        name: 'Saint Pierre and Miquelon',
        callingCode: '+508',
        flag: '🇵🇲',
    },
    {
        id: 180,
        code: 'VC',
        name: 'Saint Vincent and the Grenadines',
        callingCode: '+1784',
        flag: '🇻🇨',
    },
    { id: 181, code: 'WS', name: 'Samoa', callingCode: '+685', flag: '🇼🇸' },
    { id: 182, code: 'SM', name: 'San Marino', callingCode: '+378', flag: '🇸🇲' },
    {
        id: 183,
        code: 'ST',
        name: 'Sao Tome and Principe',
        callingCode: '+239',
        flag: '🇸🇹',
    },
    { id: 184, code: 'SA', name: 'Saudi Arabia', callingCode: '+966', flag: '🇸🇦' },
    { id: 185, code: 'SN', name: 'Senegal', callingCode: '+221', flag: '🇸🇳' },
    { id: 186, code: 'RS', name: 'Serbia', callingCode: '+381', flag: '🇷🇸' },
    { id: 187, code: 'SC', name: 'Seychelles', callingCode: '+248', flag: '🇸🇨' },
    { id: 188, code: 'SL', name: 'Sierra Leone', callingCode: '+232', flag: '🇸🇱' },
    { id: 189, code: 'SG', name: 'Singapore', callingCode: '+65', flag: '🇸🇬' },
    { id: 190, code: 'SK', name: 'Slovakia', callingCode: '+421', flag: '🇸🇰' },
    { id: 191, code: 'SI', name: 'Slovenia', callingCode: '+386', flag: '🇸🇮' },
    {
        id: 192,
        code: 'SB',
        name: 'Solomon Islands',
        callingCode: '+677',
        flag: '🇸🇧',
    },
    { id: 193, code: 'SO', name: 'Somalia', callingCode: '+252', flag: '🇸🇴' },
    { id: 194, code: 'ZA', name: 'South Africa', callingCode: '+27', flag: '🇿🇦' },
    { id: 195, code: 'SS', name: 'South Sudan', callingCode: '+211', flag: '🇸🇸' },
    { id: 196, code: 'ES', name: 'Spain', callingCode: '+34', flag: '🇪🇸' },
    { id: 197, code: 'LK', name: 'Sri Lanka', callingCode: '+94', flag: '🇱🇰' },
    { id: 198, code: 'SD', name: 'Sudan', callingCode: '+249', flag: '🇸🇩' },
    { id: 199, code: 'SR', name: 'Suriname', callingCode: '+597', flag: '🇸🇷' },
    { id: 200, code: 'SZ', name: 'Eswatini', callingCode: '+268', flag: '🇸🇿' },
    { id: 201, code: 'SE', name: 'Sweden', callingCode: '+46', flag: '🇸🇪' },
    { id: 202, code: 'CH', name: 'Switzerland', callingCode: '+41', flag: '🇨🇭' },
    { id: 203, code: 'SY', name: 'Syria', callingCode: '+963', flag: '🇸🇾' },
    { id: 204, code: 'TW', name: 'Taiwan', callingCode: '+886', flag: '🇹🇼' },
    { id: 205, code: 'TJ', name: 'Tajikistan', callingCode: '+992', flag: '🇹🇯' },
    { id: 206, code: 'TZ', name: 'Tanzania', callingCode: '+255', flag: '🇹🇿' },
    { id: 207, code: 'TH', name: 'Thailand', callingCode: '+66', flag: '🇹🇭' },
    { id: 208, code: 'TL', name: 'Timor-Leste', callingCode: '+670', flag: '🇹🇱' },
    { id: 209, code: 'TG', name: 'Togo', callingCode: '+228', flag: '🇹🇬' },
    { id: 210, code: 'TK', name: 'Tokelau', callingCode: '+690', flag: '🇹🇰' },
    { id: 211, code: 'TO', name: 'Tonga', callingCode: '+676', flag: '🇹🇴' },
    {
        id: 212,
        code: 'TT',
        name: 'Trinidad and Tobago',
        callingCode: '+1868',
        flag: '🇹🇹',
    },
    { id: 213, code: 'TN', name: 'Tunisia', callingCode: '+216', flag: '🇹🇳' },
    { id: 214, code: 'TR', name: 'Turkey', callingCode: '+90', flag: '🇹🇷' },
    { id: 215, code: 'TM', name: 'Turkmenistan', callingCode: '+993', flag: '🇹🇲' },
    {
        id: 216,
        code: 'TC',
        name: 'Turks and Caicos Islands',
        callingCode: '+1649',
        flag: '🇹🇨',
    },
    { id: 217, code: 'TV', name: 'Tuvalu', callingCode: '+688', flag: '🇹🇻' },
    { id: 218, code: 'UG', name: 'Uganda', callingCode: '+256', flag: '🇺🇬' },
    { id: 219, code: 'UA', name: 'Ukraine', callingCode: '+380', flag: '🇺🇦' },
    {
        id: 220,
        code: 'AE',
        name: 'United Arab Emirates',
        callingCode: '+971',
        flag: '🇦🇪',
    },
    { id: 221, code: 'GB', name: 'United Kingdom', callingCode: '+44', flag: '🇬🇧' },
    { id: 222, code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸' },
    { id: 223, code: 'UY', name: 'Uruguay', callingCode: '+598', flag: '🇺🇾' },
    { id: 224, code: 'UZ', name: 'Uzbekistan', callingCode: '+998', flag: '🇺🇿' },
    { id: 225, code: 'VU', name: 'Vanuatu', callingCode: '+678', flag: '🇻🇺' },
    { id: 226, code: 'VE', name: 'Venezuela', callingCode: '+58', flag: '🇻🇪' },
    { id: 227, code: 'VN', name: 'Vietnam', callingCode: '+84', flag: '🇻🇳' },
    {
        id: 228,
        code: 'VI',
        name: 'U.S. Virgin Islands',
        callingCode: '+1340',
        flag: '🇻🇮',
    },
    {
        id: 229,
        code: 'WF',
        name: 'Wallis and Futuna',
        callingCode: '+681',
        flag: '🇼🇫',
    },
    {
        id: 230,
        code: 'EH',
        name: 'Western Sahara',
        callingCode: '+212',
        flag: '🇪🇭',
    },
    { id: 231, code: 'YE', name: 'Yemen', callingCode: '+967', flag: '🇾🇪' },
    { id: 232, code: 'ZM', name: 'Zambia', callingCode: '+260', flag: '🇿🇲' },
    { id: 233, code: 'ZW', name: 'Zimbabwe', callingCode: '+263', flag: '🇿🇼' },
];