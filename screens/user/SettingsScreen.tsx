import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { UserStackParamList } from '@/navigation/types';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';

type Props = NativeStackScreenProps<UserStackParamList, 'settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { deleteAccount, actionLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    setError(null);
    try {
      await deleteAccount();
      setDeleteModalVisible(false);
      // Navigate to login or a "goodbye" screen
    } catch (err) {
      setError(formatFirebaseAuthError(err));
      setDeleteModalVisible(false);
      Alert.alert('Erreur', "Une erreur est survenue lors de la suppression du compte.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#41B6A6" />
        </TouchableOpacity>
        <Text style={styles.title}>Paramètres</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.helper}>Gérez les informations et les préférences de votre compte.</Text>

        <TouchableOpacity
          style={[styles.deleteButton, actionLoading && styles.disabled]}
          onPress={() => setDeleteModalVisible(true)}
          disabled={actionLoading}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Supprimer votre compte</Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Delete Account Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Supprimer le compte</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteAccount}
                disabled={actionLoading}
              >
                <Text style={styles.deleteConfirmButtonText}>
                  {actionLoading ? 'Suppression...' : 'Je confirme la suppression de mon compte'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 8, marginRight: 8, marginLeft: -8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  content: { padding: 24, flex: 1 },
  helper: { color: '#6B7280', fontSize: 16, marginBottom: 32, textAlign: 'center' },
  deleteButton: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: { color: '#DC2626', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.6 },
  errorText: { color: '#DC2626', textAlign: 'center', marginTop: 16 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  deleteCancelButtonText: {
    color: '#1F2937',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    backgroundColor: '#DC2626',
  },
  deleteConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
