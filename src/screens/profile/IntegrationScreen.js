import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import pic from "../../../assets/splash-icon.png";
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import Header from '../../components/Header';
import { hp, wp } from '../../constants/dimension';
import { useTheme } from '../../context/ThemeContext';
const IntegrationScreen = () => {
  const {colors}=useTheme()
  return (
    <AppView style={styles.container}>
      <Header title={"Integration"}/>
      <View style={{marginTop:hp(5),flexDirection:"row",justifyContent:"space-between"}}>
      <View style={[styles.card,{borderColor:colors.border}]}>
        <Image source={pic} style={styles.icon} />
        <View style={{marginTop:hp(1)}} >
          <AppText style={styles.title}>WhatsApp</AppText>
          <AppText style={styles.desc} weight={"medium"}>
            Integrate with WhatsApp to send order automatically to supplier.
          </AppText>
        </View>
        <TouchableOpacity style={{backgroundColor:"#1E293B",marginTop:hp(1) ,justifyContent:"center",alignItems:"center",padding:10,borderRadius:15}}>
        <AppText style={[styles.connected,{color:"#14B8A6"}]}>Connected</AppText>
        </TouchableOpacity>
      </View>

      <View style={[styles.card,{borderColor:colors.border}]}>
        <Image source={pic} style={styles.icon} />
        <View style={{marginTop:hp(1)}} >
          <AppText style={styles.title}>Gmail</AppText>
          <AppText style={styles.desc}>Connect with Gmail to send order and get invoices.</AppText>
        </View>
        <TouchableOpacity style={{backgroundColor:"#94A3B8",marginTop:hp(1) ,justifyContent:"center",alignItems:"center",padding:10,borderRadius:15}}>
          <AppText style={[styles.connect,{color:"white"}]}>Connect</AppText>
        </TouchableOpacity>
      </View>
      </View>
    </AppView>
  );
};

export default IntegrationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  card: {
    // flexDirection: 'row',
    // alignItems: 'center',
    borderWidth: 0.5,
    width:wp(43),
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  icon: { width: 40, height: 40, marginRight: 12 },
  title: { fontSize: 16, fontWeight: 500 },
  desc: { fontSize: 16,  marginTop: 4,fontWeight: 400 },
  connected: { color: '#1DBF72', fontWeight: '600' },
  connect: { color: '#1DBF72', fontWeight: '600' },
});
