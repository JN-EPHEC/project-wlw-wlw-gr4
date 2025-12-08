import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '@/app/(auth)/login';
import PasswordResetScreen from '@/app/(auth)/password-reset';
import SignupChoiceScreen from '@/app/(auth)/signup-choice';
import SignupClubScreen from '@/app/(auth)/signup-club';
import SignupTeacherScreen from '@/app/(auth)/signup-teacher';
import SignupUserScreen from '@/app/(auth)/signup-user';
import VerifiedScreen from '@/app/(auth)/verified';

export type AuthStackParamList = {
  login: undefined;
  signupChoice: undefined;
  signupUser: undefined;
  signupClub: undefined;
  signupTeacher: undefined;
  verified: { email?: string } | undefined;
  'password-reset': undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signupChoice" component={SignupChoiceScreen} />
      <Stack.Screen name="signupUser" component={SignupUserScreen} />
      <Stack.Screen name="signupClub" component={SignupClubScreen} />
      <Stack.Screen name="signupTeacher" component={SignupTeacherScreen} />
      <Stack.Screen name="verified" component={VerifiedScreen} />
      <Stack.Screen name="password-reset" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
}
