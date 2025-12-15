import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export interface MessageWithUserInfo {
  id: string;
  text: string;
  type: 'text' | 'image' | 'file';
  createdBy: string;
  createdAt: number;
  attachments?: Array<{
    url: string;
    type: string;
  }>;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
}

interface UseMessagesWithUserInfoResult {
  messagesWithInfo: MessageWithUserInfo[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook pour enrichir les messages avec les infos utilisateur (nom, prénom)
 * @param messages - Les messages bruts de Firestore
 * @returns Messsages enrichis avec les infos utilisateur
 */
export const useMessagesWithUserInfo = (messages: Array<{
  id: string;
  text: string;
  type: 'text' | 'image' | 'file';
  createdBy: string;
  createdAt: number;
  attachments?: Array<{ url: string; type: string }>;
}>): UseMessagesWithUserInfoResult => {
  const [messagesWithInfo, setMessagesWithInfo] = useState<MessageWithUserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      setMessagesWithInfo([]);
      setLoading(false);
      return;
    }

    const enrichMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les IDs utilisateurs uniques et valides
        const userIds = [...new Set(messages.map(msg => msg.createdBy).filter(id => id && id.trim()))];
        
        if (userIds.length === 0) {
          setMessagesWithInfo(messages.map(msg => ({
            ...msg,
            userName: msg.createdBy,
            userFirstName: '',
            userLastName: '',
          })));
          setLoading(false);
          return;
        }
        
        // Cache pour éviter de fetcher la même user plusieurs fois
        const userCache: Record<string, { firstName?: string; lastName?: string }> = {};

        // Fetch les infos utilisateur en parallèle
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              if (!userId || userId.trim() === '') {
                userCache[userId] = { firstName: '', lastName: '' };
                return;
              }

              const userRef = doc(db, 'users', userId);
              const userSnap = await getDoc(userRef);
              
              if (userSnap.exists()) {
                const userData = userSnap.data();
                userCache[userId] = {
                  firstName: userData.profile?.firstName || userData.firstName || '',
                  lastName: userData.profile?.lastName || userData.lastName || '',
                };
              } else {
                userCache[userId] = { firstName: '', lastName: '' };
              }
            } catch (err) {
              console.error(`❌ Error fetching user ${userId}:`, err);
              userCache[userId] = { firstName: '', lastName: '' };
            }
          })
        );

        // Enrichir les messages avec les infos utilisateur
        const enriched = messages.map(msg => {
          const userInfo = userCache[msg.createdBy] || {};
          const userName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || msg.createdBy;
          
          return {
            ...msg,
            userName,
            userFirstName: userInfo.firstName || '',
            userLastName: userInfo.lastName || '',
          };
        });

        setMessagesWithInfo(enriched);
        setError(null);
      } catch (err) {
        console.error('❌ Error enriching messages:', err);
        setError('Erreur lors du chargement des infos utilisateur');
        // Quand même retourner les messages sans les infos
        setMessagesWithInfo(messages.map(msg => ({
          ...msg,
          userName: msg.createdBy,
          userFirstName: '',
          userLastName: '',
        })));
      } finally {
        setLoading(false);
      }
    };

    enrichMessages();
  }, [messages]);

  return { messagesWithInfo, loading, error };
};
