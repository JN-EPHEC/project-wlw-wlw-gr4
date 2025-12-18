import React, { useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const colors = {
    primary: '#27b3a3',
    accent: '#E9B782',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
    success: '#10B981',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeachersPayment'>;

export default function ClubTeachersPaymentScreen({ navigation, route }: Props) {
  const teachersCount = route.params.count ?? 1;
  const totalPrice = route.params.price ?? 0;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [accept, setAccept] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const isValid = useMemo(() => cardNumber.length === 19 && cardName && expiry.length === 5 && cvv.length === 3 && accept, [cardNumber, cardName, expiry, cvv, accept]);

  const formatCard = (v: string) => v.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || v;
  const formatExpiry = (v: string) => {
    const c = v.replace(/\D/g, '');
    return c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2, 4)}` : c;
  };

  const submit = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => navigation.navigate('clubTeachers'), 1500);
    }, 1500);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.centered}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        <Text style={styles.successTitle}>Paiement réussi !</Text>
        <Text style={styles.successSubtitle}>Votre abonnement pour {teachersCount} enseignant(s) est maintenant actif.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Paiement</Text>
        </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Abonnement pour <Text style={styles.summaryHighlight}>{teachersCount}</Text> enseignant(s)</Text>
            <Text style={styles.summaryPrice}>{totalPrice}€<Text style={{fontSize: 16, color: colors.textMuted}}>/mois</Text></Text>
        </View>

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations de paiement</Text>
            <TextInput value={cardNumber} onChangeText={t => setCardNumber(formatCard(t))} placeholder="Numéro de carte" style={styles.input} keyboardType="number-pad" maxLength={19} />
            <TextInput value={cardName} onChangeText={setCardName} placeholder="Nom sur la carte" style={styles.input} autoCapitalize="characters" />
            <View style={{flexDirection: 'row', gap: 16}}>
                <TextInput value={expiry} onChangeText={t => setExpiry(formatExpiry(t))} placeholder="MM/AA" style={[styles.input, {flex: 1}]} keyboardType="number-pad" maxLength={5} />
                <TextInput value={cvv} onChangeText={setCvv} placeholder="CVV" style={[styles.input, {flex: 1}]} keyboardType="number-pad" maxLength={3} secureTextEntry />
            </View>
        </View>

        <TouchableOpacity style={styles.termsRow} onPress={() => setAccept(!accept)}>
            <View style={[styles.checkbox, accept && styles.checkboxChecked]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
            <Text style={styles.termsText}>J’accepte les conditions et le prélèvement mensuel de {totalPrice}€.</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, (!isValid || processing) && {opacity: 0.7}]} onPress={submit} disabled={!isValid || processing}>
          {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Payer {totalPrice}€</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  summaryCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 1 },
  summaryText: { fontSize: 16, color: colors.textMuted },
  summaryHighlight: { fontWeight: 'bold', color: colors.text },
  summaryPrice: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginTop: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, gap: 12, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.background, borderRadius: 12, padding: 14, fontSize: 15 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: '#CFD8DC', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: { flex: 1, fontSize: 14, color: colors.textMuted },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: colors.background },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 16 },
  successSubtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
});