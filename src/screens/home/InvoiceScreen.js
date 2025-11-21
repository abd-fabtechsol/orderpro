import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';
import { height, hp, wp } from '../../constants/dimension';
import AppButton from '../../components/common/AppButton';
import apiClient from '../../api/apiClient';

const InvoiceScreen = ({ navigation, route }) => {
    const{colors}=useTheme()
    const { order } = route?.params || {};
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(order?.status);

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    // Get status display
    const getStatusDisplay = (status) => {
      if (!status) return 'Pending';
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    // Handle supplier
    const supplierName = typeof order?.supplier === 'object'
      ? (order.supplier?.name || 'N/A')
      : (order?.supplier || 'N/A');

    const supplierImage = typeof order?.supplier === 'object' && order.supplier?.image
      ? order.supplier.image
      : 'https://cdn-icons-png.flaticon.com/512/2909/2909753.png';

    // Get items array (API returns 'item' not 'items')
    const items = order?.item || order?.items || [];

    // Mark as Paid handler
    const handleMarkAsPaid = async () => {
      if (!order?.id) {
        Alert.alert('Error', 'Order ID not found');
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        'Confirm Payment',
        'Are you sure you want to mark this order as paid?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: async () => {
              setLoading(true);
              try {
                const result = await apiClient.patch(`orders/${order.id}/`, {
                  status: 'paid'
                });

                console.log('Mark as Paid Result:', JSON.stringify(result));

                if (result.ok) {
                  setOrderStatus('paid');
                  Alert.alert(
                    'Success',
                    'Order has been marked as paid successfully',
                    [
                      {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                      },
                    ]
                  );
                } else {
                  Alert.alert('Error', result.data?.message || 'Failed to update order status');
                }
              } catch (error) {
                console.error('Error marking order as paid:', error);
                Alert.alert('Error', 'An error occurred while updating the order');
              } finally {
                setLoading(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    };
  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerText}>Invoice</AppText>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppText style={styles.closeButton}>×</AppText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={[styles.invoiceCard,{backgroundColor:colors.search}]} contentContainerStyle={{paddingBottom: 20}}>
        <AppText style={styles.sectionTitle}>Order Invoice</AppText>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: supplierImage }}
            style={styles.logo}
            resizeMode='contain'
          />
          <AppText style={styles.companyName}>{supplierName}</AppText>
        </View>
        <AppText style={styles.infoText}>Invoice #: {order?.id ? `INV-${order.id}` : 'N/A'}</AppText>
        <AppText style={styles.infoText}>Date: {formatDate(order?.created_at)}</AppText>
        <AppText style={styles.infoText}>Status: {getStatusDisplay(orderStatus)}</AppText>
        <View style={styles.divider} />

        <View style={styles.tableHeader}>
          <AppText style={[styles.tableHeaderText, {flex: 0.5}]}>#</AppText>
          <AppText style={[styles.tableHeaderText, {flex: 2}]}>Product</AppText>
          <AppText style={[styles.tableHeaderText, {flex: 1}]}>Qty</AppText>
          <AppText style={[styles.tableHeaderText, {flex: 1}]}>Price</AppText>
        </View>
        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <AppText style={[styles.tableCell, {flex: 0.5}]}>{index + 1}</AppText>
            <AppText style={[styles.tableCell, {flex: 2}]}>{item.product_name || 'N/A'}</AppText>
            <AppText style={[styles.tableCell, {flex: 1}]}>{item.quantity || 0} {item.unit_type || ''}</AppText>
            <AppText style={[styles.tableCell, {flex: 1}]}>${item.price || 0}</AppText>
          </View>
        ))}
        <View style={styles.tableTotal}>
          <AppText style={styles.tableCell}>Total</AppText>
          <AppText style={styles.tableTotalPrice}>${order?.total_amount || 0}</AppText>
        </View>
        <View style={styles.divider} />
        
        <View style={[styles.buttonContainer,{justifyContent:"space-between",flexDirection:"row"}]}>
          <TouchableOpacity
            style={[
              styles.markAsPaidButton,
              {backgroundColor: colors.buttonColor},
              (orderStatus?.toLowerCase() === 'paid' || loading) && styles.disabledButton
            ]}
            onPress={handleMarkAsPaid}
            disabled={orderStatus?.toLowerCase() === 'paid' || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <AppText style={styles.buttonText}>
                {orderStatus?.toLowerCase() === 'paid' ? 'Paid' : 'Mark as Paid'}
              </AppText>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <AppText style={[styles.buttonText, {color: colors.text}]}>Download</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: '500', },
  closeButton: { fontSize: 20 },
  invoiceCard: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '500',textAlign: 'center', marginBottom: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: { width: 20, height: 20, marginRight: 5 },
  companyName: { fontSize: 16 },
  infoText: { fontSize: 14, marginBottom: 5,marginBottom: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 40 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableHeaderText: { fontWeight: '500', fontSize: 14,marginBottom: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableCell: { fontSize: 14,marginBottom: 20 },
  tableTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  tableTotalPrice: { fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  markAsPaidButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  downloadButton: { backgroundColor: '#d3d3d3', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { fontSize:16,color: 'white', textAlign: 'center', fontWeight: '500' },
  disabledButton: { opacity: 0.5 },
});

export default InvoiceScreen;