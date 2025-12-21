import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useDjanai } from '@/context/DjanaiContext';

const colors = {
  primary: '#27b3a3',
  text: '#233042',
  textMuted: '#6a7286',
  background: '#F0F2F5',
};

// ... (votre fonction generateMockProgram reste ici, inchangée)

export default function DjanaiLoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizAnswers, setProgram, setIsLoading } = useDjanai();
  const { dogId, dogName } = (route.params as any) || {};

  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const generateProgram = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockProgram = generateMockProgram(quizAnswers);
      setProgram(mockProgram);

      setIsLoading(false);
      
      // @ts-ignore
      navigation.replace('djanaiQuizComplete', { dogId, dogName });
    };

    if (quizAnswers) {
      generateProgram();
    } else {
      navigation.goBack();
    }
  }, [quizAnswers, setProgram, setIsLoading, navigation, dogId, dogName, rotationAnim]);

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <MaterialCommunityIcons name="paw" size={64} color={colors.primary} />
        </Animated.View>
        <Text style={styles.loadingText}>Analyse des réponses en cours...</Text>
        <Text style={styles.loadingSubtext}>
          Notre intelligence artificielle DjanAI prépare le programme parfait pour {dogName || 'votre compagnon'}.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 20,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});

// N'oubliez pas d'inclure la fonction generateMockProgram ici si ce n'est pas déjà fait
function generateMockProgram(quizAnswers: any) {
    const ageCategory = quizAnswers?.age || 'Adulte (3-7 ans)';
    const dogName = quizAnswers?.dogName || 'Votre chien';
  
    return {
      dogId: quizAnswers?.dogId || 'temp-dog-id',
      dogName: dogName,
      ageCategory: ageCategory,
      energyLevel: quizAnswers?.energy || 'Modéré',
      objectives: quizAnswers?.objectives || ['Obéissance de base'],
      warnings: quizAnswers?.timeAvailable === 'Moins de 30 min/jour' 
        ? 'Temps limité disponible. Votre chien peut avoir besoin de plus de temps que vous pouvez offrir actuellement.'
        : undefined,
      programme: {
        title: `Programme ${ageCategory.split('(')[0].trim()}`,
        description: 'Focus sur la socialisation et les bases',
        sessions: [
          {
            id: 'week1-4',
            title: 'Semaine 1-4',
            goal: 'Socialisation, habituation aux stimuli',
            exercises: [
              { id: 'ex01', name: 'Promenade tranquille', duration: '20-30 min', frequency: 'Quotidien' },
              { id: 'ex02', name: 'Jeux calmes', duration: '15 min', frequency: 'Quotidien' },
            ],
          },
          {
            id: 'week5-8',
            title: 'Semaine 5-8',
            goal: 'Commandes de base : assis, couché',
            exercises: [
              { id: 'ex03', name: 'Assis', duration: '10 min', frequency: 'Quotidien' },
              { id: 'ex04', name: 'Couché', duration: '10 min', frequency: 'Quotidien' },
            ],
          },
          {
            id: 'week9-12',
            title: 'Semaine 9-12',
            goal: 'Marche en laisse, rappel simple',
            exercises: [
              { id: 'ex05', name: 'Marche en laisse', duration: '20 min', frequency: 'Quotidien' },
              { id: 'ex06', name: 'Rappel simple', duration: '10 min', frequency: 'Quotidien' },
            ],
          },
        ],
      },
      exercises: {
        title: 'Exercices pour chien énergique',
        description: 'Sélectionnez les exercices appropriés',
        items: [
          {
            id: 'run01',
            name: 'Course/vélo',
            duration: '30-45 min',
            frequency: 'Quotidien',
            emoji: '🚴',
            description: 'Exercise physique intense',
          },
          {
            id: 'run02',
            name: 'Agility/Parcours',
            duration: '20-30 min',
            frequency: '3-4x/semaine',
            emoji: '🏃',
            description: 'Activités sportives',
          },
          {
            id: 'run03',
            name: 'Jeux de balle intense',
            duration: '15-20 min',
            frequency: 'Quotidien',
            emoji: '⚽',
            description: 'Jeux de récupération',
          },
          {
            id: 'run04',
            name: 'Nage (si possible)',
            duration: '20-30 min',
            frequency: '2-3x/semaine',
            emoji: '🏊',
            description: 'Exercise complet et amusant',
          },
        ],
      },
      advice: {
        title: 'Conseils d\'entraînement',
        description: 'Principes généraux et conseils spécifiques',
        categories: [
          {
            id: 'gen-principles',
            title: 'Principes généraux',
            category: 'Principes généraux',
            tips: [
              'La patience et la cohérence sont essentielles',
              'Toujours utiliser le renforcement positif',
              'Ne jamais punir physiquement ou crier',
              'Adapter les méthodes à la personnalité du chien',
              'Consulter un professionnel en cas de doute',
            ],
          },
          {
            id: 'training-tips',
            title: 'Conseils d\'entraînement',
            category: 'Entraînement',
            tips: [
              'Séances courtes (5-10 min) mais fréquentes',
              'Toujours finir sur un succès',
              'Récompenser immédiatement les bons comportements',
              'Être cohérent dans les commands',
              'Pratiquer dans différents environnements',
            ],
          },
        ],
      },
    };
  }
