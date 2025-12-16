import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getDoc, doc } from 'firebase/firestore';

import ClubBottomNav from '@/components/ClubBottomNav';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { resetToHome } from '@/navigation/navigationRef';
import { ClubStackParamList } from '@/navigation/types';
import { useClubData } from '@/hooks/useClubData';
import { db } from '@/firebaseConfig';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  orange: '#F59E0B',
  orangeLight: '#FEF3C7',
  red: '#DC2626',
  redLight: '#FEE2E2',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  green: '#16A34A',
  greenLight: '#DCFCE7',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubProfile'>;

interface Stats {
  activeMembers: number;
  completedSessions: number;
  averageRating: number;
  satisfactionRate: number;
}

interface BankInfo {
  connected: boolean;
  bankName?: string;
  maskedIban?: string;
}

export default function ClubProfileScreen({ navigation }: Props) {
  const { logout, deleteAccount, actionLoading, profile, refreshProfile, user } = useAuth();
  const [settings, setSettings] = useState({
    acceptNewMembers: true,
    showPhonePublic: true,
    autoConfirmBookings: false,
    emailNotifications: true,
    homeTrainingEnabled: true,
    requireDeposit: true,
    maxGroupSize: '10',
    cancellationPolicy: '24h avant - Remboursement total',
  });
  const [bankInfo, setBankInfo] = useState<BankInfo>({ connected: false });
  const [stats, setStats] = useState<Stats>({
    activeMembers: 127,
    completedSessions: 456,
    averageRating: 4.8,
    satisfactionRate: 98,
  });
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Récupère les données du club depuis le profile (Firebase)
  const clubProfile = (profile as any)?.profile || {};
  const clubName = clubProfile?.clubName || 'Mon Club';
  const legalName = clubProfile?.legalName || '';
  const siret = clubProfile?.siret || '';
  const description = clubProfile?.description || '';
  const email = clubProfile?.email || clubProfile?.email || profile?.email || '';
  const phone = clubProfile?.phone || '';
  const address = clubProfile?.address || '';
  const website = clubProfile?.website || '';
  const logoUrl = clubProfile?.logoUrl || null;
  const services = (clubProfile?.services as string[]) || [];

  // Recharger les données du club quand on revient sur cette page
  useFocusEffect(
    React.useCallback(() => {
      const loadFreshData = async () => {
        try {
          if (refreshProfile) {
            await refreshProfile();
          }
          setForceRefresh(prev => prev + 1);
        } catch (err) {
          console.error('Erreur lors du rafraîchissement:', err);
        }
      };
      loadFreshData();
    }, [refreshProfile, user?.uid])
  );

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroHeader}>
          <View style={styles.heroBackground} />
          <View style={styles.heroContent}>
            <View style={styles.heroLogoContainer}>
              <View style={styles.heroLogo}>
                {logoUrl ? (
                  <Image source={{ uri: logoUrl }} style={styles.heroLogoImage} />
                ) : (
                  <MaterialCommunityIcons name="office-building" size={48} color={palette.primary} />
                )}
              </View>
              <TouchableOpacity
                style={styles.heroEditButton}
                onPress={() => navigation.navigate('editClubProfile')}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroTitle}>{clubName}</Text>
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#fff" />
                <Text style={styles.heroBadgeText}>Verifié</Text>
              </View>
            </View>
            <Text style={styles.heroRating}>
              <Ionicons name="star" size={14} color="#FBBF24" /> 4.8 (156 avis)
            </Text>
            <Text style={styles.heroMember}>Membre depuis Janvier 2020</Text>
          </View>
        </View>

        {/* Classement Inter-Clubs */}
        <TouchableOpacity 
          style={styles.leaderboardCard}
          onPress={() => navigation.navigate('clubLeaderboard')}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialCommunityIcons name="trophy" size={24} color="#fff" />
              <View>
                <Text style={styles.leaderboardTitle}>Classement Inter-Clubs</Text>
                <Text style={styles.leaderboardSubtitle}>Voir votre position ce mois-ci</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Informations générales */}
          <View>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Nom du club</Text>
              <Text style={styles.infoValue}>{clubName}</Text>
              
              {legalName && (
                <>
                  <Text style={styles.infoLabel}>Raison sociale</Text>
                  <Text style={styles.infoValue}>{legalName}</Text>
                </>
              )}
              
              {siret && (
                <>
                  <Text style={styles.infoLabel}>SIRET</Text>
                  <Text style={styles.infoValue}>{siret}</Text>
                </>
              )}
              
              {description && (
                <>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{description}</Text>
                </>
              )}
            </View>
          </View>

          {/* Coordonnées */}
          <View>
            <Text style={styles.sectionTitle}>Coordonnées</Text>
            <View style={styles.infoCard}>
              {email && (
                <View style={styles.infLine}>
                  <MaterialCommunityIcons name="email-outline" size={20} color={palette.primary} />
                  <Text style={styles.infoValue}>{email}</Text>
                </View>
              )}
              {phone && (
                <View style={styles.infLine}>
                  <Ionicons name="call-outline" size={20} color={palette.primary} />
                  <Text style={styles.infoValue}>{phone}</Text>
                </View>
              )}
              {address && (
                <View style={styles.infLine}>
                  <Ionicons name="location-outline" size={20} color={palette.primary} />
                  <Text style={styles.infoValue}>{address}</Text>
                </View>
              )}
              {website && (
                <View style={styles.infLine}>
                  <Ionicons name="globe-outline" size={20} color={palette.primary} />
                  <Text style={[styles.infoValue, { color: '#2563EB' }]}>{website}</Text>
                </View>
              )}
              <View style={styles.infLine}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={palette.primary} />
                <Text style={styles.infoValue}>Lun-Sam: 9h-19h, Dim: 9h-13h</Text>
              </View>
            </View>
          </View>

          {/* Services proposés */}
          {services.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Services proposés</Text>
              <View style={styles.infoCard}>
                <View style={styles.servicesContainer}>
                  {services.map((service, idx) => (
                    <View key={`${service}-${idx}`} style={styles.serviceBadge}>
                      <Text style={styles.serviceBadgeText}>{service}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Statistiques */}
          <View>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.activeMembers}</Text>
                <Text style={styles.statLabel}>Membres actifs</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.completedSessions}</Text>
                <Text style={styles.statLabel}>Séances réalisées</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Note moyenne</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.satisfactionRate}%</Text>
                <Text style={styles.statLabel}>Satisfaction</Text>
              </View>
            </View>
          </View>

          {/* Promotions */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Promotions</Text>
              <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Créer</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View style={styles.promotionCard}>
                <View style={styles.promotionHeader}>
                  <Text style={styles.promotionTitle}>-20% sur les forfaits mensuels</Text>
                  <View style={styles.promotionBadge}>
                    <Text style={styles.promotionBadgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.promotionCode}>OCT2025 -20%</Text>
                <Text style={styles.promotionDate}>Valide jusqu'au 31 Oct 2025</Text>
              </View>
              <View style={styles.promotionCard}>
                <View style={styles.promotionHeader}>
                  <Text style={styles.promotionTitle}>Première séance gratuite</Text>
                  <View style={styles.promotionBadge}>
                    <Text style={styles.promotionBadgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.promotionCode}>FIRST -100%</Text>
                <Text style={styles.promotionDate}>Valide jusqu'au 31 Déc 2025</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={16} color="#6366F1" />
              <Text style={styles.infoBoxText}>
                Conseils: avec promotions actives reçoivent 60% de réservations en plus !
              </Text>
            </View>
          </View>

          {/* Compte bancaire */}
          <View>
            <Text style={styles.sectionTitle}>Compte bancaire</Text>
            <View style={[styles.infoCard, styles.bankCardStyle]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={styles.bankIconContainer}>
                  <Ionicons name="checkmark-circle" size={20} color={palette.green} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Connectez votre compte bancaire</Text>
                  <Text style={styles.infoValue}>
                    Les paiements seront versés directement sur votre compte sous 2-3 jours ouvrés.
                  </Text>
                </View>
              </View>

              <View style={{ gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.border }}>
                <View>
                  <Text style={styles.infoLabel}>Titulaire du compte</Text>
                  <Text style={styles.infoValue}>Nom du titulaire</Text>
                </View>
                <View>
                  <Text style={styles.infoLabel}>IBAN</Text>
                  <Text style={styles.infoValue}>FR78 XXXX XXXX XXXX XXXX XXXX XX</Text>
                </View>
                <View>
                  <Text style={styles.infoLabel}>BIC/SWIFT</Text>
                  <Text style={styles.infoValue}>XXXXXXXX</Text>
                </View>
                <View>
                  <Text style={styles.infoLabel}>Nom de la banque</Text>
                  <Text style={styles.infoValue}>Ex: Crédit Agricole</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.bankButton}>
                <MaterialCommunityIcons name="credit-card-check" size={18} color="#fff" />
                <Text style={styles.bankButtonText}>Connecter mon compte bancaire</Text>
              </TouchableOpacity>

              <Text style={styles.securityNote}>
                Les informations bancaires sont cryptées et sécurisées. Nous ne stockons jamais vos données bancaires complètes.
              </Text>
              <Text style={styles.friendNote}>
                🎁 Breviot: Dogs prélève 5% de commission sur chaque transaction.
              </Text>
            </View>
          </View>

          {/* Booster mon club */}
          <View style={[styles.infoCard, styles.boosterCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color={palette.orange} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sectionTitle}>Booster mon club</Text>
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumBadgeText}>Premium</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.infoValue}>
              Augmentez votre visibilité et attirez plus de clients en mettant votre annonce en avant !
            </Text>

            <View style={{ gap: 10, marginTop: 12, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialCommunityIcons name="trending-up" size={18} color={palette.orange} />
                <Text style={styles.infoValue}>Appraissez en tête des résultats</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="star" size={18} color={palette.orange} />
                <Text style={styles.infoValue}>Badge 'Club mis en avant'</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="people" size={18} color={palette.orange} />
                <Text style={styles.infoValue}>+300% de visibilité en moyenne</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.boosterButton}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
              <Text style={styles.boosterButtonText}>Booster mon annonce</Text>
            </TouchableOpacity>
          </View>

          {/* Galerie photos */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Galerie photos</Text>
              <TouchableOpacity style={styles.addPhotoButton}>
                <MaterialCommunityIcons name="plus" size={20} color={palette.primary} />
                <Text style={styles.addPhotoText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View style={styles.photosPreview}>
                <View style={styles.photoThumbnail}>
                  <Text style={styles.photoPlaceholder}>📷</Text>
                  <Text style={styles.photoLabel}>Terrain d'agility</Text>
                </View>
                <View style={styles.photoThumbnail}>
                  <Text style={styles.photoPlaceholder}>🐕</Text>
                  <Text style={styles.photoLabel}>Séance de grou</Text>
                </View>
                <View style={styles.photoThumbnail}>
                  <Text style={styles.photoPlaceholder}>🏠</Text>
                  <Text style={styles.photoLabel}>Nos installations</Text>
                </View>
              </View>
              <Text style={styles.photoInfo}>3/10 photos - Les photos de qualité augmentent vos réservations de 40%</Text>
            </View>
          </View>

          {/* Terrains */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Terrains</Text>
              <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View style={styles.terrainItem}>
                <View style={styles.terrainIcon}>
                  <Ionicons name="location" size={24} color={palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.terrainName}>Terrain principal</Text>
                  <Text style={styles.terrainAddress}>123 Rue de la République, 75015 Paris</Text>
                  <View style={styles.terrainBadge}>
                    <Text style={styles.terrainBadgeText}>Agility</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color={palette.red} />
                </TouchableOpacity>
              </View>

              <View style={styles.terrainItem}>
                <View style={styles.terrainIcon}>
                  <Ionicons name="location" size={24} color={palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.terrainName}>Terrain de dressage</Text>
                  <Text style={styles.terrainAddress}>45 Avenue du Parc, 75015 Paris</Text>
                  <View style={styles.terrainBadge}>
                    <Text style={styles.terrainBadgeText}>Education</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons name="trash-outline" size={20} color={palette.red} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Gestion des professeurs */}
          <View style={[styles.infoCard, styles.managerCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <MaterialCommunityIcons name="school" size={24} color={palette.primary} />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.sectionTitle}>Gestion des professeurs</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3 gratuits</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.infoValue}>
              Ajoutez et gérez les professeurs de votre club. Chaque professeur reçoit ses propres identifiants de connexion.
            </Text>

            <TouchableOpacity style={styles.managerButton}>
              <MaterialCommunityIcons name="school-outline" size={18} color={palette.primary} />
              <Text style={styles.managerButtonText}>Gérer mes professeurs</Text>
            </TouchableOpacity>
          </View>

          {/* Paramètres généraux */}
          <View>
            <Text style={styles.sectionTitle}>Paramètres généraux</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Accepter nouveaux membres</Text>
                  <Text style={styles.settingDescription}>Autoriser les inscriptions</Text>
                </View>
                <Switch
                  value={settings.acceptNewMembers}
                  onValueChange={(value) => setSettings({ ...settings, acceptNewMembers: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.acceptNewMembers ? palette.accent : palette.gray}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Téléphone public</Text>
                  <Text style={styles.settingDescription}>Visible sur le profil</Text>
                </View>
                <Switch
                  value={settings.showPhonePublic}
                  onValueChange={(value) => setSettings({ ...settings, showPhonePublic: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.showPhonePublic ? palette.accent : palette.gray}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Confirmation auto RDV</Text>
                  <Text style={styles.settingDescription}>Valider automatiquement</Text>
                </View>
                <Switch
                  value={settings.autoConfirmBookings}
                  onValueChange={(value) => setSettings({ ...settings, autoConfirmBookings: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.autoConfirmBookings ? palette.accent : palette.gray}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Notifications email</Text>
                  <Text style={styles.settingDescription}>Recevoir les alertes</Text>
                </View>
                <Switch
                  value={settings.emailNotifications}
                  onValueChange={(value) => setSettings({ ...settings, emailNotifications: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.emailNotifications ? palette.accent : palette.gray}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Cours à domicile</Text>
                  <Text style={styles.settingDescription}>Autoriser les demandes de cours à domicile</Text>
                </View>
                <Switch
                  value={settings.homeTrainingEnabled}
                  onValueChange={(value) => setSettings({ ...settings, homeTrainingEnabled: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.homeTrainingEnabled ? palette.accent : palette.gray}
                />
              </View>

              <View style={[styles.settingRow, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: palette.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Taille max des groupes</Text>
                </View>
                <Text style={styles.settingValue}>10 participants</Text>
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Politique d'annulation</Text>
                </View>
                <Text style={styles.settingValue}>24h avant - Remboursement total</Text>
              </View>
            </View>
          </View>

          {/* Paramètres de paiement */}
          <View>
            <Text style={styles.sectionTitle}>Paramètres de paiement</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>Acompte requis</Text>
                  <Text style={styles.settingDescription}>Demander un acompte à la réservation</Text>
                </View>
                <Switch
                  value={settings.requireDeposit}
                  onValueChange={(value) => setSettings({ ...settings, requireDeposit: value })}
                  trackColor={{ false: '#CFFAFE', true: '#86EFAC' }}
                  thumbColor={settings.requireDeposit ? palette.accent : palette.gray}
                />
              </View>
              {settings.requireDeposit && (
                <View style={styles.depositInfo}>
                  <MaterialCommunityIcons name="information-circle" size={16} color={palette.orange} />
                  <Text style={styles.depositText}>Montant de l'acompte</Text>
                  <Text style={styles.depositValue}>20 %</Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions de compte */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={18} color={palette.red} />
              <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.deleteButton, actionLoading && { opacity: 0.6 }]}
              onPress={() => setDeleteModalVisible(true)}
              disabled={actionLoading}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={18} color="#fff" />
              <Text style={styles.deleteText}>{actionLoading ? 'Suppression...' : 'Supprimer mon club'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ClubBottomNav current="clubProfile" />

      {/* Delete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer votre compte de club ? Cette action est irréversible.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnDelete]}
                onPress={handleDeleteClub}
              >
                <Text style={styles.modalBtnDeleteText}>Supprimer</Text>
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
    backgroundColor: palette.lightGray,
  },
  heroHeader: {
    backgroundColor: palette.primary,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    gap: 12,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: palette.primary,
  },
  heroContent: {
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
  },
  heroLogoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  heroLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroLogoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  heroEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: palette.primary,
    borderRadius: 12,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  heroBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  heroRating: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroMember: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  leaderboardCard: {
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    backgroundColor: palette.purple,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  leaderboardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  leaderboardSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  infoCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '600',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 20,
  },
  infLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: palette.orangeLight,
  },
  serviceBadgeText: {
    color: palette.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
  },
  statLabel: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.purple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promotionCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
  },
  promotionBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promotionBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  promotionCode: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 4,
  },
  promotionDate: {
    fontSize: 11,
    color: palette.gray,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: palette.purpleLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: '#4F46E5',
    lineHeight: 18,
  },
  bankCardStyle: {
    backgroundColor: palette.greenLight,
    borderColor: '#6EE7B7',
  },
  bankIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(22,163,74,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.green,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  bankButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  securityNote: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 8,
    lineHeight: 16,
  },
  friendNote: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 8,
    lineHeight: 16,
  },
  boosterCard: {
    backgroundColor: palette.orangeLight,
    borderColor: '#FDBA74',
  },
  premiumBadge: {
    backgroundColor: palette.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  boosterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.orange,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  boosterButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: palette.orangeLight,
  },
  addPhotoText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  photosPreview: {
    flexDirection: 'row',
    gap: 10,
  },
  photoThumbnail: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: palette.surface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  photoPlaceholder: {
    fontSize: 28,
  },
  photoLabel: {
    fontSize: 10,
    color: palette.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  photoInfo: {
    fontSize: 11,
    color: palette.gray,
    fontStyle: 'italic',
  },
  terrainItem: {
    backgroundColor: palette.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  terrainIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: palette.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terrainName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  terrainAddress: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  terrainBadge: {
    backgroundColor: '#E6E6FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  terrainBadgeText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  managerCard: {
    backgroundColor: palette.orangeLight,
    borderColor: '#FDBA74',
  },
  managerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  managerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: palette.orangeLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: palette.orange,
    fontSize: 11,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  settingDescription: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 4,
  },
  settingValue: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '500',
  },
  depositInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.orangeLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  depositText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.text,
    flex: 1,
  },
  depositValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.orange,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.surface,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: palette.red,
  },
  logoutText: {
    color: palette.red,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.red,
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  modalText: {
    fontSize: 16,
    color: palette.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
  },
  modalBtnCancelText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnDelete: {
    backgroundColor: palette.red,
  },
  modalBtnDeleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

