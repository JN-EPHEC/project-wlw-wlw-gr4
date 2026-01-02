import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Clipboard,
  Share,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Timestamp } from 'firebase/firestore';
import { Promotion } from '@/hooks/useActivePromotions';
import { useClubImage } from '@/hooks/useClubImage';

const palette = {
  primary: '#41B6A6',
  primaryDark: '#359889',
  gray: '#6B7280',
  text: '#1F2937',
  danger: '#EF4444',
};

export default function PromoDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { promotion } = route.params as { promotion: Promotion };
  const [copied, setCopied] = useState(false);
  const { imageUrl, loading: imageLoading } = useClubImage(promotion.clubId);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const formatDate = (date: Date | Timestamp) => {
    const d = date instanceof Timestamp ? date.toDate() : date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setString(promotion.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert('Succès', `Code "${promotion.code}" copié au presse-papiers`);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de copier le code');
    }
  };

  const handleShare = async () => {
    try {
      const validUntilDate = promotion.validUntil instanceof Timestamp ? promotion.validUntil.toDate() : promotion.validUntil instanceof Date ? promotion.validUntil : new Date(promotion.validUntil);
      await Share.share({
        message: `${promotion.title}\n\n${promotion.description}\n\nCode : ${promotion.code}\nValable jusqu'au ${formatDate(validUntilDate)}`,
        title: promotion.title,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleGoToClub = () => {
    navigation.navigate('clubDetail', { clubId: promotion.clubId });
  };

  const isExpiringSoon = () => {
    const now = new Date();
    const validUntil = promotion.validUntil instanceof Timestamp ? promotion.validUntil.toDate() : promotion.validUntil instanceof Date ? promotion.validUntil : new Date(promotion.validUntil);
    const daysLeft = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3;
  };

  const getDaysLeft = () => {
    const now = new Date();
    const validUntil = promotion.validUntil instanceof Timestamp ? promotion.validUntil.toDate() : promotion.validUntil instanceof Date ? promotion.validUntil : new Date(promotion.validUntil);
    const daysLeft = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={palette.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-social" size={24} color={palette.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          {imageLoading ? (
            <ActivityIndicator size="large" color={palette.primary} />
          ) : imageUrl ? (
            <>
              <Image source={{ uri: imageUrl }} style={styles.heroImage} />
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 0 }]} />
            </>
          ) : (
            <View style={{ flex: 1, backgroundColor: '#F3E8FF' }} />
          )}
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{promotion.discountPercentage}%</Text>
          </View>
        </View>

        {/* Promotion title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{promotion.title}</Text>
          <Text style={styles.description}>{promotion.description}</Text>
        </View>

        {/* Expiring warning */}
        {isExpiringSoon() && (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="alert" size={20} color={palette.danger} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.warningTitle}>Promotion expirante</Text>
              <Text style={styles.warningText}>Plus que {getDaysLeft()} jour(s) pour en profiter !</Text>
            </View>
          </View>
        )}

        {/* Promo code section */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionLabel}>Code promo</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{promotion.code}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <MaterialCommunityIcons name={copied ? 'check' : 'content-copy'} size={20} color="#fff" />
              <Text style={styles.copyButtonText}>{copied ? 'Copié' : 'Copier'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Validity dates section */}
        <View style={styles.datesSection}>
          <Text style={styles.sectionLabel}>Période de validité</Text>
          
          <View style={styles.dateItem}>
            <View style={styles.dateIcon}>
              <MaterialCommunityIcons name="calendar-start" size={20} color={palette.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>Début de la promotion</Text>
              <Text style={styles.dateValue}>{formatDate(promotion.validFrom)}</Text>
            </View>
          </View>

          <View style={styles.dateItem}>
            <View style={styles.dateIcon}>
              <MaterialCommunityIcons name="calendar-end" size={20} color={palette.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dateLabel}>Fin de la promotion</Text>
              <Text style={styles.dateValue}>{formatDate(promotion.validUntil)}</Text>
            </View>
          </View>
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="percent" size={20} color={palette.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoLabel}>Réduction</Text>
              <Text style={styles.infoValue}>{promotion.discountPercentage}% de réduction</Text>
            </View>
          </View>
        </View>

        {/* How to use */}
        <View style={styles.howToSection}>
          <Text style={styles.sectionLabel}>Comment utiliser cette promotion ?</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Copiez le code promo</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Réservez une séance ou un abonnement</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Entrez le code au moment du paiement</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleGoToClub}>
          <MaterialCommunityIcons name="office-building" size={20} color="#fff" />
          <Text style={styles.ctaButtonText}>Accéder au club</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  heroSection: {
    backgroundColor: '#F3E8FF',
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 20,
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    color: palette.gray,
    fontSize: 15,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: palette.danger,
    alignItems: 'center',
  },
  warningTitle: {
    color: palette.danger,
    fontWeight: '700',
    fontSize: 14,
  },
  warningText: {
    color: palette.danger,
    fontSize: 13,
    marginTop: 2,
  },
  codeSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: palette.primary,
  },
  codeText: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  copyButton: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  datesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  dateValue: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  infoLabel: {
    color: palette.gray,
    fontSize: 12,
  },
  infoValue: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  howToSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  ctaButton: {
    marginHorizontal: 16,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
