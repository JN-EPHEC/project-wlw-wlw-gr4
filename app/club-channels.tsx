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
  ActivityIndicator,
  Modal,
} from 'react-native';

import { ClubStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { createCommunityChannel } from '@/hooks/useCreateChannel';
import { useCommunityChannels } from '@/hooks/useCommunityChannels';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubChannels'>;

export default function ClubChannelsScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const clubId = (route.params as any)?.clubId || user?.uid;
  
  const { channels, loading } = useCommunityChannels(clubId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Affiche les canaux de type 'chat' (discussion générale)
  const discussionChannels = useMemo(() => {
    return channels.filter((c) => c.type === 'chat');
  }, [channels]);

  const stats = useMemo(
    () => ({
      total: discussionChannels.length,
    }),
    [discussionChannels]
  );

  const goToChannel = (channelId: string, channelName: string) => {
    navigation.navigate('clubChannelChat', { channelId, channelName });
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) return;
    
    setIsCreating(true);
    try {
      await createCommunityChannel({
        clubId,
        name: channelName,
        description: channelDesc,
        type: 'chat',
        createdBy: user?.uid || '',
      });

      setChannelName('');
      setChannelDesc('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erreur lors de la création du salon:', error);
    } finally {
      setIsCreating(false);
    }
  };

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubCommunity', {})}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Salons de discussion</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name="pound" size={16} color="#fff" />
              <Text style={styles.headerSub}>Discussions avec les membres</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add" size={22} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Salon(s)</Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="pound" size={18} color={palette.primary} />
            <Text style={styles.sectionTitle}>Salons disponibles</Text>
          </View>

          {discussionChannels.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="pound" size={48} color={palette.gray} />
              <Text style={styles.emptyText}>Aucun salon disponible</Text>
              <Text style={styles.emptySubText}>Créez votre premier salon pour commencer</Text>
            </View>
          ) : (
            discussionChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => goToChannel(channel.id, channel.name)}
              >
                <View style={styles.channelIcon}>
                  <MaterialCommunityIcons name="pound" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{channel.name}</Text>
                  <Text style={styles.cardDesc}>{channel.description || 'Canal de discussion'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.gray} />
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information-outline" size={18} color={palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Salons de discussion</Text>
              <Text style={styles.infoText}>
                Discutez avec les membres de votre club dans les salons disponibles.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de création de salon */}
      <Modal transparent visible={showCreateModal} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau salon</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={22} color={palette.gray} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              <View>
                <Text style={styles.label}>Nom du salon</Text>
                <TextInput
                  value={channelName}
                  onChangeText={setChannelName}
                  placeholder="Ex: Astuces & conseils..."
                  style={styles.input}
                  placeholderTextColor={palette.gray}
                  editable={!isCreating}
                />
              </View>
              <View>
                <Text style={styles.label}>Description (optionnel)</Text>
                <TextInput
                  value={channelDesc}
                  onChangeText={setChannelDesc}
                  placeholder="Décrivez le but du salon..."
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  placeholderTextColor={palette.gray}
                  editable={!isCreating}
                />
              </View>
              <TouchableOpacity
                style={[styles.createSubmitBtn, isCreating && { opacity: 0.6 }]}
                onPress={handleCreateChannel}
                activeOpacity={0.9}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                    <Text style={styles.createSubmitText}>Créer le salon</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  statsCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: palette.border,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  statLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  sectionTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: palette.gray,
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  channelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
  },
  cardDesc: {
    color: palette.gray,
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E0F2FE',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoTitle: {
    color: palette.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    color: palette.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  createSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createSubmitText: {
    color: '#fff',
    fontWeight: '700',
  },
});
