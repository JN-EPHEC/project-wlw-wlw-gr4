import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { UserStackParamList } from '@/navigation/types';
import UserBottomNav from '@/components/UserBottomNav';
import { useUserUpcomingBookings } from '@/hooks/useUserUpcomingBookings';
import { useDogs } from '@/hooks/useDogs';
import { useFavorites } from '@/hooks/useFavorites';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  accent: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const sampleDogs = [
  {
    id: 'max',
    name: 'Max',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Border Collie',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=400&q=80',
  },
];

const sampleClubs = [
  { id: 'club-paris', name: 'Canin Club Paris', icon: '🏆' },
  { id: 'agility-pro', name: 'Agility Pro', icon: '🏃‍♂️' },
  { id: 'amis-chiens', name: 'Les Amis des Chiens', icon: '🦴' },
];
type AccountNavigationProp = NativeStackNavigationProp<UserStackParamList, 'account'>;


export default function AccountScreen() {
  const navigation = useNavigation<AccountNavigationProp>();
  const { user, profile, logout, deleteAccount, actionLoading } = useAuth();
  const { bookings } = useUserUpcomingBookings();
  const { dogs: dogsData } = useDogs();
  const { favorites } = useFavorites();
  const [error, setError] = useState<string | null>(null);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [followedClubsCount, setFollowedClubsCount] = useState(0);
  const [realClubs, setRealClubs] = useState<any[]>([]);

  useEffect(() => {
    // Compter les clubs favoris et charger les données
    const clubCount = Array.from(favorites.values()).filter(type => type === 'club').length;
    setFollowedClubsCount(clubCount);

    // Charger les clubs favoris réels
    const loadClubs = async () => {
      try {
        const clubIds = Array.from(favorites.entries())
          .filter(([, type]) => type === 'club')
          .map(([itemId]) => itemId);

        if (clubIds.length === 0) {
          setRealClubs([]);
          return;
        }

        const clubsData: any[] = [];
        for (const clubId of clubIds.slice(0, 3)) { // Limiter à 3 clubs pour la page compte
          const clubDoc = await getDoc(doc(db, 'club', clubId));
          if (clubDoc.exists()) {
            clubsData.push({
              id: clubDoc.id,
              name: clubDoc.data().name || 'Sans nom',
              icon: '🏆',
            });
          }
        }

        setRealClubs(clubsData);
      } catch (err) {
        console.error('Erreur lors du chargement des clubs:', err);
      }
    };

    loadClubs();
  }, [favorites]);

  const profileData = useMemo(() => ((profile as any)?.profile ?? {}) as Record<string, any>, [profile]);
  const displayName = useMemo(() => {
    const nameFromProfile = `${profileData.firstName ?? ''} ${profileData.lastName ?? ''}`.trim();
    return nameFromProfile || user?.displayName || user?.email || 'Utilisateur Smart Dogs';
  }, [profileData.firstName, profileData.lastName, user?.displayName, user?.email]);

  const initials = useMemo(
    () => displayName.split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
    [displayName],
  );

  const location = useMemo(
    () =>
      profileData.city ||
      profileData.location ||
      profileData.address ||
      "Braine-l'Alleud, Belgique",
    [profileData.city, profileData.location, profileData.address],
  );

  const dogs = useMemo(() => {
    const fromProfile = (profileData.dogs as any[]) ?? (profile as any)?.dogs;
    if (Array.isArray(fromProfile) && fromProfile.length > 0) return fromProfile;
    return sampleDogs;
  }, [profileData.dogs, profile]);

  const clubs = useMemo(() => {
    const fromProfile = (profileData.followedClubs as any[]) ?? (profile as any)?.followedClubs;
    if (Array.isArray(fromProfile) && fromProfile.length > 0) return fromProfile;
    return sampleClubs;
  }, [profileData.followedClubs, profile]);

  const bookingsCount =
    typeof profileData.bookingsCount === 'number'
      ? profileData.bookingsCount
      : (profile as any)?.bookingsCount;

  const stats = [
    { label: 'Réservations', value: bookings.length, icon: 'calendar-outline' as const },
    { label: 'Chiens', value: dogsData?.length ?? 0, icon: 'paw-outline' as const },
    { label: 'Clubs suivis', value: followedClubsCount, icon: 'heart-outline' as const },
  ];

  const menuItems = [
    { id: 'bookings', icon: 'calendar-outline' as const, label: 'Mes réservations', badge: bookings.length ? String(bookings.length) : null, onPress: () => navigation.navigate('bookings') },
    { id: 'dogs', icon: 'paw-outline' as const, label: 'Mes chiens', badge: null, onPress: () => navigation.navigate('dogs') },
    { id: 'clubs', icon: 'heart-outline' as const, label: 'Clubs suivis', badge: null, onPress: () => navigation.navigate('followedClubs') },
    { id: 'notifications', icon: 'notifications-outline' as const, label: 'Notifications', badge: null, onPress: () => navigation.navigate('notifications', { previousTarget: 'account' }) },
    { id: 'ratingInvitation', icon: 'star-outline' as const, label: 'Invitations avis', badge: null, onPress: () => navigation.navigate('ratingInvitation', { bookingId: 501, previousTarget: 'account' }) },
    { id: 'settings', icon: 'settings-outline' as const, label: 'Paramètres', badge: null, onPress: () => navigation.navigate('settings') },
  ];

  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    try {
      await deleteAccount();
      setDeleteModalVisible(false);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
      setDeleteModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Mon compte</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileWrapper}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{displayName}</Text>
                    <Ionicons name="checkmark-circle" size={18} color={palette.primary} />
                  </View>
                  <Text style={styles.meta}>{location}</Text>
                  <Text style={[styles.meta, { fontSize: 12 }]}>{user?.email}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                {stats.map((stat) => (
                  <View key={stat.label} style={styles.stat}>
                    <View style={styles.statIcon}>
                      <Ionicons name={stat.icon} size={18} color={palette.primary} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badgeCard}
        >
          <View style={styles.badgeIcon}>
            <Ionicons name="shield-checkmark-outline" size={24} color={palette.surface} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeTitle}>Propriétaire Actif</Text>
            <Text style={styles.badgeSubtitle}>Badge actif ✓</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={palette.surface} />
        </LinearGradient>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={18} color={palette.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes chiens</Text>
            <TouchableOpacity onPress={() => navigation.navigate('dogs')}>
              <Text style={styles.sectionLink}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardGrid}>
            {dogsData && dogsData.slice(0, 2).map((dog, idx) => (
              <View key={dog.id ?? idx} style={styles.dogCard}>
                <Image source={{ uri: dog.photoUrl || 'https://via.placeholder.com/120' }} style={styles.dogImage} />
                <View style={styles.dogBody}>
                  <Text style={styles.dogName}>{dog.name}</Text>
                  <Text style={styles.dogBreed}>{dog.breed}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Clubs suivis</Text>
            <TouchableOpacity onPress={() => navigation.navigate('followedClubs')}>
              <Text style={styles.sectionLink}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.clubsRow}>
            {realClubs && realClubs.length > 0 ? (
              realClubs.map((club, idx) => (
                <TouchableOpacity
                  key={club.id ?? idx}
                  style={styles.clubCard}
                  onPress={() => navigation.navigate('clubDetail', { clubId: club.id })}
                >
                  <Text style={styles.clubIcon}>{club.icon ?? '🏆'}</Text>
                  <Text style={styles.clubName}>{club.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyClubs}>Aucun club suivi</Text>
            )}
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.logoutButton, actionLoading && styles.disabled]}
          onPress={() => setLogoutModalVisible(true)}
          disabled={actionLoading}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutText}>{actionLoading ? 'Déconnexion...' : 'Se déconnecter'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <UserBottomNav current="account" />

      {/* Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Vous êtes sur le point de vous déconnecter</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Se déconnecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { padding: 16, paddingBottom: 140, gap: 16 },
  header: {
    gap: 12,
    backgroundColor: palette.primary,
    padding: 16,
    margin: -16,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heading: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileWrapper: { borderRadius: 22, padding: 1 },
  profileCard: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: '100%', height: '100%', borderRadius: 20 },
  avatarText: { color: palette.primary, fontWeight: '700', fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { color: palette.text, fontSize: 18, fontWeight: '700' },
  meta: { color: '#6B7280', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1, gap: 6 },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { color: palette.text, fontWeight: '700', fontSize: 16 },
  statLabel: { color: palette.gray, fontSize: 12 },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  badgeSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  menuSection: { gap: 10 },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { color: palette.text, fontSize: 15, fontWeight: '600' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: {
    backgroundColor: '#F28B6F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  menuBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  sectionLink: { color: palette.primary, fontWeight: '700', fontSize: 13 },
  cardGrid: { flexDirection: 'row', gap: 12 },
  dogCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  dogImage: { width: '100%', height: 120, backgroundColor: '#E5E7EB' },
  dogBody: { padding: 12, gap: 4 },
  dogName: { color: palette.text, fontSize: 15, fontWeight: '700' },
  dogBreed: { color: palette.gray, fontSize: 12 },
  clubsRow: { flexDirection: 'row', gap: 12 },
  clubCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  clubIcon: { fontSize: 20 },
  clubName: { color: palette.text, fontSize: 12, textAlign: 'center' },
  emptyClubs: { color: palette.gray, fontSize: 13, textAlign: 'center' },
  error: { color: '#DC2626', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  logoutButton: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  logoutText: { color: '#DC2626', fontWeight: '700' },
  deleteButton: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  deleteButtonText: { color: '#DC2626', fontWeight: '700' },
  disabled: { opacity: 0.6 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#DC2626',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  confirmButtonText: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  deleteCancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  deleteCancelButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: '#DC2626',
  },
  deleteConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
