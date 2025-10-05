import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import pic from "../../../assets/security.png";
import finger from "../../../assets/finger.png";
import shieldw from "../../../assets/shieldw.png";
import fingerw from "../../../assets/fingerw.png";
import shield from "../../../assets/shield-tick.png";
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';
import AppButton from '../../components/common/AppButton';
import { sizes } from '../../constants';
import { hp, wp } from '../../constants/dimension';
import { useNavigation } from '@react-navigation/native';
const PasskeyScreen = () => {
    const {colors,isDarkMode}=useTheme()
    const navigation=useNavigation()
  return (
    <AppView style={styles.container}>
        <View style={{flex:1,justifyContent:"center"}}>

        
      <AppText style={[styles.title,{color:colors.text}]}>Fast and secure login with passkey</AppText>
      <AppText style={[styles.subtitle,{color:colors.text}]}>No more waiting for the code</AppText>
      
      <Image
        source={pic} // replace with your image
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.infoRow}>
      <Image source={isDarkMode?fingerw:finger} style={{width: 20, height: 20}} resizeMode="contain" />
        <AppText style={[styles.infoText,{color:colors.text}]}>
          Sign in with fingerprint, face, PIN or Pattern. We don’t collect any of this info.
        </AppText>
      </View>

      <View style={styles.infoRow}>
        {/* <Feather name="shield" size={20} color="#000" /> */}
        <Image source={isDarkMode?shieldw:shield} style={{width: 20, height: 20}} resizeMode="contain" />
        <AppText style={[styles.infoText,{color:colors.text}]}>
          Passkey is more secure, stored only on your device account.
        </AppText>
      </View>
      </View>
      <View >
      <AppButton title={'Setup'} onPress={() => {navigation.navigate("profile")}} />
      <AppButton title={'Skip'} style={{marginTop: 10,backgroundColor:"#E2E8F0"}} textStyle={{color:"#6B7280"}} onPress={() => {}} />
      </View>
      
    </AppView>
  );
};

export default PasskeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    
   
  },
  title: {
    fontSize: sizes.xlarge,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: sizes.normal,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  image: {
    height: hp(30),
    width: wp(80),
    alignSelf: 'center',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    color: '#555',
    fontSize: sizes.normal,
  },
  setupButton: {
    backgroundColor: '#1DBF72',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  setupText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  skipText: {
    textAlign: 'center',
    color: '#1DBF72',
    fontSize: 14,
  },
});
