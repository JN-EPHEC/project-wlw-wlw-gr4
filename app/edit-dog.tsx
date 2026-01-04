import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext';
import { useRoute } from '@react-navigation/native';

interface Dog {
  id?: string;
  name: string;
  breed: string;
  birthDate?: string;
  gender?: string;
  weight?: string;
  height?: string;
  photoUrl?: string;
  otherInfo?: string;
  vaccineFile?: string;
  ownerId: string;
  createdAt?: any;
  updatedAt?: any;
}

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const cleanObject = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== ''),
  );

const formatBirthDateForInput = (value?: string | number): string => {
  if (!value) return '';
  // Keep already formatted dates intact
  if (typeof value === 'string' && /[\\/.-]/.test(value)) return value;

  const toDate = (input: any): Date | null => {
    if (typeof input === 'number') {
      const ms = input < 1e12 ? input * 1000 : input; // seconds -> ms if needed
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    if (typeof input === 'string' && !Number.isNaN(Number(input))) {
      const num = Number(input);
      const ms = num < 1e12 ? num * 1000 : num;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const date = toDate(value);
  if (!date) return String(value);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const normalizeBirthDateForSave = (value?: string | number): string | undefined => {
  if (!value) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  // dd/mm/yyyy or dd-mm-yyyy
  const parts = raw.match(/^(\d{1,2})[\\/.-](\d{1,2})[\\/.-](\d{2,4})$/);
  if (parts) {
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    const year = parseInt(parts[3], 10) < 100 ? 2000 + parseInt(parts[3], 10) : parseInt(parts[3], 10);
    const d = new Date(year, month, day);
    if (!Number.isNaN(d.getTime())) return String(d.getTime());
  }

  // numeric seconds or ms
  if (!Number.isNaN(Number(raw))) {
    let num = Number(raw);
    num = num < 1e12 ? num * 1000 : num; // convert seconds to ms if needed
    const d = new Date(num);
    if (!Number.isNaN(d.getTime())) return String(d.getTime());
  }

  // fallback: Date-parsable string
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return String(d.getTime());

  // ultimate fallback: keep raw
  return raw;
};

export default function EditDogScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const dogId = (route.params as any)?.dogId;

  const [form, setForm] = useState<Partial<Dog>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [documents, setDocuments] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canSave = form.name && form.breed && !saving && !deleting;

  // Charger les données du chien depuis Firestore
  useEffect(() => {
    const loadDog = async () => {
      if (!dogId) return;
      try {
        setInitialLoading(true);
        setError(null);
        const docRef = doc(db, 'Chien', dogId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Dog;
          setForm({
            ...data,
            birthDate: formatBirthDateForInput(data.birthDate),
          });
          setPhoto(data.photoUrl || null);
        } else {
          setError('Chien non trouvé');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(message);
      } finally {
        setInitialLoading(false);
      }
    };

    loadDog();
  }, [dogId]);

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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocuments([
          ...documents,
          {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || 'application/octet-stream',
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de sélectionner un document');
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!dogId) return;
    try {
      setSaving(true);
      let photoUrl = form.photoUrl;

      // Upload nouvelle photo si présente
      if (photoFile) {
        console.log('📸 [handleSave] Uploading photo:', photoFile.name);
        const response = await fetch(photoFile.uri);
        const blob = await response.blob();
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2);
        const extension = photoFile.name.split('.').pop() || 'jpg';
        const storagePath = `dogs/${user?.uid}/${timestamp}_${random}.${extension}`;
        const storageRef = ref(storage, storagePath);
        const uploadResult = await uploadBytes(storageRef, blob);
        photoUrl = await getDownloadURL(uploadResult.ref);
        console.log('✅ [handleSave] Photo uploaded successfully');
      }

      // Upload les documents/certificats s'il y en a de nouveaux
      let vaccineFile = form.vaccineFile || undefined;
      
      if (documents.length > 0) {
        console.log('📄 [handleSave] Processing documents, count:', documents.length);
        
        for (const doc of documents) {
          try {
            console.log('📤 [handleSave] Uploading document:', doc.name);
            
            // Fetch le fichier
            const response = await fetch(doc.uri);
            const blob = await response.blob();
            
            // Créer un ID unique
            const docId = `${Date.now()}_${doc.name}`;
            // Important: Utiliser userId, pas dogId (pour les Storage rules)
            const storagePath = `dogs/${user?.uid}/documents/${docId}`;
            const storageRef = ref(storage, storagePath);
            
            // Upload
            await uploadBytes(storageRef, blob, { contentType: doc.type });
            
            // Obtenir l'URL
            const downloadUrl = await getDownloadURL(storageRef);
            
            // Créer l'objet vaccineFile
            vaccineFile = {
              id: docId,
              name: doc.name,
              type: doc.type,
              url: downloadUrl,
              uploadedAt: Timestamp.now(),
              size: blob.size,
            };
            
            console.log('✅ [handleSave] Document uploaded successfully:', doc.name);
          } catch (docErr) {
            console.error('❌ [handleSave] Error uploading document:', docErr);
            Alert.alert('Erreur', `Impossible d'uploader le document ${doc.name}`);
            setSaving(false);
            return;
          }
        }
      }

      const docRef = doc(db, 'Chien', dogId);

      const birthDate = normalizeBirthDateForSave(form.birthDate);
      const updatePayload = cleanObject({
        name: form.name,
        breed: form.breed,
        birthDate,
        gender: form.gender,
        weight: form.weight,
        otherInfo: form.otherInfo,
        ...(photoUrl && { photoUrl }),
        ...(vaccineFile && { vaccineFile }),
      });

      console.log('💾 [handleSave] Updating Firestore with payload:', Object.keys(updatePayload));
      
      await updateDoc(docRef, {
        ...updatePayload,
        updatedAt: Timestamp.now(),
      });

      console.log('✅ [handleSave] Firestore updated successfully');
      
      Alert.alert('Succès', 'Chien modifié avec succès');
      setDocuments([]); // Vider la liste des documents après succès
      navigation.goBack();
    } catch (err) {
      console.error('❌ [handleSave] Error:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!dogId) return;
    Alert.alert('Confirmation', 'Êtes-vous sûr de vouloir supprimer ce chien ?', [
      { text: 'Annuler', onPress: () => {} },
      {
        text: 'Supprimer',
        onPress: async () => {
          try {
            setDeleting(true);

            // Supprimer la photo si présente
            if (form.photoUrl) {
              try {
                const storageRef = ref(storage, form.photoUrl);
                await deleteObject(storageRef);
              } catch {
                // Ignorer les erreurs de suppression de photo
              }
            }

            await deleteDoc(doc(db, 'Chien', dogId));
            Alert.alert('Succès', 'Chien supprimé avec succès');
            navigation.goBack();
          } catch (err) {
            Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de la suppression');
          } finally {
            setDeleting(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} disabled={false}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le chien</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le chien</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, textAlign: 'center' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} disabled={saving || deleting}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le chien</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoCard}>
          <View style={styles.photoCircle}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <MaterialCommunityIcons name="paw" size={36} color={palette.gray} />
            )}
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={pickImage} disabled={saving || deleting}>
            <Ionicons name="camera-outline" size={16} color={palette.primary} />
            <Text style={styles.outlineText}>{photo ? 'Changer la photo' : 'Ajouter une photo'}</Text>
          </TouchableOpacity>
        </View>

        <Input label="Nom" value={form.name || ''} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nala" editable={!saving && !deleting} />
        <Input label="Race" value={form.breed || ''} onChangeText={(t) => setForm({ ...form, breed: t })} placeholder="Border Collie" editable={!saving && !deleting} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Input
            style={{ flex: 1 }}
            label="Date de naissance"
            value={formatBirthDateForInput(form.birthDate)}
            onChangeText={(t) => setForm({ ...form, birthDate: t })}
            placeholder="JJ/MM/AAAA"
            editable={!saving && !deleting}
          />
          <Input
            style={{ width: 110 }}
            label="Poids (kg)"
            value={form.weight || ''}
            onChangeText={(t) => setForm({ ...form, weight: t })}
            placeholder="16"
            keyboardType="numeric"
            editable={!saving && !deleting}
          />
        </View>
        <Input
          label="Genre"
          value={form.gender || ''}
          onChangeText={(t) => setForm({ ...form, gender: t })}
          placeholder="Femelle / Mâle"
          editable={!saving && !deleting}
        />
        <Input
          label="Notes / santé / caractère"
          value={form.otherInfo || ''}
          onChangeText={(t) => setForm({ ...form, otherInfo: t })}
          placeholder="Allergies, comportement, etc."
          multiline
          height={110}
          editable={!saving && !deleting}
        />

        <View style={styles.divider} />

        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={palette.primary} />
            <Text style={styles.sectionTitle}>Vaccinations & Documents</Text>
          </View>

          {documents.length > 0 && (
            <View style={{ gap: 10 }}>
              {documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
                    <Text style={styles.documentType}>{doc.type.split('/')[0]}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeDocument(index)} disabled={saving || deleting}>
                    <Ionicons name="close-circle" size={24} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.documentBtn} onPress={pickDocument} disabled={saving || deleting}>
            <Ionicons name="add-circle-outline" size={18} color={palette.primary} />
            <Text style={styles.documentBtnText}>Ajouter un document</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>PDF, images, documents Word acceptés (vaccins, certificats, etc.)</Text>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>Mettez à jour les vaccins et documents vétérinaires dans la fiche.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={[styles.outlineDanger, (saving || deleting) && { opacity: 0.5 }]} onPress={handleDelete} disabled={saving || deleting}>
            {deleting ? (
              <ActivityIndicator color="#DC2626" size={18} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
                <Text style={styles.outlineDangerText}>Supprimer</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primary, { flex: 1 }, !canSave && { opacity: 0.5 }]}
            disabled={!canSave}
            onPress={handleSave}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  outlineDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  outlineDangerText: { color: '#DC2626', fontWeight: '700' },
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
});
