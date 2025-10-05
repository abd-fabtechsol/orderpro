import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import trash from "../../assets/trash1.png"
import edit from "../../assets/edit.png"
import editw from "../../assets/editw.png"
import copy from "../../assets/copy.png"
import copyw from "../../assets/copyw.png"
import { Image } from 'react-native';
import AppText from './common/AppText';
import { useTheme } from '../context/ThemeContext';
const ContextMenu = ({style, onClose }) => {
    const {colors,isDarkMode} = useTheme();
  return (
    <View style={[styles.container,{...style,backgroundColor:colors.background,borderWidth:1,borderColor:colors.border}]}>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
      <Image source={isDarkMode?copyw:copy} style={{width: 20, height: 20, marginRight: 10,}} resizeMode='contain' />
        <AppText style={styles.menuText}>Copy Link</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
      <Image source={isDarkMode?editw:edit} style={{width: 20, height: 20, marginRight: 10,}} resizeMode='contain' />
        <AppText style={styles.menuText}>Edit</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
        <Image source={trash} style={{width: 20, height: 20, marginRight: 10,}} resizeMode='contain' />
        <AppText style={[styles.menuText,{color:"#EF4444"}]}>Delete</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 5,
    width: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});

export default ContextMenu;