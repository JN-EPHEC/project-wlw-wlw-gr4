import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { useClubFields } from '@/hooks/useClubFields';

type Props = NativeStackScreenProps<ClubStackParamList, 'createField'>;

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
};

const SURFACE_TYPES = ['gazon', 'béton', 'stabilisé', 'synthétique', 'terre'];
const TRAINING_TYPES = ['agility', 'obéissance', 'pistage', 'protection', 'ring'];

export default function CreateFieldScreen({ navigation }: Props) {
  const { user, profile } = useAuth();
  const clubId = (profile as any)?.uid || user?.uid;
  const { addField } = useClubFields(clubId || null);

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [surfaceType, setSurfaceType] = useState('gazon');
  const [trainingType, setTrainingType] = useState('agility');
  const [isIndoor, setIsIndoor] = useState(false);
  const [showSurfaceModal, setShowSurfaceModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom et l\'adresse');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await addField({
        name: name.trim(),
        address: address.trim(),
        notes: notes.trim(),
        surfaceType,
        trainingType,
        isIndoor,
      });

      Alert.alert('Succès', 'Terrain créé avec succès', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError('Erreur lors de la création du terrain');
      Alert.alert('Erreur', 'Impossible de créer le terrain');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ajouter un terrain</Text>
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
              {/* Nom */}
              <View>
                <Text style={styles.label}>Nom du terrain *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Terrain principal"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Adresse */}
              <View>
                <Text style={styles.label}>Adresse *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12 rue des Chiens, 7500 Belgique"
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Type de surface */}
              <View>
                <Text style={styles.label}>Type de surface</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowSurfaceModal(true)}
                >
                  <Text style={styles.selectButtonText}>{surfaceType}</Text>
                  <Ionicons name="chevron-down" size={20} color={palette.gray} />
                </TouchableOpacity>
              </View>

              {/* Type d'entraînement */}
              <View>
                <Text style={styles.label}>Type d'entraînement</Text>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => setShowTrainingModal(true)}
                >
                  <Text style={styles.selectButtonText}>{trainingType}</Text>
                  <Ionicons name="chevron-down" size={20} color={palette.gray} />
                </TouchableOpacity>
              </View>

              {/* Intérieur/Extérieur */}
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Terrain intérieur</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, isIndoor && styles.toggleButtonActive]}
                  onPress={() => setIsIndoor(!isIndoor)}
                >
                  <View style={[styles.toggleDot, isIndoor && styles.toggleDotActive]} />
                </TouchableOpacity>
              </View>

              {/* Notes */}
              <View>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Éclairage, clôture, parking, etc."
                  value={notes}
                  onChangeText={setNotes}
                  placeholderTextColor={palette.gray}
                  multiline
                  numberOfLines={4}
                />
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
                  <Text style={styles.saveBtnText}>Créer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Type de surface */}
      <Modal
        visible={showSurfaceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSurfaceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowSurfaceModal(false)}>
                <Text style={styles.modalHeaderText}>Fermer</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Type de surface</Text>
              <View style={{ width: 60 }} />
            </View>
            <View style={styles.modalOptions}>
              {SURFACE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalOption,
                    surfaceType === type && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setSurfaceType(type);
                    setShowSurfaceModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      surfaceType === type && styles.modalOptionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                  {surfaceType === type && (
                    <Ionicons name="checkmark" size={24} color={palette.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Type d'entraînement */}
      <Modal
        visible={showTrainingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTrainingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowTrainingModal(false)}>
                <Text style={styles.modalHeaderText}>Fermer</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Type d'entraînement</Text>
              <View style={{ width: 60 }} />
            </View>
            <View style={styles.modalOptions}>
              {TRAINING_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalOption,
                    trainingType === type && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setTrainingType(type);
                    setShowTrainingModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      trainingType === type && styles.modalOptionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                  {trainingType === type && (
                    <Ionicons name="checkmark" size={24} color={palette.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.lightGray,
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
    minHeight: 80,
  },
  selectButton: {
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
  selectButtonText: {
    fontSize: 14,
    color: palette.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: palette.success,
  },
  toggleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  modalHeaderText: {
    fontSize: 16,
    color: palette.primary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  modalOptions: {
    padding: 16,
    gap: 12,
  },
  modalOption: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  modalOptionSelected: {
    backgroundColor: '#FFF5E6',
    borderColor: palette.primary,
  },
  modalOptionText: {
    fontSize: 14,
    color: palette.text,
    flex: 1,
    textTransform: 'capitalize',
  },
  modalOptionTextSelected: {
    fontWeight: '600',
    color: palette.primary,
  },
});
