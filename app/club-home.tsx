import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';

import ClubBottomNav from '@/components/ClubBottomNav';
import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
    accent: '#E9B782',
    error: '#DC2626',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubHome'>;

export default function ClubHomeScreen({ navigation }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const clubProfile = (profile as any)?.profile || {};
  const clubName = clubProfile?.clubName || 'Mon Club';
  const logoUrl = clubProfile?.logoUrl || null;
  
  const [stats, setStats] = useState({ members: 0, today: 0, week: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React. useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        if (user?.uid) {
            await refreshProfile?.();
            // await loadStats(); -> Implement this function if needed
        }
        setLoading(false);
      };
      loadData();
    }, [user?.uid])
  );

  const initials = useMemo(() => clubName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2), [clubName]);

  const goTo = <T extends keyof ClubStackParamList>(screen: T, params?: ClubStackParamList[T]) => {
    navigation.navigate(screen as any, params);
  };

  if (loading) {
      return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View style={styles.avatar}>
                    {logoUrl ? <Image source={{ uri: logoUrl }} style={styles.logoImage} /> : <Text style={styles.avatarText}>{initials}</Text>}
                </View>
                <View>
                    <Text style={styles.headerTitle}>{clubName}</Text>
                    <Text style={styles.headerSub}>Tableau de bord</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.notifButton} onPress={() => goTo('notifications', { previousTarget: 'clubHome' })}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            <View style={styles.statsGrid}>
                <StatBox icon="people-outline" value={stats.members} label="Membres" />
                <StatBox icon="calendar-outline" value={stats.today} label="RDV Auj." />
                <StatBox icon="time-outline" value={stats.week} label="RDV Semaine" />
                <StatBox icon="alert-circle-outline" value={stats.pending} label="En attente" />
            </View>

            <Section title="Actions Rapides">
                <View style={styles.actionsGrid}>
                    <ActionButton icon="add-circle-outline" label="Nouveau RDV" onPress={() => goTo('clubAppointments')} />
                    <ActionButton icon="chatbubbles-outline" label="Messages" onPress={() => goTo('clubCommunity')} />
                    <ActionButton icon="business-outline" label="Mon Club" onPress={() => goTo('clubProfile')} />
                    <ActionButton icon="card-outline" label="Paiements" onPress={() => goTo('clubPayments')} />
                </View>
            </Section>

            <Section title="Aperçu des revenus">
                <View style={[styles.card, {backgroundColor: colors.primary}]}>
                    <Text style={[styles.cardSubtitle, {color: 'rgba(255,255,255,0.8)'}]}>Revenus ce mois-ci</Text>
                    <Text style={[styles.cardTitle, {color: '#fff', fontSize: 28}]}>2,850€</Text>
                    <View style={styles.progressBadge}>
                        <Ionicons name="trending-up" size={14} color={colors.primary} />
                        <Text style={styles.progressText}>+12% vs. mois dernier</Text>
                    </View>
                </View>
            </Section>

            <View style={[styles.card, {backgroundColor: colors.accent}]}>
                <View style={styles.djanaiCardContent}>
                    <MaterialCommunityIcons name="rocket-launch-outline" size={28} color="#fff" />
                    <View style={{flex: 1}}>
                        <Text style={[styles.cardTitle, {color: '#fff'}]}>Booster votre visibilité</Text>
                        <Text style={[styles.cardSubtitle, {color: 'rgba(255,255,255,0.8)'}]}>Mettez en avant votre club pour attirer plus de membres.</Text>
                    </View>
                    <TouchableOpacity style={styles.djanaiButton}>
                        <Text style={styles.djanaiButtonText}>Découvrir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </ScrollView>
      <ClubBottomNav current="clubHome" />
    </SafeAreaView>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
);

const StatBox = ({ icon, value, label }: { icon: any, value: number, label: string }) => (
    <View style={styles.statBox}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const ActionButton = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
        <Ionicons name={icon} size={28} color={colors.primary} />
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: { width: '100%', height: '100%', borderRadius: 28 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  notifButton: { padding: 8 },
  content: { padding: 16, gap: 24 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: colors.shadow,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  actionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: colors.shadow,
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    elevation: 3,
    shadowColor: colors.shadow,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  progressText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
  djanaiCardContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  djanaiButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  djanaiButtonText: { color: colors.accent, fontWeight: 'bold', fontSize: 14 },
});