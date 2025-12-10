import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ClubFilters } from '@/hooks/useClubFilters';

const palette = {
  primary: '#2DB7A4',
  primaryDark: '#23a493',
  orange: '#F28B6F',
  purple: '#7C3AED',
  text: '#2E2E3A',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  border: '#E5E7EB',
};

interface FiltersModalProps {
  visible: boolean;
  filters: ClubFilters;
  onClose: () => void;
  onUpdateDistance: (distance: number) => void;
  onUpdatePriceRange: (price: string) => void;
  onUpdateSpecialties: (specialty: string) => void;
  onUpdateMinRating: (rating: string) => void;
  onToggleVerified: () => void;
  onReset: () => void;
  onApply: () => void;
}

const specialtyOptions = [
  'Dressage',
  'Obéissance',
  'Comportement',
  'Agility',
  'Chiots',
  'Compétition',
];

const ratingOptions = ['Toutes', '3+', '4+', '4.5+'];

export default function FiltersModal({
  visible,
  filters,
  onClose,
  onUpdateDistance,
  onUpdatePriceRange,
  onUpdateSpecialties,
  onUpdateMinRating,
  onToggleVerified,
  onReset,
  onApply,
}: FiltersModalProps) {
  const [localDistance, setLocalDistance] = useState(filters.distance);

  const handleDistanceChange = (newDistance: number) => {
    setLocalDistance(newDistance);
    onUpdateDistance(newDistance);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="formSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={palette.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Filtres avancés</Text>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.resetText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Distance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distance max : {localDistance} km</Text>
            <View style={styles.sliderWrapper}>
              <View style={styles.sliderContainer}>
                <View
                  style={[
                    styles.sliderTrack,
                    { width: `${(localDistance / 20) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.sliderThumb}>
                <View
                  style={[
                    styles.thumbDot,
                    { left: `${(localDistance / 20) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.distanceControls}>
              <TouchableOpacity
                style={styles.distanceButton}
                onPress={() => handleDistanceChange(Math.max(0, localDistance - 1))}
              >
                <Text style={styles.distanceButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.distanceValue}>{localDistance} km</Text>
              <TouchableOpacity
                style={styles.distanceButton}
                onPress={() => handleDistanceChange(Math.min(20, localDistance + 1))}
              >
                <Text style={styles.distanceButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.distanceLabels}>
              <Text style={styles.distanceLabel}>0 km</Text>
              <Text style={styles.distanceLabel}>20 km</Text>
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prix</Text>
            <View style={styles.priceButtons}>
              {['€', '€€', '€€€'].map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.priceButton,
                    filters.priceRange.includes(price) && styles.priceButtonActive,
                  ]}
                  onPress={() => onUpdatePriceRange(price)}
                >
                  <Text
                    style={[
                      styles.priceButtonText,
                      filters.priceRange.includes(price) &&
                        styles.priceButtonTextActive,
                    ]}
                  >
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spécialités</Text>
            {specialtyOptions.map((specialty) => (
              <View key={specialty} style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => onUpdateSpecialties(specialty)}
                >
                  {filters.specialties.includes(specialty) && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={palette.primary}
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>{specialty}</Text>
              </View>
            ))}
          </View>

          {/* Minimum Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Note minimum : {filters.minRating}</Text>
            <View style={styles.ratingButtons}>
              {ratingOptions.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    filters.minRating === rating && styles.ratingButtonActive,
                  ]}
                  onPress={() => onUpdateMinRating(rating)}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      filters.minRating === rating && styles.ratingButtonTextActive,
                    ]}
                  >
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Verified Only */}
          <View style={styles.section}>
            <View style={styles.verifiedRow}>
              <View>
                <Text style={styles.checkboxLabel}>Clubs vérifiés uniquement</Text>
                <Text style={styles.verifiedSubtitle}>Smart Dogs Verified</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleCheckbox,
                  filters.verifiedOnly && styles.toggleCheckboxActive,
                ]}
                onPress={onToggleVerified}
              >
                {filters.verifiedOnly && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApply}
          >
            <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
  },
  resetText: {
    color: palette.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 12,
  },
  sliderContainer: {
    height: 6,
    backgroundColor: palette.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sliderTrack: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 3,
  },
  sliderWrapper: {
    marginBottom: 16,
  },
  sliderThumb: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 8,
  },
  thumbDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.primary,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  distanceControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  distanceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: palette.primary,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: palette.text,
    minWidth: 60,
    textAlign: 'center',
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceLabel: {
    fontSize: 12,
    color: palette.gray,
  },
  priceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  priceButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  priceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.text,
  },
  priceButtonTextActive: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    color: palette.text,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  ratingButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  ratingButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.text,
  },
  ratingButtonTextActive: {
    color: '#fff',
  },
  verifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedSubtitle: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 4,
  },
  toggleCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleCheckboxActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  applyButton: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
