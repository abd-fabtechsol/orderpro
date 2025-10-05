import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';
import { height, hp, wp } from '../../constants/dimension';
import AppButton from '../../components/common/AppButton';

const InvoiceScreen = ({ navigation }) => {
    const{colors}=useTheme()
  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerText}>Invoice</AppText>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppText style={styles.closeButton}>×</AppText>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.invoiceCard,{backgroundColor:colors.search,height:hp(80)}]}>
        <AppText style={styles.sectionTitle}>Order Invoice</AppText>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2909/2909753.png' }} // Replace with actual logo URL
            style={styles.logo}
            resizeMode='contain'
          />
          <AppText style={styles.companyName}>Daily Fresh</AppText>
        </View>
        <AppText style={styles.infoText}>Invoice #: INV-10234</AppText>
        <AppText style={styles.infoText}>Date: 01 Sept 2025</AppText>
        <AppText style={styles.infoText}>Status: Pending</AppText>
        <View style={styles.divider} />
        
        <View style={styles.tableHeader}>
          <AppText style={styles.tableHeaderText}>Product</AppText>
          <AppText style={styles.tableHeaderText}>Qty</AppText>
          <AppText style={styles.tableHeaderText}>Price</AppText>
        </View>
        <View style={styles.tableRow}>
          <AppText style={styles.tableCell}>Milk</AppText>
          <AppText style={styles.tableCell}>50L</AppText>
          <AppText style={styles.tableCell}>$100</AppText>
        </View>
        <View style={styles.tableRow}>
          <AppText style={styles.tableCell}>Bread</AppText>
          <AppText style={styles.tableCell}>50pc</AppText>
          <AppText style={styles.tableCell}>$75</AppText>
        </View>
        <View style={styles.tableTotal}>
          <AppText style={styles.tableCell}>Total</AppText>
          <AppText style={styles.tableTotalPrice}>$175</AppText>
        </View>
        <View style={styles.divider} />
        
        <View style={[styles.buttonContainer,{justifyContent:"space-between",flexDirection:"row"}]}>
            <AppButton style={{height:43,width:wp(40)}} title={"Mark as Paid"}  />
            <AppButton style={{height:43,width:wp(40),backgroundColor:"#d3d3d3"}} textStyle={{color:colors.text}} title={"Download"}  />
          {/* <TouchableOpacity style={styles.markAsPaidButton}>
            <AppText style={styles.buttonText}>Mark as Paid</AppText>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.downloadButton}>
            <AppText style={styles.buttonText}>Download</AppText>
          </TouchableOpacity> */}
        </View>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: '500', },
  closeButton: { fontSize: 20 },
  invoiceCard: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '500',textAlign: 'center', marginBottom: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: { width: 20, height: 20, marginRight: 5 },
  companyName: { fontSize: 16 },
  infoText: { fontSize: 14, marginBottom: 5,marginBottom: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 40 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableHeaderText: { fontWeight: '500', fontSize: 14,marginBottom: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  tableCell: { fontSize: 14,marginBottom: 20 },
  tableTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  tableTotalPrice: { fontSize: 16, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  markAsPaidButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
  downloadButton: { backgroundColor: '#d3d3d3', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default InvoiceScreen;