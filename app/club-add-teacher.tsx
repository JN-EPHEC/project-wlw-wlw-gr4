import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubAddTeacher'>;

export default function ClubAddTeacherScreen({ navigation }: Props) {
  const [step, setStep] = useState<'form' | 'credentials'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialties: '',
    bio: '',
    experience: '',
    certifications: '',
  });
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

  const isValid = useMemo(() => form.firstName && form.lastName && form.email, [form]);

  const generateCredentials = () => {
    const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `PROF-${initials}-${randomNum}`;
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    const password = `Pass2024@${randomPassword.substring(0, 6)}`;
    setCredentials({ username, password });
    setStep('credentials');
  };

  const copy = (text: string, field: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (step === 'credentials' && credentials) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubTeachers')}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Identifiants générés</Text>
              <Text style={styles.headerSub}>Communiquez ces codes au professeur</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="shield-outline" size={22} color="#fff" />
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.successCard}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#16A34A" />
              <Text style={styles.successText}>
                Le professeur {form.firstName} {form.lastName} a été ajouté avec succès !
              </Text>
            </View>

            <View style={styles.card}>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={28} color={palette.primary} />
                </View>
                <Text style={styles.cardTitle}>
                  {form.firstName} {form.lastName}
                </Text>
                <Text style={styles.cardMeta}>{form.email}</Text>
              </View>

              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.label}>Nom complet</Text>
                  <View style={styles.copyRow}>
                    <TextInput value={`${form.firstName} ${form.lastName}`} editable={false} style={styles.input} />
                    <TouchableOpacity style={styles.copyBtn} onPress={() => copy(form.firstName, 'name')}>
                      <Ionicons
                        name={copiedField === 'name' ? 'checkmark-circle' : 'copy-outline'}
                        size={18}
                        color={copiedField === 'name' ? '#16A34A' : palette.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.copyRow}>
                    <TextInput value={form.email} editable={false} style={styles.input} />
                    <TouchableOpacity style={styles.copyBtn} onPress={() => copy(form.email, 'email')}>
                      <Ionicons
                        name={copiedField === 'email' ? 'checkmark-circle' : 'copy-outline'}
                        size={18}
                        color={copiedField === 'email' ? '#16A34A' : palette.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Code d’identifiant</Text>
                  <View style={styles.copyRow}>
                    <TextInput value={credentials.username} editable={false} style={styles.input} />
                    <TouchableOpacity style={styles.copyBtn} onPress={() => copy(credentials.username, 'username')}>
                      <Ionicons
                        name={copiedField === 'username' ? 'checkmark-circle' : 'copy-outline'}
                        size={18}
                        color={copiedField === 'username' ? '#16A34A' : palette.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Mot de passe</Text>
                  <View style={styles.copyRow}>
                    <TextInput
                      value={credentials.password}
                      editable={false}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity style={styles.copyBtn} onPress={() => setShowPassword((v) => !v)}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={palette.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.copyBtn} onPress={() => copy(credentials.password, 'password')}>
                      <Ionicons
                        name={copiedField === 'password' ? 'checkmark-circle' : 'copy-outline'}
                        size={18}
                        color={copiedField === 'password' ? '#16A34A' : palette.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="information-outline" size={18} color={palette.primary} />
              <Text style={styles.infoText}>
                Important : communiquez ces identifiants au professeur. Il pourra se connecter sur app.smartdogs.fr/professeur.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('clubTeachers')}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubTeachers')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Nouveau professeur</Text>
            <Text style={styles.headerSub}>Remplissez les informations ci-dessous</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="person-add" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.alert}>
            <MaterialCommunityIcons name="information-outline" size={18} color="#1D4ED8" />
            <Text style={[styles.alertText, { color: '#1D4ED8' }]}>
              Un code d’identifiant et un mot de passe seront générés automatiquement après l’ajout.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations principales</Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Prénom *</Text>
                <TextInput
                  value={form.firstName}
                  onChangeText={(text) => setForm({ ...form, firstName: text })}
                  placeholder="Jean"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Nom *</Text>
                <TextInput
                  value={form.lastName}
                  onChangeText={(text) => setForm({ ...form, lastName: text })}
                  placeholder="Dupont"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Email *</Text>
              <View style={styles.iconInput}>
                <Ionicons name="mail-outline" size={16} color={palette.gray} style={styles.iconLeft} />
                <TextInput
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  placeholder="jean.dupont@email.com"
                  style={[styles.input, { paddingLeft: 34 }]}
                  placeholderTextColor={palette.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Téléphone</Text>
              <View style={styles.iconInput}>
                <Ionicons name="call-outline" size={16} color={palette.gray} style={styles.iconLeft} />
                <TextInput
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  placeholder="06 12 34 56 78"
                  style={[styles.input, { paddingLeft: 34 }]}
                  placeholderTextColor={palette.gray}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Spécialités</Text>
              <TextInput
                value={form.specialties}
                onChangeText={(text) => setForm({ ...form, specialties: text })}
                placeholder="Agility, Obéissance, Comportementalisme..."
                style={styles.input}
                placeholderTextColor={palette.gray}
              />
              <Text style={styles.helper}>Séparez les spécialités par des virgules</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations complémentaires</Text>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Biographie</Text>
                <TextInput
                  value={form.bio}
                  onChangeText={(text) => setForm({ ...form, bio: text })}
                  placeholder="Présentez le professeur en quelques lignes..."
                  style={[styles.input, styles.multiline]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Expérience</Text>
                <TextInput
                  value={form.experience}
                  onChangeText={(text) => setForm({ ...form, experience: text })}
                  placeholder="10 ans d’expérience en éducation canine"
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Certifications</Text>
                <TextInput
                  value={form.certifications}
                  onChangeText={(text) => setForm({ ...form, certifications: text })}
                  placeholder="Certificat d’éducateur canin, Formation comportementaliste..."
                  style={[styles.input, styles.multiline]}
                  multiline
                  placeholderTextColor={palette.gray}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('clubTeachers')}>
          <Text style={[styles.secondaryBtnText, { color: palette.text }]}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, !isValid && { opacity: 0.6 }]}
          onPress={generateCredentials}
          disabled={!isValid}
        >
          <Ionicons name="shield-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Générer les identifiants</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#F8F3E9', fontSize: 12 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { padding: 16, gap: 14 },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  alertText: { flex: 1, fontSize: 13 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  label: { color: palette.text, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  iconInput: { position: 'relative' },
  iconLeft: { position: 'absolute', left: 10, top: 14 },
  helper: { color: palette.gray, fontSize: 12, marginTop: 4 },
  multiline: { height: 100, textAlignVertical: 'top' },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: '#fff',
  },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#fff',
  },
  secondaryBtnText: { fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  successCard: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    backgroundColor: '#ECFDF3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  successText: { color: '#166534', flex: 1 },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  copyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoText: { color: palette.text, fontSize: 13, lineHeight: 18, flex: 1 },
});
