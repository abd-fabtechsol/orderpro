import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { hp } from '../../constants/dimension';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';

const SettingsScreen = ({ navigation }) => {
  const {colors}=useTheme()
  return (
    <AppView style={styles.container}>
       <Header title="Settings"/>
       <View style={{marginBottom:hp(5)}}></View>
      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('PrivacyPolicy')}
      >
        <AppText style={styles.text}>Privacy Policy</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('term')}
      >
        <AppText style={styles.text}>Terms of Services</AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item,{borderWidth:1,borderColor:colors.border}]}
        onPress={() => navigation.navigate('HelpCenter')}
      >
        <AppText style={styles.text}>Help Center</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.delete,{borderWidth:1,borderColor:"red"}]}>
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
   
  },
  text: { fontSize: 16 ,fontWeight:"400"},
  delete: { marginTop: 20 },
});
