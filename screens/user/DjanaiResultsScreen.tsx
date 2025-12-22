import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useDjanai } from '@/context/DjanaiContext';
import { UserStackParamList } from '@/navigation/types';

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

// ... (quizQuestions array remains unchanged)
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Quel âge a votre chien ?',
    description: "L'âge influence les méthodes d'éducation recommandées.",
    type: 'single',
    options: [
      { label: 'Chiot (0-12 mois)', description: 'Apprentissage des bases', emoji: '🐾' },
      { label: 'Jeune (1-3 ans)', description: 'Plein d\'énergie, réactif', emoji: '🐕' },
      { label: 'Adulte (3-7 ans)', description: 'Maturité comportementale', emoji: '🐶' },
      { label: 'Senior (7+ ans)', description: 'Besoin d\'adaptations', emoji: '🧓' },
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
      { label: 'Aboie beaucoup', emoji: '📢' },
      { label: 'Tire en laisse', emoji: '🐾' },
      { label: 'Saute sur les gens', emoji: '🤸' },
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
      { label: 'Maison avec grand jardin', description: 'Large space extérieur', emoji: '🌳' },
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


const palette = {
  primary: '#41B6A6',
  accent: '#41B6A6',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  lightGray: '#E5E7EB',
  lightGreen: '#F0FFFE',
};

export default function DjanaiResultsScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const { dogId, dogName } = route.params;
  const { setQuizAnswers } = useDjanai();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleAnswer = () => {
    const question = quizQuestions[currentQuestion];
    if (question.type === 'multi-select' && selectedOptions.length === 0) return;

    const newAnswers = [...answers, question.type === 'multi-select' ? selectedOptions : selectedOptions[0] || ''];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
    } else {
      setShowResults(true);
    }
  };

  const toggleOption = (label: string) => {
    const question = quizQuestions[currentQuestion];
    if (question.type === 'single') {
      setSelectedOptions([label]);
    } else {
      setSelectedOptions(prev => (prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]));
    }
  };

  const handleBack = () => nav.goBack();
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedOptions([]);
  };

  const handleGenerateProgram = () => {
    const quizResult = {
      age: answers[0],
      breed: answers[1],
      size: answers[2],
      energy: answers[3],
      experience: answers[4],
      objectives: answers[5],
      behaviors: answers[6],
      environment: answers[7],
      timeAvailable: answers[8],
      dogId,
      dogName,
    };
    setQuizAnswers(quizResult as any);
    (nav as any).navigate('DjanaiLoadingScreen', { dogId });
  };

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={palette.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  if (showResults) {
    return (
      <SafeAreaView style={styles.safe}>
        {renderHeader('Résultats du Quiz')}
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <View style={styles.resultsIcon}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={32} color={palette.accent} />
            </View>
            <Text style={styles.resultsTitle}>{`Profil pour ${dogName || 'votre chien'}`}</Text>
            <Text style={styles.resultsSubtitle}>
              Voici le résumé des informations que vous nous avez fournies.
            </Text>

            <View style={styles.divider} />

            {quizQuestions.map((q, idx) => (
              <View key={q.id} style={styles.answerItem}>
                <Text style={styles.answerQuestion}>{q.question}</Text>
                <Text style={styles.answerValue}>{Array.isArray(answers[idx]) ? (answers[idx] as string[]).join(', ') : answers[idx]}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateProgram}>
              <Text style={styles.primaryButtonText}>Générer mon programme</Text>
              <Ionicons name="arrow-forward" size={20} color={palette.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRestart}>
              <Text style={styles.secondaryButtonText}>Recommencer le quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {renderHeader('Quiz DjanAI')}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.quizContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1}/{quizQuestions.length}
        </Text>
        <Text style={styles.question}>{question.question}</Text>
        {question.description && <Text style={styles.questionDescription}>{question.description}</Text>}

        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(option.label);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => toggleOption(option.label)}
              >
                {question.type === 'multi-select' && (
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Ionicons name="checkmark" size={14} color={palette.white} />}
                  </View>
                )}
                {option.emoji && <Text style={styles.emoji}>{option.emoji}</Text>}
                <View style={styles.optionContent}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
                  {option.description && <Text style={styles.optionDescription}>{option.description}</Text>}
                </View>
                {question.type === 'single' && isSelected && (
                  <View style={styles.radioChecked}>
                    <Ionicons name="checkmark-circle" size={24} color={palette.accent} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, selectedOptions.length === 0 && styles.primaryButtonDisabled]}
          onPress={handleAnswer}
          disabled={selectedOptions.length === 0}
        >
          <Text style={styles.primaryButtonText}>
            {currentQuestion === quizQuestions.length - 1 ? 'Voir les résultats' : 'Continuer'}
          </Text>
          <Ionicons name="arrow-forward-outline" size={20} color={palette.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: palette.accent, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { color: palette.white, fontSize: 22, fontWeight: 'bold' },
  progressContainer: { height: 6, backgroundColor: palette.lightGray, borderRadius: 3, marginHorizontal: 16, marginTop: 16 },
  progressBar: { height: '100%', backgroundColor: palette.accent, borderRadius: 3 },
  progressText: { color: palette.textSecondary, fontSize: 14, fontWeight: '500', textAlign: 'center', marginVertical: 8, },
  quizContainer: { padding: 16, paddingBottom: 40 },
  question: { fontSize: 24, fontWeight: 'bold', color: palette.text, marginBottom: 8, textAlign: 'center' },
  questionDescription: { fontSize: 15, color: palette.textSecondary, marginBottom: 24, textAlign: 'center', lineHeight: 22 },
  optionsContainer: { gap: 12, marginBottom: 24 },
  option: { backgroundColor: palette.card, borderWidth: 2, borderColor: palette.card, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  optionSelected: { borderColor: palette.accent, backgroundColor: palette.lightGreen },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: palette.lightGray, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: palette.accent, borderColor: palette.accent },
  radioChecked: { marginLeft: 'auto' },
  emoji: { fontSize: 20 },
  optionContent: { flex: 1 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: palette.text },
  optionLabelSelected: { color: palette.primary },
  optionDescription: { fontSize: 13, color: palette.textSecondary, lineHeight: 18, marginTop: 4 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent, paddingVertical: 16, borderRadius: 12, marginTop: 16, gap: 10, shadowColor: palette.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10, width: '100%' },
  primaryButtonText: { color: palette.white, fontWeight: 'bold', fontSize: 16 },
  primaryButtonDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0 },
  resultsContainer: { padding: 16, paddingBottom: 40 },
  resultsCard: { backgroundColor: palette.card, borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 5 },
  resultsIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: palette.lightGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  resultsTitle: { fontSize: 22, fontWeight: 'bold', color: palette.text, textAlign: 'center', marginBottom: 8 },
  resultsSubtitle: { fontSize: 15, color: palette.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  divider: { height: 1, backgroundColor: palette.lightGray, width: '100%', marginBottom: 16 },
  answerItem: { borderBottomWidth: 1, borderBottomColor: palette.lightGray, paddingVertical: 12, width: '100%' },
  answerQuestion: { fontSize: 14, color: palette.textSecondary, marginBottom: 4 },
  answerValue: { fontSize: 16, fontWeight: '600', color: palette.accent },
  secondaryButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 12, width: '100%', borderWidth: 1, borderColor: palette.accent },
  secondaryButtonText: { color: palette.accent, fontWeight: '600', fontSize: 15 },
});
