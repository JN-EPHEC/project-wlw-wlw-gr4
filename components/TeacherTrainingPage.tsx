import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, ProgressBarAndroid, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#F28B6F',
  accent: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

const modules = [
  { id: 1, title: 'Planifier un collectif', duration: '12 min', progress: 1 },
  { id: 2, title: 'Gestion client difficile', duration: '18 min', progress: 0.6 },
  { id: 3, title: 'Optimiser les notes de seance', duration: '10 min', progress: 0.2 },
  { id: 4, title: 'Securite terrain', duration: '8 min', progress: 0 },
];

const paths = [
  { id: 'cert', label: 'Certification club', value: '78%' },
  { id: 'home', label: 'Protocoles domicile', value: '54%' },
  { id: 'behavior', label: 'Reactivite', value: '32%' },
];

export default function TeacherTrainingPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();

  const renderProgress = (value: number) => {
    if (Platform.OS === 'android') {
      return <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={value} color={palette.primary} />;
    }
    return (
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${value * 100}%` }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Formation</Text>
            <Text style={styles.subtitle}>Progression et modules rapides</Text>
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('teacher-clubs')}
          >
            <Ionicons name="arrow-back" size={18} color={palette.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.highlightCard}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.highlightLabel}>Objectif semaine</Text>
            <Text style={styles.highlightTitle}>2 modules valides</Text>
            <Text style={styles.highlightMeta}>Streak: 4 jours</Text>
          </View>
          <View style={styles.streak}>
            <MaterialCommunityIcons name="fire" size={22} color="#F59E0B" />
            <Text style={styles.streakText}>4</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Parcours</Text>
          <TouchableOpacity onPress={() => navigation.navigate('teacher-account')}>
            <Text style={styles.link}>Certifs</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pathRow}>
          {paths.map((p) => (
            <View key={p.id} style={styles.pathCard}>
              <Text style={styles.pathValue}>{p.value}</Text>
              <Text style={styles.pathLabel}>{p.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modules</Text>
          <TouchableOpacity onPress={() => navigation.navigate('teacher-training')}>
            <Text style={styles.link}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {modules.map((mod) => (
            <View key={mod.id} style={styles.card}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.cardTitle}>{mod.title}</Text>
                <Text style={styles.cardMeta}>{mod.duration}</Text>
                {renderProgress(mod.progress)}
              </View>
              <TouchableOpacity
                style={[styles.primaryBtn, { paddingHorizontal: 14, paddingVertical: 10 }]}
                onPress={() => navigation.navigate('teacher-training')}
              >
                <Text style={styles.primaryBtnText}>{mod.progress === 1 ? 'Relire' : 'Continuer'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.checklist}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="checkbox-marked-outline" size={20} color={palette.accent} />
            <Text style={styles.sectionTitle}>Checklist terrain</Text>
          </View>
          <Text style={styles.cardMeta}>3 points restants avant votre prochain collectif</Text>
          <View style={styles.todoRow}>
            <Ionicons name="checkmark-circle" size={18} color={palette.accent} />
            <Text style={styles.cardMeta}>Matriel secu verifie</Text>
          </View>
          <View style={styles.todoRow}>
            <Ionicons name="ellipse-outline" size={18} color={palette.gray} />
            <Text style={styles.cardMeta}>Brief du groupe</Text>
          </View>
          <View style={styles.todoRow}>
            <Ionicons name="ellipse-outline" size={18} color={palette.gray} />
            <Text style={styles.cardMeta}>Plan de cours partage</Text>
          </View>
        </View>
      </ScrollView>
      <TeacherBottomNav current="teacher-home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 20, fontWeight: '700', color: palette.text },
  subtitle: { color: palette.gray, fontSize: 13 },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightCard: {
    backgroundColor: palette.primary,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightLabel: { color: '#FFE4D6', fontSize: 13 },
  highlightTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  highlightMeta: { color: '#FFE4D6', fontSize: 13 },
  streak: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  streakText: { color: '#F59E0B', fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
  link: { color: palette.primary, fontWeight: '700' },
  pathRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
  pathCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pathValue: { color: palette.text, fontSize: 18, fontWeight: '700' },
  pathLabel: { color: palette.gray, fontSize: 13 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
  },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  cardMeta: { color: palette.gray, fontSize: 13 },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
  },
  primaryBtn: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  checklist: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  todoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
