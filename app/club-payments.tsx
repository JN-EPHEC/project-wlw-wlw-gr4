import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    error: '#DC2626',
    success: '#10B981',
};

const stats = {
  totalRevenue: 2850,
  pendingPayments: 3,
  completedPayments: 34,
  monthlyGrowth: 12,
  averageTransaction: 52,
};

// ... other data ...

type Props = NativeStackScreenProps<ClubStackParamList, 'clubPayments'>;
export default function ClubPaymentsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pending'>('overview');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Paiements</Text>
        </View>

        <View style={styles.content}>
            <View style={[styles.card, {backgroundColor: colors.primary, padding: 20}]}>
                <Text style={[styles.cardSubtitle, {color: 'rgba(255,255,255,0.8)'}]}>Revenus ce mois-ci</Text>
                <Text style={[styles.cardTitle, {color: '#fff', fontSize: 32, marginVertical: 4}]}>{stats.totalRevenue}€</Text>
                <View style={styles.progressBadge}>
                    <Ionicons name="trending-up" size={14} color={colors.primary} />
                    <Text style={styles.progressText}>+{stats.monthlyGrowth}% vs. mois dernier</Text>
                </View>
            </View>
            
            <View style={styles.statsGrid}>
                <StatBox icon="checkmark-circle-outline" value={stats.completedPayments} label="Payés" color={colors.success}/>
                <StatBox icon="time-outline" value={stats.pendingPayments} label="En attente" color={colors.accent}/>
                <StatBox icon="logo-euro" value={`${stats.averageTransaction}€`} label="Moy./séance" color={colors.primary}/>
            </View>
            
            <View style={styles.tabs}>
                <TabButton label="Aperçu" active={activeTab==='overview'} onPress={() => setActiveTab('overview')} />
                <TabButton label="Transactions" active={activeTab==='transactions'} onPress={() => setActiveTab('transactions')} />
                <TabButton label="En attente" active={activeTab==='pending'} onPress={() => setActiveTab('pending')} />
            </View>

            {/* Content for tabs would go here */}

        </View>
      </ScrollView>
      <ClubBottomNav current="clubPayments" />
    </SafeAreaView>
  );
}

const TabButton = ({ label, active, onPress }: any) => (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
);

const StatBox = ({ icon, value, label, color }: any) => (
    <View style={styles.statBox}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  content: { padding: 16, gap: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 16, elevation: 3, shadowColor: '#000' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
  progressBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
  progressText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, elevation: 2, shadowColor: '#000' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 18, padding: 6, elevation: 2, shadowColor: '#000' },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(39, 179, 163, 0.1)' },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
});