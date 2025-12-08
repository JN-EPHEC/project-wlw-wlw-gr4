import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'verified'>;

export default function VerifiedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('account')} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour compte</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Badge Verified</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.helper}>Statut et informations de vérification du compte.</Text>
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
  content: { padding: 16 },
  helper: { color: '#6B7280' },
});
