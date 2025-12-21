import React, { useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useDogs } from '@/hooks/useDogs';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'dogs'>;

export default function AccountDogsScreen({ navigation }: Props) {
  const { dogs, loading, error, loadDogs } = useDogs();

  // Recharger les chiens quand la page se focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDogs();
    });
    return unsubscribe;
  }, [navigation, loadDogs]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes chiens</Text>
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
          <Text style={styles.title}>Mes chiens</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement des chiens</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dogs || dogs.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour compte</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mes chiens</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Aucun chien enregistré</Text>
          <Text style={styles.emptyText}>Ajoutez votre premier compagnon canin</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('addDog' as any)}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Ajouter un chien</Text>
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
        <Text style={styles.title}>Mes chiens</Text>
        <TouchableOpacity
          style={styles.addHeaderButton}
          onPress={() => navigation.navigate('addDog' as any)}
        >
          <Ionicons name="add" size={24} color="#41B6A6" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dogCard}
            onPress={() => navigation.navigate('dogDetail' as any, { dogId: item.id })}
          >
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={styles.dogImage} />
            ) : (
              <View style={[styles.dogImage, styles.imagePlaceholder]}>
                <Text style={styles.placeholderIcon}>🐕</Text>
              </View>
            )}
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>{item.name}</Text>
              <Text style={styles.dogBreed}>{item.breed || 'Race inconnue'}</Text>
              {item.age && <Text style={styles.dogAge}>🎂 {item.age} ans</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { 
    padding: 16, 
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#41B6A6', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937', flex: 1 },
  addHeaderButton: { padding: 8 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', marginBottom: 16, textAlign: 'center' },
  addButton: {
    backgroundColor: '#41B6A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  listContent: { padding: 16, gap: 12 },
  dogCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  dogImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#E5E7EB' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderIcon: { fontSize: 32 },
  dogInfo: { flex: 1, gap: 4 },
  dogName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  dogBreed: { fontSize: 14, color: '#6B7280' },
  dogAge: { fontSize: 13, color: '#4B5563', marginTop: 4 },
});
