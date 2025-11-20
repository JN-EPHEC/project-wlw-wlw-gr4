import { SignedInAccount } from 'hooks/auth';
import { useState } from 'react';
import { AccountPage } from './app/AccountPage';
import { BadgesCollectionPage } from './app/BadgesCollectionPage';
import { BookingPage } from './app/BookingPage';
import { BottomNav } from './app/BottomNav';
import { ChatRoomPage } from './app/ChatRoomPage';
import { ClubAddTeacherPage } from './app/ClubAddTeacherPage';
import { ClubAnnouncementsPage } from './app/ClubAnnouncementsPage';
import { ClubAppointmentsPage } from './app/ClubAppointmentsPage';
import { ClubBottomNav } from './app/ClubBottomNav';
import { ClubChannelChatPage } from './app/ClubChannelChatPage';
import { ClubChannelsPage } from './app/ClubChannelsPage';
import { ClubCommunityManagementPage } from './app/ClubCommunityManagementPage';
import { ClubCommunityPage } from './app/ClubCommunityPage';
import { ClubDetailPage } from './app/ClubDetailPage';
import { ClubEventsManagementPage } from './app/ClubEventsManagementPage';
import { ClubHomePage } from './app/ClubHomePage';
import { ClubHomeTrainingRequestsPage } from './app/ClubHomeTrainingRequestsPage';
import { ClubLeaderboardPage } from './app/ClubLeaderboardPage';
import { ClubMembersPage } from './app/ClubMembersPage';
import { ClubPaymentsPage } from './app/ClubPaymentsPage';
import { ClubProfilePage } from './app/ClubProfilePage';
import { ClubsPage } from './app/ClubsPage';
import { ClubTeacherRequestsPage } from './app/ClubTeacherRequestsPage';
import { ClubTeachersPage } from './app/ClubTeachersPage';
import { ClubTeachersPaymentPage } from './app/ClubTeachersPaymentPage';
import { ClubTeachersPricingPage } from './app/ClubTeachersPricingPage';
import { ComingSoonPage } from './app/ComingSoonPage';
import { CommunityPage } from './app/CommunityPage';
import { DjanAIOnboardingPage, DogProfile } from './app/DjanAIOnboardingPage';
import { DjanAIResultsPage } from './app/DjanAIResultsPage';
import { DogProgressionPage } from './app/DogProgressionPage';
import { DogTasksPage } from './app/DogTasksPage';
import { EventBookingPage } from './app/EventBookingPage';
import { EventDetailPage } from './app/EventDetailPage';
import { EventsListPage } from './app/EventsListPage';
import { ForumPage } from './app/ForumPage';
import { GuidelinesPage } from './app/GuidelinesPage';
import { HomePage } from './app/HomePage';
import { HomeTrainingBookingPage } from './app/HomeTrainingBookingPage';
import { LoginPage } from './app/LoginPage';
import { MyDogsPage } from './app/MyDogsPage';
import { NotificationsPage } from './app/NotificationsPage';
import { PostDetailPage } from './app/PostDetailPage';
import { RatingInvitationPage } from './app/RatingInvitationPage';
import { RatingPage } from './app/RatingPage';
import { ReviewsPage } from './app/ReviewsPage';
import { SignupChoicePage } from './app/SignupChoicePage';
import { SignupClubPage } from './app/SignupClubPage';
import { SignupTeacherPage } from './app/SignupTeacherPage';
import { SignupUserPage } from './app/SignupUserPage';
import { TeacherAccountPage } from './app/TeacherAccountPage';
import { TeacherAppointmentsPage } from './app/TeacherAppointmentsPage';
import { TeacherBottomNav } from './app/TeacherBottomNav';
import { TeacherChannelChatPage } from './app/TeacherChannelChatPage';
import { TeacherClubCommunityPage } from './app/TeacherClubCommunityPage';
import { TeacherClubMembersPage } from './app/TeacherClubMembersPage';
import { TeacherClubsPage } from './app/TeacherClubsPage';
import { TeacherCommunitySelectionPage } from './app/TeacherCommunitySelectionPage';
import { TeacherDetailPage } from './app/TeacherDetailPage';
import { TeacherHomePage } from './app/TeacherHomePage';
import { TeacherLeaderboardPage } from './app/TeacherLeaderboardPage';
import { TeacherTrainingPage } from './app/TeacherTrainingPage';
import { VerifiedPage } from './app/VerifiedPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'user' | 'club' | 'teacher' | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'signupChoice' | 'signupUser' | 'signupClub' | 'signupTeacher'>('login');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [selectedChannelName, setSelectedChannelName] = useState<string>('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [ratingReturnTarget, setRatingReturnTarget] = useState<string | null>(null);
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);
  const [previousPage, setPreviousPage] = useState<string>('home');
  const [teachersPricingData, setTeachersPricingData] = useState<{ count: number; price: number } | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (page !== 'clubDetail' && page !== 'teacherDetail' && page !== 'booking' && page !== 'clubCommunity' && page !== 'chatRoom' && page !== 'forum' && page !== 'postDetail' && page !== 'eventDetail' && page !== 'eventBooking' && page !== 'ratingInvitation' && page !== 'rating' && page !== 'reviews' && page !== 'notifications' && page !== 'bookings' && page !== 'dogs' && page !== 'followedClubs' && page !== 'settings' && page !== 'djanai' && page !== 'djanaiResults' && page !== 'djanai-program' && page !== 'mydog' && page !== 'dogProgression' && page !== 'dogTasks' && page !== 'dogBadges' && page !== 'teacherLeaderboard' && page !== 'clubLeaderboard') {
      setSelectedClubId(null);
      setSelectedChannelId('');
      setSelectedChannelName('');
      setSelectedPostId(null);
      setSelectedEventId(null);
      setSelectedBookingId(null);
      setDogProfile(null);
      setSelectedTeacherId(null);
      setSelectedDogId(null);
    }
  };

  const handleClubClick = (clubId: number) => {
    // Check if it's an event ID (>= 200) or a club ID
    if (clubId >= 200 && clubId < 300) {
      setSelectedEventId(clubId);
      setCurrentPage('eventDetail');
    } else {
      setSelectedClubId(clubId);
      setCurrentPage('clubDetail');
    }
  };

  const handleCommunityClubClick = (clubId: number) => {
    setSelectedClubId(clubId);
    setCurrentPage('clubCommunity');
  };

  const handleBookAppointment = (clubId: number) => {
    setSelectedClubId(clubId);
    setCurrentPage('booking');
  };

  const handleHomeTrainingRequest = (clubId: number) => {
    setSelectedClubId(clubId);
    setCurrentPage('homeTrainingBooking');
  };

  const handleRegisterEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setCurrentPage('eventBooking');
  };

  const handleChannelClick = (clubId: number, channelId: string, channelName: string) => {
    setSelectedClubId(clubId);
    setSelectedChannelId(channelId);
    setSelectedChannelName(channelName);
    
    // Check if it's the forum channel (tips-tricks)
    if (channelId === 'tips-tricks') {
      setCurrentPage('forum');
    } else {
      setCurrentPage('chatRoom');
    }
  };

  const handleEventsClick = (clubId: number) => {
    setSelectedClubId(clubId);
    setCurrentPage('events');
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setCurrentPage('postDetail');
  };

  const handleStartRating = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCurrentPage('rating');
  };

  const handleShowReviews = (clubId?: number) => {
    if (clubId) setSelectedClubId(clubId);
    setCurrentPage('reviews');
  };

  const handleViewTeacher = (teacherId: number, clubId: number) => {
    setSelectedTeacherId(teacherId);
    setSelectedClubId(clubId);
    setCurrentPage('teacherDetail');
  };

  const handleLogin = (session: SignedInAccount) => {
    setIsAuthenticated(true);
    setUserType(session.role);
    setAuthAccount(session);
    // Set initial page based on user type
    if (session.role === 'club') {
      setCurrentPage('clubHome');
    } else if (session.role === 'teacher') {
      setCurrentPage('teacher-home');
    } else {
      setCurrentPage('home');
    }
  };

  const handleSignup = () => {
    // After successful signup, redirect to login
    setAuthPage('login');
  };

  // If not authenticated, show auth pages
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative w-full max-w-[393px] h-screen bg-white mx-auto shadow-lg">
          {authPage === 'login' && (
            <LoginPage
              onLogin={handleLogin}
              onNavigateToSignup={() => setAuthPage('signupChoice')}
            />
          )}
          {authPage === 'signupChoice' && (
            <SignupChoicePage
              onSelectType={(type) => {
                if (type === 'user') {
                  setAuthPage('signupUser');
                } else if (type === 'teacher') {
                  setAuthPage('signupTeacher');
                } else {
                  setAuthPage('signupClub');
                }
              }}
              onBack={() => setAuthPage('login')}
            />
          )}
          {authPage === 'signupUser' && (
            <SignupUserPage
              onSignup={handleSignup}
              onBack={() => setAuthPage('signupChoice')}
            />
          )}
          {authPage === 'signupClub' && (
            <SignupClubPage
              onSignup={handleSignup}
              onBack={() => setAuthPage('signupChoice')}
            />
          )}
          {authPage === 'signupTeacher' && (
            <SignupTeacherPage
              onSignup={handleSignup}
              onBack={() => setAuthPage('signupChoice')}
            />
          )}
        </div>
      </div>
    );
  }

  const handleClubChannelClick = (channelId: string, channelName: string) => {
    setSelectedChannelId(channelId);
    setSelectedChannelName(channelName);
    setCurrentPage('clubChannelChat');
  };

  const renderPage = () => {
    // Club interface pages
    if (userType === 'club') {
      switch (currentPage) {
        case 'clubHome':
          return <ClubHomePage onNavigate={handleNavigate} />;
        case 'clubProfile':
          return <ClubProfilePage 
            onNavigate={handleNavigate}
            onLogout={() => {
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentPage('home');
            }}
            onDeleteClub={() => {
              // Simuler la suppression du club
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentPage('home');
            }}
          />;
        case 'clubCommunity':
          return <ClubCommunityManagementPage onNavigate={handleNavigate} />;
        case 'clubAnnouncements':
          return <ClubAnnouncementsPage onBack={() => handleNavigate('clubCommunity')} />;
        case 'clubEventsManagement':
          return <ClubEventsManagementPage onBack={() => handleNavigate('clubCommunity')} />;
        case 'clubChannels':
          return <ClubChannelsPage onBack={() => handleNavigate('clubCommunity')} onChannelClick={handleClubChannelClick} />;
        case 'clubChannelChat':
          return selectedChannelId ? (
            <ClubChannelChatPage
              channelId={selectedChannelId}
              channelName={selectedChannelName}
              onBack={() => handleNavigate('clubChannels')}
            />
          ) : null;
        case 'clubMembers':
          return <ClubMembersPage onBack={() => handleNavigate('clubCommunity')} />;
        case 'clubAppointments':
          return <ClubAppointmentsPage onNavigate={handleNavigate} />;
        case 'clubHomeTrainingRequests':
          return <ClubHomeTrainingRequestsPage onBack={() => handleNavigate('clubAppointments')} />;
        case 'clubPayments':
          return <ClubPaymentsPage />;
        case 'clubTeachers':
          return <ClubTeachersPage 
            onBack={() => handleNavigate('clubProfile')} 
            onNavigateToPricing={() => handleNavigate('clubTeachersPricing')}
            onNavigateToAddTeacher={() => handleNavigate('clubAddTeacher')}
            onNavigateToRequests={() => handleNavigate('clubTeacherRequests')}
          />;
        case 'clubAddTeacher':
          return <ClubAddTeacherPage
            onBack={() => handleNavigate('clubTeachers')}
            onTeacherAdded={() => {
              // Ici on pourrait passer le professeur ajouté à la page principale
              // Pour l'instant on retourne juste à la liste
              handleNavigate('clubTeachers');
            }}
          />;
        case 'clubTeachersPricing':
          return <ClubTeachersPricingPage 
            onBack={() => handleNavigate('clubTeachers')}
            onContinue={(count, price) => {
              setTeachersPricingData({ count, price });
              handleNavigate('clubTeachersPayment');
            }}
            currentTeachersCount={2}
          />;
        case 'clubTeachersPayment':
          return teachersPricingData ? (
            <ClubTeachersPaymentPage
              onBack={() => handleNavigate('clubTeachersPricing')}
              onSuccess={() => {
                setTeachersPricingData(null);
                handleNavigate('clubTeachers');
              }}
              teachersCount={teachersPricingData.count}
              totalPrice={teachersPricingData.price}
            />
          ) : null;
        case 'clubTeacherRequests':
          return <ClubTeacherRequestsPage onBack={() => handleNavigate('clubTeachers')} />;
        case 'clubLeaderboard':
          return (
            <ClubLeaderboardPage
              onBack={() => handleNavigate('clubProfile')}
              onViewClub={(clubId) => {
                setSelectedClubId(clubId);
                handleNavigate('clubDetail');
              }}
            />
          );
        default:
          return <ClubHomePage onNavigate={handleNavigate} />;
      }
    }

    // Teacher interface pages
    if (userType === 'teacher') {
      switch (currentPage) {
        case 'teacher-home':
          return <TeacherHomePage onNavigate={handleNavigate} />;
        case 'teacher-appointments':
          return <TeacherAppointmentsPage />;
        case 'teacher-community':
          return <TeacherCommunitySelectionPage onNavigate={(page, clubId) => {
            setSelectedClubId(clubId || null);
            handleNavigate(page);
          }} />;
        case 'teacher-club-community':
          return <TeacherClubCommunityPage 
            clubId={selectedClubId || undefined}
            onBack={() => handleNavigate('teacher-community')}
            onNavigate={(page, data) => {
              if (data?.clubId) setSelectedClubId(data.clubId);
              if (data?.channelId) setSelectedChannelId(data.channelId);
              handleNavigate(page);
            }}
          />;
        case 'teacher-channel-chat':
          return <TeacherChannelChatPage 
            channelId={selectedChannelId ? Number(selectedChannelId) : undefined}
            clubId={selectedClubId || undefined}
            onBack={() => handleNavigate('teacher-club-community')}
            onNavigate={handleNavigate}
          />;
        case 'teacher-club-members':
          return <TeacherClubMembersPage 
            clubId={selectedClubId || undefined}
            onBack={() => handleNavigate('teacher-club-community')}
          />;
        case 'teacher-account':
          return <TeacherAccountPage 
            onNavigate={handleNavigate}
            onLogout={() => {
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentPage('home');
            }}
            onDeleteAccount={() => {
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentPage('home');
            }}
          />;
        case 'teacher-clubs':
          return <TeacherClubsPage onNavigate={handleNavigate} onBack={() => handleNavigate('teacher-home')} />;
        case 'teacher-training':
          return <TeacherTrainingPage onNavigate={handleNavigate} onBack={() => handleNavigate('teacher-clubs')} />;
        case 'notifications':
          return <NotificationsPage onBack={() => handleNavigate('teacher-home')} />;
        case 'teacherLeaderboard':
          return (
            <TeacherLeaderboardPage
              onBack={() => handleNavigate('teacher-account')}
              onViewTeacher={(teacherId) => {
                setSelectedTeacherId(teacherId);
                setSelectedClubId(1); // Default club for now
                handleNavigate('teacherDetail');
              }}
            />
          );
        default:
          return <TeacherHomePage onNavigate={handleNavigate} />;
      }
    }

    // User interface pages
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'clubs':
        return <ClubsPage onClubClick={handleClubClick} onNavigate={handleNavigate} />;
      case 'community':
        return <CommunityPage onClubClick={handleCommunityClubClick} />;
      case 'mydog':
        return <MyDogsPage onNavigate={(page) => {
          if (page === 'dogProgression') {
            const dogId = (window as any).selectedDogId || 1;
            setSelectedDogId(dogId);
            handleNavigate(page);
          } else {
            handleNavigate(page);
          }
        }} />;
      case 'account':
        return (
          <AccountPage 
            onNavigate={handleNavigate}
            onShowRatingInvitation={(bookingId) => {
              setSelectedBookingId(bookingId);
              setCurrentPage('ratingInvitation');
            }}
            onLogout={() => {
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentPage('home');
            }}
          />
        );
      case 'verified':
        return <VerifiedPage onBack={() => handleNavigate('account')} />;
      case 'clubDetail':
        return selectedClubId ? (
          <ClubDetailPage 
            clubId={selectedClubId} 
            onBack={() => handleNavigate('clubs')} 
            onBookAppointment={handleBookAppointment}
            onHomeTrainingRequest={handleHomeTrainingRequest}
            onShowReviews={handleShowReviews}
            onViewTeacher={handleViewTeacher}
          />
        ) : null;
      case 'homeTrainingBooking':
        return selectedClubId ? (
          <HomeTrainingBookingPage
            clubId={selectedClubId}
            onBack={() => handleNavigate('home')}
          />
        ) : null;
      case 'teacherDetail':
        return selectedTeacherId && selectedClubId ? (
          <TeacherDetailPage
            teacherId={selectedTeacherId}
            clubId={selectedClubId}
            onBack={() => handleNavigate('clubDetail')}
            onBookAppointment={() => {
              setSelectedClubId(selectedClubId);
              handleNavigate('booking');
            }}
          />
        ) : null;
      case 'dogProgression':
        return selectedDogId ? (
          <DogProgressionPage
            dogId={selectedDogId}
            onBack={() => handleNavigate('mydogs')}
            onViewTasks={(dogId) => {
              setSelectedDogId(dogId);
              handleNavigate('dogTasks');
            }}
            onViewBadges={(dogId) => {
              setSelectedDogId(dogId);
              handleNavigate('dogBadges');
            }}
          />
        ) : null;
      case 'dogTasks':
        return selectedDogId ? (
          <DogTasksPage
            dogId={selectedDogId}
            onBack={() => handleNavigate('dogProgression')}
          />
        ) : null;
      case 'dogBadges':
        return selectedDogId ? (
          <BadgesCollectionPage
            dogId={selectedDogId}
            onBack={() => handleNavigate('dogProgression')}
          />
        ) : null;
      case 'teacherLeaderboard':
        return (
          <TeacherLeaderboardPage
            onBack={() => handleNavigate('clubs')}
            onViewTeacher={(teacherId) => {
              setSelectedTeacherId(teacherId);
              setSelectedClubId(1); // Default club for now
              handleNavigate('teacherDetail');
            }}
          />
        );
      case 'clubLeaderboard':
        return (
          <ClubLeaderboardPage
            onBack={() => handleNavigate('clubs')}
            onViewClub={(clubId) => {
              setSelectedClubId(clubId);
              handleNavigate('clubDetail');
            }}
          />
        );
      case 'eventDetail':
        return selectedEventId ? (
          <EventDetailPage
            eventId={selectedEventId}
            onBack={() => handleNavigate('clubs')}
            onRegister={handleRegisterEvent}
          />
        ) : null;
      case 'eventBooking':
        return selectedEventId ? (
          <EventBookingPage
            eventId={selectedEventId}
            onBack={() => handleNavigate('eventDetail')}
          />
        ) : null;
      case 'booking':
        return selectedClubId ? (
          <BookingPage 
            clubId={selectedClubId} 
            onBack={() => handleNavigate('clubDetail')} 
          />
        ) : null;
      case 'ratingInvitation':
        return selectedBookingId ? (
          <RatingInvitationPage
            bookingId={selectedBookingId}
            onStartRating={handleStartRating}
            onDismiss={() => {
              const target = ratingReturnTarget || 'home';
              setRatingReturnTarget(null);
              handleNavigate(target);
            }}
          />
        ) : null;
      case 'rating':
        return selectedBookingId ? (
          <RatingPage
            bookingId={selectedBookingId}
            onBack={() => {
              const target = ratingReturnTarget || 'home';
              setRatingReturnTarget(null);
              handleNavigate(target);
            }}
          />
        ) : null;
      case 'reviews':
        return (
          <ReviewsPage
            clubId={selectedClubId || undefined}
            onBack={() => selectedClubId ? handleNavigate('clubDetail') : handleNavigate('home')}
          />
        );
      case 'notifications':
        return (
          <NotificationsPage
            onBack={() => handleNavigate('account')}
            onNavigateToRating={(bookingId) => {
              setSelectedBookingId(bookingId);
              setRatingReturnTarget('notifications');
              setCurrentPage('ratingInvitation');
            }}
            onNavigateToClub={(clubId) => {
              setSelectedClubId(clubId);
              setCurrentPage('clubDetail');
            }}
          />
        );
      case 'bookings':
        return (
          <ComingSoonPage
            title="Mes réservations"
            description="Consultez toutes vos réservations passées et à venir en un seul endroit."
            onBack={() => handleNavigate('account')}
          />
        );
      case 'dogs':
        return (
          <ComingSoonPage
            title="Mes chiens"
            description="Gérez les profils de vos chiens et suivez leur progression."
            onBack={() => handleNavigate('account')}
          />
        );
      case 'followedClubs':
        return (
          <ComingSoonPage
            title="Clubs suivis"
            description="Retrouvez tous vos clubs favoris et restez informé de leurs actualités."
            onBack={() => handleNavigate('account')}
          />
        );
      case 'settings':
        return (
          <ComingSoonPage
            title="Paramètres"
            description="Personnalisez votre expérience Smart Dogs."
            onBack={() => handleNavigate('account')}
          />
        );
      case 'djanai':
        return (
          <DjanAIOnboardingPage
            onComplete={(profile) => {
              setDogProfile(profile);
              setCurrentPage('djanaiResults');
            }}
            onBack={() => handleNavigate(previousPage === 'djanai' ? 'home' : previousPage)}
          />
        );
      case 'djanaiResults':
        return dogProfile ? (
          <DjanAIResultsPage
            profile={dogProfile}
            onBack={() => handleNavigate(previousPage === 'djanai' ? 'home' : previousPage)}
            onRestart={() => {
              setDogProfile(null);
              setCurrentPage('djanai');
            }}
          />
        ) : null;
      case 'djanai-program':
        // Affiche le programme existant, ou crée un profil par défaut si aucun n'existe
        const defaultProfile = dogProfile || {
          age: 'adult',
          breed: 'Mixed',
          size: 'medium',
          energy: 'moderate',
          experience: 'intermediate',
          goals: ['basic-obedience', 'leash-walking'],
          behaviors: [],
          environment: 'apartment',
          timeAvailable: '30-60min',
        };
        return (
          <DjanAIResultsPage
            profile={defaultProfile}
            onBack={() => handleNavigate('mydog')}
            onRestart={() => {
              setDogProfile(null);
              setCurrentPage('djanai');
            }}
          />
        );
      case 'clubCommunity':
        return selectedClubId ? (
          <ClubCommunityPage
            clubId={selectedClubId}
            onBack={() => handleNavigate('community')}
            onChannelClick={handleChannelClick}
            onEventsClick={handleEventsClick}
          />
        ) : null;
      case 'events':
        return selectedClubId ? (
          <EventsListPage
            clubId={selectedClubId}
            onBack={() => handleNavigate('clubCommunity')}
          />
        ) : null;
      case 'chatRoom':
        return selectedClubId && selectedChannelId ? (
          <ChatRoomPage
            clubId={selectedClubId}
            channelId={selectedChannelId}
            channelName={selectedChannelName}
            onBack={() => handleNavigate('clubCommunity')}
          />
        ) : null;
      case 'forum':
        return selectedClubId && selectedChannelId ? (
          <ForumPage
            clubId={selectedClubId}
            channelId={selectedChannelId}
            channelName={selectedChannelName}
            onBack={() => handleNavigate('clubCommunity')}
            onPostClick={handlePostClick}
          />
        ) : null;
      case 'postDetail':
        return selectedPostId ? (
          <PostDetailPage
            postId={selectedPostId}
            onBack={() => handleNavigate('forum')}
          />
        ) : null;
      case 'guidelines':
        return <GuidelinesPage onBack={() => handleNavigate('account')} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const clubPages = ['clubHome', 'clubProfile', 'clubCommunity', 'clubAppointments', 'clubPayments'];
  const teacherPages = ['teacher-home', 'teacher-appointments', 'teacher-community', 'teacher-account'];
  const userPagesWithoutNav = ['verified', 'clubDetail', 'booking', 'homeTrainingBooking', 'clubCommunity', 'chatRoom', 'events', 'forum', 'postDetail', 'guidelines'];
  const showBottomNav = userType === 'club' 
    ? clubPages.includes(currentPage) 
    : userType === 'teacher'
    ? teacherPages.includes(currentPage)
    : !userPagesWithoutNav.includes(currentPage);

  // Guidelines page should be full-width on desktop
  if (currentPage === 'guidelines') {
    return (
      <div className="min-h-screen bg-gray-50">
        <GuidelinesPage onBack={() => handleNavigate('account')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Mobile Container - iPhone 15 Pro dimensions */}
      <div className="relative w-full max-w-[393px] h-screen bg-white mx-auto shadow-lg">
        {renderPage()}
        {showBottomNav && (
          userType === 'club' ? (
            <ClubBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
          ) : userType === 'teacher' ? (
            <TeacherBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
          ) : (
            <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
          )
        )}
      </div>
    </div>
  );
}
function setAuthAccount(_session: SignedInAccount) {
  throw new Error('Function not implemented.');
}
