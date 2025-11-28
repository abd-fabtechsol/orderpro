import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,Linking, Platform } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { height, hp, width, wp } from "../../constants/dimension";
import { useTheme } from '../../context/ThemeContext';
import AppInput from '../../components/common/AppInput';
import AppText from '../../components/common/AppText';
import dlt from "../../../assets/trash1.png"
import Gmail from "../../../assets/Gmail.png"
import a23 from "../../../assets/23.png"
import AppButton from '../../components/common/AppButton';
import OrderSuccessPopup from './OrderSuccessPopup';
import { useRoute } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import CustomAlert from '../../components/common/CustomAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';

const OrderOverview = () => {
    const{colors}=useTheme()
    const route = useRoute();
    const { orderItems = [], supplier, supplierId } = route.params || {};
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [items, setItems] = useState(orderItems);
    const [orderNote, setOrderNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const { alertConfig, hideAlert, showError, showAlert } = useCustomAlert();
    // Remove item from order
    const handleRemoveItem = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    // Calculate total
    const calculateTotal = () => {
        return items.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.orderQuantity);
        }, 0).toFixed(2);
    };

    // Submit order to API
    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            showError('Please add items to your order');
            return;
        }

        setSubmitting(true);

        try {
            // Format items for API: [{id: productId, quantity: quantity}]
            const orderItems = items.map(item => ({
                product: item.id,
                quantity: item.orderQuantity
            }));

            const orderData = {
                items: orderItems,
                supplier: supplierId,
                total_amount: calculateTotal(),
                note: orderNote.trim() || ''
            };

            console.log('Submitting order:', orderData);

            const result = await apiClient.post('orders/', orderData);

            console.log('Order Result:', JSON.stringify(result));

            if (result.ok) {
                // Store the created order data for invoice
                setCreatedOrder(result.data);
                setPopupVisible(true);
                // Clear order note after successful submission
                setOrderNote('');
            } else {
                const errorMessage = result.data?.message || result.data?.error || 'Failed to create order. Please try again.';
                showError(errorMessage);
            }
        } catch (error) {
            console.error('Order Error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const phoneNumber = supplier?.phone?.replace(/\+/g, '') || "923001234567";
    const message = `Hello! I would like to place an order:\n${items.map(item => `${item.name} x ${item.orderQuantity}${item.unit_type}`).join('\n')}\n\nTotal: $${calculateTotal()}\n${orderNote ? `\nNote: ${orderNote}` : ''}`;

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
        showAlert({
          title: "WhatsApp not available",
          message: "Please install WhatsApp to continue.",
          type: "warning",
          buttons: [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open App Store",
              onPress: () =>
                Linking.openURL("https://apps.apple.com/app/whatsapp-messenger/id310633997"),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      showError("Could not open WhatsApp");
    }
  };

  return (
    <AppView style={styles.container}>
      {/* <Text style={styles.header}>Order Overview</Text> */}
      <Header title={"Order Overview"} />
      <ScrollView style={{marginTop:hp(3),flex:0.5}}>
      {/* Dynamic Order Items */}
      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={[styles.itemContainer,{borderColor:colors.border}]}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              resizeMode='contain'
            />
            <View style={styles.itemDetails}>
              <AppText style={styles.itemName}>{item.name} x {item.orderQuantity}{item.unit_type}</AppText>
              <AppText style={styles.itemPrice}>${(parseFloat(item.price) * item.orderQuantity).toFixed(2)}</AppText>
              <AppText style={styles.itemNote}>Note: "{item.note || 'No notes'}"</AppText>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
             <Image source={dlt} style={{width: 25, height: 25}} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
          <AppText style={{ fontSize: 16, color: '#888' }}>No items in order</AppText>
        </View>
      )}


      <AppInput
        multiline={true}
        numberOfLines={5}
        placeholder=" Note"
        value={orderNote}
        onChangeText={setOrderNote}
      />
      </ScrollView>

      {/* Summary Section */}
      <View style={{marginVertical:hp(3),flex:0.5}}>
      <View style={[styles.summaryContainer,{borderColor:colors.border}]}>
        {items.map((item) => (
          <View key={item.id} style={styles.summaryRow}>
            <AppText style={{fontSize:14,fontWeight:'300'}}>{item.name}</AppText>
            <AppText style={{fontSize:14,fontWeight:'300'}}>{item.orderQuantity}{item.unit_type}</AppText>
            <AppText style={{fontSize:14,fontWeight:'300'}}>${(parseFloat(item.price) * item.orderQuantity).toFixed(2)}</AppText>
          </View>
        ))}
        <View style={[styles.totalRow,{borderTopColor: colors.border}]}>
          <AppText style={{fontSize:16,fontWeight:'600'}}>Total</AppText>
          <AppText style={{fontSize:16,fontWeight:'600'}}>${calculateTotal()}</AppText>
        </View>
      </View>
      

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>

        <AppButton
          style={[styles.emailButton,{height:45,width:wp(42), opacity: submitting ? 0.7 : 1}]}
          image={Gmail}
          title={submitting ? "Submitting..." : "Via Email"}
          textStyle={{color:colors.text,fontSize:16}}
          onPress={async () => {
            await handleSubmitOrder();
          }}
          disabled={submitting || items.length === 0}
        />
        <AppButton
          style={{height:45,width:wp(42), opacity: submitting ? 0.7 : 1}}
          image={a23}
          title={submitting ? "Submitting..." : "Via Whatsapp"}
          textStyle={{fontSize:16}}
          onPress={async () => {
            await handleSubmitOrder();
            if (!submitting) {
              openWhatsApp();
            }
          }}
          disabled={submitting || items.length === 0}
        />

      </View>
      </View>
      <OrderSuccessPopup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        order={createdOrder}
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