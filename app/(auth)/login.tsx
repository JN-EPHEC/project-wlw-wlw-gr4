import React, { useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthHeader, CheckboxRow, LabeledInput, PrimaryButton, authStyles, cardStyle, palette } from './AuthComponents';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login, actionLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const logo = useMemo(() => require('@/assets/images/icon.png'), []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Renseignez votre email et votre mot de passe.');
      return;
    }
    try {
      setError('');
      await login(email.trim(), password);
      // Auth state listener will swap navigator to the correct role stack
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    }
  };

  const handleSocial = (provider: 'google' | 'facebook') => {
    Alert.alert('Fonction a venir', `Connexion ${provider} sera bientot disponible.`);
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader title="Smart Dogs" subtitle="Connectez-vous a votre compte" color={palette.primary} />
      <ScrollView contentContainerStyle={[authStyles.content, { marginTop: -36 }]}>
        <View style={[cardStyle, styles.card, styles.heroCard]}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heroTitle}>Smart Dogs</Text>
          <Text style={styles.heroSubtitle}>Bienvenue, connectez-vous pour continuer.</Text>
        </View>

        <View style={[cardStyle, styles.card]}>
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre.email@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry={!showPassword}
            icon={<Ionicons name="lock-closed-outline" size={18} color={palette.gray} />}
            rightSlot={
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.gray} />
              </TouchableOpacity>
            }
          />

          <View style={styles.rowBetween}>
            <CheckboxRow
              checked={rememberMe}
              onToggle={() => setRememberMe((v) => !v)}
              label="Se souvenir de moi"
              accent={palette.primary}
            />
            <TouchableOpacity onPress={() => navigation.navigate('password-reset')}>
              <Text style={styles.link}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={actionLoading ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin}
            color={palette.primary}
            loading={actionLoading}
            disabled={actionLoading}
          />
        </View>

        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9} onPress={() => handleSocial('google')}>
            <View style={styles.socialIconCircle}>
              <Text style={styles.socialIconText}>G</Text>
            </View>
            <Text style={styles.socialText}>Continuer avec Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9} onPress={() => handleSocial('facebook')}>
            <View style={[styles.socialIconCircle, { backgroundColor: '#E7F0FF' }]}>
              <Text style={[styles.socialIconText, { color: '#1877F2' }]}>f</Text>
            </View>
            <Text style={styles.socialText}>Continuer avec Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signupChoice')}>
            <Text style={styles.footerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  heroCard: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  logo: { width: 82, height: 82, marginBottom: 6 },
  heroTitle: { color: palette.text, fontSize: 20, fontWeight: '800' },
  heroSubtitle: { color: palette.gray, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  link: { color: palette.primary, fontWeight: '700' },
  error: { color: '#DC2626', marginTop: 6 },
  separatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  separatorText: { color: palette.gray, fontWeight: '700' },
  socialBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 1,
  },
  socialIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: { fontSize: 16, fontWeight: '700', color: palette.text },
  socialText: { color: palette.text, fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 },
  footerText: { color: palette.gray, fontWeight: '600' },
  footerLink: { color: palette.primary, fontWeight: '800' },
});
