import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { ClubStackParamList } from '@/navigation/types';
import ClubBottomNav from '@/components/ClubBottomNav';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    error: '#DC2626',
    success: '#10B981',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubProfile'>;

export default function ClubProfileScreen({ navigation }: Props) {
  const { profile, refreshProfile, user, logout } = useAuth();
  const clubProfile = (profile as any)?.profile || {};

  useFocusEffect(React.useCallback(() => { if(user?.uid) refreshProfile() }, [user?.uid, refreshProfile]));

  const [settings, setSettings] = useState({
    acceptNewMembers: clubProfile?.acceptNewMembers ?? true,
    showPhonePublic: clubProfile?.showPhonePublic ?? true,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <Image source={{ uri: clubProfile.logoUrl || 'https://via.placeholder.com/100' }} style={styles.avatar} />
            <Text style={styles.headerTitle}>{clubProfile.clubName || 'Mon Club'}</Text>
            <Text style={styles.headerSub}>{clubProfile.address || 'Adresse non spécifiée'}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('editClubProfile')}>
                <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            <Section title="Informations générales">
                <InfoRow label="Nom légal" value={clubProfile.legalName} />
                <InfoRow label="SIRET" value={clubProfile.siret} />
                <InfoRow label="Description" value={clubProfile.description} />
            </Section>

            <Section title="Contact">
                <InfoRow label="Email" value={clubProfile.email} icon="mail-outline" />
                <InfoRow label="Téléphone" value={clubProfile.phone} icon="call-outline" />
                <InfoRow label="Site web" value={clubProfile.website} icon="globe-outline" />
            </Section>

            <Section title="Paramètres">
                <SettingRow
                    label="Accepter les nouveaux membres"
                    value={settings.acceptNewMembers}
                    onValueChange={(v) => setSettings(s => ({...s, acceptNewMembers: v}))}
                />
                <SettingRow
                    label="Afficher le téléphone publiquement"
                    value={settings.showPhonePublic}
                    onValueChange={(v) => setSettings(s => ({...s, showPhonePublic: v}))}
                />
            </Section>
            
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color={colors.error} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      <ClubBottomNav current="clubProfile" />
    </SafeAreaView>
  );
}

const Section = ({ title, children }: any) => <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
const InfoRow = ({ label, value, icon }: any) => (
    <View style={styles.infoRow}>
        {icon && <Ionicons name={icon} size={18} color={colors.primary} />}
        <View style={{flex: 1, marginLeft: icon ? 12 : 0}}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || 'Non spécifié'}</Text>
        </View>
    </View>
);
const SettingRow = ({ label, value, onValueChange }: any) => (
    <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{false: '#E5E7EB', true: colors.primary}} thumbColor={'#fff'} />
    </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  header: { backgroundColor: colors.surface, padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSub: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  editButton: { position: 'absolute', top: 16, right: 16, padding: 8, backgroundColor: colors.background, borderRadius: 16 },
  content: { padding: 16, gap: 24 },
  section: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 12, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  infoLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 15, color: colors.text },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 15, color: colors.text, flex: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'rgba(220, 38, 38, 0.1)', paddingVertical: 14, borderRadius: 16 },
  logoutText: { color: colors.error, fontWeight: 'bold', fontSize: 16 },
});