import React from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';

const AppFlatList = ({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onRefresh,
  refreshing = false,
  loadingMore = false,
  horizontal = false,
  ListHeaderComponent,
  ListFooterComponent,
  style,
  contentContainerStyle,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal={horizontal}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        ListFooterComponent || (loadingMore ? <LoadingIndicator /> : null)
      }
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const LoadingIndicator = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="small" />
  </View>
);

const styles = StyleSheet.create({
  loading: {
    padding: 10,
    alignItems: 'center',
  },
});

export default AppFlatList;
