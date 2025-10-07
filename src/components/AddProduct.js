import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AppText from './common/AppText';
import AppInput from './common/AppInput';
import { hp, wp } from '../constants/dimension';
import { useTheme } from '../context/ThemeContext';
import AppButton from './common/AppButton';
import add from "../../assets/add.png"
import addw from "../../assets/addw.png"
import AppView from './common/AppView';
import { Ionicons } from "@expo/vector-icons";
const AddProduct = ({onClose}) => {
  const [item, setItem] = useState({ name: '', unit: '', price: '', note: '' });
const{colors,isDarkMode} = useTheme();
  const handleSave = () => {
    // Handle save logic here
    console.log('Item saved:', item);
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
          <Ionicons name="close" size={20} color="#111" />
        </TouchableOpacity>
        </View>
      <TouchableOpacity style={[styles.uploadButton,{backgroundColor:colors.cardColor,borderColor:colors.border}]}>
        <Image source={isDarkMode?add:addw} style={{width:30,height:30}} />
        <AppText style={styles.uploadText}>Browse to Upload</AppText>
      </TouchableOpacity>
      {/* <AppText style={styles.maxSize}>Max 5MB</AppText> */}
      <View style={{flex:1}}> 

      
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>

      <AppInput
        style={{width:wp(52)}}
        placeholder="Product name"
        value={item.name}
        onChangeText={(text) => setItem({ ...item, name: text })}
      />
      <AppInput
        style={{width:wp(36)}}
        placeholder="Unit type"
        value={item.unit}
        onChangeText={(text) => setItem({ ...item, unit: text })}
      />
      </View>
      <AppInput
        style={styles.input}
        placeholder="Price"
        value={item.price}
        onChangeText={(text) => setItem({ ...item, price: text })}
      />
      <AppInput
        style={styles.input}
        placeholder="Notes"
        value={item.note}
        onChangeText={(text) => setItem({ ...item, note: text })}
      />
      </View>
      <AppButton title={"Save"} style={{marginBottom:hp(2)}}/>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,  borderRadius: 10 },
  title: { fontSize: 18, fontWeight: '600',textAlign:"center", marginBottom: 10 },
  uploadButton: { height:hp(15), padding: 10, borderRadius: 20,marginVertical:6,borderStyle: 'dashed',borderWidth:2, alignItems: 'center' ,justifyContent:"center"},
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
