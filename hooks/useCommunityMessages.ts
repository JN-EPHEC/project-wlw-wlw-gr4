import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface CommunityMessage {
  id: string;
  text: string;
  type: 'text' | 'image' | 'file';
  createdBy: string;
  createdAt: number;
  attachments?: Array<{
    url: string;
    type: string;
  }>;
}

interface UseCommunityMessagesResult {
  messages: CommunityMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  isSending: boolean;
}

/**
 * Hook to fetch and manage messages in a community channel
 * @param channelId - The channel ID to fetch messages for
 * @param limit - Maximum number of messages to fetch (default: 50)
 * @returns Object containing messages array, loading state, and sendMessage function
 */
export const useCommunityMessages = (
  channelId: string,
  userId: string,
  limit: number = 50
): UseCommunityMessagesResult => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 [useCommunityMessages] Setting up listener for channelId:', channelId);

      // Real-time listener for messages
      const messagesRef = collection(db, 'channels', channelId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('📡 [useCommunityMessages] Snapshot received with', snapshot.size, 'messages');
          const messagesData: CommunityMessage[] = [];

          snapshot.docs.slice(0, limit).forEach((doc) => {
            const data = doc.data();
            messagesData.push({
              id: doc.id,
              text: data.text || '',
              type: data.type || 'text',
              createdBy: data.createdBy || '',
              createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
              attachments: data.attachments || [],
            });
          });

          // Reverse to show oldest first
          setMessages(messagesData.reverse());
          setError(null);
        },
        (err) => {
          console.error('❌ [useCommunityMessages] Error listening to messages:', err);
          setError('Erreur lors du chargement des messages');
        }
      );

      setLoading(false);
      return () => unsubscribe();
    } catch (err) {
      console.error('❌ [useCommunityMessages] Error setting up listener:', err);
      setError('Erreur lors du chargement des messages');
      setLoading(false);
    }
  }, [channelId, limit]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !channelId || !userId) return;

    try {
      setIsSending(true);
      console.log('📤 [useCommunityMessages] Sending message to channel:', channelId);

      const messagesRef = collection(db, 'channels', channelId, 'messages');
      await addDoc(messagesRef, {
        text: text.trim(),
        type: 'text',
        createdBy: userId,
        createdAt: Timestamp.now(),
        attachments: [],
      });

      console.log('✅ [useCommunityMessages] Message sent successfully');
    } catch (err) {
      console.error('❌ [useCommunityMessages] Error sending message:', err);
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!channelId || !messageId) return;

    try {
      console.log('🗑️ [useCommunityMessages] Deleting message:', messageId);
      const messageRef = doc(db, 'channels', channelId, 'messages', messageId);
      await deleteDoc(messageRef);
      console.log('✅ [useCommunityMessages] Message deleted successfully');
    } catch (err) {
      console.error('❌ [useCommunityMessages] Error deleting message:', err);
      setError('Erreur lors de la suppression du message');
    }
  };

  return { messages, loading, error, sendMessage, deleteMessage, isSending };
};
