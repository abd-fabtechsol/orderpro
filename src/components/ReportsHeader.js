import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import pic from "../../assets/splash-icon.png";
import AppText from './common/AppText';
const ReportsHeader = ({
 
  notificationCount = 0,
  onNotificationPress,
}) => {
  const tabs = ['Today', 'Week', 'Month', 'Year'];

  return (
    <View style={styles.container}>
      {/* Top Row: Logo + Title + Notification */}
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
        <Image source={pic}  style={styles.logo}/>
         
          <AppText style={styles.title}>OrderPro</AppText>
        </View>

        <TouchableOpacity style={styles.bellContainer} onPress={onNotificationPress}>
          <Icon name="notifications-outline" size={24} color="#fff" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>{notificationCount}</AppText>
            </View>
          )}
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
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
   
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

});
