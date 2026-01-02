import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountScreen from '@/app/(tabs)/account';
import ClubsScreen from '@/app/(tabs)/clubs';
import CommunityScreen from '@/app/(tabs)/community';
import DogsScreen from '@/app/(tabs)/dogs';
import HomeScreen from '@/app/(tabs)/home';
import BookingScreen from '@/app/booking';
import ChatRoomScreen from '@/app/chat-room';
import ClubCommunityScreen from '@/app/club-community';
import ClubDetailScreen from '@/app/club-detail';
import EducatorDetailScreen from '@/app/educator-detail';
import EventBookingScreen from '@/app/event-booking';
import EventDetailScreen from '@/app/event-detail';
import EventsListScreen from '@/app/events-list';
import ForumScreen from '@/app/forum';
import HomeTrainingBookingScreen from '@/app/home-training-booking';
import NotificationsScreen from '@/app/notifications';
import PostDetailScreen from '@/app/post-detail';
import RatingInvitationScreen from '@/app/rating-invitation';
import RatingInvitationsListScreen from '@/app/rating-invitations-list';
import RatingScreen from '@/app/rating';
import ReviewsScreen from '@/app/reviews';
import TeacherDetailScreen from '@/app/teacher-detail';
import AccountDogsScreen from '@/screens/user/AccountDogsScreen';
import BookingsScreen from '@/screens/user/BookingsScreen';
import DjanaiProgramScreen from '@/screens/user/DjanaiProgramScreen';
import DjanaiResultsScreen from '@/screens/user/DjanaiResultsScreen';
import DjanaiLoadingScreen from '@/screens/user/DjanaiLoadingScreen';
import DjanaiScreen from '@/screens/user/DjanaiScreen';
import DogBadgesScreen from '@/screens/user/DogBadgesScreen';
import DogProgressionScreen from '@/screens/user/DogProgressionScreen';
import DogTasksScreen from '@/screens/user/DogTasksScreen';
import FollowedClubsScreen from '@/screens/user/FollowedClubsScreen';
import SettingsScreen from '@/screens/user/SettingsScreen';
import VerifiedScreen from '@/screens/user/VerifiedScreen';
import EditProfileScreen from '@/screens/user/EditProfileScreen';
import { UserStackParamList } from '@/navigation/types';
import AddDogScreen from '@/app/add-dog';
import EditDogScreen from '@/app/edit-dog';
import DogDetailPage from '@/app/DogDetailPage';
import PromoDetailScreen from '@/app/promo-detail';

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  return (
    <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="clubs" component={ClubsScreen} />
      <Stack.Screen name="community" component={CommunityScreen} />
      <Stack.Screen name="mydog" component={DogsScreen} />
      <Stack.Screen name="djanai" component={DjanaiScreen} />
      <Stack.Screen name="clubDetail" component={ClubDetailScreen} />
      <Stack.Screen name="educatorDetail" component={EducatorDetailScreen} />
      <Stack.Screen name="booking" component={BookingScreen} />
      <Stack.Screen name="homeTrainingBooking" component={HomeTrainingBookingScreen} />
      <Stack.Screen name="reviews" component={ReviewsScreen} />
      <Stack.Screen name="teacherDetail" component={TeacherDetailScreen} />
      <Stack.Screen name="clubCommunity" component={ClubCommunityScreen} />
      <Stack.Screen name="events" component={EventsListScreen} />
      <Stack.Screen name="chatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="forum" component={ForumScreen} />
      <Stack.Screen name="postDetail" component={PostDetailScreen} />
      <Stack.Screen name="eventDetail" component={EventDetailScreen} />
      <Stack.Screen name="eventBooking" component={EventBookingScreen} />
      <Stack.Screen name="dogProgression" component={DogProgressionScreen} />
      <Stack.Screen name="dogTasks" component={DogTasksScreen} />
      <Stack.Screen name="dogBadges" component={DogBadgesScreen} />
      <Stack.Screen name="addDog" component={AddDogScreen} />
      <Stack.Screen name="dogDetail" component={DogDetailPage} />
      <Stack.Screen name="promoDetail" component={PromoDetailScreen} />
      <Stack.Screen name="editDog" component={EditDogScreen} />
      <Stack.Screen name="account" component={AccountScreen} />
      <Stack.Screen name="ratingInvitation" component={RatingInvitationScreen} />
      <Stack.Screen name="ratingsInvitationsList" component={RatingInvitationsListScreen} />
      <Stack.Screen name="rating" component={RatingScreen} />
      <Stack.Screen name="notifications" component={NotificationsScreen} />
      <Stack.Screen name="verified" component={VerifiedScreen} />
      <Stack.Screen name="settings" component={SettingsScreen} />
      <Stack.Screen name="bookings" component={BookingsScreen} />
      <Stack.Screen name="dogs" component={AccountDogsScreen} />
      <Stack.Screen name="followedClubs" component={FollowedClubsScreen} />
      <Stack.Screen name="djanaiResults" component={DjanaiResultsScreen} />
      <Stack.Screen name="DjanaiLoadingScreen" component={DjanaiLoadingScreen} />
      <Stack.Screen name="djanai-program" component={DjanaiProgramScreen} />
      <Stack.Screen name="editProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
