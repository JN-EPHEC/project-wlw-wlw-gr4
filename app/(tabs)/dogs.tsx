import React, { useEffect } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import UserBottomNav from '@/components/UserBottomNav';
import { UserStackParamList } from '@/navigation/types';
import { useDogs } from '@/hooks/useDogs';

const colors = {
  primary: '#27b3a3',
  primaryDark: '#1f9c90',
  text: '#233042',
  textMuted: '#6a7286',
  surface: '#ffffff',
  shadow: 'rgba(26, 51, 64, 0.12)',
};

type DogsNavigationProp = NativeStackNavigationProp<UserStackParamList, 'mydog'>;

function calculateAge(birthDate: string | number | undefined): string {
  if (!birthDate) return 'Non renseigné';
  try {
    let birth: Date;
    if (typeof birthDate === 'number') {
      birth = new Date(birthDate);
    } else if (typeof birthDate === 'string' && !isNaN(Number(birthDate))) {
      birth = new Date(parseInt(birthDate, 10));
    } else {
      birth = new Date(birthDate);
    }
    if (isNaN(birth.getTime())) return 'Date invalide';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age === 0) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return `${months} mois`;
    }
    return `${age} ans`;
  } catch {
    return 'Date invalide';
  }
}

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
  const { dogs, loading, error, loadDogs } = useDogs();

  // Recharger les chiens quand la page se focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDogs();
    });
    return unsubscribe;
  }, [navigation, loadDogs]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mes chiens</Text>
            <Text style={styles.headerSubtitle}>{dogs.length} compagnon{dogs.length !== 1 ? 's' : ''} enregistré{dogs.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('addDog')}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.addText}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        {loading && dogs.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error && dogs.length === 0 ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <View style={styles.errorCard}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#991B1B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        ) : dogs.length === 0 ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 40, alignItems: 'center' }}>
            <MaterialCommunityIcons name="paw-off" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: 16, marginTop: 12, fontWeight: '600' }}>Aucun chien enregistré</Text>
            <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>Ajoutez votre premier chien pour commencer</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 14 }}>
            {dogs.map((dog) => (
              <TouchableOpacity
                key={dog.id}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => dog.id && navigation.navigate('dogDetail', { dogId: dog.id })}>
                <View style={styles.cardTop}>
                  <View style={styles.avatarRing}>
                    {dog.photoUrl ? (
                      <Image source={{ uri: dog.photoUrl }} style={styles.avatar} />
                    ) : (
                      <MaterialCommunityIcons name="paw" size={40} color={colors.primary} />
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.dogName}>{dog.name}</Text>
                    <Text style={styles.dogBreed}>{dog.breed}</Text>
                    <Text style={styles.meta}>
                      {calculateAge(dog.birthDate)} {dog.weight && `• ${dog.weight} kg`}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>

                <View style={styles.divider} />

                <View style={styles.statusRow}>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>Édition</Text>
                    <Text style={styles.vetDate}>Modifier</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>Genre</Text>
                    <Text style={styles.vetDate}>{dog.gender || '-'}</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Text style={styles.statusLabel}>Infos</Text>
                    <Text style={[styles.vetDate, { fontSize: 12 }]} numberOfLines={1}>{dog.otherInfo ? 'Oui' : 'Non'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: { color: '#991B1B', fontSize: 14, fontWeight: '600', flex: 1 },
});
