import { useEffect, useRef } from 'react';
import { useCommunityChannels } from './useCommunityChannels';

/**
 * Hook pour récupérer les salons d'un club
 * Les salons par défaut (Général et Annonces) sont créés lors de la création du club
 * Ce hook cherche juste les salons existants, ne crée pas de nouveaux
 */
export const useInitializeClubChannels = (clubId: string, userId: string) => {
  const { channels, loading, refetch } = useCommunityChannels(clubId);
  const initRef = useRef(false);

  useEffect(() => {
    // Réinitialiser le flag si le clubId change
    initRef.current = false;
  }, [clubId]);

  useEffect(() => {
    // Juste log une fois quand les channels sont chargés
    if (!loading && !initRef.current) {
      initRef.current = true;
      console.log('✅ [useInitializeClubChannels] Channels loaded for clubId:', clubId, 'Count:', channels.length);
    }
  }, [loading, channels.length, clubId]);

  return { channels, loading, refetch };
};
