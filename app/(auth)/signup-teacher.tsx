import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import {
  AuthHeader,
  CheckboxRow,
  InfoCard,
  LabeledInput,
  PrimaryButton,
  SelectChip,
  UploadField,
  authStyles,
  cardStyle,
  palette,
  type UploadableFile,
} from './AuthComponents';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';
import { AuthStackParamList } from '@/navigation/AuthStack';

export default function SignupTeacherScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { registerTeacher, actionLoading } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    certifications: '',
    experience: '',
    bio: '',
    website: '',
    password: '',
    confirmPassword: '',
  });
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<UploadableFile[]>([]);
  const [documents, setDocuments] = useState<UploadableFile[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specialtiesList = useMemo(
    () => [
      'Éducation canine',
      'Agility',
      'Comportementalisme',
      'Dressage',
      'Pension canine',
      'Toilettage',
      'Dog sitting',
      'Chiots',
    ],
    [],
  );

  const toggleSpecialty = (value: string) => {
    setSpecialties((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setProfilePhoto([{ uri: asset.uri, name: asset.fileName ?? 'photo.jpg', mimeType: asset.mimeType }]);
    }
  };

  const handlePickDocuments = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true });
    if (!result.canceled && result.assets?.length) {
      const picked = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      }));
      setDocuments((prev) => [...prev, ...picked]);
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
    if (!specialties.length) {
      setError('Choisissez au moins une spécialité.');
      return;
    }
    if (!acceptTerms) {
      setError("Merci d'accepter les conditions d'utilisation professionnelles.");
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await registerTeacher({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        specialties,
        experience: form.experience.trim(),
        certifications: form.certifications.trim(),
        bio: form.bio.trim(),
        website: form.website.trim(),
        password: form.password,
        profilePhoto: profilePhoto[0],
        documents,
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

  const loading = submitting || actionLoading;

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <AuthHeader
        title="Créer un compte"
        subtitle="Éducateur / indépendant"
        onBack={() => navigation.navigate('signupChoice')}
        color={palette.teacher}
      />
      <ScrollView contentContainerStyle={[authStyles.content, { marginTop: -16 }]}>
        <UploadField
          title="Photo de profil (optionnel)"
          files={profilePhoto}
          onPick={handlePickPhoto}
          color={palette.teacher}
          single
          description="Ajoutez une photo pour inspirer confiance aux clients."
        />

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Prénom *"
                value={form.firstName}
                onChangeText={(v) => setForm((p) => ({ ...p, firstName: v }))}
                placeholder="Marie"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Nom *"
                value={form.lastName}
                onChangeText={(v) => setForm((p) => ({ ...p, lastName: v }))}
                placeholder="Martin"
                autoCapitalize="words"
              />
            </View>
          </View>
          <LabeledInput
            label="Email *"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="contact@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Téléphone *"
            value={form.phone}
            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Code postal"
                value={form.postalCode}
                onChangeText={(v) => setForm((p) => ({ ...p, postalCode: v }))}
                placeholder="75015"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Ville"
                value={form.city}
                onChangeText={(v) => setForm((p) => ({ ...p, city: v }))}
                placeholder="Paris"
              />
            </View>
          </View>
        </View>

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Informations professionnelles / bio</Text>
          <LabeledInput
            label="Certifications et diplômes"
            value={form.certifications}
            onChangeText={(v) => setForm((p) => ({ ...p, certifications: v }))}
            placeholder="BP d'éducateur canin, autres diplômes..."
            multiline
          />
          <LabeledInput
            label="Expériences"
            value={form.experience}
            onChangeText={(v) => setForm((p) => ({ ...p, experience: v }))}
            placeholder="Nombre d'années, références, parcours..."
            multiline
          />
          <LabeledInput
            label="Bio / présentation"
            value={form.bio}
            onChangeText={(v) => setForm((p) => ({ ...p, bio: v }))}
            placeholder="Décrivez votre approche, vos valeurs..."
            multiline
          />
          <LabeledInput
            label="Site web / réseaux pro"
            value={form.website}
            onChangeText={(v) => setForm((p) => ({ ...p, website: v }))}
            placeholder="https://"
            keyboardType="url"
            icon={<Ionicons name="link-outline" size={18} color={palette.gray} />}
          />
        </View>

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Spécialités proposées *</Text>
          <View style={styles.chipWrap}>
            {specialtiesList.map((item) => (
              <SelectChip
                key={item}
                label={item}
                selected={specialties.includes(item)}
                onPress={() => toggleSpecialty(item)}
                color={palette.teacher}
              />
            ))}
          </View>
        </View>

        <UploadField
          title="Documents administratifs"
          files={documents}
          onPick={handlePickDocuments}
          color={palette.teacher}
          description="Ajoutez vos pièces justificatives (diplômes, RC pro, pièce d'identité) pour être vérifié."
        />

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

        <InfoCard
          title='Badge "Smart Dogs verified"'
          description="Après vérification de vos documents, vous afficherez le badge de confiance pour rassurer vos clients."
          color={palette.teacher}
          icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color={palette.teacher} />}
        />

        <View style={[cardStyle, { backgroundColor: '#FFF7F3', gap: 12 }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation professionnelles et la politique de confidentialité."
            accent={palette.teacher}
          />
          <CheckboxRow
            checked={newsletter}
            onToggle={() => setNewsletter((v) => !v)}
            label="Recevoir la newsletter professionnelle Smart Dogs."
            accent={palette.teacher}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? 'Création en cours...' : 'Créer mon compte éducateur'}
          onPress={handleSubmit}
          color={palette.teacher}
          disabled={loading || !acceptTerms}
          loading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  inlineRow: { flexDirection: 'row', gap: 12 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  error: { color: '#DC2626', textAlign: 'center' },
});
