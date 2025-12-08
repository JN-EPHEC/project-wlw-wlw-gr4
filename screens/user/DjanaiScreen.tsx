import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'djanai'>;

export default function DjanaiScreen({ navigation, route }: Props) {
  const previousPage = route.params?.previousPage;

  const handleBack = () => {
    if (previousPage) {
      navigation.navigate({ name: previousPage, params: {} } as any);
    } else {
      navigation.navigate('home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>DjanAI</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.helper}>
          Construisez le profil de votre chien pour générer un programme personnalisé.
        </Text>
        <TouchableOpacity
          style={styles.primary}
          onPress={() =>
            navigation.navigate('djanaiResults', {
              profile: { dog: 'Nala', level: 'Intermédiaire' },
              previousPage: previousPage ?? 'home',
            })
          }
        >
          <Text style={styles.primaryText}>Valider le profil</Text>
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
  helper: { color: '#6B7280' },
  primary: {
    backgroundColor: '#7C3AED',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
});
