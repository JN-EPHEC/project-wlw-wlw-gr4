import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Timestamp, doc, getDoc } from 'firebase/firestore';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useFetchClubAllBookings } from '@/hooks/useFetchClubAllBookings';
import { useUpdateBooking } from '@/hooks/useUpdateBooking';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useFetchClubEducatorsForForm } from '@/hooks/useFetchClubEducatorsForForm';
import { useFetchClubFieldsForForm } from '@/hooks/useFetchClubFieldsForForm';
import { useCreateRatingInvitation } from '@/hooks/useCreateReview';
import { useCreateNotification } from '@/hooks/useCreateNotification';
import { db } from '@/firebaseConfig';
import { BookingDisplay, BookingStatus } from '@/types/Booking';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    accent: '#E9B782',
    error: '#DC2626',
    success: '#10B981',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAppointments'>;

export default function ClubAppointmentsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const { profile } = useAuth();
  const clubId = (profile as any)?.profile?.clubId || (profile as any)?.clubId || '';
  
  const { bookings, loading, stats } = useFetchClubAllBookings(clubId);
  // ... other hooks

  const upcoming = useMemo(() => bookings.filter(b => ['available', 'pending', 'confirmed'].includes(b.status)), [bookings]);
  const past = useMemo(() => bookings.filter(b => b.status === 'completed'), [bookings]);
  const cancelled = useMemo(() => bookings.filter(b => ['cancelled', 'rejected'].includes(b.status)), [bookings]);

  if (loading) {
      return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Rendez-vous</Text>
                <Text style={styles.headerSub}>{bookings.length} au total</Text>
            </View>
        </View>

        <View style={styles.content}>
            <TouchableOpacity style={[styles.primaryButton, {marginBottom: 16}]} onPress={() => { /* Open create modal */ }}>
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.primaryButtonText}>Nouveau rendez-vous</Text>
            </TouchableOpacity>
            <View style={styles.tabs}>
                <TabButton label="À venir" count={upcoming.length} active={activeTab === 'upcoming'} onPress={() => setActiveTab('upcoming')} />
                <TabButton label="Passés" count={past.length} active={activeTab === 'past'} onPress={() => setActiveTab('past')} />
                <TabButton label="Annulés" count={cancelled.length} active={activeTab === 'cancelled'} onPress={() => setActiveTab('cancelled')} />
            </View>

            {activeTab === 'upcoming' && <BookingList bookings={upcoming} />}
            {activeTab === 'past' && <BookingList bookings={past} />}
            {activeTab === 'cancelled' && <BookingList bookings={cancelled} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const TabButton = ({ label, count, active, onPress }: any) => (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
        <Text style={[styles.tabCount, active && styles.tabCountActive]}>{count}</Text>
    </TouchableOpacity>
);

const BookingList = ({ bookings }: { bookings: BookingDisplay[] }) => {
    if (bookings.length === 0) {
        return <View style={styles.emptyState}><Text style={styles.emptyText}>Aucun rendez-vous dans cette catégorie.</Text></View>;
    }
    return <View style={{gap: 16}}>{bookings.map(b => <BookingCard key={b.id} booking={b} />)}</View>;
};

const BookingCard = ({ booking }: { booking: BookingDisplay }) => {
    const statusInfo = useMemo(() => {
        switch (booking.status) {
            case 'confirmed': return { label: 'Confirmé', color: colors.success };
            case 'pending': return { label: 'En attente', color: colors.accent };
            case 'completed': return { label: 'Terminé', color: colors.textMuted };
            case 'cancelled': case 'rejected': return { label: 'Annulé', color: colors.error };
            default: return { label: 'Disponible', color: colors.primary };
        }
    }, [booking.status]);

    const date = booking.sessionDate.toDate ? booking.sessionDate.toDate() : new Date();

    return (
        <View style={[styles.card, { borderLeftColor: statusInfo.color }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{booking.title}</Text>
                <Text style={[styles.statusBadge, {backgroundColor: statusInfo.color}]}>{statusInfo.label}</Text>
            </View>
            <Text style={styles.cardSubtitle}>{booking.description}</Text>
            <View style={styles.metaRow}>
                <MetaItem icon="calendar-outline" text={date.toLocaleDateString('fr-FR')} />
                <MetaItem icon="time-outline" text={date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})} />
                <MetaItem icon="person-outline" text={`${booking.currentParticipants}/${booking.maxParticipants}`} />
            </View>
            {/* Add action buttons here based on status */}
        </View>
    );
};

const MetaItem = ({ icon, text }: { icon: any, text: string }) => (
    <View style={styles.metaItem}>
        <Ionicons name={icon} size={14} color={colors.textMuted} />
        <Text style={styles.metaText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  content: { padding: 16 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 4, elevation: 2, shadowColor: colors.shadow, marginBottom: 16 },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 12, gap: 8 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  tabCount: { color: colors.textMuted, fontWeight: '600', backgroundColor: colors.background, paddingHorizontal: 6, borderRadius: 8, fontSize: 12 },
  tabCountActive: { color: colors.primary, backgroundColor: '#fff' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, elevation: 2, shadowColor: colors.shadow, borderLeftWidth: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.background, paddingTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, fontWeight: '500', color: colors.text },
  emptyState: { paddingVertical: 80, alignItems: 'center' },
  emptyText: { fontSize: 15, color: colors.textMuted },
});