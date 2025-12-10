import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { UserStackParamList } from '@/navigation/types';
import { useDogs } from '@/hooks/useDogs';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<UserStackParamList, 'addDog'>;

export default function AddDogScreen({ navigation }: Props) {
  const { addDog, loading: dbLoading, error: dbError } = useDogs();
  const [form, setForm] = useState({
    name: '',
    breed: '',
    birthDate: '',
    gender: '',
    weight: '',
    otherInfo: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = form.name && form.breed && !saving && !dbLoading;

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

  const handleSave = async () => {
    try {
      setSaving(true);
      await addDog(
        {
          name: form.name,
          breed: form.breed,
          birthDate: form.birthDate || undefined,
          gender: form.gender || undefined,
          weight: form.weight || undefined,
          otherInfo: form.otherInfo || undefined,
          ownerId: '', // Sera défini par le hook
        },
        photoFile || undefined
      );

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
              <Image source={{ uri: photo }} style={styles.photo} />
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
          <Input
            style={{ flex: 1 }}
            label="Date de naissance"
            value={form.birthDate}
            onChangeText={(t) => setForm({ ...form, birthDate: t })}
            placeholder="JJ/MM/AAAA"
            editable={!saving}
          />
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
        <Input
          label="Genre"
          value={form.gender}
          onChangeText={(t) => setForm({ ...form, gender: t })}
          placeholder="Femelle / Mâle"
          editable={!saving}
        />
        <Input
          label="Notes / santé / caractère"
          value={form.otherInfo}
          onChangeText={(t) => setForm({ ...form, otherInfo: t })}
          placeholder="Allergies, comportement, etc."
          multiline
          height={110}
          editable={!saving}
        />

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>Ajoutez les vaccins et documents vétérinaires depuis la fiche du chien.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primary, !canSave && { opacity: 0.5 }]}
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
});
