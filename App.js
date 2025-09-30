

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import HomeScreen from './src/screens/HomeScreen';
import MainNavigation from './src/navigation/MainNavigation';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
const App = () => {
  

  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainNavigation/>
      {/* <BottomTabNavigator/> */}
      {/* <HomeScreen/> */}
    </NavigationContainer>
    {/* <LoginScreen/> */}
    </ThemeProvider>
  );
};



export default App;
