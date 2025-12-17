import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { RootStackParamList } from '@/navigation/types';
import { useUserRatingInvitations } from '@/hooks/useUserRatingInvitations';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  bg: '#F5F7FA',
  danger: '#EF4444',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ratingsInvitationsList'>;

export default function RatingInvitationsListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { invitations, loading } = useUserRatingInvitations(user?.uid || null);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatTime = (timestamp: any): string => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleInvitationPress = (bookingId: string) => {
    navigation.navigate('ratingInvitation', {
      bookingId,
      previousTarget: 'ratingsInvitationsList',
    } as any);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes invitations</Text>
          <Text style={styles.headerSub}>Donnez votre avis sur vos séances</Text>
        </View>

        {/* Invitations List */}
        <View style={styles.section}>
          {invitations.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="check-circle" size={48} color={palette.primary} />
              <Text style={styles.emptyTitle}>Aucune invitation en attente</Text>
              <Text style={styles.emptyText}>Vous avez donné votre avis sur toutes vos séances !</Text>
            </View>
          ) : (
            invitations.map((invitation) => (
              <TouchableOpacity
                key={invitation.id}
                style={styles.invitationCard}
                onPress={() => handleInvitationPress(invitation.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.invitationTitle}>{invitation.title}</Text>
                    <Text style={styles.clubName}>{invitation.clubName || 'Club'}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color={palette.gray} />
                </View>

                <View style={styles.divider} />

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="calendar" size={16} color={palette.primary} />
                    <Text style={styles.infoText}>{formatDate(invitation.sessionDate)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="clock" size={16} color={palette.primary} />
                    <Text style={styles.infoText}>{formatTime(invitation.sessionDate)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={palette.primary} />
                    <Text style={styles.infoText}>{invitation.duration} min</Text>
                  </View>

                  {invitation.educatorName && (
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="account" size={16} color={palette.primary} />
                      <Text style={styles.infoText}>{invitation.educatorName}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.actionRow}>
                  <Text style={styles.actionText}>Cliquez pour noter</Text>
                  <MaterialCommunityIcons name="star" size={18} color={palette.primary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 4,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },

  section: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyTitle: { color: palette.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyText: { color: palette.gray, fontSize: 14, textAlign: 'center' },

  invitationCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  titleContainer: { flex: 1, gap: 2 },
  invitationTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  clubName: { color: palette.gray, fontSize: 13 },

  divider: { height: 1, backgroundColor: palette.border, marginVertical: 8 },

  cardContent: { gap: 6, paddingVertical: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { color: palette.text, fontSize: 13, fontWeight: '500' },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  actionText: { color: palette.primary, fontSize: 12, fontWeight: '600' },
});
