import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const dates = [
  { label: 'Mer 27 Oct', value: '2025-10-27' },
  { label: 'Jeu 28 Oct', value: '2025-10-28' },
];

const slots = [
  { date: '2025-10-27', time: '09:00' },
  { date: '2025-10-27', time: '11:00' },
  { date: '2025-10-28', time: '15:00' },
];

type Props = NativeStackScreenProps<UserStackParamList, 'homeTrainingBooking'>;

export default function HomeTrainingBookingScreen({ navigation }: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({
    address: '',
    city: '',
    details: '',
    dog: '',
    phone: '',
  });

  const canSubmit = selectedDate && selectedTime && form.address && form.city && form.dog && form.phone;

  const handleSubmit = () => {
    navigation.navigate('home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('home')} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Demander une séance à domicile</Text>
          <Text style={styles.headerSub}>Educateur se déplace chez vous</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Date et horaire</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          {dates.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[styles.card, selectedDate === d.value && styles.cardSelected]}
              onPress={() => {
                setSelectedDate(d.value);
                setSelectedTime('');
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
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

        {selectedDate ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.title}>Horaire</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              {slots
                .filter((s) => s.date === selectedDate)
                .map((s) => (
                  <TouchableOpacity
                    key={s.time}
                    style={[styles.slot, selectedTime === s.time && styles.slotActive]}
                    onPress={() => setSelectedTime(s.time)}
                  >
                    <Text style={selectedTime === s.time ? styles.slotTextActive : styles.slotText}>{s.time}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.title}>Adresse</Text>
        <Input label="Adresse" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} placeholder="12 rue de la Paix" />
        <Input label="Ville" value={form.city} onChangeText={(t) => setForm({ ...form, city: t })} placeholder="Paris" />
        <Input
          label="Téléphone"
          value={form.phone}
          onChangeText={(t) => setForm({ ...form, phone: t })}
          placeholder="+33 6 00 00 00 00"
          keyboardType="phone-pad"
        />
        <Input label="Nom du chien" value={form.dog} onChangeText={(t) => setForm({ ...form, dog: t })} placeholder="Nala" />
        <Input
          label="Infos complémentaires"
          value={form.details}
          onChangeText={(t) => setForm({ ...form, details: t })}
          placeholder="Digicode, tempérament du chien, etc."
          multiline
          height={90}
        />

        <TouchableOpacity
          style={[styles.primary, !canSubmit && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.primaryText}>Envoyer la demande</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  title: { color: palette.text, fontSize: 16, fontWeight: '700', marginTop: 4 },
  label: { color: '#6B7280', fontSize: 13 },
  value: { color: palette.text, fontSize: 14, fontWeight: '700' },
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
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: palette.text,
    backgroundColor: '#F9FAFB',
  },
  primary: {
    marginTop: 8,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
