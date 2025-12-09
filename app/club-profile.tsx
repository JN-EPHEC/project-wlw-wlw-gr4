import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ClubBottomNav from '@/components/ClubBottomNav';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { resetToHome } from '@/navigation/navigationRef';
import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const clubData = {
  name: 'Club Canin Paris 15',
  legalName: 'Association Club Canin Paris 15',
  siret: '123 456 789 00010',
  description:
    "Club canin professionnel spécialisé dans l'éducation canine, l'agility et l'obéissance depuis plus de 15 ans.",
  email: 'contact@clubcaninparis15.fr',
  phone: '01 23 45 67 89',
  address: '123 Rue de la République, 75015 Paris',
  website: 'www.clubcaninparis15.fr',
  openingHours: 'Lun-Sam: 9h-19h · Dim: 9h-13h',
  rating: 4.8,
  totalReviews: 156,
  memberSince: 'Janvier 2020',
};

const services = ['Éducation canine', 'Agility', 'Obéissance', 'Comportementalisme'];

const initialTerrains = [
  { id: 1, name: 'Terrain principal', address: '123 Rue de la République, 75015 Paris', type: 'Agility', isDefault: true },
  { id: 2, name: 'Terrain de dressage', address: '45 Avenue du Parc, 75015 Paris', type: 'Éducation', isDefault: false },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubProfile'>;

export default function ClubProfileScreen({ navigation }: Props) {
  const { logout, deleteAccount, actionLoading } = useAuth();
  const [settings, setSettings] = useState({
    acceptNewMembers: true,
    showPhonePublic: true,
    autoConfirmBookings: false,
    emailNotifications: true,
    homeTrainingEnabled: true,
    requireDeposit: true,
  });
  const [bankConnected, setBankConnected] = useState(false);
  const [terrains] = useState(initialTerrains);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteClub = async () => {
    setError(null);
    try {
      await deleteAccount();
      resetToHome();
      setDeleteModalVisible(false);
    } catch (err) {
      setError(formatFirebaseAuthError(err));
      setDeleteModalVisible(false);
    }
  };

  const handleGoToLeaderboard = () => {
    navigation.navigate('clubLeaderboard');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="office-building" size={28} color={palette.primary} />
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera-outline" size={14} color={palette.primary} />
            </View>
          </View>
          <Text style={styles.headerTitle}>{clubData.name}</Text>
          <View style={styles.headerBadges}>
            <View style={styles.verified}>
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FACC15" />
              <Text style={styles.ratingText}>{clubData.rating} ({clubData.totalReviews})</Text>
            </View>
          </View>
          <Text style={styles.headerSub}>Membre depuis {clubData.memberSince}</Text>
        </View>

        <View style={{ padding: 16, gap: 16 }}>
          <TouchableOpacity style={[styles.card, styles.leaderboard]} onPress={handleGoToLeaderboard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={styles.leaderboardIcon}>
                <MaterialCommunityIcons name="trophy-outline" size={22} color="#fff" />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: '#fff' }]}>Classement Inter-Clubs</Text>
                <Text style={[styles.cardMeta, { color: '#E0E7FF' }]}>Voir votre position ce mois-ci</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            <View style={{ gap: 10, marginTop: 10 }}>
              <Text style={styles.infoText}>{clubData.legalName}</Text>
              <Text style={styles.infoText}>SIRET : {clubData.siret}</Text>
              <Text style={styles.infoText}>{clubData.description}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Coordonnées</Text>
            <View style={styles.lineItem}>
              <Ionicons name="mail-outline" size={18} color={palette.primary} />
              <Text style={styles.infoText}>{clubData.email}</Text>
            </View>
            <View style={styles.lineItem}>
              <Ionicons name="call-outline" size={18} color={palette.primary} />
              <Text style={styles.infoText}>{clubData.phone}</Text>
            </View>
            <View style={styles.lineItem}>
              <Ionicons name="location-outline" size={18} color={palette.primary} />
              <Text style={styles.infoText}>{clubData.address}</Text>
            </View>
            <View style={styles.lineItem}>
              <Ionicons name="globe-outline" size={18} color={palette.primary} />
              <Text style={[styles.infoText, { color: '#2563EB' }]}>{clubData.website}</Text>
            </View>
            <View style={styles.lineItem}>
              <Ionicons name="time-outline" size={18} color={palette.primary} />
              <Text style={styles.infoText}>{clubData.openingHours}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Services proposés</Text>
            <View style={styles.chips}>
              {services.map((service) => (
                <View key={service} style={styles.chip}>
                  <Text style={styles.chipText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Terrains</Text>
              <View style={styles.addBtn}>
                <Ionicons name="add" size={16} color={palette.primary} />
                <Text style={styles.addText}>Ajouter</Text>
              </View>
            </View>
            <View style={{ gap: 12 }}>
              {terrains.map((terrain) => (
                <View key={terrain.id} style={styles.terrainCard}>
                  <View style={styles.terrainIcon}>
                    <Ionicons name="map-outline" size={18} color={palette.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={styles.cardTitle}>{terrain.name}</Text>
                      {terrain.isDefault ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>Par défaut</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.cardMeta}>{terrain.address}</Text>
                    <Text style={styles.cardMeta}>{terrain.type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Paramètres généraux</Text>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Accepter nouveaux membres</Text>
                <Text style={styles.cardMeta}>Autoriser les inscriptions</Text>
              </View>
              <Switch
                value={settings.acceptNewMembers}
                onValueChange={(value) => setSettings({ ...settings, acceptNewMembers: value })}
              />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Téléphone public</Text>
                <Text style={styles.cardMeta}>Visible sur le profil</Text>
              </View>
              <Switch
                value={settings.showPhonePublic}
                onValueChange={(value) => setSettings({ ...settings, showPhonePublic: value })}
              />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Confirmation auto RDV</Text>
                <Text style={styles.cardMeta}>Valider automatiquement</Text>
              </View>
              <Switch
                value={settings.autoConfirmBookings}
                onValueChange={(value) => setSettings({ ...settings, autoConfirmBookings: value })}
              />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Notifications email</Text>
                <Text style={styles.cardMeta}>Recevoir les alertes</Text>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => setSettings({ ...settings, emailNotifications: value })}
              />
            </View>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Cours à domicile</Text>
                <Text style={styles.cardMeta}>Autoriser les demandes</Text>
              </View>
              <Switch
                value={settings.homeTrainingEnabled}
                onValueChange={(value) => setSettings({ ...settings, homeTrainingEnabled: value })}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Paramètres de paiement</Text>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.cardTitle}>Acompte requis</Text>
                <Text style={styles.cardMeta}>Demander un acompte</Text>
              </View>
              <Switch
                value={settings.requireDeposit}
                onValueChange={(value) => setSettings({ ...settings, requireDeposit: value })}
              />
            </View>
            {settings.requireDeposit ? (
              <View style={styles.depositRow}>
                <MaterialCommunityIcons name="percent" size={18} color={palette.primary} />
                <Text style={styles.cardMeta}>Montant conseillé : 20%</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.card, styles.bankCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="#16A34A" />
              <Text style={styles.sectionTitle}>Compte bancaire</Text>
            </View>
            {bankConnected ? (
              <View style={{ gap: 6, marginTop: 10 }}>
                <Text style={styles.cardTitle}>Crédit Agricole</Text>
                <Text style={styles.cardMeta}>FR76 •••• •••• •••• 0123</Text>
                <Text style={[styles.cardMeta, { color: '#166534' }]}>Compte connecté</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost]}>
                    <Text style={[styles.smallBtnText, { color: palette.text }]}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, styles.smallBtnGhost]}>
                    <Text style={[styles.smallBtnText, { color: '#B91C1C' }]}>Déconnecter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ gap: 10, marginTop: 10 }}>
                <Text style={styles.cardMeta}>
                  Connectez votre compte bancaire pour recevoir vos paiements sous 2-3 jours ouvrés.
                </Text>
                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: '#16A34A', alignSelf: 'flex-start' }]}
                  onPress={() => setBankConnected(true)}
                >
                  <MaterialCommunityIcons name="credit-card-check-outline" size={16} color="#fff" />
                  <Text style={styles.smallBtnText}>Connecter mon compte</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.card, styles.boostCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#C2410C" />
              <Text style={styles.sectionTitle}>Booster mon club</Text>
              <View style={[styles.badge, { backgroundColor: '#F97316' }]}>
                <Text style={[styles.badgeText, { color: '#fff' }]}>Premium</Text>
              </View>
            </View>
            <Text style={[styles.cardMeta, { marginTop: 8 }]}>
              Augmentez votre visibilité et attirez plus de clients avec un badge mis en avant.
            </Text>
            <View style={{ gap: 6, marginTop: 6 }}>
              <View style={styles.bullet}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#C2410C" />
                <Text style={styles.cardMeta}>Position en tête des résultats</Text>
              </View>
              <View style={styles.bullet}>
                <Ionicons name="star" size={16} color="#C2410C" />
                <Text style={styles.cardMeta}>Badge "Club mis en avant"</Text>
              </View>
              <View style={styles.bullet}>
                <Ionicons name="people-outline" size={16} color="#C2410C" />
                <Text style={styles.cardMeta}>+300% de visibilité en moyenne</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnText}>Choisir une offre</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, styles.dangerCard]}>
            <TouchableOpacity style={styles.lineItem} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={18} color="#B91C1C" />
              <Text style={[styles.cardTitle, { color: '#B91C1C' }]}>Deconnexion</Text>
            </TouchableOpacity>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.lineItem, styles.deleteButton, actionLoading && styles.disabled]}
              onPress={() => setDeleteModalVisible(true)}
              disabled={actionLoading}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#B91C1C" />
              <Text style={[styles.cardTitle, styles.deleteButtonText, { color: '#B91C1C' }]}>{actionLoading ? 'Suppression...' : 'Supprimer mon club'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ClubBottomNav current="clubProfile" />

      {/* Delete Account Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer votre compte de club ? Cette action est irréversible.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteClub}
              >
                <Text style={styles.deleteConfirmButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 22,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    color: '#F1F5F9',
    fontSize: 12,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  verifiedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  ratingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
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
  infoText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 18,
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FDF5E6',
  },
  chipText: {
    color: palette.primary,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FDF5E6',
  },
  addText: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  terrainCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  terrainIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: '#FDF5E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  depositRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#FDF5E6',
    borderRadius: 10,
  },
  bankCard: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF3',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boostCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  boostBtn: {
    marginTop: 10,
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  boostBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  leaderboard: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaderboardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerCard: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  error: { color: '#DC2626', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  deleteButton: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'transparent', // Make it transparent as lineItem already has border
    borderRadius: 16,
    paddingVertical: 0, // Adjust padding as lineItem already has it
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align to start since it's inside a lineItem
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  deleteButtonText: { color: '#B91C1C', fontWeight: '700' },
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
