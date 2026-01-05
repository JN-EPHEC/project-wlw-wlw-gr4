import React, { useState, useEffect, useMemo } from 'react';
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
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getDoc, doc, collection, query, where, getDocs, Timestamp, updateDoc } from 'firebase/firestore';

import ClubBottomNav from '@/components/ClubBottomNav';
import ClubBoostPlansModal from '@/components/ClubBoostPlansModal';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { resetToHome } from '@/navigation/navigationRef';
import { ClubStackParamList } from '@/navigation/types';
import { useClubData } from '@/hooks/useClubData';
import { useClubFields, Field } from '@/hooks/useClubFields';
import { useClubGallery } from '@/hooks/useClubGallery';
import { useClubActiveBoost } from '@/hooks/useClubActiveBoost';
import { db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

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
  reviewCount: number;
}

interface BankInfo {
  connected: boolean;
  bankName?: string;
  maskedIban?: string;
}

interface Promotion {
  id: string;
  clubId: string;
  title: string;
  code: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
  validFrom: Timestamp;
  validUntil: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
    activeMembers: 0,
    completedSessions: 0,
    averageRating: 0,
    satisfactionRate: 0,
    reviewCount: 0,
  });
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [isGroupSizeModalVisible, setGroupSizeModalVisible] = useState(false);
  const [isUpdatingGroupSize, setIsUpdatingGroupSize] = useState(false);
  const [selectedGroupSize, setSelectedGroupSize] = useState<string | null>(null);
  const [localMaxGroupSize, setLocalMaxGroupSize] = useState<string | null>(null);
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [photoDescription, setPhotoDescription] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [clubCreatedAt, setClubCreatedAt] = useState<Timestamp | null>(null);
  const [isBoostModalVisible, setBoostModalVisible] = useState(false);

  // Récupère les données du club depuis le profile (Firebase)
  const clubProfile = (profile as any)?.profile || {};
  const clubId = (profile as any)?.clubId || user?.uid;
  const { activeBoost, loading: boostLoading, formatDate, refetch: refetchBoost } = useClubActiveBoost(user?.uid);
  const { fields: clubFields } = useClubFields(clubId || null);
  const { images: galleryPhotos, loading: galleryLoading, addImage, updateImage, deleteImage, totalPhotos, canAddMorePhotos } = useClubGallery(clubId || null);
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
  const openingHours = (clubProfile?.openingHours as Array<{ day: string; open: string; close: string }>) || [];
  const maxGroupSize = clubProfile?.maxGroupSize || '10';

  // Formater la date de création du club
  const formatCreatedAtDate = (): string => {
    if (!clubCreatedAt) return '';

    let date: Date;
    if (clubCreatedAt instanceof Timestamp) {
      date = clubCreatedAt.toDate();
    } else {
      return '';
    }

    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
  };

  const createdAtDisplay = formatCreatedAtDate();

  // Recharger les données du club quand on revient sur cette page
  useFocusEffect(
    React.useCallback(() => {
      const loadFreshData = async () => {
        try {
          if (refreshProfile) {
            // Attendre un petit délai pour s'assurer que Firestore a mis à jour
            await new Promise(resolve => setTimeout(resolve, 300));
            await refreshProfile();
          }
        } catch (err) {
          console.error('Erreur lors du rafraîchissement:', err);
        }
      };
      loadFreshData();
      // Charger les promotions et les stats
      loadPromotions();
      loadStats();
      // Charger la taille max des groupes depuis Firestore
      loadMaxGroupSize();
    }, [user?.uid])
  );

  // Charger maxGroupSize depuis Firestore
  const loadMaxGroupSize = async () => {
    if (!clubId) return;

    try {
      const clubRef = doc(db, 'club', clubId);
      const clubDoc = await getDoc(clubRef);
      
      if (clubDoc.exists()) {
        const maxSize = clubDoc.data()?.maxGroupSize || '10';
        setLocalMaxGroupSize(maxSize);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de maxGroupSize:', err);
    }
  };

  // Synchroniser les terrains depuis le hook
  useEffect(() => {
    setFields(clubFields);
  }, [clubFields]);

  // Charger la date de création du club
  useEffect(() => {
    const loadClubCreationDate = async () => {
      if (!clubId) return;

      try {
        const clubRef = doc(db, 'club', clubId);
        const clubDoc = await getDoc(clubRef);
        
        if (clubDoc.exists()) {
          const createdAt = clubDoc.data()?.createdAt;
          if (createdAt) {
            setClubCreatedAt(createdAt);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la date de création du club:', err);
      }
    };

    loadClubCreationDate();
  }, [clubId]);
  const loadPromotions = async () => {
    try {
      setLoadingPromotions(true);
      const clubId = (profile as any)?.clubId || user?.uid;
      if (!clubId) {
        console.error('clubId non trouvé');
        setPromotions([]);
        return;
      }

      const q = query(
        collection(db, 'promotions'),
        where('clubId', '==', clubId)
      );
      const snapshot = await getDocs(q);
      const promotionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Promotion));
      
      // Trier par date de création (plus récentes en premier)
      promotionsData.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setPromotions(promotionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des promotions:', err);
      setPromotions([]);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const loadStats = async () => {
    try {
      const cId = clubId;
      if (!cId) {
        console.error('clubId non trouvé pour les stats');
        return;
      }

      // 1. Charger les stats depuis la collection 'club'
      const clubRef = doc(db, 'club', cId);
      const clubSnapshot = await getDoc(clubRef);
      
      let activeMembers = 0;
      let completedSessions = 0;
      let averageRating = 0;
      let satisfactionRate = 0;
      let reviewCount = 0;

      if (clubSnapshot.exists()) {
        const clubData = clubSnapshot.data();
        activeMembers = clubData?.stats?.totalMembers || 0;
        completedSessions = clubData?.stats?.totalBookings || 0;
      }

      // 2. Charger les reviews et calculer la moyenne et le taux de satisfaction
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('clubId', '==', cId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      reviewCount = reviewsSnapshot.size; // Nombre total d'avis
      
      if (reviewsSnapshot.size > 0) {
        const ratings = reviewsSnapshot.docs.map(doc => doc.data().rating);
        
        // Calculer la moyenne des ratings
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        
        // Calculer le pourcentage de satisfaction (ratings > 2.5)
        const satisfiedCount = ratings.filter(rating => rating > 2.5).length;
        satisfactionRate = (satisfiedCount / ratings.length) * 100;
      }

      setStats({
        activeMembers,
        completedSessions,
        averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
        satisfactionRate: Math.round(satisfactionRate),
        reviewCount,
      });
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
    }
  };

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

  const handleUpdateGroupSize = async (newSize: string) => {
    if (!clubId) {
      console.error('clubId is missing', { clubId, userId: user?.uid });
      setError('Erreur: ID du club manquant');
      return;
    }

    try {
      setIsUpdatingGroupSize(true);
      setSelectedGroupSize(newSize);

      const clubDocRef = doc(db, 'club', clubId);
      console.log('🔄 Updating club:', clubId, 'with maxGroupSize:', newSize);
      
      const updateResult = await updateDoc(clubDocRef, {
        maxGroupSize: newSize,
      });

      console.log('✅ Update to Firebase successful');
      
      // Mettre à jour l'état local IMMÉDIATEMENT pour l'UI
      setLocalMaxGroupSize(newSize);
      
      // Fermer le modal
      setGroupSizeModalVisible(false);
      setSelectedGroupSize(null);
      
      // Rafraîchir les données du profil depuis Firebase
      if (refreshProfile) {
        console.log('🔄 Refreshing profile...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await refreshProfile();
        console.log('✅ Profile refreshed');
      }
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour de la taille des groupes:', err);
      setError('Erreur lors de la mise à jour: ' + (err as any).message);
      setSelectedGroupSize(null);
    } finally {
      setIsUpdatingGroupSize(false);
    }
  };

  const pickPhotoForGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setIsUploadingPhoto(true);
        
        try {
          await addImage(asset.uri, photoDescription);
          setPhotoModalVisible(false);
          setPhotoDescription('');
        } catch (err) {
          Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la photo');
        } finally {
          setIsUploadingPhoto(false);
        }
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const handleDeleteGalleryPhoto = async (photoId: string, storagePath: string) => {
    Alert.alert(
      'Supprimer la photo',
      'Êtes-vous sûr de vouloir supprimer cette photo ?',
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await deleteImage(photoId, storagePath);
            } catch (err) {
              Alert.alert('Erreur', 'Erreur lors de la suppression de la photo');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSetCover = async (photoId: string) => {
    try {
      await updateImage(photoId, { isCover: true });
    } catch (err) {
      Alert.alert('Erreur', 'Erreur lors de la mise à jour');
    }
  };

  const goTo = <T extends keyof ClubStackParamList>(screen: T, params?: ClubStackParamList[T]) => {
    if (params === undefined) {
      navigation.navigate(screen as any);
    } else {
      navigation.navigate(screen as any, params);
    }
  };

  const handleBoostSuccess = () => {
    setBoostModalVisible(false);
    refetchBoost();
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
            <TouchableOpacity 
              style={styles.ratingContainer}
              onPress={() => navigation.navigate('clubReviews')}
            >
              <Text style={styles.heroRating}>
                <Ionicons name="star" size={14} color="#FBBF24" /> {stats.averageRating.toFixed(1)} ({stats.reviewCount} avis)
              </Text>
              <Ionicons name="chevron-forward" size={16} color={palette.primaryDark} />
            </TouchableOpacity>
            <Text style={styles.heroMember}>Membre depuis {createdAtDisplay || 'Date inconnue'}</Text>
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Informations générales</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('editClubProfile')}
              >
                <Ionicons name="pencil" size={16} color="#fff" />
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
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
                  <Text style={styles.infoLabel}>TVA</Text>
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
              {openingHours && openingHours.length > 0 ? (
                <View style={styles.infLine}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color={palette.primary} />
                  <View style={{ flex: 1 }}>
                    {openingHours.map((hours, idx) => (
                      <Text key={idx} style={styles.infoValue}>
                        {hours.day}: {hours.open}-{hours.close}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.infLine}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color={palette.primary} />
                  <Text style={styles.infoValue}>Horaires non définies</Text>
                </View>
              )}
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
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => navigation.navigate('createPromotion')}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Créer</Text>
              </TouchableOpacity>
            </View>
            
            {loadingPromotions ? (
              <ActivityIndicator color={palette.primary} size="large" style={{ marginVertical: 20 }} />
            ) : promotions.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="tag-off" size={48} color={palette.gray} />
                <Text style={styles.emptyStateTitle}>Aucune promotion</Text>
                <Text style={styles.emptyStateText}>
                  Créez une promotion pour attirer plus de clients et augmenter vos réservations !
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('createPromotion')}
                >
                  <Ionicons name="add-circle" size={18} color={palette.primary} />
                  <Text style={styles.emptyStateButtonText}>Créer une promotion</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {promotions.map((promo) => {
                  const validFrom = promo.validFrom instanceof Timestamp ? promo.validFrom.toDate() : new Date(promo.validFrom);
                  const validUntil = promo.validUntil instanceof Timestamp ? promo.validUntil.toDate() : new Date(promo.validUntil);
                  const isExpired = validUntil < new Date();
                  
                  return (
                    <TouchableOpacity 
                      key={promo.id} 
                      style={styles.promotionCard}
                      onPress={() => navigation.navigate('editPromotion', { promotionId: promo.id })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.promotionHeader}>
                        <Text style={styles.promotionTitle}>{promo.title}</Text>
                        <View style={[
                          styles.promotionBadge,
                          isExpired && styles.promotionBadgeInactive
                        ]}>
                          <Text style={styles.promotionBadgeText}>
                            {isExpired ? 'Expirée' : 'Active'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.promotionCode}>
                        {promo.code} -{promo.discountPercentage}%
                      </Text>
                      <Text style={styles.promotionDate}>
                        Valide jusqu'au {validUntil.toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                      {promo.description && (
                        <Text style={styles.promotionDescription} numberOfLines={2}>
                          {promo.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            
            {promotions.length > 0 && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={16} color="#6366F1" />
                <Text style={styles.infoBoxText}>
                  Conseil: les clubs avec promotions actives reçoivent 60% de réservations en plus !
                </Text>
              </View>
            )}
          </View>

          {/* Booster mon club */}
          {activeBoost ? (
            <View style={[styles.infoCard, styles.activeboostCard]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={styles.activeboostBadge}>
                  <Ionicons name="flash" size={16} color="#fff" />
                  <Text style={styles.activeboostBadgeText}>{activeBoost.planName}</Text>
                </View>
              </View>
              <Text style={styles.activeboostTitle}>Boost actif</Text>
              <Text style={styles.infoValue}>
                Votre club bénéficie déjà du <Text style={{ fontWeight: '700' }}>{activeBoost.planName}</Text> jusqu'au <Text style={{ fontWeight: '700' }}>{formatDate(activeBoost.endDate)}</Text>
              </Text>
              <TouchableOpacity style={styles.activeboostButton} onPress={() => setBoostModalVisible(true)}>
                <Ionicons name="swap-horizontal" size={16} color="#fff" />
                <Text style={styles.activeboostButtonText}>Changer de plan</Text>
              </TouchableOpacity>
            </View>
          ) : (
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

              <TouchableOpacity style={styles.boosterButton} onPress={() => setBoostModalVisible(true)}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
                <Text style={styles.boosterButtonText}>Booster mon annonce</Text>
              </TouchableOpacity>
            </View>
          )}

          <ClubBoostPlansModal
            visible={isBoostModalVisible}
            onClose={() => setBoostModalVisible(false)}
            clubId={user?.uid || ''}
            activeBoostId={activeBoost?.id}
            onSuccess={handleBoostSuccess}
          />

          {/* Galerie photos */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Galerie photos</Text>
              <TouchableOpacity 
                style={[styles.addPhotoButton, !canAddMorePhotos && { opacity: 0.5 }]}
                onPress={() => setPhotoModalVisible(true)}
                disabled={!canAddMorePhotos}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                <Text style={styles.addPhotoText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            
            {galleryLoading ? (
              <ActivityIndicator color={palette.primary} size="large" style={{ marginVertical: 20 }} />
            ) : galleryPhotos.length === 0 ? (
              <View style={styles.emptyGalleryState}>
                <MaterialCommunityIcons name="image-off" size={48} color={palette.gray} />
                <Text style={styles.emptyStateTitle}>Aucune photo</Text>
                <Text style={styles.emptyStateText}>Ajoutez des photos de votre club pour attirer plus de clients !</Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setPhotoModalVisible(true)}
                >
                  <Ionicons name="add-circle" size={18} color={palette.primary} />
                  <Text style={styles.emptyStateButtonText}>Ajouter une photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                <View style={styles.photosPreview}>
                  {galleryPhotos.map((photo, index) => (
                    <View key={photo.id} style={styles.photoThumbnailContainer}>
                      <Image 
                        source={{ uri: photo.photoUrl }} 
                        style={styles.photoThumbnailImage}
                      />
                      {photo.isCover && (
                        <View style={styles.coverBadge}>
                          <Text style={styles.coverBadgeText}>Couverture</Text>
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.photoDeleteButton}
                        onPress={() => photo.id && handleDeleteGalleryPhoto(photo.id, photo.storagePath)}
                      >
                        <Ionicons name="close-circle" size={24} color="#DC2626" />
                      </TouchableOpacity>
                      <View style={styles.photoActions}>
                        <TouchableOpacity 
                          style={[styles.photoActionBtn, photo.isCover && styles.photoActionBtnActive]}
                          onPress={() => photo.id && handleSetCover(photo.id)}
                        >
                          <Ionicons name={photo.isCover ? 'star' : 'star-outline'} size={16} color="#fff" />
                          <Text style={styles.photoActionBtnText}>Couverture</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
                <Text style={styles.photoInfo}>{totalPhotos}/10 photos - Les photos de qualité augmentent vos réservations de 40%</Text>
              </View>
            )}
          </View>

          {/* Terrains */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Terrains</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => navigation.navigate('createField')}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            {loadingFields ? (
              <ActivityIndicator color={palette.primary} />
            ) : fields.length === 0 ? (
              <Text style={{ color: palette.gray, fontSize: 14, textAlign: 'center', marginVertical: 16 }}>Aucun terrain enregistré</Text>
            ) : (
              <View style={{ gap: 12 }}>
                {fields.map((field) => (
                  <TouchableOpacity 
                    key={field.id}
                    style={styles.terrainItem}
                    onPress={() => navigation.navigate('editField', { fieldId: field.id })}
                  >
                    <View style={styles.terrainIcon}>
                      <Ionicons name={field.isIndoor ? 'home' : 'location'} size={24} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.terrainName}>{field.name}</Text>
                      <Text style={styles.terrainAddress}>{field.address}</Text>
                      <View style={styles.terrainBadge}>
                        <Text style={styles.terrainBadgeText}>
                          {field.isIndoor ? 'Intérieur' : 'Extérieur'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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

            <TouchableOpacity style={styles.managerButton} onPress={() => navigation.navigate('clubTeachers')}>
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
                <TouchableOpacity 
                  style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                  onPress={() => setGroupSizeModalVisible(true)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>Taille max des groupes</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.settingValue}>{localMaxGroupSize || maxGroupSize} participants</Text>
                    <Ionicons name="chevron-forward" size={16} color={palette.primary} />
                  </View>
                </TouchableOpacity>
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
                  <MaterialCommunityIcons name="information" size={16} color={palette.orange} />
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

      {/* Group Size Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isGroupSizeModalVisible}
        onRequestClose={() => {
          if (!isUpdatingGroupSize) {
            setGroupSizeModalVisible(false);
            setSelectedGroupSize(null);
          }
        }}
      >
        <Pressable 
          style={styles.modalBackdrop}
          onPress={() => {
            if (!isUpdatingGroupSize) {
              setGroupSizeModalVisible(false);
              setSelectedGroupSize(null);
            }
          }}
        >
          <Pressable 
            style={[styles.modalView, { width: '90%', maxWidth: 400 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, width: '100%' }}>
              <Text style={styles.modalTitle}>Taille max des groupes</Text>
              <TouchableOpacity 
                onPress={() => {
                  if (!isUpdatingGroupSize) {
                    setGroupSizeModalVisible(false);
                    setSelectedGroupSize(null);
                  }
                }}
                disabled={isUpdatingGroupSize}
              >
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { width: '100%' }]}>
              Sélectionnez le nombre maximum de participants pour les cours en groupe.
            </Text>

            <View style={{ gap: 12, marginVertical: 20, width: '100%' }}>
              {['4', '5', '6', '8', '10', '12', '15', '20'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.groupSizeOption,
                    (selectedGroupSize || localMaxGroupSize) === size && styles.groupSizeOptionSelected,
                  ]}
                  onPress={() => setSelectedGroupSize(size)}
                  disabled={isUpdatingGroupSize}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View
                      style={[
                        styles.groupSizeRadio,
                        (selectedGroupSize || localMaxGroupSize) === size && styles.groupSizeRadioSelected,
                      ]}
                    >
                      {(selectedGroupSize || localMaxGroupSize) === size && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <View>
                      <Text style={styles.groupSizeLabel}>{size} participants</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                style={[
                  styles.groupSizeConfirmButton,
                  isUpdatingGroupSize && { opacity: 0.6 }
                ]}
                onPress={() => {
                  if (selectedGroupSize && selectedGroupSize !== localMaxGroupSize) {
                    handleUpdateGroupSize(selectedGroupSize);
                  } else if (selectedGroupSize === localMaxGroupSize) {
                    setGroupSizeModalVisible(false);
                    setSelectedGroupSize(null);
                  }
                }}
                disabled={isUpdatingGroupSize || !selectedGroupSize}
              >
                {isUpdatingGroupSize ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.groupSizeConfirmButtonText}>Confirmer</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.groupSizeCloseButton}
                onPress={() => {
                  setGroupSizeModalVisible(false);
                  setSelectedGroupSize(null);
                }}
                disabled={isUpdatingGroupSize}
                activeOpacity={0.7}
              >
                <Text style={styles.groupSizeCloseButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Photo Upload Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPhotoModalVisible}
        onRequestClose={() => {
          if (!isUploadingPhoto) {
            setPhotoModalVisible(false);
            setPhotoDescription('');
          }
        }}
      >
        <Pressable 
          style={styles.modalBackdrop}
          onPress={() => {
            if (!isUploadingPhoto) {
              setPhotoModalVisible(false);
              setPhotoDescription('');
            }
          }}
        >
          <Pressable 
            style={[styles.modalView, { width: '90%', maxWidth: 400 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, width: '100%' }}>
              <Text style={styles.modalTitle}>Ajouter une photo</Text>
              <TouchableOpacity 
                onPress={() => {
                  if (!isUploadingPhoto) {
                    setPhotoModalVisible(false);
                    setPhotoDescription('');
                  }
                }}
                disabled={isUploadingPhoto}
              >
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { width: '100%', marginBottom: 12 }]}>
              Ajoutez une belle photo pour mettre en avant votre club !
            </Text>

            <View style={{ width: '100%', marginBottom: 16 }}>
              <Text style={[styles.modalDescription, { fontSize: 12, color: palette.gray, marginBottom: 8 }]}>
                Description (optionnelle)
              </Text>
              <TextInput
                style={styles.photoDescriptionInput}
                placeholder="Terrain d'agility, Séance de groupe..."
                value={photoDescription}
                onChangeText={setPhotoDescription}
                placeholderTextColor={palette.gray}
                editable={!isUploadingPhoto}
                maxLength={50}
              />
              <Text style={styles.charCounter}>{photoDescription.length}/50</Text>
            </View>

            <TouchableOpacity
              style={[styles.photoPickerButton, isUploadingPhoto && { opacity: 0.6 }]}
              onPress={pickPhotoForGallery}
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="image-outline" size={20} color="#fff" />
                  <Text style={styles.photoPickerButtonText}>Sélectionner une photo</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupSizeCloseButton}
              onPress={() => {
                setPhotoModalVisible(false);
                setPhotoDescription('');
              }}
              disabled={isUploadingPhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.groupSizeCloseButtonText}>Annuler</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    marginHorizontal: -10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
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
  promotionDescription: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 8,
    lineHeight: 16,
  },
  promotionBadgeInactive: {
    backgroundColor: '#FEE2E2',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: palette.lightGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  emptyStateText: {
    fontSize: 13,
    color: palette.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    marginTop: 8,
  },
  emptyStateButtonText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '600',
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
  activeboostCard: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  activeboostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.green,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeboostBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  activeboostTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.green,
    marginBottom: 8,
  },
  activeboostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.green,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  activeboostButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  photosPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  // Group Size Selection Styles
  groupSizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  groupSizeOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.orangeLight,
  },
  groupSizeRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSizeRadioSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  groupSizeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.text,
  },
  groupSizeCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: palette.lightGray,
    alignItems: 'center',
    marginTop: 12,
  },
  groupSizeCloseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  groupSizeConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  groupSizeConfirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  modalDescription: {
    fontSize: 14,
    color: palette.gray,
    lineHeight: 20,
  },
  // Gallery Styles
  emptyGalleryState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 20,
  },
  photoThumbnailContainer: {
    position: 'relative',
    width: '32%',
    aspectRatio: 1,
  },
  photoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: palette.lightGray,
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  photoDeleteButton: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  photoActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  photoActionBtnActive: {
    backgroundColor: palette.primary,
  },
  photoActionBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  photoDescriptionInput: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.text,
    minHeight: 40,
  },
  charCounter: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 4,
    textAlign: 'right',
  },
  photoPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: palette.primary,
    marginBottom: 10,
    minHeight: 48,
  },
  photoPickerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

