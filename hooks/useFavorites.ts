import { useEffect, useState } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

export type FavoriteType = 'club' | 'educator' | 'event';

interface UseFavoritesResult {
  favorites: Map<string, FavoriteType>; // Map de itemId -> type
  loading: boolean;
  isFavorite: (itemId: string) => boolean;
  addFavorite: (itemId: string, type: FavoriteType) => Promise<void>;
  removeFavorite: (itemId: string, type: FavoriteType) => Promise<void>;
  toggleFavorite: (itemId: string, type: FavoriteType) => Promise<void>;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<Map<string, FavoriteType>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Listener en temps réel sur tous les types de favoris
      const unsubscribers: (() => void)[] = [];

      const types: FavoriteType[] = ['club', 'educator', 'event'];
      
      types.forEach(type => {
        const favRef = collection(db, 'favorites', currentUser.uid, type);
        const unsubscribe = onSnapshot(favRef, (snapshot) => {
          setFavorites(prev => {
            const newFavs = new Map(prev);
            // Créer une nouvelle map avec uniquement les items de ce type
            snapshot.docs.forEach(doc => {
              newFavs.set(doc.id, type);
            });
            // Enlever les items supprimés
            prev.forEach((prevType, itemId) => {
              if (prevType === type && !snapshot.docs.find(doc => doc.id === itemId)) {
                newFavs.delete(itemId);
              }
            });
            return newFavs;
          });
        }, (error) => {
          console.warn(`Erreur lors du chargement des favoris ${type}:`, error);
        });
        
        unsubscribers.push(unsubscribe);
      });

      setLoading(false);

      return () => {
        unsubscribers.forEach(unsub => unsub());
      };
    } catch (err) {
      console.error('Erreur lors du chargement des favoris:', err);
      setLoading(false);
    }
  }, []);

  const isFavorite = (itemId: string): boolean => {
    return favorites.has(itemId);
  };

  const addFavorite = async (itemId: string, type: FavoriteType) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('Utilisateur non connecté');
      return;
    }

    try {
      const favRef = doc(db, 'favorites', currentUser.uid, type, itemId);
      await setDoc(favRef, {
        addedAt: new Date(),
        type: type,
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout du favori:', err);
      throw err;
    }
  };

  const removeFavorite = async (itemId: string, type: FavoriteType) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('Utilisateur non connecté');
      return;
    }

    try {
      const favRef = doc(db, 'favorites', currentUser.uid, type, itemId);
      await deleteDoc(favRef);
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
      throw err;
    }
  };

  const toggleFavorite = async (itemId: string, type: FavoriteType) => {
    try {
      if (isFavorite(itemId)) {
        await removeFavorite(itemId, type);
      } else {
        await addFavorite(itemId, type);
      }
    } catch (err) {
      console.error('Erreur lors du toggle du favori:', err);
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
};
