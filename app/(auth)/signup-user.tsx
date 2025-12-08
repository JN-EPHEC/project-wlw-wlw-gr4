import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  AuthHeader,
  CheckboxRow,
  LabeledInput,
  PrimaryButton,
  UploadField,
  authStyles,
  cardStyle,
  palette,
  type UploadableFile,
} from './AuthComponents';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

export default function SignupUserScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { registerOwner, actionLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<UploadableFile[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setProfilePhoto([{ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', mimeType: asset.mimeType }]);
    }
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    if (form.password.length < 8) {
      setError('Mot de passe trop court (minimum 8 caractères).');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptTerms) {
      setError("Merci d'accepter les conditions d'utilisation.");
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await registerOwner({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        password: form.password,
        profilePhoto: profilePhoto[0],
        newsletterOptIn: newsletter,
        acceptTerms,
      });
      // Auth listener will redirect by role
    } catch (err) {
      setError(formatFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || actionLoading;

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader
        title="Créer un compte"
        subtitle="Compte particulier"
        onBack={() => navigation.navigate('signupChoice')}
        color={palette.primary}
      />
      <ScrollView contentContainerStyle={[authStyles.content, { marginTop: -16 }]}>
        <UploadField
          title="Photo de profil (optionnelle)"
          files={profilePhoto}
          onPick={handlePickPhoto}
          color={palette.primary}
          single
          description="Ajoutez une photo pour personnaliser votre compte."
        />

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Prenom *"
                value={form.firstName}
                onChangeText={(v) => setForm((p) => ({ ...p, firstName: v }))}
                placeholder="Jean"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Nom *"
                value={form.lastName}
                onChangeText={(v) => setForm((p) => ({ ...p, lastName: v }))}
                placeholder="Dupont"
                autoCapitalize="words"
              />
            </View>
          </View>
          <LabeledInput
            label="Email *"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="jean.dupont@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Telephone"
            value={form.phone}
            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Ville"
            value={form.city}
            onChangeText={(v) => setForm((p) => ({ ...p, city: v }))}
            placeholder="Paris"
            icon={<Ionicons name="location-outline" size={18} color={palette.gray} />}
          />
        </View>

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Sécurité</Text>
          <LabeledInput
            label="Mot de passe *"
            value={form.password}
            onChangeText={(v) => setForm((p) => ({ ...p, password: v }))}
            placeholder="********"
            secureTextEntry={!showPassword}
            icon={<Ionicons name="lock-closed-outline" size={18} color={palette.gray} />}
            rightSlot={
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.gray} />
              </TouchableOpacity>
            }
          />
          <Text style={authStyles.helperText}>Minimum 8 caractères avec majuscules, minuscules et chiffres.</Text>
          <LabeledInput
            label="Confirmer le mot de passe *"
            value={form.confirmPassword}
            onChangeText={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
            placeholder="********"
            secureTextEntry={!showConfirmPassword}
            icon={<Ionicons name="lock-closed-outline" size={18} color={palette.gray} />}
            rightSlot={
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.gray} />
              </TouchableOpacity>
            }
          />
        </View>

        <View style={[cardStyle, { backgroundColor: '#F4F7FB', gap: 12 }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation et la politique de confidentialité Smart Dogs."
            accent={palette.primary}
          />
          <CheckboxRow
            checked={newsletter}
            onToggle={() => setNewsletter((v) => !v)}
            label="Recevoir la newsletter Smart Dogs (optionnelle)."
            accent={palette.primary}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={disabled ? 'Création en cours...' : 'Créer mon compte'}
          onPress={handleSubmit}
          color={palette.primary}
          disabled={disabled || !acceptTerms}
          loading={disabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  inlineRow: { flexDirection: 'row', gap: 12 },
  error: { color: '#DC2626', textAlign: 'center' },
});
