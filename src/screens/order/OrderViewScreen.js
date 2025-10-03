import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { hp, wp } from '../../constants/dimension';
import AppText from '../../components/common/AppText';
import pic from "../../../assets/dp.png";
const products = [
  { id: '1', name: 'Milk', qty: '50L', price: '$100' },
  { id: '2', name: 'Break', qty: '50pc', price: '$75' },
];

const OrderViewScreen = ({ route }) => {
  const { order } = route.params;

  return (
    <AppView style={styles.container}>
      {/* Vendor Info */}
      <Header title="Order View" />
      <View style={styles.header}>
        <View style={{flexDirection:"row",gap:10,alignItems:"center"}}>
      <Image source={pic} style={{width: 38, height: 38}} resizeMode="contain" />
        <AppText style={styles.vendor}>{order.vendor}</AppText>
        </View>
        <AppText style={[styles.status, order.status === 'Pending' ? styles.pending : styles.delivered]}>
          {order.status}
        </AppText>
      </View>
<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

      <AppText style={styles.subText}>{`Order ${order.orderNo}`}</AppText>
      <AppText style={styles.subText}>{`Order Date: ${order.date}`}</AppText>
</View>

      {/* Product List */}
<View style={{flex:1,paddingHorizontal:wp(4)}}>

      <View style={[styles.row,{marginTop:hp(3)}]}>
            <AppText style={{fontSize:16,fontWeight:500}} >Product</AppText>
            <AppText style={{fontSize:16,fontWeight:500}}>Qty</AppText>
            <AppText style={{fontSize:16,fontWeight:500}}>Price</AppText>
          </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        style={{ paddingHorizontal: wp(5) }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <AppText style={styles.cell}>{item.name}</AppText>
            <AppText style={styles.cell}>{item.qty}</AppText>
            <AppText style={styles.cell}>{item.price}</AppText>
          </View>
        )}
      />
</View>
      {/* Total */}
      <View style={styles.totalRow}>
        <AppText style={styles.totalLabel}>Total</AppText>
        <AppText style={styles.totalLabel}>${order.total}</AppText>
      </View>
<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

      <AppText style={styles.invoiceLink}>View Invoice</AppText>
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
