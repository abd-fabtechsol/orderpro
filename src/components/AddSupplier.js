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
import AppInput from "./common/AppInput";
import { hp } from "../constants/dimension";
import Imageprofile from "../../assets/Image-profile.png";
import camra from "../../assets/camra.png";
import AppText from "./common/AppText";
import phone from "../../assets/phone.png";
import profile from "../../assets/profile.png";
import time from "../../assets/TimeCircle.png";
import AppView from "./common/AppView";
const AddSupplier = ({onClose}) => {
  return (
    <AppView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dragIndicator} />
        <AppText style={styles.title}>Add New Supplier</AppText>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => onClose()}
        >
          <Ionicons name="close" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={Imageprofile}
          style={styles.profileImage}
        />
        <TouchableOpacity >
          {/* <Feather name="camera" size={18} color="#000" /> */}
          <Image source={camra} style={[styles.cameraIcon,{width: 40, height: 40}]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <View style={styles.inputContainer}>
          {/* <Ionicons name="person-outline" size={18} color="#999" /> */}
          <AppInput icon={profile} placeholder="Supplier name"  />
        </View>

        <View style={styles.inputContainer}>
          {/* <Ionicons name="call-outline" size={18} color="#999" /> */}
          <AppInput icon={phone} placeholder="Contact" style={styles.input} keyboardType="phone-pad" />
        </View>

        <View style={styles.timeRow}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            {/* <Ionicons name="time-outline" size={18} color="#999" /> */}
            <AppInput icon={time} placeholder="Open time" style={styles.input} />
          </View>

          <View style={{ width: 10 }} />

          <View style={[styles.inputContainer, { flex: 1 }]}>
            {/* <Ionicons name="time-outline" size={18} color="#999" /> */}
            <AppInput icon={time} placeholder="Close time" style={styles.input} />
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Supplier</Text>
      </TouchableOpacity>
    </AppView>
  )
}

export default AddSupplier

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    header: {
      alignItems: "center",
      marginBottom: 10,
    },
    dragIndicator: {
      width: 40,
      height: 4,
      backgroundColor: "#ddd",
      borderRadius: 10,
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      
    },
    closeIcon: {
      position: "absolute",
      right: 0,
      top: 5,
      padding: 4,
    },
    profileContainer: {
      alignItems: "center",
      marginVertical: 10,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#E5E7EB",
    },
    editIcon: {
      position: "absolute",
      bottom: 0,
      right: "40%",
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 4,
      borderWidth: 0.5,
      borderColor: "#ccc",
    },
    inputGroup: {
      marginTop: 15,
    },
    inputContainer: {
     
    },
    input: {
     
    },
    timeRow: {
      flexDirection: "row",
    },
    addButton: {
      backgroundColor: "#1DBF72",
      paddingVertical: 14,
      borderRadius: 10,
      marginTop: 15,
      alignItems: "center",
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 15,
    },
    profileImageContainer: {
        alignSelf: "center",
        marginTop: hp(4),
      },
      profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E5E7EB",
      },
      cameraIcon: {
        position: "absolute",
        bottom: -4,
        right: 4,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 6,
        elevation: 3,
      },
  });
  