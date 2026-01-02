import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useFetchClubPayments } from '@/hooks/useFetchClubPayments';
import { useFetchClubAllBookings } from '@/hooks/useFetchClubAllBookings';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubPayments'>;
export default function ClubPaymentsScreen({ navigation }: Props) {
  const { profile, user } = useAuth();
  const clubId = (profile as any)?.clubId || user?.uid || '';
  const { payments, stats, loading, error } = useFetchClubPayments(clubId);
  const { bookings: allBookings } = useFetchClubAllBookings(clubId);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'pending'>('overview');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculer les revenus par éducateur basé sur les bookings confirmés
  const educatorStats = React.useMemo(() => {
    const statsMap = new Map<string, {
      educatorId: string;
      courseCount: number;
      participantCount: number;
      totalRevenue: number;
    }>();
    
    // Pour chaque booking confirmé
    allBookings.forEach((booking: any) => {
      const isConfirmed = booking.confirmedAt || booking.status === 'confirmed';
      const educatorId = booking.educatorId;
      
      if (educatorId && isConfirmed && booking.userIds) {
        const existing = statsMap.get(educatorId) || {
          educatorId,
          courseCount: 0,
          participantCount: 0,
          totalRevenue: 0,
        };
        
        // Ajouter 1 pour ce cours
        // Ajouter le nombre de participants à ce cours
        const participantCount = booking.userIds.length || 0;
        const coursePrice = (booking.price || 0) / 2; // Le club reçoit 50%
        const courseRevenue = coursePrice * participantCount;
        
        statsMap.set(educatorId, {
          educatorId,
          courseCount: existing.courseCount + 1,
          participantCount: existing.participantCount + participantCount,
          totalRevenue: existing.totalRevenue + courseRevenue,
        });
      }
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [allBookings]);

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
            <Text style={styles.headerTitle}>Paiements</Text>
            <TouchableOpacity style={styles.exportBtn}>
              <MaterialCommunityIcons name="download" size={18} color={palette.primary} />
              <Text style={styles.exportText}>Exporter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.revenueCard}>
            <View>
              <Text style={styles.revenueLabel}>Revenus du mois</Text>
              {loading ? (
                <ActivityIndicator size="large" color={palette.primary} />
              ) : (
                <>
                  <Text style={styles.revenueValue}>{(stats?.totalAmount || 0).toFixed(2)}€</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons name="arrow-up" size={16} color="#16A34A" />
                    <Text style={styles.revenueDelta}>Données en temps réel</Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.revenueIcon}>
              <MaterialCommunityIcons name="trending-up" size={26} color="#16A34A" />
            </View>
          </View>

          <View style={styles.quickRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color="#16A34A" />
              <Text style={styles.statValue}>{stats?.completed || 0}</Text>
              <Text style={styles.statLabel}>Payés</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#EA580C" />
              <Text style={styles.statValue}>{stats?.pending || 0}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="currency-eur" size={18} color="#2563EB" />
              <Text style={styles.statValue}>{stats?.average ? stats.average.toFixed(0) : 0}€</Text>
              <Text style={styles.statLabel}>Moy/séance</Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 }]}
            onPress={() => navigation.navigate('educatorPayments')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <MaterialCommunityIcons name="account-multiple" size={20} color="#1D4ED8" />
              <View>
                <Text style={[styles.cardTitle, { color: '#1D4ED8' }]}>Paiements des éducateurs</Text>
                <Text style={[styles.cardMeta, { color: '#2563EB' }]}>Voir ce que tu dois aux éducateurs</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#1D4ED8" />
          </TouchableOpacity>

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
                <Text style={styles.sectionTitle}>Revenus par éducateur</Text>
                <View style={{ gap: 12, marginTop: 8 }}>
                  {educatorStats.length === 0 ? (
                    <Text style={styles.cardMeta}>Aucun cours confirmé pour le moment</Text>
                  ) : (
                    educatorStats.map((educator, idx) => {
                      const maxRevenue = educatorStats[0]?.totalRevenue || 1;
                      const percentage = (educator.totalRevenue / maxRevenue) * 100;
                      return (
                        <View key={educator.educatorId || idx} style={styles.educatorRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.educatorName}>Éducateur {idx + 1}</Text>
                            <Text style={styles.educatorStats}>
                              {educator.courseCount} cours • {educator.participantCount} participants
                            </Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.educatorAmount}>{educator.totalRevenue.toFixed(2)}€</Text>
                            <View style={styles.progressBar}>
                              <View
                                style={[
                                  styles.progressFill,
                                  { width: `${Math.max(percentage, 10)}%` }, // Min 10% for visibility
                                ]}
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })
                  )}
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

              {payments.filter(p => p.status === 'completed').map((transaction) => (
                <View key={transaction.id} style={styles.card}>
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionIcon}>
                      <Ionicons name="card-outline" size={18} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.cardTitle}>{transaction.payerName || 'Client'}</Text>
                      <Text style={styles.cardMeta}>{transaction.description || 'Paiement'}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.cardTitle}>+{(transaction.amount || 0).toFixed(2)}€</Text>
                      <View style={[styles.status, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.statusText, { color: '#166534' }]}>Payé</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionFooter}>
                    <Text style={styles.cardTime}>{transaction.createdAt ? new Date(transaction.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : ''}</Text>
                    <Text style={styles.cardTime}>Carte bancaire</Text>
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
              {payments.filter(p => p.status === 'pending').length > 0 ? (
                <>
                  <View style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color="#D97706" />
                      <Text style={[styles.cardTitle, { color: '#92400E' }]}>
                        {payments.filter(p => p.status === 'pending').length} paiements en attente
                      </Text>
                    </View>
                  </View>
                  {payments.filter(p => p.status === 'pending').map((payment) => (
                    <View key={payment.id} style={styles.card}>
                      <View style={styles.transactionHeader}>
                        <View style={[styles.transactionIcon, { backgroundColor: '#FFEDD5' }]}>
                          <MaterialCommunityIcons name="clock-outline" size={18} color="#EA580C" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.cardTitle}>{payment.payerName || 'Client'}</Text>
                          <Text style={styles.cardMeta}>{payment.description || 'Paiement'}</Text>
                        </View>
                        <Text style={styles.cardTitle}>{(payment.amount || 0).toFixed(2)}€</Text>
                      </View>
                      <View style={styles.transactionFooter}>
                        <Text style={styles.cardTime}>Créé : {payment.createdAt ? new Date(payment.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : ''}</Text>
                        <Text style={[styles.cardTime, { color: '#C2410C' }]}>En attente de paiement</Text>
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
  educatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    gap: 12,
  },
  educatorName: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 14,
  },
  educatorStats: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 2,
  },
  educatorCourses: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 2,
  },
  educatorAmount: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 3,
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
