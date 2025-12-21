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
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import { useClubPromotions, Promotion } from '@/hooks/useClubPromotions';

type Props = NativeStackScreenProps<ClubStackParamList, 'editPromotion'>;

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

export default function EditPromotionScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const promotionId = route.params?.promotionId;
  const { promotions, updatePromotion, addPromotion, refetch } = useClubPromotions(user?.uid || null);
  
  const [loading, setLoading] = useState(!!promotionId);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [isActive, setIsActive] = useState(true);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de la promotion si en mode édition
  useEffect(() => {
    if (promotionId) {
      const promotion = promotions.find(p => p.id === promotionId);
      if (promotion) {
        setTitle(promotion.title);
        setDescription(promotion.description);
        setCode(promotion.code);
        setDiscountPercentage(promotion.discountPercentage.toString());
        setValidFrom(promotion.validFrom?.toDate?.() || new Date(promotion.validFrom));
        setValidUntil(promotion.validUntil?.toDate?.() || new Date(promotion.validUntil));
        setIsActive(promotion.isActive);
        setLoading(false);
      }
    }
  }, [promotionId, promotions]);

  const handleFromDateChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowFromDatePicker(false);
    }
    if (selectedDate) {
      console.log('Setting validFrom to:', selectedDate);
      setValidFrom(new Date(selectedDate));
    }
    if (Platform.OS === 'ios') {
      setShowFromDatePicker(false);
    }
  };

  const handleUntilDateChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowUntilDatePicker(false);
    }
    if (selectedDate) {
      console.log('Setting validUntil to:', selectedDate);
      setValidUntil(new Date(selectedDate));
    }
    if (Platform.OS === 'ios') {
      setShowUntilDatePicker(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !code.trim() || !discountPercentage) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    if (parseInt(discountPercentage) < 0 || parseInt(discountPercentage) > 100) {
      Alert.alert('Erreur', 'La réduction doit être entre 0% et 100%');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const promotionData = {
        title: title.trim(),
        description: description.trim(),
        code: code.trim().toUpperCase(),
        discountPercentage: parseInt(discountPercentage),
        validFrom,
        validUntil,
        isActive,
      };

      if (promotionId) {
        await updatePromotion(promotionId, promotionData);
        refetch();
        navigation.replace('clubProfile' as any);
      } else {
        await addPromotion(promotionData as any);
        refetch();
        navigation.replace('clubProfile' as any);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
      Alert.alert('Erreur', 'Impossible de sauvegarder la promotion');
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
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{promotionId ? 'Modifier' : 'Créer'} une promotion</Text>
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
              {/* Titre */}
              <View>
                <Text style={styles.label}>Titre de la promotion *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: -20% sur les forfaits mensuels"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Description */}
              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Détails supplémentaires sur la promotion..."
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor={palette.gray}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Code promo */}
              <View>
                <Text style={styles.label}>Code promo *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: OCT2025"
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase())}
                  placeholderTextColor={palette.gray}
                />
              </View>

              {/* Réduction */}
              <View>
                <Text style={styles.label}>Réduction (%) *</Text>
                <View style={styles.discountInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 20"
                    value={discountPercentage}
                    onChangeText={setDiscountPercentage}
                    placeholderTextColor={palette.gray}
                    keyboardType="numeric"
                  />
                  <Text style={styles.percentSign}>%</Text>
                </View>
              </View>

              {/* Date de début */}
              <View>
                <Text style={styles.label}>Date de début</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color={palette.primary} />
                  <Text style={styles.dateButtonText}>
                    {validFrom.toLocaleDateString('fr-FR')}
                  </Text>
                </TouchableOpacity>
                <Modal
                  visible={showFromDatePicker}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowFromDatePicker(false)}
                >
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerContent}>
                      <View style={styles.datePickerHeader}>
                        <TouchableOpacity onPress={() => setShowFromDatePicker(false)}>
                          <Text style={styles.datePickerButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <Text style={styles.datePickerTitle}>Date de début</Text>
                        <TouchableOpacity onPress={() => setShowFromDatePicker(false)}>
                          <Text style={[styles.datePickerButtonText, { color: palette.primary }]}>OK</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={validFrom}
                        mode="date"
                        display="spinner"
                        onChange={handleFromDateChange}
                        textColor={palette.text}
                      />
                    </View>
                  </View>
                </Modal>
              </View>

              {/* Date de fin */}
              <View>
                <Text style={styles.label}>Date de fin *</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowUntilDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color={palette.primary} />
                  <Text style={styles.dateButtonText}>
                    {validUntil.toLocaleDateString('fr-FR')}
                  </Text>
                </TouchableOpacity>
                <Modal
                  visible={showUntilDatePicker}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowUntilDatePicker(false)}
                >
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerContent}>
                      <View style={styles.datePickerHeader}>
                        <TouchableOpacity onPress={() => setShowUntilDatePicker(false)}>
                          <Text style={styles.datePickerButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <Text style={styles.datePickerTitle}>Date de fin</Text>
                        <TouchableOpacity onPress={() => setShowUntilDatePicker(false)}>
                          <Text style={[styles.datePickerButtonText, { color: palette.primary }]}>OK</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={validUntil}
                        mode="date"
                        display="spinner"
                        onChange={handleUntilDateChange}
                        textColor={palette.text}
                      />
                    </View>
                  </View>
                </Modal>
              </View>

              {/* Activer/Désactiver */}
              <View style={styles.toggleRow}>
                <Text style={styles.label}>Promotion active</Text>
                <TouchableOpacity
                  style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
                  onPress={() => setIsActive(!isActive)}
                >
                  <View style={[styles.toggleDot, isActive && styles.toggleDotActive]} />
                </TouchableOpacity>
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
    minHeight: 80,
  },
  discountInput: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentSign: {
    position: 'absolute',
    right: 12,
    fontSize: 16,
    fontWeight: '600',
    color: palette.gray,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
  },
  dateButtonText: {
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
  datePickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  datePickerHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  datePickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.gray,
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
