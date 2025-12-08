import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
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

type Props = {
  defaultEmail?: string;
};

export default function ForgotPasswordPage({ defaultEmail }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);

  const handleSubmit = async () => {
    setError('');
    if (!isEmailValid) {
      setError('Merci de saisir un email valide.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSent(true);
      // Route to a dedicated confirmation page if available
      if (router) {
        router.push('/password-reset-sent' as any);
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
                <Ionicons name="lock-closed-outline" size={20} color={palette.primary} />
              </View>
              <Text style={styles.title}>Réinitialiser le mot de passe</Text>
              <Text style={styles.subtitle}>
                Entrez l'email utilisé lors de votre inscription. Nous vous enverrons un lien de réinitialisation.
              </Text>
            </View>

            <View style={{ gap: 12 }}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor={palette.gray}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {sent ? <Text style={styles.success}>Email envoyé. Verifiez votre boite mail.</Text> : null}

            <TouchableOpacity
              style={[styles.button, (!isEmailValid || loading) && { opacity: 0.6 }]}
              disabled={!isEmailValid || loading}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkBtn} onPress={() => router.back()}>
              <Text style={styles.linkText}>Retour à la connexion</Text>
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
      case 'auth/user-not-found':
        return 'Aucun compte associe a cet email.';
      case 'auth/invalid-email':
        return 'Email invalide.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Ressayez plus tard.';
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
