import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useNotifications, useNotificationIcon, useFormattedTime } from '@/hooks/useNotifications';
import { Notification } from '@/types/Notification';

const colors = {
    primary: '#27b3a3',
    text: '#233042',
    textMuted: '#6a7286',
    surface: '#ffffff',
    background: '#F0F2F5',
};

type Props = NativeStackScreenProps<RootStackParamList, 'notifications'>;

export default function NotificationsScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications(user?.uid || '');
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  const previousTarget = route.params?.previousTarget;

  const handleGoBack = () => previousTarget ? (navigation as any).navigate(previousTarget) : navigation.goBack();

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
        </View>

      <ScrollView contentContainerStyle={styles.container}>
        {unreadCount > 0 && <TouchableOpacity onPress={markAllAsRead}><Text style={styles.markAllRead}>Tout marquer comme lu</Text></TouchableOpacity>}
        
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucune notification</Text>
          </View>
        ) : (
          notifications.map((notif) => <NotificationCard key={notif.id} notification={notif} onMarkRead={() => markAsRead(notif.id)} navigation={navigation} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({ notification, onMarkRead, navigation }: { notification: Notification; onMarkRead: () => void; navigation: any; }) {
  const { icon, color } = useNotificationIcon(notification.type);
  const formattedTime = useFormattedTime(notification.createdAt);

  const handlePress = () => {
    onMarkRead();
    // Your navigation logic here
  };

  return (
    <TouchableOpacity style={[styles.card, !notification.isRead && styles.unreadCard]} onPress={handlePress}>
      <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}><Ionicons name={icon as any} size={24} color={color} /></View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{notification.title}</Text>
        <Text style={styles.cardMessage} numberOfLines={2}>{notification.message}</Text>
        <Text style={styles.cardTime}>{formattedTime}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, gap: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: colors.primary, padding: 16, paddingTop: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  markAllRead: { textAlign: 'right', color: colors.primary, fontWeight: '600', marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 1 },
  unreadCard: { borderWidth: 2, borderColor: colors.primary },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  cardMessage: { fontSize: 14, color: colors.textMuted, marginVertical: 2 },
  cardTime: { fontSize: 12, color: colors.primary, fontWeight: '500', marginTop: 4 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  emptyState: { paddingVertical: 80, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
});