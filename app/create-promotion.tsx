import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebaseConfig';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  red: '#DC2626',
  redLight: '#FEE2E2',
  green: '#16A34A',
  greenLight: '#DCFCE7',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'createPromotion'>;

interface FormData {
  title: string;
  code: string;
  description: string;
  discountPercentage: string;
  validFrom: Date;
  validUntil: Date;
}

interface ValidationErrors {
  title?: string;
  code?: string;
  description?: string;
  discountPercentage?: string;
  validFrom?: string;
  validUntil?: string;
}

export default function CreatePromotionScreen({ navigation }: Props) {
  const { user, profile } = useAuth();
  const clubId = (profile as any)?.clubId || user?.uid || '';

  const [form, setForm] = useState<FormData>({
    title: '',
    code: '',
    description: '',
    discountPercentage: '',
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const validateCode = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;

    try {
      const q = query(
        collection(db, 'promotions'),
        where('clubId', '==', clubId),
        where('code', '==', code.toUpperCase().trim())
      );
      const snapshot = await getDocs(q);
      return snapshot.empty; // Retourne true si le code est unique
    } catch (err) {
      console.error('Erreur lors de la vérification du code:', err);
      return true; // En cas d'erreur, on laisse passer
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: ValidationErrors = {};

    // Validation titre
    if (!form.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    // Validation code
    if (!form.code.trim()) {
      newErrors.code = 'Le code de promotion est requis';
    } else if (form.code.length < 3) {
      newErrors.code = 'Le code doit contenir au moins 3 caractères';
    } else if (!await validateCode(form.code)) {
      newErrors.code = 'Ce code de promotion existe déjà';
    }

    // Validation description
    if (!form.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    // Validation pourcentage
    if (!form.discountPercentage.trim()) {
      newErrors.discountPercentage = 'La réduction est requise';
    } else {
      const percentage = parseInt(form.discountPercentage, 10);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.discountPercentage = 'La réduction doit être entre 0 et 100%';
      }
    }

    // Validation dates
    if (form.validUntil <= form.validFrom) {
      newErrors.validUntil = 'La date de fin doit être après la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!(await validateForm())) {
      Alert.alert('Erreur', 'Veuillez vérifier les champs');
      return;
    }

    setLoading(true);
    try {
      const newPromotion = {
        clubId,
        title: form.title.trim(),
        code: form.code.toUpperCase().trim(),
        description: form.description.trim(),
        discountPercentage: parseInt(form.discountPercentage, 10),
        isActive: true,
        validFrom: Timestamp.fromDate(form.validFrom),
        validUntil: Timestamp.fromDate(form.validUntil),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'promotions'), newPromotion);
      setLoading(false);
      Alert.alert('Succès', 'Promotion créée avec succès', [
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => navigation.goBack(), 100);
          },
        },
      ]);
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setLoading(false);
      Alert.alert('Erreur', 'Impossible de créer la promotion. Veuillez réessayer.');
    }
  };

  const handleFromDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setForm({ ...form, validFrom: selectedDate });
      if (Platform.OS === 'android') {
        setShowFromDatePicker(false);
      }
    } else if (Platform.OS === 'android') {
      setShowFromDatePicker(false);
    }
  };

  const handleUntilDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setForm({ ...form, validUntil: selectedDate });
      if (Platform.OS === 'android') {
        setShowUntilDatePicker(false);
      }
    } else if (Platform.OS === 'android') {
      setShowUntilDatePicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer une promotion</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Titre de la promotion <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ex: -20% sur les forfaits mensuels"
            placeholderTextColor={palette.gray}
            value={form.title}
            onChangeText={(text) => {
              setForm({ ...form, title: text });
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            editable={!loading}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Code */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Code de promotion <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.code && styles.inputError]}
            placeholder="Ex: PROMO2025"
            placeholderTextColor={palette.gray}
            value={form.code}
            onChangeText={(text) => {
              setForm({ ...form, code: text.toUpperCase() });
              if (errors.code) setErrors({ ...errors, code: undefined });
            }}
            editable={!loading}
            autoCapitalize="characters"
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Description <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textarea, errors.description && styles.inputError]}
            placeholder="Décrivez les avantages de cette promotion..."
            placeholderTextColor={palette.gray}
            value={form.description}
            onChangeText={(text) => {
              setForm({ ...form, description: text });
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            editable={!loading}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Pourcentage de réduction */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Réduction (%) <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <View style={styles.inputWithSuffix}>
            <TextInput
              style={[styles.input, styles.inputWithPadding, errors.discountPercentage && styles.inputError]}
              placeholder="Ex: 20"
              placeholderTextColor={palette.gray}
              value={form.discountPercentage}
              onChangeText={(text) => {
                setForm({ ...form, discountPercentage: text.replace(/[^0-9]/g, '') });
                if (errors.discountPercentage)
                  setErrors({ ...errors, discountPercentage: undefined });
              }}
              editable={!loading}
              keyboardType="numeric"
            />
            <Text style={styles.suffix}>%</Text>
          </View>
          {errors.discountPercentage && (
            <Text style={styles.errorText}>{errors.discountPercentage}</Text>
          )}
        </View>

        {/* Date de début */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Valide à partir de <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.validFrom && styles.inputError]}
            onPress={() => setShowFromDatePicker(true)}
            disabled={loading}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={palette.primary} />
            <Text style={styles.dateButtonText}>{formatDate(form.validFrom)}</Text>
          </TouchableOpacity>
          {errors.validFrom && <Text style={styles.errorText}>{errors.validFrom}</Text>}

          {showFromDatePicker && (
            <DateTimePicker
              value={form.validFrom}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleFromDateChange}
            />
          )}
          {Platform.OS === 'ios' && showFromDatePicker && (
            <View style={styles.datePickerButtons}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowFromDatePicker(false)}
              >
                <Text style={styles.datePickerButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date de fin */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Valide jusqu'au <Text style={{ color: palette.red }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.validUntil && styles.inputError]}
            onPress={() => setShowUntilDatePicker(true)}
            disabled={loading}
          >
            <MaterialCommunityIcons name="calendar" size={20} color={palette.primary} />
            <Text style={styles.dateButtonText}>{formatDate(form.validUntil)}</Text>
          </TouchableOpacity>
          {errors.validUntil && <Text style={styles.errorText}>{errors.validUntil}</Text>}

          {showUntilDatePicker && (
            <DateTimePicker
              value={form.validUntil}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleUntilDateChange}
            />
          )}
          {Platform.OS === 'ios' && showUntilDatePicker && (
            <View style={styles.datePickerButtons}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowUntilDatePicker(false)}
              >
                <Text style={styles.datePickerButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bouton de création */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.createButton, !loading && styles.createButtonActive]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-done" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Créer la promotion</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
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
  inputError: {
    borderColor: palette.red,
    backgroundColor: palette.redLight,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithSuffix: {
    position: 'relative',
  },
  inputWithPadding: {
    paddingRight: 40,
  },
  suffix: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
    fontSize: 14,
    fontWeight: '600',
    color: palette.gray,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: palette.text,
    flex: 1,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 12,
  },
  datePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: palette.primary,
    borderRadius: 6,
  },
  datePickerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: palette.red,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    backgroundColor: palette.gray,
    opacity: 0.6,
  },
  createButtonActive: {
    backgroundColor: palette.primary,
    opacity: 1,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
