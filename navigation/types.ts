export type UserRoute =
  | 'home'
  | 'clubs'
  | 'community'
  | 'mydog'
  | 'djanai'
  | 'clubDetail'
  | 'booking'
  | 'homeTrainingBooking'
  | 'reviews'
  | 'teacherDetail'
  | 'clubCommunity'
  | 'events'
  | 'chatRoom'
  | 'forum'
  | 'postDetail'
  | 'eventDetail'
  | 'eventBooking'
  | 'dogProgression'
  | 'dogTasks'
  | 'dogBadges'
  | 'account'
  | 'ratingInvitation'
  | 'rating'
  | 'notifications'
  | 'verified'
  | 'settings'
  | 'bookings'
  | 'addDog'
  | 'dogs'
  | 'followedClubs'
  | 'djanaiResults'
  | 'djanai-program';

export type ClubRoute =
  | 'clubHome'
  | 'clubProfile'
  | 'clubCommunity'
  | 'clubAnnouncements'
  | 'clubEventsManagement'
  | 'clubChannels'
  | 'clubChannelChat'
  | 'clubMembers'
  | 'clubAppointments'
  | 'clubHomeTrainingRequests'
  | 'clubPayments'
  | 'clubTeachers'
  | 'clubAddTeacher'
  | 'clubTeachersPricing'
  | 'clubTeachersPayment'
  | 'clubTeacherRequests'
  | 'clubLeaderboard'
  | 'clubDetail';

export type TeacherRoute =
  | 'teacher-home'
  | 'teacher-appointments'
  | 'teacher-community'
  | 'teacher-club-community'
  | 'teacher-channel-chat'
  | 'teacher-club-members'
  | 'teacher-account'
  | 'teacher-clubs'
  | 'teacher-training'
  | 'notifications'
  | 'teacherLeaderboard'
  | 'teacherDetail'
  | 'ratingInvitation'
  | 'rating'
  | 'clubDetail';

export type RootRouteName = UserRoute | ClubRoute | TeacherRoute;

export type UserStackParamList = {
  home: undefined;
  clubs: undefined;
  community: undefined;
  mydog: undefined;
  djanai: { previousPage?: UserRoute };
  clubDetail: { clubId: number };
  booking: { clubId: number };
  homeTrainingBooking: { clubId: number };
  reviews: { clubId?: number };
  teacherDetail: { teacherId: number; clubId?: number; previousTarget?: RootRouteName };
  clubCommunity: { clubId: number };
  events: { clubId: number };
  chatRoom: { clubId: number; channelId: string; channelName: string };
  forum: { clubId: number; channelId?: string; channelName?: string };
  postDetail: { postId: number };
  eventDetail: { eventId: number; clubId?: number };
  eventBooking: { eventId: number };
  dogProgression: { dogId: number };
  dogTasks: { dogId: number };
  dogBadges: { dogId: number };
  account: undefined;
  ratingInvitation: { bookingId: number; previousTarget?: RootRouteName };
  rating: { bookingId: number; previousTarget?: RootRouteName };
  notifications: { previousTarget?: RootRouteName } | undefined;
  verified: undefined;
  settings: undefined;
  bookings: undefined;
  addDog: undefined;
  editDog: { dogId: string };
  dogs: undefined;
  followedClubs: undefined;
  djanaiResults: { profile?: Record<string, unknown>; previousPage?: UserRoute };
  'djanai-program': undefined;
};

export type ClubStackParamList = {
  clubHome: undefined;
  clubProfile: undefined;
  clubCommunity: { clubId?: number };
  clubAnnouncements: undefined;
  clubEventsManagement: undefined;
  clubChannels: undefined;
  clubChannelChat: { channelId: string; channelName: string };
  clubMembers: undefined;
  clubAppointments: undefined;
  clubHomeTrainingRequests: undefined;
  clubPayments: undefined;
  clubTeachers: undefined;
  clubAddTeacher: undefined;
  clubTeachersPricing: { current?: number };
  clubTeachersPayment: { count: number; price: number };
  clubTeacherRequests: undefined;
  clubLeaderboard: undefined;
  clubDetail: { clubId: number };
};

export type TeacherStackParamList = {
  'teacher-home': undefined;
  'teacher-appointments': undefined;
  'teacher-community': { page?: TeacherRoute; clubId?: number | null } | undefined;
  'teacher-club-community': { clubId?: number | null; channelId?: string | null } | undefined;
  'teacher-channel-chat': { channelId: string; clubId: number | null };
  'teacher-club-members': { clubId: number | null };
  'teacher-account': undefined;
  'teacher-clubs': undefined;
  'teacher-training': undefined;
  notifications: { previousTarget?: RootRouteName } | undefined;
  teacherLeaderboard: { clubId?: number };
  teacherDetail: { teacherId: number; clubId?: number | null; previousTarget?: RootRouteName };
  ratingInvitation: { bookingId: number; previousTarget?: RootRouteName };
  rating: { bookingId: number; previousTarget?: RootRouteName };
  clubDetail: { clubId: number };
};

export type RootStackParamList = UserStackParamList & ClubStackParamList & TeacherStackParamList;
