import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { hp, wp } from "../constants/dimension";
import AppText from "./common/AppText";
import { useTheme } from "../context/ThemeContext";
import profileDark from "../../assets/profileDark.png"
import profile from "../../assets/profile.png"
import box from "../../assets/box.png"

export default function FloatingActionMenu({ visible, onClose, onAddSupplier, onAddProduct }) {
    const {colors,isDarkMode} = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          {/* Add Supplier */}
          <TouchableOpacity style={[styles.actionButton,{backgroundColor:colors.background,borderColor:colors.border}]} onPress={onAddSupplier}>
          <Image source={isDarkMode?profileDark:profile} style={{width: 24, height: 24}} resizeMode="contain" />
            <AppText style={styles.actionText}>Add Supplier</AppText>
          </TouchableOpacity>

          {/* Add Product Item */}
          <TouchableOpacity style={[styles.actionButton,{backgroundColor:colors.background,borderColor:colors.border}]} onPress={onAddProduct}>
          <Image source={isDarkMode?box:box} style={{width: 24, height: 24}} resizeMode="contain" />
            <AppText style={styles.actionText}>Add Product Item</AppText>
          </TouchableOpacity>

          {/* Close Button */}
          {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color="#111" />
          </TouchableOpacity> */}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: wp(10),
    paddingBottom: hp(25),
  },
  container: {
    alignItems: "flex-end",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
   borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
   
  
  },
  actionText: {
    fontSize: 15,
    marginLeft: 8,
    fontWeight: "300",
    
  },
  closeButton: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
});
