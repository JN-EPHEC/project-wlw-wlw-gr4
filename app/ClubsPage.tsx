import { Award, BadgeCheck, Calendar, Heart, Home, MapPin, Search, SlidersHorizontal, Sparkles, Star, Target, Trophy, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';

interface ClubsPageProps {
  onClubClick?: (clubId: number) => void;
  onNavigate?: (page: string) => void;
}

export function ClubsPage({ onClubClick, onNavigate }: ClubsPageProps) {
  const [favorites, setFavorites] = useState<number[]>([1, 2, 201]); // IDs des clubs/events favoris
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // États des filtres
  const [filterDistance, setFilterDistance] = useState([10]);
  const [filterPrice, setFilterPrice] = useState<string[]>(['€', '€€', '€€€']);
  const [filterSpecialties, setFilterSpecialties] = useState<string[]>([]);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const quickFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'clubs', label: 'Clubs' },
    { id: 'trainers', label: 'Dresseurs' },
    { id: 'events', label: 'Événements' },
  ];

  const specialties = [
    { id: 'dressage', label: 'Dressage' },
    { id: 'agility', label: 'Agility' },
    { id: 'obedience', label: 'Obéissance' },
    { id: 'puppies', label: 'Chiots' },
    { id: 'behavior', label: 'Comportement' },
    { id: 'competition', label: 'Compétition' },
  ];

  // Données mock - Clubs boostés (section défilable)
  const boostedClubs = [
    {
      id: 101,
      type: 'club' as const,
      name: 'Elite Dog Training',
      rating: 4.9,
      reviews: 245,
      distance: '0.8 km',
      verified: true,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Compétition',
    },
    {
      id: 102,
      type: 'club' as const,
      name: 'Champions Canins',
      rating: 4.8,
      reviews: 189,
      distance: '1.5 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility Pro',
    },
    {
      id: 103,
      type: 'club' as const,
      name: 'Académie Canine Pro',
      rating: 4.7,
      reviews: 156,
      distance: '2.1 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Éducation',
    },
    {
      id: 104,
      type: 'club' as const,
      name: 'Agility Masters',
      rating: 4.9,
      reviews: 201,
      distance: '3.0 km',
      verified: true,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility',
    },
  ];

  // Données mock - Dresseurs à domicile (section défilable)
  const homeTrainers = [
    {
      id: 301,
      type: 'trainer' as const,
      name: 'Marie Dupont',
      rating: 4.9,
      reviews: 87,
      distance: '1.2 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Éducation positive',
      experience: '8 ans',
    },
    {
      id: 302,
      type: 'trainer' as const,
      name: 'Jean Martin',
      rating: 4.8,
      reviews: 124,
      distance: '0.9 km',
      verified: true,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Comportement',
      experience: '12 ans',
    },
    {
      id: 303,
      type: 'trainer' as const,
      name: 'Sophie Bernard',
      rating: 4.7,
      reviews: 65,
      distance: '2.3 km',
      verified: true,
      price: '€',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Chiots',
      experience: '5 ans',
    },
    {
      id: 304,
      type: 'trainer' as const,
      name: 'Thomas Leroy',
      rating: 4.9,
      reviews: 142,
      distance: '1.8 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility',
      experience: '10 ans',
    },
  ];

  // Données mock - Événements cette semaine (section défilable)
  const weekEvents = [
    {
      id: 201,
      type: 'event' as const,
      name: 'Compétition Régionale Agility',
      date: '15 Nov',
      time: '09:00',
      location: 'Paris Dog Park',
      participants: 45,
      distance: '2.0 km',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      organizer: 'Agility Pro',
    },
    {
      id: 202,
      type: 'event' as const,
      name: 'Journée Portes Ouvertes',
      date: '20 Nov',
      time: '10:00',
      location: 'Canin Club Paris',
      participants: 120,
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      organizer: 'Canin Club Paris',
    },
    {
      id: 203,
      type: 'event' as const,
      name: 'Atelier Éducation Positive',
      date: '25 Nov',
      time: '14:30',
      location: 'Dog Academy',
      participants: 30,
      distance: '3.5 km',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      organizer: 'DogSchool Expert',
    },
    {
      id: 204,
      type: 'event' as const,
      name: 'Stage Weekend Agility',
      date: '28 Nov',
      time: '08:00',
      location: 'Agility Masters',
      participants: 25,
      distance: '4.1 km',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      organizer: 'Agility Masters',
    },
  ];

  // Données mock - Clubs près de vous (section défilable)
  const nearbyClubs = [
    {
      id: 1,
      type: 'club' as const,
      name: 'Canin Club Paris',
      rating: 4.8,
      reviews: 127,
      distance: '1.2 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Dressage',
    },
    {
      id: 2,
      type: 'club' as const,
      name: 'Agility Pro',
      rating: 4.9,
      reviews: 89,
      distance: '2.5 km',
      verified: true,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1631516378357-f87aa5d25769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Sport Canin',
    },
    {
      id: 3,
      type: 'club' as const,
      name: 'Les Amis des Chiens',
      rating: 4.6,
      reviews: 56,
      distance: '3.8 km',
      verified: false,
      price: '€',
      image: 'https://images.unsplash.com/photo-1759679817345-dd13e746feb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Chiots',
    },
    {
      id: 4,
      type: 'club' as const,
      name: 'DogSchool Expert',
      rating: 4.7,
      reviews: 94,
      distance: '4.2 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Comportement',
    },
  ];

  // Données mock - Nouveaux clubs (section défilable)
  const newClubs = [
    {
      id: 401,
      type: 'club' as const,
      name: 'Dog Academy Plus',
      rating: 4.5,
      reviews: 12,
      distance: '2.8 km',
      verified: false,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Obéissance',
      isNew: true,
    },
    {
      id: 402,
      type: 'club' as const,
      name: 'Puppy Paradise',
      rating: 4.8,
      reviews: 23,
      distance: '3.2 km',
      verified: true,
      price: '€',
      image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Socialisation',
      isNew: true,
    },
    {
      id: 403,
      type: 'club' as const,
      name: 'K9 Training Center',
      rating: 4.6,
      reviews: 18,
      distance: '5.1 km',
      verified: false,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Protection',
      isNew: true,
    },
  ];

  // Données mock - Spécialité Agility (section défilable)
  const agilityClubs = [
    {
      id: 501,
      type: 'club' as const,
      name: 'Agility Champions',
      rating: 4.9,
      reviews: 156,
      distance: '1.8 km',
      verified: true,
      price: '€€€',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility Pro',
    },
    {
      id: 502,
      type: 'club' as const,
      name: 'Speed Dogs',
      rating: 4.7,
      reviews: 98,
      distance: '3.5 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility',
    },
    {
      id: 503,
      type: 'club' as const,
      name: 'Jumping Dogs',
      rating: 4.8,
      reviews: 134,
      distance: '4.7 km',
      verified: true,
      price: '€€',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialty: 'Agility & Sport',
    },
  ];

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Get all items for favorites
  const allItems = [...boostedClubs, ...homeTrainers, ...weekEvents, ...nearbyClubs, ...newClubs, ...agilityClubs];
  const favoriteItems = allItems.filter(item => favorites.includes(item.id));

  // Toggle specialty filter
  const toggleSpecialty = (specialtyId: string) => {
    if (filterSpecialties.includes(specialtyId)) {
      setFilterSpecialties(filterSpecialties.filter(s => s !== specialtyId));
    } else {
      setFilterSpecialties([...filterSpecialties, specialtyId]);
    }
  };

  // Toggle price filter
  const togglePrice = (price: string) => {
    if (filterPrice.includes(price)) {
      setFilterPrice(filterPrice.filter(p => p !== price));
    } else {
      setFilterPrice([...filterPrice, price]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterDistance([10]);
    setFilterPrice(['€', '€€', '€€€']);
    setFilterSpecialties([]);
    setFilterMinRating(0);
    setFilterVerifiedOnly(false);
  };

  // Render club card (horizontal scroll format)
  const renderClubCard = (club: any, isBoosted = false) => (
    <Card
      key={club.id}
      onClick={() => onClubClick?.(club.id)}
      className="flex-shrink-0 w-64 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-0 snap-start"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        {isBoosted && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            Boosté
          </Badge>
        )}
        {club.isNew && (
          <Badge className="absolute top-2 left-2 bg-purple-600 text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            Nouveau
          </Badge>
        )}
        {club.verified && !isBoosted && !club.isNew && (
          <Badge className="absolute top-2 left-2 bg-[#41B6A6] text-white border-0 p-1">
            <BadgeCheck className="h-3 w-3" />
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(club.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Heart
            className={`h-4 w-4 ${
              favorites.includes(club.id)
                ? 'fill-[#F28B6F] text-[#F28B6F]'
                : 'text-gray-400'
            } transition-colors`}
          />
        </button>
      </div>
      <div className="p-3">
        <h4 className="mb-1">{club.name}</h4>
        <p className="text-xs text-gray-500 mb-2">{club.specialty}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#E9B782] text-[#E9B782]" />
            <span className="text-sm">{club.rating}</span>
            <span className="text-xs text-gray-400">({club.reviews})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{club.distance}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{club.price}</span>
          {club.verified && (
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0 text-xs">
              Verified
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );

  // Render trainer card (horizontal scroll format)
  const renderTrainerCard = (trainer: any) => (
    <Card
      key={trainer.id}
      onClick={() => onClubClick?.(trainer.id)}
      className="flex-shrink-0 w-64 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-0 snap-start"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={trainer.image}
          alt={trainer.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-[#E9B782] text-white border-0">
          <Home className="h-3 w-3 mr-1" />
          À domicile
        </Badge>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(trainer.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Heart
            className={`h-4 w-4 ${
              favorites.includes(trainer.id)
                ? 'fill-[#F28B6F] text-[#F28B6F]'
                : 'text-gray-400'
            } transition-colors`}
          />
        </button>
      </div>
      <div className="p-3">
        <h4 className="mb-1">{trainer.name}</h4>
        <p className="text-xs text-gray-500 mb-2">{trainer.specialty}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#E9B782] text-[#E9B782]" />
            <span className="text-sm">{trainer.rating}</span>
            <span className="text-xs text-gray-400">({trainer.reviews})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{trainer.distance}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{trainer.experience} d'exp.</span>
          <span className="text-xs text-gray-400">{trainer.price}</span>
        </div>
      </div>
    </Card>
  );

  // Render event card (horizontal scroll format)
  const renderEventCard = (event: any) => (
    <Card
      key={event.id}
      onClick={() => onClubClick?.(event.id)}
      className="flex-shrink-0 w-64 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border-0 snap-start bg-gradient-to-br from-purple-50 to-white"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-purple-600 text-white border-0">
          <Calendar className="h-3 w-3 mr-1" />
          Event
        </Badge>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(event.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
        >
          <Heart
            className={`h-4 w-4 ${
              favorites.includes(event.id)
                ? 'fill-[#F28B6F] text-[#F28B6F]'
                : 'text-gray-400'
            } transition-colors`}
          />
        </button>
      </div>
      <div className="p-3">
        <h4 className="mb-1">{event.name}</h4>
        <p className="text-xs text-purple-600 mb-2">par {event.organizer}</p>
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <Calendar className="h-3 w-3" />
          <span>{event.date} à {event.time}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <MapPin className="h-3 w-3" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="h-3 w-3" />
          <span>{event.participants} participants</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col h-full bg-white pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <h1 className="text-white mb-6">Découvrir</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher clubs, dresseurs, événements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white border-0 h-12 rounded-2xl shadow-sm"
          />
        </div>
      </div>

      {/* Leaderboards Section */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card 
            onClick={() => onNavigate?.('teacherLeaderboard')}
            className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-[#E9B782]/10 to-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-[#E9B782]" />
              <h4 className="text-gray-800">Top Éducateurs</h4>
            </div>
            <p className="text-xs text-gray-600">Classement du mois</p>
          </Card>
          <Card 
            onClick={() => onNavigate?.('clubLeaderboard')}
            className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-100 to-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <h4 className="text-gray-800">Inter-Clubs</h4>
            </div>
            <p className="text-xs text-gray-600">Compétition amicale</p>
          </Card>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 rounded-full ${
                selectedFilter === filter.id
                  ? 'bg-[#41B6A6] hover:bg-[#359889]'
                  : 'border-gray-200 hover:border-[#41B6A6]'
              }`}
            >
              {filter.label}
            </Button>
          ))}
          
          {/* Advanced Filters Button */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 rounded-full border-gray-200 gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>Filtres avancés</SheetTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-[#41B6A6]"
                  >
                    Réinitialiser
                  </Button>
                </div>
                <SheetDescription>
                  Affinez votre recherche de clubs, dresseurs et événements
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Distance Filter */}
                <div>
                  <Label>Distance max : {filterDistance[0]} km</Label>
                  <Slider
                    value={filterDistance}
                    onValueChange={setFilterDistance}
                    max={20}
                    min={1}
                    step={1}
                    className="mt-3"
                  />
                </div>

                <Separator />

                {/* Price Filter */}
                <div>
                  <Label>Prix</Label>
                  <div className="flex gap-3 mt-3">
                    {['€', '€€', '€€€'].map((price) => (
                      <Button
                        key={price}
                        variant={filterPrice.includes(price) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => togglePrice(price)}
                        className={`flex-1 ${
                          filterPrice.includes(price)
                            ? 'bg-[#41B6A6] hover:bg-[#359889]'
                            : ''
                        }`}
                      >
                        {price}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Specialties Filter */}
                <div>
                  <Label>Spécialités</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {specialties.map((specialty) => (
                      <div key={specialty.id} className="flex items-center gap-2">
                        <Checkbox
                          id={specialty.id}
                          checked={filterSpecialties.includes(specialty.id)}
                          onCheckedChange={() => toggleSpecialty(specialty.id)}
                        />
                        <label
                          htmlFor={specialty.id}
                          className="text-sm cursor-pointer"
                        >
                          {specialty.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div>
                  <Label>Note minimum : {filterMinRating > 0 ? `${filterMinRating}/5` : 'Toutes'}</Label>
                  <div className="flex gap-2 mt-3">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={filterMinRating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterMinRating(rating)}
                        className={`flex-1 ${
                          filterMinRating === rating
                            ? 'bg-[#41B6A6] hover:bg-[#359889]'
                            : ''
                        }`}
                      >
                        {rating === 0 ? 'Toutes' : `${rating}+`}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Verified Only */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Clubs vérifiés uniquement</Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Smart Dogs Verified
                    </p>
                  </div>
                  <Checkbox
                    checked={filterVerifiedOnly}
                    onCheckedChange={(checked) => setFilterVerifiedOnly(checked === true)}
                  />
                </div>
              </div>

              <div className="mt-6 pb-6">
                <Button
                  className="w-full bg-[#41B6A6] hover:bg-[#359889]"
                  onClick={() => setFilterOpen(false)}
                >
                  Appliquer les filtres
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Content sections */}
      <div>
        
        {/* Favorites Section */}
        {favoriteItems.length > 0 && (
          <section className="py-6">
            <div className="px-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-[#F28B6F] text-[#F28B6F]" />
                <h2 className="text-gray-800">Mes favoris</h2>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
              {favoriteItems.map((item) => {
                if (item.type === 'club') return renderClubCard(item);
                if (item.type === 'trainer') return renderTrainerCard(item);
                if (item.type === 'event') return renderEventCard(item);
                return null;
              })}
            </div>
          </section>
        )}

        {/* Boosted Clubs Section */}
        <section className="py-6 bg-gradient-to-b from-orange-50/30 to-white">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h2 className="text-gray-800">Clubs Boostés</h2>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 text-xs">
              Premium
            </Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {boostedClubs.map((club) => renderClubCard(club, true))}
          </div>
        </section>

        {/* Home Trainers Section */}
        <section className="py-6">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#E9B782]" />
              <h2 className="text-gray-800">Dresseurs à domicile</h2>
            </div>
            <button className="text-[#41B6A6] text-sm">Voir tout</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {homeTrainers.map((trainer) => renderTrainerCard(trainer))}
          </div>
        </section>

        {/* Events This Week Section */}
        <section className="py-6 bg-gradient-to-b from-purple-50/30 to-white">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h2 className="text-gray-800">Événements cette semaine</h2>
            </div>
            <button className="text-[#41B6A6] text-sm">Calendrier</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {weekEvents.map((event) => renderEventCard(event))}
          </div>
        </section>

        {/* Nearby Clubs Section */}
        <section className="py-6">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Clubs près de vous</h2>
            </div>
            <button className="text-[#41B6A6] text-sm">Voir tout</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {nearbyClubs.map((club) => renderClubCard(club))}
          </div>
        </section>

        {/* New Clubs Section */}
        <section className="py-6 bg-gradient-to-b from-purple-50/30 to-white">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-gray-800">Nouveaux clubs</h2>
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
              Nouveau
            </Badge>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {newClubs.map((club) => renderClubCard(club))}
          </div>
        </section>

        {/* Agility & Sport Section */}
        <section className="py-6 pb-8">
          <div className="px-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Agility & Sport canin</h2>
            </div>
            <button className="text-[#41B6A6] text-sm">Voir tout</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 px-4 snap-x scrollbar-hide">
            {agilityClubs.map((club) => renderClubCard(club))}
          </div>
        </section>
      </div>
    </div>
  );
}
