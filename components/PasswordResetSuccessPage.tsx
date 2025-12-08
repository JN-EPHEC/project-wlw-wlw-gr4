import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function PasswordResetSuccessPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={28} color="#16A34A" />
        </View>
        <Text style={styles.title}>Mot de passe modifie</Text>
        <Text style={styles.subtitle}>
          Votre mot de passe a ete mis a jour. Vous pouvez desormais vous connecter avec vos nouveaux identifiants.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/')} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 14, textAlign: 'center' },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
