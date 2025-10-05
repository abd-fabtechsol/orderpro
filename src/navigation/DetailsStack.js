import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';
import IntegrationScreen from '../screens/profile/IntegrationScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import HelpCenterScreen from '../screens/profile/HelpCenterScreen';
import TermsServices from '../screens/profile/TermsServices';
import OrderViewScreen from '../screens/order/OrderViewScreen';
import VendorScreen from '../screens/home/VendorScreen';
import OrderOverview from '../screens/home/OrderOverview';
import InvoiceScreen from '../screens/home/InvoiceScreen';

const Stack = createNativeStackNavigator();

const DetailsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Integration" component={IntegrationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="term" component={TermsServices} />
      <Stack.Screen name="invoice" component={OrderViewScreen} />
      <Stack.Screen name="vendor" component={VendorScreen} />
      <Stack.Screen name="overview" component={OrderOverview} />
      <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} />
    </Stack.Navigator>
  );
};

export default DetailsStack;
