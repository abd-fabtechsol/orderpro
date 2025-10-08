import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,Linking,Alert, Platform } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { height, hp, width, wp } from "../../constants/dimension";
import { useTheme } from '../../context/ThemeContext';
import AppInput from '../../components/common/AppInput';
import AppText from '../../components/common/AppText';
import dlt from "../../../assets/trash1.png"
import q1 from "../../../assets/1.png"
import q2 from "../../../assets/2.png"
import Gmail from "../../../assets/Gmail.png"
import a23 from "../../../assets/23.png"
import AppButton from '../../components/common/AppButton';
import OrderSuccessPopup from './OrderSuccessPopup';
const OrderOverview = () => {
    const{colors}=useTheme()
    const [isPopupVisible, setPopupVisible] = useState(false);
    const phoneNumber = "923001234567";  // your recipient’s number (country code + number)
  const message = "Hello! This is a test message 🚀";

  const openWhatsApp = async () => {
    // For Android use whatsapp://
    // For iOS use https://wa.me  
    const url =
      Platform.OS === "ios"
        ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        : `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // WhatsApp is not installed or URL not supported
        Alert.alert(
          "WhatsApp not available",
          "Please install WhatsApp to continue.",
          [
            {
              text: "Open App Store",
              onPress: () =>
                Linking.openURL("https://apps.apple.com/app/whatsapp-messenger/id310633997"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("Could not open WhatsApp");
    }
  };

  return (
    <AppView style={styles.container}>
      {/* <Text style={styles.header}>Order Overview</Text> */}
      <Header title={"Order Overview"} />
      <ScrollView style={{marginTop:hp(3),flex:0.5}}>
      {/* Goat Milk Item */}
      <View style={[styles.itemContainer,{borderColor:colors.border}]}>
        <Image
          source={q2}
          style={styles.itemImage}
          resizeMode='contain'
        />
        <View style={styles.itemDetails}>
          <AppText style={styles.itemName}>Goat Milk x 17L</AppText>
          <AppText style={styles.itemPrice}>$26.50</AppText>
          <AppText style={styles.itemNote}>Note: "Good quality, always fresh"</AppText>
        </View>
        <TouchableOpacity style={styles.removeButton}>
         <Image source={dlt} style={{width: 25, height: 25}} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={[styles.itemContainer,{borderColor:colors.border}]}>
        <Image
          source={q2}
          style={styles.itemImage}
          resizeMode='contain'
        />
        <View style={styles.itemDetails}>
          <AppText style={styles.itemName}>Goat Milk x 17L</AppText>
          <AppText style={styles.itemPrice}>$26.50</AppText>
          <AppText style={styles.itemNote}>Note: "Good quality, always fresh"</AppText>
        </View>
        <TouchableOpacity style={styles.removeButton}>
         <Image source={dlt} style={{width: 25, height: 25}} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={[styles.itemContainer,{borderColor:colors.border}]}>
        <Image
          source={q2}
          style={styles.itemImage}
          resizeMode='contain'
        />
        <View style={styles.itemDetails}>
          <AppText style={styles.itemName}>Goat Milk x 17L</AppText>
          <AppText style={styles.itemPrice}>$26.50</AppText>
          <AppText style={styles.itemNote}>Note: "Good quality, always fresh"</AppText>
        </View>
        <TouchableOpacity style={styles.removeButton}>
         <Image source={dlt} style={{width: 25, height: 25}} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <View style={[styles.itemContainer,{borderColor:colors.border}]}>
        <Image
          source={q2}
          style={styles.itemImage}
          resizeMode='contain'
        />
        <View style={styles.itemDetails}>
          <AppText style={styles.itemName}>Goat Milk x 17L</AppText>
          <AppText style={styles.itemPrice}>$26.50</AppText>
          <AppText style={styles.itemNote}>Note: "Good quality, always fresh"</AppText>
        </View>
        <TouchableOpacity style={styles.removeButton}>
         <Image source={dlt} style={{width: 25, height: 25}} resizeMode="contain" />
        </TouchableOpacity>
      </View>
     

     
      <AppInput multiline={true}
  numberOfLines={5} placeholder=" Note" />
      </ScrollView>

      {/* Summary Section */}
      <View style={{marginVertical:hp(3),flex:0.5}}>
      <View style={[styles.summaryContainer,{borderColor:colors.border}]}>
        <View style={styles.summaryRow}>
          <AppText style={{fontSize:14,fontWeight:300}}>Goat Milk</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>17L</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>$26.50</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText style={{fontSize:14,fontWeight:300}}>Cooking Oil</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>10L</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>$120</AppText>
        </View>
        <View style={styles.summaryRow}>
          <AppText style={{fontSize:14,fontWeight:300}}>Ethiopian Coffee</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>5 Pack</AppText>
          <AppText style={{fontSize:14,fontWeight:300}}>$75</AppText>
        </View>
        <View style={[styles.totalRow,{borderTopColor: colors.border}]}>
          <AppText tyle={{fontSize:16,fontWeight:600}}>Total</AppText>
          <AppText tyle={{fontSize:16,fontWeight:600}}>$221.50</AppText>
        </View>
      </View>
      

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        
        <AppButton style={[styles.emailButton,{height:45,width:wp(42)}]} image={Gmail} title={"Via Email"} textStyle={{color:colors.text,fontSize:16}} onPress={() => {setPopupVisible(true)}} />
        {/* <AppButton   style={{height:45,width:wp(42)}} image={a23} title={"Via Whatsapp"} textStyle={{fontSize:16}} onPress={() => {setPopupVisible(true)}} /> */}
        <AppButton   style={{height:45,width:wp(42)}} image={a23} title={"Via Whatsapp"} textStyle={{fontSize:16}} onPress={() => openWhatsApp()} />
        
      </View>
      </View>
      <OrderSuccessPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1,  borderRadius: 10, marginBottom: 10 },
  itemImage: { width: 60, height: 60, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500', },
  itemPrice: { fontSize: 16, color: 'green',marginTop:5 },
  itemNote: { fontSize: 12, color: 'gray',marginTop:5 },
  removeButton: { padding: 5 },
  removeText: { fontSize: 16 },
  notesHeader: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  summaryContainer: { marginTop: 10, padding: 10,borderWidth:1 ,borderRadius:10},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1,  },
  totalText: { fontWeight: 'bold' },
  totalPrice: { fontWeight: 'bold', color: 'green' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emailButton: { backgroundColor: '#D3D3D3'},
  whatsappButton: { backgroundColor: '#25D366', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default OrderOverview;