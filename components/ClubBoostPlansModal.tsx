import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  background: '#F7F4F0',
  success: '#16A34A',
  danger: '#DC2626',
};

interface BoostPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  popular?: boolean;
}

interface ClubBoostPlansModalProps {
  visible: boolean;
  onClose: () => void;
  clubId: string;
  activeBoostId?: string;
  onSuccess?: () => void;
}

const BOOST_PLANS: BoostPlan[] = [
  {
    id: 'boost-basic',
    name: 'Boost Basique',
    description: 'Parfait pour commencer',
    price: 29.9,
    durationDays: 30,
    features: [
      'Visibilité augmentée dans les résultats',
      'Badge "Boosté" sur votre profil',
      '30 jours de boost illimité',
    ],
  },
  {
    id: 'boost-premium',
    name: 'Boost Premium',
    description: 'Plus de visibilité',
    price: 49.9,
    durationDays: 30,
    features: [
      'Visibilité augmentée dans les résultats',
      'Badge "Premium" sur votre profil',
      '30 jours de boost illimité',
      'Support prioritaire',
      'Analytics avancées',
    ],
    popular: true,
  },
  {
    id: 'boost-pro',
    name: 'Boost Pro',
    description: 'Maximum de visibilité',
    price: 79.9,
    durationDays: 30,
    features: [
      'Visibilité maximale dans les résultats',
      'Badge "Pro" doré sur votre profil',
      '30 jours de boost illimité',
      'Support prioritaire 24/7',
      'Analytics avancées',
      'Bannière personnalisée',
    ],
  },
];

export default function ClubBoostPlansModal({
  visible,
  onClose,
  clubId,
  activeBoostId,
  onSuccess,
}: ClubBoostPlansModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>('boost-basic');
  const [isLoading, setIsLoading] = useState(false);

  const selectedPlan = BOOST_PLANS.find((p) => p.id === selectedPlanId);

  const handleConfirmPlan = async () => {
    if (!selectedPlan || !clubId) {
      Alert.alert('Erreur', 'Impossible de sélectionner ce plan');
      return;
    }

    setIsLoading(true);
    try {
      // Si un boost actif existe déjà, le supprimer
      if (activeBoostId) {
        await deleteDoc(doc(db, 'clubSubscriptions', activeBoostId));
      }
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.durationDays);

      const subscriptionData = {
        clubId,
        currency: 'EUR',
        durationDays: selectedPlan.durationDays,
        endDate: Timestamp.fromDate(endDate),
        planId: selectedPlan.id,
        price: selectedPlan.price,
        startDate: Timestamp.fromDate(startDate),
        status: 'active',
        type: 'boost',
      };

      await addDoc(collection(db, 'clubSubscriptions'), subscriptionData);

      Alert.alert(
        'Succès',
        `Votre club a été boosté avec le plan ${selectedPlan.name} pour ${selectedPlan.durationDays} jours !`,
        [{ text: 'OK' }]
      );

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création du boost:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choisir un plan de boost</Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={palette.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
            {BOOST_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlanId === plan.id && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
                disabled={isLoading}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Ionicons name="star" size={14} color="#fff" />
                    <Text style={styles.popularBadgeText}>Populaire</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                  <View style={styles.radioButton}>
                    {selectedPlanId === plan.id && (
                      <View style={styles.radioButtonSelected}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price.toFixed(2)}€</Text>
                  <Text style={styles.planDuration}>pour {plan.durationDays} jours</Text>
                </View>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
              onPress={handleConfirmPlan}
              disabled={isLoading || !selectedPlan}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  Activer {selectedPlan?.name} - {selectedPlan?.price.toFixed(2)}€
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modalView: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 16,
    maxHeight: '95%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: palette.border,
    gap: 12,
  },
  planCardSelected: {
    borderColor: palette.primary,
    backgroundColor: '#f0fdf4',
  },
  planCardPopular: {
    backgroundColor: '#fffbf0',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  planDescription: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planPricing: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.primary,
  },
  planDuration: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 2,
  },
  featuresList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureText: {
    fontSize: 12,
    color: palette.text,
    flex: 1,
  },
  footer: {
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  confirmButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: palette.text,
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
