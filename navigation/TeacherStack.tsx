import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClubDetailScreen from '@/app/club-detail';
import NotificationsScreen from '@/app/notifications';
import RatingInvitationScreen from '@/app/rating-invitation';
import RatingScreen from '@/app/rating';
import TeacherDetailScreen from '@/app/teacher-detail';
import TeacherAccountPage from '@/components/TeacherAccountPage';
import TeacherAppointmentsPage from '@/components/TeacherAppointmentsPage';
import TeacherChannelChatPage from '@/components/TeacherChannelChatPage';
import TeacherClubCommunityPage from '@/components/TeacherClubCommunityPage';
import TeacherClubMembersPage from '@/components/TeacherClubMembersPage';
import TeacherClubsPage from '@/components/TeacherClubsPage';
import TeacherCommunitySelectionPage from '@/components/TeacherCommunitySelectionPage';
import TeacherHomePage from '@/components/TeacherHomePage';
import TeacherLeaderboardPage from '@/components/TeacherLeaderboardPage';
import TeacherTrainingPage from '@/components/TeacherTrainingPage';
import { TeacherStackParamList } from './types';

const Stack = createNativeStackNavigator<TeacherStackParamList>();

export default function TeacherStack() {
  return (
    <Stack.Navigator initialRouteName="teacher-home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="teacher-home" component={TeacherHomePage} />
      <Stack.Screen name="teacher-appointments" component={TeacherAppointmentsPage} />
      <Stack.Screen name="teacher-community" component={TeacherCommunitySelectionPage} />
      <Stack.Screen name="teacher-club-community" component={TeacherClubCommunityPage} />
      <Stack.Screen name="teacher-channel-chat" component={TeacherChannelChatPage} />
      <Stack.Screen name="teacher-club-members" component={TeacherClubMembersPage} />
      <Stack.Screen name="teacher-account" component={TeacherAccountPage} />
      <Stack.Screen name="teacher-clubs" component={TeacherClubsPage} />
      <Stack.Screen name="teacher-training" component={TeacherTrainingPage} />
      <Stack.Screen name="notifications" component={NotificationsScreen} />
      <Stack.Screen name="teacherLeaderboard" component={TeacherLeaderboardPage} />
      <Stack.Screen name="teacherDetail" component={TeacherDetailScreen} />
      <Stack.Screen name="ratingInvitation" component={RatingInvitationScreen} />
      <Stack.Screen name="rating" component={RatingScreen} />
      <Stack.Screen name="clubDetail" component={ClubDetailScreen} />
    </Stack.Navigator>
  );
}
