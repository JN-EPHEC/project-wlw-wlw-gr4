import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { db, storage } from '@/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Props = NativeStackScreenProps<ClubStackParamList, 'editClubProfile'>;

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
};

const availableServices = [
  'Éducation canine',
  'Agility',
  'Dressage',
  'Pension canine',
  'Comportementalisme',
  'Toilettage',
  'Dog sitting',
  'Promenade',
];

export default function EditClubProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clubName, setClubName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [siret, setSiret] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openingHours, setOpeningHours] = useState<Array<{ day: string; open: string; close: string }>>([]);

  // Charger les données du club actuelles
  useEffect(() => {
    const loadClubData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data().profile || {};
          console.log('📥 Services chargés:', data.services);
          console.log('📥 Données complètes profile:', data);
          setClubName(data.clubName || '');
          setLegalName(data.legalName || '');
          setSiret(data.siret || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setCity(data.city || '');
          setPostalCode(data.postalCode || '');
          setWebsite(data.website || '');
          setDescription(data.description || '');
          const loadedServices = Array.isArray(data.services) ? data.services : [];
          console.log('✅ Services mis en state:', loadedServices);
          setServices(loadedServices);
          setPhotoUrl(data.logoUrl || null);
          setOpeningHours(data.openingHours || []);
        }
        setEmail(user.email || '');
      } catch (err) {
        console.error('Erreur lors du chargement du profil club:', err);
        setError('Impossible de charger les données du club');
      } finally {
        setLoading(false);
      }
    };
    loadClubData();
  }, [user?.uid]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    if (!clubName.trim()) {
      Alert.alert('Erreur', 'Le nom du club est requis');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let newLogoUrl = photoUrl;

      // Upload de la photo si une nouvelle est sélectionnée
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const extension = 'jpg';
        const storagePath = `profile-pictures/${user.uid}/${Date.now()}_${Math.random().toString(36).slice(2)}.${extension}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, blob);
        newLogoUrl = await getDownloadURL(storageRef);
      }

      // Mise à jour des données du club dans Firestore
      const clubRef = doc(db, 'users', user.uid);
      console.log('📤 Sauvegarde services:', services);
      await updateDoc(clubRef, {
        'profile.clubName': clubName.trim(),
        'profile.legalName': legalName.trim(),
        'profile.siret': siret.trim(),
        'profile.phone': phone.trim(),
        'profile.address': address.trim(),
        'profile.city': city.trim(),
        'profile.postalCode': postalCode.trim(),
        'profile.website': website.trim(),
        'profile.description': description.trim(),
        'profile.services': services,
        'profile.openingHours': openingHours,
        'profile.logoUrl': newLogoUrl,
      });
      console.log('✅ Profil sauvegardé avec services:', services);

      setSuccess(true);
      Alert.alert('Succès', 'Profil du club mis à jour avec succès');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde des données');
      Alert.alert('Erreur', 'Impossible de sauvegarder les données');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={[styles.text, { marginTop: 12 }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Modifier le profil</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.container}>
            {/* Photo du club */}
            <TouchableOpacity
              style={styles.photoSection}
              onPress={pickImage}
            >
              {selectedImage || photoUrl ? (
                <Image
                  source={{ uri: selectedImage || photoUrl || '' }}
                  style={styles.photo}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image-outline" size={48} color={palette.primary} />
                </View>
              )}
              <View style={styles.photoOverlay}>
                <Ionicons name="camera-outline" size={18} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Erreur */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={palette.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Formulaire */}
            <View style={{ gap: 16 }}>
              {/* Nom du club */}
              <View>
                <Text style={styles.label}>Nom du club *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Club Canin de Paris"
                  value={clubName}
                  onChangeText={setClubName}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Nom légal */}
              <View>
                <Text style={styles.label}>Nom légal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: SARL Club Canin"
                  value={legalName}
                  onChangeText={setLegalName}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* SIRET */}
              <View>
                <Text style={styles.label}>SIRET</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12345678901234"
                  value={siret}
                  onChangeText={setSiret}
                  placeholderTextColor={palette.gray}
                  keyboardType="numeric"
                />
              </View>

              {/* Email (lecture seule) */}
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={email}
                  editable={false}
                  placeholderTextColor={palette.gray}
                />
                <Text style={styles.hint}>Non modifiable</Text>
              </View>

              {/* Téléphone */}
              <View>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 01 23 45 67 89"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor={palette.gray}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Adresse */}
              <View>
                <Text style={styles.label}>Adresse</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 123 rue de Paris"
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Ville */}
              <View>
                <Text style={styles.label}>Ville</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Paris"
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Code postal */}
              <View>
                <Text style={styles.label}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 75001"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholderTextColor={palette.gray}
                  keyboardType="numeric"
                />
              </View>

              {/* Site web */}
              <View>
                <Text style={styles.label}>Site web</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: https://www.example.com"
                  value={website}
                  onChangeText={setWebsite}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Description */}
              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Décrivez votre club, ses services, son histoire..."
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor={palette.gray}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              {/* Horaires d'ouverture */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={styles.label}>Horaires d'ouverture</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setOpeningHours([...openingHours, { day: '', open: '', close: '' }]);
                    }}
                    style={{ padding: 8 }}
                  >
                    <Ionicons name="add-circle" size={24} color={palette.primary} />
                  </TouchableOpacity>
                </View>
                {openingHours.map((hours, idx) => (
                  <View key={idx} style={{ gap: 8, marginBottom: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: palette.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Jour</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex: Lundi-Vendredi"
                          value={hours.day}
                          onChangeText={(text) => {
                            const updated = [...openingHours];
                            updated[idx].day = text;
                            setOpeningHours(updated);
                          }}
                          placeholderTextColor={palette.gray}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setOpeningHours(openingHours.filter((_, i) => i !== idx));
                        }}
                        style={{ paddingTop: 28 }}
                      >
                        <Ionicons name="trash-outline" size={20} color={palette.danger} />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Ouverture</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex: 9h"
                          value={hours.open}
                          onChangeText={(text) => {
                            const updated = [...openingHours];
                            updated[idx].open = text;
                            setOpeningHours(updated);
                          }}
                          placeholderTextColor={palette.gray}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Fermeture</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex: 19h"
                          value={hours.close}
                          onChangeText={(text) => {
                            const updated = [...openingHours];
                            updated[idx].close = text;
                            setOpeningHours(updated);
                          }}
                          placeholderTextColor={palette.gray}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Services proposés */}
              <View>
                <Text style={styles.label}>Services proposés</Text>
                <View style={styles.chipWrap}>
                  {availableServices.map((service) => {
                    const selected = services.includes(service);
                    return (
                      <TouchableOpacity
                        key={service}
                        onPress={() => toggleService(service)}
                        style={[
                          styles.chip,
                          selected && { backgroundColor: palette.primary, borderColor: palette.primary },
                        ]}
                      >
                        <Text style={[styles.chipText, selected && { color: '#fff' }]}>
                          {service}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
                disabled={saving}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Sauvegarder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.lightGray,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    padding: 16,
    gap: 20,
  },
  photoSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: palette.border,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: palette.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.border,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: palette.danger,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: palette.text,
  },
  disabledInput: {
    backgroundColor: palette.lightGray,
    color: palette.gray,
  },
  textArea: {
    minHeight: 100,
    paddingVertical: 12,
  },
  hint: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 4,
  },
  text: {
    color: palette.text,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: palette.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.text,
  },
});
