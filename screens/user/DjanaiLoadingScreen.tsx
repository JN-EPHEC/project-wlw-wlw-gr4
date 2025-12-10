import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDjanai } from '@/context/DjanaiContext';

export default function DjanaiLoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quizAnswers, setProgram, setIsLoading } = useDjanai();
  const dogId = (route.params as any)?.dogId;

  useEffect(() => {
    const generateProgram = async () => {
      setIsLoading(true);
      
      // Simulation de délai (1-2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: Ici on va appeler l'IA avec quizAnswers
      // const response = await callAI(quizAnswers);
      
      // Pour l'instant, générer un programme mock basé sur les réponses du quiz
      const mockProgram = generateMockProgram(quizAnswers);
      
      setProgram(mockProgram);
      setIsLoading(false);
      
      // Rediriger vers la page du programme
      (navigation as any).navigate('djanai-program', { dogId });
    };

    if (quizAnswers) {
      generateProgram();
    } else {
      // Pas de réponses, revenir en arrière
      navigation.goBack();
    }
  }, [quizAnswers, setProgram, setIsLoading, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>DjanAI</Text>
        <Text style={styles.subtitle}>Créons le profil de votre chien</Text>
      </View>

      <View style={styles.content}>
        <ActivityIndicator size="large" color="#41B6A6" />
        <Text style={styles.loadingText}>Génération de votre programme...</Text>
        <Text style={styles.loadingSubtext}>Cela peut prendre 1-2 minutes</Text>
      </View>
    </SafeAreaView>
  );
}

// Fonction utilitaire pour générer un programme mock
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#41B6A6',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },
});
