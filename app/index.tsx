import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatFirebaseAuthError, useAuth } from '@/context/AuthContext';

type Screen = 'login' | 'choice' | 'signupUser' | 'signupTeacher' | 'signupClub' | 'success';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  teacher: '#F28B6F',
  teacherDark: '#e67a5f',
  club: '#E9B782',
  clubDark: '#d9a772',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  warning: '#FBBF24',
};

const cardStyle = {
  backgroundColor: palette.surface,
  borderRadius: 16,
  padding: 18,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 4,
};

const inputStyle = {
  backgroundColor: '#F9FAFB',
  borderColor: palette.border,
  borderWidth: 1,
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderRadius: 12,
  fontSize: 15,
};

function formatFirebaseError(error: unknown): string {
  return formatFirebaseAuthError(error);
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
};

const PrimaryButton = ({
  title,
  onPress,
  color = palette.primary,
  disabled,
  loading,
  outline,
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    disabled={disabled || loading}
    style={[
      styles.button,
      outline
        ? { borderColor: color, borderWidth: 1, backgroundColor: 'transparent' }
        : { backgroundColor: color },
      (disabled || loading) && { opacity: 0.6 },
    ]}
  >
    {loading ? (
      <ActivityIndicator color={outline ? color : '#fff'} />
    ) : (
      <Text style={[styles.buttonText, outline && { color }]}>{title}</Text>
    )}
  </TouchableOpacity>
);

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  icon,
  autoCapitalize = 'none',
}: InputProps) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      {icon ? <View style={{ marginRight: 10 }}>{icon}</View> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.input, { flex: 1 }]}
      />
    </View>
  </View>
);

const CheckboxRow = ({
  checked,
  onToggle,
  label,
  description,
  accent = palette.primary,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  description?: string;
  accent?: string;
}) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.checkboxRow}>
    <View
      style={[
        styles.checkbox,
        {
          borderColor: checked ? accent : palette.border,
          backgroundColor: checked ? accent : 'transparent',
        },
      ]}
    >
      {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      {description ? <Text style={styles.checkboxDescription}>{description}</Text> : null}
    </View>
  </TouchableOpacity>
);

const InfoCard = ({
  title,
  description,
  icon,
  color = palette.primary,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
}) => (
  <View style={[styles.infoCard, { borderLeftColor: color }]}>
    <View style={{ marginRight: 10 }}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  </View>
);

const Header = ({
  title,
  subtitle,
  onBack,
  color = palette.primary,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  color?: string;
}) => (
  <View style={[styles.header, { backgroundColor: color }]}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
    ) : (
      <View style={{ height: 22 }} />
    )}
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

function LoginScreen({
  onSignupPress,
  onSuccess,
}: {
  onSignupPress: () => void;
  onSuccess: () => void;
}) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setSubmitError('Merci de saisir votre email et votre mot de passe.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await login(email.trim(), password);
      setResetSent(null);
      onSuccess();
    } catch (error) {
      setSubmitError(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setSubmitError('Veuillez indiquer votre email pour recevoir un lien de réinitialisation.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await resetPassword(email);
      setResetSent('Lien de réinitialisation envoyé. Vérifiez votre boite e-mail.');
    } catch (error) {
      setSubmitError(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Smart Dogs" subtitle="Connectez-vous à votre compte" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[cardStyle, { marginTop: -40 }]}>
          <LabeledInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre.email@exemple.com"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />

          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.gray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <CheckboxRow
              checked={rememberMe}
              onToggle={() => setRememberMe((v) => !v)}
              label="Se souvenir de moi"
              accent={palette.primary}
            />
            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={[styles.link, { color: palette.primary }]}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
          {resetSent ? <Text style={styles.successText}>{resetSent}</Text> : null}

          <PrimaryButton
            title={isSubmitting ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin}
            loading={isSubmitting}
            disabled={isSubmitting}
            color={palette.primary}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.divider} />
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryButton title="Continuer avec Google (mobile à venir)" onPress={() => {}} outline />
          <PrimaryButton title="Continuer avec Facebook (mobile à venir)" onPress={() => {}} outline />
        </View>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={onSignupPress}>
            <Text style={[styles.footerText, styles.link]}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SignupUserProps = { onBack: () => void; onSuccess: () => void };

function SignupUserScreen({ onBack, onSuccess }: SignupUserProps) {
  const { registerOwner } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (!acceptTerms) {
      setSubmitError("Merci d'accepter les conditions d'utilisation.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerOwner({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        password: formData.password,
      });
      onSuccess();
    } catch (error) {
      setSubmitError(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Créer un compte" subtitle="Compte Particulier" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Prénom *"
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholder="Jean"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Nom *"
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholder="Dupont"
                autoCapitalize="words"
              />
            </View>
          </View>
          <LabeledInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            placeholder="jean.dupont@exemple.com"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Téléphone"
            value={formData.phone}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Ville"
            value={formData.city}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
            placeholder="Bruxelles"
            icon={<Ionicons name="location-outline" size={18} color={palette.gray} />}
          />
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Min. 8 caractères avec majuscules, minuscules et chiffres</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((s) => !s)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={palette.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[cardStyle, { backgroundColor: '#F3F4F6' }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation et la politique de confidentialité de Smart Dogs."
            accent={palette.primary}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <PrimaryButton
          title={isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
          onPress={handleSubmit}
          disabled={!acceptTerms || isSubmitting}
          loading={isSubmitting}
          color={palette.primary}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type SignupTeacherProps = { onBack: () => void; onSuccess: () => void };

function SignupTeacherScreen({ onBack, onSuccess }: SignupTeacherProps) {
  const { registerTeacher } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    specialties: [] as string[],
    experience: '',
    certifications: '',
    bio: '',
    hourlyRate: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const specialties = useMemo(
    () => [
      'Obéissance de base',
      'Éducation canine',
      'Agility',
      'Comportementalisme',
      'Préparation concours',
      'Rééducation comportementale',
      'Chiots',
      'Sports canins',
    ],
    [],
  );

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = async () => {
    if (!acceptTerms) {
      setSubmitError("Merci d'accepter les conditions d'utilisation.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (formData.specialties.length === 0) {
      setSubmitError('Veuillez sélectionner au moins une spécialité.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerTeacher({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        specialties: formData.specialties,
        experience: formData.experience,
        certifications: formData.certifications,
        bio: formData.bio,
        hourlyRate: formData.hourlyRate,
        password: formData.password,
      });
      onSuccess();
    } catch (error) {
      setSubmitError(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Créer un compte" subtitle="Éducateur / Indépendant" onBack={onBack} color={palette.teacher} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Prénom *"
                value={formData.firstName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, firstName: text }))}
                placeholder="Marie"
                autoCapitalize="words"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Nom *"
                value={formData.lastName}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, lastName: text }))}
                placeholder="Martin"
                autoCapitalize="words"
              />
            </View>
          </View>
          <LabeledInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            placeholder="marie.martin@exemple.com"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Téléphone *"
            value={formData.phone}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Ville d'exercice *"
            value={formData.city}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
            placeholder="Anvers"
            icon={<Ionicons name="location-outline" size={18} color={palette.gray} />}
          />
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          <LabeledInput
            label="Années d'expérience *"
            value={formData.experience}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, experience: text }))}
            placeholder="5"
            keyboardType="numeric"
            icon={<Ionicons name="calendar-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Certifications et diplômes"
            value={formData.certifications}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, certifications: text }))}
            placeholder="BP éducateur canin, CCAD..."
            icon={<MaterialCommunityIcons name="certificate-outline" size={18} color={palette.gray} />}
          />
          <Text style={styles.label}>Spécialités *</Text>
          <View style={styles.chipWrap}>
            {specialties.map((specialty) => {
              const active = formData.specialties.includes(specialty);
              return (
                <TouchableOpacity
                  key={specialty}
                  onPress={() => toggleSpecialty(specialty)}
                  style={[
                    styles.chip,
                    active && { backgroundColor: palette.teacher, borderColor: palette.teacher },
                  ]}
                >
                  <Text style={[styles.chipText, active && { color: '#fff' }]}>{specialty}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <LabeledInput
            label="Présentation"
            value={formData.bio}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
            placeholder="Présentez-vous et votre approche..."
            icon={<Ionicons name="document-text-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Tarif horaire indicatif (€)"
            value={formData.hourlyRate}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, hourlyRate: text }))}
            placeholder="45"
            keyboardType="numeric"
            icon={<Ionicons name="pricetag-outline" size={18} color={palette.gray} />}
          />
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Min. 8 caractères avec majuscules, minuscules et chiffres</Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((s) => !s)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={palette.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <InfoCard
          title='Badge "Smart Dogs Verified"'
          description="Après création, vous pourrez soumettre vos documents pour obtenir le badge vérifié."
          icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color={palette.teacher} />}
          color={palette.teacher}
        />

        <View style={[cardStyle, { backgroundColor: '#F3F4F6' }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation et la politique de confidentialité de Smart Dogs."
            accent={palette.teacher}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <PrimaryButton
          title={isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
          onPress={handleSubmit}
          disabled={!acceptTerms || isSubmitting}
          loading={isSubmitting}
          color={palette.teacher}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type SignupClubProps = { onBack: () => void; onSuccess: () => void };

function SignupClubScreen({ onBack, onSuccess }: SignupClubProps) {
  const { registerClub } = useAuth();
  const [formData, setFormData] = useState({
    clubName: '',
    legalName: '',
    siret: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    services: [] as string[],
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const services = useMemo(
    () => [
      'Éducation canine',
      'Agility',
      'Obéissance',
      'Comportementalisme',
      'Ring',
      'Canicross',
      'Pension canine',
      'Toilettage',
      'Promenade',
      'Dog sitting',
    ],
    [],
  );

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async () => {
    if (!acceptTerms) {
      setSubmitError("Merci d'accepter les conditions d'utilisation.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.email || !formData.password || !formData.clubName || !formData.siret) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerClub({
        clubName: formData.clubName,
        legalName: formData.legalName,
        siret: formData.siret,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        description: formData.description,
        services: formData.services,
        password: formData.password,
      });
      onSuccess();
    } catch (error) {
      setSubmitError(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Créer un compte club" subtitle="Pour les professionnels du secteur canin" onBack={onBack} color={palette.club} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Informations du club</Text>
          <LabeledInput
            label="Nom du club *"
            value={formData.clubName}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, clubName: text }))}
            placeholder="Club Canin Bruxelles 15"
          />
          <LabeledInput
            label="Raison sociale"
            value={formData.legalName}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, legalName: text }))}
            placeholder="Association Club Canin Bruxelles 15"
          />
          <LabeledInput
            label="Numero d'entreprise / TVA *"
            value={formData.siret}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, siret: text }))}
            placeholder="123 456 789 00010"
          />
          <LabeledInput
            label="Description du club"
            value={formData.description}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
            placeholder="Présentation, valeurs, spécialités..."
          />
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Services proposés</Text>
          <View style={styles.chipWrap}>
            {services.map((service) => {
              const active = formData.services.includes(service);
              return (
                <TouchableOpacity
                  key={service}
                  onPress={() => toggleService(service)}
                  style={[
                    styles.chip,
                    active && { backgroundColor: palette.club, borderColor: palette.club },
                  ]}
                >
                  <Text style={[styles.chipText, active && { color: '#fff' }]}>{service}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          <LabeledInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            placeholder="contact@clubcanin.fr"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Téléphone *"
            value={formData.phone}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
            placeholder="01 23 45 67 89"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={palette.gray} />}
          />
          <LabeledInput
            label="Adresse"
            value={formData.address}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, address: text }))}
            placeholder="123 Rue de la République"
            icon={<Ionicons name="home-outline" size={18} color={palette.gray} />}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Code postal"
                value={formData.postalCode}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, postalCode: text }))}
                placeholder="75015"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <LabeledInput
                label="Ville"
                value={formData.city}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, city: text }))}
                placeholder="Bruxelles"
              />
            </View>
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.gray} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginBottom: 6 }}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={palette.gray} style={{ marginRight: 10 }} />
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, confirmPassword: text }))}
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((s) => !s)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={palette.gray}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <InfoCard
          title='Badge "Smart Dogs Verified"'
          description="Après vérification de vos documents, vous obtiendrez le badge de confiance pour valoriser votre club."
          icon={<MaterialCommunityIcons name="shield-check-outline" size={22} color={palette.club} />}
          color={palette.club}
        />

        <View style={[cardStyle, { backgroundColor: '#F3F4F6' }]}>
          <CheckboxRow
            checked={acceptTerms}
            onToggle={() => setAcceptTerms((v) => !v)}
            label="J'accepte les conditions d'utilisation professionnelles et la politique de confidentialité."
            accent={palette.club}
          />
        </View>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <PrimaryButton
          title={isSubmitting ? 'Création en cours...' : 'Créer mon compte club'}
          onPress={handleSubmit}
          disabled={!acceptTerms || isSubmitting}
          loading={isSubmitting}
          color={palette.club}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SignupChoiceScreen({
  onSelectType,
  onBack,
}: {
  onSelectType: (type: 'user' | 'teacher' | 'club') => void;
  onBack: () => void;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Créer un compte" subtitle="Choisissez le type de compte" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <TouchableOpacity style={[cardStyle, styles.choiceCard]} onPress={() => onSelectType('user')}>
          <View style={styles.choiceIconWrapperPrimary}>
            <Ionicons name="person-circle-outline" size={34} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.choiceTitle}>Compte Particulier</Text>
            <Text style={styles.choiceDescription}>
              Pour les propriétaires de chiens qui souhaitent accéder aux services et à la communauté.
            </Text>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
              <Text style={styles.choiceBulletText}>Réserver des séances de dressage</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
              <Text style={styles.choiceBulletText}>Gérer le profil de vos chiens</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
              <Text style={styles.choiceBulletText}>Accéder à DjanAI et à la communauté</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.primary} />
              <Text style={styles.choiceBulletText}>Rejoindre des clubs canins</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[cardStyle, styles.choiceCard]} onPress={() => onSelectType('teacher')}>
          <View style={styles.choiceIconWrapperTeacher}>
            <Ionicons name="school-outline" size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.choiceTitle}>Compte Éducateur / Indépendant</Text>
            <Text style={styles.choiceDescription}>
              Pour les éducateurs canins indépendants qui proposent des services à titre personnel.
            </Text>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.teacher} />
              <Text style={styles.choiceBulletText}>Proposer vos propres séances</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.teacher} />
              <Text style={styles.choiceBulletText}>Gérer votre agenda et tarifs</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.teacher} />
              <Text style={styles.choiceBulletText}>Être visible auprès des clients</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.teacher} />
              <Text style={styles.choiceBulletText}>Obtenir le badge "Smart Dogs Verified"</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[cardStyle, styles.choiceCard]} onPress={() => onSelectType('club')}>
          <View style={styles.choiceIconWrapperClub}>
            <Ionicons name="business-outline" size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.choiceTitle}>Compte Club / Structure</Text>
            <Text style={styles.choiceDescription}>
              Pour les clubs canins et structures qui gèrent plusieurs éducateurs.
            </Text>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.club} />
              <Text style={styles.choiceBulletText}>Créer et gérer votre club</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.club} />
              <Text style={styles.choiceBulletText}>Gérer plusieurs éducateurs</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.club} />
              <Text style={styles.choiceBulletText}>Organiser des événements</Text>
            </View>
            <View style={styles.choiceBulletRow}>
              <Ionicons name="checkmark-circle" size={16} color={palette.club} />
              <Text style={styles.choiceBulletText}>Créer une communauté</Text>
            </View>
          </View>
        </TouchableOpacity>

        <InfoCard
          title="Besoin d'aide ?"
          description="Si vous ne savez pas quel type de compte choisir, contactez-nous à support@smartdogs.fr"
          icon={<Ionicons name="information-circle-outline" size={22} color={palette.primary} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Bienvenue !" subtitle="Compte créé avec succès" />
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={[cardStyle, { alignItems: 'center', gap: 12 }]}>
          <Ionicons name="checkmark-circle" size={64} color={palette.primary} />
          <Text style={styles.successTitle}>Votre compte est prêt</Text>
          <Text style={styles.successSubtitle}>
            Vous pouvez maintenant vous connecter et finaliser votre profil Smart Dogs.
          </Text>
          <PrimaryButton title="Aller à la connexion" onPress={onDone} color={palette.primary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function AuthFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/home');
    }
  }, [user, router]);

  return (
    <>
      {screen === 'login' ? (
        <LoginScreen
          onSignupPress={() => setScreen('choice')}
          onSuccess={() => router.replace('/(tabs)/home')}
        />
      ) : null}
      {screen === 'choice' ? (
        <SignupChoiceScreen
          onSelectType={(type) => {
            if (type === 'user') setScreen('signupUser');
            if (type === 'teacher') setScreen('signupTeacher');
            if (type === 'club') setScreen('signupClub');
          }}
          onBack={() => setScreen('login')}
        />
      ) : null}
      {screen === 'signupUser' ? (
        <SignupUserScreen onBack={() => setScreen('choice')} onSuccess={() => router.replace('/(tabs)/home')} />
      ) : null}
      {screen === 'signupTeacher' ? (
        <SignupTeacherScreen onBack={() => setScreen('choice')} onSuccess={() => router.replace('/(tabs)/home')} />
      ) : null}
      {screen === 'signupClub' ? (
        <SignupClubScreen onBack={() => setScreen('choice')} onSuccess={() => router.replace('/(tabs)/home')} />
      ) : null}
      {screen === 'success' ? <SuccessScreen onDone={() => setScreen('login')} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    padding: 20,
    gap: 16,
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: palette.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    ...inputStyle,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 13,
  },
  successText: {
    color: '#16A34A',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 13,
  },
  helperText: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: palette.gray,
    fontSize: 13,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: palette.text,
    fontSize: 14,
  },
  link: {
    color: palette.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkbox: {
    height: 22,
    width: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  checkboxDescription: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 2,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#F9FAFB',
  },
  chipText: {
    fontSize: 13,
    color: palette.text,
  },
  infoCard: {
    ...cardStyle,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  infoDescription: {
    fontSize: 12.5,
    color: palette.gray,
    marginTop: 4,
  },
  choiceCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  choiceIconWrapperPrimary: {
    height: 52,
    width: 52,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceIconWrapperTeacher: {
    height: 52,
    width: 52,
    borderRadius: 16,
    backgroundColor: palette.teacher,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceIconWrapperClub: {
    height: 52,
    width: 52,
    borderRadius: 16,
    backgroundColor: palette.club,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6,
  },
  choiceDescription: {
    fontSize: 13,
    color: palette.gray,
    marginBottom: 8,
  },
  choiceBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  choiceBulletText: {
    fontSize: 13,
    color: palette.text,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: palette.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});



