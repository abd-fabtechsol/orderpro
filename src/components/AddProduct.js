import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppText from './common/AppText';
import AppInput from './common/AppInput';
import { hp, wp } from '../constants/dimension';
import { useTheme } from '../context/ThemeContext';
import AppButton from './common/AppButton';
import add from "../../assets/add.png"
import addw from "../../assets/addw.png"
import AppView from './common/AppView';
import { Ionicons } from "@expo/vector-icons";
import apiClient from '../api/apiClient';
import { useSelector } from 'react-redux';

const AddProduct = ({onClose, onSuccess, supplierId}) => {
  const [item, setItem] = useState({ name: '', unit: 'KG', price: '', quantity: '', note: '' });
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(supplierId || null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const {colors, isDarkMode} = useTheme();

  // Get suppliers from Redux
  const suppliers = useSelector(state => state.supplier.suppliers);

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
        setProductImage(result.assets[0]);
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
        setProductImage(result.assets[0]);
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

  const handleSave = async () => {
    // Validation
    if (!selectedSupplier) {
      Alert.alert('Validation Error', 'Please select a supplier');
      return;
    }
    if (!item.name.trim()) {
      Alert.alert('Validation Error', 'Please enter product name');
      return;
    }
    if (!item.unit.trim()) {
      Alert.alert('Validation Error', 'Please enter unit type');
      return;
    }
    if (!item.price.trim()) {
      Alert.alert('Validation Error', 'Please enter price');
      return;
    }
    if (!item.quantity.trim()) {
      Alert.alert('Validation Error', 'Please enter quantity');
      return;
    }
    if (!productImage) {
      Alert.alert('Validation Error', 'Please select product image');
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('name', item.name.trim());
      formData.append('unit_type', item.unit.trim().toUpperCase());
      formData.append('price', item.price.trim());
      formData.append('quantity', parseInt(item.quantity.trim(), 10));
      formData.append('note', item.note.trim());
      formData.append('supplier', selectedSupplier);

      // Add image file with proper format for React Native
      const uri = Platform.OS === 'ios' ? productImage.uri.replace('file://', '') : productImage.uri;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: Platform.OS === 'android' ? uri : 'file://' + uri,
        name: filename,
        type: type,
      });

      console.log('Submitting product:', {
        name: item.name.trim(),
        unit_type: item.unit.trim(),
        price: item.price.trim(),
        quantity: item.quantity.trim(),
        note: item.note.trim(),
        supplier: selectedSupplier,
        imageUri: uri,
        imageType: type
      });

      // Make API request to suppliers/{supplier_pk}/products/
      const result = await apiClient.post(`suppliers/${selectedSupplier}/products/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Add Product Result:', JSON.stringify(result));

      if (result.ok) {
        Alert.alert(
          'Success',
          'Product added successfully!',
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
        const errorMessage = result.data?.message || result.data?.error || 'Failed to add product. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Add Product Error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView style={styles.container}>
       <View style={styles.header}>
       <View style={styles.dragIndicator} />
      <AppText style={styles.title}>Add New Item</AppText>
      <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => onClose()}
        >
          <Ionicons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
        </View>

      {/* Supplier Dropdown */}
      <TouchableOpacity
        style={[styles.supplierDropdown, {backgroundColor:colors.cardColor, borderColor:colors.border}]}
        onPress={() => setShowSupplierDropdown(true)}
        disabled={loading}
      >
        <AppText style={styles.supplierDropdownText}>
          {selectedSupplier
            ? suppliers.find(s => s.id === selectedSupplier)?.name || 'Select Supplier'
            : 'Select Supplier'}
        </AppText>
        <Ionicons name="chevron-down" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Supplier Dropdown Modal */}
      <Modal
        visible={showSupplierDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSupplierDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSupplierDropdown(false)}
        >
          <View style={[styles.dropdownContainer, {backgroundColor: colors.background}]}>
            <View style={styles.dropdownHeader}>
              <AppText style={styles.dropdownTitle}>Select Supplier</AppText>
              <TouchableOpacity onPress={() => setShowSupplierDropdown(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={suppliers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.supplierItem,
                    {borderBottomColor: colors.border},
                    selectedSupplier === item.id && {backgroundColor: colors.cardColor}
                  ]}
                  onPress={() => {
                    setSelectedSupplier(item.id);
                    setShowSupplierDropdown(false);
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.supplierImage}
                  />
                  <View style={{flex: 1}}>
                    <AppText style={styles.supplierName}>{item.name}</AppText>
                    <AppText style={styles.supplierPhone}>{item.phone}</AppText>
                  </View>
                  {selectedSupplier === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#1DBF72" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <AppText style={styles.emptyText}>No suppliers available</AppText>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        style={[styles.uploadButton,{backgroundColor:colors.cardColor,borderColor:colors.border}]}
        onPress={handleImagePicker}
        disabled={loading}
      >
        {productImage ? (
          <Image source={{ uri: productImage.uri }} style={styles.uploadedImage} />
        ) : (
          <>
            <Image source={isDarkMode?add:addw} style={{width:30,height:30}} />
            <AppText style={styles.uploadText}>Browse to Upload</AppText>
          </>
        )}
      </TouchableOpacity>
      {/* <AppText style={styles.maxSize}>Max 5MB</AppText> */}
      <View style={{flex:1}}> 


      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <AppInput
          style={{width:wp(52)}}
          placeholder="Product name"
          value={item.name}
          onChangeText={(text) => setItem({ ...item, name: text })}
          editable={!loading}
        />
        <AppInput
          style={{width:wp(36)}}
          placeholder="Unit (KG/L/PCS)"
          value={item.unit}
          onChangeText={(text) => setItem({ ...item, unit: text })}
          editable={!loading}
        />
      </View>

      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <AppInput
          style={{width:wp(42)}}
          placeholder="Price"
          value={item.price}
          onChangeText={(text) => setItem({ ...item, price: text })}
          keyboardType="numeric"
          editable={!loading}
        />
        <AppInput
          style={{width:wp(42)}}
          placeholder="Quantity"
          value={item.quantity}
          onChangeText={(text) => setItem({ ...item, quantity: text })}
          keyboardType="numeric"
          editable={!loading}
        />
      </View>

      <AppInput
        style={styles.input}
        placeholder="Notes (optional)"
        value={item.note}
        onChangeText={(text) => setItem({ ...item, note: text })}
        editable={!loading}
      />
      </View>
      <AppButton
        title={loading ? "Saving..." : "Save"}
        style={{marginBottom:hp(2), opacity: loading ? 0.7 : 1}}
        onPress={loading ? null : handleSave}
        disabled={loading}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,  borderRadius: 10 },
  title: { fontSize: 18, fontWeight: '600',textAlign:"center", marginBottom: 10 },
  supplierDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  supplierDropdownText: {
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: hp(60),
    paddingBottom: 20,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  supplierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  supplierImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '500',
  },
  supplierPhone: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  uploadButton: { height:hp(15), padding: 10, borderRadius: 20,marginVertical:6,borderStyle: 'dashed',borderWidth:2, alignItems: 'center' ,justifyContent:"center", overflow: 'hidden'},
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  uploadText: {fontSize: 14, color: '#888' },
  maxSize: { color: '#888', marginBottom: 10 },
  header: {
    // flexDirection:"row",
    // justifyContent:"space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 4,
  },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: 'bold' },
});


export default AddProduct
