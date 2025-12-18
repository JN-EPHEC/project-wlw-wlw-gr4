import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { UserStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useFetchClubEducatorsForForm } from '@/hooks/useFetchClubEducatorsForForm';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const trainingTypes = [
  { label: 'Obéissance', value: 'obedience' },
  { label: 'Agilité', value: 'agility' },
  { label: 'Dressage', value: 'training' },
  { label: 'Comportement', value: 'behavior' },
  { label: 'Autres', value: 'other' },
];

type Props = NativeStackScreenProps<UserStackParamList, 'homeTrainingBooking'>;

export default function HomeTrainingBookingScreen({ navigation, route }: Props) {
  const { clubId } = route.params as { clubId: string };
  const { user, profile } = useAuth();
  const { createBooking, loading: createLoading } = useCreateBooking();
  const { educators } = useFetchClubEducatorsForForm(clubId);

  const [sessionDate, setSessionDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEducatorDropdown, setShowEducatorDropdown] = useState(false);
  const [showTrainingTypeDropdown, setShowTrainingTypeDropdown] = useState(false);

  const [form, setForm] = useState({
    address: '',
    city: '',
    details: '',
    dog: '',
    phone: '',
    trainingType: '',
    educatorId: '',
  });

  const selectedTrainingType = trainingTypes.find(t => t.value === form.trainingType);
  const selectedEducator = educators.find(e => e.id === form.educatorId);

  const canSubmit = sessionDate && form.address && form.city && form.dog && form.phone && form.trainingType && form.educatorId;

  const handleDateChange = (event: any, date?: Date) => {
    if (date) setSessionDate(date);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) setSessionDate(date);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    try {
      if (!user?.uid) {
        Alert.alert('Erreur', 'Vous devez être connecté');
        return;
      }

      await createBooking({
        clubId,
        userIds: [user.uid],
        dogIds: [form.dog],
        sessionDate,
        description: form.address + ', ' + form.city,
        title: selectedTrainingType?.label || 'Demande à domicile',
        trainingType: form.trainingType,
        educatorId: form.educatorId,
        duration: 60,
        price: 0,
        maxParticipants: 1,
        type: 'home-based',
        createdBy: 'user',
        status: 'pending',
        isGroupCourse: false,
      });

      Alert.alert('Succès', 'Votre demande a été envoyée au club', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la demande');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Demander une séance à domicile</Text>
          <Text style={styles.headerSub}>Educateur se déplace chez vous</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>        {/* Type de cours */}
        <View>
          <Text style={styles.title}>Type de cours</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTrainingTypeDropdown(true)}
          >
            <Text style={selectedTrainingType ? styles.value : styles.placeholder}>
              {selectedTrainingType?.label || 'Sélectionner un type'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={palette.gray} />
          </TouchableOpacity>
        </View>

        {/* Éducateur */}
        <View>
          <Text style={styles.title}>Éducateur</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEducatorDropdown(true)}
          >
            <Text style={selectedEducator ? styles.value : styles.placeholder}>
              {selectedEducator ? `${selectedEducator.firstName} ${selectedEducator.lastName}` : 'Sélectionner un éducateur'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={palette.gray} />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View>
          <Text style={styles.title}>Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.value}>
              {sessionDate.toLocaleDateString('fr-FR')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={palette.primary} />
          </TouchableOpacity>
        </View>

        {/* Heure */}
        <View>
          <Text style={styles.title}>Heure</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.value}>
              {sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Ionicons name="time-outline" size={20} color={palette.primary} />
          </TouchableOpacity>
        </View>

        {/* Adresse */}
        <View>
          <Text style={styles.title}>Adresse</Text>
          <Input label="Adresse" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} placeholder="12 rue de la Paix" />
        </View>

        {/* Ville */}
        <View>
          <Text style={styles.title}>Ville</Text>
          <Input label="Ville" value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} placeholder="Paris" />
        </View>

        {/* Téléphone */}
        <View>
          <Text style={styles.title}>Téléphone</Text>
          <Input
            label="Téléphone"
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
            placeholder="+33 6 00 00 00 00"
            keyboardType="phone-pad"
          />
        </View>

        {/* Nom du chien */}
        <View>
          <Text style={styles.title}>Nom du chien</Text>
          <Input label="Nom du chien" value={form.dog} onChangeText={(t) => setForm({ ...form, dog: t })} placeholder="Nala" />
        </View>

        {/* Infos complémentaires */}
        <View>
          <Text style={styles.title}>Infos complémentaires</Text>
          <Input
            label="Infos complémentaires"
            value={form.details}
            onChangeText={(t) => setForm({ ...form, details: t })}
            placeholder="Digicode, tempérament du chien, etc."
            multiline
            height={90}
          />
        </View>

        <TouchableOpacity
          style={[styles.primary, !canSubmit && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!canSubmit || createLoading}
        >
          {createLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Envoyer la demande</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={sessionDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={sessionDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Training Type Dropdown Modal */}
      <Modal
        visible={showTrainingTypeDropdown}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowTrainingTypeDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              {trainingTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setForm({ ...form, trainingType: type.value });
                    setShowTrainingTypeDropdown(false);
                  }}
                >
                  <Text style={form.trainingType === type.value ? styles.dropdownItemSelected : styles.dropdownItemText}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Educator Dropdown Modal */}
      <Modal
        visible={showEducatorDropdown}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowEducatorDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              {educators.length === 0 ? (
                <Text style={styles.dropdownItemText}>Aucun éducateur disponible</Text>
              ) : (
                educators.map((educator) => (
                  <TouchableOpacity
                    key={educator.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setForm({ ...form, educatorId: educator.id });
                      setShowEducatorDropdown(false);
                    }}
                  >
                    <Text style={form.educatorId === educator.id ? styles.dropdownItemSelected : styles.dropdownItemText}>
                      {educator.firstName} {educator.lastName}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  height,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  height?: number;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[ 
          styles.input,
          multiline && { height: height || 100, textAlignVertical: 'top' },
        ]}
      />
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
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  title: { color: palette.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  label: { color: '#6B7280', fontSize: 13 },
  value: { color: palette.text, fontSize: 14, fontWeight: '600', flex: 1 },
  placeholder: { color: palette.gray, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: palette.text,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardSelected: { borderColor: palette.primary, backgroundColor: '#E0F2F1' },
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
  primary: {
    marginTop: 16,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: 300,
    overflow: 'hidden',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  dropdownItemText: {
    color: palette.text,
    fontSize: 14,
  },
  dropdownItemSelected: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});