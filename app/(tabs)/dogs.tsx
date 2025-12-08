import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';
import UserBottomNav from '@/components/UserBottomNav';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const dogs = [
  {
    id: 1,
    name: 'Nala',
    breed: 'Border Collie',
    age: '2 ans',
    weight: '16 kg',
    progress: 76,
    level: 'Intermédiaire',
    image: 'https://images.unsplash.com/photo-1505623774485-923554bb2792?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Rocky',
    breed: 'Berger Australien',
    age: '3 ans',
    weight: '22 kg',
    progress: 52,
    level: 'Débutant',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80',
  },
];

type DogsNavigationProp = NativeStackNavigationProp<UserStackParamList, 'mydog'>;

export default function DogsScreen() {
  const navigation = useNavigation<DogsNavigationProp>();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes chiens</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('addDog')}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Ajouter un chien</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Chiens</Text>
              <Text style={styles.statValue}>{dogs.length}</Text>
            </View>
            <View style={styles.dividerVertical} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Prochaine visite</Text>
              <Text style={styles.statValue}>15 avr.</Text>
            </View>
          </View>
        </View>

        {dogs.map((dog) => (
          <TouchableOpacity key={dog.id} style={styles.dogCard} activeOpacity={0.9} onPress={() => navigation.navigate('dogProgression', { dogId: dog.id })}>
            <Image source={{ uri: dog.image }} style={styles.dogImage} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.dogName}>{dog.name}</Text>
                <View style={styles.levelChip}>
                  <Text style={styles.levelText}>{dog.level}</Text>
                </View>
              </View>
              <Text style={styles.dogSub}>{dog.breed} · {dog.age} · {dog.weight}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${dog.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{dog.progress}% progression DjanAI</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={18} color={palette.gray} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
        </View>
        <View style={styles.quickGrid}>
          {[
            { icon: 'medal-outline', label: 'Badges', onPress: () => navigation.navigate('dogBadges', { dogId: dogs[0]?.id ?? 1 }) },
            { icon: 'trending-up-outline', label: 'Progression', onPress: () => navigation.navigate('dogProgression', { dogId: dogs[0]?.id ?? 1 }) },
            { icon: 'document-text-outline', label: 'Carnet de sante' },
            { icon: 'document-text-outline', label: 'Carnet de sant‚' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickItem} onPress={item.onPress} activeOpacity={item.onPress ? 0.85 : 1}>
              <View style={styles.quickIcon}>
                <Ionicons name={item.icon as any} size={18} color={palette.primary} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="shield-check-outline" size={22} color="#1D4ED8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Vaccins à jour</Text>
            <Text style={styles.infoSub}>Téléversez les documents vétérinaires pour chaque chien.</Text>
          </View>
          <TouchableOpacity style={styles.infoBtn}>
            <Text style={styles.infoBtnText}>Gérer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <UserBottomNav current="mydog" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: palette.text, fontSize: 22, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statLabel: { color: palette.gray, fontSize: 12 },
  statValue: { color: palette.text, fontWeight: '700', fontSize: 16 },
  dividerVertical: { width: 1, height: 32, backgroundColor: palette.border },
  dogCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dogImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#E5E7EB' },
  dogName: { color: palette.text, fontWeight: '700', fontSize: 16 },
  dogSub: { color: palette.gray, fontSize: 12 },
  levelChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E0F2F1',
  },
  levelText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  progressTrack: {
    marginTop: 6,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: palette.primary },
  progressText: { color: palette.gray, fontSize: 12, marginTop: 4 },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickItem: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { color: palette.text, fontWeight: '600', fontSize: 14 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  infoSub: { color: palette.gray, fontSize: 13 },
  infoBtn: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  infoBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
