import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import pic from "../../../assets/dp.png";
import { hp, width } from '../../constants/dimension';
import ReportsHeader from '../../components/ReportsHeader';
import apiClient from '../../api/apiClient';

const Order = () => {
  const {colors}=useTheme()
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Active');
  const [period, setPeriod] = useState('Today');

  // API State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch orders from API
  const fetchOrders = async (page = 1, isRefreshing = false) => {
    if (page === 1) {
      isRefreshing ? setRefreshing(true) : setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Add status filter: A for Active, H for History
      const statusParam = activeTab === 'Active' ? 'A' : 'H';
      const result = await apiClient.get(`orders/?status=${statusParam}&page=${page}`);

      console.log('Orders Result:', JSON.stringify(result));

      if (result.ok && result.data) {
        // Handle nested response structure
        const orderData = result.data.data || result.data.results || result.data;
        const pagination = result.data.pagination || {};
        const next = pagination.next || result.data.next;

        if (page === 1) {
          // First page - replace all data
          setOrders(Array.isArray(orderData) ? orderData : []);
        } else {
          // Subsequent pages - append data
          setOrders(prev => [...prev, ...(Array.isArray(orderData) ? orderData : [])]);
        }

        // Set next page URL
        setNextPage(next);
        setCurrentPage(page);

        console.log('Loaded orders:', Array.isArray(orderData) ? orderData.length : 0);
      } else {
        console.error('Failed to fetch orders:', result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Load orders on component mount and when activeTab changes
  useEffect(() => {
    fetchOrders(1);
  }, [activeTab]);

  // Handle refresh
  const handleRefresh = () => {
    fetchOrders(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (nextPage && !loadingMore) {
      fetchOrders(currentPage + 1);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  // Get status display
  const getStatusDisplay = (status) => {
    // Convert status to title case
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Get items count
  const getItemsCount = (items) => {
    if (!items) return 0;
    if (typeof items === 'object' && !Array.isArray(items)) {
      return Object.keys(items).length;
    }
    if (Array.isArray(items)) {
      return items.length;
    }
    return 0;
  };

  // Get total items quantity
  const getTotalItemsQuantity = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Orders are already filtered by the API based on activeTab
  // No need for client-side filtering

  const renderOrder = ({ item }) => {
    // API returns 'item' array, not 'items'
    const itemsArray = item.item || item.items || [];
    const itemsCount = getItemsCount(itemsArray);
    const totalQuantity = getTotalItemsQuantity(itemsArray);
    const statusDisplay = getStatusDisplay(item.status || 'pending');
    const isPending = item.status?.toLowerCase() === 'pending';

    // Handle supplier which might be an object or string
    const supplierName = typeof item.supplier === 'object'
      ? (item.supplier?.name || 'N/A')
      : (item.supplier || 'N/A');

    const supplierImage = typeof item.supplier === 'object' && item.supplier?.image
      ? { uri: item.supplier.image }
      : pic;

    return (
      <View style={[styles.card,{backgroundColor:colors.background,borderColor:colors.border}]}>
        <View style={{flexDirection:"row",gap:10,alignItems:"center"}}>
          <Image source={supplierImage} style={{width: 38, height: 38}} resizeMode="contain" />
          <AppText style={styles.vendor}>{supplierName}</AppText>
        </View>
        <View style={styles.cardHeader}>
          <AppText style={styles.date}>{`Order #${item.id}`}</AppText>
          <AppText style={styles.date}>{formatDate(item.created_at)}</AppText>
        </View>
        <View style={styles.cardFooter}>
          <AppText style={styles.total}>{`Total: $${item.total_amount || 0}`}</AppText>
          <AppText style={styles.date}>{`${itemsCount} item${itemsCount !== 1 ? 's' : ''} (${totalQuantity} qty)`}</AppText>
        </View>
        <View style={styles.statusWrapper}>
          <AppText style={[styles.status, isPending ? styles.pending : styles.delivered,{backgroundColor:colors.cardColor}]}>
            {statusDisplay}
          </AppText>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileDetails', {
            screen: 'invoice',
            params: { order: item },
          })}>
            <AppText style={styles.invoiceLink}>View Invoice</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <AppView style={styles.container}>
      {/* Tabs */}
      <ReportsHeader/>
      <View style={{flex:1,paddingHorizontal:16}}> 
      <View style={[styles.tabs,{backgroundColor:colors.cardColor}]}>
        {['Active', 'History'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && {backgroundColor:colors.background}]}>
            <AppText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      {/* <View style={styles.filters}>
        {['Today', 'Week', 'Month', 'Year'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setPeriod(f)}
            style={[styles.filterBtn,{borderColor:colors.border}, period === f && styles.activeFilter]}>
            <AppText style={[styles.filterText, period === f && styles.activeFilterText]}>{f}</AppText>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Orders List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1DBF72" />
          <AppText style={{ marginTop: 10, color: '#888' }}>Loading orders...</AppText>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: hp(14) }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#1DBF72']}
              tintColor="#1DBF72"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#1DBF72" />
              </View>
            ) : null
          }
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <AppText style={{ fontSize: 16, color: '#888' }}>
                {activeTab === 'Active' ? 'No active orders' : 'No order history'}
              </AppText>
            </View>
          )}
        />
      )}
      </View>
    </AppView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 16, },

  tabs: { flexDirection: 'row', marginBottom: 12,borderRadius:10,padding:5 },
  tab: { flex: 1, padding: 7, alignItems: 'center',borderRadius:10 },
  activeTab: { borderColor: '#1DBF72' },
  tabText: { fontSize: 16, color: '#888' },
  activeTabText: { color: '#1DBF72', fontWeight: '500' },

  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10,borderWidth:1  },
  activeFilter: { backgroundColor: '#1DBF72' },
  filterText: { fontSize: 14 },
  activeFilterText: { color: '#fff' },

  card: {  padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1,  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  vendor: { fontSize: 18, fontWeight: '500' },
  date: { fontSize: 14,fontWeight:"400", color: '#888' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginVertical: 10 },
  total: { fontSize: 18, fontWeight: '500' },
  invoiceLink: { fontSize: 14,fontWeight:"500",color: '#1DBF72', fontWeight: '500' },

  statusWrapper: {flexDirection:"row", marginTop: 6,alignItems:"center", justifyContent:"space-between" },
  status: { fontSize: 14,fontWeight:"400", paddingHorizontal: 8, padding: 6, borderRadius: 8 },
  pending: { color: '#E6A500' },
  delivered: { color: '#1DBF72' },
});

export default Order

