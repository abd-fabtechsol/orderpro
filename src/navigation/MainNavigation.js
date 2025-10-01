import { View, Text } from 'react-native'
import React from 'react'
import DrawerNavigator from './DrawerNavigator'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStack from './AuthStack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DetailsStack from './DetailsStack'

const MainNavigation = () => {
    const token=true
    const RootStack = createNativeStackNavigator();
  return (
    <>
    {token?
    <>
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main tabs */}
      <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Screens without tabs */}
      <RootStack.Screen name="ProfileDetails" component={DetailsStack} />
    </RootStack.Navigator>
    </>
    :
    <AuthStack/>
    }
    </>
   
  )
}

export default MainNavigation