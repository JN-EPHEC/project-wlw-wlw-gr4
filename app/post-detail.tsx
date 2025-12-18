import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { UserStackParamList } from '@/navigation/types';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

const postMock = {
  id: 1,
  title: 'Comment apprendre le rappel à un chiot ?',
  author: 'Julie Martin',
  authorAvatar: 'JM',
  content:
    "Bonjour à tous !\n\nMon chiot de 4 mois a du mal avec le rappel. J'ai essayé plusieurs méthodes mais rien ne fonctionne bien.\n\nQuand je l'appelle, il me regarde mais continue ce qu'il fait. J'utilise des friandises comme récompense mais ça ne suffit pas.\n\nAvez-vous des astuces qui ont fonctionné ? Des erreurs à éviter ?\n\nMerci d'avance pour vos conseils !",
  category: 'Éducation',
  likes: 24,
  comments: 12,
  views: 156,
  timeAgo: 'Il y a 2h',
  tags: ['Rappel', 'Chiot', 'Éducation de base'],
};

const commentsMock = [
  {
    id: 1,
    author: 'Sophie Martin',
    authorAvatar: 'SM',
    isEducator: true,
    content:
      "Excellent question ! Le rappel est fondamental. Mon conseil : commencez dans un environnement sans distractions et augmentez progressivement. Utilisez un mot unique et récompensez TOUJOURS.",
    likes: 15,
    timeAgo: 'Il y a 1h',
  },
  {
    id: 2,
    author: 'Marc Dubois',
    authorAvatar: 'MD',
    isEducator: false,
    content:
      "J'ai eu le même problème ! Ce qui a marché pour moi : ne jamais rappeler pour quelque chose de négatif. Le rappel doit toujours être associé au positif.",
    likes: 8,
    timeAgo: 'Il y a 1h',
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'postDetail'>;

export default function PostDetailScreen({ navigation, route }: Props) {
  const { postId } = route.params;
  const post = { ...postMock, id: postId };
  const comments = commentsMock;
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.authorAvatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.author}>{post.author}</Text>
              <Text style={styles.meta}>{post.timeAgo} · {post.views} vues</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{post.category}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.content}</Text>

          <View style={styles.chips}>
            {post.tags.map((t) => (
              <View key={t} style={styles.chip}>
                <Text style={styles.chipText}>#{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setLiked((v) => !v)}>
              <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={liked ? palette.primary : palette.gray} />
              <Text style={[styles.actionText, liked && { color: palette.primary }]}>{liked ? post.likes + 1 : post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={palette.gray} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="eye-outline" size={18} color={palette.gray} />
              <Text style={styles.actionText}>{post.views}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Commentaires</Text>
          <Text style={styles.meta}>{comments.length} réponses</Text>
        </View>

        {comments.map((c) => (
          <View key={c.id} style={styles.commentCard}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarText}>{c.authorAvatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.commentAuthor}>{c.author}</Text>
                {c.isEducator ? (
                  <View style={styles.educatorChip}>
                    <Text style={styles.educatorText}>Educateur</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.meta}>{c.timeAgo}</Text>
              <Text style={styles.commentBody}>{c.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="thumbs-up-outline" size={16} color={palette.gray} />
                  <Text style={styles.actionText}>{c.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={palette.gray} />
                  <Text style={styles.actionText}>Répondre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.inputCard}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarText}>VO</Text>
          </View>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Ajouter un commentaire..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => setNewComment('')}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 14, paddingBottom: 30 },
  header: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  author: { color: palette.text, fontWeight: '700', fontSize: 15 },
  meta: { color: palette.gray, fontSize: 12 },
  tag: { backgroundColor: '#E0F2F1', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  tagText: { color: palette.primary, fontWeight: '700', fontSize: 12 },
  title: { color: palette.text, fontSize: 18, fontWeight: '700' },
  body: { color: palette.text, fontSize: 14, lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: palette.gray, fontSize: 13 },
  commentsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  commentsTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 10,
  },
  commentAuthor: { color: palette.text, fontWeight: '700', fontSize: 14 },
  educatorChip: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  educatorText: { color: palette.primary, fontWeight: '700', fontSize: 11 },
  commentBody: { color: palette.text, fontSize: 13, marginTop: 4 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: { flex: 1, color: palette.text, fontSize: 14 },
  sendBtn: {
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
