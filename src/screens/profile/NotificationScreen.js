import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import Header from '../../components/Header';
import { hp } from '../../constants/dimension';

const NotificationScreen = () => {
  const {colors}=useTheme()
  const [settings, setSettings] = useState({
    general: true,
    sound: false,
    vibrate: false,
    newOrder: true,
    appUpdate: false,
    addSupplier: false,
  });

  const toggle = key =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <AppView style={styles.container}>
      <Header title="Notification"/>
      <View style={{marginBottom:hp(5)}}></View>
      {Object.keys(settings).map(key => (
        <View style={[styles.row,{borderWidth:1,borderColor:colors.border}]} key={key}>
          <AppText style={styles.label}>{key.replace(/([A-Z])/g, ' $1')}</AppText>
          <Switch value={settings[key]} onValueChange={() => toggle(key)} />
        </View>
      ))}
    </AppView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderRadius: 10,
    paddingVertical:Platform.select({
      ios: 15,         // No margin for iOS
      android: 0,    // Add margin for Android
    })
  },
  label: { fontSize: 16,fontWeight:"400"  },
});
