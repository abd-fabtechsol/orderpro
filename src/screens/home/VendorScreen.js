// src/screens/VendorScreen.js
import React, { useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import ContextMenu from '../../components/ContextMenu';


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
    {
        id: '3',
        vendor: 'Daily Fresh',
        orderNo: '#1243',
        date: '15 - 08 - 2025',
        total: 100.5,
        status: 'Pending',
    },
    {
        id: '4',
        vendor: 'Daily Fresh',
        orderNo: '#1244',
        date: '15 - 08 - 2025',
        total: 100.5,
        status: 'Delivered',
    },
    {
        id: '5',
        vendor: 'Daily Fresh',
        orderNo: '#1243',
        date: '15 - 08 - 2025',
        total: 100.5,
        status: 'Pending',
    },
    {
        id: '6',
        vendor: 'Daily Fresh',
        orderNo: '#1244',
        date: '15 - 08 - 2025',
        total: 100.5,
        status: 'Delivered',
    },
];

const VendorScreen = () => {
    const countryCodeSheetRef = useRef();
    const productSheetRef = useRef();
    const [menuVisible, setMenuVisible] = useState(false)
    const { colors, isDarkMode } = useTheme()
    const [activeTab, setActiveTab] = useState('Product');
    const [products, setProducts] = useState(initialProducts);
    const [isMenuVisible1, setMenuVisible1] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [noItem, setNoItem] = useState(false)
    const navigation = useNavigation()
    const renderProduct = ({ item }) => (
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
                                    {/* <Ionicons name="ellipsis-vertical" size={20} color="gray" /> */}
                                </TouchableOpacity>
                            </View>
                            <AppText style={styles.productPrice}>{item.price}</AppText>
                            <AppText style={styles.productNote}>Note: {item.note}</AppText>
                        </View>
                    </View>

                </View>

                {item.lastOrder && (
                    <AppText style={styles.productLastOrder}>
                        Last Order: {item.lastOrder} | Remaining: {item.remaining}
                    </AppText>
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <AppInput placeholder="Enter remain qty" style={{ width: wp(42) }} />
                    <AppInput placeholder="Enter new qty" style={{ width: wp(42) }} />
                    {/* <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity> */}
                </View>
            </View>
            {isMenuVisible1==item?.id && (
        <ContextMenu
          style={{ top: 30, right: 0 }}
          onClose={() => setMenuVisible1(false)}
        />
      )}
        </View>
    );
console.log(isMenuVisible1,"ddddd")
    return (
        // <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible1(null)}>
        //         <>
        <AppView style={styles.container}>
            {/* Header */}
           
            <Header />

            {/* Vendor Info */}
            <View style={[styles.vendorInfo, { flex: 1 }]}>
                <Image source={{ uri: vendorData.image }} style={styles.vendorImage} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    <AppText style={styles.vendorName}>{vendorData.name}</AppText>
                    <View style={styles.statusContainer}>
                        <AppText style={styles.statusText}>{vendorData.status}</AppText>
                    </View>
                </View>
                <AppText style={styles.vendorTiming}>{vendorData.timing}</AppText>
                <View style={styles.phoneContainer}>
                    <AppText style={styles.vendorPhone}>{vendorData.phone}</AppText>
                    <TouchableOpacity>
                        <Ionicons name="copy-outline" size={20} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 5, justifyContent: "center" }}>
                {noItem ? <>
                    <View style={{ alignItems: "center", }}>
                        <Image source={isDarkMode ? boxw : boxb} style={{ width: 40, height: 40 }} resizeMode="contain" />
                    </View>
                    <AppText style={styles.noItem}>No Item Found</AppText>
                    <AppText style={styles.noItemDesc}>You don't have active item from this supplier. Add your first item</AppText>
                </> :
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
                                keyExtractor={(item) => item.id}
                                renderItem={renderProduct}
                                contentContainerStyle={{ paddingBottom: 80 }}
                            />
                        </> :
                            <>
                                {/* <CardOrder colors={colors} item={sampleOrders[0]}/> */}
                                <AppText style={{ fontWeight: "600", margin: 10 }}>Active Orders</AppText>
                                <FlatList
                                    data={sampleOrders}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => <CardOrder colors={colors} item={item} />}
                                    contentContainerStyle={{ paddingBottom: 80 }}
                                />
                            </>
                        }
                    </>}
            </View>

            {/* Continue Button */}
            <View style={{ flex: 0.5, justifyContent: "flex-end", }}>

                <AppButton title="Continue" onPress={() => { noItem ? navigation.navigate('ProfileDetails', { screen: 'overview' }) : setNoItem(true) }} />
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
                    <AddSupplier />
                }
            />
            <RbSheetComponet
                ref={productSheetRef}
                height={hp(70)}
                bgColor={colors.background}
                children={
                    <AddProduct />
                }
                
            />
        </AppView>
            // </>
            //  </Pressable>
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
    productImage: { width: 60, height: 60, borderRadius: 8 },
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
