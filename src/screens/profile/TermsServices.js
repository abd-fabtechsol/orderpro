import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import Header from '../../components/Header';
import { hp } from '../../constants/dimension'
const TermsServices = () => {
  return (
    <AppView style={styles.container}>
       <Header title="Terms of Services"/>
      
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AppText style={styles.heading}>1. Types of Data we collect</AppText>
      <AppText style={styles.text}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,</AppText>

      <AppText style={styles.heading}>2. User of your personal data</AppText>
      <AppText style={styles.text}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,</AppText>

      <AppText style={styles.heading}>3. Disclosure of your personal data</AppText>
      <AppText style={styles.text}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,</AppText>
    </ScrollView>
    </AppView>
  )
}

export default TermsServices
const styles = StyleSheet.create({
    container: { flex: 1,  padding: 20 },
    heading: { fontSize: 16, fontWeight: '700', marginTop: 20 },
    text: { fontSize: 14,  marginTop: 8 },
  });
  