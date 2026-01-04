import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import TeacherBottomNav from '@/components/TeacherBottomNav';
import { TeacherStackParamList } from '@/navigation/types';

const palette = {
  primary: '#35A89C',
  primaryDark: '#2B8A7F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E6E2DD',
  surface: '#FFFFFF',
  background: '#F7F4F0',
};

export default function TeacherExportSessionsPage() {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exporter mes sessions</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="construct-outline" size={28} color={palette.primary} />
          </View>
          <Text style={styles.cardTitle}>Service en construction</Text>
          <Text style={styles.cardSubtitle}>L'export de sessions arrive bientot.</Text>
        </View>
      </View>
      <TeacherBottomNav current="teacher-account" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  headerSpacer: {
    width: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E7F4F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: palette.gray,
    textAlign: 'center',
  },
});
