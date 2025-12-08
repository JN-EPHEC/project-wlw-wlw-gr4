import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  primaryDark: '#d9a772',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  status: 'active' | 'pending';
  credentials: { username: string; password: string };
  createdAt: string;
};

const seedTeachers: Teacher[] = [
  {
    id: 1,
    firstName: 'Sophie',
    lastName: 'Durand',
    email: 'sophie.durand@email.com',
    phone: '06 12 34 56 78',
    specialties: ['Agility', 'Obéissance'],
    status: 'active',
    credentials: { username: 'PROF-SD-8745', password: 'Pass2024@SD' },
    createdAt: '15 Sept 2024',
  },
];

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeachers'>;

export default function ClubTeachersScreen({ navigation }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>(seedTeachers);
  const [selectedCredentials, setSelectedCredentials] = useState<Teacher | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const pendingRequests = 2;
  const freeLimit = 2;
  const canAddFree = teachers.length < freeLimit;

  const stats = useMemo(
    () => ({
      total: teachers.length,
      freeLeft: Math.max(0, freeLimit - teachers.length),
      active: teachers.filter((t) => t.status === 'active').length,
    }),
    [teachers]
  );

  const handleDelete = (id: number) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const addTeacherShortcut = () => {
    if (canAddFree) {
      navigation.navigate('clubAddTeacher');
    } else {
      navigation.navigate({ name: 'clubTeachersPricing', params: {} });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubProfile')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mes professeurs</Text>
            <Text style={styles.headerSub}>Gérez votre équipe d’enseignants</Text>
          </View>
          {pendingRequests > 0 ? (
            <TouchableOpacity style={styles.notif} onPress={() => navigation.navigate('clubTeacherRequests')}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{pendingRequests}</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          <View style={styles.headerIcon}>
            <Ionicons name="people" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Professeurs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.freeLeft}</Text>
            <Text style={styles.statLabel}>Gratuits restants</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={[styles.alert, canAddFree ? styles.alertInfo : styles.alertWarn]}>
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color={canAddFree ? '#1D4ED8' : '#C2410C'}
            />
            <Text style={[styles.alertText, { color: canAddFree ? '#1D4ED8' : '#C2410C' }]}>
              {canAddFree
                ? `Vous pouvez ajouter ${stats.freeLeft} professeur(s) gratuit(s).`
                : 'Limite gratuite atteinte. Passez en Premium pour ajouter plus de professeurs.'}
            </Text>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={addTeacherShortcut} activeOpacity={0.9}>
            <Ionicons name="person-add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Ajouter un professeur</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Liste des professeurs</Text>
          {teachers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="person-circle-outline" size={42} color={palette.gray} />
              <Text style={styles.emptyText}>Aucun professeur</Text>
              <Text style={styles.emptySub}>Ajoutez votre premier professeur pour commencer.</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {teachers.map((t) => (
                <View key={t.id} style={styles.card}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={22} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.cardTitle}>
                            {t.firstName} {t.lastName}
                          </Text>
                          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                            <View
                              style={[
                                styles.badge,
                                t.status === 'active'
                                  ? { backgroundColor: '#DCFCE7' }
                                  : { backgroundColor: '#E5E7EB' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgeText,
                                  { color: t.status === 'active' ? '#15803D' : palette.gray },
                                ]}
                              >
                                {t.status === 'active' ? 'Actif' : 'En attente'}
                              </Text>
                            </View>
                            {t.id <= freeLimit ? (
                              <View style={[styles.badge, { backgroundColor: '#DBEAFE' }]}>
                                <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>Gratuit</Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(t.id)}>
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.metaRow}>
                        <Ionicons name="mail-outline" size={14} color={palette.gray} />
                        <Text style={styles.cardMeta}>{t.email}</Text>
                      </View>
                      {t.phone ? (
                        <View style={styles.metaRow}>
                          <Ionicons name="call-outline" size={14} color={palette.gray} />
                          <Text style={styles.cardMeta}>{t.phone}</Text>
                        </View>
                      ) : null}

                      {t.specialties.length ? (
                        <View style={styles.chips}>
                          {t.specialties.map((s) => (
                            <View key={s} style={styles.chip}>
                              <Text style={styles.chipText}>{s}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      <View style={styles.footerRow}>
                        <Text style={styles.dateText}>Ajouté le {t.createdAt}</Text>
                        <TouchableOpacity onPress={() => setSelectedCredentials(t)} style={styles.ghostBtn}>
                          <MaterialCommunityIcons name="shield-outline" size={16} color={palette.text} />
                          <Text style={styles.ghostBtnText}>Voir identifiants</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="book-open-page-variant" size={18} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Comment ça marche ?</Text>
              <Text style={styles.infoText}>
                Ajoutez les informations du professeur. Un code d’accès unique est généré automatiquement. Communiquez ces
                identifiants pour qu’il se connecte à son interface.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {selectedCredentials ? (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Identifiants</Text>
              <TouchableOpacity onPress={() => setSelectedCredentials(null)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              <View>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  editable={false}
                  value={`${selectedCredentials.firstName} ${selectedCredentials.lastName}`}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.label}>Code d’identifiant</Text>
                <TextInput editable={false} value={selectedCredentials.credentials.username} style={styles.input} />
              </View>
              <View>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    editable={false}
                    secureTextEntry={!showPassword}
                    value={selectedCredentials.credentials.password}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.gray} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.notice}>
                <MaterialCommunityIcons name="information-outline" size={16} color={palette.primary} />
                <Text style={styles.noticeText}>
                  Communiquez ces identifiants au professeur. Accès dédié sur app.smartdogs.fr/professeur
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: '#41B6A6', marginTop: 4 }]}
                onPress={() => setSelectedCredentials(null)}
              >
                <Text style={styles.addBtnText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FDF5E6',
    alignItems: 'center',
    justifyContent: 'center',
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
  notif: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  notifBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notifBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { color: palette.text, fontWeight: '700' },
  statLabel: { color: palette.gray, fontSize: 12 },
  container: { padding: 16, gap: 14 },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertInfo: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  alertWarn: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  alertText: { flex: 1, fontSize: 13 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { color: palette.text, fontWeight: '700' },
  emptySub: { color: palette.gray },
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
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { backgroundColor: '#FDF5E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  chipText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateText: { color: palette.gray, fontSize: 12 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ghostBtnText: { color: palette.text, fontWeight: '700', fontSize: 12 },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoTitle: { color: palette.text, fontWeight: '700', marginBottom: 4 },
  infoText: { color: palette.text, fontSize: 13, lineHeight: 18 },
  modalBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
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
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: palette.border,
  },
  noticeText: { color: palette.text, fontSize: 12, flex: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
