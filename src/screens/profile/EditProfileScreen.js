import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import pic from "../../../assets/splash-icon.png";
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import AppInput from '../../components/common/AppInput';
import { hp, wp } from '../../constants/dimension';
import io from "../../../assets/io.png"
import phone from "../../../assets/phone.png"
import email from "../../../assets/email.png"

const EditProfileScreen = () => {
  return (
    <AppView style={styles.container}>
      <View style={{flex:1}}>
<Header title="Profile"/>
      <View style={styles.avatarContainer}>
        <Image source={pic} style={styles.avatar} />
      </View>


      <AppInput icon={io} placeholder="Abdomarouan" />
      <AppInput icon={phone} placeholder="+1 (715) 644-5125" />
      <AppInput icon={email} placeholder="Enter your email" />
      </View>
      <TouchableOpacity style={styles.updateBtn}>
        <Text style={styles.updateText}>Update profile</Text>
      </TouchableOpacity>
    </AppView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: wp(50), height: wp(50), borderRadius: 40 ,marginTop:hp(5)},
  input: {
    
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  updateBtn: {
    backgroundColor: '#1DBF72',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateText: { color: '#fff', fontWeight: '400', fontSize: 18 },
});
