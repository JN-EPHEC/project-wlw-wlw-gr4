import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthHeader, LabeledInput, PrimaryButton, authStyles, cardStyle, palette } from './AuthComponents';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

export default function PasswordResetScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { resetPassword, actionLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setError('Indiquez votre email pour recevoir le lien de réinitialisation.');
      return;
    }
    try {
      setError('');
      setMsg('');
      await resetPassword(email.trim());
      setMsg('Email de réinitialisation envoyé. Vérifiez votre boite mail.');
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader
        title="Réinitialiser le mot de passe"
        onBack={() => navigation.navigate('login')}
        color={palette.primary}
      />
      <View style={[authStyles.content, { marginTop: 20 }]}>
        <View style={[cardStyle, styles.card]}>
          <Text style={styles.helper}>Saisissez l'email associé à votre compte Smart Dogs.</Text>
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre.email@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {msg ? <Text style={styles.success}>{msg}</Text> : null}
          <PrimaryButton
            title={actionLoading ? 'Envoi...' : 'Envoyer le lien'}
            onPress={handleSend}
            color={palette.primary}
            loading={actionLoading}
            disabled={actionLoading}
          />
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={styles.link}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  helper: { color: palette.gray, lineHeight: 18 },
  link: { color: palette.primary, fontWeight: '800', textAlign: 'center' },
  error: { color: '#DC2626' },
  success: { color: '#16A34A' },
});
