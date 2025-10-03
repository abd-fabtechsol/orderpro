import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { hp } from '../../constants/dimension';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import documentpic from "../../../assets/document-text.png";
import documentpicDark from "../../../assets/documentDark.png";
import inte from "../../../assets/inte.png";
import inteDark from "../../../assets/inteDark.png";
import circleDark from "../../../assets/info-circleDark.png";
import info from "../../../assets/info-circle.png";
import trash from "../../../assets/trash.png";

const SettingsScreen = ({ navigation }) => {
  const {colors,isDarkMode}=useTheme()
  return (
    <AppView style={styles.container}>
       <Header title="Settings"/>
       <View style={{marginBottom:hp(5)}}></View>
      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('PrivacyPolicy')}
      >
        <Image source={isDarkMode?documentpic:documentpicDark} style={{width: 30, height: 30}} resizeMode="contain" />
        <AppText style={styles.text}>Privacy Policy</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('term')}
      >
        <Image source={isDarkMode?inteDark:inte} style={{width: 30, height: 30}} resizeMode="contain" />
        <AppText style={styles.text}>Terms of Services</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('HelpCenter')}
      >
         <Image source={isDarkMode?info:circleDark} style={{width: 30, height: 30}} resizeMode="contain" />
        <AppText style={styles.text}>Help Center</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.delete,{borderWidth:1,borderColor:"red"}]}>
      <Image source={trash} style={{width: 30, height: 30}} resizeMode="contain" />
        <AppText style={[styles.text, { color: 'red' }]}>Delete Account</AppText>
      </TouchableOpacity>
    </AppView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    flexDirection:"row",
    gap:10,
    alignItems:"center"
   
  },
  text: { fontSize: 16 ,fontWeight:"400"},
  delete: { marginTop: 20 },
});
