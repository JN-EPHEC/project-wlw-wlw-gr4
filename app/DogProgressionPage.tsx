import React from 'react';
import { ArrowLeft, Star, Trophy, Award, Zap, TrendingUp, Target, CheckCircle, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface DogProgressionPageProps {
  dogId: number;
  onBack: () => void;
  onViewTasks: (dogId: number) => void;
  onViewBadges: (dogId: number) => void;
}

export function DogProgressionPage({ dogId, onBack, onViewTasks, onViewBadges }: DogProgressionPageProps) {
  // Mock data - in real app, this would come from API
  const dogProgress = {
    id: dogId,
    name: 'Max',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    level: 12,
    currentXP: 2840,
    nextLevelXP: 3200,
    totalXP: 15240,
    rank: 'Chien Éduqué',
    nextRank: 'Chien Expert',
    badges: [
      { id: 1, name: 'Première Séance', icon: '🎓', unlocked: true, date: '15 Oct 2024' },
      { id: 2, name: 'Obéissance Basic', icon: '⭐', unlocked: true, date: '22 Oct 2024' },
      { id: 3, name: 'Social Butterfly', icon: '🦋', unlocked: true, date: '28 Oct 2024' },
      { id: 4, name: 'Rappel Master', icon: '📣', unlocked: true, date: '05 Nov 2024' },
      { id: 5, name: 'Agility Débutant', icon: '🏃', unlocked: true, date: '12 Nov 2024' },
      { id: 6, name: 'Sage en Ville', icon: '🏙️', unlocked: false, required: 'Niveau 15' },
      { id: 7, name: 'Agility Expert', icon: '🏆', unlocked: false, required: 'Niveau 20' },
      { id: 8, name: 'Champion', icon: '👑', unlocked: false, required: 'Niveau 30' },
    ],
    recentAchievements: [
      { title: 'Tâche complétée', description: 'Marche en laisse sans tirer', xp: 50, date: 'Aujourd\'hui' },
      { title: 'Tâche complétée', description: 'Sociabilisation avec 3 chiens', xp: 75, date: 'Hier' },
      { title: 'Badge débloqué', description: 'Agility Débutant 🏃', xp: 200, date: 'Il y a 2 jours' },
    ],
    stats: {
      completedTasks: 87,
      totalSessions: 24,
      currentStreak: 7,
      longestStreak: 14,
    },
    categories: [
      { name: 'Obéissance', progress: 85, level: 8, color: '#41B6A6' },
      { name: 'Socialisation', progress: 72, level: 6, color: '#F28B6F' },
      { name: 'Agility', progress: 45, level: 4, color: '#E9B782' },
      { name: 'Comportement', progress: 91, level: 9, color: '#9333EA' },
    ],
  };

  const xpPercentage = (dogProgress.currentXP / dogProgress.nextLevelXP) * 100;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-[48px] pb-[72px] rounded-b-[3rem] shadow-lg relative pr-[16px] pl-[16px]">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <ImageWithFallback src={dogProgress.image} alt={dogProgress.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-white mb-1">{dogProgress.name}</h1>
            <p className="text-white/90 text-sm">{dogProgress.breed}</p>
            <Badge className="bg-white/20 text-white border-0 mt-2">
              {dogProgress.rank}
            </Badge>
          </div>
        </div>

      </div>

      {/* Niveau et XP Card */}
      <div className="px-4 my-[36px] mx-[0px]">
        <Card className="p-[24px] shadow-xl border-0 bg-white mx-[0px] my-[30px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg p-[0px]">
                <span className="text-2xl text-white text-[20px] font-[Baloo]">Niv. {dogProgress.level}</span>
              </div>
              <div>
                <h3 className="text-gray-800">Niveau {dogProgress.level}</h3>
                <p className="text-sm text-gray-600">{dogProgress.currentXP.toLocaleString()} / {dogProgress.nextLevelXP.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Prochain rang</p>
              <p className="text-sm text-[#41B6A6]">{dogProgress.nextRank}</p>
            </div>
          </div>
          
          <Progress value={xpPercentage} className="h-3" />
          <p className="text-xs text-gray-500 text-center mt-2">
            {(dogProgress.nextLevelXP - dogProgress.currentXP).toLocaleString()} XP pour niveau {dogProgress.level + 1}
          </p>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 text-center border-0 shadow-sm">
            <Target className="h-6 w-6 text-[#41B6A6] mx-auto mb-1" />
            <div className="text-xl text-gray-800 mb-0.5">{dogProgress.stats.completedTasks}</div>
            <p className="text-xs text-gray-600">Tâches</p>
          </Card>
          <Card className="p-3 text-center border-0 shadow-sm">
            <Trophy className="h-6 w-6 text-[#E9B782] mx-auto mb-1" />
            <div className="text-xl text-gray-800 mb-0.5">{dogProgress.badges.filter(b => b.unlocked).length}</div>
            <p className="text-xs text-gray-600">Badges</p>
          </Card>
          <Card className="p-3 text-center border-0 shadow-sm">
            <Zap className="h-6 w-6 text-orange-500 mx-auto mb-1" />
            <div className="text-xl text-gray-800 mb-0.5">{dogProgress.stats.currentStreak}</div>
            <p className="text-xs text-gray-600">Série</p>
          </Card>
          <Card className="p-3 text-center border-0 shadow-sm">
            <Star className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <div className="text-xl text-gray-800 mb-0.5">{dogProgress.stats.totalSessions}</div>
            <p className="text-xs text-gray-600">Séances</p>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onViewTasks(dogId)}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-[#41B6A6] to-[#359889] hover:shadow-lg transition-shadow"
          >
            <CheckCircle className="h-6 w-6" />
            <span>Tâches du jour</span>
          </Button>
          <Button
            onClick={() => onViewBadges(dogId)}
            className="h-auto py-4 flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-400 to-orange-500 hover:shadow-lg transition-shadow"
          >
            <Award className="h-6 w-6" />
            <span>Mes badges</span>
          </Button>
        </div>

        <Separator />

        {/* Progression par catégorie */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#41B6A6]" />
            <h2 className="text-gray-800">Progression par catégorie</h2>
          </div>
          <div className="space-y-4">
            {dogProgress.categories.map((category, index) => (
              <Card key={index} className="p-4 border-0 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-gray-800">{category.name}</h4>
                    <p className="text-sm text-gray-600">Niveau {category.level}</p>
                  </div>
                  <Badge style={{ backgroundColor: category.color, color: 'white' }} className="border-0">
                    {category.progress}%
                  </Badge>
                </div>
                <Progress value={category.progress} className="h-2" style={{ 
                  ['--progress-background' as any]: category.color 
                }} />
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Badges récents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#E9B782]" />
              <h2 className="text-gray-800">Badges débloqués</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onViewBadges(dogId)}>
              Tout voir
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {dogProgress.badges.slice(0, 8).map((badge) => (
              <Card
                key={badge.id}
                className={`p-3 text-center border-0 shadow-sm ${
                  badge.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-100'
                }`}
              >
                <div className="text-3xl mb-1 relative">
                  {badge.icon}
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">{badge.name}</p>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Activité récente */}
        <section>
          <h2 className="text-gray-800 mb-4">Activité récente</h2>
          <div className="space-y-3">
            {dogProgress.recentAchievements.map((achievement, index) => (
              <Card key={index} className="p-4 border-0 shadow-sm border-l-4 border-l-[#41B6A6]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="text-gray-800">{achievement.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                  </div>
                  <Badge className="bg-[#41B6A6] text-white border-0">
                    +{achievement.xp} XP
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
