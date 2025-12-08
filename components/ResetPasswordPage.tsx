import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { updatePassword } from 'firebase/auth';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { auth } from '../firebase';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValid = useMemo(() => newPassword.length >= 6 && newPassword === confirm, [newPassword, confirm]);

  const handleReset = async () => {
    setError('');
    if (!isValid) {
      setError('Le mot de passe doit contenir 6 caracteres minimum et les champs doivent correspondre.');
      return;
    }
    if (!auth.currentUser) {
      setError('Vous devez etre connecte pour changer votre mot de passe.');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccess(true);
      if (router) {
        router.push('/password-reset-success' as any);
      }
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="key-outline" size={20} color={palette.primary} />
              </View>
              <Text style={styles.title}>Nouveau mot de passe</Text>
              <Text style={styles.subtitle}>Choisissez un nouveau mot de passe pour securiser votre compte.</Text>
            </View>

            <View style={{ gap: 12 }}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="********"
                style={styles.input}
                placeholderTextColor={palette.gray}
              />
            </View>

            <View style={{ gap: 12 }}>
              <Text style={styles.label}>Confirmer</Text>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                placeholder="********"
                style={styles.input}
                placeholderTextColor={palette.gray}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>Mot de passe mis a jour.</Text> : null}

            <TouchableOpacity
              style={[styles.button, (!isValid || loading) && { opacity: 0.6 }]}
              disabled={!isValid || loading}
              onPress={handleReset}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Mettre a jour</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={() => router.back()}>
              <Text style={styles.linkText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/requires-recent-login':
        return 'Reconnectez-vous avant de changer le mot de passe.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible (6 caracteres minimum).';
      default:
        return "Une erreur est survenue. Merci de ressayer.";
    }
  }
  return "Une erreur est survenue. Merci de ressayer.";
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    gap: 16,
  },
  header: { alignItems: 'flex-start', gap: 8 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 14 },
  label: { color: palette.text, fontWeight: '600' },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: palette.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    color: palette.text,
  },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#DC2626', fontSize: 13 },
  success: { color: '#16A34A', fontSize: 13 },
  linkBtn: { alignSelf: 'center', paddingVertical: 8 },
  linkText: { color: palette.primaryDark, fontWeight: '600' },
});
