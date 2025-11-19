import React, { useState } from 'react';
import { ArrowLeft, Award, Lock, Calendar, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BadgesCollectionPageProps {
  dogId: number;
  onBack: () => void;
}

export function BadgesCollectionPage({ dogId, onBack }: BadgesCollectionPageProps) {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  // Mock data
  const badgesData = {
    dogName: 'Max',
    totalBadges: 24,
    unlockedBadges: 12,
    badges: [
      // Obéissance
      { id: 1, name: 'Première Séance', icon: '🎓', category: 'Obéissance', unlocked: true, date: '15 Oct 2024', description: 'Complète ta première séance de dressage', rarity: 'Commun' },
      { id: 2, name: 'Obéissance Basic', icon: '⭐', category: 'Obéissance', unlocked: true, date: '22 Oct 2024', description: 'Maîtrise les commandes de base : Assis, Couché, Pas bouger', rarity: 'Commun' },
      { id: 3, name: 'Rappel Master', icon: '📣', category: 'Obéissance', unlocked: true, date: '05 Nov 2024', description: 'Revient systématiquement au rappel, même avec distractions', rarity: 'Rare' },
      { id: 4, name: 'Marche Parfaite', icon: '🚶', category: 'Obéissance', unlocked: false, required: 'Niveau 15', description: 'Marche en laisse sans tirer pendant 30 minutes', rarity: 'Épique' },
      { id: 5, name: 'Obéissance Expert', icon: '🏆', category: 'Obéissance', unlocked: false, required: 'Niveau 25', description: 'Maîtrise toutes les commandes avancées', rarity: 'Légendaire' },
      
      // Socialisation
      { id: 6, name: 'Social Butterfly', icon: '🦋', category: 'Socialisation', unlocked: true, date: '28 Oct 2024', description: 'Interagit positivement avec 10 chiens différents', rarity: 'Commun' },
      { id: 7, name: 'Ami des Humains', icon: '👥', category: 'Socialisation', unlocked: true, date: '01 Nov 2024', description: 'Se montre amical avec tous les inconnus', rarity: 'Rare' },
      { id: 8, name: 'Aventurier Urbain', icon: '🏙️', category: 'Socialisation', unlocked: false, required: 'Niveau 15', description: 'Reste calme dans 5 environnements urbains différents', rarity: 'Épique' },
      { id: 9, name: 'Leader de Meute', icon: '👑', category: 'Socialisation', unlocked: false, required: 'Niveau 30', description: 'Interactions exemplaires avec 50+ chiens', rarity: 'Légendaire' },
      
      // Agility
      { id: 10, name: 'Agility Débutant', icon: '🏃', category: 'Agility', unlocked: true, date: '12 Nov 2024', description: 'Complète ton premier parcours d\'agility', rarity: 'Commun' },
      { id: 11, name: 'Sauteur', icon: '🎯', category: 'Agility', unlocked: false, required: 'Niveau 12', description: 'Franchis 20 obstacles sans faute', rarity: 'Rare' },
      { id: 12, name: 'Vitesse Éclair', icon: '⚡', category: 'Agility', unlocked: false, required: 'Niveau 18', description: 'Parcours d\'agility complet en moins de 60 secondes', rarity: 'Épique' },
      { id: 13, name: 'Champion Agility', icon: '🥇', category: 'Agility', unlocked: false, required: 'Niveau 28', description: 'Remporte une compétition d\'agility', rarity: 'Légendaire' },
      
      // Comportement
      { id: 14, name: 'Zen Master', icon: '🧘', category: 'Comportement', unlocked: true, date: '08 Nov 2024', description: 'Reste calme face à 5 stimuli différents', rarity: 'Rare' },
      { id: 15, name: 'Patience', icon: '⏰', category: 'Comportement', unlocked: false, required: 'Niveau 14', description: 'Attend 5 minutes devant sa gamelle sans bouger', rarity: 'Épique' },
      { id: 16, name: 'Bien Élevé', icon: '🎩', category: 'Comportement', unlocked: false, required: 'Niveau 20', description: 'Comportement exemplaire dans toutes situations', rarity: 'Légendaire' },
      
      // Tricks
      { id: 17, name: 'First Trick', icon: '🎭', category: 'Tricks', unlocked: true, date: '03 Nov 2024', description: 'Apprends ton premier trick amusant', rarity: 'Commun' },
      { id: 18, name: 'Artiste', icon: '🎪', category: 'Tricks', unlocked: false, required: 'Niveau 16', description: 'Maîtrise 10 tricks différents', rarity: 'Épique' },
      { id: 19, name: 'Pro du Show', icon: '🌟', category: 'Tricks', unlocked: false, required: 'Niveau 22', description: 'Enchaîne 5 tricks sans pause', rarity: 'Légendaire' },
      
      // Spéciaux
      { id: 20, name: 'Série de Feu', icon: '🔥', category: 'Spécial', unlocked: true, date: 'Aujourd\'hui', description: 'Maintiens une série de 7 jours d\'affilée', rarity: 'Rare' },
      { id: 21, name: 'Travailleur Acharné', icon: '💪', category: 'Spécial', unlocked: true, date: '10 Nov 2024', description: 'Complète 100 tâches au total', rarity: 'Épique' },
      { id: 22, name: 'Perfectionniste', icon: '✨', category: 'Spécial', unlocked: false, required: 'Niveau 50', description: 'Atteins le niveau maximum', rarity: 'Légendaire' },
      { id: 23, name: 'Smart Dog', icon: '🧠', category: 'Spécial', unlocked: false, required: '500 tâches', description: 'Complète 500 tâches au total', rarity: 'Légendaire' },
      { id: 24, name: 'Légende', icon: '🌈', category: 'Spécial', unlocked: false, required: 'Tous badges', description: 'Débloque tous les autres badges', rarity: 'Mythique' },
    ],
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Commun': return 'bg-gray-100 text-gray-700';
      case 'Rare': return 'bg-blue-100 text-blue-700';
      case 'Épique': return 'bg-purple-100 text-purple-700';
      case 'Légendaire': return 'bg-orange-100 text-orange-700';
      case 'Mythique': return 'bg-gradient-to-r from-pink-500 to-purple-500 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = ['Tous', 'Obéissance', 'Socialisation', 'Agility', 'Comportement', 'Tricks', 'Spécial'];
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredBadges = activeCategory === 'Tous' 
    ? badgesData.badges 
    : badgesData.badges.filter(b => b.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white mb-2">Badges de {badgesData.dogName}</h1>
            <p className="text-white/90 text-sm">Collection de récompenses</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-1 border-4 border-white/30">
              <Award className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-0 shadow-sm text-center">
            <div className="text-3xl text-gray-800 mb-1">{badgesData.unlockedBadges}</div>
            <p className="text-sm text-gray-600">Débloqués</p>
          </Card>
          <Card className="p-4 border-0 shadow-sm text-center">
            <div className="text-3xl text-gray-800 mb-1">{badgesData.totalBadges}</div>
            <p className="text-sm text-gray-600">Total</p>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Category Tabs */}
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-3 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#41B6A6] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Badges Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-4 text-center border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-2 relative">
                  {badge.icon}
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-lg backdrop-blur-sm">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="text-xs text-gray-800 line-clamp-2 mb-2" style={{ minHeight: '2.5rem' }}>
                  {badge.name}
                </h4>
                <Badge className={`${getRarityColor(badge.rarity)} border-0 text-xs`}>
                  {badge.rarity}
                </Badge>
              </Card>
            ))}
          </div>

          {/* Badge Detail Modal */}
          {selectedBadge && (
            <div
              className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
              onClick={() => setSelectedBadge(null)}
            >
              <Card
                className="w-full max-w-lg rounded-t-3xl border-0 shadow-2xl p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4 relative inline-block">
                    {selectedBadge.icon}
                    {!selectedBadge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-gray-800 mb-2">{selectedBadge.name}</h2>
                  <Badge className={`${getRarityColor(selectedBadge.rarity)} border-0`}>
                    {selectedBadge.rarity}
                  </Badge>
                </div>

                <Card className="p-4 bg-gray-50 border-0 mb-4">
                  <p className="text-gray-700 text-center">{selectedBadge.description}</p>
                </Card>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Card className="p-3 border-0 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-[#41B6A6]" />
                      <p className="text-xs text-gray-600">Catégorie</p>
                    </div>
                    <p className="text-sm text-gray-800">{selectedBadge.category}</p>
                  </Card>
                  <Card className="p-3 border-0 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {selectedBadge.unlocked ? (
                        <Calendar className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      )}
                      <p className="text-xs text-gray-600">
                        {selectedBadge.unlocked ? 'Obtenu le' : 'Requis'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-800">
                      {selectedBadge.unlocked ? selectedBadge.date : selectedBadge.required}
                    </p>
                  </Card>
                </div>

                {selectedBadge.unlocked ? (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <Award className="h-5 w-5" />
                      <p className="text-sm">Badge débloqué ! Bravo ! 🎉</p>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-center gap-2 text-orange-700">
                      <Lock className="h-5 w-5" />
                      <p className="text-sm">Continue à progresser pour débloquer ce badge !</p>
                    </div>
                  </Card>
                )}
              </Card>
            </div>
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
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
