import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { UserStackParamList } from '@/navigation/types';
import { useDjanai } from '@/context/DjanaiContext';

type Props = NativeStackScreenProps<UserStackParamList, 'djanai-program'>;

type TabType = 'programme' | 'exercises' | 'advice';

export default function DjanaiProgramScreen({ navigation, route }: Props) {
  const { program } = useDjanai();
  const [activeTab, setActiveTab] = useState<TabType>('programme');

  const handleBack = () => {
    // Naviguer directement vers la liste des chiens
    (navigation as any).navigate('dogs');
  };

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
            <Text style={styles.tagText}>{program.ageCategory}</Text>
          </View>
          <View style={styles.tag}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#41B6A6" />
            <Text style={styles.tagText}>{program.energyLevel}</Text>
          </View>
          {program.objectives.length > 0 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{program.objectives.length} objectif{program.objectives.length > 1 ? 's' : ''}</Text>
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
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === 'programme' && (
          <ProgrammeTab programme={program.programme} />
        )}
        {activeTab === 'exercises' && (
          <ExercisesTab exercises={program.exercises} />
        )}
        {activeTab === 'advice' && (
          <AdviceTab advice={program.advice} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Tab Components
function ProgrammeTab({ programme }: any) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>{programme.title}</Text>
      <Text style={styles.sectionDescription}>{programme.description}</Text>

      {programme.sessions.map((session: any) => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <MaterialCommunityIcons name="calendar-range" size={20} color="#41B6A6" />
            <Text style={styles.sessionTitle}>{session.title}</Text>
          </View>
          <Text style={styles.sessionGoal}>{session.goal}</Text>

          <View style={styles.exercisesList}>
            {session.exercises.map((ex: any, idx: number) => (
              <View key={ex.id} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>{String(idx + 1)}</View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <View style={styles.exerciseMeta}>
                    <MaterialCommunityIcons name="clock" size={12} color="#6B7280" />
                    <Text style={styles.exerciseMetaText}>{ex.duration}</Text>
                    <MaterialCommunityIcons name="calendar-blank" size={12} color="#6B7280" style={{ marginLeft: 12 }} />
                    <Text style={styles.exerciseMetaText}>{ex.frequency}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.progressSection}>
        <MaterialCommunityIcons name="trending-up" size={20} color="#41B6A6" />
        <Text style={styles.progressTitle}>Suivi des progrès</Text>
        <Text style={styles.progressText}>
          Notez chaque semaine les progrès de votre chien pour ajuster le programme si nécessaire.
        </Text>
      </View>
    </View>
  );
}

function ExercisesTab({ exercises }: any) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>{exercises.title}</Text>
      <Text style={styles.sectionDescription}>{exercises.description}</Text>

      {exercises.items.map((item: any) => (
        <View key={item.id} style={styles.exerciseCard}>
          <View style={styles.exerciseCardHeader}>
            {item.emoji && <Text style={styles.exerciseEmoji}>{item.emoji}</Text>}
            <View style={styles.exerciseCardInfo}>
              <Text style={styles.exerciseCardName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.exerciseCardDescription}>{item.description}</Text>
              )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
          </View>

          <View style={styles.exerciseCardMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#41B6A6" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-outline" size={14} color="#F59E0B" />
              <Text style={styles.metaText}>{item.frequency}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function AdviceTab({ advice }: any) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>{advice.title}</Text>
      <Text style={styles.sectionDescription}>{advice.description}</Text>

      {advice.categories.map((category: any) => (
        <View key={category.id} style={styles.adviceCard}>
          <View style={styles.adviceHeader}>
            <MaterialCommunityIcons name="lightbulb-on" size={20} color="#41B6A6" />
            <Text style={styles.adviceTitle}>{category.title}</Text>
          </View>

          <View style={styles.advicesList}>
            {category.tips.map((tip: string, idx: number) => (
              <View key={idx} style={styles.adviceItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                <Text style={styles.adviceText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

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
