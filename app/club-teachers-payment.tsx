import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
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

  const isValid = useMemo(
    () => cardNumber.replace(/\s/g, '').length === 16 && cardName && expiry.length === 5 && cvv.length === 3 && accept,
    [cardNumber, cardName, expiry, cvv, accept]
  );

  const formatCard = (value: string) => value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') ?? value;
  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  };

  const submit = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setCardNumber('');
      setCardName('');
      setExpiry('');
      setCvv('');
      setAccept(false);
      setTimeout(() => navigation.navigate('clubTeachers'), 1200);
    }, 1500);
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.successWrapper}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={40} color="#16A34A" />
          </View>
          <Text style={styles.headerTitle}>Paiement réussi !</Text>
          <Text style={styles.cardMeta}>
            Votre abonnement pour {teachersCount} professeur{teachersCount > 1 ? 's' : ''} est actif.
          </Text>
          <View style={{ marginTop: 14, alignItems: 'center' }}>
            <View style={styles.spinner} />
            <Text style={styles.cardMeta}>Redirection...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate({ name: 'clubTeachersPricing', params: {} })}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Paiement</Text>
            <Text style={styles.headerSub}>
              {teachersCount} professeur{teachersCount > 1 ? 's' : ''} - {totalPrice}€/mois
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.alert}>
            <MaterialCommunityIcons name="information-outline" size={18} color="#1D4ED8" />
            <Text style={[styles.cardMeta, { color: '#1D4ED8', flex: 1 }]}>
              Premier paiement aujourd’hui : {totalPrice}€. Renouvellement automatique mensuel. Annulation à tout moment.
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC', borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14 }]}
            onPress={() => navigation.navigate('educatorPayments')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <MaterialCommunityIcons name="account-cash" size={20} color="#16A34A" />
              <View>
                <Text style={[styles.sectionTitle, { color: '#16A34A' }]}>Voir les paiements</Text>
                <Text style={[styles.cardMeta, { color: '#22C55E' }]}>Suivi complet de tes paiements</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#16A34A" />
          </TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Carte bancaire</Text>
            <View style={{ gap: 12, marginTop: 8 }}>
              <View>
                <Text style={styles.label}>Numéro de carte</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={(text) => {
                    const clean = text.replace(/\s/g, '');
                    if (/^\d*$/.test(clean) && clean.length <= 16) setCardNumber(formatCard(clean));
                  }}
                  placeholder="1234 5678 9012 3456"
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View>
                <Text style={styles.label}>Nom sur la carte</Text>
                <TextInput
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder="JEAN DUPONT"
                  style={styles.input}
                  autoCapitalize="characters"
                  placeholderTextColor={palette.gray}
                />
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Expiration</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={(text) => {
                      const clean = text.replace(/\D/g, '');
                      if (clean.length <= 4) setExpiry(formatExpiry(clean));
                    }}
                    placeholder="MM/AA"
                    style={styles.input}
                    keyboardType="number-pad"
                    placeholderTextColor={palette.gray}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    value={cvv}
                    onChangeText={(text) => {
                      const clean = text.replace(/\D/g, '');
                      if (clean.length <= 3) setCvv(clean);
                    }}
                    placeholder="123"
                    style={styles.input}
                    secureTextEntry
                    keyboardType="number-pad"
                    placeholderTextColor={palette.gray}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setAccept((v) => !v)}
                style={[styles.checkbox, accept && { backgroundColor: palette.primary, borderColor: palette.primary }]}
              >
                {accept ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>J’accepte les conditions générales</Text>
                <Text style={styles.cardMeta}>
                  Prélèvement automatique de {totalPrice}€ chaque mois. Annulation possible à tout moment depuis votre
                  espace club.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="shield-lock-outline" size={18} color="#1F2937" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Paiement sécurisé</Text>
              <Text style={styles.infoText}>SSL 256-bit · Visa · Mastercard · Amex</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryBtn, (!isValid || processing) && { opacity: 0.6 }]}
          onPress={submit}
          disabled={!isValid || processing}
        >
          {processing ? (
            <>
              <View style={styles.spinner} />
              <Text style={styles.primaryBtnText}>Traitement...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="lock-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Payer {totalPrice}€</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#F8F3E9', fontSize: 12 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { padding: 16, gap: 12 },
  alert: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
  label: { color: palette.text, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: palette.text,
  },
  row: { flexDirection: 'row', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoTitle: { color: palette.text, fontWeight: '700' },
  infoText: { color: palette.gray, fontSize: 12 },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    alignSelf: 'center',
  },
  successWrapper: { alignItems: 'center', gap: 8, paddingHorizontal: 24 },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: {
    color: palette.gray,
    fontSize: 13,
    marginTop: 2,
  },
  cardTitle: {
    color: palette.text,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
});
