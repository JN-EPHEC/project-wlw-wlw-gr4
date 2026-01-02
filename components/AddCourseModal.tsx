import React, { useState, useMemo } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Timestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

interface AddCourseModalProps {
  visible: boolean;
  onClose: () => void;
  educatorId: string;
  clubId?: string;
}

const palette = {
  primary: '#E39A5C',
  primaryDark: '#D48242',
  accent: '#2F9C8D',
  text: '#1F2937',
  textSecondary: '#6B7280',
  background: '#F7F4F0',
  surface: '#FFFFFF',
  border: '#E6E2DD',
  success: '#16A34A',
  error: '#DC2626',
};

const DURATIONS = [30, 45, 60, 75, 90, 120];

export default function AddCourseModal({ visible, onClose, educatorId, clubId }: AddCourseModalProps) {
  const [courseType, setCourseType] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState('');
  const [selectedField, setSelectedField] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFieldPicker, setShowFieldPicker] = useState(false);

  // Fetch fields on modal open
  React.useEffect(() => {
    if (visible) {
      fetchFields();
    }
  }, [visible]);

  const fetchFields = async () => {
    try {
      const fieldsRef = collection(db, 'fields');
      let snapshot;
      
      if (clubId) {
        const q = query(fieldsRef, where('clubId', '==', clubId));
        snapshot = await getDocs(q);
      } else {
        snapshot = await getDocs(fieldsRef);
      }
      
      setFields(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
    setShowTimePicker(false);
  };

  const handleAddCourse = async () => {
    if (!courseType.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner le type de cours');
      return;
    }

    if (!clientName.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner le nom du client');
      return;
    }

    if (!dogName.trim()) {
      Alert.alert('Erreur', 'Veuillez renseigner le nom du chien');
      return;
    }

    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Erreur', 'Veuillez renseigner un prix valide');
      return;
    }

    if (!selectedField) {
      Alert.alert('Erreur', 'Veuillez sélectionner un terrain');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time
      const sessionDate = new Date(date);
      sessionDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

      // Create booking document
      const bookingData = {
        educatorId,
        clubId: clubId || 'independent',
        fieldId: selectedField.id,
        title: courseType,
        trainingType: courseType.toLowerCase(),
        description: notes,
        duration,
        price: parseFloat(price),
        currency: 'EUR',
        sessionDate: Timestamp.fromDate(sessionDate),
        status: 'confirmed',
        type: clubId ? 'club-based' : 'home-based',
        isGroupCourse: false,
        maxParticipants: 1,
        userIds: [],
        dogIds: [],
        paymentIds: [],
        paid: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Store client info
        participantInfo: [
          {
            name: clientName,
            phone: clientPhone,
            email: clientEmail || '',
            userId: 'manual-entry',
          },
        ],
        // Store dog info
        dogInfo: {
          name: dogName,
          breed: dogBreed,
        },
      };

      await addDoc(collection(db, 'Bookings'), bookingData);

      Alert.alert('Succès', 'Cours créé avec succès');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du cours');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseType('');
    setDate(new Date());
    setTime(new Date());
    setDuration(60);
    setPrice('');
    setSelectedField(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setDogName('');
    setDogBreed('');
    setNotes('');
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[palette.primary, palette.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Ajouter un cours</Text>
          <Text style={styles.headerSubtitle}>Planifiez une nouvelle séance d'éducation canine</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={palette.surface} />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Type de cours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type de cours</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Éducation de base, Agility..."
              placeholderTextColor={palette.textSecondary}
              value={courseType}
              onChangeText={setCourseType}
            />
          </View>

          {/* Date et Heure */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Heure</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.dateText}>{formatTime(time)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Durée et Prix */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <Text style={styles.label}>Durée (minutes)</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.pickerOption}
                    onPress={() => {
                      if (duration > DURATIONS[0]) {
                        const idx = DURATIONS.indexOf(duration);
                        setDuration(DURATIONS[idx - 1]);
                      }
                    }}
                  >
                    <Ionicons name="chevron-up" size={16} color={palette.text} />
                  </TouchableOpacity>
                  <Text style={styles.pickerValue}>{duration} min</Text>
                  <TouchableOpacity
                    style={styles.pickerOption}
                    onPress={() => {
                      if (duration < DURATIONS[DURATIONS.length - 1]) {
                        const idx = DURATIONS.indexOf(duration);
                        setDuration(DURATIONS[idx + 1]);
                      }
                    }}
                  >
                    <Ionicons name="chevron-down" size={16} color={palette.text} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Prix (€)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45"
                  placeholderTextColor={palette.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          {/* Terrain */}
          <View style={styles.section}>
            <Text style={styles.label}>Terrain</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowFieldPicker(!showFieldPicker)}
            >
              <Text style={[styles.dateText, !selectedField && { color: palette.textSecondary }]}>
                {selectedField ? selectedField.name : 'Sélectionner un terrain'}
              </Text>
              <Ionicons name={showFieldPicker ? 'chevron-up' : 'chevron-down'} size={16} color={palette.textSecondary} />
            </TouchableOpacity>

            {showFieldPicker && (
              <View style={styles.fieldList}>
                {fields.length > 0 ? (
                  fields.map((field) => (
                    <TouchableOpacity
                      key={field.id}
                      style={styles.fieldItem}
                      onPress={() => {
                        setSelectedField(field);
                        setShowFieldPicker(false);
                      }}
                    >
                      <Text style={styles.fieldItemText}>{field.name}</Text>
                      {selectedField?.id === field.id && (
                        <Ionicons name="checkmark" size={16} color={palette.accent} />
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noFieldsText}>Aucun terrain disponible</Text>
                )}
              </View>
            )}
          </View>

          {/* Informations client */}
          <View style={styles.section}>
            <Text style={[styles.label, { marginBottom: 12 }]}>Informations client</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom du client"
              placeholderTextColor={palette.textSecondary}
              value={clientName}
              onChangeText={setClientName}
            />
            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  placeholderTextColor={palette.textSecondary}
                  value={clientPhone}
                  onChangeText={setClientPhone}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.column}>
                <TextInput
                  style={styles.input}
                  placeholder="Email (opt.)"
                  placeholderTextColor={palette.textSecondary}
                  value={clientEmail}
                  onChangeText={setClientEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>

          {/* Informations chien */}
          <View style={styles.section}>
            <Text style={[styles.label, { marginBottom: 12 }]}>Informations sur le chien</Text>
            <View style={styles.row}>
              <View style={[styles.column, { marginRight: 8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom du chien"
                  placeholderTextColor={palette.textSecondary}
                  value={dogName}
                  onChangeText={setDogName}
                />
              </View>
              <View style={styles.column}>
                <TextInput
                  style={styles.input}
                  placeholder="Race"
                  placeholderTextColor={palette.textSecondary}
                  value={dogBreed}
                  onChangeText={setDogBreed}
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes (optionnel)</Text>
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Informations importantes, objectifs du cours..."
              placeholderTextColor={palette.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>
        </ScrollView>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
            onPress={handleAddCourse}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={palette.surface} />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter le cours</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    padding: 16,
    paddingTop: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: palette.surface,
    opacity: 0.9,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    color: palette.text,
    fontSize: 14,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  column: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  pickerOption: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  fieldList: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 8,
    maxHeight: 200,
  },
  fieldItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldItemText: {
    fontSize: 14,
    color: palette.text,
  },
  noFieldsText: {
    fontSize: 14,
    color: palette.textSecondary,
    padding: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: palette.surface,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  submitButton: {
    backgroundColor: palette.accent,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.surface,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
