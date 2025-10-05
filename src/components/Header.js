import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import pic from "../../assets/left.png";
import leftLight from "../../assets/leftLight.png";
import AppText from './common/AppText';
import { useTheme } from '../context/ThemeContext';
const Header = ({title}) => {
    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    }
    const {isDarkMode}=useTheme()
  return (
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={handleGoBack}>
        <Image source={isDarkMode?leftLight:pic} style={{width: 25, height: 25}} />
    </TouchableOpacity>
      <AppText style={{fontSize:18,fontWeight:"500"}} >{title}</AppText>
      <View/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})