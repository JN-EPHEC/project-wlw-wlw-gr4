import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavorites } from '@/hooks/useFavorites';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'followedClubs'>;

interface ClubData {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  logo?: string;
}

export default function FollowedClubsScreen({ navigation }: Props) {
  const { favorites } = useFavorites();
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        // Extraire les IDs des clubs favoris depuis la Map
        const clubIds = Array.from(favorites.entries())
          .filter(([, type]) => type === 'club')
          .map(([itemId]) => itemId);

        if (clubIds.length === 0) {
          setClubs([]);
          setLoading(false);
          return;
        }

        const clubsData: ClubData[] = [];
        for (const clubId of clubIds) {
          const clubDoc = await getDoc(doc(db, 'club', clubId));
          if (clubDoc.exists()) {
            clubsData.push({
              id: clubDoc.id,
              name: clubDoc.data().name || 'Sans nom',
              description: clubDoc.data().description || '',
              location: clubDoc.data().location || '',
              phone: clubDoc.data().phone || '',
              logo: clubDoc.data().logo,
            });
          }
        }

        setClubs(clubsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des clubs:', err);
        setError('Erreur lors du chargement des clubs');
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, [favorites]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Clubs suivis</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#41B6A6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Clubs suivis</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (clubs.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Clubs suivis</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Aucun club suivi</Text>
          <Text style={styles.emptyText}>Découvrez et suivez des clubs</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('clubs' as any)}
          >
            <Text style={styles.exploreButtonText}>Explorer les clubs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour compte</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Clubs suivis</Text>
      </View>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clubCard}
            onPress={() => navigation.navigate('clubDetail', { clubId: item.id })}
          >
            {item.logo && (
              <Image source={{ uri: item.logo }} style={styles.clubLogo} />
            )}
            {!item.logo && (
              <View style={[styles.clubLogo, styles.logoPlaceholder]}>
                <Text style={styles.logoText}>🐕</Text>
              </View>
            )}
            <View style={styles.clubInfo}>
              <Text style={styles.clubName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              {item.location && (
                <Text style={styles.detail}>📍 {item.location}</Text>
              )}
              {item.phone && (
                <Text style={styles.detail}>📞 {item.phone}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#41B6A6', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', marginBottom: 16, textAlign: 'center' },
  exploreButton: {
    backgroundColor: '#41B6A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: { color: '#FFF', fontWeight: '600', textAlign: 'center' },
  listContent: { padding: 16, gap: 12 },
  clubCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  clubLogo: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#E5E7EB' },
  logoPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 32 },
  clubInfo: { flex: 1, justifyContent: 'space-between' },
  clubName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  description: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  detail: { fontSize: 12, color: '#4B5563', marginTop: 2 },
});
