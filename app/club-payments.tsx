import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const stats = {
  totalRevenue: 2850,
  pendingPayments: 3,
  completedPayments: 34,
  monthlyGrowth: 12,
  averageTransaction: 52,
};

const recentTransactions = [
  { id: 1, date: '22 Oct 2025', client: 'Marie Dupont', service: 'Agility', amount: 45, status: 'completed', method: 'card' },
  { id: 2, date: '22 Oct 2025', client: 'Jean Martin', service: 'Education', amount: 50, status: 'completed', method: 'card' },
  { id: 3, date: '21 Oct 2025', client: 'Sophie Bernard', service: 'Cours collectif', amount: 30, status: 'completed', method: 'cash' },
  { id: 4, date: '20 Oct 2025', client: 'Thomas Petit', service: 'Comportement', amount: 65, status: 'completed', method: 'transfer' },
];

const pendingPayments = [
  { id: 1, date: '25 Oct 2025', client: 'Julie Rousseau', service: 'Agility', amount: 45, dueDate: '27 Oct 2025' },
  { id: 2, date: '25 Oct 2025', client: 'Marc Dubois', service: 'Education', amount: 50, dueDate: '28 Oct 2025' },
  { id: 3, date: '24 Oct 2025', client: 'Laura Martin', service: 'Obéissance', amount: 30, dueDate: '26 Oct 2025' },
];

const monthlyBreakdown = [
  { service: 'Agility', revenue: 890, sessions: 18, percentage: 31 },
  { service: 'Éducation canine', revenue: 1200, sessions: 24, percentage: 42 },
  { service: 'Obéissance', revenue: 480, sessions: 16, percentage: 17 },
  { service: 'Comportement', revenue: 280, sessions: 4, percentage: 10 },
];


type Props = NativeStackScreenProps<ClubStackParamList, 'clubPayments'>;
export default function ClubPaymentsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pending'>('overview');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const paymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return 'card-outline' as const;
      case 'cash':
        return 'cash-outline' as const;
      case 'transfer':
        return 'swap-horizontal-outline' as const;
      default:
        return 'cash-outline' as const;
    }
  };

  const paymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      case 'transfer':
        return 'Virement';
      default:
        return 'Autre';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubHome')}>
                <Ionicons name="arrow-back" size={18} color={palette.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Paiements</Text>
            </View>
            <TouchableOpacity style={styles.exportBtn}>
              <MaterialCommunityIcons name="download" size={18} color={palette.primary} />
              <Text style={styles.exportText}>Exporter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>Revenus du mois</Text>
              <Text style={styles.revenueValue}>{stats.totalRevenue}€</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="arrow-up" size={16} color="#16A34A" />
                <Text style={styles.revenueDelta}>+{stats.monthlyGrowth}% vs mois dernier</Text>
              </View>
            </View>
            <View style={styles.revenueIcon}>
              <MaterialCommunityIcons name="trending-up" size={26} color="#16A34A" />
            </View>
          </View>

          <View style={styles.quickRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color="#16A34A" />
              <Text style={styles.statValue}>{stats.completedPayments}</Text>
              <Text style={styles.statLabel}>Payés</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#EA580C" />
              <Text style={styles.statValue}>{stats.pendingPayments}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="currency-eur" size={18} color="#2563EB" />
              <Text style={styles.statValue}>{stats.averageTransaction}€</Text>
              <Text style={styles.statLabel}>Moy/séance</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View style={styles.tabs}>
            {(
              [
                { id: 'overview', label: 'Vue' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'pending', label: 'Attente' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === 'overview' ? (
            <View style={{ gap: 14 }}>
              <View style={styles.periodRow}>
                {(['week', 'month', 'year'] as const).map((p) => {
                  const isActive = p === period;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.pill, isActive && styles.pillActive]}
                      onPress={() => setPeriod(p)}
                    >
                      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                        {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Revenus par service</Text>
                <View style={{ gap: 12, marginTop: 8 }}>
                  {monthlyBreakdown.map((item) => (
                    <View key={item.service}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                          <Text style={styles.cardTitle}>{item.service}</Text>
                          <Text style={styles.cardMeta}>{item.sessions} séances</Text>
                        </View>
                        <Text style={styles.cardTitle}>{item.revenue}€</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${item.percentage}%` }]} />
                        <Text style={styles.progressLabel}>{item.percentage}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[styles.card, { flex: 1 }]}>
                  <Text style={styles.sectionTitle}>Carte</Text>
                  <View style={styles.methodPercent}>
                    <Ionicons name="card-outline" size={20} color={palette.primary} />
                    <Text style={styles.methodValue}>65%</Text>
                  </View>
                  <Text style={styles.cardMeta}>Paiements par carte</Text>
                </View>
                <View style={[styles.card, { flex: 1 }]}>
                  <Text style={styles.sectionTitle}>Espèces</Text>
                  <View style={styles.methodPercent}>
                    <MaterialCommunityIcons name="cash" size={20} color="#10B981" />
                    <Text style={styles.methodValue}>25%</Text>
                  </View>
                  <Text style={styles.cardMeta}>Sur place</Text>
                </View>
                <View style={[styles.card, { flex: 1 }]}>
                  <Text style={styles.sectionTitle}>Virement</Text>
                  <View style={styles.methodPercent}>
                    <MaterialCommunityIcons name="bank-transfer" size={20} color="#8B5CF6" />
                    <Text style={styles.methodValue}>10%</Text>
                  </View>
                  <Text style={styles.cardMeta}>Transferts</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Évolution mensuelle</Text>
                <View style={styles.chartRow}>
                  {[65, 82, 75, 90, 88, 78, 85, 95].map((height, idx) => (
                    <View key={idx} style={styles.chartBarWrapper}>
                      <View style={[styles.chartBar, { height: `${height}%` }]} />
                      <Text style={styles.chartLabel}>{idx + 1}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.cardMeta}>Derniers 8 jours</Text>
              </View>
            </View>
          ) : null}

          {activeTab === 'transactions' ? (
            <View style={{ gap: 12 }}>
              <View style={styles.filterRow}>
                <TouchableOpacity style={styles.filterBtn}>
                  <MaterialCommunityIcons name="filter-variant" size={18} color={palette.text} />
                  <Text style={styles.filterText}>Filtrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pill, { backgroundColor: '#fff' }]}>
                  <Text style={styles.cardMeta}>Tous les paiements</Text>
                </TouchableOpacity>
              </View>

              {recentTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.card}>
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionIcon}>
                      <Ionicons name={paymentMethodIcon(transaction.method)} size={18} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{transaction.client}</Text>
                      <Text style={styles.cardMeta}>{transaction.service}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.cardTitle}>+{transaction.amount}€</Text>
                      <View style={[styles.status, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.statusText, { color: '#166534' }]}>Payé</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionFooter}>
                    <Text style={styles.cardTime}>{transaction.date}</Text>
                    <Text style={styles.cardTime}>{paymentMethodLabel(transaction.method)}</Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={[styles.pill, { backgroundColor: '#fff', alignSelf: 'stretch' }]}>
                <Text style={[styles.cardTitle, { fontSize: 14 }]}>Voir plus de transactions</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {activeTab === 'pending' ? (
            <View style={{ gap: 12 }}>
              {pendingPayments.length ? (
                <>
                  <View style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color="#D97706" />
                      <Text style={[styles.cardTitle, { color: '#92400E' }]}>
                        {pendingPayments.length} paiements en attente
                      </Text>
                    </View>
                  </View>
                  {pendingPayments.map((payment) => (
                    <View key={payment.id} style={styles.card}>
                      <View style={styles.transactionHeader}>
                        <View style={[styles.transactionIcon, { backgroundColor: '#FFEDD5' }]}>
                          <MaterialCommunityIcons name="clock-outline" size={18} color="#EA580C" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.cardTitle}>{payment.client}</Text>
                          <Text style={styles.cardMeta}>{payment.service}</Text>
                        </View>
                        <Text style={styles.cardTitle}>{payment.amount}€</Text>
                      </View>
                      <View style={styles.transactionFooter}>
                        <Text style={styles.cardTime}>Séance : {payment.date}</Text>
                        <Text style={[styles.cardTime, { color: '#C2410C' }]}>Échéance : {payment.dueDate}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#41B6A6', flex: 1 }]}>
                          <MaterialCommunityIcons name="check" size={16} color="#fff" />
                          <Text style={styles.smallBtnText}>Marquer payé</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost, { flex: 1 }]}>
                          <Text style={[styles.smallBtnText, { color: palette.text }]}>Relancer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <View style={styles.card}>
                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="check-decagram" size={32} color="#16A34A" />
                    <Text style={styles.cardTitle}>Tout est à jour</Text>
                    <Text style={styles.cardMeta}>Aucun paiement en attente</Text>
                  </View>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <ClubBottomNav current="clubPayments" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exportText: {
    color: palette.primary,
    fontWeight: '700',
  },
  revenueCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  revenueLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  revenueValue: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
  },
  revenueDelta: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '600',
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: palette.text,
    fontWeight: '700',
  },
  statLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: palette.primary,
  },
  tabLabel: {
    color: palette.gray,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  pillText: {
    color: palette.text,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 14,
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 12,
  },
  progressTrack: {
    marginTop: 8,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  progressLabel: {
    position: 'absolute',
    right: 6,
    top: -2,
    color: palette.gray,
    fontSize: 10,
  },
  methodPercent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  methodValue: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 160,
    marginTop: 12,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  chartBar: {
    width: '100%',
    backgroundColor: palette.primary,
    borderRadius: 8,
  },
  chartLabel: {
    color: palette.gray,
    fontSize: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  filterText: {
    color: palette.text,
    fontWeight: '600',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardTime: {
    color: palette.gray,
    fontSize: 12,
  },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  smallBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  smallBtnGhost: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: palette.border,
  },
});
