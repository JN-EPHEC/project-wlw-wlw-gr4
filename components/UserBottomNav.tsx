import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

type UserTab = 'home' | 'clubs' | 'community' | 'mydog' | 'account';

type NavItem = {
  id: UserTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  current: UserTab;
};

const palette = {
  primary: '#41B6A6',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export default function UserBottomNav({ current }: Props) {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const navItems: NavItem[] = [
    { id: 'home', icon: 'home-outline', label: 'Accueil' },
    { id: 'clubs', icon: 'business-outline', label: 'Clubs' },
    { id: 'community', icon: 'chatbubbles-outline', label: 'Communaut\u00e9' },
    { id: 'mydog', icon: 'paw-outline', label: 'Mes chiens' },
    { id: 'account', icon: 'person-circle-outline', label: 'Compte' },
  ];

  const handlePress = (id: UserTab) => {
    if (id === current) return;
    const routes = navigation.getState()?.routeNames ?? [];
    if (!routes.includes(id)) return;
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
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? palette.primary : palette.gray}
              />
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
    backgroundColor: '#E0F2F1',
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
});
