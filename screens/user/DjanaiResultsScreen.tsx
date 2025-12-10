import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UserStackParamList } from '@/navigation/types';
import { useDjanai } from '@/context/DjanaiContext';

type Props = NativeStackScreenProps<UserStackParamList, 'djanaiResults'>;

interface QuizQuestion {
  id: number;
  question: string;
  description?: string;
  type: 'single' | 'multiple' | 'multi-select';
  options: Array<{
    label: string;
    description?: string;
    emoji?: string;
  }>;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quel âge a votre chien ?',
    description: "L'âge influence les méthodes d'éducation recommandées.",
    type: 'single',
    options: [
      { label: 'Chiot (0-12 mois)', description: 'Apprentissage des bases', emoji: '🐕' },
      { label: 'Jeune (1-3 ans)', description: 'Plein d\'énergie, réactif', emoji: '🐕' },
      { label: 'Adulte (3-7 ans)', description: 'Maturité comportementale', emoji: '🐕' },
      { label: 'Senior (7+ ans)', description: 'Besoin d\'adaptations', emoji: '🐕' },
    ],
  },
  {
    id: 2,
    question: 'Quelle est la race ?',
    description: 'Chaque race a des besoins spécifiques.',
    type: 'single',
    options: [
      { label: 'Chien de travail', description: 'Berger, Malinois, Border Collie...' },
      { label: 'Chien sportif', description: 'Retriever, Setter, Springer...' },
      { label: 'Chien de compagnie', description: 'Chihuahua, Bichon, Caniche...' },
      { label: 'Terrier', description: 'Jack Russell, Bull Terrier...' },
      { label: 'Chien de garde', description: 'Rottweiler, Doberman, Dogue...' },
      { label: 'Croisé / Race mixte', description: 'Mélange de races' },
    ],
  },
  {
    id: 3,
    question: 'Quelle est sa taille ?',
    description: 'La taille influence les méthodes physiques d\'entraînement.',
    type: 'single',
    options: [
      { label: 'Petit (< 10 kg)', description: 'Facile à manipuler' },
      { label: 'Moyen (10-25 kg)', description: 'Taille standard' },
      { label: 'Grand (25-45 kg)', description: 'Nécessite de la force' },
      { label: 'Très grand (> 45 kg)', description: 'Contrôle important requis' },
    ],
  },
  {
    id: 4,
    question: 'Niveau d\'énergie ?',
    description: 'Détermine l\'intensité des exercices recommandés.',
    type: 'single',
    options: [
      { label: 'Calme 😴', description: 'Préfère les repos, peu actif', emoji: '😴' },
      { label: 'Modéré 🐕', description: 'Équilibré, moments de jeu', emoji: '🐕' },
      { label: 'Énergique ⚡', description: 'Très actif, besoin d\'exercice', emoji: '⚡' },
      { label: 'Hyperactif 🤪', description: 'Débordant d\'énergie constamment', emoji: '🤪' },
    ],
  },
  {
    id: 5,
    question: 'Votre expérience ?',
    description: 'Adapte les conseils à votre niveau.',
    type: 'single',
    options: [
      { label: 'Débutant', description: 'Premier chien, peu d\'expérience' },
      { label: 'Intermédiaire', description: 'Quelques chiens éduqués' },
      { label: 'Avancé', description: 'Expérience significative' },
      { label: 'Expert / Professionnel', description: 'Éducateur ou très expérimenté' },
    ],
  },
  {
    id: 6,
    question: 'Vos objectifs ?',
    description: 'Sélectionnez un ou plusieurs objectifs.',
    type: 'multi-select',
    options: [
      { label: 'Obéissance de base', description: 'Assis, couché, pas bouger...' },
      { label: 'Socialisation', description: 'Avec humains et autres chiens' },
      { label: 'Problèmes comportementaux', description: 'Aboiements, destruction...' },
      { label: 'Agility / Sport', description: 'Activités sportives' },
      { label: 'Tours et tricks', description: 'Apprentissage de tours amusants' },
      { label: 'Marche en laisse', description: 'Ne pas tirer, suivre' },
      { label: 'Rappel', description: 'Revenir au pied' },
      { label: 'Chien de thérapie', description: 'Calme et comportement adapté' },
    ],
  },
  {
    id: 7,
    question: 'Comportements actuels ?',
    description: 'Sélectionnez les comportements observés.',
    type: 'multi-select',
    options: [
      { label: 'Calme et posé', emoji: '😊' },
      { label: 'Excitable / Hyperactif', emoji: '😄' },
      { label: 'Anxieux / Peureux', emoji: '😰' },
      { label: 'Tendances agressives', emoji: '😠' },
      { label: 'Destructeur', emoji: '🪓' },
      { label: 'Aboie beaucoup', emoji: '🐕' },
      { label: 'Tire en laisse', emoji: '🐕' },
      { label: 'Saute sur les gens', emoji: '🐕' },
      { label: 'Creuse', emoji: '⛏️' },
      { label: 'Mâchonne tout', emoji: '🔧' },
    ],
  },
  {
    id: 8,
    question: 'Environnement',
    description: 'Décrivez son cadre de vie.',
    type: 'single',
    options: [
      { label: 'Appartement', description: 'Sans jardin' },
      { label: 'Maison avec petit jardin', description: 'Espace extérieur limité', emoji: '🏡' },
      { label: 'Maison avec grand jardin', description: 'Large space extérieur', emoji: '🏡' },
      { label: 'Milieu rural / Ferme', description: 'Grandes espaces naturels', emoji: '🌾' },
    ],
  },
  {
    id: 9,
    question: 'Temps disponible',
    description: 'Combien de temps par jour pouvez-vous consacrer ?',
    type: 'single',
    options: [
      { label: 'Moins de 30 min/jour', description: 'Très occupé' },
      { label: '30 min - 1h/jour', description: 'Temps raisonnable' },
      { label: '1-2h/jour', description: 'Bon temps disponible' },
      { label: 'Plus de 2h/jour', description: 'Très disponible' },
    ],
  },
];

export default function DjanaiResultsScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const { profile, previousPage, dogId, dogName } = route.params;
  const { setQuizAnswers } = useDjanai();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleAnswer = () => {
    const question = quizQuestions[currentQuestion];

    if (question.type === 'multi-select' && selectedOptions.length === 0) {
      return; // Empêcher de continuer sans sélection
    }

    const newAnswers = [...answers];
    if (question.type === 'multi-select') {
      newAnswers.push(selectedOptions);
    } else {
      newAnswers.push(selectedOptions[0] || '');
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers(newAnswers);
      setSelectedOptions([]);
    } else {
      setAnswers(newAnswers);
      setShowResults(true);
    }
  };

  const toggleOption = (label: string) => {
    const question = quizQuestions[currentQuestion];
    
    if (question.type === 'single') {
      setSelectedOptions([label]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(label)
          ? prev.filter(item => item !== label)
          : [...prev, label]
      );
    }
  };

  const handleBack = () => {
    nav.goBack();
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleGenerateProgram = () => {
    // Sauvegarder les réponses du quiz dans le context
    const quizAnswers = {
      age: answers[0] as string,
      breed: answers[1] as string,
      size: answers[2] as string,
      energy: answers[3] as string,
      experience: answers[4] as string,
      objectives: answers[5] as string[],
      behaviors: answers[6] as string[],
      environment: answers[7] as string,
      timeAvailable: answers[8] as string,
      dogId: dogId,
      dogName: dogName,
    };

    setQuizAnswers(quizAnswers as any);
    
    // Naviguer vers la page de chargement
    (nav as any).navigate('DjanaiLoadingScreen', { dogId });
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Programme généré</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.resultTitle}>
            {`Programme personnalisé pour ${dogName || 'votre chien'}`}
          </Text>
          <Text style={styles.helper}>
            Basé sur vos réponses, nous avons créé un programme d'entraînement adapté.
          </Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Résumé de vos réponses :</Text>
            {quizQuestions.map((q, idx) => {
              const answer = answers[idx];
              const answerText = Array.isArray(answer) ? answer.join(', ') : answer;
              return (
                <View key={q.id} style={styles.answerItem}>
                  <Text style={styles.answerQuestion}>{q.question}</Text>
                  <Text style={styles.answerValue}>{answerText}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primary} onPress={handleGenerateProgram}>
            <Text style={styles.primaryText}>Voir mes recommandations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondary} onPress={handleRestart}>
            <Text style={styles.secondaryText}>Recommencer le quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>DjanAI - Quiz</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Étape {currentQuestion + 1} sur {quizQuestions.length} — {Math.round(progress)}%
        </Text>

        {/* Question */}
        <Text style={styles.question}>{question.question}</Text>
        {question.description && (
          <Text style={styles.questionDescription}>{question.description}</Text>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(option.label);
            const isMultiSelect = question.type === 'multi-select';

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => toggleOption(option.label)}
              >
                {isMultiSelect && (
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                )}
                <View style={styles.optionContent}>
                  <View style={styles.optionLabelRow}>
                    {option.emoji && <Text style={styles.emoji}>{option.emoji}</Text>}
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                  </View>
                  {option.description && (
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedOptions.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleAnswer}
          disabled={selectedOptions.length === 0}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 16, gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: '#41B6A6', fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1, padding: 16 },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#41B6A6',
  },
  progressText: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 24,
    textAlign: 'right',
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 18,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  optionSelected: {
    borderColor: '#41B6A6',
    backgroundColor: '#F0FFFE',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#41B6A6',
    borderColor: '#41B6A6',
  },
  checkmark: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  emoji: {
    fontSize: 16,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionLabelSelected: {
    color: '#41B6A6',
  },
  optionDescription: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  continueButton: {
    backgroundColor: '#41B6A6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  helper: { color: '#6B7280', marginBottom: 16, lineHeight: 18 },
  primary: {
    backgroundColor: '#41B6A6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#41B6A6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  secondaryText: { 
    color: '#41B6A6', 
    fontWeight: '700' 
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  answerItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  answerQuestion: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#41B6A6',
  },
});
