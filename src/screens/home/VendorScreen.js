// src/screens/VendorScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import AppView from '../../components/common/AppView';
import Header from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import { hp, wp } from '../../constants/dimension';
import vertical from "../../../assets/vertical.png"
import morevertical from "../../../assets/morevertical.png"
import Plus from "../../../assets/Plus.png";
import boxb from "../../../assets/boxb.png";
import boxw from "../../../assets/boxw.png";
import FloatingActionMenu from "../../components/FloatingActionMenu";
import CardOrder from '../order/CardOrder';
import RbSheetComponet from '../../components/common/RbSheetComponet';
import AddSupplier from '../../components/AddSupplier';
import AddProduct from '../../components/AddProduct';
import { useNavigation, useRoute } from '@react-navigation/native';
import ContextMenu from '../../components/ContextMenu';
import apiClient from '../../api/apiClient';


const vendorData = {
    name: 'DailyFresh',
    status: 'Open',
    timing: '07:00 AM – 05:00 PM',
    phone: '+1 229 503-9516',
    image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png", // replace with your logo
};

const initialProducts = [
    {
        id: '1',
        name: 'Goat Milk',
        price: '$1.5/L',
        note: 'Good quality, always fresh',
        lastOrder: 'Milk 20L',
        remaining: '3L',
        image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
        new: false,
    },
    {
        id: '2',
        name: 'Cooking Oil',
        price: '$12/L',
        note: 'Good quality, always fresh',
        lastOrder: 'Milk 20L',
        remaining: '5L',
        image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
        new: false,
    },
    {
        id: '3',
        name: 'Ethiopian Coffee',
        price: '$15/pack',
        note: 'Good quality, always fresh',
        lastOrder: null,
        remaining: null,
        image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
        new: true,
    },
];
const VendorScreen = () => {
    const countryCodeSheetRef = useRef();
    const productSheetRef = useRef();
    const [menuVisible, setMenuVisible] = useState(false)
    const { colors, isDarkMode } = useTheme()
    const [activeTab, setActiveTab] = useState('Product');
    const [products, setProducts] = useState([]);
    const [isMenuVisible1, setMenuVisible1] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [orderQuantities, setOrderQuantities] = useState({}); // Track quantities for each product
    const navigation = useNavigation()
    const route = useRoute();

    // Get supplier ID from navigation params
    const supplierId = route.params?.supplierId;

    // API state
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch supplier details from API
    const fetchSupplierDetails = async () => {
        if (!supplierId) return;
        try {
            const result = await apiClient.get(`suppliers/${supplierId}/`);
            if (result.ok && result.data) {
                setSupplier(result.data);
            }
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        }
    };

    // Fetch products from API
    const fetchProducts = async () => {
        if (!supplierId) return;
        setLoading(true);
        try {
            const result = await apiClient.get(`suppliers/${supplierId}/products/`);
            if (result.ok && result.data) {
                const productData = result.data.results || result.data.data || result.data;
                // Update display products with API data
                if (Array.isArray(productData) && productData.length > 0) {
                    setProducts(productData);
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders from API
    const fetchOrders = async () => {
        if (!supplierId) return;
        setOrdersLoading(true);
        try {
            const result = await apiClient.get(`orders/?supplier=${supplierId}`);
            console.log('Orders Result:', JSON.stringify(result));
            if (result.ok && result.data) {
                const ordersData = result.data.results || result.data.data || result.data;
                if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                }
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        if (supplierId) {
            fetchSupplierDetails();
            fetchProducts();
            fetchOrders();
        }
    }, [supplierId]);

    // Handle refresh
    const handleRefresh = async () => {
        if (!supplierId) return;
        setRefreshing(true);
        await Promise.all([fetchSupplierDetails(), fetchProducts(), fetchOrders()]);
        setRefreshing(false);
    };

    // Format time helper
    const formatTime = (time) => {
        if (!time) return '';
        const date = new Date(`2000-01-01T${time}`);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Delete product function
    const handleDeleteProduct = async (productId) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await apiClient.delete(`suppliers/${supplierId}/products/${productId}/`);
                            if (result.ok) {
                                Alert.alert('Success', 'Product deleted successfully');
                                fetchProducts(); // Refresh the products list
                            } else {
                                Alert.alert('Error', 'Failed to delete product. Please try again.');
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'Network error. Please check your connection and try again.');
                        }
                    }
                }
            ]
        );
    };
    // Handle quantity change
    const handleQuantityChange = (productId, quantity) => {
        setOrderQuantities(prev => ({
            ...prev,
            [productId]: quantity
        }));
    };

    const renderProduct = ({ item }) => {
        // Handle both API data (price, unit_type, quantity) and original data (price string format)
        const priceDisplay = item.unit_type
            ? `$${item.price}/${item.unit_type}`
            : item.price;

        return (
            <View style={[styles.productCard, { borderColor: colors.border }]}>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.productHeader}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode='contain' />
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                                    <AppText style={styles.productName}>{item.name}</AppText>
                                    <TouchableOpacity onPress={(event) => {
                                        setMenuPosition({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
                                        setMenuVisible1(item.id);
                                    }}>
                                        <Image source={isDarkMode?morevertical:vertical} style={{ width: 20, height: 20 }} resizeMode="contain" />
                                    </TouchableOpacity>
                                </View>
                                <AppText style={styles.productPrice}>{priceDisplay}</AppText>
                                <AppText style={styles.productNote}>Note: {item.note}</AppText>
                            </View>
                        </View>
                    </View>


                        <AppText style={styles.productLastOrder}>
                            Last Order: {item.lastOrder} | Remaining: {item.remaining}
                        </AppText>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        {/* <AppInput placeholder="Enter remain qty" style={{ width: wp(42) }} /> */}
                        <AppInput
                            placeholder="Enter new qty"
                            keyboardType="numeric"
                            value={orderQuantities[item.id] || ''}
                            onChangeText={(text) => handleQuantityChange(item.id, text)}
                        />
                    </View>
                </View>
                {isMenuVisible1==item?.id && (
                    <ContextMenu
                        style={{ top: 30, right: 0 }}
                        onClose={() => setMenuVisible1(false)}
                        onDelete={() => handleDeleteProduct(item.id)}
                        onEdit={() => {
                            setEditingProduct(item);
                            setMenuVisible1(false);
                            productSheetRef?.current?.open();
                        }}
                    />
                )}
            </View>
        );
    };
console.log(isMenuVisible1,"ddddd")
    return (
        <TouchableWithoutFeedback onPress={() => setMenuVisible1(false)}>
            <AppView style={styles.container}>
                {/* Header */}

                <Header />

            {/* Vendor Info */}
            <View style={[styles.vendorInfo, { flex: 1 }]}>
                <Image source={{ uri: supplier?.image || vendorData.image }} style={styles.vendorImage} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    <AppText style={styles.vendorName}>{supplier?.name || vendorData.name}</AppText>
                    <View style={styles.statusContainer}>
                        <AppText style={styles.statusText}>
                            {supplier?.is_active !== undefined ? (supplier.is_active ? 'Open' : 'Closed') : vendorData.status}
                        </AppText>
                    </View>
                </View>
                <AppText style={styles.vendorTiming}>
                    {supplier?.open_time && supplier?.close_time
                        ? `${formatTime(supplier.open_time)} – ${formatTime(supplier.close_time)}`
                        : vendorData.timing}
                </AppText>
                <View style={styles.phoneContainer}>
                    <AppText style={styles.vendorPhone}>{supplier?.phone || vendorData.phone}</AppText>
                    <TouchableOpacity>
                        <Ionicons name="copy-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 5, justifyContent: "center" }}>
                {loading && products.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#1DBF72" />
                        <AppText style={{ marginTop: 10, color: '#888' }}>Loading products...</AppText>
                    </View>
                ) : !loading && products.length === 0 ? (
                    <>
                        <View style={{ alignItems: "center", }}>
                            <Image source={isDarkMode ? boxw : boxb} style={{ width: 40, height: 40 }} resizeMode="contain" />
                        </View>
                        <AppText style={styles.noItem}>No Item Found</AppText>
                        <AppText style={styles.noItemDesc}>You don't have active item from this supplier. Add your first item</AppText>
                    </>
                ) : (
                    <>
                        <View style={[styles.tabs, { backgroundColor: colors.cardColor }]}>
                            {['Product', 'Orders'].map(tab => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    style={[styles.tab, activeTab === tab && { backgroundColor: colors.background }]}>
                                    <AppText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {activeTab == "Product" ? <>
                            {/* Products */}
                            <AppText style={{ fontWeight: "600", margin: 10 }}>Product</AppText>
                            <FlatList
                                data={products}
                                keyExtractor={(item) => item.id?.toString() || item.id}
                                renderItem={renderProduct}
                                contentContainerStyle={{ paddingBottom: 80 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={handleRefresh}
                                        colors={['#1DBF72']}
                                        tintColor="#1DBF72"
                                    />
                                }
                            />
                        </> :
                            <>
                                {ordersLoading ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size="large" color="#1DBF72" />
                                        <AppText style={{ marginTop: 10, color: '#888' }}>Loading orders...</AppText>
                                    </View>
                                ) : orders.length === 0 ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={isDarkMode ? boxw : boxb} style={{ width: 40, height: 40 }} resizeMode="contain" />
                                        <AppText style={styles.noItem}>No Orders Found</AppText>
                                        <AppText style={styles.noItemDesc}>You don't have any orders from this supplier yet.</AppText>
                                    </View>
                                ) : (
                                    <>
                                        <AppText style={{ fontWeight: "600", margin: 10 }}>Active Orders</AppText>
                                        <FlatList
                                            data={orders}
                                            keyExtractor={(item) => item.id?.toString() || item.id}
                                            renderItem={({ item }) => {
                                                // Map API data to CardOrder expected format
                                                const orderData = {
                                                    ...item,
                                                    vendor: supplier?.name || item.supplier_name || 'Supplier',
                                                    orderNo: `#${item.id}`,
                                                    date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB').replace(/\//g, ' - ') : '',
                                                    total: item.total_amount || 0,
                                                    status: item.status || 'Pending'
                                                };
                                                return <CardOrder colors={colors} item={orderData} navigation={navigation} />;
                                            }}
                                            contentContainerStyle={{ paddingBottom: 80 }}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={refreshing}
                                                    onRefresh={handleRefresh}
                                                    colors={['#1DBF72']}
                                                    tintColor="#1DBF72"
                                                />
                                            }
                                        />
                                    </>
                                )}
                            </>
                        }
                    </>
                )}
            </View>

            {/* Continue Button */}
            <View style={{ flex: 0.5, justifyContent: "flex-end", }}>

                <AppButton title="Continue" onPress={() => {
                    // Filter products that have quantities entered
                    const orderItems = products
                        .filter(product => orderQuantities[product.id] && parseInt(orderQuantities[product.id]) > 0)
                        .map(product => ({
                            ...product,
                            orderQuantity: parseInt(orderQuantities[product.id])
                        }));

                    navigation.navigate('ProfileDetails', {
                        screen: 'overview',
                        params: {
                            orderItems,
                            supplier: supplier || vendorData,
                            supplierId
                        }
                    });
                }} />
            </View>
            <TouchableOpacity style={styles.fab} onPress={() => setMenuVisible(true)}>

                <Image source={Plus} style={{ width: 24, height: 24 }} resizeMode="contain" />
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
                    <AddSupplier  onClose={() => countryCodeSheetRef.current.close()}/>
                }
            />
            <RbSheetComponet
                ref={productSheetRef}
                height={hp(70)}
                bgColor={colors.background}
                children={
                    <AddProduct
                        supplierId={supplierId}
                        editProduct={editingProduct}
                        onClose={() => {
                            productSheetRef.current.close();
                            setEditingProduct(null);
                        }}
                        onSuccess={() => {
                            fetchProducts();
                            setEditingProduct(null);
                        }}
                    />
                }

            />
            </AppView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: moderateScale(12) },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    vendorInfo: { alignItems: 'center', marginBottom: 16 },
    vendorImage: { width: 30, height: 30, borderRadius: 40, marginBottom: 8 },
    vendorName: { fontSize: 18, fontWeight: 'bold' },
    statusContainer: { backgroundColor: '#14B8A6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginVertical: 4 },
    statusText: { color: '#fff', fontWeight: '400', fontSize: 13 },
    vendorTiming: { color: 'gray', fontSize: 14 },
    phoneContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    vendorPhone: { marginRight: 6, fontSize: 14, color: 'gray' },
    tabs: { flexDirection: 'row', marginBottom: 12, borderRadius: 10, padding: 5 },
    tab: { flex: 1, padding: 7, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#fff' },
    tabText: { color: 'gray', fontWeight: '400' },
    activeTabText: { color: '#4CAF50', fontWeight: '500' },
    productCard: { flexDirection: 'row',  borderRadius: 8, padding: 8, marginBottom: 12, borderWidth: 1 },
    productImage: { width: 60, height: 60, borderRadius: 15 },
    productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productName: { fontWeight: '500', fontSize: 16 },
    productPrice: { fontSize: 14, marginVertical: 2 },
    productNote: { fontSize: 12, color: 'gray' },
    productLastOrder: { fontSize: 12, marginTop: 4 },
    inputRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
    addButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, marginLeft: 8 },
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
    noItem: { fontSize: 16, marginTop: 20, fontWeight: "500", textAlign: 'center', },
    noItemDesc: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 5 },
});

export default VendorScreen;
