import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import ClubStack from './ClubStack';
import { navigationRef } from './navigationRef';
import TeacherStack from './TeacherStack';
import UserStack from './UserStack';
import AuthStack from './AuthStack';
import { useAuth } from '@/context/AuthContext';

export default function AppNavigator() {
  const { profile, user, initializing } = useAuth();

  const userRole = useMemo(() => {
    if (profile && typeof (profile as { role?: unknown }).role === 'string') {
      return (profile as { role?: string }).role;
    }
    return undefined;
  }, [profile]);

  const isClub = userRole === 'club';
  const isTeacher = userRole === 'educator';

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {!user ? <AuthStack /> : isClub ? <ClubStack /> : isTeacher ? <TeacherStack /> : <UserStack />}
    </NavigationContainer>
  );
}
