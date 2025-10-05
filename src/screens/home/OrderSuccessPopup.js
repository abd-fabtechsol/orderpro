import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import pic from "../../../assets/check.png";
import { Image } from 'react-native';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
const OrderSuccessPopup = ({ visible, onClose }) => {
    const{colors,isDarkMode} = useTheme();
    const navigation=useNavigation()
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer,{backgroundColor:colors.background}]}>
          
            <Image source={pic} style={{width: 50, height: 50}} />
        
          <AppText style={styles.title}>Order Sent Successfully!</AppText>
          <AppText style={styles.message}>You're order has been sent successfully</AppText>
          <TouchableOpacity  onPress={()=>{
            navigation.navigate('ProfileDetails',{screen:'InvoiceScreen'})
            onClose()}
            }>
            <AppText style={styles.downloadText}>Download Invoice</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    
    padding: 20,
    borderWidth: 2,
   
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  checkmarkContainer: {
    backgroundColor: '#e0f7e0',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkmark: {
    fontSize: 30,
    color: '#28a745',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 15,
  },
  downloadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  downloadText: {
    color: '#28a745',
    fontWeight: '400',
    fontSize: 16,
  },
});

export default OrderSuccessPopup;