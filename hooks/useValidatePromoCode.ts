import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface PromoCode {
  id: string;
  code: string;
  clubId: string;
  discountPercentage: number;
  validFrom: Timestamp | Date;
  validUntil: Timestamp | Date;
  isActive: boolean;
}

interface UseValidatePromoCodeResult {
  validatePromoCode: (code: string, clubId: string) => Promise<PromoCode | null>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour valider et récupérer une promotion par code
 * @returns Fonction de validation et état
 */
export const useValidatePromoCode = (): UseValidatePromoCodeResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePromoCode = async (code: string, clubId: string): Promise<PromoCode | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!code.trim()) {
        return null;
      }

      console.log('🔍 [useValidatePromoCode] Validating code:', code, 'for clubId:', clubId);

      // Query: Chercher la promotion avec ce code et ce clubId
      const promotionsCollection = collection(db, 'promotions');
      const q = query(
        promotionsCollection,
        where('code', '==', code.toUpperCase().trim()),
        where('clubId', '==', clubId)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('❌ [useValidatePromoCode] Code not found');
        setError('Code promo invalide');
        return null;
      }

      const doc = snapshot.docs[0];
      const promoData = doc.data() as PromoCode;

      // Vérifier que la promotion est active
      if (!promoData.isActive) {
        console.log('⚠️ [useValidatePromoCode] Code is inactive');
        setError('Ce code promo est inactif');
        return null;
      }

      // Vérifier que la promotion est valide en date
      const now = new Date();
      const validFrom = promoData.validFrom instanceof Timestamp 
        ? promoData.validFrom.toDate() 
        : new Date(promoData.validFrom);
      const validUntil = promoData.validUntil instanceof Timestamp 
        ? promoData.validUntil.toDate() 
        : new Date(promoData.validUntil);

      if (now < validFrom) {
        console.log('⏳ [useValidatePromoCode] Code not valid yet');
        setError('Ce code promo n\'est pas encore valide');
        return null;
      }

      if (now > validUntil) {
        console.log('⏰ [useValidatePromoCode] Code expired');
        setError('Ce code promo a expiré');
        return null;
      }

      console.log('✅ [useValidatePromoCode] Code valid:', promoData);
      return {
        ...promoData,
        id: doc.id,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la validation';
      console.error('❌ [useValidatePromoCode] Error:', errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validatePromoCode, loading, error };
};
