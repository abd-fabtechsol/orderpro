import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';
import IntegrationScreen from '../screens/profile/IntegrationScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import { useTheme } from '../context/ThemeContext';
import TermsServices from '../screens/profile/TermsServices';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false, // 🚫 hides the header completely
      }}
    >
      {/* Main Profile */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '' }}
      />

       
      {/* <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{  tabBarStyle: { display: 'none' } }}
      />

      
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ title: 'Notification' }}
      />

     
      <Stack.Screen
        name="Integration"
        component={IntegrationScreen}
        options={{ title: 'Integration' }}
      />

      
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />

    
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <Stack.Screen
        name="term"
        component={TermsServices}
        options={{ title: 'Privacy Policy' }}
      />

     
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{ title: 'Help Center' }}
      />  */}
    </Stack.Navigator>
  );
};

export default ProfileStack;
