import React, { use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import pic from "../../../assets/splash-icon.png";
import profile from "../../../assets/profile.png";
import profileDark from "../../../assets/profileDark.png";
import notificationSet from "../../../assets/notificationSet.png";
import notificationDark from "../../../assets/notificationDark.png";
import inte from "../../../assets/inte.png";
import inteDark from "../../../assets/inteDark.png";
import sun from "../../../assets/sun.png";
import qw from "../../../assets/qw.png";
import sunDark from "../../../assets/sunDark.png";
import setting from "../../../assets/settingDev.png";
import settingDark from "../../../assets/settingDark.png";
import logout from "../../../assets/logout.png";
import AppView from '../../components/common/AppView';
import ThemeSwitch from '../../components/common/ThemeSwitch';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import { fonts } from '../../constants';
const ProfileScreen = ({ navigation }) => {
  const {colors,isDarkMode}=useTheme();

  return (
    <AppView style={styles.container}>
      {/* Profile header */}
      <ThemeSwitch style={styles.switch} />
      <View style={styles.header}>
        <Image
          source={qw}
          style={styles.avatar}
        />
        <AppText style={styles.name}>Abdomarouan</AppText>
        <AppText style={styles.phone}>+1 (715) 644-5125</AppText>
      </View>

      {/* Menu items */}
      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'EditProfile'})}
      >
        {/* <Feather name="user" size={20} color="#555" /> */}
        <Image source={isDarkMode?profileDark:profile} style={{width: 24, height: 24}} resizeMode="contain" />
      
       
        <AppText style={styles.itemText}>Manage profile</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Notification'})}
      >
         <Image source={isDarkMode?notificationDark:notificationSet} style={{width: 24, height: 24}} resizeMode="contain" />
        <AppText style={styles.itemText}>Notification</AppText>
      </TouchableOpacity>

      <TouchableOpacity
         style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Integration'})}
      >
         <Image source={isDarkMode?inteDark:inte} style={{width: 24, height: 24}} resizeMode="contain" />
         
        <AppText style={styles.itemText}>Integration</AppText>
      </TouchableOpacity>

      <View   style={[styles.item1,{borderWidth:1,borderColor:colors.border}]}>
        <View style={{flexDirection:"row",gap:10}}>
        <Image source={isDarkMode?sunDark:sun} style={{width: 24, height: 24}} resizeMode="contain" />
        
          <AppText style={styles.label}>Theme</AppText>
        </View>
          <ThemeSwitch style={styles.switch} />
          {/* <Switch value={settings[key]} onValueChange={() => toggle(key)} /> */}
        </View>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Settings'})}
      >
      <Image source={isDarkMode?settingDark:setting} style={{width: 24, height: 24}} resizeMode="contain" />
     
        <AppText style={styles.itemText}>Settings</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderWidth:1,borderColor:colors.border,marginTop: 20 }]}>
      <Image source={logout} style={{width: 24, height: 24}} resizeMode="contain" />
        <AppText style={[styles.itemText, { color: 'red' }]}>Logout</AppText>
      </TouchableOpacity>
    </AppView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '600' },
  phone: {  fontSize: 16, fontWeight: '400',color:"#6B7280",marginTop:5 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius:10,
    marginBottom: 15,

   
  },
  item1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    paddingHorizontal: 15,
    paddingVertical:5,
    borderRadius:10,
    marginBottom: 15,

   
  },
  itemText: { marginLeft: 15, fontSize: 18,fontWeight:500},
});
