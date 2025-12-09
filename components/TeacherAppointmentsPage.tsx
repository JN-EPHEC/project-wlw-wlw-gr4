import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  accent: '#41B6A6',
};

const planning = {
  today: [
    {
      id: 1,
      time: '09:00',
      dog: 'Nova',
      client: 'Marie Dupont',
      type: 'Coaching chiot',
      place: 'Parc Monceau',
      status: 'confirmed',
    },
    {
      id: 2,
      time: '11:30',
      dog: 'Rex',
      client: 'Thomas Petit',
      type: 'Agility groupe',
      place: 'Club Vincennes',
      status: 'confirmed',
    },
    {
      id: 3,
      time: '15:00',
      dog: 'Luna',
      client: 'Julie Roux',
      type: 'A domicile',
      place: 'Boulogne',
      status: 'pending',
    },
  ],
  week: [
    { id: 4, day: 'Mer', time: '10:00', dog: 'Rocky', client: 'Marc', type: 'Obeissance', place: 'Neuilly', status: 'pending' },
    { id: 5, day: 'Jeu', time: '14:00', dog: 'Bella', client: 'Sarah', type: 'Agility', place: 'Vincennes', status: 'confirmed' },
    { id: 6, day: 'Ven', time: '18:00', dog: 'Milo', client: 'Lucas', type: 'Collectif', place: 'Pantin', status: 'waiting' },
  ],
  requests: [
    { id: 7, client: 'Nouveau lead', detail: 'Cours de rappel pour Oslo', location: 'Chatillon', budget: '60 EUR' },
    { id: 8, client: 'Club Tendance', detail: '2 cours collectifs a programmer', location: 'Montreuil', budget: 'A definir' },
  ],
};

const tabs: Array<{ key: keyof typeof planning; label: string }> = [
  { key: 'today', label: 'Aujourd hui' },
  { key: 'week', label: 'Semaine' },
  { key: 'requests', label: 'Demandes' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: palette.text },
  statLabel: { color: palette.gray, fontSize: 12, textAlign: 'center' },
  tabs: { flexDirection: 'row', padding: 10, gap: 8 },
  tab: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  tabActive: {
    backgroundColor: '#FFF3EC',
    borderColor: palette.primary,
  },
  tabText: { color: palette.gray, fontWeight: '600' },
  tabTextActive: { color: palette.primary },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
  },
  timeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFF3EC',
    alignSelf: 'flex-start',
  },
  timeText: { color: palette.primary, fontWeight: '700' },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: { color: palette.text, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});

export default function TeacherAppointmentsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const [activeTab, setActiveTab] = useState<keyof typeof planning>('today');

  // Helper for navigation to appointment details
  const goToAppointmentDetail = (_id: number | string) => {
    navigation.navigate('teacher-appointments');
  };

  const counts = useMemo(
    () => ({
      today: planning.today.length,
      week: planning.week.length,
      requests: planning.requests.length,
    }),
    [],
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirme', bg: '#DCFCE7', text: '#166534' };
      case 'pending':
        return { label: 'A valider', bg: '#FFF7ED', text: '#9A3412' };
      default:
        return { label: 'En attente', bg: '#E0E7FF', text: '#3730A3' };
    }
  };

  return (
    <><SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Planning</Text>
            <Text style={styles.subtitle}>Centralisez vos sessions et demandes</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          <View style={styles.statCard}>
            <Ionicons name="today-outline" size={18} color={palette.primary} />
            <Text style={styles.statValue}>{counts.today}</Text>
            <Text style={styles.statLabel}>Aujourd'hui</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="calendar-week-outline" size={18} color="#16A34A" />
            <Text style={styles.statValue}>{counts.week}</Text>
            <Text style={styles.statLabel}>Semaine</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="email-alert-outline" size={18} color="#DC2626" />
            <Text style={styles.statValue}>{counts.requests}</Text>
            <Text style={styles.statLabel}>Demandes</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {activeTab !== 'requests' &&
            planning[activeTab].map((slot: any) => {
              const badge = statusBadge(slot.status);
              return (
                <View key={slot.id} style={styles.card}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>
                      {slot.day ? `${slot.day} ${slot.time}` : slot.time}
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.cardTitle}>{slot.type}</Text>
                      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardMeta}>
                      {slot.client} - {slot.dog}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="location-outline" size={14} color={palette.gray} />
                      <Text style={styles.cardMeta}>{slot.place}</Text>
                    </View>
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => navigation.navigate('teacher-community')}
                      >
                        <Text style={styles.secondaryText}>Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => goToAppointmentDetail(String(slot.id))}
                      >
                        <Text style={styles.primaryBtnText}>Valider</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>

        {activeTab === 'requests' &&
          planning.requests.map((req) => (
            <View key={req.id} style={styles.requestCard}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.cardTitle}>{req.client}</Text>
                <Text style={styles.cardMeta}>{req.detail}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="location-outline" size={14} color={palette.gray} />
                  <Text style={styles.cardMeta}>{req.location}</Text>
                </View>
                <Text style={[styles.cardMeta, { fontWeight: '700', color: palette.text }]}>
                  {req.budget}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.primaryBtn, { paddingHorizontal: 14, paddingVertical: 10 }]}
                onPress={() => navigation.navigate('teacher-home')}
              >
                <Text style={styles.primaryBtnText}>Proposer</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
          <TeacherBottomNav current="teacher-appointments" />
          </SafeAreaView>
          </>
        );
    }
