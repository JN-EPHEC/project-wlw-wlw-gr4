import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { useClubPromotions, Promotion } from '@/hooks/useClubPromotions';

type Props = NativeStackScreenProps<ClubStackParamList, 'promotionDetail'>;

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  success: '#10B981',
  danger: '#EF4444',
  orange: '#F59E0B',
};

export default function PromotionDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { promotionId } = route.params;
  const { promotions, deletePromotion, loading } = useClubPromotions(user?.uid || null);
  
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const promo = promotions.find(p => p.id === promotionId);
    if (promo) {
      setPromotion(promo);
    }
  }, [promotionId, promotions]);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la promotion',
      'Êtes-vous sûr de vouloir supprimer cette promotion ?',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              setDeleting(true);
              await deletePromotion(promotionId);
              Alert.alert('Succès', 'Promotion supprimée avec succès');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Erreur', 'Impossible de supprimer la promotion');
            } finally {
              setDeleting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
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

  if (!promotion) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Promotion non trouvée</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isActive = promotion.isActive && new Date(promotion.validUntil?.toDate?.() || promotion.validUntil) > new Date();
  const validFromDate = new Date(promotion.validFrom?.toDate?.() || promotion.validFrom);
  const validUntilDate = new Date(promotion.validUntil?.toDate?.() || promotion.validUntil);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails de la promotion</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Contenu */}
        <View style={styles.content}>
          {/* Badge de statut */}
          <View style={[styles.statusBadge, { backgroundColor: isActive ? palette.success : palette.gray }]}>
            <Ionicons name={isActive ? 'checkmark-circle' : 'close-circle'} size={16} color="#fff" />
            <Text style={styles.statusBadgeText}>{isActive ? 'Active' : 'Inactive'}</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>{promotion.title}</Text>

          {/* Code et réduction */}
          <View style={styles.codeCard}>
            <View style={styles.codeSection}>
              <Text style={styles.codeLabel}>Code promo</Text>
              <Text style={styles.codeValue}>{promotion.code}</Text>
            </View>
            <View style={styles.discountSection}>
              <Text style={styles.discountLabel}>Réduction</Text>
              <Text style={styles.discountValue}>-{promotion.discountPercentage}%</Text>
            </View>
          </View>

          {/* Description */}
          {promotion.description && (
            <View>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{promotion.description}</Text>
            </View>
          )}

          {/* Dates */}
          <View>
            <Text style={styles.sectionTitle}>Période de validité</Text>
            <View style={styles.datesCard}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color={palette.primary} />
                <View>
                  <Text style={styles.dateLabel}>Début</Text>
                  <Text style={styles.dateValue}>{validFromDate.toLocaleDateString('fr-FR')}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color={palette.primary} />
                <View>
                  <Text style={styles.dateLabel}>Fin</Text>
                  <Text style={styles.dateValue}>{validUntilDate.toLocaleDateString('fr-FR')}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('editPromotion', { promotionId })}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={deleting}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteButtonText}>{deleting ? 'Suppression...' : 'Supprimer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 30,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
  },
  codeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
  },
  codeSection: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '500',
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  discountSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  discountLabel: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '500',
    marginBottom: 4,
  },
  discountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.orange,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: palette.gray,
    lineHeight: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  datesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  dateLabel: {
    fontSize: 12,
    color: palette.gray,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: palette.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: palette.danger,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: palette.text,
  },
});
