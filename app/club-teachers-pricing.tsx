import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClubStackParamList } from '@/navigation/types';

const palette = {
  primary: '#E9B782',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<ClubStackParamList, 'clubTeachersPricing'>;

export default function ClubTeachersPricingScreen({ navigation, route }: Props) {
  const currentTeachersCount = Number(route.params?.current ?? 1);

  const [selectedCount, setSelectedCount] = useState(5);
  const pricePerTeacher = 5;
  const freeTeacherThreshold = 5;

  const calculatePrice = (count: number) => {
    const free = Math.floor(count / freeTeacherThreshold);
    const paid = count - free;
    const total = paid * pricePerTeacher;
    return { free, paid, total };
  };

  const priceInfo = useMemo(() => calculatePrice(selectedCount), [selectedCount]);

  const pricingOptions = [
    { count: 1, popular: false },
    { count: 3, popular: false },
    { count: 5, popular: true },
    { count: 10, popular: false },
  ];

  const continueToPayment = () => {
    navigation.navigate('clubTeachersPayment', { count: selectedCount, price: priceInfo.total });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('clubTeachers')}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Ajouter des professeurs</Text>
            <Text style={styles.headerSub}>Choisissez le nombre de professeurs à ajouter</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="people" size={22} color="#fff" />
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={18} color="#1D4ED8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoText}>
                Actuellement : {currentTeachersCount} professeur(s). 2 professeurs gratuits déjà utilisés.
              </Text>
              <Text style={styles.infoText}>1 professeur offert tous les 5 professeurs ajoutés.</Text>
            </View>
          </View>

          <View style={styles.offerCard}>
            <MaterialCommunityIcons name="gift-outline" size={22} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.offerTitle, { color: '#166534' }]}>Offre spéciale</Text>
              <Text style={[styles.infoText, { color: '#166534' }]}>1 professeur offert tous les 5.</Text>
              <Text style={[styles.infoText, { color: '#166534' }]}>Plus vous ajoutez, plus vous économisez.</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Forfaits disponibles</Text>
          <View style={{ gap: 10 }}>
            {pricingOptions.map((opt) => {
              const info = calculatePrice(opt.count);
              const selected = selectedCount === opt.count;
              return (
                <TouchableOpacity
                  key={opt.count}
                  style={[
                    styles.card,
                    selected && { borderColor: palette.primary, borderWidth: 2 },
                    opt.popular && { backgroundColor: '#FFF7ED' },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedCount(opt.count)}
                >
                  {opt.popular ? (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Populaire</Text>
                    </View>
                  ) : null}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {opt.count} professeur{opt.count > 1 ? 's' : ''}
                    </Text>
                    {info.free > 0 ? (
                      <View style={[styles.badge, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.badgeText, { color: '#166534' }]}>+{info.free} offert</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.cardMeta}>
                    {info.paid} x {pricePerTeacher}€{info.free > 0 ? ` + ${info.free} offert` : ''}
                  </Text>
                  {opt.count >= freeTeacherThreshold ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <MaterialCommunityIcons name="trending-up" size={16} color="#16A34A" />
                      <Text style={[styles.cardMeta, { color: '#166534' }]}>
                        Économie de {info.free * pricePerTeacher}€
                      </Text>
                    </View>
                  ) : null}
                  {selected ? (
                    <View style={styles.check}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customCard}>
            <Text style={styles.cardTitle}>Nombre personnalisé</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setSelectedCount((c) => Math.max(1, c - 1))}
              >
                <Text style={styles.circleText}>-</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.cardTitle}>{selectedCount} professeur(s)</Text>
                {priceInfo.free > 0 ? (
                  <Text style={[styles.cardMeta, { color: '#166534' }]}>+ {priceInfo.free} offert(s)</Text>
                ) : null}
              </View>
              <TouchableOpacity style={styles.circleBtn} onPress={() => setSelectedCount((c) => c + 1)}>
                <Text style={styles.circleText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.sectionTitle}>Récapitulatif</Text>
            <View style={{ gap: 6, marginTop: 6 }}>
              <View style={styles.summaryRow}>
                <Text style={styles.cardMeta}>Professeurs payants</Text>
                <Text style={styles.cardMeta}>
                  {priceInfo.paid} x {pricePerTeacher}€
                </Text>
              </View>
              {priceInfo.free > 0 ? (
                <View style={styles.summaryRow}>
                  <Text style={[styles.cardMeta, { color: '#166534' }]}>Professeurs offerts</Text>
                  <Text style={[styles.cardMeta, { color: '#166534' }]}>+{priceInfo.free}</Text>
                </View>
              ) : null}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.cardTitle}>Total</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.cardTitle, { color: palette.primary }]}>{priceInfo.total}€</Text>
                  <Text style={styles.cardMeta}>/mois</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>
                Total de {selectedCount} professeur(s) ({priceInfo.paid} payant(s)
                {priceInfo.free > 0 ? ` + ${priceInfo.free} offert(s)` : ''})
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={continueToPayment}>
          <Text style={styles.primaryBtnText}>Continuer vers le paiement</Text>
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
  container: { padding: 16, gap: 14 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: { color: palette.text, fontSize: 13 },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  offerTitle: { fontWeight: '700', fontSize: 15 },
  sectionTitle: { color: palette.text, fontWeight: '700', fontSize: 16 },
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
  },
  popularBadge: {
    position: 'absolute',
    right: 12,
    top: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#22C55E',
    borderRadius: 8,
  },
  popularText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { color: palette.text, fontWeight: '700', fontSize: 15 },
  cardMeta: { color: palette.gray, fontSize: 13 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, flexDirection: 'row', gap: 4, alignItems: 'center' },
  badgeText: { fontWeight: '700', fontSize: 12 },
  check: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    gap: 10,
  },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  circleBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  circleText: { color: palette.text, fontWeight: '700', fontSize: 18 },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: palette.border, marginVertical: 8 },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: '#fff',
  },
  primaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: palette.primary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
});
