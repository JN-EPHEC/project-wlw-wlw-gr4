import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const mockDog = {
  name: 'Nala',
  breed: 'Border Collie',
  birth: '12/05/2023',
  gender: 'Femelle',
  weight: '16',
  notes: 'Allergique au poulet, très sociable.',
  image: 'https://images.unsplash.com/photo-1505623774485-923554bb2792?auto=format&fit=crop&w=400&q=80',
};

export default function EditDogScreen() {
  const router = useRouter();
  const [form, setForm] = useState(mockDog);
  const [photo, setPhoto] = useState<string | null>(mockDog.image);

  const canSave = form.name && form.breed;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
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
          <TouchableOpacity style={styles.outlineBtn}>
            <Ionicons name="camera-outline" size={16} color={palette.primary} />
            <Text style={styles.outlineText}>{photo ? 'Changer la photo' : 'Ajouter une photo'}</Text>
          </TouchableOpacity>
        </View>

        <Input label="Nom" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} placeholder="Nala" />
        <Input label="Race" value={form.breed} onChangeText={(t) => setForm({ ...form, breed: t })} placeholder="Border Collie" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Input
            style={{ flex: 1 }}
            label="Date de naissance"
            value={form.birth}
            onChangeText={(t) => setForm({ ...form, birth: t })}
            placeholder="JJ/MM/AAAA"
          />
          <Input
            style={{ width: 110 }}
            label="Poids (kg)"
            value={form.weight}
            onChangeText={(t) => setForm({ ...form, weight: t })}
            placeholder="16"
            keyboardType="numeric"
          />
        </View>
        <Input
          label="Genre"
          value={form.gender}
          onChangeText={(t) => setForm({ ...form, gender: t })}
          placeholder="Femelle / Mâle"
        />
        <Input
          label="Notes / santé / caractère"
          value={form.notes}
          onChangeText={(t) => setForm({ ...form, notes: t })}
          placeholder="Allergies, comportement, etc."
          multiline
          height={110}
        />

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={20} color="#1D4ED8" />
          <Text style={styles.infoText}>Mettez à jour les vaccins et documents vétérinaires dans la fiche.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity style={styles.outlineDanger} onPress={() => router.back()}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
            <Text style={styles.outlineDangerText}>Supprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primary, { flex: 1 }, !canSave && { opacity: 0.5 }]}
            disabled={!canSave}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryText}>Enregistrer</Text>
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
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  multiline?: boolean;
  height?: number;
  style?: object;
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
        style={[
          styles.input,
          multiline && { height: height || 100, textAlignVertical: 'top' },
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
});
