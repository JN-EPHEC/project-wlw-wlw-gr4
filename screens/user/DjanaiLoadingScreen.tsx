import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useDjanai } from '@/context/DjanaiContext';

const palette = {
  primary: '#41B6A6',
  accent: '#41B6A6',
  white: '#FFFFFF',
  lightText: 'rgba(255, 255, 255, 0.9)',
};

// ... (generateMockProgram function remains the same)
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


export default function DjanaiLoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizAnswers, setProgram, setIsLoading } = useDjanai();
  const dogId = (route.params as any)?.dogId;

  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    const circleAnimation = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.bezier(0.45, 0, 0.55, 1),
        useNativeDriver: true,
      })
    );

    circleAnimation.start();

    const generateProgram = async () => {
      setIsLoading(true);
      // Simulation de délai
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockProgram = generateMockProgram(quizAnswers);
      setProgram(mockProgram);
      setIsLoading(false);

      (navigation as any).replace('djanai-program', { dogId });
    };

    if (quizAnswers) {
      generateProgram();
    } else {
      navigation.goBack();
    }
  }, [quizAnswers, setProgram, setIsLoading, navigation, pulseAnim]);

  const animatedStyle = (delay: number) => ({
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 0.4, 0.8, 1],
          outputRange: [0, 1, 1, 0].map(v => v * 3 * (1 - delay)),
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 0.4, 0.8, 1],
      outputRange: [0, 0.7, 0, 0],
    }),
  });

  return (
    <LinearGradient colors={[palette.accent, palette.primary]} style={styles.safe}>
      <SafeAreaView style={styles.container}>
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.pulseCircle, animatedStyle(0)]} />
          <Animated.View style={[styles.pulseCircle, animatedStyle(0.3)]} />
          <Animated.View style={[styles.pulseCircle, animatedStyle(0.6)]} />
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="brain" size={64} color={palette.white} />
          </View>
        </View>
        <Text style={styles.loadingText}>DjanAI analyse vos réponses...</Text>
        <Text style={styles.loadingSubtext}>
          Création d'un programme sur-mesure pour vous et votre compagnon.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 999,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: palette.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingSubtext: {
    fontSize: 16,
    color: palette.lightText,
    textAlign: 'center',
    lineHeight: 24,
  },
});
