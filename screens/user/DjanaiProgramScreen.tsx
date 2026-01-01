import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { UserStackParamList } from '@/navigation/types';
import { useDjanai } from '@/context/DjanaiContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebaseConfig';

type Props = NativeStackScreenProps<UserStackParamList, 'djanai-program'>;

type TabType = 'programme' | 'exercises' | 'advice' | 'progress';

export default function DjanaiProgramScreen({ navigation, route }: Props) {
  const { program, setProgram } = useDjanai();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('programme');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>({});
  const [completedExercises, setCompletedExercises] = useState<{[key: string]: boolean}>({});
  const dogId = (route.params as any)?.dogId;

  // Charger le programme et le suivi depuis Firestore
  useEffect(() => {
    const loadData = async () => {
      if (!user || !dogId) return;

      try {
        setLoading(true);

        // Charger le programme
        if (!program) {
          const docRef = doc(
            db,
            'users',
            user.uid,
            'dogs',
            dogId,
            'trainingPrograms',
            'latest'
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProgram(docSnap.data());
          }
        }

        // Charger le suivi
        const functions = getFunctions();
        const getExerciseProgressFn = httpsCallable(functions, 'getExerciseProgress');
        const progressResult = await getExerciseProgressFn({ dogId });
        const progressData = (progressResult.data as any)?.progress || {};
        setProgress(progressData);

        // Construire l'état des exercices complétés
        const completed: {[key: string]: boolean} = {};
        if (progressData.exercises) {
          Object.keys(progressData.exercises).forEach((exerciseName: string) => {
            completed[exerciseName] = progressData.exercises[exerciseName].completed || false;
          });
        }
        setCompletedExercises(completed);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, dogId, program, setProgram]);

  // Mettre à jour le suivi d'un exercice
  const toggleExerciseProgress = async (exerciseName: string) => {
    if (!user || !dogId) return;

    try {
      const newStatus = !completedExercises[exerciseName];
      const today = new Date().toISOString().split('T')[0];

      const functions = getFunctions();
      const updateProgress = httpsCallable(functions, 'updateExerciseProgress');

      await updateProgress({
        dogId,
        exerciseName,
        completed: newStatus,
        completedDate: today,
      });

      // Update local state
      setCompletedExercises({
        ...completedExercises,
        [exerciseName]: newStatus,
      });
    } catch (error) {
      console.error('Erreur mise à jour suivi:', error);
    }
  };

  const handleBack = () => {
    (navigation as any).navigate('home');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Programme DjanAI</Text>
        </View>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#41B6A6" />
          <Text style={styles.errorText}>Chargement du programme...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Programme DjanAI</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aucun programme disponible</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleBack}
          >
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Votre programme personnalisé</Text>
      </View>

      {/* Profile Tags */}
      <View style={styles.profileContainer}>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="dog" size={14} color="#41B6A6" />
            <Text style={styles.tagText}>{program.dogName}</Text>
          </View>
          {program.sessions && program.sessions.length > 0 && (
            <View style={styles.tag}>
              <MaterialCommunityIcons name="calendar" size={14} color="#41B6A6" />
              <Text style={styles.tagText}>{program.sessions.length} semaines</Text>
            </View>
          )}
          {program.exercises && program.exercises.length > 0 && (
            <View style={styles.tag}>
              <MaterialCommunityIcons name="dumbbell" size={14} color="#41B6A6" />
              <Text style={styles.tagText}>{program.exercises.length} exercice{program.exercises.length > 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>

        {/* Warning */}
        {program.warnings && (
          <View style={styles.warningBox}>
            <View style={styles.warningIcon}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Temps limité disponible</Text>
              <Text style={styles.warningText}>{program.warnings}</Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Envisager des solutions complémentaires (dog walker...)</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'programme' && styles.tabActive]}
          onPress={() => setActiveTab('programme')}
        >
          <MaterialCommunityIcons
            name="calendar"
            size={18}
            color={activeTab === 'programme' ? '#41B6A6' : '#6B7280'}
          />
          <Text style={[styles.tabText, activeTab === 'programme' && styles.tabTextActive]}>
            Programme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'exercises' && styles.tabActive]}
          onPress={() => setActiveTab('exercises')}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={18}
            color={activeTab === 'exercises' ? '#41B6A6' : '#6B7280'}
          />
          <Text style={[styles.tabText, activeTab === 'exercises' && styles.tabTextActive]}>
            Exercices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'advice' && styles.tabActive]}
          onPress={() => setActiveTab('advice')}
        >
          <MaterialCommunityIcons
            name="book-open"
            size={18}
            color={activeTab === 'advice' ? '#41B6A6' : '#6B7280'}
          />
          <Text style={[styles.tabText, activeTab === 'advice' && styles.tabTextActive]}>
            Conseils
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.tabActive]}
          onPress={() => setActiveTab('progress')}
        >
          <MaterialCommunityIcons
            name="chart-line"
            size={18}
            color={activeTab === 'progress' ? '#41B6A6' : '#6B7280'}
          />
          <Text style={[styles.tabText, activeTab === 'progress' && styles.tabTextActive]}>
            Suivi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'programme' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Programme d'entraînement</Text>
            {program.summary && (
              <Text style={styles.sectionDescription}>{program.summary}</Text>
            )}

            {program.sessions && program.sessions.map((session: any, idx: number) => (
              <View key={idx} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <MaterialCommunityIcons name="calendar-range" size={20} color="#41B6A6" />
                  <Text style={styles.sessionTitle}>Semaine {session.week}</Text>
                </View>
                <Text style={styles.sessionGoal}>{session.focus}</Text>

                {session.exercises && (
                  <View style={styles.exercisesList}>
                    {session.exercises.map((ex: string, exIdx: number) => (
                      <View key={exIdx} style={styles.exerciseItem}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{String(exIdx + 1)}</Text>
                        </View>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName}>{ex}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {session.notes && (
                  <Text style={styles.sessionNotes}>{session.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'exercises' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Exercices recommandés</Text>

            {program.exercises && program.exercises.map((item: any, idx: number) => (
              <View key={idx} style={styles.exerciseCard}>
                <View style={styles.exerciseCardHeader}>
                  <View style={styles.exerciseCardInfo}>
                    <Text style={styles.exerciseCardName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.exerciseCardDescription}>{item.description}</Text>
                    )}
                  </View>
                  <Switch
                    value={completedExercises[item.name] || false}
                    onValueChange={() => toggleExerciseProgress(item.name)}
                    trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                    thumbColor={completedExercises[item.name] ? '#10B981' : '#6B7280'}
                  />
                </View>

                <View style={styles.exerciseCardMeta}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#41B6A6" />
                    <Text style={styles.metaText}>{item.duration} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="calendar-outline" size={14} color="#F59E0B" />
                    <Text style={styles.metaText}>{item.frequency}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'advice' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Conseils d'entraînement</Text>

            {program.advices && program.advices.map((advice: string, idx: number) => (
              <View key={idx} style={styles.adviceCard}>
                <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#F59E0B" />
                <Text style={styles.adviceText}>{advice}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'progress' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Suivi des progrès</Text>

            {/* Statistiques globales */}
            {program.exercises && program.exercises.length > 0 && (
              <View style={styles.progressStatsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Exercices complétés</Text>
                  <Text style={styles.statValue}>
                    {Object.values(completedExercises).filter(Boolean).length}/{program.exercises.length}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${
                          program.exercises.length > 0
                            ? (Object.values(completedExercises).filter(Boolean).length / program.exercises.length) * 100
                            : 0
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Liste des exercices avec statut */}
            <Text style={styles.progressListTitle}>État des exercices</Text>
            {program.exercises && program.exercises.map((item: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.progressItem,
                  completedExercises[item.name] && styles.progressItemCompleted,
                ]}
              >
                <MaterialCommunityIcons
                  name={completedExercises[item.name] ? 'check-circle' : 'circle-outline'}
                  size={20}
                  color={completedExercises[item.name] ? '#10B981' : '#D1D5DB'}
                />
                <Text
                  style={[
                    styles.progressItemText,
                    completedExercises[item.name] && styles.progressItemTextCompleted,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Tab Components
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { 
    backgroundColor: '#41B6A6',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6 },
  title: { fontSize: 18, fontWeight: '700', color: 'white' },
  
  // Profile Section
  profileContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#41B6A6',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#41B6A6',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderLeftColor: '#DC2626',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  warningIcon: {
    paddingTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 2,
  },
  warningText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#41B6A6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#41B6A6',
  },

  // Content
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContent: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },

  // Session Card
  sessionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#41B6A6',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  sessionGoal: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  exercisesList: {
    marginTop: 8,
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#41B6A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  exerciseNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseMetaText: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Progress Section
  progressSection: {
    backgroundColor: '#F0FFFE',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#41B6A6',
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },

  // Exercise Card
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseEmoji: {
    fontSize: 24,
  },
  exerciseCardInfo: {
    flex: 1,
  },
  exerciseCardName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  exerciseCardDescription: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  exerciseCardMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Advice Card
  adviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 12,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  advicesList: {
    gap: 8,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  adviceText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginTop: 2,
  },

  // Exercise Card with Switch
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // Progress Styles
  progressStatsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#41B6A6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  progressItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  progressItemText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
  },
  progressItemTextCompleted: {
    color: '#10B981',
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },

  // Session Notes
  sessionNotes: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  errorButton: {
    backgroundColor: '#41B6A6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});