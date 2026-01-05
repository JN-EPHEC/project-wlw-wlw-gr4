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
      console.log('⚠️ [useMessagesWithUserInfo] No messages provided');
      setMessagesWithInfo([]);
      setLoading(false);
      return;
    }

    console.log('📨 [useMessagesWithUserInfo] Processing', messages.length, 'messages');

    const enrichMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les IDs utilisateurs uniques et valides
        const userIds = [...new Set(messages.map(msg => msg.createdBy).filter(id => id && id.trim()))];
        
        console.log('👥 [useMessagesWithUserInfo] Found userIds:', userIds);
        
        if (userIds.length === 0) {
          console.log('⚠️ [useMessagesWithUserInfo] No valid user IDs found');
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
                
                // Essayer de récupérer firstName et lastName depuis plusieurs chemins possibles
                let firstName = '';
                let lastName = '';
                
                // Chemin 1: userData.profile.firstName et userData.profile.lastName
                if (userData.profile?.firstName) {
                  firstName = userData.profile.firstName;
                }
                if (userData.profile?.lastName) {
                  lastName = userData.profile.lastName;
                }
                
                // Chemin 2: userData.firstName et userData.lastName (root level)
                if (!firstName && userData.firstName) {
                  firstName = userData.firstName;
                }
                if (!lastName && userData.lastName) {
                  lastName = userData.lastName;
                }
                
                // Chemin 3: displayName ou name
                if (!firstName && !lastName) {
                  const displayName = userData.displayName || userData.profile?.name || userData.name;
                  if (displayName) {
                    const parts = displayName.split(' ');
                    firstName = parts[0] || '';
                    lastName = parts.slice(1).join(' ') || '';
                  }
                }
                
                userCache[userId] = { firstName, lastName };
                console.log(`✅ [useMessagesWithUserInfo] User ${userId} loaded:`, { firstName, lastName });
              } else {
                userCache[userId] = { firstName: '', lastName: '' };
                console.warn(`⚠️ [useMessagesWithUserInfo] User ${userId} not found in Firestore`);
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
          const firstName = userInfo.firstName?.trim() || '';
          const lastName = userInfo.lastName?.trim() || '';
          
          // Construire le nom complet
          let userName = '';
          if (firstName && lastName) {
            userName = `${firstName} ${lastName}`;
          } else if (firstName) {
            userName = firstName;
          } else if (lastName) {
            userName = lastName;
          } else {
            userName = 'Utilisateur'; // Fallback si aucune info disponible
          }
          
          console.log(`📝 [useMessagesWithUserInfo] Message from ${msg.createdBy} => ${userName}`);
          
          return {
            ...msg,
            userName,
            userFirstName: firstName,
            userLastName: lastName,
          };
        });

        console.log('✅ [useMessagesWithUserInfo] All messages enriched, count:', enriched.length);
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
