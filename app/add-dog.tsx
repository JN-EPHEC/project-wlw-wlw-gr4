import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Timestamp } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';
import { useDogs } from '@/hooks/useDogs';
import { useDogDocuments, DogDocument } from '@/hooks/useDogDocuments';

const palette = {
    primary: '#41B6A6',
    text: '#1F2937',
    gray: '#6B7280',
    border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'addDog'>;

export default function AddDogScreen({ navigation }: Props) {
  const { addDog, loading: dbLoading, error: dbError } = useDogs();
  const { uploadDocument, addDocumentToDog, loading: docLoading } = useDogDocuments();
  
  const [form, setForm] = useState({
    name: '',
    breed: '',
    birthDate: '', // Timestamp en millisecondes ou Timestamp Firebase
    gender: '',
    weight: '',
    otherInfo: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [vaccineDocument, setVaccineDocument] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = form.name && form.breed && !saving && !dbLoading && !docLoading;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPhoto(asset.uri);
        setPhotoFile({
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
        });
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const pickVaccineDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setVaccineDocument({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
        });
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner un document');
    }
  };

  const removeVaccineDocument = () => {
    setVaccineDocument(null);
  };

  const formatDateForDisplay = (timestamp: string | number): string => {
    if (!timestamp) return '';
    try {
      let date: Date;
      if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'string' && !isNaN(Number(timestamp))) {
        // String numérique (comme '1734000000000')
        date = new Date(parseInt(timestamp, 10));
      } else {
        date = new Date(timestamp);
      }
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Créer le chien d'abord
      const dogId = await addDog(
        {
          name: form.name,
          breed: form.breed,
          birthDate: form.birthDate || undefined, // Timestamp en millisecondes
          gender: form.gender || undefined,
          weight: form.weight || undefined,
          otherInfo: form.otherInfo || undefined,
          ownerId: '', // Sera défini par le hook
        },
        photoFile || undefined
      );

      // Uploader le document de vaccination si présent
      if (vaccineDocument && dogId) {
        const uploadedDoc = await uploadDocument(
          dogId,
          vaccineDocument.uri,
          vaccineDocument.name,
          vaccineDocument.type
        );

        if (uploadedDoc) {
          // Ajouter le document au chien
          await addDocumentToDog(dogId, uploadedDoc);
        }
      }

      Alert.alert('Succès', 'Chien ajouté avec succès');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de l\'ajout du chien');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} disabled={saving}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajouter un chien</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {dbError && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{dbError}</Text>
          </View>
        )}

        <View style={styles.photoCard}>
          <View style={styles.photoCircle}>
            {photo ? (
              <Image source={{uri: photo}} style={styles.photo} />
            ) : (
              <MaterialCommunityIcons name="paw" size={36} color={palette.gray} />
            )}
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={pickImage} disabled={saving}>
            <Ionicons name="camera-outline" size={16} color={palette.primary} />
            <Text style={styles.outlineText}>{photo ? 'Changer la photo' : 'Ajouter une photo'}</Text>
          </TouchableOpacity>
        </View>

        <Input label="Nom" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nala" editable={!saving} />
        <Input label="Race" value={form.breed} onChangeText={(t) => setForm({ ...form, breed: t })} placeholder="Border Collie" editable={!saving} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Date de naissance</Text>
            <TouchableOpacity
              style={[styles.dateButton, saving && { opacity: 0.5 }]}
              onPress={() => setShowDatePicker(true)}
              disabled={saving}
            >
              <Ionicons name="calendar-outline" size={18} color={palette.primary} />
              <Text style={styles.dateButtonText}>
                {formatDateForDisplay(form.birthDate) || 'Sélectionner une date'}
              </Text>
            </TouchableOpacity>
          </View>
          <Input
            style={{ width: 110 }}
            label="Poids (kg)"
            value={form.weight}
            onChangeText={(t) => setForm({ ...form, weight: t })}
            placeholder="16"
            keyboardType="numeric"
            editable={!saving}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Genre</Text>
          <TouchableOpacity
            style={[styles.genderButton, saving && { opacity: 0.6 }]}
            onPress={() => !saving && setShowGenderPicker(true)}
            disabled={saving}
          >
            <Text style={[styles.genderButtonText, !form.gender && { color: palette.gray }]}>
              {form.gender || 'Sélectionner le genre'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={palette.primary} />
          </TouchableOpacity>
        </View>

        {/* Gender Picker Modal */}
        <Modal visible={showGenderPicker} transparent={true} animationType="slide">
          <View style={styles.genderPickerOverlay}>
            <View style={styles.genderPickerContainer}>
              <View style={styles.genderPickerHeader}>
                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                  <Text style={styles.genderPickerHeaderText}>Annuler</Text>
                </TouchableOpacity>
                <Text style={styles.genderPickerTitle}>Genre du chien</Text>
                <View style={{ width: 60 }} />
              </View>
              <View style={styles.genderPickerContent}>
                {['Mâle', 'Femelle'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.genderOption, form.gender === option && styles.genderOptionSelected]}
                    onPress={() => {
                      setForm({ ...form, gender: option });
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text style={[styles.genderOptionText, form.gender === option && styles.genderOptionTextSelected]}>
                      {option}
                    </Text>
                    {form.gender === option && (
                      <Ionicons name="checkmark-circle" size={24} color={palette.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
        <Input
          label="Notes / santé / caractère"
          value={form.otherInfo}
          onChangeText={(t) => setForm({ ...form, otherInfo: t })}
          placeholder="Allergies, comportement, etc."
          multiline
          height={110}
          editable={!saving}
        />

        <View style={styles.divider} />

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={palette.primary} />
            <Text style={styles.sectionTitle}>Certificat de vaccination</Text>
          </View>

          {vaccineDocument && (
            <View style={styles.documentItem}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.documentName} numberOfLines={1}>{vaccineDocument.name}</Text>
                <Text style={styles.documentType}>{vaccineDocument.type.split('/')[0]}</Text>
              </View>
              <TouchableOpacity onPress={removeVaccineDocument} disabled={saving}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.documentBtn} onPress={pickVaccineDocument} disabled={saving}>
            <Ionicons name="add-circle-outline" size={18} color={palette.primary} />
            <Text style={styles.documentBtnText}>
              {vaccineDocument ? 'Changer le document' : 'Ajouter un document'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>PDF ou images (certificat de vaccination)</Text>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>Le certificat de vaccination sera visible sur le profil du chien.</Text>
        </View>
      </ScrollView>

      {/* Modal Date Picker */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerHeaderText}>Annuler</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>Date de naissance</Text>
              <TouchableOpacity onPress={() => {
                setForm({ ...form, birthDate: selectedDate.getTime().toString() });
                setShowDatePicker(false);
              }}>
                <Text style={[styles.datePickerHeaderText, { color: palette.primary, fontWeight: '700' }]}>OK</Text>
              </TouchableOpacity>
            </View>
            <DatePickerSimple
              date={selectedDate}
              onDateChange={setSelectedDate}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primary, !canSave && { opacity: 0.5 }]}
          disabled={!canSave}
          onPress={handleSave}
        >
          {saving || docLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Composant simple Date Picker
function DatePickerSimple({ date, onDateChange }: { date: Date; onDateChange: (d: Date) => void }) {
  const [tempDate, setTempDate] = useState(date);
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (year: number, month: number, day: number) => {
    const newDate = new Date(year, month, day);
    setTempDate(newDate);
    onDateChange(newDate);
  };

  return (
    <View style={styles.datePickerContent}>
      <View style={styles.datePickerColumn}>
        <Text style={styles.datePickerLabel}>Jour</Text>
        <ScrollView>
          {days.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.datePickerOption, tempDate.getDate() === d && styles.datePickerOptionSelected]}
              onPress={() => handleChange(tempDate.getFullYear(), tempDate.getMonth(), d)}
            >
              <Text style={[styles.datePickerOptionText, tempDate.getDate() === d && styles.datePickerOptionTextSelected]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.datePickerColumn}>
        <Text style={styles.datePickerLabel}>Mois</Text>
        <ScrollView>
          {months.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.datePickerOption, tempDate.getMonth() === i && styles.datePickerOptionSelected]}
              onPress={() => handleChange(tempDate.getFullYear(), i, tempDate.getDate())}
            >
              <Text style={[styles.datePickerOptionText, tempDate.getMonth() === i && styles.datePickerOptionTextSelected]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.datePickerColumn}>
        <Text style={styles.datePickerLabel}>Année</Text>
        <ScrollView>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.datePickerOption, tempDate.getFullYear() === y && styles.datePickerOptionSelected]}
              onPress={() => handleChange(y, tempDate.getMonth(), tempDate.getDate())}
            >
              <Text style={[styles.datePickerOptionText, tempDate.getFullYear() === y && styles.datePickerOptionTextSelected]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
  style,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
  height?: number;
  style?: object;
  editable?: boolean;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        style={[
          styles.input,
          multiline && { height: height || 100, textAlignVertical: 'top' },
          !editable && { opacity: 0.6 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
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
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: { color: '#991B1B', fontSize: 13 },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 12,
  },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  outlineText: { color: palette.primary, fontWeight: '700' },
  label: { color: '#6B7280', fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: palette.text,
    backgroundColor: '#F9FAFB',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: { color: palette.gray, fontSize: 13, flex: 1 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 14,
    borderTopWidth: 1,
    borderColor: palette.border,
  },
  primary: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  documentItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  documentName: { color: palette.text, fontSize: 14, fontWeight: '600' },
  documentType: { color: palette.gray, fontSize: 12 },
  documentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  documentBtnText: { color: palette.primary, fontWeight: '600', fontSize: 14 },
  helperText: { color: palette.gray, fontSize: 12, fontStyle: 'italic' },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  dateButtonText: { color: palette.text, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  datePickerHeaderText: { fontSize: 14, color: palette.gray, fontWeight: '600' },
  datePickerTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  datePickerContent: {
    flexDirection: 'row',
    gap: 12,
    height: 280,
  },
  datePickerColumn: {
    flex: 1,
    gap: 6,
  },
  datePickerLabel: { fontSize: 12, fontWeight: '600', color: palette.gray, marginBottom: 4 },
  datePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  datePickerOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  datePickerOptionText: { fontSize: 14, color: palette.gray },
  datePickerOptionTextSelected: { color: palette.primary, fontWeight: '700' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  genderButtonText: { color: palette.text, fontSize: 14 },
  genderPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  genderPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  genderPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  genderPickerHeaderText: { fontSize: 14, color: palette.gray, fontWeight: '600' },
  genderPickerTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  genderPickerContent: {
    gap: 8,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#F9FAFB',
  },
  genderOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: palette.primary,
  },
  genderOptionText: { fontSize: 14, color: palette.text, fontWeight: '600' },
  genderOptionTextSelected: { color: palette.primary, fontWeight: '700' },
});
