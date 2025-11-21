import { ArrowLeft, Award, Calendar, Crown, Medal, Star, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface ClubLeaderboardPageProps {
  onBack: () => void;
  onViewClub?: (clubId: number) => void;
}

export function ClubLeaderboardPage({ onBack, onViewClub }: ClubLeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState('overall');

  // Mock data
  const leaderboards = {
    currentMonth: 'Novembre 2024',
    season: 'Automne 2024',
    
    // Classement général
    overall: [
      { 
        id: 1, rank: 1, 
        name: 'Canin Club Paris', 
        image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150',
        city: 'Paris',
        totalScore: 9850,
        rating: 4.9,
        sessions: 342,
        events: 28,
        teachers: 12,
        members: 856,
        badge: '👑'
      },
      { 
        id: 2, rank: 2, 
        name: 'Dog Academy Lyon', 
        image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150',
        city: 'Lyon',
        totalScore: 9620,
        rating: 4.85,
        sessions: 315,
        events: 24,
        teachers: 10,
        members: 742,
        badge: '🥈'
      },
      { 
        id: 3, rank: 3, 
        name: 'Edu Dog Marseille', 
        image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150',
        city: 'Marseille',
        totalScore: 9380,
        rating: 4.82,
        sessions: 298,
        events: 22,
        teachers: 9,
        members: 698,
        badge: '🥉'
      },
      { 
        id: 4, rank: 4, 
        name: 'Sport Canin Bordeaux', 
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150',
        city: 'Bordeaux',
        totalScore: 8940,
        rating: 4.78,
        sessions: 276,
        events: 19,
        teachers: 8,
        members: 624
      },
      { 
        id: 5, rank: 5, 
        name: 'Puppy School Nice', 
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150',
        city: 'Nice',
        totalScore: 8720,
        rating: 4.76,
        sessions: 254,
        events: 18,
        teachers: 7,
        members: 589
      },
    ],
    
    // Par nombre de cours
    bySessions: [
      { id: 1, rank: 1, name: 'Canin Club Paris', city: 'Paris', sessions: 342, growth: '+12%', image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150' },
      { id: 2, rank: 2, name: 'Dog Academy Lyon', city: 'Lyon', sessions: 315, growth: '+8%', image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150' },
      { id: 3, rank: 3, name: 'Edu Dog Marseille', city: 'Marseille', sessions: 298, growth: '+15%', image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150' },
      { id: 4, rank: 4, name: 'Sport Canin Bordeaux', city: 'Bordeaux', sessions: 276, growth: '+5%', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150' },
      { id: 5, rank: 5, name: 'Puppy School Nice', city: 'Nice', sessions: 254, growth: '+18%', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150' },
    ],
    
    // Par événements
    byEvents: [
      { id: 1, rank: 1, name: 'Canin Club Paris', city: 'Paris', events: 28, participants: 1240, image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150' },
      { id: 2, rank: 2, name: 'Dog Academy Lyon', city: 'Lyon', events: 24, participants: 1050, image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150' },
      { id: 3, rank: 3, name: 'Edu Dog Marseille', city: 'Marseille', events: 22, participants: 980, image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150' },
      { id: 4, rank: 4, name: 'Sport Canin Bordeaux', city: 'Bordeaux', events: 19, participants: 845, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150' },
      { id: 5, rank: 5, name: 'Puppy School Nice', city: 'Nice', events: 18, participants: 790, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150' },
    ],
    
    // Par satisfaction
    byRating: [
      { id: 1, rank: 1, name: 'Canin Club Paris', city: 'Paris', rating: 4.9, reviews: 856, image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?w=150' },
      { id: 2, rank: 2, name: 'Dog Academy Lyon', city: 'Lyon', rating: 4.85, reviews: 742, image: 'https://images.unsplash.com/photo-1592486058499-f262efe8292a?w=150' },
      { id: 3, rank: 3, name: 'Edu Dog Marseille', city: 'Marseille', rating: 4.82, reviews: 698, image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?w=150' },
      { id: 4, rank: 4, name: 'Sport Canin Bordeaux', city: 'Bordeaux', rating: 4.78, reviews: 624, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150' },
      { id: 5, rank: 5, name: 'Puppy School Nice', city: 'Nice', rating: 4.76, reviews: 589, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150' },
    ],
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">{rank}</div>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500';
      default: return 'bg-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-2">Classement Inter-Clubs</h1>
            <p className="text-white/90 text-sm">{leaderboards.season}</p>
          </div>
          <Trophy className="h-12 w-12 text-white" />
        </div>

        <Card className="p-4 bg-white/20 backdrop-blur-sm border-0">
          <p className="text-white text-center text-sm">
            🏆 Compétition amicale entre les meilleurs clubs de France !
          </p>
        </Card>
      </div>

      {/* Category Tabs - Fixed at top */}
      <div className="bg-white border-b border-gray-200">
        <div className="pt-4 pb-3">
          <div className="overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="flex gap-2 px-4 min-w-max">
              <button
                onClick={() => setActiveTab('overall')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  activeTab === 'overall'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Classement général
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  activeTab === 'sessions'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="h-4 w-4" />
                Plus de cours
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  activeTab === 'events'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Calendar className="h-4 w-4" />
                Plus d'événements
              </button>
              <button
                onClick={() => setActiveTab('rating')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  activeTab === 'rating'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Star className="h-4 w-4" />
                Meilleurs avis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        <div className="px-4 py-6 space-y-3">
          {activeTab === 'overall' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-purple-600" />
                <h2 className="text-gray-800">Classement général</h2>
              </div>
              
              {leaderboards.overall.map((club) => {
                const isTopThree = club.rank <= 3;
                return (
                  <Card
                    key={club.id}
                    onClick={() => onViewClub?.(club.id)}
                    className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      isTopThree ? getRankBgColor(club.rank) + ' text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(club.rank)}
                      </div>
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`truncate ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                            {club.name}
                          </h4>
                          {club.badge && <span className="text-lg">{club.badge}</span>}
                        </div>
                        <p className={`text-sm ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
                          {club.city}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl mb-1 ${isTopThree ? 'text-white' : 'text-purple-600'}`}>
                          {club.totalScore}
                        </div>
                        <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                          points
                        </p>
                      </div>
                    </div>
                    
                    {/* Stats grid */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className={`text-center p-2 rounded-lg ${isTopThree ? 'bg-white/20' : 'bg-gray-50'}`}>
                        <Star className={`h-4 w-4 mx-auto mb-1 ${isTopThree ? 'text-white' : 'text-yellow-500'}`} />
                        <div className={`text-sm ${isTopThree ? 'text-white' : 'text-gray-800'}`}>{club.rating}</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isTopThree ? 'bg-white/20' : 'bg-gray-50'}`}>
                        <Users className={`h-4 w-4 mx-auto mb-1 ${isTopThree ? 'text-white' : 'text-[#41B6A6]'}`} />
                        <div className={`text-sm ${isTopThree ? 'text-white' : 'text-gray-800'}`}>{club.sessions}</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isTopThree ? 'bg-white/20' : 'bg-gray-50'}`}>
                        <Calendar className={`h-4 w-4 mx-auto mb-1 ${isTopThree ? 'text-white' : 'text-[#F28B6F]'}`} />
                        <div className={`text-sm ${isTopThree ? 'text-white' : 'text-gray-800'}`}>{club.events}</div>
                      </div>
                      <div className={`text-center p-2 rounded-lg ${isTopThree ? 'bg-white/20' : 'bg-gray-50'}`}>
                        <Award className={`h-4 w-4 mx-auto mb-1 ${isTopThree ? 'text-white' : 'text-[#E9B782]'}`} />
                        <div className={`text-sm ${isTopThree ? 'text-white' : 'text-gray-800'}`}>{club.teachers}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          {activeTab === 'sessions' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-purple-600" />
                <h2 className="text-gray-800">Top clubs par nombre de cours</h2>
              </div>
              {leaderboards.bySessions.map((club) => {
                const isTopThree = club.rank <= 3;
                return (
                  <Card
                    key={club.id}
                    onClick={() => onViewClub?.(club.id)}
                    className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      isTopThree ? getRankBgColor(club.rank) + ' text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getRankIcon(club.rank)}</div>
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`truncate mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          {club.name}
                        </h4>
                        <p className={`text-sm ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
                          {club.city}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          {club.sessions}
                        </div>
                        <Badge className={`${isTopThree ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'} border-0 text-xs`}>
                          {club.growth}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          {activeTab === 'events' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h2 className="text-gray-800">Top clubs par événements</h2>
              </div>
              {leaderboards.byEvents.map((club) => {
                const isTopThree = club.rank <= 3;
                return (
                  <Card
                    key={club.id}
                    onClick={() => onViewClub?.(club.id)}
                    className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      isTopThree ? getRankBgColor(club.rank) + ' text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getRankIcon(club.rank)}</div>
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`truncate mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          {club.name}
                        </h4>
                        <p className={`text-sm ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
                          {club.city} • {club.participants.toLocaleString()} participants
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          {club.events}
                        </div>
                        <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                          événements
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}

          {activeTab === 'rating' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-purple-600" />
                <h2 className="text-gray-800">Top clubs par satisfaction</h2>
              </div>
              {leaderboards.byRating.map((club) => {
                const isTopThree = club.rank <= 3;
                return (
                  <Card
                    key={club.id}
                    onClick={() => onViewClub?.(club.id)}
                    className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      isTopThree ? getRankBgColor(club.rank) + ' text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getRankIcon(club.rank)}</div>
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`truncate mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          {club.name}
                        </h4>
                        <p className={`text-sm ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
                          {club.city} • {club.reviews} avis
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`flex items-center gap-1 mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                          <Star className={`h-5 w-5 ${isTopThree ? 'fill-white' : 'fill-yellow-400 text-yellow-400'}`} />
                          <span className="text-xl">{club.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </div>


    </div>
  );
}
