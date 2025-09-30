import React from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AppText from '../common/AppText';
import {hp} from '../../constants/dimension';
import { useTheme } from '../../context/ThemeContext';

const CountrySelectionSheet = ({
  data,
  handlePressItem,
  handleSearch,
}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.container,{backgroundColor: colors.background,}]}>
      {/* Search Bar */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search Country"
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        
      </View>

      {/* Country List */}
      <View style={styles.listWrapper}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          data={data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handlePressItem(item, index)}
              style={[
                styles.item,
                {borderBottomWidth: index === data.length - 1 ? 0 : 0.5,borderBottomColor: colors.border,},
              ]}>
              <AppText style={[styles.itemText,colors.text]}>
                {`${item.flag}  ${item.name} (${item.callingCode})`}
              </AppText>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default CountrySelectionSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp(2),
    
  },

  // Search input wrapper
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(3),
    borderWidth: 0.5,
    borderColor: '#ccc',
    paddingHorizontal: hp(1),
    height: hp(5.5),
    marginBottom: hp(2),
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#1DBF72',
    borderRadius: hp(2),
    width: hp(4),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List
  listWrapper: {
    flex: 1,                 // <-- fill remaining space
  
  },
  item: {
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(1),
    
  },
  itemText: {
    fontSize: 14,
  },
});
