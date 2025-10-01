import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import pic from "../../assets/splash-icon.png";
import AppText from './common/AppText';
const Header = ({title}) => {
    const navigation = useNavigation();
    const handleGoBack = () => {
        navigation.goBack();
    }
  return (
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={handleGoBack}>
        <Image source={pic} style={{width: 25, height: 25}} />
    </TouchableOpacity>
      <AppText style={{fontSize:18,fontWeight:"medium"}} >{title}</AppText>
      <View/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})