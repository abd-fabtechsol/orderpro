import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';

const sampleOrders = [
  {
    id: '1',
    vendor: 'Daily Fresh',
    orderNo: '#1243',
    date: '15 - 08 - 2025',
    total: 100.5,
    status: 'Pending',
  },
  {
    id: '2',
    vendor: 'Daily Fresh',
    orderNo: '#1244',
    date: '15 - 08 - 2025',
    total: 100.5,
    status: 'Delivered',
  },
];

const Order = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [period, setPeriod] = useState('Today');

  const filteredOrders = sampleOrders.filter(order =>
    activeTab === 'Active' ? order.status !== 'Delivered' : order.status === 'Delivered'
  );

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
        <AppText style={styles.vendor}>{item.vendor}</AppText>
      <View style={styles.cardHeader}>
        <AppText style={styles.date}>{`Order: ${item.orderNo}`}</AppText>
        <AppText style={styles.date}>{`Order: ${item.date}`}</AppText>
      </View>
      <View style={styles.cardFooter}>

        <AppText style={styles.total}>{`Total: `}</AppText>
        <AppText style={styles.total}>{` $${item.total}`}</AppText>
       
      </View>
      <View style={styles.statusWrapper}>
        <AppText style={[styles.status, item.status === 'Pending' ? styles.pending : styles.delivered]}>
          {item.status}
        </AppText>
         <TouchableOpacity onPress={() => navigation.navigate('OrderView', { order: item })}>
          <AppText style={styles.invoiceLink}>View Invoice</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AppView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['Active', 'History'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {['Today', 'Week', 'Month', 'Year'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setPeriod(f)}
            style={[styles.filterBtn, period === f && styles.activeFilter]}>
            <AppText style={[styles.filterText, period === f && styles.activeFilterText]}>{f}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </AppView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, },

  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: '#ccc' },
  activeTab: { borderColor: '#1DBF72' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#1DBF72', fontWeight: '600' },

  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f1f1f1' },
  activeFilter: { backgroundColor: '#1DBF72' },
  filterText: { color: '#333', fontSize: 14 },
  activeFilterText: { color: '#fff' },

  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 0.5, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  vendor: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 13, color: '#888' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontSize: 14, fontWeight: '500' },
  invoiceLink: { fontSize: 14,color: '#1DBF72', fontWeight: '500' },

  statusWrapper: {flexDirection:"row", marginTop: 6, justifyContent:"space-between" },
  status: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pending: { backgroundColor: '#FFE4B5', color: '#E6A500' },
  delivered: { backgroundColor: '#DFF6E2', color: '#1DBF72' },
});

export default Order

