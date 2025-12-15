import { Ionicons } from '@expo/vector-icons';
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
  ActivityIndicator,
} from 'react-native';

import { ClubStackParamList } from '@/navigation/types';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import { useAuth } from '@/context/AuthContext';

const palette = {
  primary: '#7C3AED',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubMembers'>;

export default function ClubMembersScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { members, loading } = useCommunityMembers(clubId);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const lower = search.toLowerCase();
    return members.filter(
      (m) => m.name.toLowerCase().includes(lower) || m.email?.toLowerCase().includes(lower)
    );
  }, [members, search]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Membres</Text>
              <Text style={styles.headerSub}>{members.length} membre(s)</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={palette.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un membre..."
              placeholderTextColor={palette.gray}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={palette.gray} />
              </TouchableOpacity>
            ) : null}
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={palette.gray} />
              <Text style={styles.emptyText}>Aucun membre trouvé</Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {filtered.map((member) => (
                <View key={member.id || member.userId} style={styles.memberCard}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.avatarText}>
                      {(member.name || member.displayName || '?')[0].toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{member.name || member.displayName}</Text>
                    {member.email && <Text style={styles.memberEmail}>{member.email}</Text>}
                    {member.joinedAt && (
                      <Text style={styles.memberMeta}>
                        Rejoint le {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.gray} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: palette.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: palette.gray,
  },
  membersList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  memberEmail: {
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },
  memberMeta: {
    fontSize: 11,
    color: palette.gray,
    marginTop: 4,
  },
});
