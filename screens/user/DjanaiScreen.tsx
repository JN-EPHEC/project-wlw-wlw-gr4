import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UserStackParamList, 'djanai'>;

const palette = {
  primary: '#41B6A6',
  accent: '#41B6A6',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
};

export default function DjanaiScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const previousPage = route.params?.previousPage;

  const handleBack = () => {
    nav.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DjanAI</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.introCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' }}
            style={styles.dogImage}
          />
          <View style={styles.introIcon}>
            <MaterialCommunityIcons name="brain" size={32} color={palette.white} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Programme d'Éducation Personnalisé</Text>
          <Text style={styles.helper}>
            Créez le profil de votre chien et répondez à quelques questions pour que DjanAI génère un programme
            d'entraînement sur-mesure.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('djanaiResults', {
                profile: { dog: 'Nala', level: 'Intermédiaire' },
                previousPage: previousPage ?? 'home',
              })
            }
          >
            <Text style={styles.primaryButtonText}>Commencer le Quiz</Text>
            <Ionicons name="arrow-forward-outline" size={20} color={palette.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: palette.accent,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  introCard: {
    borderRadius: 20,
    backgroundColor: palette.accent,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 24,
    position: 'relative',
    height: 200,
    overflow: 'hidden',
  },
  dogImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.3,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 16,
    backgroundColor: palette.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.text,
    textAlign: 'center',
  },
  helper: {
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.accent,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 10,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  primaryButtonText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
