import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { UserStackParamList } from '@/navigation/types';

const colors = {
  primary: '#27b3a3',
  primaryDark: '#1f9c90',
  text: '#233042',
  textMuted: '#6a7286',
  surface: '#ffffff',
  shadow: 'rgba(26, 51, 64, 0.12)',
};

type Props = NativeStackScreenProps<UserStackParamList, 'djanai'>;

export default function DjanaiScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const previousPage = route.params?.previousPage;

  const handleBack = () => {
    nav.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>DjanAI</Text>
            <Text style={styles.headerSubtitle}>Votre assistant canin intelligent</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarRing}>
                <MaterialCommunityIcons name="brain" size={40} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.dogName}>Programme d'entraînement personnalisé</Text>
                <Text style={styles.dogBreed}>
                  Créez le profil de votre chien pour recevoir un programme sur-mesure.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate('djanaiResults', {
                  profile: { dog: 'Nala', level: 'Intermédiaire' },
                  previousPage: previousPage ?? 'home',
                })
              }
            >
              <Text style={styles.primaryButtonText}>Commencer le quiz</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 5,
    gap: 16,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: 'rgba(39, 179, 163, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogName: { color: colors.text, fontSize: 18, fontWeight: '800' },
  dogBreed: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#edf1f5' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});