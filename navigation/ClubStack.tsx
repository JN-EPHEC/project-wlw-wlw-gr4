import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClubAddTeacherScreen from '@/app/club-add-teacher';
import ClubAnnouncementsScreen from '@/app/club-announcements';
import ClubAppointmentsScreen from '@/app/club-appointments';
import ClubChannelChatScreen from '@/app/club-channel-chat';
import ClubChannelsScreen from '@/app/club-channels';
import ClubCommunityManagementScreen from '@/app/club-community-management';
import ClubDetailScreen from '@/app/club-detail';
import ClubEventsManagementScreen from '@/app/club-events-management';
import ClubHomeTrainingRequestsScreen from '@/app/club-home-training-requests';
import ClubHomeScreen from '@/app/club-home';
import ClubLeaderboardScreen from '@/app/club-leaderboard';
import ClubMembersScreen from '@/app/club-members';
import ClubPaymentsScreen from '@/app/club-payments';
import ClubProfileScreen from '@/app/club-profile';
import ClubTeacherRequestsScreen from '@/app/club-teacher-requests';
import ClubTeachersPaymentScreen from '@/app/club-teachers-payment';
import ClubTeachersPricingScreen from '@/app/club-teachers-pricing';
import ClubTeachersScreen from '@/app/club-teachers';
import EditClubProfileScreen from '@/screens/club/EditClubProfileScreen';
import { ClubStackParamList } from './types';

const Stack = createNativeStackNavigator<ClubStackParamList>();

export default function ClubStack() {
  return (
    <Stack.Navigator initialRouteName="clubHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="clubHome" component={ClubHomeScreen} />
      <Stack.Screen name="clubProfile" component={ClubProfileScreen} />
      <Stack.Screen name="editClubProfile" component={EditClubProfileScreen} />
      <Stack.Screen name="clubCommunity" component={ClubCommunityManagementScreen} />
      <Stack.Screen name="clubAnnouncements" component={ClubAnnouncementsScreen} />
      <Stack.Screen name="clubEventsManagement" component={ClubEventsManagementScreen} />
      <Stack.Screen name="clubChannels" component={ClubChannelsScreen} />
      <Stack.Screen name="clubChannelChat" component={ClubChannelChatScreen} />
      <Stack.Screen name="clubMembers" component={ClubMembersScreen} />
      <Stack.Screen name="clubAppointments" component={ClubAppointmentsScreen} />
      <Stack.Screen name="clubHomeTrainingRequests" component={ClubHomeTrainingRequestsScreen} />
      <Stack.Screen name="clubPayments" component={ClubPaymentsScreen} />
      <Stack.Screen name="clubTeachers" component={ClubTeachersScreen} />
      <Stack.Screen name="clubAddTeacher" component={ClubAddTeacherScreen} />
      <Stack.Screen name="clubTeachersPricing" component={ClubTeachersPricingScreen} />
      <Stack.Screen name="clubTeachersPayment" component={ClubTeachersPaymentScreen} />
      <Stack.Screen name="clubTeacherRequests" component={ClubTeacherRequestsScreen} />
      <Stack.Screen name="clubLeaderboard" component={ClubLeaderboardScreen} />
      <Stack.Screen name="clubDetail" component={ClubDetailScreen} />
    </Stack.Navigator>
  );
}
