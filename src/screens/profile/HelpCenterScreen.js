import React, { use, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AppView from '../../components/common/AppView';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import { hp } from '../../constants/dimension';

const faqs = [
  { q: 'Can I pay suppliers directly through OrderPro?', a: 'No, OrderPro is for tracking only.' },
  { q: 'What if my supplier emails me an invoice?', a: 'You can upload it manually.' },
  { q: 'Can I mark an invoice as paid later?', a: 'Yes, from the invoice page.' },
];

const HelpCenterScreen = () => {
  const [expanded, setExpanded] = useState(null);
const {colors}=useTheme()
  return (
    <AppView style={styles.container}>
      <Header title={"Help Center"}/>
      <View style={{marginBottom:hp(5)}}></View>
      <TextInput placeholder="Search" style={styles.search} />

      {faqs.map((item, i) => (
        <View key={i} style={[styles.faq,{borderWidth:1,borderColor:colors.border}]}>
          <TouchableOpacity onPress={() => setExpanded(expanded === i ? null : i)}>
            <AppText style={styles.question}>{item.q}</AppText>
          </TouchableOpacity>
          {expanded === i && <AppText style={styles.answer}>{item.a}</AppText>}
        </View>
      ))}
    </AppView>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,  },
  search: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  faq: { padding: 15,
    marginTop: 10,
    borderRadius: 10,},
  question: { fontSize: 16, fontWeight: 500 },
  answer: { fontSize: 14, color: '#666', marginTop: 6 },
});
