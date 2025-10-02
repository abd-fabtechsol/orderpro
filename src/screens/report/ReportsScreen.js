import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import ReportsHeader from '../../components/ReportsHeader';
import AppView from '../../components/common/AppView';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const [period, setPeriod] = useState('Today');

  const { colors } = useTheme(); // 👈 access theme colors

  // Mock data
  const chartDataByTab = {
    Today: [5, 8, 6, 9, 4, 7, 3],
    Week: [2, 4, 8, 12, 6, 10, 7],
    Month: [3, 6, 9, 12, 8, 15, 10],
    Year: [50, 120, 180, 90, 200, 150, 100],
  };

  const labelsByTab = {
    Today: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    Week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    Month: ['1', '5', '9', '11', '13', '15', '20'],
    Year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  };

  const chartData = {
    labels: labelsByTab[period],
    datasets: [
      {
        data: chartDataByTab[period],
      },
    ],
  };

  // 👇 Use theme colors for chart
  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `${colors.buttonColor}${Math.floor(opacity * 255).toString(16)}`,
    labelColor: (opacity = 1) => colors.text,
    propsForBackgroundLines: {
      stroke: colors.border,
    },
    barPercentage: 0.5,
  };

  return (
    <AppView style={[styles.container, { backgroundColor: colors.background }]}>
      <ReportsHeader />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Row */}
        <View style={[styles.statsRow]}>
          <View style={[styles.statsBox, { borderColor: colors.border }]}>
            <AppText style={[styles.statsValue, { color: colors.text }]}>15</AppText>
            <AppText style={[styles.statsLabel, { color: colors.text }]}>Suppliers</AppText>
          </View>
          <View style={[styles.statsBox, { borderColor: colors.border }]}>
            <AppText style={[styles.statsValue, { color: colors.text }]}>109</AppText>
            <AppText style={[styles.statsLabel, { color: colors.text }]}>Orders</AppText>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {['Today', 'Week', 'Month', 'Year'].map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setPeriod(f)}
              style={[
                styles.filterBtn,
                { borderColor: colors.border },
                period === f && { backgroundColor: colors.buttonColor },
              ]}
            >
              <AppText
                style={[
                  styles.filterText,
                  { color: period === f ? '#fff' : colors.text },
                ]}
              >
                {f}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={[styles.chart, { borderColor: colors.border }]}>
          <AppText style={[styles.sectionTitle, { color: colors.text }]}>
            Order Overview
          </AppText>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            fromZero
            style={{ borderRadius: 8 }}
          />
        </View>

        {/* Top Products */}
        <AppText style={[styles.sectionTitle, { color: colors.text }]}>
          Top Products
        </AppText>
        <View style={[styles.table, { borderColor: colors.border }]}>
          <View style={styles.tableRowHeader}>
            <AppText style={[styles.tableHeader, { color: colors.text }]}>Supplier</AppText>
            <AppText style={[styles.tableHeader, { color: colors.text }]}>Product</AppText>
            <AppText style={[styles.tableHeader, { color: colors.text }]}>Qty</AppText>
          </View>

          {[
            { supplier: 'Green Mart', product: 'Tomato', qty: '120kg' },
            { supplier: 'Amin Hotel', product: 'Chicken', qty: '100kg' },
            { supplier: 'Daily Fresh', product: 'Milk', qty: '90L' },
          ].map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <AppText style={[styles.tableCell, { color: colors.text }]}>{item.supplier}</AppText>
              <AppText style={[styles.tableCell, { color: colors.text }]}>{item.product}</AppText>
              <AppText style={[styles.tableCell, { color: colors.text }]}>{item.qty}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { padding: 16 },
  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  filterText: { fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statsBox: { flex: 0.48, borderRadius: 8, borderWidth: 1.5, padding: 16, alignItems: 'center' },
  statsValue: { fontSize: 20, fontWeight: '600' },
  statsLabel: { fontSize: 15,fontWeight: '400', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '500', marginBottom: 8, marginTop: 12 },
  chart: { borderRadius: 8, marginBottom: 20, borderWidth: 1.5, padding: 5 },
  table: { borderWidth: 1.5, borderRadius: 8, padding: 12 },
  tableRowHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8 },
  tableHeader: { fontWeight: '500',fontSize: 16, width: '33%', textAlign: 'center' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  tableCell: { width: '33%', textAlign: 'center',fontWeight: '400',fontSize: 16, },
});
