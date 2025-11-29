import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Modal,
  FlatList,
  ScrollView,
  ActionSheetIOS,
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
import { moderateScale } from 'react-native-size-matters';
import { fonts } from '../constants';
import CustomAlert from './common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const AddProduct = ({onClose, onSuccess, supplierId, editProduct}) => {
  const isEditMode = !!editProduct;
  const [item, setItem] = useState({ name: '', unit: 'KG', price: '', quantity: '', note: '' });
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(supplierId || null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const {colors, isDarkMode} = useTheme();
  const { alertConfig, hideAlert, showSuccess, showError, showAlert } = useCustomAlert();

  // Get suppliers from Redux
  const suppliers = useSelector(state => state.supplier.suppliers);

  // Pre-fill form when editing
  useEffect(() => {
    if (editProduct) {
      setItem({
        name: editProduct.name || '',
        unit: editProduct.unit_type || 'KG',
        price: editProduct.price?.toString() || '',
        quantity: editProduct.quantity?.toString() || '',
        note: editProduct.note || '',
      });
      if (editProduct.image) {
        setProductImage({ uri: editProduct.image });
      }
      if (editProduct.supplier) {
        setSelectedSupplier(typeof editProduct.supplier === 'object' ? editProduct.supplier.id : editProduct.supplier);
      }
    }
  }, [editProduct]);

  // Unit options
  const unitOptions = [
    { value: 'KG', label: 'Kilograms' },
    { value: 'LB', label: 'Pounds' },
    { value: 'L', label: 'Liters' },
    { value: 'GAL', label: 'Gallons' },
    { value: 'PC', label: 'Piece' },
    { value: 'PK', label: 'Pack' },
    { value: 'BX', label: 'Box' },
    { value: 'BG', label: 'Bag' },
    { value: 'BTL', label: 'Bottle' },
    { value: 'CN', label: 'Can' },
  ];

  // Image picker functions
  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showError('We need camera roll permissions to select an image.', 'Permission Denied');
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
      showError('Failed to pick image from gallery.');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showError('We need camera permissions to take a photo.', 'Permission Denied');
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
      showError('Failed to take photo.');
    }
  };

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          }
        }
      );
    } else {
      showAlert({
        title: 'Select Image',
        message: 'Choose an option',
        type: 'info',
        buttons: [
          { text: 'Camera', onPress: pickImageFromCamera },
          { text: 'Gallery', onPress: pickImageFromGallery },
          // { text: 'Cancel', style: 'cancel' }
        ],
      });
    }
  };

  const handleSave = async () => {
    // Validation
    if (!selectedSupplier) {
      showError('Please select a supplier', 'Validation Error');
      return;
    }
    if (!item.name.trim()) {
      showError('Please enter product name', 'Validation Error');
      return;
    }
    if (!item.unit.trim()) {
      showError('Please enter unit type', 'Validation Error');
      return;
    }
    if (!item.price.trim()) {
      showError('Please enter price', 'Validation Error');
      return;
    }
    if (!item.quantity.trim()) {
      showError('Please enter quantity', 'Validation Error');
      return;
    }
    if (!productImage) {
      showError('Please select product image', 'Validation Error');
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

      // Add image file with proper format for React Native (only if new image is selected)
      if (productImage.uri && !productImage.uri.startsWith('http')) {
        const uri = Platform.OS === 'ios' ? productImage.uri.replace('file://', '') : productImage.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: Platform.OS === 'android' ? uri : 'file://' + uri,
          name: filename,
          type: type,
        });
      }

      console.log('Submitting product:', {
        mode: isEditMode ? 'edit' : 'add',
        name: item.name.trim(),
        unit_type: item.unit.trim(),
        price: item.price.trim(),
        quantity: item.quantity.trim(),
        note: item.note.trim(),
        supplier: selectedSupplier,
      });

      // Make API request - use PATCH for edit, POST for add
      let result;
      if (isEditMode) {
        result = await apiClient.patch(`suppliers/${selectedSupplier}/products/${editProduct.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        result = await apiClient.post(`suppliers/${selectedSupplier}/products/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log(`${isEditMode ? 'Edit' : 'Add'} Product Result:`, JSON.stringify(result));

      if (result.ok) {
        showSuccess(
          `Product ${isEditMode ? 'updated' : 'added'} successfully!`,
          'Success',
          () => {
            onClose();
            // Trigger refresh in parent component
            if (onSuccess) {
              onSuccess();
            }
          }
        );
      } else {
        const errorMessage = result.data?.message || result.data?.error || `Failed to ${isEditMode ? 'update' : 'add'} product. Please try again.`;
        showError(errorMessage);
      }
    } catch (error) {
      console.error(`${isEditMode ? 'Edit' : 'Add'} Product Error:`, error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppView style={styles.container}>
       <View style={styles.header}>
       <View style={styles.dragIndicator} />
      <AppText style={styles.title}>{isEditMode ? 'Edit Item' : 'Add New Item'}</AppText>
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

      {/* Unit Dropdown Modal */}
      <Modal
        visible={showUnitDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUnitDropdown(false)}
        >
          <View style={[styles.dropdownContainer, {backgroundColor: colors.background}]}>
            <View style={styles.dropdownHeader}>
              <AppText style={styles.dropdownTitle}>Select Unit</AppText>
              <TouchableOpacity onPress={() => setShowUnitDropdown(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {unitOptions.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.unitItem,
                    {borderBottomColor: colors.border},
                    item.unit === unit.value && {backgroundColor: colors.cardColor}
                  ]}
                  onPress={() => {
                    setItem({ ...item, unit: unit.value });
                    setShowUnitDropdown(false);
                  }}
                >
                  <View style={styles.unitInfo}>
                    <AppText style={styles.unitValue}>{unit.value}</AppText>
                    <AppText style={styles.unitLabel}>{unit.label}</AppText>
                  </View>
                  {item.unit === unit.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#1DBF72" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
        <TouchableOpacity
          style={[styles.unitDropdown, {borderColor:colors.border}]}
          onPress={() => setShowUnitDropdown(true)}
          disabled={loading}
        >
          <AppText style={[styles.unitDropdownText, {color: !item.unit ? colors.placeholder : colors.text}]}>
            {item.unit || 'Unit'}
          </AppText>
          <Ionicons name="chevron-down" size={20} color={colors.placeholder} />
        </TouchableOpacity>
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
        title={loading ? "Saving..." : (isEditMode ? "Update" : "Save")}
        style={{marginBottom:hp(2), opacity: loading ? 0.7 : 1}}
        onPress={loading ? null : handleSave}
        disabled={loading}
      />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        onClose={hideAlert}
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
  unitDropdown: {
    width: wp(36),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(14),
    marginVertical: moderateScale(6),
  },
  unitDropdownText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.roboto?.regular || fonts.roboto['regular'],
    flex: 1,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  unitInfo: {
    flex: 1,
  },
  unitValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});


export default AddProduct
