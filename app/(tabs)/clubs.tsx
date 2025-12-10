import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import UserBottomNav from '@/components/UserBottomNav';
import { UserStackParamList } from '@/navigation/types';
import FiltersModal from '@/components/FiltersModal';
import { useClubFilters } from '@/hooks/useClubFilters';
import { useFetchClubs, filterClubs, Club } from '@/hooks/useFetchClubs';
import { useFetchEducators, Educator } from '@/hooks/useFetchEducators';
import { useFetchEvents, Event } from '@/hooks/useFetchEvents';
import { useFavorites } from '@/hooks/useFavorites';

const palette = {
  primary: '#2DB7A4',
  primaryDark: '#23a493',
  orange: '#F28B6F',
  purple: '#7C3AED',
  text: '#2E2E3A',
  gray: '#6B7280',
  border: '#E5E7EB',
  chip: '#F4F5F7',
};

type ClubsNavigationProp = NativeStackNavigationProp<UserStackParamList, 'clubs'>;

type CardBase = Club | Educator | Event | {
  id: number | string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  distance?: string;
  verified?: boolean;
  rating?: number;
  reviews?: number;
  price?: string;
  tagColor?: string;
  tagLabel?: string;
};

const favoriteCards: CardBase[] = [];

const homeTrainers: CardBase[] = [];

export default function ClubsScreen() {
  const navigation = useNavigation<ClubsNavigationProp>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Récupérer les données depuis Firebase
  const { clubs, loading: clubsLoading, error: clubsError } = useFetchClubs();
  const { educators, loading: educatorsLoading, error: educatorsError } = useFetchEducators();
  const { events, loading: eventsLoading, error: eventsError } = useFetchEvents();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  
  const loading = clubsLoading || educatorsLoading || eventsLoading;
  const error = clubsError || educatorsError || eventsError;
  
  const {
    filters,
    updateDistance,
    updatePriceRange,
    updateSpecialties,
    updateMinRating,
    toggleVerifiedOnly,
    resetFilters,
  } = useClubFilters();

  // Filtrer les clubs en fonction des critères sélectionnés
  const filteredClubs = useMemo(() => {
    return filterClubs(
      clubs,
      filters.distance,
      filters.priceRange,
      filters.specialties,
      filters.minRating,
      filters.verifiedOnly,
      query
    );
  }, [clubs, filters, query]);

  // Combiner toutes les données selon le filtre sélectionné
  const displayedItems = useMemo(() => {
    switch (filter) {
      case 'clubs':
        return filteredClubs;
      case 'trainers':
        return educators.filter(edu => {
          if (query.trim()) {
            const q = query.toLowerCase();
            return edu.title?.toLowerCase().includes(q) || edu.subtitle?.toLowerCase().includes(q);
          }
          return true;
        });
      case 'events':
        return events.filter(evt => {
          if (query.trim()) {
            const q = query.toLowerCase();
            return evt.title?.toLowerCase().includes(q) || evt.description?.toLowerCase().includes(q);
          }
          return true;
        });
      case 'all':
      default:
        return [...filteredClubs, ...educators, ...events];
    }
  }, [filter, filteredClubs, educators, events, query]);

  // Récupérer les favoris de tous les types
  const favoriteItems = useMemo(() => {
    return [...clubs, ...educators, ...events].filter(item => isFavorite(item.id as string));
  }, [clubs, educators, events, isFavorite]);

  const getNumericId = (id: string | number): number => {
    if (typeof id === 'number') return id;
    // Pour les IDs Firestore (string), créer un hash numérique déterministe
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en entier 32-bit
    }
    return Math.abs(hash % 100000) + 1000;
  };

  const getSectionTitles = () => {
    switch (filter) {
      case 'clubs':
        return {
          boosted: 'Clubs Boostés',
          favorites: 'Mes clubs favoris',
          near: 'Clubs près de vous',
          new: 'Nouveaux clubs',
          special: 'Clubs spécialisés',
        };
      case 'trainers':
        return {
          boosted: 'Dresseurs populaires',
          favorites: 'Mes dresseurs favoris',
          near: 'Dresseurs près de vous',
          new: 'Nouveaux dresseurs',
          special: 'Dresseurs spécialisés',
        };
      case 'events':
        return {
          boosted: 'Événements populaires',
          favorites: 'Mes événements',
          near: 'Événements à proximité',
          new: 'Événements à venir',
          special: 'Événements spécialisés',
        };
      case 'all':
      default:
        return {
          boosted: 'Clubs Boostés',
          favorites: 'Mes favoris',
          near: 'Clubs près de vous',
          new: 'Nouveaux clubs',
          special: 'Agility & Sport canin',
        };
    }
  };

  const getItemType = (item: CardBase): 'club' | 'educator' | 'event' => {
    // Vérifier par les propriétés spécifiques de chaque type
    if ('startDate' in item) return 'event';
    if ('experienceYears' in item) return 'educator';
    if ('priceLevel' in item) return 'club';
    // Par défaut, déduire du type de données
    return 'club';
  };

  const titles = getSectionTitles();

  const handleCardPress = (card: CardBase) => {
    const itemType = getItemType(card);
    
    console.log('🔗 [clubs] Card pressed:', {
      cardId: card.id,
      itemType,
      cardData: card,
    });
    
    if (itemType === 'event') {
      console.log('🎉 [clubs] Navigating to eventDetail with ID:', card.id);
      navigation.navigate('eventDetail', { eventId: card.id as string, clubId: card.id as string });
    } else if (itemType === 'educator') {
      console.log('👨‍🏫 [clubs] Navigating to educatorDetail with ID:', card.id);
      navigation.navigate('educatorDetail', { educatorId: card.id as string });
    } else {
      console.log('📍 [clubs] Navigating to clubDetail with ID:', card.id);
      navigation.navigate('clubDetail', { clubId: card.id as string });
    }
  };

  const Section = ({
    title,
    action,
    children,
  }: {
    title: string;
    action?: () => void;
    children: React.ReactNode;
  }) => (
    <View style={{ gap: 10 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action ? (
          <TouchableOpacity onPress={action}>
            <Text style={styles.link}>Voir tout</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );

  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={active ? styles.chipTextActive : styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );

  const SmallCard = ({ item }: { item: CardBase }) => (
    <TouchableOpacity style={styles.smallCard} activeOpacity={0.9} onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.image }} style={styles.smallImage} />
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.smallMetaRow}>
          <Text style={styles.smallTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id as string, getItemType(item))}>
            <Ionicons
              name={isFavorite(item.id as string) ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorite(item.id as string) ? palette.orange : palette.gray}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.smallSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <View style={styles.smallMetaRow}>
          {item.rating ? (
            <View style={styles.inline}>
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.subMeta}>
                {item.rating} ({item.reviews})
              </Text>
            </View>
          ) : null}
          {item.distance ? (
            <View style={styles.inline}>
              <Ionicons name="location-outline" size={12} color={palette.gray} />
              <Text style={styles.subMeta}>{item.distance}</Text>
            </View>
          ) : null}
          {item.verified ? (
            <View style={styles.badgeSoft}>
              <Text style={styles.badgeSoftText}>Verified</Text>
            </View>
          ) : null}
        </View>
        {item.price ? <Text style={styles.subMeta}>{item.price}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  const TileCard = ({ item }: { item: CardBase }) => (
    <TouchableOpacity style={styles.tileCard} activeOpacity={0.9} onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.image }} style={styles.tileImage} />
      {('badge' in item && item.badge) ? (
        <View style={[styles.badgePill, { backgroundColor: '#FFF1EB' }]}>
          <Text style={[styles.badgePillText, { color: palette.orange }]}>{'badge' in item ? item.badge : ''}</Text>
        </View>
      ) : null}
      <TouchableOpacity style={styles.favFab} onPress={() => toggleFavorite(item.id as string, getItemType(item))}>
        <Ionicons
          name={isFavorite(item.id as string) ? 'heart' : 'heart-outline'}
          size={16}
          color={isFavorite(item.id as string) ? palette.orange : '#fff'}
        />
      </TouchableOpacity>
      <View style={{ padding: 10, gap: 6 }}>
        <Text style={styles.tileTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.tileSubtitle}>{item.subtitle}</Text>
        <View style={styles.metaRow}>
          {item.rating ? (
            <View style={styles.inline}>
              <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.subMeta}>
                {item.rating} ({item.reviews})
              </Text>
            </View>
          ) : null}
          {item.distance ? (
            <View style={styles.inline}>
              <Ionicons name="location-outline" size={12} color={palette.gray} />
              <Text style={styles.subMeta}>{item.distance}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.metaRow}>
          {'tagLabel' in item && item.tagLabel ? (
            <View style={[styles.badgeSoft, { backgroundColor: ('tagColor' in item ? item.tagColor : '#E0F2F1') ?? '#E0F2F1' }]}>
              <Text style={[styles.badgeSoftText, { color: palette.text }]}>{'tagLabel' in item ? item.tagLabel : ''}</Text>
            </View>
          ) : null}
          {item.verified ? (
            <View style={styles.badgeSoft}>
              <Text style={styles.badgeSoftText}>Verified</Text>
            </View>
          ) : null}
          {item.price ? <Text style={styles.subMeta}>{item.price}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: palette.primary, paddingTop: 6, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 24 }}>
          <View style={styles.hero}>
            <Text style={styles.heading}>Découvrir</Text>
            <Text style={styles.subheading}>Tous les clubs et éducateurs</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Rechercher clubs, dresseurs, évènements"
                placeholderTextColor="#9CA3AF"
                value={query}
                onChangeText={setQuery}
                style={{ flex: 1, color: palette.text }}
              />
              <TouchableOpacity onPress={() => setShowFilters(true)}>
                <Ionicons name="options-outline" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <View style={styles.heroCards}>
              <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
                <View style={[styles.heroIcon, { backgroundColor: '#FFF7ED' }]}>
                  <MaterialCommunityIcons name="medal-outline" size={18} color={palette.orange} />
                </View>
                <Text style={styles.heroCardTitle}>Top Éducateurs</Text>
                <Text style={styles.heroCardSub}>Classement du mois</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroCard} activeOpacity={0.9}>
                <View style={[styles.heroIcon, { backgroundColor: '#F3E8FF' }]}>
                  <MaterialCommunityIcons name="trophy-outline" size={18} color={palette.purple} />
                </View>
                <Text style={styles.heroCardTitle}>Inter-Clubs</Text>
                <Text style={styles.heroCardSub}>Compétition amicale</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 18 }}>
          <View style={styles.filtersRow}>
            <Chip label="Tous" active={filter === 'all'} onPress={() => setFilter('all')} />
            <Chip label="Clubs" active={filter === 'clubs'} onPress={() => setFilter('clubs')} />
            <Chip label="Dresseurs" active={filter === 'trainers'} onPress={() => setFilter('trainers')} />
            <Chip label="Évènements" active={filter === 'events'} onPress={() => setFilter('events')} />
          </View>

          <Section title={titles.boosted}>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : displayedItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {displayedItems.slice(0, 4).map((item) => (
                  <TileCard key={item.id} item={item as any} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Aucun résultat</Text>
            )}
          </Section>

          <Section title={titles.favorites}>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : favoriteItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {favoriteItems.slice(0, 4).map((item) => (
                  <TileCard key={item.id} item={item as any} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Vous n'avez pas encore de favoris</Text>
            )}
          </Section>

          <Section title={titles.near} action={() => navigation.navigate('home')}>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : displayedItems.length > 0 ? (
              <View style={styles.grid2}>
                {displayedItems.slice(0, 6).map((item) => (
                  <SmallCard key={item.id} item={item as any} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Aucun résultat</Text>
            )}
          </Section>

          <Section title={titles.new}>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : displayedItems.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {displayedItems.slice(4, 8).map((item) => (
                  <TileCard key={item.id} item={item as any} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Aucun résultat</Text>
            )}
          </Section>

          <Section title={titles.special}>
            {loading ? (
              <Text style={styles.loadingText}>Chargement...</Text>
            ) : displayedItems.length > 0 ? (
              <View style={styles.grid2}>
                {displayedItems.slice(0, 4).map((item) => (
                  <SmallCard key={item.id} item={item as any} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Aucun résultat</Text>
            )}
          </Section>
        </View>
      </ScrollView>
      
      <FiltersModal
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onUpdateDistance={updateDistance}
        onUpdatePriceRange={updatePriceRange}
        onUpdateSpecialties={updateSpecialties}
        onUpdateMinRating={updateMinRating}
        onToggleVerified={toggleVerifiedOnly}
        onReset={resetFilters}
        onApply={() => {
          // Ici on va implémenter le filtrage des clubs
          setShowFilters(false);
        }}
      />
      
      <UserBottomNav current="clubs" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { paddingTop: 0, paddingBottom: 130, gap: 18 },
  hero: {
    padding: 16,
    gap: 12,
  },
  heading: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  subheading: { color: '#fff', fontSize: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroCards: { flexDirection: 'row', gap: 10 },
  heroCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  heroIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCardTitle: { color: palette.text, fontWeight: '700' },
  heroCardSub: { color: palette.gray, fontSize: 12 },
  filtersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: palette.chip,
  },
  chipActive: { backgroundColor: '#E0F2F1' },
  chipText: { color: palette.gray, fontWeight: '600' },
  chipTextActive: { color: palette.primary, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '800' },
  link: { color: palette.primary, fontWeight: '700' },
  tileCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  tileImage: { width: '100%', height: 120 },
  favFab: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  tileSubtitle: { color: palette.gray, fontSize: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subMeta: { color: palette.gray, fontSize: 12 },
  badgeSoft: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeSoftText: { color: '#0F766E', fontWeight: '700', fontSize: 11 },
  badgePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: { fontWeight: '700', fontSize: 11 },
  grid2: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  smallCard: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  smallImage: { width: '100%', height: 120 },
  smallTitle: { color: palette.text, fontWeight: '700', fontSize: 14 },
  smallSubtitle: { color: palette.gray, fontSize: 12 },
  smallMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  loadingText: { color: palette.gray, fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  errorText: { color: '#DC2626', fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  emptyText: { color: palette.gray, fontSize: 14, textAlign: 'center', paddingVertical: 16 },
});
