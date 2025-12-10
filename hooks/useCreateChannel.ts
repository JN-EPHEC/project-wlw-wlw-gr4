import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface CreateChannelParams {
  clubId: string;
  name: string;
  description?: string;
  type?: 'chat' | 'announcements';
  isPrivate?: boolean;
  createdBy: string;
}

/**
 * Crée un nouveau canal de communauté
 */
export const createCommunityChannel = async (params: CreateChannelParams) => {
  try {
    const channelsRef = collection(db, 'channels');
    
    const newChannel = {
      clubId: params.clubId,
      name: params.name.trim(),
      description: params.description?.trim() || '',
      type: params.type || 'chat',
      isPrivate: params.isPrivate || false,
      createdBy: params.createdBy,
      createdAt: Date.now(),
      members: [params.createdBy], // Le créateur est automatiquement membre
    };

    const docRef = await addDoc(channelsRef, newChannel);
    
    console.log('✅ Channel created with ID:', docRef.id);
    return { id: docRef.id, ...newChannel };
  } catch (error) {
    console.error('❌ Error creating channel:', error);
    throw error;
  }
};

/**
 * DÉSACTIVÉ - Ne crée plus les salons par défaut
 * Les salons ne sont créés que manuellement par le propriétaire du club
 */
export const createDefaultChannels = async (clubId: string, createdBy: string) => {
  console.log('⚠️ [createDefaultChannels] Cette fonction est désactivée. Les salons doivent être créés manuellement.');
  return;
  
  // Code précédent - conservé pour historique
  /*
  try {
    // Créer le canal "Général"
    await createCommunityChannel({
      clubId,
      name: 'Général',
      description: 'Canal de discussion général du club',
      type: 'chat',
      createdBy,
    });

    // Créer le canal "Annonces"
    await createCommunityChannel({
      clubId,
      name: 'Annonces',
      description: 'Seuls les éducateurs peuvent publier',
      type: 'announcements',
      createdBy,
    });

    console.log('✅ Default channels created for club:', clubId);
  } catch (error) {
    console.error('❌ Error creating default channels:', error);
    throw error;
  }
  */
};
