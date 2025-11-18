import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import AppInput from "./common/AppInput";
import { hp } from "../constants/dimension";
import Imageprofile from "../../assets/Image-profile.png";
import camra from "../../assets/camra.png";
import AppText from "./common/AppText";
import phone from "../../assets/phone.png";
import profile from "../../assets/profile.png";
import time from "../../assets/TimeCircle.png";
import AppView from "./common/AppView";
import { useTheme } from "../context/ThemeContext";
import apiClient from "../api/apiClient";

const AddSupplier = ({onClose, onSuccess}) => {
  const{colors,isDarkMode} = useTheme();

  // Form state
  const [supplierImage, setSupplierImage] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Image picker functions
  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSupplierImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSupplierImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: pickImageFromCamera },
        { text: 'Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  // Format time to HH:MM:SS format for API
  const formatTimeForAPI = (timeString) => {
    if (!timeString) return '';
    // If user enters "09:00 AM" or "9:00", convert to "09:00:00"
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
    }
    return timeString;
  };

  // Handle form submission
  const handleAddSupplier = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter supplier name');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter contact number');
      return;
    }
    if (!openTime.trim()) {
      Alert.alert('Validation Error', 'Please enter open time');
      return;
    }
    if (!closeTime.trim()) {
      Alert.alert('Validation Error', 'Please enter close time');
      return;
    }
    if (!supplierImage) {
      Alert.alert('Validation Error', 'Please select supplier image');
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('name', name.trim());

      // Format phone with country code if not already present
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }
      formData.append('phone', formattedPhone);

      formData.append('open_time', formatTimeForAPI(openTime.trim()));
      formData.append('close_time', formatTimeForAPI(closeTime.trim()));

      // Add image file with proper format for React Native
      const uri = Platform.OS === 'ios' ? supplierImage.uri.replace('file://', '') : supplierImage.uri;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'android' ? uri : 'file://' + uri,
        name: filename,
        type: type,
      });

      console.log('Submitting supplier:', {
        name: name.trim(),
        phone: formattedPhone,
        openTime: formatTimeForAPI(openTime.trim()),
        closeTime: formatTimeForAPI(closeTime.trim()),
        imageUri: uri,
        imageType: type
      });

      // Make API request
      const result = await apiClient.post('suppliers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Add Supplier Result:', JSON.stringify(result));

      if (result.ok) {
        Alert.alert(
          'Success',
          'Supplier added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                onClose();
                // Trigger refresh in parent component
                if (onSuccess) {
                  onSuccess();
                }
              }
            }
          ]
        );
      } else {
        const errorMessage = result.data?.message || result.data?.error || 'Failed to add supplier. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Add Supplier Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <Ionicons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={supplierImage ? { uri: supplierImage.uri } : Imageprofile}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={handleImagePicker}>
          {/* <Feather name="camera" size={18} color="#000" /> */}
          <Image source={camra} style={[styles.cameraIcon,{width: 40, height: 40}]} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <View style={styles.inputContainer}>
          {/* <Ionicons name="person-outline" size={18} color="#999" /> */}
          <AppInput
            icon={profile}
            placeholder="Supplier name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          {/* <Ionicons name="call-outline" size={18} color="#999" /> */}
          <AppInput
            icon={phone}
            placeholder="Contact (e.g., +1234567890)"
            style={styles.input}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!loading}
          />
        </View>

        <View style={styles.timeRow}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            {/* <Ionicons name="time-outline" size={18} color="#999" /> */}
            <AppInput
              icon={time}
              placeholder="Open time (HH:MM)"
              style={styles.input}
              value={openTime}
              onChangeText={setOpenTime}
              editable={!loading}
            />
          </View>

          <View style={{ width: 10 }} />

          <View style={[styles.inputContainer, { flex: 1 }]}>
            {/* <Ionicons name="time-outline" size={18} color="#999" /> */}
            <AppInput
              icon={time}
              placeholder="Close time (HH:MM)"
              style={styles.input}
              value={closeTime}
              onChangeText={setCloseTime}
              editable={!loading}
            />
          </View>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.addButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={loading ? null : handleAddSupplier}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Supplier</Text>
        )}
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
  