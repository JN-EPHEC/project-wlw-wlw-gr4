import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={28} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const inactiveColor = colorScheme === 'dark' ? '#c7ccd6' : '#6f7589';
  const tabBarStyle =
    colorScheme === 'dark'
      ? { backgroundColor: '#0c1324', borderTopColor: '#1f2738', borderTopWidth: 1 }
      : { backgroundColor: '#fff', borderTopColor: '#e4e8f0', borderTopWidth: 1 };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#27b3a3',
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clubs"
        options={{
          title: 'Clubs',
          tabBarIcon: ({ color }) => <TabBarIcon name="account-group-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Communaut\u00e9',
          tabBarIcon: ({ color }) => <TabBarIcon name="message-text-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dogs"
        options={{
          title: 'Mes chiens',
          tabBarIcon: ({ color }) => <TabBarIcon name="dog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <TabBarIcon name="account-circle-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
