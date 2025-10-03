import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import HomeActive from "../../assets/HomeActive.png"
import home from "../../assets/home.png"
import box from "../../assets/box.png"
import report from "../../assets/report.png"
import reportActive from "../../assets/reportActive.png"
import setting from "../../assets/setting.png"
import settingActive from "../../assets/settingActive.png"
import boxActive from "../../assets/boxActive.png"
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import ReportStack from './ReportStack';
import OrderStack from './OrderStack';
import ReportsScreen from '../screens/report/ReportsScreen';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // 👈 show title
        tabBarLabelPosition: 'below-icon', // 👈 put label below icon
        tabBarActiveTintColor: colors.buttonColor,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          position: 'absolute',
          height: 70,
          
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5, // adjust label distance from bottom
        },
      }}
    >
      {/* 🏠 Home */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.buttonColor }]} />}
              {/* <Icon name="home-outline" size={24} color={color} /> */}
              {focused?<Image source={HomeActive} style={{width: 24, height: 24}} resizeMode="contain" />:
              <Image source={home} style={{width: 24, height: 24}} resizeMode="contain" />}
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />

      
      <Tab.Screen
        name="Order"
        component={OrderStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.buttonColor }]} />}
              {focused?<Image source={boxActive} style={{width: 24, height: 24}} resizeMode="contain" />:
              <Image source={box} style={{width: 24, height: 24}} resizeMode="contain" />}
            </View>
          ),
          tabBarLabel: 'Orders',
        }}
      />

      {/* 📊 Report */}
      <Tab.Screen
        name="Report"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.buttonColor }]} />}
              {focused?<Image source={reportActive} style={{width: 24, height: 24}} resizeMode="contain" />:
              <Image source={report} style={{width: 24, height: 24}} resizeMode="contain" />}
            </View>
          ),
          tabBarLabel: 'Report',
        }}
      />

      
       <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.buttonColor }]} />}
              {focused?<Image source={settingActive} style={{width: 24, height: 24}} resizeMode="contain" />:
              <Image source={setting} style={{width: 24, height: 24}} resizeMode="contain" />}
            </View>
          ),
          tabBarLabel: 'Setting',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBar: {
    position: 'absolute',
    top: -8,              // 👈 place bar at top of tab
    width: 25,
    height: 3,
    borderRadius: 2,
  },
});
