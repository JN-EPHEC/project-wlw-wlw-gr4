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
import { UserStackParamList } from '@/navigation/types';
import { db, storage } from '@/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type Props = NativeStackScreenProps<UserStackParamList, 'editProfile'>;

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
};

export default function EditProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger les données de profil actuelles
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data().profile || {};
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setCity(data.city || '');
          setPhone(data.phone || '');
          setBio(data.bio || '');
          setPhotoUrl(user.photoURL || null);
        }
        setEmail(user.email || '');
        setPhotoUrl(user.photoURL || null);
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Impossible de charger les données du profil');
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user?.uid]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Vous devez autoriser l\'accès à la galerie pour changer la photo');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (err) {
      setError('Erreur lors de la sélection de l\'image');
    }
  };

  const uploadImage = async (imageUri: string): Promise<string> => {
    if (!user?.uid) throw new Error('User not authenticated');

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Créer un chemin unique avec timestamp et random
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2);
      const storagePath = `profile-pictures/${user.uid}/${timestamp}_${random}.jpg`;

      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      
      return downloadUrl;
    } catch (err) {
      console.error('Erreur détaillée du upload:', err);
      throw new Error(`Erreur lors du upload de l'image: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) {
      setError('Utilisateur non authentifié');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      let newPhotoUrl = photoUrl;

      // Upload nouvelle image si sélectionnée
      if (selectedImage) {
        try {
          newPhotoUrl = await uploadImage(selectedImage);
        } catch (uploadErr) {
          console.error('Erreur upload:', uploadErr);
          // Continuer sans la photo - ne pas bloquer la sauvegarde du profil
          console.warn('Photo non uploadée, continuation sans image');
        }
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'profile.firstName': firstName,
        'profile.lastName': lastName,
        'profile.city': city,
        'profile.phone': phone,
        'profile.bio': bio,
        'profile.photoUrl': newPhotoUrl,
      });

      setSuccess(true);
      setPhotoUrl(newPhotoUrl);
      setSelectedImage(null);

      // Retourner immédiatement sur la page profil
      navigation.goBack();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(`Erreur lors de la sauvegarde: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={palette.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Modifier le profil</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier le profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Photo de profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo de profil</Text>
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.photoImage} />
              ) : photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.photoImage} />
              ) : (
                <View style={[styles.photoImage, styles.photoPlaceholder]}>
                  <Ionicons name="person" size={60} color={palette.gray} />
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="camera" size={18} color="#FFF" />
              <Text style={styles.uploadButtonText}>Changer la photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre prénom"
              placeholderTextColor={palette.gray}
              value={firstName}
              onChangeText={setFirstName}
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              placeholderTextColor={palette.gray}
              value={lastName}
              onChangeText={setLastName}
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Email"
              placeholderTextColor={palette.gray}
              value={email}
              editable={false}
            />
            <Text style={styles.hint}>L'email ne peut pas être modifié</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre ville"
              placeholderTextColor={palette.gray}
              value={city}
              onChangeText={setCity}
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre numéro de téléphone"
              placeholderTextColor={palette.gray}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!saving}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Biographie</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Parlez un peu de vous..."
              placeholderTextColor={palette.gray}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>
        </View>

        {/* Affichage des erreurs/succès */}
        {error && (
          <View style={styles.alertBox}>
            <Ionicons name="alert-circle" size={18} color={palette.danger} />
            <Text style={styles.alertText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={[styles.alertBox, styles.successAlert]}>
            <Ionicons name="checkmark-circle" size={18} color={palette.success} />
            <Text style={[styles.alertText, { color: palette.success }]}>Profil mise à jour avec succès !</Text>
          </View>
        )}

        {/* Boutons d'action */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color="#FFF" />
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  backButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '700', color: palette.text },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text, marginBottom: 8 },
  photoSection: { alignItems: 'center', gap: 12 },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: palette.lightGray,
    borderWidth: 2,
    borderColor: palette.border,
  },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: { color: '#FFF', fontWeight: '600' },
  formGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: palette.text },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.text,
  },
  disabledInput: { backgroundColor: palette.lightGray, color: palette.gray },
  bioInput: { textAlignVertical: 'top' },
  hint: { fontSize: 12, color: palette.gray, marginTop: 2 },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: palette.danger,
    padding: 12,
    borderRadius: 6,
    gap: 10,
    alignItems: 'center',
  },
  successAlert: { backgroundColor: '#ECFDF5', borderLeftColor: palette.success },
  alertText: { flex: 1, fontSize: 13, color: palette.danger, fontWeight: '500' },
  buttonGroup: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButton: { backgroundColor: palette.border, borderWidth: 1, borderColor: palette.border },
  cancelButtonText: { color: palette.text, fontWeight: '600', fontSize: 14 },
  saveButton: { backgroundColor: palette.primary },
  saveButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  disabledButton: { opacity: 0.6 },
});
