import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { UserStackParamList } from '@/navigation/types';
import { useDjanai } from '@/context/DjanaiContext';

const colors = {
  primary: '#27b3a3',
  text: '#233042',
  textMuted: '#6a7286',
  surface: '#ffffff',
  background: '#F0F2F5',
};

const quizQuestions = [
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

export default function DjanaiResultsScreen({ navigation, route }: NativeStackScreenProps<UserStackParamList, 'djanaiResults'>) {
  const { dogId, dogName, fromResults } = route.params;
  const { setQuizAnswers } = useDjanai();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  useEffect(() => {
    if(fromResults) {
        // This is a restart, so clear answers
        setAnswers({});
        setCurrentQuestion(0);
    }
  }, [fromResults]);

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
    } else {
        setQuizAnswers(answers);
        navigation.replace('DjanaiLoadingScreen', { dogId, dogName });
    }
  }

  const handleAnswer = (option: string) => {
    const question = quizQuestions[currentQuestion];
    let newAnswers = { ...answers };

    if (question.type === 'multi-select') {
      const current = newAnswers[question.id] || [];
      newAnswers[question.id] = current.includes(option) ? current.filter((i:string) => i !== option) : [...current, option];
    } else {
      newAnswers[question.id] = option;
      setTimeout(() => handleNext(), 300);
    }
    setAnswers(newAnswers);
  };

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Question {currentQuestion + 1}</Text>
      </View>
      
      <View style={styles.progressContainer}><View style={[styles.progressBar, { width: `${progress}%` }]} /></View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>{question.question}</Text>
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => {
            const isSelected = question.type === 'multi-select' ? (answers[question.id] || []).includes(option.label) : answers[question.id] === option.label;
            return (
              <TouchableOpacity key={idx} style={[styles.option, isSelected && styles.optionSelected]} onPress={() => handleAnswer(option.label)}>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {question.type === 'multi-select' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Suivant</Text>
            </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, flexGrow: 1 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, },
  backButton: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  progressContainer: { height: 8, backgroundColor: '#E5E7EB', marginHorizontal: 16, marginTop: 16, borderRadius: 4 },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  question: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 24, textAlign: 'center', marginTop: 20 },
  optionsContainer: { gap: 12, marginBottom: 24 },
  option: { backgroundColor: colors.surface, borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 16, padding: 20, alignItems: 'center' },
  optionSelected: { borderColor: colors.primary, backgroundColor: 'rgba(39, 179, 163, 0.1)' },
  optionText: { fontSize: 16, fontWeight: '600', color: colors.text },
  optionTextSelected: { color: colors.primary },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});