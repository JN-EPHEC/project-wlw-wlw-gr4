import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, TrendingUp, Users, Award, Crown, Medal, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';

interface TeacherLeaderboardPageProps {
  onBack: () => void;
  onViewTeacher?: (teacherId: number) => void;
}

export function TeacherLeaderboardPage({ onBack, onViewTeacher }: TeacherLeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState('rating');

  // Mock data
  const leaderboards = {
    currentMonth: 'Novembre 2024',
    
    // Classement par note moyenne
    byRating: [
      { id: 1, rank: 1, name: 'Emma Bernard', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', rating: 4.95, reviews: 203, specialty: 'Comportement', badge: '👑', club: 'Canin Club Paris' },
      { id: 2, rank: 2, name: 'Sophie Martin', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', rating: 4.92, reviews: 156, specialty: 'Obéissance', badge: '🥈', club: 'Canin Club Paris' },
      { id: 3, rank: 3, name: 'Lucas Dubois', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rating: 4.88, reviews: 89, specialty: 'Agility', badge: '🥉', club: 'Canin Club Paris' },
      { id: 4, rank: 4, name: 'Marie Leclerc', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', rating: 4.85, reviews: 142, specialty: 'Éducation Positive', club: 'Dog Academy Lyon' },
      { id: 5, rank: 5, name: 'Thomas Rousseau', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', rating: 4.82, reviews: 98, specialty: 'Chiens Réactifs', club: 'Edu Dog Marseille' },
    ],
    
    // Classement par nombre de séances
    bySessions: [
      { id: 2, rank: 1, name: 'Sophie Martin', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', sessions: 87, rating: 4.92, specialty: 'Obéissance', badge: '🔥', club: 'Canin Club Paris' },
      { id: 1, rank: 2, name: 'Emma Bernard', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', sessions: 76, rating: 4.95, specialty: 'Comportement', badge: '⚡', club: 'Canin Club Paris' },
      { id: 4, rank: 3, name: 'Marie Leclerc', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', sessions: 68, rating: 4.85, specialty: 'Éducation Positive', badge: '💪', club: 'Dog Academy Lyon' },
      { id: 3, rank: 4, name: 'Lucas Dubois', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', sessions: 54, rating: 4.88, specialty: 'Agility', club: 'Canin Club Paris' },
      { id: 5, rank: 5, name: 'Thomas Rousseau', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', sessions: 49, rating: 4.82, specialty: 'Chiens Réactifs', club: 'Edu Dog Marseille' },
    ],
    
    // Classement par satisfaction client
    bySatisfaction: [
      { id: 1, rank: 1, name: 'Emma Bernard', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', satisfaction: 98, rating: 4.95, specialty: 'Comportement', badge: '💯', club: 'Canin Club Paris' },
      { id: 2, rank: 2, name: 'Sophie Martin', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', satisfaction: 96, rating: 4.92, specialty: 'Obéissance', badge: '⭐', club: 'Canin Club Paris' },
      { id: 4, rank: 3, name: 'Marie Leclerc', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', satisfaction: 94, rating: 4.85, specialty: 'Éducation Positive', badge: '✨', club: 'Dog Academy Lyon' },
      { id: 3, rank: 4, name: 'Lucas Dubois', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', satisfaction: 92, rating: 4.88, specialty: 'Agility', club: 'Canin Club Paris' },
      { id: 5, rank: 5, name: 'Thomas Rousseau', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', satisfaction: 91, rating: 4.82, specialty: 'Chiens Réactifs', club: 'Edu Dog Marseille' },
    ],
    
    // Professeurs en tendance
    trending: [
      { id: 6, rank: 1, name: 'Julie Moreau', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', growth: '+45%', rating: 4.78, specialty: 'Chiots', badge: '🚀', club: 'Puppy School Nice' },
      { id: 7, rank: 2, name: 'Antoine Dubois', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150', growth: '+38%', rating: 4.81, specialty: 'Agility Compétition', badge: '📈', club: 'Sport Canin Bordeaux' },
      { id: 8, rank: 3, name: 'Camille Petit', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', growth: '+32%', rating: 4.76, specialty: 'Tricks & Fun', badge: '🌟', club: 'Fun Dog Toulouse' },
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

  const renderTeacherCard = (teacher: any, metric: string) => {
    const isTopThree = teacher.rank <= 3;
    
    return (
      <Card
        key={teacher.id}
        onClick={() => onViewTeacher?.(teacher.id)}
        className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
          isTopThree ? getRankBgColor(teacher.rank) + ' text-white' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="flex-shrink-0">
            {getRankIcon(teacher.rank)}
          </div>

          {/* Avatar */}
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
            <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`truncate ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                {teacher.name}
              </h4>
              {teacher.badge && <span className="text-lg">{teacher.badge}</span>}
            </div>
            <p className={`text-sm mb-1 ${isTopThree ? 'text-white/90' : 'text-gray-600'}`}>
              {teacher.specialty}
            </p>
            <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
              {teacher.club}
            </p>
          </div>

          {/* Metric */}
          <div className="text-right flex-shrink-0">
            {metric === 'rating' && (
              <>
                <div className={`flex items-center gap-1 mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                  <Star className={`h-4 w-4 ${isTopThree ? 'fill-white' : 'fill-yellow-400 text-yellow-400'}`} />
                  <span>{teacher.rating}</span>
                </div>
                <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                  {teacher.reviews} avis
                </p>
              </>
            )}
            {metric === 'sessions' && (
              <>
                <div className={`text-2xl mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                  {teacher.sessions}
                </div>
                <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                  séances
                </p>
              </>
            )}
            {metric === 'satisfaction' && (
              <>
                <div className={`text-2xl mb-1 ${isTopThree ? 'text-white' : 'text-gray-800'}`}>
                  {teacher.satisfaction}%
                </div>
                <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                  satisfait
                </p>
              </>
            )}
            {metric === 'growth' && (
              <>
                <Badge className={`${isTopThree ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'} border-0 mb-1`}>
                  {teacher.growth}
                </Badge>
                <p className={`text-xs ${isTopThree ? 'text-white/80' : 'text-gray-500'}`}>
                  croissance
                </p>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-2">Classement des Éducateurs</h1>
            <p className="text-white/90 text-sm">{leaderboards.currentMonth}</p>
          </div>
          <Trophy className="h-12 w-12 text-white" />
        </div>

        <Card className="p-4 bg-white/20 backdrop-blur-sm border-0">
          <p className="text-white text-center text-sm">
            🏆 Les meilleurs éducateurs du mois sont récompensés et mis en avant !
          </p>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Category Tabs */}
        <div className="sticky top-0 bg-white z-10 pt-4 pb-3 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-scroll pb-2 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setActiveTab('rating')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'rating'
                  ? 'bg-[#E9B782] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className="h-4 w-4" />
              Meilleure note
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'sessions'
                  ? 'bg-[#E9B782] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4" />
              Plus de cours
            </button>
            <button
              onClick={() => setActiveTab('satisfaction')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'satisfaction'
                  ? 'bg-[#E9B782] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Award className="h-4 w-4" />
              Satisfaction
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'trending'
                  ? 'bg-[#E9B782] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              En tendance
            </button>
          </div>
        </div>

        <div className="px-4 py-6 space-y-3">
          {activeTab === 'rating' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-[#E9B782]" />
                <h2 className="text-gray-800">Top éducateurs par note</h2>
              </div>
              {leaderboards.byRating.map(teacher => renderTeacherCard(teacher, 'rating'))}
            </>
          )}

          {activeTab === 'sessions' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-[#E9B782]" />
                <h2 className="text-gray-800">Top éducateurs par nombre de cours</h2>
              </div>
              {leaderboards.bySessions.map(teacher => renderTeacherCard(teacher, 'sessions'))}
            </>
          )}

          {activeTab === 'satisfaction' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-[#E9B782]" />
                <h2 className="text-gray-800">Top éducateurs par satisfaction</h2>
              </div>
              {leaderboards.bySatisfaction.map(teacher => renderTeacherCard(teacher, 'satisfaction'))}
            </>
          )}

          {activeTab === 'trending' && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#E9B782]" />
                <h2 className="text-gray-800">Éducateurs en tendance</h2>
              </div>
              <Card className="p-4 bg-purple-50 border-purple-200 mb-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-900">
                    Les éducateurs avec la plus forte croissance de réservations ce mois-ci !
                  </p>
                </div>
              </Card>
              {leaderboards.trending.map(teacher => renderTeacherCard(teacher, 'growth'))}
            </>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
