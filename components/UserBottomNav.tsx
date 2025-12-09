import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserStackParamList } from '@/navigation/types';

type UserTab = 'home' | 'clubs' | 'community' | 'mydog' | 'account';

type NavItem = {
  id: UserTab;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

type Props = {
  current: UserTab;
};

const palette = {
  active: '#27b3a3',
  inactive: '#6f7589',
  background: '#ffffff',
  divider: '#e4e8f0',
};

export default function UserBottomNav({ current }: Props) {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const navItems: NavItem[] = [
    { id: 'home', icon: 'home-outline', label: 'Accueil' },
    { id: 'clubs', icon: 'account-group-outline', label: 'Clubs' },
    { id: 'community', icon: 'message-text-outline', label: 'Communaut\u00e9' },
    { id: 'mydog', icon: 'dog', label: 'Mes chiens' },
    { id: 'account', icon: 'account-circle-outline', label: 'Compte' },
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
          const color = isActive ? palette.active : palette.inactive;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item.id)}
              style={styles.item}
              activeOpacity={0.85}>
              <MaterialCommunityIcons name={item.icon} size={28} color={color} />
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
    backgroundColor: palette.background,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
    paddingBottom: 8,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: palette.background,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: palette.inactive,
    fontWeight: '500',
  },
  labelActive: {
    color: palette.active,
    fontWeight: '700',
  },
});
