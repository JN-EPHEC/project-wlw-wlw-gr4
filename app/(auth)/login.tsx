import React, { useMemo, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../firebaseConfig';

import { CheckboxRow, LabeledInput, PrimaryButton, authStyles, cardStyle, palette } from './AuthComponents';
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
  const logo = useMemo(() => require('@/assets/images/Smartdogs-logo.png'), []);

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

  const handleSocial = async (providerType: 'google' | 'facebook') => {
    try {
      setError('');
      const selectedProvider = providerType === 'google' ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, selectedProvider);
      // Auth state listener will handle the login and navigation
    } catch (error: any) {
      const errorMsg = formatFirebaseAuthError(error);
      Alert.alert(
        `Erreur lors de la connexion avec ${providerType === 'google' ? 'Google' : 'Facebook'}`,
        errorMsg
      );
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F2FBF8']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <LinearGradient colors={['#3DC9A7', '#2BAE90']} style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerTitle}>Smart Dogs</Text>
            <Text style={styles.headerSubtitle}>Connectez-vous à votre compte</Text>
          </LinearGradient>

          <View style={[cardStyle, styles.loginCard]}>
            <View style={{ marginTop: 4 }} />
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

          <CheckboxRow
            checked={rememberMe}
            onToggle={() => setRememberMe((v) => !v)}
            label="Se souvenir de moi"
            accent={palette.primary}
          />

          <TouchableOpacity onPress={() => navigation.navigate('password-reset')}>
            <Text style={styles.link}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={actionLoading ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin} // Keep existing handler
            color={palette.primary}
            loading={actionLoading}
            disabled={actionLoading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signupChoice')}>
            <Text style={styles.footerLink}>Créer un compte</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={{ gap: 12 }}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9} onPress={() => handleSocial('google')}>
            <Image source={require('@/assets/images/google-logo.png')} style={styles.socialIcon} />
            <Text style={styles.socialText}>Continuer avec Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.9} onPress={() => handleSocial('facebook')}>
            <View style={styles.socialIconCircle}>
              <Image
                source={require('@/assets/images/facebook-logo.png')}
                style={[styles.socialIcon, { width: 24, height: 24 }]}
              />
            </View>
            <Text style={styles.socialText}>Continuer avec Facebook</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
    marginBottom: 0,
    zIndex: 1,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    marginTop: -8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 17,
    marginTop: 4,
  },
  loginCard: {
    padding: 28,
    gap: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  link: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  error: {
    color: '#DC2626',
    marginTop: 4,
    textAlign: 'center',
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0D0D0',
  },
  separatorText: {
    color: palette.gray,
    fontWeight: '600',
  },
  socialBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  socialIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 28,
    height: 28,
  },
  socialText: {
    color: palette.text,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: { color: palette.gray, fontSize: 15 },
  footerLink: { color: palette.primary, fontWeight: '700', fontSize: 15 },
});


