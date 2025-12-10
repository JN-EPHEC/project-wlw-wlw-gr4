import { useState } from 'react';

export interface ClubFilters {
  distance: number; // en km (max)
  priceRange: string[]; // '€', '€€', '€€€'
  specialties: string[]; // 'Dressage', 'Obéissance', 'Comportement', 'Agility', etc.
  minRating: string; // 'Toutes', '3+', '4+', '4.5+'
  verifiedOnly: boolean;
}

export const useClubFilters = () => {
  const [filters, setFilters] = useState<ClubFilters>({
    distance: 10,
    priceRange: [],
    specialties: [],
    minRating: 'Toutes',
    verifiedOnly: false,
  });

  const updateDistance = (distance: number) => {
    setFilters(prev => ({ ...prev, distance }));
  };

  const updatePriceRange = (price: string) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter(p => p !== price)
        : [...prev.priceRange, price],
    }));
  };

  const updateSpecialties = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const updateMinRating = (rating: string) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  };

  const toggleVerifiedOnly = () => {
    setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }));
  };

  const resetFilters = () => {
    setFilters({
      distance: 10,
      priceRange: [],
      specialties: [],
      minRating: 'Toutes',
      verifiedOnly: false,
    });
  };

  return {
    filters,
    updateDistance,
    updatePriceRange,
    updateSpecialties,
    updateMinRating,
    toggleVerifiedOnly,
    resetFilters,
  };
};
