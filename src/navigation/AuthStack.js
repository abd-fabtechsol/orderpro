import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import PasskeyScreen from '../screens/auth/PasskeyScreen';
import CompleteProfileScreen from '../screens/auth/CompleteProfileScreen';
import BottomTabNavigator from './BottomTabNavigator';
import DetailsStack from './DetailsStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // hide headers for auth flow
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="otp" component={VerifyOTPScreen} />
      <Stack.Screen name="PasskeyScreen" component={PasskeyScreen} />
      <Stack.Screen name="profile" component={CompleteProfileScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ProfileDetails" component={DetailsStack} />
    </Stack.Navigator>
  );
};

export default AuthStack;
