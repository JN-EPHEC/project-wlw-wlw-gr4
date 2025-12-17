import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useFetchClubAllBookings } from '@/hooks/useFetchClubAllBookings';

type Step = 'datetime' | 'info' | 'payment';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  gray: '#6B7280',
  text: '#1F2937',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'booking'>;

export default function BookingScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dogName: '' });
  const [club, setClub] = useState<any>(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Récupérer les bookings du club
  const { bookings, loading: bookingsLoading } = useFetchClubAllBookings(clubId);

  // Récupérer les infos du club
  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubRef = doc(db, 'club', clubId);
        const clubSnap = await getDoc(clubRef);
        if (clubSnap.exists()) {
          setClub(clubSnap.data());
        }
      } catch (err) {
        console.error('Error fetching club:', err);
      } finally {
        setClubLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

  // Générer les dates disponibles à partir des bookings (filtrées: dates futures uniquement)
  const dates = useMemo(() => {
    if (bookings.length === 0) return [];
    
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Début de la journée
    
    const datesSet = new Set<string>();
    bookings.forEach((booking) => {
      const date = booking.sessionDate instanceof Timestamp ? 
        booking.sessionDate.toDate() : 
        new Date(booking.sessionDate);
      
      // Filtrer: ne garder que les dates futures (aujourd'hui et après)
      if (date >= now) {
        const dateStr = date.toISOString().split('T')[0];
        datesSet.add(dateStr);
      }
    });
    
    return Array.from(datesSet)
      .sort()
      .map((dateStr) => {
        const date = new Date(dateStr);
        const label = date.toLocaleDateString('fr-FR', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        return { label, value: dateStr };
      });
  }, [bookings]);

  // Générer les créneaux disponibles pour la date sélectionnée
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return bookings
      .filter((booking) => {
        const date = booking.sessionDate instanceof Timestamp ? 
          booking.sessionDate.toDate() : 
          new Date(booking.sessionDate);
        return date.toISOString().split('T')[0] === selectedDate;
      })
      .map((booking) => {
        const date = booking.sessionDate instanceof Timestamp ? 
          booking.sessionDate.toDate() : 
          new Date(booking.sessionDate);
        const time = date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          date: selectedDate,
          time,
          price: booking.price,
          duration: booking.duration,
          bookingId: booking.id,
        };
      });
  }, [selectedDate, bookings]);

  const canGoInfo = selectedDate !== '' && selectedTime !== '';
  const canGoPayment =
    formData.name.trim() && formData.email.trim() && formData.phone.trim() && formData.dogName.trim();

  // Fonction pour continuer depuis l'étape info
  const handleContinueFromInfo = async () => {
    if (!canGoPayment) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      // Continuer vers le paiement
      setStep('payment');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur';
      Alert.alert('Erreur', errorMsg);
      console.error('Error joining club:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    console.log('🔵 [handleConfirmBooking] Called');
    console.log('👤 User ID:', user?.uid);
    console.log('📚 Selected Booking ID:', selectedBookingId);
    
    if (!user?.uid || !selectedBookingId) {
      console.error('❌ Missing user or bookingId', { userId: user?.uid, bookingId: selectedBookingId });
      Alert.alert('Erreur', 'Impossible de confirmer la réservation');
      return;
    }

    setIsSubmitting(true);
    try {
      // Récupérer le booking
      const bookingRef = doc(db, 'Bookings', selectedBookingId);
      console.log('📖 Fetching booking from:', bookingRef.path);
      
      const bookingSnap = await getDoc(bookingRef);
      console.log('📖 Booking exists:', bookingSnap.exists());
      
      if (!bookingSnap.exists()) {
        console.error('❌ Booking does not exist:', selectedBookingId);
        Alert.alert('Erreur', 'Le cours n\'existe plus');
        setIsSubmitting(false);
        return;
      }

      const bookingData = bookingSnap.data();
      console.log('📖 Booking data:', bookingData);
      
      const currentUserIds = bookingData.userIds || [];
      const currentParticipantInfo = bookingData.participantInfo || [];
      console.log('👥 Current userIds:', currentUserIds);
      
      // Vérifier si l'utilisateur est déjà inscrit
      if (currentUserIds.includes(user.uid)) {
        console.warn('⚠️ User already registered');
        Alert.alert('Erreur', 'Vous êtes déjà inscrit à ce cours');
        setIsSubmitting(false);
        return;
      }

      // Créer l'info du participant à sauvegarder
      const participantInfo = {
        userId: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dog: formData.dogName.trim(),
      };

      // Ajouter l'utilisateur à userIds ET à participantInfo
      console.log('✏️ Updating booking with userId:', user.uid);
      console.log('✏️ Participant info:', participantInfo);
      await updateDoc(bookingRef, {
        userIds: arrayUnion(user.uid),
        participantInfo: arrayUnion(participantInfo),
        confirmedAt: Timestamp.now(),
      });

      console.log('✅ User added to booking:', user.uid, 'Booking:', selectedBookingId);
      
      // Afficher confirmation et revenir
      Alert.alert(
        '✅ Réservation confirmée',
        `Votre rendez-vous pour "${bookingData.title}" a été confirmé ! Un email vous sera envoyé.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Revenir à la page précédente
              navigation.goBack();
            },
          },
        ]
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la confirmation';
      console.error('❌ Error confirming booking:', err);
      Alert.alert('Erreur', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clubData = club || { name: 'Club', address: 'Adresse' };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Réserver une séance</Text>
          <Text style={styles.headerSub}>{clubData?.name || 'Club'}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.steps}>
        {[
          { id: 'datetime', label: 'Date & heure', index: 1 },
          { id: 'info', label: 'Infos', index: 2 },
          { id: 'payment', label: 'Paiement', index: 3 },
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <View style={styles.stepConnector} />}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, step === s.id ? styles.stepActive : styles.stepInactive]}>
                <Text style={step === s.id ? styles.stepActiveText : styles.stepInactiveText}>{s.index}</Text>
              </View>
              <Text style={step === s.id ? styles.stepLabelActive : styles.stepLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {bookingsLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={[styles.label, { marginTop: 16 }]}>Chargement des créneaux...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <Text style={[styles.label, { textAlign: 'center' }]}>Pas de créneaux disponibles pour le moment</Text>
          </View>
        ) : step === 'datetime' ? (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={styles.title}>Choisissez une date</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                {dates.map((d) => (
                  <TouchableOpacity
                    key={d.value}
                    style={[styles.card, selectedDate === d.value && styles.cardSelected]}
                    onPress={() => {
                      setSelectedDate(d.value);
                      setSelectedTime('');
                      setSelectedBookingId('');
                    }}
                  >
                    <View style={styles.row}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={selectedDate === d.value ? palette.primary : palette.gray}
                      />
                      <Text style={selectedDate === d.value ? styles.value : styles.label}>{d.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedDate ? (
              <View>
                <Text style={styles.title}>Choisissez un horaire</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                  {slots.map((s, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.slot, selectedTime === s.time && styles.slotActive]}
                        onPress={() => {
                          setSelectedTime(s.time);
                          setSelectedBookingId(s.bookingId);
                        }}
                      >
                        <Text style={selectedTime === s.time ? styles.slotTextActive : styles.slotText}>{s.time}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {step === 'info' ? (
          <View style={{ gap: 16 }}>
            <Text style={styles.title}>Vos informations</Text>
            <InputField label="Votre nom" value={formData.name} onChangeText={(t) => setFormData({ ...formData, name: t })} placeholder="Nom complet" />
            <InputField label="Email" value={formData.email} onChangeText={(t) => setFormData({ ...formData, email: t })} placeholder="votre@email.com" keyboardType="email-address" />
            <InputField label="Téléphone" value={formData.phone} onChangeText={(t) => setFormData({ ...formData, phone: t })} placeholder="+33 6 00 00 00 00" keyboardType="phone-pad" />
            <InputField label="Nom de votre chien" value={formData.dogName} onChangeText={(t) => setFormData({ ...formData, dogName: t })} placeholder="Max" />
          </View>
        ) : null}

        {step === 'payment' ? (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={styles.title}>Récapitulatif</Text>
              <View style={[styles.card, { backgroundColor: '#ECFEFF' }]}>
                <RowLabel label="Date" value={dates.find((d) => d.value === selectedDate)?.label || ''} />
                <RowLabel label="Heure" value={selectedTime} />
                <View style={styles.divider} />
                <RowLabel label="Total" value="45 €" emphasize />
              </View>
            </View>

            <View>
              <Text style={styles.title}>Informations de paiement</Text>
              <InputField label="Numéro de carte" placeholder="1234 5678 9012 3456" icon="card-outline" />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <InputField label="Expiration" placeholder="MM/AA" style={{ flex: 1 }} />
                <InputField label="CVV" placeholder="123" style={{ flex: 1 }} />
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.subText, { color: '#1D4ED8' }]}>Paiement sécurisé. Vos informations sont protégées.</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        {step === 'datetime' ? (
          <TouchableOpacity
            style={[styles.primaryButton, !canGoInfo && styles.primaryDisabled]}
            onPress={() => canGoInfo && setStep('info')}
            disabled={!canGoInfo}
          >
            <Text style={styles.primaryButtonText}>Continuer</Text>
          </TouchableOpacity>
        ) : null}
        {step === 'info' ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.outlineButton, { flex: 1 }]} onPress={() => setStep('datetime')}>
              <Text style={styles.outlineButtonText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1 }, (!canGoPayment || isSubmitting) && styles.primaryDisabled]}
              onPress={handleContinueFromInfo}
              disabled={!canGoPayment || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Continuer</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
        {step === 'payment' ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.outlineButton, { flex: 1 }]} onPress={() => setStep('info')}>
              <Text style={styles.outlineButtonText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.primaryButton, { flex: 1 }, isSubmitting && styles.primaryDisabled]} 
              onPress={handleConfirmBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Confirmer la réservation</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  icon,
  style,
}: {
  label: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: object;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        {icon ? <Ionicons name={icon} size={18} color={palette.gray} style={{ marginRight: 8 }} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          style={{ flex: 1, color: palette.text }}
        />
      </View>
    </View>
  );
}

function RowLabel({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={[styles.subText, { color: '#4B5563' }]}>{label}</Text>
      <Text style={[styles.value, emphasize && { color: palette.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    marginTop: 2,
    marginBottom: 2,
    gap: 8,
  },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepConnector: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: palette.primary },
  stepInactive: { backgroundColor: '#E5E7EB' },
  stepActiveText: { color: '#fff', fontWeight: '700' },
  stepInactiveText: { color: '#4B5563', fontWeight: '700' },
  stepLabel: { color: '#6B7280', fontSize: 13 },
  stepLabelActive: { color: palette.primary, fontSize: 13, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 120, gap: 14 },
  title: { color: palette.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  label: { color: '#6B7280', fontSize: 13 },
  value: { color: palette.text, fontSize: 14, fontWeight: '700' },
  helper: { color: '#9CA3AF', fontSize: 12 },
  subText: { color: palette.gray, fontSize: 13, lineHeight: 18 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  cardSelected: { borderColor: palette.primary, backgroundColor: '#E0F2F1' },
  row: { flexDirection: 'row', alignItems: 'center' },
  slot: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  slotActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  slotText: { color: palette.text, fontWeight: '600' },
  slotTextActive: { color: '#fff', fontWeight: '700' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 6 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  primaryDisabled: { opacity: 0.5 },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { color: palette.text, fontWeight: '700' },
  confirmIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
});
