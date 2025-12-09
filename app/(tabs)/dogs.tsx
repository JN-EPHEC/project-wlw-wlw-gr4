import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import UserBottomNav from '@/components/UserBottomNav';
import { UserStackParamList } from '@/navigation/types';

const colors = {
  primary: '#27b3a3',
  primaryDark: '#1f9c90',
  text: '#233042',
  textMuted: '#6a7286',
  surface: '#ffffff',
  shadow: 'rgba(26, 51, 64, 0.12)',
};

const dogs = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    age: '3 ans',
    weight: '32 kg',
    vaccineStatus: 'À jour',
    vermifugeStatus: 'Dans 2 mois',
    vetDate: '15 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Border Collie',
    age: '2 ans',
    weight: '18 kg',
    vaccineStatus: 'À jour',
    vermifugeStatus: 'À jour',
    vetDate: '28 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
  },
];

type DogsNavigationProp = NativeStackNavigationProp<UserStackParamList, 'mydog'>;

function StatusPill({ label, tone = 'success' }: { label: string; tone?: 'success' | 'warning' }) {
  const palette =
    tone === 'warning'
      ? { bg: '#ffe7cc', text: '#c2701f' }
      : { bg: '#dff5e7', text: '#1f9b5d' };
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.pillText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

export default function DogsScreen() {
  const navigation = useNavigation<DogsNavigationProp>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mes chiens</Text>
            <Text style={styles.headerSubtitle}>{dogs.length} compagnons enregistrés</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('addDog')}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.addText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 14 }}>
          {dogs.map((dog) => (
            <TouchableOpacity
              key={dog.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('dogProgression', { dogId: dog.id })}>
              <View style={styles.cardTop}>
                <View style={styles.avatarRing}>
                  <Image source={{ uri: dog.image }} style={styles.avatar} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.dogName}>{dog.name}</Text>
                  <Text style={styles.dogBreed}>{dog.breed}</Text>
                  <Text style={styles.meta}>
                    {dog.age} • {dog.weight}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>

              <View style={styles.divider} />

              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Vaccins</Text>
                  <StatusPill label={dog.vaccineStatus} tone="success" />
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Vermifuge</Text>
                  <StatusPill
                    label={dog.vermifugeStatus}
                    tone={dog.vermifugeStatus === 'À jour' ? 'success' : 'warning'}
                  />
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Véto</Text>
                  <Text style={styles.vetDate}>{dog.vetDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <UserBottomNav current="mydog" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { paddingBottom: 140 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#fff', fontSize: 16, marginTop: 4 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 5,
    gap: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: 'rgba(39, 179, 163, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 70, height: 70, borderRadius: 35, resizeMode: 'cover' },
  dogName: { color: colors.text, fontSize: 18, fontWeight: '800' },
  dogBreed: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#edf1f5' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  statusItem: { flex: 1, gap: 6 },
  statusLabel: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  vetDate: { color: colors.text, fontSize: 14, fontWeight: '700' },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: { fontWeight: '700', fontSize: 12 },
});
