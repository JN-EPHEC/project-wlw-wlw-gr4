import React, { useMemo, useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useNotifications, useNotificationIcon, useFormattedTime } from '@/hooks/useNotifications';
import { Notification } from '@/types/Notification';

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
};

type Props = NativeStackScreenProps<RootStackParamList, 'notifications'>;

export default function NotificationsScreen({ navigation, route }: Props) {
  const { user, profile } = useAuth();
  const userId = (user as any)?.uid || '';
  const [clubIds, setClubIds] = useState<string[]>([]);
  
  // Charger les clubs auxquels l'utilisateur appartient
  useEffect(() => {
    if (!userId) return;
    
    const loadClubs = async () => {
      try {
        const clubs: string[] = [];
        
        // 1. Clubs où l'utilisateur est membre (memberships subcollection)
        const membershipsRef = collection(db, 'users', userId, 'memberships');
        const membershipSnap = await getDocs(membershipsRef);
        const memberClubs = membershipSnap.docs.map(doc => doc.id);
        console.log('🏢 Clubs (memberships):', memberClubs);
        clubs.push(...memberClubs);
        
        // 2. Club où l'utilisateur est owner (s'il y en a un)
        if (profile?.clubId) {
          console.log('👑 Club owner:', profile.clubId);
          clubs.push(profile.clubId);
        }
        
        // Remover les doublons
        const uniqueClubs = [...new Set(clubs)];
        setClubIds(uniqueClubs);
        console.log('📋 Total clubs (unique):', uniqueClubs);
      } catch (err) {
        console.error('Erreur chargement clubs:', err);
      }
    };
    
    loadClubs();
  }, [userId, profile?.clubId]);
  
  // DEBUG
  console.log('📱 Notifications Screen - userId:', userId, 'clubIds:', clubIds, 'ownerClubId:', profile?.clubId);
  
  // Récupérer les notifications personnelles ET de tous les clubs
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications(userId, clubIds);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const previousTarget = route.params?.previousTarget;
  
  console.log('📬 Notifications reçues:', notifications.length, notifications.map(n => ({ id: n.id, type: n.type, recipientId: n.recipientId })));

  // Affichage du chargement
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={() => (previousTarget ? navigation.navigate(previousTarget as any) : navigation.goBack())}
              style={styles.back}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mes notifications</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Affichage si pas de notifications
  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={() => (previousTarget ? navigation.navigate(previousTarget as any) : navigation.goBack())}
              style={styles.back}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mes notifications</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Ionicons name="notifications-off-outline" size={48} color={palette.gray} />
          <Text style={{ color: palette.gray, marginTop: 12, fontSize: 14, textAlign: 'center' }}>
            Aucune notification pour le moment
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={() => (previousTarget ? navigation.navigate(previousTarget as any) : navigation.goBack())}
              style={styles.back}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mes notifications</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.headerSub}>
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.back} onPress={markAllAsRead}>
                <Ionicons name="checkmark-done" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {notifications.map((notif) => (
          <NotificationCard
            key={`${notif.id}-${notif.createdAt}`}
            notification={notif}
            onPress={() => {
              markAsRead(notif.id, notif.recipientId);
              handleNavigate(navigation, notif);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Composant pour afficher une notification
 */
function NotificationCard({ 
  notification, 
  onPress 
}: { 
  notification: Notification; 
  onPress: () => void;
}) {
  const { icon, color, bg } = useNotificationIcon(notification.type);
  const formattedTime = useFormattedTime(notification.createdAt);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg }, notification.isRead && styles.readCard]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: notification.isRead ? '#E5E7EB' : '#fff' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.title}>{notification.title}</Text>
          {!notification.isRead ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.meta}>{formattedTime}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={palette.gray} />
    </TouchableOpacity>
  );
}

/**
 * Gère la navigation selon le type de notification
 */
function handleNavigate(navigation: any, notification: Notification) {
  const params = notification.actionParams || {};
  
  switch (notification.actionUrl) {
    case 'club-detail':
      navigation.navigate('clubDetail', { 
        clubId: notification.relatedId,
        ...params 
      });
      break;
    case 'event-detail':
      navigation.navigate('eventDetail', { 
        eventId: notification.relatedId,
        ...params 
      });
      break;
    case 'chat-room':
      navigation.navigate('chatRoom', { 
        chatRoomId: notification.relatedId,
        ...params 
      });
      break;
    case 'rating':
      navigation.navigate('rating', { 
        bookingId: notification.relatedId,
        previousTarget: 'account',
        ...params 
      });
      break;
    case 'club-community-management':
      navigation.navigate('clubCommunityManagement', { 
        clubId: notification.relatedId,
        ...params 
      });
      break;
    case 'club-reviews':
      navigation.navigate('reviews', { 
        clubId: notification.relatedId,
        ...params 
      });
      break;
    case 'club-announcements':
      navigation.navigate('clubAnnouncements', { 
        clubId: notification.relatedId,
        ...params 
      });
      break;
    case 'post-detail':
      navigation.navigate('postDetail', { 
        postId: notification.relatedId,
        ...params 
      });
      break;
    default:
      console.log('Route non gérée:', notification.actionUrl);
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  readCard: { opacity: 0.7 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: { color: palette.text, fontWeight: '700', fontSize: 15 },
  message: { color: palette.text, fontSize: 13, lineHeight: 18 },
  meta: { color: palette.gray, fontSize: 12 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F97316', flexShrink: 0 },
});
