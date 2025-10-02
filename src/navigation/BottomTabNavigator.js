import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import ReportStack from './ReportStack';
import OrderStack from './OrderStack';
import ReportsScreen from '../screens/report/ReportsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // 👈 show title
        tabBarLabelPosition: 'below-icon', // 👈 put label below icon
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          position: 'absolute',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
              <Icon name="home-outline" size={24} color={color} />
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
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
              <Icon name="cube-outline" size={24} color={color} />
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
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
              <Icon name="bar-chart-outline" size={24} color={color} />
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
              {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
              <Icon name="person-outline" size={24} color={color} />
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
