import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useClubBoostBadge } from '@/hooks/useClubBoostBadge';

interface Club {
  id: number | string;
  name: string;
  rating: number;
  verified: boolean;
  distance: string;
  city: string;
  speciality: string;
  image: string;
}

interface BoostedClubCardProps {
  club: Club;
  width: number;
  onPress: () => void;
}

const palette = {
  primary: '#41B6A6',
};

export default function BoostedClubCard({ club, width, onPress }: BoostedClubCardProps) {
  const boostBadge = useClubBoostBadge(String(club.id));

  return (
    <TouchableOpacity
      key={club.id}
      style={[styles.boostCard, { width }]}
      onPress={onPress}
    >
      <Image source={{ uri: club.image }} style={styles.boostImage} />
      <View style={[StyleSheet.absoluteFill, styles.boostOverlay]} />

      {/* Badge de boost - toujours affichée pour les clubs dans cette section */}
      <View style={styles.boostBadge}>
        <MaterialCommunityIcons name="lightning-bolt" size={14} color="#fff" />
        <Text style={styles.boostBadgeText}>Boosté</Text>
      </View>

      {club.rating > 0 && (
        <View style={styles.boostRating}>
          <MaterialCommunityIcons name="star" size={14} color="#E9B782" />
          <Text style={styles.boostRatingText}>{club.rating}</Text>
        </View>
      )}

      <View style={styles.boostContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.boostTitle}>{club.name}</Text>
          {club.verified ? (
            <MaterialCommunityIcons name="check-decagram" size={18} color="#fff" style={{ marginLeft: 6 }} />
          ) : null}
        </View>
        <Text style={styles.boostSub}>{club.speciality}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="location-outline" size={14} color="#fff" />
          <Text style={styles.boostSub}>{club.distance} • {club.city}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boostCard: { borderRadius: 16, overflow: 'hidden', height: 200, justifyContent: 'flex-end' },
  boostImage: { width: '100%', height: '100%' },
  boostOverlay: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16 },
  boostBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  boostBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  boostRating: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boostRatingText: { color: '#1F2937', fontWeight: '700', fontSize: 12 },
  boostContent: { position: 'absolute', left: 14, right: 14, bottom: 12 },
  boostTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  boostSub: { color: '#E5E7EB', fontSize: 12, marginTop: 4 },
});
