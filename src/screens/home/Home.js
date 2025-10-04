import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
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



export default function Home( ) {
  const navigation=useNavigation()
  const [search, setSearch] = useState("");
  const countryCodeSheetRef = useRef();
  const productSheetRef = useRef();
  const [menuVisible, setMenuVisible] = useState(false)
const{colors}=useTheme()
  const suppliers = [
    {
      id: "1",
      name: "DaleFresh",
      time: "09:00 AM - 05:00 PM",
      status: "Open",
      order:"No Order yet",
      logo: "https://cdn-icons-png.flaticon.com/512/3126/3126647.png",
    },
    {
      id: "2",
      name: "GreenMart",
      time: "08:30 AM - 06:30 PM",
      status: "Open",
      order:"No Order yet",
      logo: "https://cdn-icons-png.flaticon.com/512/2909/2909753.png",
    },
    {
      id: "3",
      name: "FreshFarm",
      time: "Closed • Opens 9 AM",
      status: "Closed",
      order:"Last Order: Tomatoes 10kg, Oil 2L",
      logo: "https://cdn-icons-png.flaticon.com/512/2331/2331785.png",
    },
    {
      id: "4",
      name: "AquaSuppliers",
      time: "08:00 AM - 07:00 PM",
      status: "Open",
      order:"Last Order: Tomatoes 10kg, Oil 2L",
      logo: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
    {
      id: "5",
      name: "AquaSuppliers",
      time: "08:00 AM - 07:00 PM",
      status: "Open",
      order:"Last Order: Tomatoes 10kg, Oil 2L",
      logo: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
    {
      id: "6",
      name: "AquaSuppliers",
      time: "08:00 AM - 07:00 PM",
      status: "Open",
      order:"Last Order: Tomatoes 10kg, Oil 2L",
      logo: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
  ];

  const renderSupplier = ({ item }) => (
    <TouchableOpacity
      style={[styles.card,{backgroundColor:colors.background,borderColor:colors.border}]}
      onPress={() => navigation.navigate('ProfileDetails',{screen:"vendor"})}
    >
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row",justifyContent:"space-between",alignItems:"center",marginBottom: 3 }}>
        <View style={{ flexDirection: "row",gap:5,alignItems:"center",marginBottom: 3 }}>
        <AppText style={styles.name}>{item.name}</AppText>
        <AppText style={{fontSize:12,backgroundColor:"#EF4444",color:"white",paddingHorizontal:5,paddingVertical:2,borderRadius:20}}>{"New"}</AppText>

        </View>
        <View style={styles.statusBox(item.status)}>
        <Text style={styles.statusText(item.status)}>{item.status}</Text>
      </View>

        </View>
        <AppText style={styles.time}>{item.time}</AppText>
        <AppText style={styles.time}>{item.order}</AppText>
      </View>
      
    </TouchableOpacity>
  );

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
      <FlatList
        data={suppliers.filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={renderSupplier}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

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
                  <AddSupplier/>
                }
                />
<RbSheetComponet
                ref={productSheetRef}
                height={hp(70)}
                bgColor={colors.background}
                children={
                  <AddProduct/>
                }
                />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
