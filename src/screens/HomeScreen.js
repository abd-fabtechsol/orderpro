import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import AppView from '../components/common/AppView';
import AppText from '../components/common/AppText';
import { colors } from '../constants';
import AppFlatList from '../components/common/AppFlatList';
import usePaginatedData from '../hooks/usePaginatedData';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
    const { isDarkMode } = useTheme();
    const [inputValue, setInputValue] = useState('');
    const fetchChats = async (page, limit) => {
        // Simulate a response with hasNext
        const total = 60;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = Array.from({ length: Math.min(limit, total - start) }, (_, i) => `Chat ${start + i + 1}`);
      
        return new Promise(resolve => setTimeout(() => {
          resolve({
            data,
            hasNext: end < total
          });
        }, 1000));
      };
      
        const {
          data,
          loadMore,
          refresh,
          refreshing,
          loadingMore,
        } = usePaginatedData(fetchChats);
      
  
  return (
    <AppView keyboardAvoid>
   
      <View style={styles.header}>
        <AppText style={[styles.headerText,{color:isDarkMode?"red":"green"}]}>Header</AppText>
      </View>
<View style={{flex:4}}>
      <AppFlatList
        data={data}
        renderItem={({ item }) => <AppText style={{ padding: 20 }}>{item}</AppText>}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMore}
        onRefresh={refresh}
        refreshing={refreshing}
        loadingMore={loadingMore}
        horizontal={false} // change to true for horizontal scroll
      />
</View>
      <View style={styles.footer}>
       
      <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={inputValue}
          onChangeText={setInputValue}
          placeholderTextColor="#666"
        />

      </View>
  
    </AppView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  header: {
 flex:0.3,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 16,
  },
  footer: {
 flex:0.3,

    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 18,
    marginVertical: 8,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderColor: '#aaa',
    borderWidth: 1,
    flex: 1,
  },
});
