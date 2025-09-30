import { View, Text } from 'react-native'
import React from 'react'
import DrawerNavigator from './DrawerNavigator'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStack from './AuthStack'

const MainNavigation = () => {
    const token=false
  return (
    <>
    {token?
    <BottomTabNavigator/>:
    <AuthStack/>
    }
    </>
   
  )
}

export default MainNavigation