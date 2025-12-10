import { useEffect, useRef } from 'react';
import { useCommunityChannels } from './useCommunityChannels';
import { createDefaultChannels } from './useCreateChannel';

/**
 * Hook pour initialiser les salons par défaut d'un club
 * Crée automatiquement "Général" et "Annonces" si aucun salon n'existe
 */
export const useInitializeClubChannels = (clubId: string, userId: string) => {
  const { channels, loading } = useCommunityChannels(clubId);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Réinitialiser le flag si le clubId change
    hasInitialized.current = false;
  }, [clubId]);

  useEffect(() => {
    // Si on a chargé les données et qu'il n'y a aucun salon et qu'on n'a pas encore créé
    if (!loading && channels.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log('📱 [useInitializeClubChannels] Création des salons par défaut...');
      createDefaultChannels(clubId, userId).catch((error) => {
        console.error('Erreur lors de la création des salons par défaut:', error);
      });
    }
  }, [loading, channels.length, clubId, userId]);

  return { channels, loading };
};
