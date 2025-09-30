import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();
console.log(createDrawerNavigator,"dsadasdas");
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator 
    screenOptions={{
        headerShown: false, 
      }}>
      <Drawer.Screen name="Tabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
