import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useFetchEducatorPayments } from '@/hooks/useFetchEducatorPayments';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
  warning: '#EA580C',
  info: '#2563EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'educatorPayments'>;

export default function EducatorPaymentsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const educatorId = user?.uid;

  const { payments, stats, loading, error } = useFetchEducatorPayments(educatorId || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pending'>('overview');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={palette.primary} />
          <Text style={[styles.cardTitle, { marginTop: 16 }]}>Erreur</Text>
          <Text style={[styles.cardMeta, { marginTop: 8, textAlign: 'center' }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'pending':
        return { bg: '#FFFBEB', text: '#92400E' };
      case 'failed':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'refunded':
        return { bg: '#F3F4F6', text: '#374151' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'refunded':
        return 'Remboursé';
      default:
        return status;
    }
  };

  const completedPayments = payments.filter((p) => p.status === 'completed');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={18} color={palette.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Mes Paiements</Text>
            </View>
          </View>

          <View style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>Revenus du mois</Text>
              <Text style={styles.revenueValue}>{stats.totalAmount.toFixed(2)}€</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialCommunityIcons name="arrow-up" size={16} color={palette.success} />
                <Text style={[styles.revenueDelta, { color: palette.success }]}>
                  {completedPayments.length} paiements reçus
                </Text>
              </View>
            </View>
            <View style={styles.revenueIcon}>
              <MaterialCommunityIcons name="trending-up" size={26} color={palette.success} />
            </View>
          </View>

          <View style={styles.quickRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={palette.success} />
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Payés</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={palette.warning} />
              <Text style={styles.statValue}>{stats.pending}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="currency-eur" size={18} color={palette.info} />
              <Text style={styles.statValue}>
                {stats.completed > 0 ? (stats.totalAmount / stats.completed).toFixed(0) : 0}€
              </Text>
              <Text style={styles.statLabel}>Moy/client</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <View style={styles.tabs}>
            {(
              [
                { id: 'overview', label: 'Vue' },
                { id: 'transactions', label: 'Reçus' },
                { id: 'pending', label: 'En attente' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === 'overview' && (
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
                <Text style={styles.sectionTitle}>Informations</Text>
                <Text style={[styles.cardMeta, { marginTop: 12 }]}>
                  Vous avez reçu {stats.completed} paiements pour un total de {stats.totalAmount.toFixed(2)}€
                </Text>
                <Text style={[styles.cardMeta, { marginTop: 8 }]}>
                  {stats.pending} paiement{stats.pending !== 1 ? 's' : ''} en attente: {stats.pendingAmount.toFixed(2)}€
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'transactions' && (
            <View style={{ gap: 12 }}>
              {completedPayments.length > 0 ? (
                completedPayments.map((payment) => {
                  const statusColor = getStatusColor(payment.status);
                  const completedDate = payment.completedAt
                    ? new Date(payment.completedAt).toLocaleDateString('fr-FR')
                    : 'N/A';

                  return (
                    <View key={payment.id} style={styles.card}>
                      <View style={styles.transactionHeader}>
                        <View style={styles.transactionIcon}>
                          <Ionicons
                            name={paymentMethodIcon(payment.paymentMethodType)}
                            size={18}
                            color={palette.primary}
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.cardTitle}>{payment.description}</Text>
                          <Text style={styles.cardMeta}>Client: {payment.payerUserId}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.cardTitle}>+{payment.amount.toFixed(2)}€</Text>
                          <View style={[styles.status, { backgroundColor: statusColor.bg }]}>
                            <Text style={[styles.statusText, { color: statusColor.text }]}>
                              {getStatusLabel(payment.status)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.transactionFooter}>
                        <Text style={styles.cardTime}>{completedDate}</Text>
                        <Text style={styles.cardTime}>{paymentMethodLabel(payment.paymentMethodType)}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.card}>
                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="inbox-outline" size={32} color={palette.gray} />
                    <Text style={styles.cardTitle}>Aucun paiement reçu</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'pending' && (
            <View style={{ gap: 12 }}>
              {pendingPayments.length > 0 ? (
                <>
                  <View style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color={palette.warning} />
                      <Text style={[styles.cardTitle, { color: '#92400E' }]}>
                        {pendingPayments.length} paiement{pendingPayments.length !== 1 ? 's' : ''} en attente
                      </Text>
                    </View>
                  </View>
                  {pendingPayments.map((payment) => {
                    const createdDate = new Date(payment.createdAt).toLocaleDateString('fr-FR');

                    return (
                      <View key={payment.id} style={styles.card}>
                        <View style={styles.transactionHeader}>
                          <View style={[styles.transactionIcon, { backgroundColor: '#FFEDD5' }]}>
                            <MaterialCommunityIcons
                              name="clock-outline"
                              size={18}
                              color={palette.warning}
                            />
                          </View>
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.cardTitle}>{payment.description}</Text>
                            <Text style={styles.cardMeta}>Client: {payment.payerUserId}</Text>
                          </View>
                          <Text style={styles.cardTitle}>{payment.amount.toFixed(2)}€</Text>
                        </View>
                        <View style={styles.transactionFooter}>
                          <Text style={styles.cardTime}>Créé: {createdDate}</Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View style={styles.card}>
                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <MaterialCommunityIcons name="check-decagram" size={32} color={palette.success} />
                    <Text style={styles.cardTitle}>Tout est à jour</Text>
                    <Text style={styles.cardMeta}>Aucun paiement en attente</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    color: palette.success,
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
});
