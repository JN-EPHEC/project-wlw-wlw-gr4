import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TeacherStackParamList } from '@/navigation/types';
import { useAuth } from '@/context/AuthContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';

type TeacherTab =
  | 'teacher-home'
  | 'teacher-appointments'
  | 'teacher-community'
  | 'teacher-clubs'
  | 'teacher-account';

type NavItem = {
  id: TeacherTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  current: TeacherTab;
};

const palette = {
  primary: '#F28B6F',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function TeacherBottomNav({ current }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<TeacherStackParamList>>();
  const { user } = useAuth();
  const userId = (user as any)?.uid || '';
  const unreadCount = useUnreadNotificationCount(userId);

  const navItems: NavItem[] = [
    { id: 'teacher-home', icon: 'home-outline', label: 'Accueil' },
    { id: 'teacher-appointments', icon: 'calendar-outline', label: 'Planning' },
    { id: 'teacher-community', icon: 'chatbubbles-outline', label: 'Communaute' },
    { id: 'teacher-clubs', icon: 'people-outline', label: 'Clubs' },
    { id: 'teacher-account', icon: 'person-circle-outline', label: 'Compte' },
  ];

  const handlePress = (id: TeacherTab) => {
    if (id === current) return;
    navigation.navigate(id);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {navItems.map((item) => {
          const isActive = item.id === current;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item.id)}
              style={[styles.item, isActive && styles.itemActive]}
              activeOpacity={0.85}
            >
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? palette.primary : palette.gray}
                />
                {item.id === 'teacher-account' && unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingBottom: 6,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  itemActive: {
    backgroundColor: '#FDF5E6',
    borderRadius: 12,
  },
  label: {
    fontSize: 11,
    color: palette.gray,
  },
  labelActive: {
    color: palette.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#F97316',
    borderRadius: 10,
    minWidth: 18,
    minHeight: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.surface,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
});
