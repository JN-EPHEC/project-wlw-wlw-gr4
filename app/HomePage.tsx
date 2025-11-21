import { Bell, Brain, Calendar, CheckCircle, Gift, Heart, MapPin, Percent, Search, Sparkles, Star, TrendingUp, Trophy, Zap } from 'lucide-react';
import type { SignedInAccount } from '../hooks/auth';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface HomePageProps {
  onNavigate: (page: string) => void;
  user?: SignedInAccount | null;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  const profile = (user?.profile ?? {}) as Record<string, unknown>;
  const firstName = typeof profile['firstName'] === 'string' ? (profile['firstName'] as string) : undefined;
  const lastName = typeof profile['lastName'] === 'string' ? (profile['lastName'] as string) : undefined;
  const profilePhoto =
    typeof profile['profilePhoto'] === 'string' && profile['profilePhoto']
      ? (profile['profilePhoto'] as string)
      : null;
  const userName = [firstName, lastName].filter(Boolean).join(' ') || user?.displayName || 'Smart Dogs';
  const initials =
    userName
      .split(' ')
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SD';
  const city = typeof profile['city'] === 'string' ? (profile['city'] as string) : null;
  const subtitle = city ?? user?.email ?? 'Prêt(e) pour une nouvelle séance ?';
  const roleLabel =
    user?.role === 'club' ? 'Club' : user?.role === 'teacher' ? 'Éducateur' : user ? 'Particulier' : null;
  // Données mock - Promotions
  const promotions = [
    {
      id: 1,
      title: '50% sur votre 1ère séance',
      description: 'Découvrez l\'agility',
      club: 'Agility Pro',
      discount: '-50%',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 2,
      title: 'Mois gratuit pour les nouveaux',
      description: 'Abonnement premium',
      club: 'Canin Club Paris',
      discount: 'GRATUIT',
      image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 3,
      title: 'Pack découverte 3 séances',
      description: 'Obéissance + Agility',
      club: 'Dog Academy',
      discount: '-30%',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  // Données mock - Clubs boostés
  const boostedClubs = [
    {
      id: 1,
      name: 'Elite Dog Training',
      rating: 4.9,
      verified: true,
      distance: '0.8 km',
      speciality: 'Compétition',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 2,
      name: 'Champions Canins',
      rating: 4.8,
      verified: true,
      distance: '1.5 km',
      speciality: 'Agility Pro',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 3,
      name: 'Académie Canine Pro',
      rating: 4.7,
      verified: true,
      distance: '2.1 km',
      speciality: 'Éducation',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 4,
      name: 'Agility Masters',
      rating: 4.9,
      verified: true,
      distance: '3.0 km',
      speciality: 'Agility',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
  ];

  // Données mock - Notifications
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Rappel de séance demain',
      message: 'Agility Training à 14h00',
      time: '2h',
      icon: Calendar,
      color: 'text-[#41B6A6]',
      bg: 'bg-[#41B6A6]/10',
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Nouveau badge débloqué !',
      message: '10 séances complétées',
      time: '5h',
      icon: Trophy,
      color: 'text-[#E9B782]',
      bg: 'bg-[#E9B782]/10',
    },
    {
      id: 3,
      type: 'community',
      title: 'Nouveau message',
      message: 'Canin Club Paris a publié',
      time: '1j',
      icon: Heart,
      color: 'text-[#F28B6F]',
      bg: 'bg-[#F28B6F]/10',
    },
  ];

  // Données mock - Events à venir
  const upcomingEvents = [
    {
      id: 1,
      title: 'Compétition Régionale Agility',
      date: '15 Nov',
      time: '09:00',
      location: 'Paris Dog Park',
      participants: 45,
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 2,
      title: 'Journée Portes Ouvertes',
      date: '20 Nov',
      time: '10:00',
      location: 'Canin Club Paris',
      participants: 120,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 3,
      title: 'Atelier Éducation Positive',
      date: '25 Nov',
      time: '14:30',
      location: 'Dog Academy',
      participants: 30,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
  ];

  // Données mock - Futurs entraînements (RDV)
  const upcomingTrainings = [
    {
      id: 1,
      title: 'Séance Obéissance',
      club: 'Canin Club Paris',
      trainer: 'Marie Dupont',
      date: '30 Oct',
      time: '14:00',
      dog: 'Max',
      status: 'confirmed',
    },
    {
      id: 2,
      title: 'Agility Training',
      club: 'Agility Pro',
      trainer: 'Jean Martin',
      date: '2 Nov',
      time: '10:30',
      dog: 'Luna',
      status: 'confirmed',
    },
    {
      id: 3,
      title: 'Socialisation Chiot',
      club: 'Dog Academy',
      trainer: 'Sophie Bernard',
      date: '5 Nov',
      time: '16:00',
      dog: 'Max',
      status: 'pending',
    },
  ];

  // Données mock - Entraînements quotidiens IA
  const dailyAITrainings = [
    {
      id: 1,
      title: 'Exercice du jour : Assis/Couché',
      difficulty: 'Facile',
      duration: '10 min',
      completed: false,
      description: 'Renforcement du commandement de base',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: 2,
      title: 'Jeu d\'intelligence : Cherche',
      difficulty: 'Moyen',
      duration: '15 min',
      completed: true,
      description: 'Stimulation mentale et odorat',
      icon: Brain,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      id: 3,
      title: 'Socialisation : Rencontre canine',
      difficulty: 'Avancé',
      duration: '20 min',
      completed: false,
      description: 'Interaction positive avec autres chiens',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <ImageWithFallback src={profilePhoto} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-lg font-semibold">{initials}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white/70 text-xs uppercase tracking-wide">Bienvenue sur Smart Dogs</span>
              <h1 className="text-white text-xl font-semibold">{userName}</h1>
              <p className="text-white/70 text-xs">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('notifications')}
            className="relative"
          >
            <Bell className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F28B6F] rounded-full flex items-center justify-center text-[10px] text-white">
              {notifications.length}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher un club, un dresseur..."
            className="pl-12 bg-white/95 backdrop-blur-sm border-0 h-12 rounded-2xl shadow-sm"
          />
        </div>

        {user && (
          <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-4 text-white text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {roleLabel && (
              <div className="flex items-center justify-between">
                <span className="text-white/70">Type de compte</span>
                <span className="font-medium">{roleLabel}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* 1. Promotions - Bloc défilable */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-purple-600" />
              <h2 className="text-gray-800">Promotions du moment</h2>
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Nouveau
            </Badge>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
            {promotions.map((promo) => (
              <Card 
                key={promo.id} 
                className={`flex-shrink-0 w-80 overflow-hidden shadow-lg hover:shadow-xl transition-all snap-start cursor-pointer border-0 bg-gradient-to-br ${promo.color}`}
                onClick={() => onNavigate('clubs')}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-white text-purple-700 border-0 px-3 py-1">
                    {promo.discount}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="mb-1 text-white">{promo.title}</h3>
                    <p className="text-sm text-white/90 mb-2">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/80">{promo.club}</p>
                      <Gift className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 2. Clubs boostés */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h2 className="text-gray-800">Clubs Boostés</h2>
            </div>
            <button 
              onClick={() => onNavigate('clubs')}
              className="text-[#41B6A6] text-sm"
            >
              Voir tout
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
            {boostedClubs.map((club) => (
              <Card 
                key={club.id} 
                className="flex-shrink-0 w-80 overflow-hidden shadow-lg hover:shadow-xl transition-all snap-start cursor-pointer border-0 relative"
                onClick={() => onNavigate('clubs')}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Premium border glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-orange-500/20 mix-blend-overlay" />
                  
                  {/* Top badges */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 shadow-lg">
                      <Zap className="h-3 w-3 mr-1" />
                      Boosté
                    </Badge>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-white/95 text-gray-800 border-0">
                    <Star className="h-3 w-3 fill-[#E9B782] text-[#E9B782] mr-1" />
                    {club.rating}
                  </Badge>
                  
                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="flex-1 text-white">{club.name}</h3>
                      {club.verified && (
                        <CheckCircle className="h-5 w-5 text-white ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-white/90 mb-2">{club.speciality}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-4 w-4" />
                        <span>{club.distance}</span>
                      </div>
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Notifications */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#F28B6F]" />
              <h2 className="text-gray-800">Notifications</h2>
            </div>
            <button 
              onClick={() => onNavigate('notifications')}
              className="text-[#41B6A6] text-sm"
            >
              Tout voir
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <Card 
                  key={notif.id} 
                  className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate('notifications')}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${notif.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1">{notif.title}</h4>
                      <p className="text-sm text-gray-500">{notif.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{notif.time}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 4. Events à venir */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Événements à venir</h2>
            </div>
            <button 
              onClick={() => onNavigate('events')}
              className="text-[#41B6A6] text-sm"
            >
              Calendrier
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
            {upcomingEvents.map((event) => (
              <Card 
                key={event.id} 
                className="flex-shrink-0 w-64 overflow-hidden shadow-md hover:shadow-lg transition-shadow snap-start cursor-pointer border-0"
                onClick={() => onNavigate('events')}
              >
                <div className="relative h-32">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge className="bg-white/90 text-[#41B6A6] border-0 text-xs">
                      {event.date} • {event.time}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-2">{event.title}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>{event.participants} participants</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. Futurs entraînements (RDV) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#E9B782]" />
              <h2 className="text-gray-800">Mes prochaines séances</h2>
            </div>
            <button 
              onClick={() => onNavigate('booking')}
              className="text-[#41B6A6] text-sm"
            >
              Réserver
            </button>
          </div>
          <div className="space-y-3">
            {upcomingTrainings.map((training) => (
              <Card 
                key={training.id} 
                className={`p-4 shadow-sm border-0 border-l-4 ${training.status === 'confirmed' ? 'border-l-[#41B6A6]' : 'border-l-[#E9B782]'} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => onNavigate('booking')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{training.title}</h4>
                      <Badge className={`${training.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} border-0 text-xs`}>
                        {training.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{training.club}</p>
                    <p className="text-xs text-gray-400">avec {training.trainer} • {training.dog}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm ml-4">
                    <Calendar className="h-4 w-4 text-[#41B6A6]" />
                    <div className="text-right">
                      <p className="text-gray-800">{training.date}</p>
                      <p className="text-xs text-gray-500">{training.time}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. Entraînements quotidiens IA (DjanAI) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h2 className="text-gray-800">Exercices du jour</h2>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              DjanAI
            </Badge>
          </div>
          
          {/* Introduction DjanAI */}
          <Card 
            className="p-5 mb-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('djanai')}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 mb-1">Programme personnalisé</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Créez le profil de votre chien et recevez un programme d'entraînement adapté par DjanAI
                </p>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-full"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Commencer
                </Button>
              </div>
            </div>
          </Card>
          <div className="space-y-3">
            {dailyAITrainings.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <Card 
                  key={exercise.id} 
                  className={`p-4 shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer ${exercise.completed ? 'opacity-60' : ''}`}
                  onClick={() => onNavigate('djanai')}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl ${exercise.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${exercise.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{exercise.title}</h4>
                        {exercise.completed && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{exercise.description}</p>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                          {exercise.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-400">{exercise.duration}</span>
                      </div>
                    </div>
                    {!exercise.completed && (
                      <Button 
                        size="sm" 
                        className="bg-[#41B6A6] hover:bg-[#359889] rounded-full"
                        onClick={(e: { stopPropagation: () => void; }) => {
                          e.stopPropagation();
                          onNavigate('djanai');
                        }}
                      >
                        Commencer
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Bouton pour accéder au chatbot IA */}
        <Card className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white mb-1">Besoin de conseils ?</h4>
              <p className="text-sm text-white/90">Discutez avec DjanAI, votre assistant intelligent</p>
            </div>
            <Button 
              className="bg-white text-purple-600 hover:bg-white/90 rounded-full"
              onClick={() => onNavigate('community')}
            >
              Discuter
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
