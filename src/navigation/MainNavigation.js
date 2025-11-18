import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AuthStack from './AuthStack';
import DetailsStack from './DetailsStack';

const RootStack = createNativeStackNavigator();

const MainNavigation = () => {
  // Get authentication state from Redux
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  return (
    <>
      {isLoggedIn && token ? (
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="MainTabs" component={BottomTabNavigator} />
          <RootStack.Screen name="ProfileDetails" component={DetailsStack} />
        </RootStack.Navigator>
      ) : (
        <AuthStack />
      )}
    </>
  );
};

export default MainNavigation;