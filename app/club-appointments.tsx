import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  accent: '#41B6A6',
};

const appointments = {
  upcoming: [
    {
      id: 1,
      date: '25 Oct 2025',
      time: '10:00',
      client: 'Marie Dupont',
      dog: 'Max',
      service: 'Agility',
      trainer: 'Pierre Martin',
      terrain: 'Terrain principal',
      duration: '1 h',
      price: 45,
      status: 'confirmed',
      participants: 1,
      maxParticipants: 1,
    },
    {
      id: 2,
      date: '25 Oct 2025',
      time: '14:30',
      client: 'Jean Martin',
      dog: 'Luna',
      service: 'Education canine',
      trainer: 'Sophie Leclerc',
      terrain: 'Terrain de dressage',
      duration: '1 h',
      price: 50,
      status: 'pending',
      participants: 1,
      maxParticipants: 1,
    },
    {
      id: 3,
      date: '26 Oct 2025',
      time: '16:00',
      client: 'Cours collectif',
      dog: 'Multiple',
      service: 'Obéissance',
      trainer: 'Pierre Martin',
      terrain: 'Terrain principal',
      duration: '2 h',
      price: 30,
      status: 'confirmed',
      participants: 8,
      maxParticipants: 10,
    },
  ],
  past: [
    {
      id: 4,
      date: '22 Oct 2025',
      time: '10:00',
      client: 'Thomas Petit',
      dog: 'Rex',
      service: 'Comportement',
      trainer: 'Sophie Leclerc',
      duration: '1 h 30',
      price: 65,
      status: 'completed',
      paid: true,
    },
    {
      id: 5,
      date: '20 Oct 2025',
      time: '15:00',
      client: 'Julie Rousseau',
      dog: 'Bella',
      service: 'Agility',
      trainer: 'Pierre Martin',
      duration: '1 h',
      price: 45,
      status: 'completed',
      paid: true,
    },
  ],
  cancelled: [
    {
      id: 6,
      date: '23 Oct 2025',
      time: '11:00',
      client: 'Marc Dubois',
      dog: 'Rocky',
      service: 'Education',
      trainer: 'Sophie Leclerc',
      duration: '1 h',
      price: 50,
      status: 'cancelled',
      cancelledBy: 'Client',
      cancelReason: 'Chien malade',
    },
  ],
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAppointments'>;

export default function ClubAppointmentsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [search, setSearch] = useState('');

  const counts = useMemo(
    () => ({
      upcoming: appointments.upcoming.length,
      past: appointments.past.length,
      cancelled: appointments.cancelled.length,
    }),
    []
  );

  const filtered = (list: typeof appointments.upcoming) => {
    if (!search) return list;
    const lower = search.toLowerCase();
    return list.filter(
      (item) =>
        item.client.toLowerCase().includes(lower) ||
        item.service.toLowerCase().includes(lower) ||
        item.dog.toLowerCase().includes(lower)
    );
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmé', color: '#DCFCE7', text: '#166534' };
      case 'pending':
        return { label: 'En attente', color: '#FFF7ED', text: '#9A3412' };
      case 'completed':
        return { label: 'Terminé', color: '#DBEAFE', text: '#1D4ED8' };
      case 'cancelled':
        return { label: 'Annulé', color: '#FEE2E2', text: '#991B1B' };
      default:
        return { label: status, color: palette.border, text: palette.gray };
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
            <Text style={styles.headerTitle}>Mes rendez-vous</Text>
            <TouchableOpacity style={styles.createBtn}>
              <Ionicons name="add" size={20} color={palette.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.quickRow}>
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={18} color={palette.primary} />
              <Text style={styles.statValue}>{counts.upcoming}</Text>
              <Text style={styles.statLabel}>À venir</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color="#16A34A" />
              <Text style={styles.statValue}>{counts.past}</Text>
              <Text style={styles.statLabel}>Terminés</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="close-circle-outline" size={18} color="#DC2626" />
              <Text style={styles.statValue}>{counts.cancelled}</Text>
              <Text style={styles.statLabel}>Annulés</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.homeTrainingBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('clubHomeTrainingRequests')}
          >
            <Ionicons name="home-outline" size={18} color="#fff" />
            <Text style={styles.homeTrainingText}>Demandes à domicile</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 16, gap: 14 }}>
          <View style={styles.tabs}>
            {(
              [
                { id: 'upcoming', label: 'À venir' },
                { id: 'past', label: 'Passés' },
                { id: 'cancelled', label: 'Annulés' },
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

          {activeTab === 'upcoming' ? (
            <View style={{ gap: 12 }}>
              <View style={styles.search}>
                <Ionicons name="search" size={18} color={palette.gray} />
                <TextInput
                  placeholder="Rechercher un client, un chien..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  placeholderTextColor={palette.gray}
                />
                <TouchableOpacity>
                  <MaterialCommunityIcons name="filter-variant" size={20} color={palette.gray} />
                </TouchableOpacity>
              </View>

              {filtered(appointments.upcoming).map((appt) => {
                const badge = statusBadge(appt.status);
                return (
                  <View key={appt.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={styles.cardIcon}>
                          <Ionicons name="calendar" size={18} color={palette.primary} />
                        </View>
                        <View>
                          <Text style={styles.cardTitle}>{appt.service}</Text>
                          <Text style={styles.cardMeta}>{appt.date} · {appt.time}</Text>
                        </View>
                      </View>
                      <View style={[styles.status, { backgroundColor: badge.color }]}>
                        <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={16} color={palette.gray} />
                      <Text style={styles.detailText}>{appt.client}</Text>
                    </View>
                    {appt.dog !== 'Multiple' ? (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="paw-outline" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>{appt.dog}</Text>
                      </View>
                    ) : null}
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color={palette.gray} />
                      <Text style={styles.detailText}>{appt.duration} · {appt.trainer}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons name="map-marker" size={16} color={palette.gray} />
                      <Text style={styles.detailText}>{appt.terrain}</Text>
                    </View>
                    {appt.maxParticipants > 1 ? (
                      <View style={styles.detailRow}>
                        <Ionicons name="people-outline" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>
                          {appt.participants}/{appt.maxParticipants} participants
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.cardFooter}>
                      <Text style={styles.price}>{appt.price}€</Text>
                      {appt.status === 'pending' ? (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: palette.accent }]}>
                            <Ionicons name="checkmark" size={14} color="#fff" />
                            <Text style={styles.smallBtnText}>Confirmer</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost]}>
                            <Ionicons name="close" size={14} color={palette.text} />
                            <Text style={[styles.smallBtnText, { color: palette.text }]}>Refuser</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity style={[styles.circleBtn, styles.circleBtnBorder]}>
                            <MaterialCommunityIcons name="pencil" size={16} color={palette.text} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.circleBtn, styles.circleBtnBorder]}>
                            <MaterialCommunityIcons name="trash-can-outline" size={16} color="#B91C1C" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {activeTab === 'past' ? (
            <View style={{ gap: 10 }}>
              {appointments.past.map((appt) => {
                const badge = statusBadge(appt.status);
                return (
                  <View key={appt.id} style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
                    <View style={styles.cardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                          <MaterialCommunityIcons name="check-circle-outline" size={18} color="#1D4ED8" />
                        </View>
                        <View>
                          <Text style={styles.cardTitle}>{appt.service}</Text>
                          <Text style={styles.cardMeta}>{appt.date} · {appt.time}</Text>
                        </View>
                      </View>
                      <View style={[styles.status, { backgroundColor: badge.color }]}>
                        <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={16} color={palette.gray} />
                      <Text style={styles.detailText}>{appt.client} - {appt.dog}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailText}>{appt.trainer}</Text>
                      <Text style={styles.detailText}>{appt.price}€</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}

          {activeTab === 'cancelled' ? (
            <View style={{ gap: 10 }}>
              {appointments.cancelled.map((appt) => {
                const badge = statusBadge(appt.status);
                return (
                  <View
                    key={appt.id}
                    style={[
                      styles.card,
                      { backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#DC2626' },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={[styles.cardIcon, { backgroundColor: '#FEE2E2' }]}>
                          <MaterialCommunityIcons name="close-circle-outline" size={18} color="#DC2626" />
                        </View>
                        <View>
                          <Text style={styles.cardTitle}>{appt.service}</Text>
                          <Text style={styles.cardMeta}>{appt.date} · {appt.time}</Text>
                        </View>
                      </View>
                      <View style={[styles.status, { backgroundColor: badge.color }]}>
                        <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={16} color={palette.gray} />
                      <Text style={styles.detailText}>{appt.client} - {appt.dog}</Text>
                    </View>
                    <View style={[styles.noteBox]}>
                      <Text style={styles.noteText}>Annulé par : {appt.cancelledBy}</Text>
                      <Text style={styles.noteText}>Raison : {appt.cancelReason}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <ClubBottomNav current="clubAppointments" />
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
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
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontWeight: '700',
    color: palette.text,
  },
  statLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  homeTrainingBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  homeTrainingText: {
    color: '#fff',
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
  },
  badge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    color: palette.text,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 12,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  detailText: {
    color: palette.text,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  price: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  smallBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  smallBtnGhost: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: palette.border,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnBorder: {
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  noteBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginTop: 8,
  },
  noteText: {
    color: '#991B1B',
    fontSize: 12,
  },
});
