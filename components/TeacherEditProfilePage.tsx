import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/context/AuthContext';
import { TeacherStackParamList } from '@/navigation/types';
import { useUpdateEducatorProfile } from '@/hooks/useUpdateEducatorProfile';

const palette = {
  primary: '#35A89C',
  primaryDark: '#2B8A7F',
  accent: '#E39A5C',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
  success: '#16A34A',
  danger: '#DC2626',
};

export default function TeacherEditProfilePage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { user, profile, refreshProfile } = useAuth();
  const { updateProfile, loading: updating, error: updateError } = useUpdateEducatorProfile();

  const userId = (user as any)?.uid || '';
  const userProfile = (profile as any)?.profile || {};

  // Form state
  const [form, setForm] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    city: userProfile?.city || '',
    postalCode: userProfile?.postalCode || '',
    hourlyRate: userProfile?.hourlyRate?.toString() || '',
    experienceYears: userProfile?.experienceYears?.toString() || '',
    specialties: userProfile?.specialties?.join(', ') || '',
    certifications: userProfile?.certifications || '',
    trainings: userProfile?.trainings || '',
    website: userProfile?.website || '',
  });

  const [photoUri, setPhotoUri] = useState<string | null>(userProfile?.photoUrl || null);
  const [photoFile, setPhotoFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!form.lastName.trim()) newErrors.lastName = 'Nom requis';

    // Email validation
    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Email invalide';
      }
    }

    // Phone validation (au moins 10 chiffres)
    if (form.phone.trim()) {
      const phoneDigits = form.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Téléphone invalide (minimum 10 chiffres)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return form.firstName.trim() && form.lastName.trim();
  }, [form]);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handlePickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        setPhotoFile({
          uri: asset.uri,
          name: asset.fileName || 'photo.jpg',
          mimeType: asset.mimeType || 'image/jpeg',
        });
        setIsDirty(true);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner la photo');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      const updateData: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        city: form.city,
        postalCode: form.postalCode,
        website: form.website,
        specialties: form.specialties
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0),
        certifications: form.certifications,
        trainings: form.trainings,
      };

      if (form.hourlyRate) {
        updateData.hourlyRate = parseFloat(form.hourlyRate);
      }
      if (form.experienceYears) {
        updateData.experienceYears = parseInt(form.experienceYears, 10);
      }

      if (photoFile) {
        updateData.photoFile = photoFile;
      }

      await updateProfile(userId, updateData);
      
      // Rafraîchir le profil dans le contexte
      await refreshProfile();
      
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      setIsDirty(false);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Erreur: Utilisateur non identifié</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={palette.surface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Modifier le profil</Text>
            <View style={{ width: 22 }} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo de profil */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photo} />
              ) : (
                <View style={[styles.photo, { backgroundColor: palette.border, justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="person" size={60} color={palette.gray} />
                </View>
              )}
              <TouchableOpacity style={styles.photoEditButton} onPress={handlePickPhoto}>
                <Ionicons name="camera" size={18} color={palette.surface} />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoLabel}>Photo de profil</Text>
          </View>

          {/* Infos personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { marginRight: 8 }]}>
                <Text style={styles.label}>Prénom *</Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  placeholder="Prénom"
                  value={form.firstName}
                  onChangeText={(v) => handleInputChange('firstName', v)}
                  editable={!updating}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  placeholder="Nom"
                  value={form.lastName}
                  onChangeText={(v) => handleInputChange('lastName', v)}
                  editable={!updating}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="email@example.com"
                value={form.email}
                onChangeText={(v) => handleInputChange('email', v)}
                keyboardType="email-address"
                editable={!updating}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChangeText={(v) => handleInputChange('phone', v)}
                keyboardType="phone-pad"
                editable={!updating}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Site web</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                value={form.website}
                onChangeText={(v) => handleInputChange('website', v)}
                keyboardType="url"
                editable={!updating}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={styles.input}
                placeholder="Bruxelles"
                value={form.city}
                onChangeText={(v) => handleInputChange('city', v)}
                editable={!updating}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Code postal</Text>
              <TextInput
                style={styles.input}
                placeholder="1000"
                value={form.postalCode}
                onChangeText={(v) => handleInputChange('postalCode', v)}
                keyboardType="numeric"
                editable={!updating}
              />
            </View>
          </View>

          {/* Infos professionnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations professionnelles</Text>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { marginRight: 8 }]}>
                <Text style={styles.label}>Tarif horaire (€)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="40"
                  value={form.hourlyRate}
                  onChangeText={(v) => handleInputChange('hourlyRate', v)}
                  keyboardType="decimal-pad"
                  editable={!updating}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Années d'expérience</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  value={form.experienceYears}
                  onChangeText={(v) => handleInputChange('experienceYears', v)}
                  keyboardType="numeric"
                  editable={!updating}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Spécialités (séparées par des virgules)</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                placeholder="Agility, Obéissance, Éducation positive"
                value={form.specialties}
                onChangeText={(v) => handleInputChange('specialties', v)}
                multiline
                editable={!updating}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Certifications</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                placeholder="BPJEPS, CCAD, Clicker Training..."
                value={form.certifications}
                onChangeText={(v) => handleInputChange('certifications', v)}
                multiline
                editable={!updating}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Formations</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                placeholder="Listes vos formations..."
                value={form.trainings}
                onChangeText={(v) => handleInputChange('trainings', v)}
                multiline
                editable={!updating}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biographie</Text>
              <TextInput
                style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Parlez de vous, votre approche, votre expérience..."
                value={form.bio}
                onChangeText={(v) => handleInputChange('bio', v)}
                multiline
                editable={!updating}
              />
            </View>
          </View>

          {updateError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color={palette.danger} />
              <Text style={styles.errorMessage}>{updateError}</Text>
            </View>
          )}
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, updating && styles.disabled]}
            onPress={() => navigation.goBack()}
            disabled={updating}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, (!isFormValid || updating) && styles.disabled]}
            onPress={handleSave}
            disabled={!isFormValid || updating}
          >
            {updating ? (
              <ActivityIndicator color={palette.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.border,
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: palette.surface,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    fontSize: 14,
  },
  inputError: {
    borderColor: palette.danger,
  },
  errorText: {
    fontSize: 12,
    color: palette.danger,
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  errorMessage: {
    flex: 1,
    fontSize: 14,
    color: palette.danger,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  submitButton: {
    backgroundColor: palette.primary,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: palette.danger,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
