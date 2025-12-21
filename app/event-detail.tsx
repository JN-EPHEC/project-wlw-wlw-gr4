import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';

const palette = {
    primary: '#41B6A6',
    text: '#1F2937',
    gray: '#6B7280',
    border: '#E5E7EB',
};

interface EventData {
  id: string;
  title?: string;
  name?: string;
  description: string;
  startDate?: string | any; // Can be Firestore Timestamp
  endDate?: string | any; // Can be Firestore Timestamp
  startTime?: string;
  endTime?: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  distance?: number;
  PhotoUrl?: string;
  headerImage?: string;
  clubId: string;
  price?: number;
  priceParticipant?: number;
  priceSpectator?: number;
  currency?: string;
  dogSlots?: number;
  spectatorSlots?: number;
  registeredDogs?: number;
  registeredSpectators?: number;
  requirements?: string[];
  amenities?: string[];
  photos?: string[];
  program?: Array<{ time: string; activity: string }>;
  organizer?: {
    name: string;
    verified?: boolean;
    rating?: number;
    logo?: string;
  };
  category?: string;
  level?: string;
  ageMin?: string;
  [key: string]: any;
}

type Props = NativeStackScreenProps<UserStackParamList, 'eventDetail'>;

export default function EventDetailScreen({ navigation, route }: Props) {
  const { eventId, clubId } = route.params;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
  }, []); // Only set loading once on mount

  useFocusEffect(
    React.useCallback(() => {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          console.log('🔍 [event-detail] Fetching event with ID:', eventId);
          const eventRef = doc(db, 'events', eventId);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            console.log('✅ [event-detail] Event found:', eventSnap.data());
            setEvent({ id: eventSnap.id, ...eventSnap.data() } as EventData);
            setError(null);
          } else {
            console.log('❌ [event-detail] Event NOT found with ID:', eventId);
            setError('Événement non trouvé');
          }
        } catch (err) {
          console.error('❌ [event-detail] Error fetching event:', err);
          setError('Erreur lors du chargement de l\'événement');
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }, [eventId])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, textAlign: 'center' }}>
            {error || 'Événement non trouvé'}
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

  const eventTitle = event.title || event.name || 'Événement';
  const registeredCount = event.participantData ? event.participantData.length : 0;
  const spotsRemaining = (event.dogSlots || 0) - registeredCount;

  // Helper to convert Firestore Timestamp to formatted date string
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // If it's already a string, return it
    if (typeof dateValue === 'string') return dateValue;
    
    // If it's a Firestore Timestamp object with seconds property
    if (dateValue.seconds) {
      const date = new Date(dateValue.seconds * 1000);
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    }
    
    // If it's a Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    }
    
    return '';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image 
            source={{ uri: event.PhotoUrl || event.headerImage || 'https://via.placeholder.com/400x220?text=Event' }}
            style={styles.heroImage} 
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{eventTitle}</Text>
            {(event.date || event.startDate) && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="calendar-outline" size={14} color="#fff" />
                <Text style={styles.heroMeta}>{formatDate(event.date || event.startDate)}</Text>
              </View>
            )}
            {event.address && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="location-outline" size={14} color="#fff" />
                <Text style={styles.heroMeta}>{event.address}</Text>
              </View>
            )}
          </View>
        </View>

        {event.organizer && (
          <View style={styles.section}>
            <Text style={styles.title}>Organisé par</Text>
            <View style={styles.organizer}>
              {event.organizer.logo && <Image source={{ uri: event.organizer.logo }} style={styles.organizerLogo} />}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.listTitle}>{event.organizer.name}</Text>
                  {event.organizer.verified && (
                    <MaterialCommunityIcons name="check-decagram" size={16} color={palette.primary} />
                  )}
                </View>
                {event.organizer.rating && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
                    <Text style={styles.sub}>{event.organizer.rating}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Participants section - like the Figma design */}
        <View style={styles.section}>
          <Text style={styles.title}>Participants</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="paw" size={20} color={palette.primary} />
                <View>
                  <Text style={styles.sub}>Inscrits</Text>
                  <Text style={styles.spots}>{registeredCount} / {event.dogSlots || 0}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.sub}>Places restantes</Text>
                <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 16 }}>{registeredCount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* À propos section */}
        <View style={styles.section}>
          <Text style={styles.title}>À propos de l\'événement</Text>
          {event.description ? (
            <Text style={styles.sub}>{event.description}</Text>
          ) : (
            <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Aucune information</Text>
          )}
        </View>

        {/* Détails section with all info in one place */}
        <View style={styles.section}>
          <Text style={styles.title}>Détails</Text>
          <View style={styles.detailsColumn}>
            {event.level ? (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="chart-line" size={18} color={palette.primary} />
                <View>
                  <Text style={styles.detailLabel}>Niveau</Text>
                  <Text style={styles.sub}>{event.level}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="chart-line" size={18} color={palette.primary} />
                <View>
                  <Text style={styles.detailLabel}>Niveau</Text>
                  <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Non renseigné</Text>
                </View>
              </View>
            )}
            {event.ageMin ? (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="dog" size={18} color={palette.primary} />
                <View>
                  <Text style={styles.detailLabel}>Âge minimum</Text>
                  <Text style={styles.sub}>{event.ageMin}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="dog" size={18} color={palette.primary} />
                <View>
                  <Text style={styles.detailLabel}>Âge minimum</Text>
                  <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Non renseigné</Text>
                </View>
              </View>
            )}
            {event.address ? (
              <View style={styles.detailRow}>
                <Ionicons name="pin-outline" size={18} color={palette.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Lieu</Text>
                  <Text style={styles.sub}>{event.address}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.detailRow}>
                <Ionicons name="pin-outline" size={18} color={palette.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Lieu</Text>
                  <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Non renseigné</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Tarifs section - with participant and spectator prices */}
        <View style={styles.section}>
          <Text style={styles.title}>Tarifs</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.sub}>Participant</Text>
              <Text style={styles.price}>{event.priceParticipant || event.price || 0}{event.currency || '€'}</Text>
            </View>
            {event.priceSpectator !== undefined && (
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.sub}>Spectateur</Text>
                <Text style={styles.price}>{event.priceSpectator}{event.currency || '€'}</Text>
              </View>
            )}
          </View>
        </View>

        {event.program && event.program.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.title}>Programme de la journée</Text>
            {event.program.map((p: any, idx: number) => (
              <View key={idx} style={styles.programRow}>
                <View style={styles.timeCircle}>
                  <Text style={styles.timeText}>{p.time}</Text>
                </View>
                <Text style={styles.sub}>{p.activity}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.title}>Programme de la journée</Text>
            <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Aucune information</Text>
          </View>
        )}

        {event.requirements && event.requirements.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.title}>Prérequis</Text>
            {event.requirements.map((r: string, idx: number) => (
              <View key={idx} style={styles.requirementRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={palette.primary} />
                <Text style={styles.sub}>{r}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.title}>Prérequis</Text>
            <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Aucune information</Text>
          </View>
        )}

        {event.amenities && event.amenities.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.title}>Ce qui est inclus</Text>
            <View style={styles.amenitiesGrid}>
              {event.amenities.map((a: string) => (
                <View key={a} style={styles.amenityItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color={palette.primary} />
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.title}>Ce qui est inclus</Text>
            <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Aucune information</Text>
          </View>
        )}

        {event.photos && event.photos.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.title}>Galerie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {event.photos.map((p: string, idx: number) => (
                <Image key={idx} source={{ uri: p }} style={styles.photo} />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.title}>Galerie</Text>
            <Text style={[styles.sub, { fontStyle: 'italic', color: '#9CA3AF' }]}>Aucune photo</Text>
          </View>
        )}

        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sub}>Places restantes</Text>
            <Text style={styles.spots}>{registeredCount} / {event.dogSlots || 0}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('eventBooking', { eventId })}>
            <Text style={styles.primaryBtnText}>S\'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{value}</Text>
    </View>
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
    heroContent: { position: 'absolute', left: 16, right: 16, bottom: 12, gap: 6 },
    heroTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    heroMeta: { color: '#E5E7EB', fontSize: 13 },
    section: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 6 },
    title: { color: palette.text, fontSize: 18, fontWeight: '700' },
    sub: { color: palette.gray, fontSize: 14 },
    detailsColumn: { gap: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: palette.border },
    detailLabel: { color: palette.text, fontWeight: '600', fontSize: 13 },
    organizer: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    organizerLogo: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#E5E7EB' },
    listTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
    linkBtn: {
      borderWidth: 1,
      borderColor: palette.primary,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
    },
    linkBtnText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    badge: {
      backgroundColor: '#E0F2F1',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    badgeLabel: { color: palette.gray, fontSize: 11, fontWeight: '600' },
    badgeValue: { color: palette.primary, fontWeight: '700', fontSize: 12 },
    card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 8,
    },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
    price: { color: palette.primary, fontWeight: '700', fontSize: 15 },
    divider: { height: 1, backgroundColor: palette.border },
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
    listTime: { color: palette.text, fontWeight: '700', width: 60 },
    bullet: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    programRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 8 },
    timeCircle: { 
      backgroundColor: palette.primary, 
      borderRadius: 20, 
      padding: 8, 
      minWidth: 50, 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    timeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    requirementRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
    amenitiesGrid: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 10 
    },
    amenityItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 10,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.border
    },
    amenityText: { color: palette.text, fontWeight: '600', fontSize: 14, flex: 1 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: '#E0F2F1',
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
    photo: { width: 180, height: 120, borderRadius: 12, backgroundColor: '#E5E7EB' },
    bottomBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
    spots: { color: palette.text, fontWeight: '700', fontSize: 16 },
    primaryBtn: {
      flex: 1,
      backgroundColor: palette.primary,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    primaryBtnText: { color: '#fff', fontWeight: '700' },
});
