import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import pic from "../../../assets/splash-icon.png";
import profile from "../../../assets/profile.png";
import profileDark from "../../../assets/profileDark.png";
import notificationSet from "../../../assets/notificationSet.png";
import notificationDark from "../../../assets/notificationDark.png";
import inte from "../../../assets/inte.png";
import inteDark from "../../../assets/inteDark.png";
import sun from "../../../assets/sun.png";
import qw from "../../../assets/qw.png";
import sunDark from "../../../assets/sunDark.png";
import setting from "../../../assets/settingDev.png";
import settingDark from "../../../assets/settingDark.png";
import logouts from "../../../assets/logout.png";

import AppView from '../../components/common/AppView';
import ThemeSwitch from '../../components/common/ThemeSwitch';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';

const ProfileScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  console.log('User data in ProfileScreen:', JSON.stringify(user, null, 2));
  console.log('Profile image URL:', user?.profile_image || user?.image || user?.dp);

  return (
    <AppView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        {/* <ThemeSwitch style={styles.switch} /> */}
        <View style={styles.header}>
          <Image
            source={
              user?.dp ? { uri: user.dp } :
              user?.profile_image ? { uri: user.profile_image } :
              user?.image ? { uri: user.image } :
              qw
            }
            style={styles.avatar}
          />
          <AppText style={styles.name}>{user?.name || user?.username || 'User'}</AppText>
          <AppText style={styles.phone}>{user?.phone || user?.phone_number || 'No phone number'}</AppText>
        </View>

        {/* Menu items */}
        <TouchableOpacity
          style={[styles.item, { borderWidth: 1, borderColor: colors.border }]}
          onPress={() => navigation.navigate('ProfileDetails', { screen: 'EditProfile' })}
        >
          <Image source={isDarkMode ? profileDark : profile} style={styles.icon} resizeMode="contain" />
          <AppText style={styles.itemText}>Manage profile</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, { borderWidth: 1, borderColor: colors.border }]}
          onPress={() => navigation.navigate('ProfileDetails', { screen: 'Notification' })}
        >
          <Image source={isDarkMode ? notificationDark : notificationSet} style={styles.icon} resizeMode="contain" />
          <AppText style={styles.itemText}>Notification</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, { borderWidth: 1, borderColor: colors.border }]}
          onPress={() => navigation.navigate('ProfileDetails', { screen: 'Integration' })}
        >
          <Image source={isDarkMode ? inteDark : inte} style={styles.icon} resizeMode="contain" />
          <AppText style={styles.itemText}>Integration</AppText>
        </TouchableOpacity>

        <View style={[styles.item1, { borderWidth: 1, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Image source={isDarkMode ? sunDark : sun} style={styles.icon} resizeMode="contain" />
            <AppText style={styles.label}>Theme</AppText>
          </View>
          <ThemeSwitch style={styles.switch} />
        </View>

        <TouchableOpacity
          style={[styles.item, { borderWidth: 1, borderColor: colors.border }]}
          onPress={() => navigation.navigate('ProfileDetails', { screen: 'Settings' })}
        >
          <Image source={isDarkMode ? settingDark : setting} style={styles.icon} resizeMode="contain" />
          <AppText style={styles.itemText}>Settings</AppText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          dispatch(logout());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
          style={[styles.item, { borderWidth: 1, borderColor: colors.border, marginTop: 20 }]}
        >
          <Image source={logouts} style={styles.icon} resizeMode="contain" />
          <AppText style={[styles.itemText, { color: 'red' }]}>Logout</AppText>
        </TouchableOpacity>
      </ScrollView>
    </AppView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: {
    paddingBottom: 40, // adds space at bottom for scroll
  },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '600' },
  phone: { fontSize: 16, fontWeight: '400', color: "#6B7280", marginTop: 5 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  item1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemText: { marginLeft: 15, fontSize: 18, fontWeight: '500' },
  icon: { width: 24, height: 24 },
  label: { fontSize: 18, fontWeight: '500' },
});
