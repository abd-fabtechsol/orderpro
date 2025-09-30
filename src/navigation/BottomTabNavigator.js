import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';

const ProfileScreen = () => (
  <View style={styles.center}>
    <Text>Profile Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.center}>
    <Text>Settings Screen</Text>
  </View>
);

const NotificationsScreen = () => (
  <View style={styles.center}>
    <Text>Notifications Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function BottomTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          position: 'absolute',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon name="add" size={30} color="#fff" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="notifications-outline" size={24} color={color} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="More"
        component={() => null}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="menu-outline" size={24} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props}>
              <Icon name="menu-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        })}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // You can use colors.primary if needed
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
});
