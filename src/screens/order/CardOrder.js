import React from 'react';
import {
    View, TouchableOpacity, StyleSheet,
    Image
} from 'react-native';
import AppText from '../../components/common/AppText';
import pic from "../../../assets/dp.png";

const CardOrder = ({colors,item,navigation}) => {
  return (
    <View style={[styles.card,{backgroundColor:colors.background,borderColor:colors.border}]}>
      <View style={{flexDirection:"row",gap:10,alignItems:"center"}}>
<Image source={pic} style={{width: 38, height: 38}} resizeMode="contain" />
        <AppText style={styles.vendor}>{item.vendor}</AppText>
      </View>
      <View style={styles.cardHeader}>
        <AppText style={styles.date}>{`Order: ${item.orderNo}`}</AppText>
        <AppText style={styles.date}>{`Order: ${item.date}`}</AppText>
      </View>
      <View style={styles.cardFooter}>

        <AppText style={styles.total}>{`Total: `}</AppText>
        <AppText style={styles.total}>{` $${item.total}`}</AppText>
       
      </View>
      <View style={styles.statusWrapper}>
        <AppText style={[styles.status, item.status === 'Pending' ? styles.pending : styles.delivered,{backgroundColor:colors.cardColor}]}>
          {item.status}
        </AppText>
         <TouchableOpacity onPress={() => navigation.navigate('ProfileDetails', {  // tab or parent route
  screen: 'invoice',           // child screen
  params: { order: item },
})}>
          <AppText style={styles.invoiceLink}>View Invoice</AppText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CardOrder

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, },
  
    tabs: { flexDirection: 'row', marginBottom: 12,borderRadius:10,padding:5 },
    tab: { flex: 1, padding: 7, alignItems: 'center',borderRadius:10 },
    activeTab: { borderColor: '#1DBF72' },
    tabText: { fontSize: 16, color: '#888' },
    activeTabText: { color: '#1DBF72', fontWeight: '500' },
  
    filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
    filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10,borderWidth:1  },
    activeFilter: { backgroundColor: '#1DBF72' },
    filterText: { fontSize: 14 },
    activeFilterText: { color: '#fff' },
  
    card: {  padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1,  },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
    vendor: { fontSize: 18, fontWeight: '500' },
    date: { fontSize: 14,fontWeight:"400", color: '#888' },
  
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginVertical: 10 },
    total: { fontSize: 18, fontWeight: '500' },
    invoiceLink: { fontSize: 14,fontWeight:"500",color: '#1DBF72', fontWeight: '500' },
  
    statusWrapper: {flexDirection:"row", marginTop: 6,alignItems:"center", justifyContent:"space-between" },
    status: { fontSize: 14,fontWeight:"400", paddingHorizontal: 8, padding: 6, borderRadius: 8 },
    pending: { color: '#E6A500' },
    delivered: { color: '#1DBF72' },
  });