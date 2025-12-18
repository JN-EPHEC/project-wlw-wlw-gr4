import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    success: '#10B981',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeachersPricing'>;

export default function ClubTeachersPricingScreen({ navigation, route }: Props) {
  const currentTeachersCount = Number(route.params?.current ?? 1);
  const [selectedCount, setSelectedCount] = useState(5);
  const pricePerTeacher = 5;

  const priceInfo = useMemo(() => ({
      paid: selectedCount - Math.floor(selectedCount / 5),
      free: Math.floor(selectedCount / 5),
      total: (selectedCount - Math.floor(selectedCount / 5)) * pricePerTeacher,
  }), [selectedCount]);

  const pricingOptions = [1, 3, 5, 10];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter des enseignants</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Abonnement actuel : <Text style={styles.summaryHighlight}>{currentTeachersCount}</Text> enseignant(s)</Text>
        </View>
        <View style={styles.offerCard}>
            <MaterialCommunityIcons name="gift-outline" size={24} color={colors.success} />
            <Text style={styles.offerText}>1 enseignant <Text style={{fontWeight: 'bold'}}>offert</Text> tous les 5 ajoutés !</Text>
        </View>

        <View style={styles.pricingGrid}>
            {pricingOptions.map(count => (
                <PricingOption key={count} count={count} selected={selectedCount === count} onPress={() => setSelectedCount(count)} />
            ))}
        </View>
        
        <View style={styles.customCounter}>
            <TouchableOpacity onPress={() => setSelectedCount(c => Math.max(1, c-1))} style={styles.counterBtn}><Ionicons name="remove" size={24} color={colors.primary} /></TouchableOpacity>
            <Text style={styles.counterValue}>{selectedCount}</Text>
            <TouchableOpacity onPress={() => setSelectedCount(c => c+1)} style={styles.counterBtn}><Ionicons name="add" size={24} color={colors.primary} /></TouchableOpacity>
        </View>

        <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total mensuel</Text>
            <Text style={styles.totalPrice}>{priceInfo.total}€</Text>
            <Text style={styles.totalSub}>Pour {priceInfo.paid} enseignant(s) payant(s) + {priceInfo.free} offert(s).</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('clubTeachersPayment', { count: selectedCount, price: priceInfo.total })}>
            <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PricingOption = ({ count, selected, onPress }: any) => (
    <TouchableOpacity style={[styles.optionCard, selected && styles.optionSelected]} onPress={onPress}>
        <Text style={[styles.optionCount, selected && {color: colors.primary}]}>{count}</Text>
        <Text style={[styles.optionLabel, selected && {color: colors.primary}]}>enseignant(s)</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  summaryCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 1 },
  summaryText: { fontSize: 16, color: colors.textMuted },
  summaryHighlight: { fontWeight: 'bold', color: colors.text },
  offerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 16 },
  offerText: { flex: 1, fontSize: 15, color: colors.success },
  pricingGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  optionCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.primary },
  optionCount: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  optionLabel: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  customCounter: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16 },
  counterBtn: { padding: 12, backgroundColor: 'rgba(39, 179, 163, 0.1)', borderRadius: 12 },
  counterValue: { fontSize: 32, fontWeight: 'bold', color: colors.primary },
  totalCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 24, alignItems: 'center', elevation: 2, shadowColor: '#000' },
  totalLabel: { fontSize: 16, color: colors.textMuted },
  totalPrice: { fontSize: 40, fontWeight: 'bold', color: colors.primary, marginVertical: 8 },
  totalSub: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: colors.background },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});