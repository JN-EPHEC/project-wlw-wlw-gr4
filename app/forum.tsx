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

const availableTags = ['Rappel', 'Chiot', 'Éducation de base', 'Comportement', 'Socialisation', 'Agility', 'Santé'];

const posts = [
  {
    id: 1,
    title: 'Comment apprendre le rappel à un chiot ?',
    author: 'Julie Martin',
    authorAvatar: 'JM',
    excerpt: 'Mon chiot de 4 mois a du mal avec le rappel. Avez-vous des astuces qui ont fonctionné pour vous ?',
    category: 'Éducation',
    likes: 24,
    comments: 12,
    views: 156,
    timeAgo: 'Il y a 2h',
    tags: ['Rappel', 'Chiot', 'Éducation de base'],
  },
  {
    id: 2,
    title: "Les meilleures friandises pour l'entraînement",
    author: 'Marc Dubois',
    authorAvatar: 'MD',
    excerpt: 'Je partage ma liste de friandises préférées pour l’entraînement. Les petits morceaux de fromage fonctionnent super bien !',
    category: 'Conseils',
    likes: 45,
    comments: 23,
    views: 289,
    timeAgo: 'Il y a 5h',
    tags: ['Friandises', 'Motivation', 'Récompense'],
  },
];

type Props = NativeStackScreenProps<UserStackParamList, 'forum'>;

export default function ForumScreen({ navigation, route }: Props) {
  const { clubId } = route.params;
  const [query, setQuery] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('clubCommunity', { clubId })}
          >
            <Ionicons name="arrow-back" size={20} color={palette.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forum</Text>
          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Nouveau post</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un sujet..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, color: palette.text }}
          />
        </View>

        <View style={styles.tabs}>
          {['Popularité', 'Récents', 'Mes posts'].map((tab) => (
            <View key={tab} style={styles.tab}>
              <Text style={styles.tabText}>{tab}</Text>
            </View>
          ))}
        </View>

        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('postDetail', { postId: post.id })}
          >
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.authorAvatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.meta}>
                  {post.author} · {post.timeAgo}
                </Text>
                <Text style={styles.excerpt}>{post.excerpt}</Text>
                <View style={styles.chips}>
                  {post.tags.map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>#{t}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.actions}>
                  <View style={styles.action}>
                    <Ionicons name="thumbs-up-outline" size={16} color={palette.gray} />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </View>
                  <View style={styles.action}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={palette.gray} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </View>
                  <View style={styles.action}>
                    <Ionicons name="eye-outline" size={16} color={palette.gray} />
                    <Text style={styles.actionText}>{post.views}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créer un post</Text>
          <TextInput
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder="Titre"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
          <TextInput
            value={newPostContent}
            onChangeText={setNewPostContent}
            placeholder="Votre message..."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            multiline
          />
          <View style={styles.tagGrid}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={selectedTags.includes(tag) ? styles.tagTextActive : styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Publier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, gap: 14, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 8, borderRadius: 10, backgroundColor: '#E5E7EB' },
  headerTitle: { color: palette.text, fontSize: 22, fontWeight: '700' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#E5E7EB' },
  tabText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  row: { flexDirection: 'row', gap: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: palette.primary, fontWeight: '700' },
  title: { color: palette.text, fontSize: 16, fontWeight: '700' },
  meta: { color: palette.gray, fontSize: 12 },
  excerpt: { color: palette.text, fontSize: 13, marginTop: 6, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: palette.gray, fontSize: 12 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
    backgroundColor: '#F9FAFB',
  },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagActive: { borderColor: palette.primary, backgroundColor: '#E0F2F1' },
  tagText: { color: palette.text, fontWeight: '600' },
  tagTextActive: { color: palette.primary, fontWeight: '700' },
});
