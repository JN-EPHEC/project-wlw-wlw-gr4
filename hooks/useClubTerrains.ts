import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface Terrain {
  id: string;
  name: string;
  address: string;
  trainingStyle: string;
  createdAt?: any;
  updatedAt?: any;
}

const TRAINING_STYLES = [
  'Agility',
  'Obéissance',
  'Ring',
  'Pistage',
  'Recherche Utilitaire',
  'Flyball',
  'Canicross',
  'Éducation Canine',
  'Comportement',
  'Autre',
];

export const useClubTerrains = (clubId: string | null) => {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerrains = async () => {
    if (!clubId) {
      setTerrains([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const clubRef = doc(db, 'club', clubId);
      const clubDoc = await getDoc(clubRef);

      if (clubDoc.exists()) {
        const terrainsData = clubDoc.data()?.terrains || [];
        // Trier par date de création (les plus récents en premier)
        const sortedTerrains = terrainsData.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        setTerrains(sortedTerrains);
      } else {
        setTerrains([]);
      }
    } catch (err) {
      console.error('Erreur lors du fetch des terrains:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerrains();
  }, [clubId]);

  const addTerrain = async (terrainData: Omit<Terrain, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!clubId) throw new Error('clubId manquant');

    try {
      const newTerrain: Terrain = {
        id: `terrain_${Date.now()}`,
        ...terrainData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const clubRef = doc(db, 'club', clubId);
      
      // Utiliser setDoc avec merge pour créer le document s'il n'existe pas
      await setDoc(clubRef, {
        terrains: arrayUnion(newTerrain),
      }, { merge: true });

      await fetchTerrains();
      return newTerrain.id;
    } catch (err) {
      console.error('Erreur lors de la création du terrain:', err);
      throw err;
    }
  };

  const updateTerrain = async (terrainId: string, updates: Partial<Terrain>) => {
    try {
      const terrainToUpdate = terrains.find(t => t.id === terrainId);
      if (!terrainToUpdate) throw new Error('Terrain non trouvé');

      const updatedTerrain = {
        ...terrainToUpdate,
        ...updates,
        updatedAt: new Date(),
      };

      const clubRef = doc(db, 'club', clubId!);
      
      // Supprimer l'ancien et ajouter le nouveau
      await setDoc(clubRef, {
        terrains: arrayRemove(terrainToUpdate),
      }, { merge: true });

      await setDoc(clubRef, {
        terrains: arrayUnion(updatedTerrain),
      }, { merge: true });

      await fetchTerrains();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du terrain:', err);
      throw err;
    }
  };

  const deleteTerrain = async (terrainId: string) => {
    try {
      const terrainToDelete = terrains.find(t => t.id === terrainId);
      if (!terrainToDelete) throw new Error('Terrain non trouvé');

      const clubRef = doc(db, 'club', clubId!);
      await setDoc(clubRef, {
        terrains: arrayRemove(terrainToDelete),
      }, { merge: true });

      await fetchTerrains();
    } catch (err) {
      console.error('Erreur lors de la suppression du terrain:', err);
      throw err;
    }
  };

  return {
    terrains,
    loading,
    error,
    addTerrain,
    updateTerrain,
    deleteTerrain,
    refetch: fetchTerrains,
    trainingStyles: TRAINING_STYLES,
  };
};
