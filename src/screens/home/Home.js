import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppView from "../../components/common/AppView";
import ReportsHeader from "../../components/ReportsHeader";
import AppInput from "../../components/common/AppInput";
import { useTheme } from "../../context/ThemeContext";
import AppText from "../../components/common/AppText";
import searchpic from "../../../assets/Search.png";
import Plus from "../../../assets/Plus.png";
import FloatingActionMenu from "../../components/FloatingActionMenu";
import RbSheetComponet from "../../components/common/RbSheetComponet";
import AddSupplier from "../../components/AddSupplier";
import { hp } from "../../constants/dimension";
import { useNavigation } from "@react-navigation/native";
import AddProduct from "../../components/AddProduct";
import apiClient from "../../api/apiClient";



export default function Home( ) {
  const navigation=useNavigation()
  const [search, setSearch] = useState("");
  const countryCodeSheetRef = useRef();
  const productSheetRef = useRef();
  const [menuVisible, setMenuVisible] = useState(false)
const{colors}=useTheme()

  // API state
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch suppliers from API
  const fetchSuppliers = async (page = 1, isRefreshing = false) => {
    if (page === 1) {
      isRefreshing ? setRefreshing(true) : setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await apiClient.get(`suppliers/?page=${page}`);

      console.log('Suppliers Result:', JSON.stringify(result));

      if (result.ok && result.data) {
        // API returns nested structure: { success, message, data: [...], pagination: {...} }
        const supplierData = result.data.data || result.data.results || result.data;
        const pagination = result.data.pagination || {};
        const next = pagination.next || result.data.next;

        if (page === 1) {
          // First page - replace all data
          setSuppliers(Array.isArray(supplierData) ? supplierData : []);
        } else {
          // Subsequent pages - append data
          setSuppliers(prev => [...prev, ...(Array.isArray(supplierData) ? supplierData : [])]);
        }

        // Set next page URL
        setNextPage(next);
        setCurrentPage(page);

        console.log('Loaded suppliers:', Array.isArray(supplierData) ? supplierData.length : 0);
      } else {
        console.error('Failed to fetch suppliers:', result.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers(1);
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = () => {
    fetchSuppliers(1, true);
  };

  // Handle load more (pagination)
  const handleLoadMore = () => {
    if (nextPage && !loadingMore) {
      fetchSuppliers(currentPage + 1);
    }
  };

  // Format time from API (24h to 12h format)
  const formatTime = (time) => {
    if (!time) return '';
    // Convert "17:46:43.577Z" to "05:46 PM"
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if supplier is open
  const isSupplierOpen = (openTime, closeTime) => {
    if (!openTime || !closeTime) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const open = new Date(`2000-01-01T${openTime}`);
    const close = new Date(`2000-01-01T${closeTime}`);
    const openMinutes = open.getHours() * 60 + open.getMinutes();
    const closeMinutes = close.getHours() * 60 + close.getMinutes();

    return currentTime >= openMinutes && currentTime <= closeMinutes;
  };

  const renderSupplier = ({ item }) => {
    const status = isSupplierOpen(item.open_time, item.close_time) ? 'Open' : 'Closed';
    const timeDisplay = `${formatTime(item.open_time)} - ${formatTime(item.close_time)}`;

    return (
      <TouchableOpacity
        style={[styles.card,{backgroundColor:colors.background,borderColor:colors.border}]}
        onPress={() => navigation.navigate('ProfileDetails',{screen:"vendor", supplierId: item.id})}
      >
        <Image
          source={{ uri: item.image || 'https://cdn-icons-png.flaticon.com/512/3126/3126647.png' }}
          style={styles.logo}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row",justifyContent:"space-between",alignItems:"center",marginBottom: 3 }}>
            <View style={{ flexDirection: "row",gap:5,alignItems:"center",marginBottom: 3 }}>
              <AppText style={styles.name}>{item.name}</AppText>
              {/* Show "New" badge for recently created suppliers (within 7 days) */}
              {new Date() - new Date(item.created_at) < 7 * 24 * 60 * 60 * 1000 && (
                <AppText style={{fontSize:12,backgroundColor:"#EF4444",color:"white",paddingHorizontal:5,paddingVertical:2,borderRadius:20}}>
                  New
                </AppText>
              )}
            </View>
            <View style={styles.statusBox(status)}>
              <Text style={styles.statusText(status)}>{status}</Text>
            </View>
          </View>
          <AppText style={styles.time}>{timeDisplay}</AppText>
          <AppText style={styles.time}>{item.phone || 'No phone'}</AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppView style={styles.container}>
      {/* Header */}
      <ReportsHeader />

      {/* Search */}
    <View style={{paddingHorizontal: 16}}>
       
        <AppInput
          style={[{backgroundColor:colors.search}]}
          placeholder="Search Supplier"
          value={search}
          icon={searchpic}
          onChangeText={setSearch}
        />
      </View>

      {/* Supplier List */}
      {loading && suppliers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1DBF72" />
          <AppText style={{ marginTop: 10, color: colors.secondaryText }}>Loading suppliers...</AppText>
        </View>
      ) : (
        <FlatList
          data={suppliers.filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderSupplier}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
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
          ListFooterComponent={() => {
            if (loadingMore) {
              return (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#1DBF72" />
                </View>
              );
            }
            return null;
          }}
          ListEmptyComponent={() => {
            if (!loading) {
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                  <AppText style={{ fontSize: 16, color: colors.secondaryText }}>
                    {search ? 'No suppliers found' : 'No suppliers available'}
                  </AppText>
                </View>
              );
            }
            return null;
          }}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setMenuVisible(true)}>
        {/* <Ionicons name="add" size={28} color="#fff" /> */}
        <Image source={Plus} style={{width: 24, height: 24}} resizeMode="contain" />
      </TouchableOpacity>

      <FloatingActionMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  onAddSupplier={() => {
    countryCodeSheetRef?.current?.open()
    setMenuVisible(false);
    // navigation.navigate("AddSupplier");
  }}
  onAddProduct={() => {
    productSheetRef?.current?.open()
    setMenuVisible(false);
    // navigation.navigate("AddProduct");
  }}
  
/>
<RbSheetComponet
                ref={countryCodeSheetRef}
                height={hp(70)}
                bgColor={colors.background}
                children={
                  <AddSupplier
                    onClose={() => countryCodeSheetRef.current.close()}
                    onSuccess={() => {
                      // Refresh suppliers list after successful addition
                      fetchSuppliers(1);
                    }}
                  />
                }
                />
<RbSheetComponet
                ref={productSheetRef}
                height={hp(70)}
                bgColor={colors.background}
                children={
                  <AddProduct onClose={() => productSheetRef.current.close()}/>
                }
                />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,paddingVertical: 16, },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#22C55E" },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    elevation: 2,
  },
  logo: { width: 45, height: 45, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", },
  time: { fontSize: 16, color: "#6B7280", marginVertical: 3 },
  statusBox: (status) => ({
    backgroundColor: status === "Open" ? "#14B8A6" : "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  }),
  statusText: (status) => ({
    color: status === "Open" ? "#fff" : "#6B7280",
    fontWeight: "600",
    fontSize: 12,
  }),
  fab: {
    position: "absolute",
    bottom: 80,
    right: 25,
    backgroundColor: "#1DBF72",
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 70,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 12, color: "#999", marginTop: 2 },
  tabLabelActive: { fontSize: 12, color: "#22C55E", marginTop: 2 },
});
