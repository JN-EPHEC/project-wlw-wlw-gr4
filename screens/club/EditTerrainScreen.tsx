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
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { useClubTerrains, Terrain } from '@/hooks/useClubTerrains';

type Props = NativeStackScreenProps<ClubStackParamList, 'editTerrains'>;

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
  green: '#16A34A',
};

export default function EditTerrainScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const terrainId = route.params?.terrainId;
  const { terrains, addTerrain, updateTerrain, trainingStyles, refetch } = useClubTerrains(
    user?.uid || null
  );

  const [loading, setLoading] = useState(!!terrainId);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [trainingStyle, setTrainingStyle] = useState(trainingStyles[0]);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du terrain si en mode édition
  useEffect(() => {
    if (terrainId) {
      const terrain = terrains.find(t => t.id === terrainId);
      if (terrain) {
        setName(terrain.name);
        setAddress(terrain.address);
        setTrainingStyle(terrain.trainingStyle);
        setLoading(false);
      }
    }
  }, [terrainId, terrains]);

  const handleSave = async () => {
    if (!name.trim() || !address.trim() || !trainingStyle) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const terrainData = {
        name: name.trim(),
        address: address.trim(),
        trainingStyle,
      };

      if (terrainId) {
        await updateTerrain(terrainId, terrainData);
      } else {
        await addTerrain(terrainData as any);
      }

      refetch();
      navigation.replace('clubProfile' as any);
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
      Alert.alert('Erreur', err.message || 'Impossible de sauvegarder le terrain');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.primary} />
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{terrainId ? 'Modifier' : 'Créer'} un terrain</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.container}>
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={palette.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={{ gap: 16 }}>
              {/* Nom du terrain */}
              <View>
                <Text style={styles.label}>Nom du terrain *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Terrain Principal"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Adresse */}
              <View>
                <Text style={styles.label}>Adresse *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ex: 123 Rue du Chien, 75000 Paris"
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor={palette.gray}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>

              {/* Style de dressage */}
              <View>
                <Text style={styles.label}>Style de dressage *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowStylePicker(!showStylePicker)}
                >
                  <Text style={styles.pickerButtonText}>{trainingStyle}</Text>
                  <Ionicons
                    name={showStylePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={palette.primary}
                  />
                </TouchableOpacity>

                {showStylePicker && (
                  <View style={styles.pickerDropdown}>
                    <FlatList
                      data={trainingStyles}
                      keyExtractor={(item) => item}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.pickerOption,
                            trainingStyle === item && styles.pickerOptionSelected,
                          ]}
                          onPress={() => {
                            setTrainingStyle(item);
                            setShowStylePicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.pickerOptionText,
                              trainingStyle === item && styles.pickerOptionTextSelected,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
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
    paddingBottom: 100,
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
    flex: 1,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.text,
    backgroundColor: '#fff',
  },
  textArea: {
    paddingTop: 12,
    textAlignVertical: 'top',
    minHeight: 60,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 14,
    color: palette.text,
  },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  pickerOptionSelected: {
    backgroundColor: palette.lightGray,
  },
  pickerOptionText: {
    fontSize: 14,
    color: palette.text,
  },
  pickerOptionTextSelected: {
    fontWeight: '600',
    color: palette.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
