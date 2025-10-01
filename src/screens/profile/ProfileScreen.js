import React, { use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import pic from "../../../assets/splash-icon.png";
import AppView from '../../components/common/AppView';
import ThemeSwitch from '../../components/common/ThemeSwitch';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import { fonts } from '../../constants';
const ProfileScreen = ({ navigation }) => {
  const {colors}=useTheme();

  return (
    <AppView style={styles.container}>
      {/* Profile header */}
      <ThemeSwitch style={styles.switch} />
      <View style={styles.header}>
        <Image
          source={pic}
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
        <Feather name="user" size={20} color="#555" />
        <AppText style={styles.itemText}>Manage profile</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Notification'})}
      >
        <Feather name="bell" size={20} color="#555" />
        <AppText style={styles.itemText}>Notification</AppText>
      </TouchableOpacity>

      <TouchableOpacity
         style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Integration'})}
      >
        <Feather name="layers" size={20} color="#555" />
        <AppText style={styles.itemText}>Integration</AppText>
      </TouchableOpacity>

      <View   style={[styles.item1,{borderWidth:1,borderColor:colors.border}]}>
        <View style={{flexDirection:"row",gap:10}}>
        <Feather name="settings" size={20} color="#555" />
          <AppText style={styles.label}>Theme</AppText>
        </View>
          <ThemeSwitch style={styles.switch} />
          {/* <Switch value={settings[key]} onValueChange={() => toggle(key)} /> */}
        </View>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:'Settings'})}
      >
        <Feather name="settings" size={20} color="#555" />
        <AppText style={styles.itemText}>Settings</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, { borderWidth:1,borderColor:colors.border,marginTop: 20 }]}>
        <Feather name="log-out" size={20} color="red" />
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
  name: { fontSize: 18, fontWeight: '600' },
  phone: {  fontSize: 14 },
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
