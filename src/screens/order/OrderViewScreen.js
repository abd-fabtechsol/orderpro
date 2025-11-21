import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { hp, wp } from '../../constants/dimension';
import AppText from '../../components/common/AppText';
import pic from "../../../assets/dp.png";
import { useNavigation } from '@react-navigation/native';

const OrderViewScreen = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
    ? { uri: order.supplier.image }
    : pic;

  // Get items array (API returns 'item' not 'items')
  const items = order?.item || order?.items || [];
  const statusDisplay = getStatusDisplay(order?.status);
  const isPending = order?.status?.toLowerCase() === 'pending';

  return (
    <AppView style={styles.container}>
      {/* Vendor Info */}
      <Header title="Order View" />
      <View style={styles.header}>
        <View style={{flexDirection:"row",gap:10,alignItems:"center"}}>
      <Image source={supplierImage} style={{width: 38, height: 38}} resizeMode="contain" />
        <AppText style={styles.vendor}>{supplierName}</AppText>
        </View>
        <AppText style={[styles.status, isPending ? styles.pending : styles.delivered]}>
          {statusDisplay}
        </AppText>
      </View>
<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

      <AppText style={styles.subText}>{`Order #${order.id || 'N/A'}`}</AppText>
      <AppText style={styles.subText}>{`Order Date: ${formatDate(order.created_at)}`}</AppText>
</View>

      {/* Product List */}
<View style={{flex:1,paddingHorizontal:wp(4)}}>

      <View style={[styles.row,{marginTop:hp(3)}]}>
            <AppText style={{fontSize:16,fontWeight:500,flex:0.5}} >#</AppText>
            <AppText style={{fontSize:16,fontWeight:500,flex:2}} >Product</AppText>
            <AppText style={{fontSize:16,fontWeight:500,flex:1}}>Qty</AppText>
            <AppText style={{fontSize:16,fontWeight:500,flex:1}}>Price</AppText>
          </View>
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        style={{ paddingHorizontal: wp(5) }}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <AppText style={[styles.cell, {flex:0.5}]}>{index + 1}</AppText>
            <AppText style={[styles.cell, {flex:2}]}>{item.product_name || 'N/A'}</AppText>
            <AppText style={[styles.cell, {flex:1}]}>{item.quantity || 0} {item.unit_type || ''}</AppText>
            <AppText style={[styles.cell, {flex:1}]}>${item.price || 0}</AppText>
          </View>
        )}
      />
</View>
      {/* Total */}
      <View style={styles.totalRow}>
        <AppText style={styles.totalLabel}>Total</AppText>
        <AppText style={styles.totalLabel}>${order.total_amount || 0}</AppText>
      </View>
<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

      <TouchableOpacity onPress={() => navigation.navigate('InvoiceScreen', { order })}>
        <AppText style={styles.invoiceLink}>View Invoice</AppText>
      </TouchableOpacity>
</View>
    </AppView>
  );
};

export default OrderViewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,marginTop:hp(6) },
  vendor: { fontSize: 18, fontWeight: '500' },
  status: { fontSize: 14,fontWeight:"400", padding: 6, borderRadius: 6 },
  pending: { backgroundColor: '#FFE4B5', color: '#E6A500' },
  delivered: { backgroundColor: '#DFF6E2', color: '#1DBF72' },
  subText: { fontSize: 14,fontWeight:"400", color: '#666' },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  cell: { fontSize: 16,fontWeight:"400" },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, marginTop: 16, },
  totalLabel: { fontSize: 18, fontWeight: '500' },
  totalValue: { fontSize: 16, fontWeight: '600', color: '#1DBF72' },

  invoiceLink: { color: '#1DBF72', fontWeight: '400',fontSize:16, marginTop: 10, textAlign: 'right' },
});
