import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'dogProgression'>;

export default function DogProgressionScreen({ navigation, route }: Props) {
  const { dogId } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('mydog')} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Progression chien #{dogId}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.primary}
          onPress={() => navigation.navigate('dogTasks', { dogId })}
        >
          <Text style={styles.primaryText}>Voir les tâches</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.navigate('dogBadges', { dogId })}
        >
          <Text style={styles.secondaryText}>Badges & réussites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#41B6A6', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  content: { padding: 16, gap: 12 },
  primary: {
    backgroundColor: '#41B6A6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: {
    backgroundColor: '#E0F2F1',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryText: { color: '#0f766e', fontWeight: '700' },
});
