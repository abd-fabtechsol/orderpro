import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import ReportsHeader from '../../components/ReportsHeader';
import AppView from '../../components/common/AppView';
import { useTheme } from '../../context/ThemeContext';
import AppText from '../../components/common/AppText';
import apiClient from '../../api/apiClient';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const [period, setPeriod] = useState('Week');
  const { colors } = useTheme();

  // API state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  // Map period to API parameter
  const periodToApiParam = {
   
    'Week': 'w',
    'Month': 'm',
    'Year': 'y',
  };

  // Fetch report detail (suppliers, orders count, top products)
  const fetchReportDetail = async () => {
    try {
      const result = await apiClient.get('orders/report_detail/');
      console.log('Report Detail Result:', JSON.stringify(result, null, 2));

      if (result.ok && result.data) {
        setSuppliersCount(result.data.suppliers || 0);
        setOrdersCount(result.data.orders || 0);
        setTopProducts(result.data.top_products || []);
      }
    } catch (error) {
      console.error('Error fetching report detail:', error);
    }
  };

  // Fetch chart data from API
  const fetchReportData = async (selectedPeriod) => {
    setLoading(true);
    try {
      const apiPeriod = periodToApiParam[selectedPeriod];
      const result = await apiClient.get(`orders/report/?period=${apiPeriod}`);

      console.log('Report Result for period', selectedPeriod, ':', JSON.stringify(result, null, 2));

      if (result.ok && result.data) {
        console.log('Chart data from API:', result.data);
        setReportData(result.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch report detail on mount
  useEffect(() => {
    fetchReportDetail();
  }, []);

  // Fetch chart data when period changes
  useEffect(() => {
    fetchReportData(period);
  }, [period]);

  // Mock data (fallback)
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

  // Process API data for chart
  const getChartData = () => {
    if (reportData) {
      // Try different possible API response structures
      let labels = [];
      let values = [];

      // Check if reportData itself is an array (direct array response)
      if (Array.isArray(reportData)) {
        console.log('API returned direct array:', reportData);
        labels = reportData.map(item => item.label || item.day || item.month || item.name || item.period);
        values = reportData.map(item => item.count || item.orders || item.value || 0);
      }
      // Check for chart_data object
      else if (reportData.chart_data) {
        labels = reportData.chart_data.labels || [];
        values = reportData.chart_data.values || reportData.chart_data.data || [];
      }
      // Check for direct arrays (days, months, etc.)
      else if (reportData.days && Array.isArray(reportData.days)) {
        // Week period returns days array
        labels = reportData.days.map(day => day.label || day.day || day.name);
        values = reportData.days.map(day => day.count || day.orders || day.value || 0);
      }
      else if (reportData.months && Array.isArray(reportData.months)) {
        // Month/Year period returns months array
        labels = reportData.months.map(month => month.label || month.month || month.name);
        values = reportData.months.map(month => month.count || month.orders || month.value || 0);
      }
      // Check for data array property
      else if (reportData.data && Array.isArray(reportData.data)) {
        labels = reportData.data.map(item => item.label || item.name || item.period);
        values = reportData.data.map(item => item.count || item.orders || item.value || 0);
      }

      console.log('Processed chart - Labels:', labels, 'Values:', values);

      // Only use API data if we have valid labels and values
      if (labels.length > 0 && values.length > 0) {
        return {
          labels: labels,
          datasets: [
            {
              data: values,
            },
          ],
        };
      }
    }

    // Fallback to mock data
    return {
      labels: labelsByTab[period],
      datasets: [
        {
          data: chartDataByTab[period],
        },
      ],
    };
  };

  const chartData = getChartData();

  // 👇 Use theme colors for chart
  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `green`,
    labelColor: (opacity = 1) => colors.text,
    propsForBackgroundLines: {
      stroke: colors.border,
    },
    barPercentage: 0.3,
  };

  return (
    <AppView style={[styles.container, { backgroundColor: colors.background }]}>
      <ReportsHeader />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Row */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1DBF72" />
            <AppText style={{ marginTop: 10, color: '#888' }}>Loading report data...</AppText>
          </View>
        ) : (
          <View style={[styles.statsRow]}>
            <View style={[styles.statsBox, { borderColor: colors.border }]}>
              <AppText style={[styles.statsValue, { color: colors.text }]}>
                {suppliersCount}
              </AppText>
              <AppText style={[styles.statsLabel, { color: colors.text }]}>Suppliers</AppText>
            </View>
            <View style={[styles.statsBox, { borderColor: colors.border }]}>
              <AppText style={[styles.statsValue, { color: colors.text }]}>
                {ordersCount}
              </AppText>
              <AppText style={[styles.statsLabel, { color: colors.text }]}>Orders</AppText>
            </View>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filters}>
          {[ 'Week', 'Month', 'Year'].map(f => (
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
        {!loading && (
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
        )}

        {/* Top Products */}
        {!loading && (
          <>
            <AppText style={[styles.sectionTitle, { color: colors.text }]}>
              Top Products
            </AppText>
            <View style={[styles.table, { borderColor: colors.border }]}>
              <View style={styles.tableRowHeader}>
                <AppText style={[styles.tableHeader, { color: colors.text }]}>Supplier</AppText>
                <AppText style={[styles.tableHeader, { color: colors.text }]}>Product</AppText>
                <AppText style={[styles.tableHeader, { color: colors.text }]}>Qty</AppText>
              </View>

              {(topProducts.length > 0 ? topProducts : [
                { product__supplier__name: 'Green Mart', product_name: 'Tomato', total_quantity: '120kg' },
                { product__supplier__name: 'Amin Hotel', product_name: 'Chicken', total_quantity: '100kg' },
                { product__supplier__name: 'Daily Fresh', product_name: 'Milk', total_quantity: '90L' },
              ]).map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <AppText style={[styles.tableCell, { color: colors.text }]}>
                    {item.product__supplier__name || 'N/A'}
                  </AppText>
                  <AppText style={[styles.tableCell, { color: colors.text }]}>
                    {item.product_name || 'N/A'}
                  </AppText>
                  <AppText style={[styles.tableCell, { color: colors.text }]}>
                    {item.total_quantity || '0'}
                  </AppText>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </AppView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,

  },
  content: { paddingHorizontal: 16 },
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
