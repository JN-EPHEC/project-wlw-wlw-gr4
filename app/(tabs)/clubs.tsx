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

type CardBase = {
  id: number;
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

const featuredCards: CardBase[] = [
  {
    id: 201,
    title: 'Compétition Régionale Agility',
    subtitle: 'Par Agility Pro',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    badge: 'Event',
    distance: '3 km',
    rating: 4.8,
    reviews: 127,
    price: '25 €',
    tagColor: '#8B5CF6',
    tagLabel: '20 participants',
  },
  {
    id: 101,
    title: 'Canin Club Paris',
    subtitle: 'Dressage',
    image: 'https://images.unsplash.com/photo-1505623774485-923554bb2792?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    verified: true,
    price: '€€',
  },
];

const boosted: CardBase[] = [
  {
    id: 102,
    title: 'Elite Dog Training',
    subtitle: 'Compétition',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 245,
    distance: '0.8 km',
    verified: true,
    price: '€€€',
    badge: 'Premium',
  },
  {
    id: 103,
    title: 'Champions',
    subtitle: 'Agility Pro',
    image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 189,
    distance: '1.5 km',
    verified: true,
    price: '€€',
    badge: 'Boosté',
  },
];

const homeTrainers: CardBase[] = [
  {
    id: 301,
    title: 'Marie Dupont',
    subtitle: 'Éducation positive',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 87,
    distance: '1.2 km',
    price: '40 €/h',
    tagLabel: '3 ans exp.',
    tagColor: '#E5E7EB',
  },
  {
    id: 302,
    title: 'Jean Martin',
    subtitle: 'Comportement',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 124,
    distance: '2.4 km',
    price: '45 €/h',
    tagLabel: '6 ans exp.',
    tagColor: '#E5E7EB',
  },
];

const nearClubs: CardBase[] = [
  {
    id: 104,
    title: 'Canin Club Paris',
    subtitle: 'Dressage',
    image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    verified: true,
    price: '€€',
  },
  {
    id: 105,
    title: 'Agility Pro',
    subtitle: 'Sport canin',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 108,
    distance: '1.8 km',
    verified: true,
    price: '€€€',
  },
];

const newClubs: CardBase[] = [
  {
    id: 106,
    title: 'Dog Academy Plus',
    subtitle: 'Obéissance',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: 12,
    distance: '2.8 km',
    price: '€€',
    badge: 'Nouveau',
  },
  {
    id: 107,
    title: 'Puppy Paradise',
    subtitle: 'Socialisation',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 23,
    distance: '3.1 km',
    price: '€€',
    badge: 'Nouveau',
  },
];

const agility: CardBase[] = [
  {
    id: 108,
    title: 'Agility Champions',
    subtitle: 'Agility Pro',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 132,
    distance: '1.8 km',
    price: '€€€',
    verified: true,
  },
  {
    id: 109,
    title: 'Speed Dogs',
    subtitle: 'Sport canin',
    image: 'https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 90,
    distance: '2.5 km',
    price: '€€',
  },
];

export default function ClubsScreen() {
  const navigation = useNavigation<ClubsNavigationProp>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const favorites = useMemo(() => [101, 201, 301, 108], []);

  const handleCardPress = (card: CardBase) => {
    if (card.id >= 200) {
      navigation.navigate('eventDetail', { eventId: card.id, clubId: card.id });
    } else {
      navigation.navigate('clubDetail', { clubId: card.id });
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
          <TouchableOpacity>
            <Ionicons
              name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
              size={16}
              color={favorites.includes(item.id) ? palette.orange : palette.gray}
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
      {item.badge ? (
        <View style={[styles.badgePill, { backgroundColor: '#FFF1EB' }]}>
          <Text style={[styles.badgePillText, { color: palette.orange }]}>{item.badge}</Text>
        </View>
      ) : null}
      <TouchableOpacity style={styles.favFab}>
        <Ionicons
          name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={16}
          color={favorites.includes(item.id) ? palette.orange : '#fff'}
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
          {item.tagLabel ? (
            <View style={[styles.badgeSoft, { backgroundColor: item.tagColor ?? '#E0F2F1' }]}>
              <Text style={[styles.badgeSoftText, { color: palette.text }]}>{item.tagLabel}</Text>
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
        <View style={{ backgroundColor: palette.primary, paddingTop: 6, paddingHorizontal: 0 }}>
          <View style={[styles.hero, { marginHorizontal: 0, marginTop: 0 }]}>
            <Text style={styles.heading}>Découvrir</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Rechercher clubs, dresseurs, évènements"
                placeholderTextColor="#9CA3AF"
                value={query}
                onChangeText={setQuery}
                style={{ flex: 1, color: palette.text }}
              />
              <Ionicons name="options-outline" size={18} color="#9CA3AF" />
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

          <Section title="Mes favoris">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {featuredCards.map((item) => (
                <TileCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Clubs Boostés">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {boosted.map((item) => (
                <TileCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Éducateurs à domicile" action={() => navigation.navigate('home')}>
            <View style={styles.grid2}>
              {homeTrainers.map((item) => (
                <SmallCard key={item.id} item={item} />
              ))}
            </View>
          </Section>

          <Section title="Clubs près de vous" action={() => navigation.navigate('home')}>
            <View style={styles.grid2}>
              {nearClubs.map((item) => (
                <SmallCard key={item.id} item={item} />
              ))}
            </View>
          </Section>

          <Section title="Nouveaux clubs">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {newClubs.map((item) => (
                <TileCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Agility & Sport canin" action={() => navigation.navigate('home')}>
            <View style={styles.grid2}>
              {agility.map((item) => (
                <SmallCard key={item.id} item={item} />
              ))}
            </View>
          </Section>
        </View>
      </ScrollView>
      <UserBottomNav current="clubs" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6FBF9' },
  content: { paddingTop: 0, paddingBottom: 130, gap: 18 },
  hero: {
    backgroundColor: palette.primary,
    borderRadius: 22,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  heading: { color: '#fff', fontSize: 20, fontWeight: '800' },
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
});
