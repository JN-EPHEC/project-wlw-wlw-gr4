import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useFetchClubEducators } from '@/hooks/useFetchClubEducators';
import { useFetchClubFields } from '@/hooks/useFetchClubFields';
import { useFetchClubUpcomingBookings } from '@/hooks/useFetchClubUpcomingBookings';
import { useFetchClubUpcomingEvents } from '@/hooks/useFetchClubUpcomingEvents';
import { useFetchEducatorById } from '@/hooks/useFetchEducatorById';
import { useJoinClub } from '@/hooks/useJoinClub';
import {
  useClubEducatorInvite,
  useClubEducatorInviteActions,
} from '@/hooks/useClubEducatorInvites';
import { useAuth } from '@/context/AuthContext';
import { getInviteErrorMessage } from '@/services/clubEducatorInvitations';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'clubDetail'>;

interface ClubData {
  id: string;
  name: string;
  averageRating: number;
  reviewsCount: number;
  distanceKm: number;
  isVerified: boolean;
  PhotoUrl?: string;
  logoUrl?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  certifications?: string;
  services?: string;
  stats?: {
    totalBookings: number;
    totalDogs: number;
    totalMembers: number;
  };
  // Autres champs
  [key: string]: any;
}

export default function ClubDetailScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningLoading, setJoiningLoading] = useState(false);
  
  // Auth et join club hook
  const { user, profile } = useAuth();
  const { joinClub } = useJoinClub();
  const userRole = (profile as any)?.role || (profile as any)?.profile?.role || 'user';
  const educatorId = (profile as any)?.educatorId || (profile as any)?.profile?.educatorId || '';
  const isEducator = userRole === 'educator';
  const hasEducatorId = isEducator && !!educatorId;

  const { invite, loading: inviteLoading } = useClubEducatorInvite(
    hasEducatorId ? clubId : null,
    hasEducatorId ? educatorId : null,
  );
  const {
    loading: inviteActionLoading,
    educatorRequestJoinClub: requestJoinClub,
    acceptInviteOrRequest,
    rejectInviteOrRequest,
    cancelInviteOrRequest,
  } = useClubEducatorInviteActions();
  
  // Récupérer les terrains et éducateurs du club
  const { fields, loading: fieldsLoading } = useFetchClubFields(clubId);
  const clubEducatorIds = club?.educatorId ? [club.educatorId] : [];
  const { educators, loading: educatorsLoading } = useFetchClubEducators(clubEducatorIds);
  const { bookings, loading: bookingsLoading } = useFetchClubUpcomingBookings(clubId);
  const { events, loading: eventsLoading } = useFetchClubUpcomingEvents(clubId);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        console.log('🔍 [club-detail] Fetching club with ID:', clubId);
        // clubId vient directement de Firebase (string)
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);

        if (clubSnap.exists()) {
          console.log('✅ [club-detail] Club found:', clubSnap.data());
          setClub({ id: clubSnap.id, ...clubSnap.data() } as ClubData);
          setError(null);
        } else {
          console.log('❌ [club-detail] Club NOT found with ID:', clubId);
          setError('Club non trouvé');
        }
      } catch (err) {
        console.error('❌ [club-detail] Error fetching club:', err);
        setError('Erreur lors du chargement du club');
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId]);

  // Handler pour rejoindre la communauté
  const handleJoinCommunity = async () => {
    if (!user || !profile) {
      Alert.alert('Erreur', 'Veuillez vous connecter');
      return;
    }

    setJoiningLoading(true);
    try {
      const userName = (profile as any).firstName && (profile as any).lastName
        ? `${(profile as any).firstName} ${(profile as any).lastName}`
        : (profile as any).displayName || 'Utilisateur';

      await joinClub({
        clubId,
        userEmail: user.email || '',
        userName,
      });

      Alert.alert('✓ Succès', 'Votre demande d\'adhésion a été envoyée au club. Un responsable l\'examinera prochainement.');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de l\'adhésion';
      Alert.alert('Erreur', errorMsg);
    } finally {
      setJoiningLoading(false);
    }
  };

  const handleRequestAffiliation = async () => {
    if (!user?.uid) {
      Alert.alert('Erreur', 'Veuillez vous connecter');
      return;
    }
    if (!educatorId) {
      Alert.alert('Erreur', 'Profil educateur incomplet');
      return;
    }

    try {
      await requestJoinClub({ authUid: user.uid, clubId });
      Alert.alert('Demande envoyee', "Votre demande d'affiliation a ete envoyee.");
    } catch (err) {
      Alert.alert('Erreur', getInviteErrorMessage(err));
    }
  };

  const handleAcceptAffiliation = async () => {
    if (!user?.uid) return;
    try {
      await acceptInviteOrRequest({ authUid: user.uid, clubId, educatorId });
      Alert.alert('Succes', 'Affiliation acceptee.');
    } catch (err) {
      Alert.alert('Erreur', getInviteErrorMessage(err));
    }
  };

  const handleRejectAffiliation = async () => {
    if (!user?.uid) return;
    Alert.alert('Refuser', "Refuser la demande d'affiliation ?", [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            await rejectInviteOrRequest({ authUid: user.uid, clubId, educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handleCancelAffiliation = async () => {
    if (!user?.uid) return;
    Alert.alert('Annuler', "Annuler votre demande d'affiliation ?", [
      { text: 'Retour', style: 'cancel' },
      {
        text: 'Annuler la demande',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelInviteOrRequest({ authUid: user.uid, clubId, educatorId });
          } catch (err) {
            Alert.alert('Erreur', getInviteErrorMessage(err));
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !club) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, textAlign: 'center' }}>
            {error || 'Club non trouvé'}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: palette.primary, borderRadius: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image 
            source={{ uri: club.PhotoUrl || club.logoUrl || 'https://via.placeholder.com/400x220?text=Club' }} 
            style={styles.heroImage} 
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.heroTitle}>{club.name}</Text>
              {club.isVerified && <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" />}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                <Text style={styles.ratingText}>{club.averageRating?.toFixed(1) || 'N/A'}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('reviews', { clubId })}>
                <Text style={[styles.heroMeta, styles.linkText]}>
                  {club.reviewsCount || 0} avis
                </Text>
              </TouchableOpacity>
              <Text style={styles.heroMeta}>{club.distanceKm?.toFixed(1) || 'N/A'} km</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.sub}>{club.description || 'Pas de description disponible'}</Text>
        </View>

        {club.address && (
          <View style={styles.sectionRow}>
            <Ionicons name="location-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.address}</Text>
          </View>
        )}
        {club.phone && (
          <View style={styles.sectionRow}>
            <Ionicons name="call-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.phone}</Text>
          </View>
        )}
        {club.email && (
          <View style={styles.sectionRow}>
            <Ionicons name="mail-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.email}</Text>
          </View>
        )}
        {club.website && (
          <View style={styles.sectionRow}>
            <Ionicons name="globe-outline" size={18} color={palette.primary} />
            <Text style={styles.sub}>{club.website}</Text>
          </View>
        )}

        {club.certifications && (
          <View style={styles.section}>
            <Text style={styles.title}>Certifications</Text>
            <View style={styles.chips}>
              {(Array.isArray(club.certifications) 
                ? club.certifications 
                : club.certifications.split(',').map((c: string) => c.trim())
              ).map((c: string) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.title}>Contact & Infos</Text>
          {club.stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalMembers || 0}</Text>
                <Text style={styles.statLabel}>Membres</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalBookings || 0}</Text>
                <Text style={styles.statLabel}>Réservations</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{club.stats.totalDogs || 0}</Text>
                <Text style={styles.statLabel}>Chiens</Text>
              </View>
            </View>
          )}
        </View>

        {/* BOUTON REJOINDRE LA COMMUNAUTE / AFFILIATION EDUCATEUR */}
        {hasEducatorId ? (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={styles.affiliationCard}>
              <Text style={styles.affiliationTitle}>Affiliation educateur</Text>
              {inviteLoading ? (
                <View style={styles.affiliationLoading}>
                  <ActivityIndicator color={palette.primary} size="small" />
                </View>
              ) : invite?.status === 'pending' ? (
                invite.createdByRole === 'educator' ? (
                  <View style={styles.affiliationActions}>
                    <View style={[styles.affiliationPrimary, { opacity: 0.7 }]}>
                      <Ionicons name="time-outline" size={18} color="#fff" />
                      <Text style={styles.affiliationPrimaryText}>Demande envoyee</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.affiliationSecondary}
                      onPress={handleCancelAffiliation}
                      disabled={inviteActionLoading}
                    >
                      <Text style={styles.affiliationSecondaryText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.affiliationActions}>
                    <TouchableOpacity
                      style={styles.affiliationAccept}
                      onPress={handleAcceptAffiliation}
                      disabled={inviteActionLoading}
                    >
                      <Ionicons name="checkmark" size={18} color="#fff" />
                      <Text style={styles.affiliationPrimaryText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.affiliationReject}
                      onPress={handleRejectAffiliation}
                      disabled={inviteActionLoading}
                    >
                      <Ionicons name="close" size={18} color="#fff" />
                      <Text style={styles.affiliationPrimaryText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : invite?.status === 'accepted' ? (
                <View style={styles.affiliationActions}>
                  <View style={[styles.affiliationPrimary, { opacity: 0.7 }]}>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.affiliationPrimaryText}>Affiliation active</Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.affiliationPrimary}
                  onPress={handleRequestAffiliation}
                  disabled={inviteActionLoading}
                >
                  <Ionicons name="people" size={18} color="#fff" />
                  <Text style={styles.affiliationPrimaryText}>Demander affiliation</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <TouchableOpacity
              style={[styles.joinCommunityBtn, joiningLoading && { opacity: 0.7 }]}
              onPress={handleJoinCommunity}
              disabled={joiningLoading}
              activeOpacity={0.8}
            >
              {joiningLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="people" size={20} color="#fff" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.joinCommunityTitle}>Rejoindre la communauté</Text>
                    <Text style={styles.joinCommunitySubtitle}>Accédez aux salons, annonces et événements</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION TERRAINS */}}
        <View style={styles.section}>
          <Text style={styles.title}>Terrains & Équipements</Text>
          {fieldsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : fields.length > 0 ? (
            fields.map((field) => (
              <View key={field.id} style={styles.fieldCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MaterialCommunityIcons 
                    name={field.isIndoor ? 'home-outline' : 'grass'} 
                    size={24} 
                    color={palette.primary} 
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldName}>{field.name}</Text>
                    {field.trainingType && (
                      <Text style={styles.sub}>{field.trainingType}</Text>
                    )}
                    {field.surfaceType && (
                      <Text style={[styles.sub, { fontSize: 12 }]}>
                        Surface: {field.surfaceType}
                      </Text>
                    )}
                  </View>
                  {field.isIndoor && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Couvert</Text>
                    </View>
                  )}
                </View>
                {field.notes && (
                  <Text style={[styles.sub, { marginTop: 8 }]}>📝 {field.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="grass" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore de terrains</Text>
            </View>
          )}
        </View>

        {/* SECTION ÉDUCATEURS */}
        <View style={styles.section}>
          <Text style={styles.title}>Éducateurs du Club</Text>
          {educatorsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : educators.length > 0 ? (
            educators.map((educator) => (
              <TouchableOpacity
                key={educator.id}
                style={styles.educatorCard}
                onPress={() => navigation.navigate('educatorDetail', { educatorId: educator.id })}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {educator.photoUrl ? (
                    <Image
                      source={{ uri: educator.photoUrl }}
                      style={styles.educatorPhoto}
                    />
                  ) : (
                    <View style={[styles.educatorPhoto, { backgroundColor: palette.primary, justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                        {educator.firstName.charAt(0)}{educator.lastName.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.educatorName}>
                      {educator.firstName} {educator.lastName}
                    </Text>
                    {educator.averageRating && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                        <Text style={[styles.sub, { fontWeight: '600' }]}>
                          {educator.averageRating.toFixed(1)}
                        </Text>
                        <Text style={styles.sub}>({educator.reviewsCount || 0})</Text>
                      </View>
                    )}
                    {educator.hourlyRate && (
                      <Text style={[styles.sub, { marginTop: 4 }]}>
                        {educator.hourlyRate}€/h • {educator.experienceYears} ans d'exp.
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="account-outline" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore d'éducateurs</Text>
            </View>
          )}
        </View>

        {/* SECTION PROCHAINS COURS (BOOKINGS) */}
        <View style={styles.section}>
          <Text style={styles.title}>Prochains cours</Text>
          {bookingsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : bookings.length > 0 ? (
            <View>
              {bookings
                .sort((a, b) => {
                  const dateA = a.sessionDate?.toDate?.() || new Date(a.sessionDate);
                  const dateB = b.sessionDate?.toDate?.() || new Date(b.sessionDate);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((item) => (
                  <CourseCardWithEducator key={item.id} booking={item} clubId={clubId} navigation={navigation} />
                ))}
            </View>
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="calendar-outline" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore de cours à venir</Text>
            </View>
          )}
        </View>

        {/* SECTION PROCHAINS ÉVÉNEMENTS */}
        <View style={styles.section}>
          <Text style={styles.title}>Prochains événements</Text>
          {eventsLoading ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator color={palette.primary} />
            </View>
          ) : events.length > 0 ? (
            <View>
              {events
                .sort((a, b) => {
                  const dateA = a.startDate?.toDate?.() || new Date(a.startDate);
                  const dateB = b.startDate?.toDate?.() || new Date(b.startDate);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((item) => (
                  <EventCard key={item.id} event={item} navigation={navigation} />
                ))}
            </View>
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <MaterialCommunityIcons name="calendar-outline" size={40} color={palette.border} />
              <Text style={[styles.sub, { marginTop: 8, textAlign: 'center' }]}>Pas encore d'événements</Text>
            </View>
          )}
        </View>

        {/* SECTION PHOTOS */}
        {club.PhotoUrl && (
          <View style={styles.section}>
            <Text style={styles.title}>Galerie Officielle</Text>
            <Image
              source={{ uri: club.PhotoUrl }}
              style={styles.mainPhoto}
            />
            {club.logoUrl && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sub, { marginBottom: 8 }]}>Logo du club</Text>
                <Image
                  source={{ uri: club.logoUrl }}
                  style={styles.logoPhoto}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('homeTrainingBooking', { clubId })}>
            <Text style={styles.secondaryText}>Séance à domicile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('booking', { clubId })}>
            <Text style={styles.primaryBtnText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Composant pour afficher une carte de cours avec l'éducateur
function CourseCardWithEducator({ booking, clubId, navigation }: any) {
  const { educator } = useFetchEducatorById(booking.educatorId);

  const dateObj = booking.sessionDate?.toDate?.() || new Date(booking.sessionDate);
  const dateStr = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('booking', { clubId })}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1, gap: 10 }}>
        {/* Titre du cours */}
        <Text style={[styles.courseTitle, { marginBottom: 2 }]}>
          {booking.isGroupCourse ? booking.title : 'Séance privée'}
        </Text>

        {/* Description */}
        {booking.description && (
          <Text style={[styles.sub, { fontSize: 13, color: palette.gray }]} numberOfLines={2}>
            {booking.description}
          </Text>
        )}

        {/* Infos: Date, Heure, Durée */}
        <View style={{ gap: 6, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="calendar-outline" size={14} color={palette.primary} />
            <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]}>
              {dateStr}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="time-outline" size={14} color={palette.primary} />
            <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]}>
              {timeStr}
            </Text>
          </View>
          {booking.duration && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="timer-outline" size={14} color={palette.primary} />
              <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]}>
                {booking.duration} minutes
              </Text>
            </View>
          )}
        </View>

        {/* Éducateur */}
        {educator && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            {educator.photoUrl ? (
              <Image
                source={{ uri: educator.photoUrl }}
                style={{ width: 28, height: 28, borderRadius: 14 }}
              />
            ) : (
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 10 }}>
                  {educator.firstName.charAt(0)}{educator.lastName.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={[styles.sub, { fontSize: 12, color: palette.text }]}>
              {educator.firstName} {educator.lastName}
            </Text>
          </View>
        )}
      </View>

      {/* Droite: Prix, Chevron */}
      <View style={{ alignItems: 'flex-end', justifyContent: 'flex-start', gap: 10, minWidth: 80 }}>
        <Ionicons name="chevron-forward" size={20} color={palette.primary} style={{ marginTop: 2 }} />
        <View style={{ alignItems: 'flex-end', gap: 3 }}>
          <Text style={{ color: palette.primary, fontSize: 16, fontWeight: '700' }}>
            {booking.price}€
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Composant pour afficher une carte d'événement
function EventCard({ event, navigation }: any) {
  const { educator } = useFetchEducatorById(event.educatorId);

  const dateObj = event.startDate?.toDate?.() || new Date(event.startDate);
  const dateStr = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('eventBooking', { eventId: event.id })}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1, gap: 10 }}>
        {/* Badge type */}
        {event.type && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>{event.type}</Text>
          </View>
        )}

        {/* Titre */}
        <Text style={[styles.courseTitle, { marginBottom: 2 }]}>
          {event.title}
        </Text>

        {/* Description */}
        {event.description && (
          <Text style={[styles.sub, { fontSize: 13, color: palette.gray }]} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Infos: Participants, Chiens, Adresse */}
        <View style={{ gap: 6, marginTop: 4 }}>
          {event.dogSlots !== undefined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="dog" size={14} color={palette.primary} />
              <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]}>
                {event.dogSlots} places pour chiens
              </Text>
            </View>
          )}
          {event.spectatorSlots !== undefined && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="people-outline" size={14} color={palette.primary} />
              <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]}>
                {event.spectatorSlots} participants
              </Text>
            </View>
          )}
          {(event.address || event.location) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="location-outline" size={14} color={palette.primary} />
              <Text style={[styles.sub, { fontSize: 12, color: palette.text, fontWeight: '500' }]} numberOfLines={1}>
                {event.address || event.location}
              </Text>
            </View>
          )}
        </View>

        {/* Éducateur */}
        {educator && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            {educator.photoUrl ? (
              <Image
                source={{ uri: educator.photoUrl }}
                style={{ width: 28, height: 28, borderRadius: 14 }}
              />
            ) : (
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 10 }}>
                  {educator.firstName.charAt(0)}{educator.lastName.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={[styles.sub, { fontSize: 12, color: palette.text }]}>
              {educator.firstName} {educator.lastName}
            </Text>
          </View>
        )}
      </View>

      {/* Droite: Prix, Date, Chevron */}
      <View style={{ alignItems: 'flex-end', justifyContent: 'flex-start', gap: 10, minWidth: 80 }}>
        <Ionicons name="chevron-forward" size={20} color={palette.primary} style={{ marginTop: 2 }} />
        <View style={{ alignItems: 'flex-end', gap: 3 }}>
          <Text style={{ color: palette.primary, fontSize: 16, fontWeight: '700' }}>
            {event.price}€
          </Text>
          <Text style={[styles.sub, { fontSize: 11, color: palette.text }]}>
            {dateStr}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  heroContent: { position: 'absolute', left: 16, right: 16, bottom: 12 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  heroMeta: { color: '#E5E7EB', fontSize: 13 },
  rating: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
  section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  sectionRow: { paddingHorizontal: 16, flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
  title: { color: palette.text, fontSize: 18, fontWeight: '700' },
  sub: { color: palette.gray, fontSize: 14 },
  linkText: { textDecorationLine: 'underline' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  scheduleTime: { color: palette.text, fontWeight: '600' },
  photo: { width: 180, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB' },
  bottomActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 4 },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: palette.primary, fontWeight: '700' },
  joinCommunityBtn: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinCommunityTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  joinCommunitySubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  affiliationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  affiliationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  affiliationLoading: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  affiliationActions: {
    flexDirection: 'row',
    gap: 10,
  },
  affiliationPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  affiliationAccept: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 12,
  },
  affiliationReject: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 12,
  },
  affiliationPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  affiliationSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  affiliationSecondaryText: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 13,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  statsContainer: { flexDirection: 'row', gap: 10, justifyContent: 'space-around' },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: { color: palette.primary, fontSize: 18, fontWeight: '700' },
  statLabel: { color: palette.gray, fontSize: 12, marginTop: 4 },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  fieldName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#D32F2F',
    fontSize: 11,
    fontWeight: '600',
  },
  educatorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
  },
  educatorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.border,
  },
  educatorName: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  eventBadge: {
    backgroundColor: '#FEE4E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  eventBadgeText: {
    color: '#D32F2F',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  mainPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: palette.border,
  },
  logoPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: palette.border,
  },
});

