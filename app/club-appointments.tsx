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
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Timestamp, doc, getDoc } from 'firebase/firestore';

import ClubBottomNav from '@/components/ClubBottomNav';
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

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  accent: '#41B6A6',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAppointments'>;

export default function ClubAppointmentsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [search, setSearch] = useState('');
  const [showHomeRequests, setShowHomeRequests] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEducatorDropdown, setShowEducatorDropdown] = useState(false);
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [modifyHomeRequestVisible, setModifyHomeRequestVisible] = useState(false);
  const [modifyingRequestId, setModifyingRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionDate: new Date(),
    service: '',
    educatorId: '',
    fieldId: '',
    duration: 60,
    price: '',
    maxParticipants: 1,
    notes: '',
  });
  const [modifyFormData, setModifyFormData] = useState({
    sessionDate: new Date(),
    educatorId: '',
  });
  const [editingCourse, setEditingCourse] = useState<BookingDisplay | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);
  const [selectedBookingForParticipants, setSelectedBookingForParticipants] = useState<BookingDisplay | null>(null);
  
  // Get clubId from user profile
  const { profile } = useAuth();
  const clubProfile = (profile as any)?.profile || {};
  const clubId = clubProfile?.clubId || (profile as any)?.clubId || '';
  
  const { bookings, loading, error, stats } = useFetchClubAllBookings(clubId);
  const { confirmBooking, rejectBooking, completeBooking, deleteBooking, updateBooking, loading: updateLoading } = useUpdateBooking();
  const { createBooking, loading: createLoading } = useCreateBooking();
  const { createInvitation, loading: invitationLoading } = useCreateRatingInvitation();
  const { createNotification } = useCreateNotification();
  
  // Fetch educators and fields for the club
  const { educators, loading: educatorsLoading } = useFetchClubEducatorsForForm(clubId);
  const { fields, loading: fieldsLoading } = useFetchClubFieldsForForm(clubId);

  // Separate bookings by status
  const upcomingBookings = useMemo(
    () => {
      const filtered = bookings.filter(b => 
        ['available', 'pending', 'confirmed'].includes(b.status) && 
        b.type === 'club-based' // Explicitement égal à club-based, pas juste !== home-based
      );
      console.log('📋 [upcomingBookings] Filtered bookings:', filtered.length, 'from', bookings.length, 'total');
      bookings.forEach(b => console.log(`  - Booking: status=${b.status}, type=${b.type}, title=${b.title}`));
      return filtered;
    },
    [bookings]
  );

  const pastBookings = useMemo(
    () => bookings.filter(b => ['completed'].includes(b.status) && b.type === 'club-based'),
    [bookings]
  );

  const cancelledBookings = useMemo(
    () => bookings.filter(b => ['cancelled', 'rejected', 'refused'].includes(b.status) && b.type === 'club-based'),
    [bookings]
  );

  // Home-based requests (demandes à domicile)
  const homeRequests = useMemo(
    () => bookings.filter(b => b.type === 'home-based' && b.status === 'pending'),
    [bookings]
  );

  const counts = useMemo(
    () => ({
      upcoming: upcomingBookings.length,
      past: pastBookings.length,
      cancelled: cancelledBookings.length,
    }),
    [upcomingBookings, pastBookings, cancelledBookings]
  );

  const filtered = (list: BookingDisplay[]) => {
    if (!search) return list;
    const lower = search.toLowerCase();
    return list.filter(
      (booking) =>
        booking.title?.toLowerCase().includes(lower) ||
        booking.description?.toLowerCase().includes(lower) ||
        booking.trainingType?.toLowerCase().includes(lower)
    );
  };

  const statusBadge = (status: BookingStatus | string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmé', color: '#DCFCE7', text: '#166534' };
      case 'pending':
        return { label: 'En attente', color: '#FFF7ED', text: '#9A3412' };
      case 'completed':
        return { label: 'Terminé', color: '#DBEAFE', text: '#1D4ED8' };
      case 'cancelled':
        return { label: 'Annulé', color: '#FEE2E2', text: '#991B1B' };
      case 'rejected':
        return { label: 'Rejeté', color: '#FEE2E2', text: '#991B1B' };
      default:
        return { label: status, color: palette.border, text: palette.gray };
    }
  };

  const formatDate = (date: any): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: any): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDurationInHours = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Action handlers
  const handleConfirm = async (bookingId: string) => {
    try {
      await confirmBooking(bookingId);
      Alert.alert('Succès', 'Rendez-vous confirmé');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de confirmer le rendez-vous');
    }
  };

  const handleReject = async () => {
    if (!rejectingBookingId || !rejectionReason.trim()) {
      Alert.alert('Erreur', 'Veuillez fournir une raison');
      return;
    }
    try {
      await rejectBooking(rejectingBookingId, rejectionReason);
      setRejectModalVisible(false);
      setRejectingBookingId(null);
      setRejectionReason('');
      Alert.alert('Succès', 'Rendez-vous refusé');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de refuser le rendez-vous');
    }
  };

  const handleComplete = async (bookingId: string) => {
    try {
      // 1. Marquer la séance comme complétée
      await completeBooking(bookingId);

      // 2. Récupérer les détails du booking pour créer les invitations
      const bookingDoc = bookings.find((b) => b.id === bookingId);
      if (!bookingDoc) {
        Alert.alert('Succès', 'Rendez-vous marqué comme terminé');
        return;
      }

      // 3. Récupérer les IDs des propriétaires de chiens participants
      const ownerIds: string[] = [];
      if (bookingDoc.userIds && bookingDoc.userIds.length > 0) {
        for (const userId of bookingDoc.userIds) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              ownerIds.push(userId);
            }
          } catch (err) {
            console.error('Erreur récupération utilisateur:', err);
          }
        }
      }

      // 4. Créer les invitations d'avis
      if (ownerIds.length > 0) {
        await createInvitation(bookingId, clubId, bookingDoc.educatorId, ownerIds);

        // 5. Envoyer des notifications aux propriétaires
        for (const ownerId of ownerIds) {
          try {
            await createNotification({
              userId: ownerId,
              type: 'review_requested',
              title: 'Donnez votre avis !',
              message: `Votre séance avec ${bookingDoc.title} est terminée. Partagez votre expérience !`,
              data: {
                bookingId,
                clubId,
                previousTarget: 'account',
              },
            });
          } catch (err) {
            console.error('Erreur envoi notification:', err);
          }
        }
      }

      Alert.alert('Succès', 'Rendez-vous marqué comme terminé et invitations d\'avis envoyées');
    } catch (err) {
      console.error('Erreur handleComplete:', err);
      Alert.alert('Erreur', 'Impossible de marquer comme terminé');
    }
  };

  const handleDelete = async (bookingId: string) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce rendez-vous?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await deleteBooking(bookingId);
              Alert.alert('Succès', 'Rendez-vous supprimé');
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de supprimer le rendez-vous');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditCourse = (booking: BookingDisplay) => {
    setEditingCourse(booking);
    setEditModalVisible(true);
  };

  const openRejectModal = (bookingId: string) => {
    setRejectingBookingId(bookingId);
    setRejectionReason('');
    setRejectModalVisible(true);
  };

  const handleCreateBooking = async () => {
    if (!formData.title.trim() || !formData.sessionDate || !formData.fieldId || !formData.educatorId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    if (!clubId) {
      Alert.alert('Erreur', 'Club ID non trouvé. Veuillez vous reconnecter.');
      console.error('❌ clubId is empty:', clubId);
      return;
    }

    try {
      console.log('📝 Creating booking with clubId:', clubId);
      await createBooking({
        clubId,
        educatorId: formData.educatorId,
        fieldId: formData.fieldId,
        title: formData.title,
        description: formData.notes,
        trainingType: formData.service,
        isGroupCourse: formData.maxParticipants > 1,
        sessionDate: formData.sessionDate,
        duration: formData.duration,
        price: parseFloat(formData.price) || 0,
        maxParticipants: formData.maxParticipants,
        createdBy: 'club',
      });

      Alert.alert('Succès', 'Rendez-vous créé avec succès');
      setCreateModalVisible(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        sessionDate: new Date(),
        service: '',
        educatorId: '',
        fieldId: '',
        duration: 60,
        price: '',
        maxParticipants: 1,
        notes: '',
      });
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de créer le rendez-vous');
      console.error(err);
    }
  };

  const handleAcceptHomeRequest = async (bookingId: string) => {
    try {
      await confirmBooking(bookingId);
      Alert.alert('Succès', 'Demande acceptée');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible d\'accepter la demande');
      console.error(err);
    }
  };

  const handleRefuseHomeRequest = async (bookingId: string) => {
    try {
      // Update status to 'refused'
      await updateBooking(bookingId, {
        status: 'refused' as BookingStatus,
      });
      Alert.alert('Succès', 'Demande refusée');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de refuser la demande');
      console.error(err);
    }
  };

  const openModifyHomeRequestModal = (booking: BookingDisplay) => {
    setShowHomeRequests(false); // Fermer la modal des demandes
    setTimeout(() => {
      // Attendre que la première modal se ferme avant d'ouvrir la deuxième
      setModifyingRequestId(booking.id);
      setModifyFormData({
        sessionDate: booking.sessionDate instanceof Timestamp ? booking.sessionDate.toDate() : new Date(booking.sessionDate),
        educatorId: booking.educatorId || '',
      });
      setModifyHomeRequestVisible(true);
    }, 300);
  };

  const handleModifyHomeRequest = async () => {
    if (!modifyingRequestId) return;

    try {
      // Update the booking with new date/educator, keep status as 'pending'
      const sessionDate = modifyFormData.sessionDate instanceof Timestamp 
        ? modifyFormData.sessionDate 
        : Timestamp.fromDate(new Date(modifyFormData.sessionDate));
      
      await updateBooking(modifyingRequestId, {
        sessionDate,
        educatorId: modifyFormData.educatorId,
      });
      Alert.alert('Succès', 'Demande modifiée et renvoyée au client');
      setModifyHomeRequestVisible(false);
      // Rouvrir la modal des demandes après 300ms
      setTimeout(() => {
        setShowHomeRequests(true);
      }, 300);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier la demande');
      console.error(err);
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
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => setCreateModalVisible(true)}
            >
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
            onPress={() => setShowHomeRequests(true)}
          >
            <Ionicons name="home-outline" size={18} color="#fff" />
            <Text style={styles.homeTrainingText}>Demandes à domicile</Text>
            {homeRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{homeRequests.length}</Text>
              </View>
            )}
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

          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={palette.primary} />
            </View>
          ) : error ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#DC2626', fontSize: 14 }}>Erreur: {error}</Text>
            </View>
          ) : activeTab === 'upcoming' ? (
            <View style={{ gap: 12 }}>
              <View style={styles.search}>
                <Ionicons name="search" size={18} color={palette.gray} />
                <TextInput
                  placeholder="Rechercher un cours..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  placeholderTextColor={palette.gray}
                />
                <TouchableOpacity>
                  <MaterialCommunityIcons name="filter-variant" size={20} color={palette.gray} />
                </TouchableOpacity>
              </View>

              {filtered(upcomingBookings).length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                  <Text style={{ color: palette.gray, fontSize: 14 }}>Aucun rendez-vous à venir</Text>
                </View>
              ) : (
                filtered(upcomingBookings).map((booking) => {
                  const badge = statusBadge(booking.status);
                  return (
                    <View key={booking.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                          <View style={styles.cardIcon}>
                            <Ionicons name="calendar" size={18} color={palette.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{booking.title}</Text>
                            <Text style={styles.cardMeta}>
                              {formatDate(booking.sessionDate)} · {formatTime(booking.sessionDate)}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.status, { backgroundColor: badge.color }]}>
                          <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="dumbbell" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>{booking.trainingType}</Text>
                      </View>

                      {booking.description && (
                        <View style={styles.detailRow}>
                          <Ionicons name="document-text-outline" size={16} color={palette.gray} />
                          <Text style={styles.detailText}>{booking.description}</Text>
                        </View>
                      )}

                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>
                          {getDurationInHours(booking.duration)}
                        </Text>
                      </View>

                      {booking.maxParticipants > 1 && (
                        <View style={styles.detailRow}>
                          <Ionicons name="people-outline" size={16} color={palette.gray} />
                          <Text style={styles.detailText}>
                            {booking.currentParticipants}/{booking.maxParticipants} participants
                            {(booking.availableSpots ?? 0) > 0 && ` (${booking.availableSpots} places libres)`}
                          </Text>
                        </View>
                      )}

                      <View style={styles.cardFooter}>
                        <Text style={styles.price}>{booking.price}€</Text>
                        {booking.createdBy === 'club' && booking.type === 'club-based' ? (
                          // Les cours créés par le club (club-based): Modifier + Participants + Terminer + Supprimer
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleEditCourse(booking)}
                              title="Modifier"
                            >
                              <MaterialCommunityIcons name="pencil" size={16} color={palette.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => {
                                setSelectedBookingForParticipants(booking);
                                setParticipantsModalVisible(true);
                              }}
                              title="Participants"
                            >
                              <Ionicons name="people" size={16} color={palette.primary} />
                            </TouchableOpacity>
                            {booking.status === 'available' && (
                              <TouchableOpacity
                                style={[styles.circleBtn, { backgroundColor: '#16A34A' }]}
                                onPress={() => handleComplete(booking.id)}
                                disabled={updateLoading}
                                title="Terminer"
                              >
                                <MaterialCommunityIcons name="check" size={16} color="#fff" />
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleDelete(booking.id)}
                              disabled={updateLoading}
                              title="Supprimer"
                            >
                              <MaterialCommunityIcons name="trash-can-outline" size={16} color="#B91C1C" />
                            </TouchableOpacity>
                          </View>
                        ) : booking.createdBy === 'club' ? (
                          // Demandes à domicile créées par le club: Modifier + Supprimer
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleEditCourse(booking)}
                            >
                              <MaterialCommunityIcons name="pencil" size={16} color={palette.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleDelete(booking.id)}
                              disabled={updateLoading}
                            >
                              <MaterialCommunityIcons name="trash-can-outline" size={16} color="#B91C1C" />
                            </TouchableOpacity>
                          </View>
                        ) : booking.status === 'pending' ? (
                          // Les réservations en attente: Confirmer + Refuser
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                              style={[styles.smallBtn, { backgroundColor: palette.accent }]}
                              onPress={() => handleConfirm(booking.id)}
                              disabled={updateLoading}
                            >
                              <Ionicons name="checkmark" size={14} color="#fff" />
                              <Text style={styles.smallBtnText}>Confirmer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallBtn, styles.smallBtnGhost]}
                              onPress={() => openRejectModal(booking.id)}
                              disabled={updateLoading}
                            >
                              <Ionicons name="close" size={14} color={palette.text} />
                              <Text style={[styles.smallBtnText, { color: palette.text }]}>Refuser</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          // Les réservations confirmées: Complete + Delete
                          <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleComplete(booking.id)}
                              disabled={updateLoading}
                            >
                              <MaterialCommunityIcons name="check" size={16} color={palette.accent} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.circleBtn, styles.circleBtnBorder]}
                              onPress={() => handleDelete(booking.id)}
                              disabled={updateLoading}
                            >
                              <MaterialCommunityIcons name="trash-can-outline" size={16} color="#B91C1C" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          ) : activeTab === 'past' ? (
            <View style={{ gap: 10 }}>
              {pastBookings.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                  <Text style={{ color: palette.gray, fontSize: 14 }}>Aucun rendez-vous terminé</Text>
                </View>
              ) : (
                pastBookings.map((booking) => {
                  const badge = statusBadge(booking.status);
                  return (
                    <View key={booking.id} style={[styles.card, { backgroundColor: '#F8FAFC' }]}>
                      <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                          <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                            <MaterialCommunityIcons name="check-circle-outline" size={18} color="#1D4ED8" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{booking.title}</Text>
                            <Text style={styles.cardMeta}>
                              {formatDate(booking.sessionDate)} · {formatTime(booking.sessionDate)}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.status, { backgroundColor: badge.color }]}>
                          <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="dumbbell" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>{booking.trainingType}</Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Ionicons name="people-outline" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>{booking.currentParticipants} participant(s)</Text>
                      </View>

                      <View style={styles.cardFooter}>
                        <Text style={styles.price}>{booking.price}€</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity style={[styles.circleBtn, styles.circleBtnBorder]}>
                            <MaterialCommunityIcons name="eye-outline" size={16} color={palette.text} />
                          </TouchableOpacity>
                          {booking.reviewIds && booking.reviewIds.length > 0 && (
                            <TouchableOpacity style={[styles.circleBtn, styles.circleBtnBorder]}>
                              <MaterialCommunityIcons name="star-outline" size={16} color={palette.primary} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {cancelledBookings.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                  <Text style={{ color: palette.gray, fontSize: 14 }}>Aucun rendez-vous annulé</Text>
                </View>
              ) : (
                cancelledBookings.map((booking) => {
                  const badge = statusBadge(booking.status);
                  return (
                    <View
                      key={booking.id}
                      style={[
                        styles.card,
                        { backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: '#DC2626' },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                          <View style={[styles.cardIcon, { backgroundColor: '#FEE2E2' }]}>
                            <MaterialCommunityIcons name="close-circle-outline" size={18} color="#DC2626" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{booking.title}</Text>
                            <Text style={styles.cardMeta}>
                              {formatDate(booking.sessionDate)} · {formatTime(booking.sessionDate)}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.status, { backgroundColor: badge.color }]}>
                          <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="dumbbell" size={16} color={palette.gray} />
                        <Text style={styles.detailText}>{booking.trainingType}</Text>
                      </View>

                      {booking.rejectionReason && (
                        <View style={[styles.noteBox]}>
                          <Text style={styles.noteText}>Raison: {booking.rejectionReason}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Rejection Reason Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Raison du refus</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Expliquez pourquoi vous refusez ce rendez-vous..."
              placeholderTextColor={palette.gray}
              multiline
              numberOfLines={4}
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: palette.text }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#DC2626' }]}
                onPress={handleReject}
                disabled={updateLoading || !rejectionReason.trim()}
              >
                {updateLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalBtnText}>Refuser</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Booking Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Créer un rendez-vous</Text>
                <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                  <Ionicons name="close" size={24} color={palette.text} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, { paddingVertical: 10 }]}
                placeholder="Titre du rendez-vous *"
                placeholderTextColor={palette.gray}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
              />

              {/* Date Picker */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: formData.sessionDate ? palette.text : palette.gray }}>
                  {formData.sessionDate ? formData.sessionDate.toLocaleDateString('fr-FR') : 'Date *'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.sessionDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setFormData({...formData, sessionDate: date});
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: palette.text }}>
                  {formData.sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} *
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={formData.sessionDate}
                  mode="time"
                  display="default"
                  onChange={(event, date) => {
                    setShowTimePicker(false);
                    if (date) {
                      setFormData({...formData, sessionDate: date});
                    }
                  }}
                />
              )}

              <TextInput
                style={[styles.input, { paddingVertical: 10 }]}
                placeholder="Service"
                placeholderTextColor={palette.gray}
                value={formData.service}
                onChangeText={(text) => setFormData({...formData, service: text})}
              />

              {/* Éducateur Dropdown */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowEducatorDropdown(!showEducatorDropdown)}
              >
                <Text style={{ color: formData.educatorId ? palette.text : palette.gray }}>
                  {educators.find(e => e.id === formData.educatorId)?.fullName || '-- Sélectionner un éducateur *'}
                </Text>
              </TouchableOpacity>
              {showEducatorDropdown && (
                <View style={[styles.dropdown, { maxHeight: 200 }]}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {educatorsLoading ? (
                      <Text style={styles.dropdownItem}>Chargement...</Text>
                    ) : educators.length > 0 ? (
                      educators.map((edu) => (
                        <TouchableOpacity
                          key={edu.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setFormData({...formData, educatorId: edu.id});
                            setShowEducatorDropdown(false);
                          }}
                        >
                          <Text style={{ color: palette.text }}>
                            {formData.educatorId === edu.id ? '✓ ' : '  '}{edu.fullName}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.dropdownItem}>Aucun éducateur</Text>
                    )}
                  </ScrollView>
                </View>
              )}

              {/* Terrain Dropdown */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowFieldDropdown(!showFieldDropdown)}
              >
                <Text style={{ color: formData.fieldId ? palette.text : palette.gray }}>
                  {fields.find(f => f.id === formData.fieldId)?.name || '-- Sélectionner un terrain *'}
                </Text>
              </TouchableOpacity>
              {showFieldDropdown && (
                <View style={[styles.dropdown, { maxHeight: 200 }]}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {fieldsLoading ? (
                      <Text style={styles.dropdownItem}>Chargement...</Text>
                    ) : fields.length > 0 ? (
                      fields.map((field) => (
                        <TouchableOpacity
                          key={field.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setFormData({...formData, fieldId: field.id});
                            setShowFieldDropdown(false);
                          }}
                        >
                          <Text style={{ color: palette.text }}>
                            {formData.fieldId === field.id ? '✓ ' : '  '}{field.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.dropdownItem}>Aucun terrain</Text>
                    )}
                  </ScrollView>
                </View>
              )}

              <TextInput
                style={[styles.input, { paddingVertical: 10 }]}
                placeholder="Durée (min)"
                placeholderTextColor={palette.gray}
                value={formData.duration.toString()}
                onChangeText={(text) => setFormData({...formData, duration: parseInt(text) || 60})}
                keyboardType="number-pad"
              />

              <TextInput
                style={[styles.input, { paddingVertical: 10 }]}
                placeholder="Prix (€)"
                placeholderTextColor={palette.gray}
                value={formData.price}
                onChangeText={(text) => setFormData({...formData, price: text})}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={[styles.input, { paddingVertical: 10 }]}
                placeholder="Places disponibles"
                placeholderTextColor={palette.gray}
                value={formData.maxParticipants.toString()}
                onChangeText={(text) => setFormData({...formData, maxParticipants: parseInt(text) || 1})}
                keyboardType="number-pad"
              />

              <TextInput
                style={[styles.input, styles.modalInput, { paddingVertical: 8 }]}
                placeholder="Notes"
                placeholderTextColor={palette.gray}
                value={formData.notes}
                onChangeText={(text) => setFormData({...formData, notes: text})}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnSecondary]}
                  onPress={() => setCreateModalVisible(false)}
                >
                  <Text style={[styles.modalBtnText, { color: palette.text }]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: palette.primary }]}
                  onPress={handleCreateBooking}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[styles.modalBtnText, { color: palette.text }]}>Créer le rendez-vous</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modify Home Request Modal */}
      <Modal
        visible={modifyHomeRequestVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModifyHomeRequestVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Modifier la demande</Text>
                <TouchableOpacity onPress={() => setModifyHomeRequestVisible(false)}>
                  <Ionicons name="close" size={24} color={palette.text} />
                </TouchableOpacity>
              </View>

              {/* Date Picker */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: modifyFormData.sessionDate ? palette.text : palette.gray }}>
                  {modifyFormData.sessionDate ? modifyFormData.sessionDate.toLocaleDateString('fr-FR') : 'Date *'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={modifyFormData.sessionDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setModifyFormData({...modifyFormData, sessionDate: date});
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={{ color: palette.text }}>
                  {modifyFormData.sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} *
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={modifyFormData.sessionDate}
                  mode="time"
                  display="default"
                  onChange={(event, date) => {
                    setShowTimePicker(false);
                    if (date) {
                      setModifyFormData({...modifyFormData, sessionDate: date});
                    }
                  }}
                />
              )}

              {/* Éducateur Dropdown */}
              <TouchableOpacity 
                style={[styles.input, { paddingVertical: 10, justifyContent: 'center' }]}
                onPress={() => setShowEducatorDropdown(!showEducatorDropdown)}
              >
                <Text style={{ color: modifyFormData.educatorId ? palette.text : palette.gray }}>
                  {educators.find(e => e.id === modifyFormData.educatorId)?.fullName || '-- Sélectionner un éducateur *'}
                </Text>
              </TouchableOpacity>
              {showEducatorDropdown && (
                <View style={[styles.dropdown, { maxHeight: 200 }]}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {educatorsLoading ? (
                      <Text style={styles.dropdownItem}>Chargement...</Text>
                    ) : educators.length > 0 ? (
                      educators.map((edu) => (
                        <TouchableOpacity
                          key={edu.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setModifyFormData({...modifyFormData, educatorId: edu.id});
                            setShowEducatorDropdown(false);
                          }}
                        >
                          <Text style={{ color: palette.text }}>
                            {modifyFormData.educatorId === edu.id ? '✓ ' : '  '}{edu.fullName}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.dropdownItem}>Aucun éducateur</Text>
                    )}
                  </ScrollView>
                </View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnSecondary]}
                  onPress={() => setModifyHomeRequestVisible(false)}
                >
                  <Text style={[styles.modalBtnText, { color: palette.text }]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: palette.primary }]}
                  onPress={handleModifyHomeRequest}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[styles.modalBtnText, { color: palette.text }]}>Modifier</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Home Requests Page Modal */}
      <Modal
        visible={showHomeRequests}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: palette.border }}>
            <TouchableOpacity onPress={() => setShowHomeRequests(false)}>
              <Ionicons name="chevron-back" size={28} color={palette.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: palette.text, marginLeft: 12, flex: 1 }}>
              Demandes à domicile
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {homeRequests.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Ionicons name="home-outline" size={64} color={palette.border} style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '600', color: palette.text, textAlign: 'center' }}>
                  Aucune demande à domicile
                </Text>
                <Text style={{ fontSize: 14, color: palette.gray, textAlign: 'center', marginTop: 8 }}>
                  Les demandes de clients à domicile apparaîtront ici
                </Text>
              </View>
            ) : (
              homeRequests.map((request) => (
                <View
                  key={request.id}
                  style={[styles.card, { borderLeftWidth: 3, borderLeftColor: palette.primary, marginBottom: 12 }]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <Ionicons name="home" size={18} color={palette.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: palette.text }}>
                          {request.userIds?.[0] ? 'Client' : 'N/A'}
                        </Text>
                        <Text style={{ fontSize: 13, color: palette.gray, marginTop: 2 }}>
                          {request.description || request.title || 'Demande à domicile'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: '#FEF3C7',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#D97706' }}>
                        En attente
                      </Text>
                    </View>
                  </View>

                  {request.dogIds && request.dogIds.length > 0 && (
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 12, color: palette.gray, marginBottom: 4 }}>Chiens:</Text>
                      <Text style={{ fontSize: 13, color: palette.text }}>
                        {request.dogIds.join(', ')}
                      </Text>
                    </View>
                  )}

                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 12, color: palette.gray, marginBottom: 4 }}>Lieu:</Text>
                    <Text style={{ fontSize: 13, color: palette.text }}>
                      {request.description || 'À définir'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: palette.gray, marginBottom: 4 }}>Date</Text>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: palette.text }}>
                        {request.sessionDate ? formatDate(request.sessionDate) : 'À définir'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: palette.gray, marginBottom: 4 }}>Horaire</Text>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: palette.text }}>
                        {request.sessionDate ? formatTime(request.sessionDate) : 'À définir'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: palette.gray, marginBottom: 4 }}>Tarif</Text>
                      <Text style={{ fontSize: 13, fontWeight: '500', color: palette.text }}>
                        {request.totalPrice || request.price}€
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#10B981', flex: 1 }]}
                      onPress={() => handleAcceptHomeRequest(request.id)}
                      disabled={updateLoading}
                    >
                      <Ionicons name="checkmark" size={18} color="#fff" />
                      <Text style={styles.actionBtnText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: palette.primary, flex: 1 }]}
                      onPress={() => openModifyHomeRequestModal(request)}
                      disabled={updateLoading}
                    >
                      <Ionicons name="pencil" size={18} color="#fff" />
                      <Text style={styles.actionBtnText}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.border, flex: 1 }]}
                      onPress={() => handleRefuseHomeRequest(request.id)}
                      disabled={updateLoading}
                    >
                      <Ionicons name="close" size={18} color={palette.text} />
                      <Text style={[styles.actionBtnText, { color: palette.text }]}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal Édition Cours */}
      <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le cours</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            {editingCourse && (
              <ScrollView style={{ maxHeight: 400 }}>
                <Text style={{ fontSize: 13, color: palette.gray, marginBottom: 4 }}>Titre</Text>
                <Text style={[styles.input, { paddingVertical: 10 }]}>{editingCourse.title}</Text>

                <Text style={{ fontSize: 13, color: palette.gray, marginBottom: 4, marginTop: 12 }}>Description</Text>
                <Text style={[styles.input, { paddingVertical: 10 }]}>{editingCourse.description}</Text>

                <Text style={{ fontSize: 13, color: palette.gray, marginBottom: 4, marginTop: 12 }}>Tarif</Text>
                <Text style={[styles.input, { paddingVertical: 10 }]}>{editingCourse.price}€</Text>

                <Text style={{ fontSize: 13, color: palette.gray, marginBottom: 4, marginTop: 12 }}>Durée</Text>
                <Text style={[styles.input, { paddingVertical: 10 }]}>{editingCourse.duration} minutes</Text>

                {editingCourse.maxParticipants > 1 && (
                  <>
                    <Text style={{ fontSize: 13, color: palette.gray, marginBottom: 4, marginTop: 12 }}>Participants max</Text>
                    <Text style={[styles.input, { paddingVertical: 10 }]}>{editingCourse.maxParticipants}</Text>
                  </>
                )}

                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16, marginBottom: 8 }]} onPress={() => setEditModalVisible(false)}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Fermer</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Participants */}
      <Modal visible={participantsModalVisible} transparent animationType="slide" onRequestClose={() => setParticipantsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Participants ({selectedBookingForParticipants?.userIds?.length || 0})</Text>
              <TouchableOpacity onPress={() => setParticipantsModalVisible(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>

            {selectedBookingForParticipants && selectedBookingForParticipants.participantInfo && selectedBookingForParticipants.participantInfo.length > 0 ? (
              <ScrollView style={{ maxHeight: 400 }}>
                {selectedBookingForParticipants.participantInfo.map((participant: any, index: number) => (
                  <View key={participant.userId} style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: palette.border }}>
                    <Text style={{ color: palette.text, fontWeight: '600', fontSize: 14 }}>
                      {index + 1}. {participant.name || 'Participant'}
                    </Text>
                    {participant.email && (
                      <Text style={{ color: palette.gray, fontSize: 12, marginTop: 4 }}>
                        📧 {participant.email}
                      </Text>
                    )}
                    {participant.phone && (
                      <Text style={{ color: palette.gray, fontSize: 12, marginTop: 2 }}>
                        📱 {participant.phone}
                      </Text>
                    )}
                    {participant.dog && (
                      <Text style={{ color: palette.gray, fontSize: 12, marginTop: 2 }}>
                        🐕 {participant.dog}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: palette.gray }}>Aucun participant pour le moment</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]} onPress={() => setParticipantsModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    marginHorizontal: 0,
    marginTop: -8,
    marginBottom: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  primaryBtn: {
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    paddingBottom: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    paddingBottom: 20,
    gap: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: palette.text,
    fontSize: 14,
  },
  modalInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnSecondary: {
    backgroundColor: palette.border,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
