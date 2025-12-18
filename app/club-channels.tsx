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

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    shadow: 'rgba(26, 51, 64, 0.12)',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubChannels'>;

export default function ClubChannelsScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const clubId = (route.params as any)?.clubId || (profile as any)?.clubId || user?.uid || '';
  
  const { channels, loading } = useCommunityChannels(clubId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const discussionChannels = useMemo(() => channels.filter(c => c.type === 'chat'), [channels]);

  const goToChannel = (channelId: string, channelName: string) => {
    navigation.navigate('clubChannelChat', { channelId, channelName });
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) return;
    setIsCreating(true);
    try {
      await createCommunityChannel({ clubId, name: channelName, description: channelDesc, type: 'chat', createdBy: user?.uid || '' });
      setChannelName('');
      setChannelDesc('');
      setShowCreateModal(false);
    } catch (error) { console.error('Erreur:', error); } 
    finally { setIsCreating(false); }
  };

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>Salons de discussion</Text>
                <Text style={styles.headerSub}>{discussionChannels.length} salon(s) disponible(s)</Text>
            </View>
        </View>

        <View style={styles.content}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowCreateModal(true)}>
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.primaryButtonText}>Créer un nouveau salon</Text>
            </TouchableOpacity>

            {discussionChannels.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="forum-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyTitle}>Aucun salon de discussion</Text>
                    <Text style={styles.emptySubtitle}>Créez le premier salon pour commencer à échanger avec vos membres.</Text>
                </View>
            ) : (
                discussionChannels.map((channel) => (
                <TouchableOpacity key={channel.id} style={styles.card} onPress={() => goToChannel(channel.id, channel.name)}>
                    <View style={styles.cardIcon}>
                        <MaterialCommunityIcons name="pound" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{channel.name}</Text>
                        <Text style={styles.cardSubtitle} numberOfLines={1}>{channel.description || 'Appuyez pour discuter'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
                ))
            )}
        </View>
      </ScrollView>

      <Modal transparent visible={showCreateModal} animationType="fade" onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Créer un salon</Text>
            <TextInput value={channelName} onChangeText={setChannelName} placeholder="Nom du salon" style={styles.input} editable={!isCreating} />
            <TextInput value={channelDesc} onChangeText={setChannelDesc} placeholder="Description (optionnel)" style={[styles.input, {height: 80}]} multiline editable={!isCreating} />
            <TouchableOpacity style={[styles.primaryButton, isCreating && {opacity: 0.7}]} onPress={handleCreateChannel} disabled={isCreating}>
                {isCreating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Confirmer la création</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
  content: { padding: 16, gap: 16 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 16 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2, shadowColor: colors.shadow },
  cardIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(39, 179, 163, 0.1)' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardSubtitle: { fontSize: 14, color: colors.textMuted },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  emptySubtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  // Modal
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '90%', elevation: 5, gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15 },
});