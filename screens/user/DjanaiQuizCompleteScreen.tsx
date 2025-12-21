import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserStackParamList } from '@/navigation/types';

const colors = {
  primary: '#27b3a3',
  text: '#233042',
  textMuted: '#6a7286',
};

type Props = NativeStackScreenProps<UserStackParamList, 'djanaiQuizComplete'>;

export default function DjanaiQuizCompleteScreen({ route, navigation }: Props) {
  const { dogId, dogName } = route.params;

  const handleRestart = () => {
    navigation.replace('djanaiResults', { dogId, dogName, fromResults: true });
  };

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz Complété</Text>
        </View>
      <View style={styles.centered}>
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
          <Text style={styles.resultTitle}>Prêt à voir le programme de {dogName} ?</Text>
          <Text style={styles.resultSubtitle}>Nous avons analysé vos réponses pour créer un plan d'entraînement sur-mesure.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('djanai-program', {dogId})}>
              <Text style={styles.buttonText}>Voir mon programme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={handleRestart}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Recommencer le quiz</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F0F2F5' },
    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    centered: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 16 },
    resultTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    resultSubtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
    primaryButton: { backgroundColor: colors.primary, paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16, alignItems: 'center', width: '100%' },
    secondaryButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary, marginTop: 4 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    secondaryButtonText: { color: colors.primary },
});
