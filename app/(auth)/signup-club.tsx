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

export default function SignupClubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { registerClub, actionLoading } = useAuth();
  const [form, setForm] = useState({
    clubName: '',
    legalName: '',
    siret: '',
    website: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
  });
  const [services, setServices] = useState<string[]>([]);
  const [logo, setLogo] = useState<UploadableFile[]>([]);
  const [documents, setDocuments] = useState<UploadableFile[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const servicesList = useMemo(

      () => [

        'Éducation canine',

        'Agility',

        'Dressage',

        'Pension canine',

        'Comportementalisme',

        'Toilettage',

        'Dog sitting',

      ],

      [],

    );

  

    const toggleService = (value: string) => {

      setServices((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

    };

  

    const handlePickLogo = async () => {

      const result = await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ImagePicker.MediaTypeOptions.Images,

        quality: 0.8,

  const toggleService = (value: string) => {
    setServices((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handlePickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setLogo([{ uri: asset.uri, name: asset.fileName ?? 'logo.jpg', mimeType: asset.mimeType }]);
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
    if (!form.clubName || !form.email || !form.phone || !form.siret || !form.password) {
      setError('Renseignez tous les champs obligatoires.');
      return;
    }
    if (!services.length) {
      setError('Selectionnez au moins un service proposé.');
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
      setError("Merci d'accepter les conditions d'utilisation professionnelles.");
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await registerClub({
        clubName: form.clubName.trim(),
        legalName: form.legalName.trim(),
        siret: form.siret.trim(),
        website: form.website.trim(),
        description: form.description.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        services,
        password: form.password,
        logo: logo[0],
        documents,
        newsletterOptIn: newsletter,
        acceptTerms,
      });

      if (!result.canceled && result.assets?.length) {

        const asset = result.assets[0];

        setLogo([{ uri: asset.uri, name: asset.fileName ?? 'logo.jpg', mimeType: asset.mimeType }]);

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

  

        if (!form.clubName || !form.email || !form.phone || !form.siret || !form.password) {

  

          setError('Renseignez tous les champs obligatoires.');

  

          return;

  

        }

  

        if (!services.length) {

  

          setError('Sélectionnez au moins un service proposé.');

  

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

  

          setError("Merci d'accepter les conditions d'utilisation professionnelles.");

  

          return;

  

        }

      try {

        setSubmitting(true);

        setError('');

        await registerClub({

          clubName: form.clubName.trim(),

          legalName: form.legalName.trim(),

          siret: form.siret.trim(),

          website: form.website.trim(),

          description: form.description.trim(),

          email: form.email.trim(),

          phone: form.phone.trim(),

          address: form.address.trim(),

          city: form.city.trim(),

          postalCode: form.postalCode.trim(),

          services,

          password: form.password,

          logo: logo[0],

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

          title="Créer un compte club"

          subtitle="Pour les professionnels du secteur canin"

          onBack={() => navigation.navigate('signupChoice')}

          color={palette.club}

        />

        <ScrollView contentContainerStyle={[authStyles.content, { marginTop: -16 }]}>

          <UploadField

            title="Logo / photo du club (optionnel)"

            files={logo}

            onPick={handlePickLogo}

            color={palette.club}

            single

            description="Ajoutez votre logo pour identifier rapidement votre structure."

          />

  

          <View style={[cardStyle, styles.card]}>

            <Text style={authStyles.sectionTitle}>Informations du club</Text>

            <LabeledInput

              label="Nom du club *"

              value={form.clubName}

              onChangeText={(v) => setForm((p) => ({ ...p, clubName: v }))}

              placeholder="Club canin"

            />

            <LabeledInput

              label="Dénomination sociale"

              value={form.legalName}

              onChangeText={(v) => setForm((p) => ({ ...p, legalName: v }))}

              placeholder="SA, SRL, ..."

            />

            <LabeledInput

              label="Numéro d'entreprise / N°BCE *"

              value={form.siret}

              onChangeText={(v) => setForm((p) => ({ ...p, siret: v }))}

              placeholder="0444.499.733"

            />

            <LabeledInput

              label="Site web (optionnel)"

              value={form.website}

              onChangeText={(v) => setForm((p) => ({ ...p, website: v }))}

              placeholder="https://"

              keyboardType="url"

              icon={<Ionicons name="link-outline" size={18} color={palette.gray} />}

            />

            <LabeledInput

              label="Description du club"

              value={form.description}

              onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}

              placeholder="Présentation, valeurs, spécialités..."

              multiline

            />

          </View>

  

          <View style={[cardStyle, styles.card]}>

            <Text style={authStyles.sectionTitle}>Services proposés *</Text>

            <View style={styles.chipWrap}>

              {servicesList.map((item) => (

                <SelectChip

                  key={item}

                  label={item}

                  selected={services.includes(item)}

                  onPress={() => toggleService(item)}

                  color={palette.club}

                />

              ))

            }

          </View>
        </View>

        <View style={[cardStyle, styles.card]}>
          <Text style={authStyles.sectionTitle}>Coordonnees</Text>
          <LabeledInput
            label="Email *"
            value={form.email}
            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="contact@club.be"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Telephone *"
            value={form.phone}
            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
            placeholder="476 16 34 43"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Adresse"
            value={form.address}
            onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
            placeholder="Chaussée de Gand"
            icon={<Ionicons name="home-outline" size={18} color={palette.gray} />}
          />
          <View style={styles.inlineRow}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Code postal"
                value={form.postalCode}
                onChangeText={(v) => setForm((p) => ({ ...p, postalCode: v }))}
                placeholder="1082"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Ville"
                value={form.city}
                onChangeText={(v) => setForm((p) => ({ ...p, city: v }))}
                placeholder="Bruxelles"
              />
            </View>
          </View>
        </View>

        <UploadField
          title="Documents administratifs"
          files={documents}
          onPick={handlePickDocuments}
          color={palette.club}
          description="Ajoutez vos justificatifs (assurance, certificats, pièce d'identité) pour obtenir le badge Smart Dogs verified."
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
          description="Après vérification de vos documents, vous afficherez le badge de confiance sur votre page club."
          color={palette.club}
          icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color={palette.club} />}
        />

        <View style={[cardStyle, { backgroundColor: '#FFF9F3', gap: 12 }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation professionnelles et la politique de confidentialité."
            accent={palette.club}
          />
          <CheckboxRow
            checked={newsletter}
            onToggle={() => setNewsletter((v) => !v)}
            label="Recevoir la newsletter professionnelle Smart Dogs."
            accent={palette.club}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          title={loading ? 'Création en cours...' : 'Créer mon compte club'}
          onPress={handleSubmit}
          color={palette.club}
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
