import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
// NAVARO1 - Light/white text logo for dark mode
import logoForDarkMode from "../../assets/NAVARO1.png";
// NAVARO - Dark text logo for light mode
import logoForLightMode from "../../assets/NAVARO.png";
import Notification from "../../assets/Notification.png";
import AppText from './common/AppText';

const ReportsHeader = ({
  notificationCount = 0,
  onNotificationPress,
}) => {
  const { isDarkMode } = useTheme();
  const tabs = ['Today', 'Week', 'Month', 'Year'];

  return (
    <View style={styles.container}>
      {/* Top Row: Logo + Title + Notification */}
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
        <Image source={isDarkMode ? logoForDarkMode : logoForLightMode} style={styles.logo} resizeMode="contain" />
         
          {/* <AppText style={styles.title}>NAVARO</AppText> */}
        </View>

        <TouchableOpacity style={styles.bellContainer} onPress={onNotificationPress}>
        <Image source={Notification}  style={{width: 24, height: 24}} resizeMode='contain'/>
          {/* <Icon name="notifications-outline" size={24} color="#fff" /> */}
          {/* {notificationCount > 0 && ( */}
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>{notificationCount}</AppText>
            </View>
          {/* )} */}
        </TouchableOpacity>
      </View>

     
    </View>
  );
};

export default ReportsHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
   
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 38,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
   
  },
  bellContainer: {
    position: 'relative',
    backgroundColor:"#F9FAFC",
    width:38,
    height:38,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:20
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color:'#fff',
  },

});
