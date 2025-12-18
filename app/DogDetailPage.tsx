import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useDogs } from '@/hooks/useDogs';

interface Dog {
  id?: string;
  name: string;
  breed: string;
  birthDate?: string | number;
  gender?: string;
  weight?: string;
  height?: string;
  photoUrl?: string;
  otherInfo?: string;
  vaccineFile?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt?: any;
    size?: number;
  };
  ownerId: string;
  createdAt?: any;
  updatedAt?: any;
}

const palette = {
    primary: '#41B6A6',
    secondary: '#359889',
    accent: '#E9B782',
    text: '#1F2937',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    border: '#E5E7EB',
};

export default function DogDetailPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const dogId = (route.params as any)?.dogId;
  const { deleteDog, loading: deleteLoading } = useDogs();

  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Charger les données du chien depuis Firestore
  useEffect(() => {
    const loadDog = async () => {
      if (!dogId) {
        setError('Aucun chien sélectionné');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, 'Chien', dogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Dog;
          setDog({
            ...data,
            id: dogId,
          });
        } else {
          setError('Chien non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement du chien');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDog();
  }, [dogId]);

  // Fonction pour calculer l'âge à partir de la date de naissance
  const calculateAge = (birthDate: string | number | undefined) => {
    if (!birthDate) return 'Non renseigné';

    try {
      let birth: Date;
      
      if (typeof birthDate === 'number') {
        birth = new Date(birthDate);
      } else if (typeof birthDate === 'string' && !isNaN(Number(birthDate))) {
        // String numérique (comme '1734000000000')
        birth = new Date(parseInt(birthDate, 10));
      } else {
        birth = new Date(birthDate);
      }
      
      if (isNaN(birth.getTime())) return 'Date invalide';
      
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;

      if (age === 0) {
        return `${months} mois`;
      }
      return `${age} ans`;
    } catch {
      return 'Date invalide';
    }
  };

  // Fonction pour ouvrir le certificat
  const openCertificate = async () => {
    if (!dog?.vaccineFile?.url) {
      Alert.alert('Erreur', 'Aucun certificat disponible');
      return;
    }

    try {
      const url = dog.vaccineFile.url;
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le certificat');
      console.error(err);
    }
  };

  // Formater la date d'upload
  const formatUploadDate = (uploadedAt: any) => {
    if (!uploadedAt) return 'Date inconnue';
    try {
      let date: Date;
      if (uploadedAt.toDate) {
        // Firestore Timestamp
        date = uploadedAt.toDate();
      } else if (typeof uploadedAt === 'number') {
        date = new Date(uploadedAt);
      } else {
        date = new Date(uploadedAt);
      }
      return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Date invalide';
    }
  };

  // Fonction pour supprimer le chien
  const handleDeleteDog = async () => {
    if (!dog?.id) return;
    
    try {
      await deleteDog(dog.id, dog.photoUrl);
      Alert.alert('Succès', 'Profil du chien supprimé avec succès');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de supprimer le profil du chien');
      console.error('Erreur suppression chien:', err);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !dog) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || 'Erreur'}</Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dogAge = calculateAge(dog.birthDate);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Dog Profile */}
        <View style={styles.headerGradient}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            {dog.photoUrl ? (
              <Image
                source={{ uri: dog.photoUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📷</Text>
              </View>
            )}

            <View style={styles.dogInfoSection}>
              <Text style={styles.dogName}>{dog.name}</Text>
              <Text style={styles.dogBreed}>{dog.breed}</Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>{dogAge}</Text>
                <Text style={styles.statSeparator}>•</Text>
                <Text style={styles.stat}>{dog.weight || 'Non renseigné'}</Text>
                {dog.height && (
                  <>
                    <Text style={styles.statSeparator}>•</Text>
                    <Text style={styles.stat}>{dog.height}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Gamification CTA */}
          <TouchableOpacity
            style={[styles.card, styles.gamificationCard]}
            onPress={() => {
              // Navigation vers progression
              (navigation as any).navigate('dogProgression', { dogId: dog.id });
            }}
          >
            <View style={styles.gamificationContent}>
              <View style={styles.gamificationIconContainer}>
                <MaterialCommunityIcons name="trophy" size={24} color="white" />
              </View>
              <View style={styles.gamificationTextContainer}>
                <Text style={styles.gamificationTitle}>Niveau 12 • 2840 XP</Text>
                <Text style={styles.gamificationSubtitle}>
                  Voir la progression & tâches
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="white"
              />
            </View>
          </TouchableOpacity>

          {/* Quick Info Cards */}
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoGrid}>
            <View style={[styles.infoCard, { borderLeftColor: palette.primary }]}>
              <Text style={styles.infoLabel}>Âge</Text>
              <Text style={styles.infoValue}>{dogAge}</Text>
            </View>
            <View style={[styles.infoCard, { borderLeftColor: palette.accent }]}>
              <Text style={styles.infoLabel}>Poids</Text>
              <Text style={styles.infoValue}>
                {dog.weight || 'Non renseigné'}
              </Text>
            </View>
            {dog.height && (
              <View style={[styles.infoCard, { borderLeftColor: '#F28B6F' }]}>
                <Text style={styles.infoLabel}>Taille</Text>
                <Text style={styles.infoValue}>{dog.height}</Text>
              </View>
            )}
            <View style={[styles.infoCard, { borderLeftColor: '#9333EA' }]}>
              <Text style={styles.infoLabel}>Race</Text>
              <Text style={styles.infoValue}>{dog.breed}</Text>
            </View>
          </View>

          {/* Training Progress */}
          <Text style={styles.sectionTitle}>Progression d'apprentissage</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Niveau 3</Text>
            <View style={styles.progressList}>
              {[ 
                { skill: 'Assis', progress: 100 },
                { skill: 'Couché', progress: 100 },
                { skill: 'Pas bouger', progress: 85 },
                { skill: 'Rappel', progress: 70 },
                { skill: 'Marche en laisse', progress: 60 },
              ].map((item, index) => (
                <View key={index} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{item.skill}</Text>
                    <Text style={styles.progressValue}>{item.progress}%</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[ 
                        styles.progressFill,
                        { width: `${item.progress}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Upcoming Appointments */}
          <Text style={styles.sectionTitle}>Prochains rendez-vous</Text>
          <View style={styles.appointmentsList}>
            {[ 
              {
                type: 'Vétérinaire',
                date: '15 Nov 2025',
                time: '14h30',
                location: 'Clinique Vétérinaire du Parc',
                icon: '🏥',
              },
              {
                type: 'Séance Agility',
                date: '25 Oct 2025',
                time: '10h00',
                location: 'Club Canin Paris 15',
                icon: '🏃',
              },
              {
                type: 'Toilettage',
                date: '30 Oct 2025',
                time: '16h00',
                location: 'Salon Pattes de Velours',
                icon: '✂️',
              },
            ].map((appt, index) => (
              <View key={index} style={styles.appointmentCard}>
                <View style={styles.appointmentIcon}>
                  <Text style={styles.appointmentEmoji}>{appt.icon}</Text>
                </View>
                <View style={styles.appointmentDetails}>
                  <View style={styles.appointmentHeader}>
                    <Text style={styles.appointmentType}>{appt.type}</Text>
                    <Text style={styles.appointmentTime}>{appt.time}</Text>
                  </View>
                  <Text style={styles.appointmentDate}>{appt.date}</Text>
                  <Text style={styles.appointmentLocation}>{appt.location}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Certificates */}
          <Text style={styles.sectionTitle}>Documents & Certificats</Text>
          {dog?.vaccineFile ? (
            <View style={styles.certificateCard}>
              <View style={styles.certificateHeader}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.certificateName}>{dog.vaccineFile.name}</Text>
                  <Text style={styles.certificateDate}>
                    Ajouté le {formatUploadDate(dog.vaccineFile.uploadedAt)}
                  </Text>
                </View>
                <MaterialCommunityIcons name="file-pdf-box" size={32} color={palette.primary} />
              </View>
              <TouchableOpacity
                style={styles.certificateButton}
                onPress={openCertificate}
              >
                <Ionicons name="download-outline" size={16} color="#fff" />
                <Text style={styles.certificateButtonText}>Voir le document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noCertificateCard}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={palette.gray} />
              <Text style={styles.noCertificateText}>Aucun certificat disponible</Text>
            </View>
          )}

          {/* Health & Tracking */}
          <Text style={styles.sectionTitle}>Santé & suivi</Text>
          <View style={styles.healthGrid}>
            {[ 
              {
                label: 'Vaccins',
                status: 'À jour',
                icon: '💉',
                statusColor: '#10B981',
              },
              {
                label: 'Vermifuge',
                status: 'À jour',
                icon: '💊',
                statusColor: '#10B981',
              },
              {
                label: 'Visite véto',
                status: '15 Nov 2025',
                icon: '🏥',
                statusColor: '#3B82F6',
              },
            ].map((item, index) => (
              <View key={index} style={styles.healthCard}>
                <Text style={styles.healthEmoji}>{item.icon}</Text>
                <Text style={styles.healthLabel}>{item.label}</Text>
                <Text style={[styles.healthStatus, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>

          {/* Achievements & Badges */}
          <Text style={styles.sectionTitle}>Badges & Récompenses</Text>
          <View style={styles.card}>
            <Text style={styles.badgeCount}>12 badges</Text>
            <View style={styles.badgesGrid}>
              {[ 
                { emoji: '🏆', name: 'Champion', unlocked: true },
                { emoji: '⭐', name: 'Étoile', unlocked: true },
                { emoji: '🎯', name: 'Précision', unlocked: true },
                { emoji: '🚀', name: 'Rapide', unlocked: true },
                { emoji: '❤️', name: 'Sociable', unlocked: true },
                { emoji: '🧠', name: 'Intelligent', unlocked: true },
                { emoji: '💪', name: 'Fort', unlocked: false },
                { emoji: '🎓', name: 'Diplômé', unlocked: false },
              ].map((badge, index) => (
                <View
                  key={index}
                  style={[ 
                    styles.badge,
                    !badge.unlocked && styles.badgeLockedContainer,
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* DjanAI Program */}
          <View>
            <View style={styles.djanaiHeader}>
              <MaterialCommunityIcons name="lightbulb" size={24} color={palette.accent} />
              <Text style={styles.djanaiTitle}>DjanAI - Programme Personnalisé</Text>
            </View>

            {/* Créer un nouveau programme */}
            <TouchableOpacity
              style={[styles.card, styles.djanaiCardCreate]}
              onPress={() => {
                (navigation as any).navigate('djanaiResults', { 
                  previousPage: 'dogDetail',
                  dogId: dog.id,
                  dogName: dog.name,
                });
              }}
            >
              <View style={styles.djanaiCardContent}>
                <View style={[styles.djanaiCardIcon, { backgroundColor: palette.primary }]}>
                  <MaterialCommunityIcons name="lightbulb" size={24} color="white" />
                </View>
                <View style={styles.djanaiCardText}>
                  <Text style={styles.djanaiCardTitle}>Créer un programme avec DjanAI</Text>
                  <Text style={styles.djanaiCardSubtitle}>
                    Répondez à quelques questions pour obtenir un programme personnalisé pour {dog.name}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={palette.gray} />
              </View>
            </TouchableOpacity>

            {/* Accéder au programme existant */}
            <TouchableOpacity
              style={[styles.card, styles.djanaiCardExisting]}
              onPress={() => {
                (navigation as any).navigate('djanai-program', { dogId: dog.id });
              }}
            >
              <View style={styles.djanaiCardContent}>
                <View style={[styles.djanaiCardIcon, { backgroundColor: palette.accent }]}>
                  <MaterialCommunityIcons name="pulse" size={24} color="white" />
                </View>
                <View style={styles.djanaiCardText}>
                  <Text style={styles.djanaiCardTitle}>Voir mon programme</Text>
                  <Text style={styles.djanaiCardSubtitle}>
                    Consultez votre programme d'entraînement personnalisé
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={palette.gray} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              (navigation as any).navigate('editDog', { dogId: dog.id });
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: palette.primary }]}>
              <Ionicons name="create" size={20} color="white" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Éditer le profil</Text>
              <Text style={styles.actionSubtitle}>
                Modifier les informations de {dog.name}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.deleteActionCard]}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F28B6F' }]}>
              <MaterialCommunityIcons name="trash-can" size={20} color="white" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Supprimer le profil</Text>
              <Text style={styles.actionSubtitle}>
                Supprimer le profil de {dog.name}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={palette.gray}
            />
          </TouchableOpacity>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <View style={styles.confirmationCard}>
              <View style={styles.confirmationContent}>
                <View style={styles.confirmationIcon}>
                  <MaterialCommunityIcons name="trash-can" size={24} color="white" />
                </View>
                <Text style={styles.confirmationTitle}>
                  Confirmer la suppression
                </Text>
                <Text style={styles.confirmationMessage}>
                  Êtes-vous sûr de vouloir supprimer définitivement le profil de{' '}
                  {dog.name} ? Cette action est irréversible.
                </Text>
              </View>

              <View style={styles.confirmationButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDeleteDog}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="trash-can" size={16} color="white" />
                      <Text style={styles.buttonText}>Supprimer</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: palette.gray,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  headerGradient: {
    backgroundColor: palette.primary,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'white',
  },
  placeholderImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholderText: {
    fontSize: 48,
  },
  dogInfoSection: {
    flex: 1,
  },
  dogName: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  dogBreed: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statSeparator: {
    marginHorizontal: 6,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 8,
  },
  gamificationCard: {
    backgroundColor: palette.primary,
    borderWidth: 0,
  },
  gamificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gamificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamificationTextContainer: {
    flex: 1,
  },
  gamificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  gamificationSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: palette.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 16,
  },
  progressList: {
    gap: 12,
  },
  progressItem: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    color: palette.text,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 13,
    color: palette.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: palette.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: palette.primary,
    borderRadius: 3,
  },
  appointmentsList: {
    gap: 12,
    marginBottom: 8,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 12,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.lightGray,
  },
  appointmentEmoji: {
    fontSize: 20,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
  },
  appointmentTime: {
    fontSize: 11,
    color: palette.gray,
    backgroundColor: palette.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  appointmentDate: {
    fontSize: 11,
    color: palette.gray,
    marginBottom: 2,
  },
  appointmentLocation: {
    fontSize: 10,
    color: palette.gray,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  healthCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  healthEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 11,
    color: palette.gray,
    marginBottom: 4,
    textAlign: 'center',
  },
  healthStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeCount: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLockedContainer: {
    backgroundColor: '#F3F4F6',
    opacity: 0.4,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 9,
    color: palette.text,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  deleteActionCard: {
    backgroundColor: '#FEF2F2',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    color: palette.gray,
  },
  confirmationCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 16,
    marginBottom: 20,
  },
  confirmationContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 13,
    color: '#BE123C',
    textAlign: 'center',
    lineHeight: 18,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: palette.primary,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
  },
  djanaiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  djanaiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  djanaiCards: {
    gap: 12,
    marginBottom: 8,
  },
  djanaiCardCreate: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: palette.border,
  },
  djanaiCardExisting: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: palette.border,
  },
  djanaiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  djanaiCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  djanaiCardText: {
    flex: 1,
  },
  djanaiCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 2,
  },
  djanaiCardSubtitle: {
    fontSize: 11,
    color: palette.gray,
    lineHeight: 15,
  },
  certificateCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
  },
  certificateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  certificateName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  certificateDate: {
    fontSize: 12,
    color: palette.gray,
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    borderRadius: 10,
    paddingVertical: 10,
  },
  certificateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  noCertificateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    gap: 8,
  },
  noCertificateText: {
    fontSize: 14,
    color: palette.gray,
  },
});
