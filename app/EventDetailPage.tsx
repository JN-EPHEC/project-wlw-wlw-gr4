import { AlertCircle, ArrowLeft, Award, BadgeCheck, Calendar, CheckCircle, Clock, Euro, Heart, MapPin, Star, Target, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface EventDetailPageProps {
  eventId: number;
  onBack: () => void;
  onRegister: (eventId: number) => void;
}

export function EventDetailPage({ eventId, onBack, onRegister }: EventDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - in real app, this would come from props or API based on eventId
  const event = {
    id: eventId,
    name: 'Compétition Régionale Agility',
    date: '15 Novembre 2024',
    time: '09:00 - 17:00',
    location: 'Paris Dog Park',
    address: '123 Rue du Parc, 75015 Paris',
    distance: '2.0 km',
    headerImage: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    organizer: {
      name: 'Agility Pro',
      verified: true,
      rating: 4.9,
      logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    description: 'Grande compétition régionale d\'agility ouverte à tous les niveaux. Venez participer ou simplement assister à cette journée exceptionnelle où les meilleurs binômes chien-maître de la région se rencontrent pour des épreuves spectaculaires.',
    participants: {
      registered: 45,
      max: 80,
    },
    price: {
      participant: 35,
      spectator: 10,
    },
    category: 'Compétition',
    level: 'Tous niveaux',
    ageMin: 'Chiens de 18 mois minimum',
    program: [
      { time: '09:00', activity: 'Accueil et inscription' },
      { time: '09:30', activity: 'Échauffement et reconnaissance du parcours' },
      { time: '10:30', activity: 'Début des épreuves - Catégorie Débutants' },
      { time: '12:30', activity: 'Pause déjeuner' },
      { time: '14:00', activity: 'Épreuves - Catégorie Intermédiaire' },
      { time: '15:30', activity: 'Épreuves - Catégorie Expert' },
      { time: '16:45', activity: 'Remise des prix' },
    ],
    requirements: [
      'Certificat de vaccination à jour',
      'Assurance responsabilité civile',
      'Chien sociable avec les autres animaux',
      'Connaissances de base en agility recommandées',
    ],
    amenities: [
      'Parking gratuit',
      'Restauration sur place',
      'Espace d\'échauffement',
      'Vétérinaire présent',
      'Trophées et récompenses',
    ],
    photos: [
      'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    ],
  };

  const spotsRemaining = event.participants.max - event.participants.registered;

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Content with scrollable header */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Header with Image */}
        <div className="relative h-64 flex-shrink-0">
          <ImageWithFallback
            src={event.headerImage}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-800" />
          </Button>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-lg"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-[#F28B6F] text-[#F28B6F]' : 'text-gray-800'
              } transition-colors`}
            />
          </Button>

          {/* Event Badge */}
          <Badge className="absolute top-20 left-4 bg-purple-600 text-white border-0">
            <Calendar className="h-3 w-3 mr-1" />
            Événement
          </Badge>

          {/* Event Name */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white mb-2">{event.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-white/90">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{event.time}</span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{event.distance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="px-4 py-6 space-y-6">
          
          {/* Organizer Card */}
          <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/5 to-white">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={event.organizer.logo} />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-gray-800">Organisé par {event.organizer.name}</h4>
                  {event.organizer.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#41B6A6]" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-[#E9B782] text-[#E9B782]" />
                  <span className="text-sm text-gray-600">{event.organizer.rating}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Availability Badge */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-white rounded-2xl border border-purple-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-purple-600" />
                <h4 className="text-gray-800">Participants</h4>
              </div>
              <p className="text-sm text-gray-600">
                {event.participants.registered} / {event.participants.max} inscrits
              </p>
            </div>
            <div className="text-right">
              <Badge className={`${
                spotsRemaining <= 10 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              } border-0`}>
                {spotsRemaining} places restantes
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <section>
            <h2 className="text-gray-800 mb-3">À propos de l'événement</h2>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </section>

          <Separator />

          {/* Event Details */}
          <section>
            <h2 className="text-gray-800 mb-4">Détails</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Catégorie</p>
                  <p className="text-gray-800">{event.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Niveau</p>
                  <p className="text-gray-800">{event.level}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Âge minimum</p>
                  <p className="text-gray-800">{event.ageMin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Lieu</p>
                  <p className="text-gray-800">{event.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.address}</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tarifs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Euro className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Tarifs</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-[#41B6A6]/20">
                <p className="text-sm text-gray-500 mb-2">Participant</p>
                <p className="text-2xl text-[#41B6A6]">{event.price.participant}€</p>
              </Card>
              <Card className="p-4 border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Spectateur</p>
                <p className="text-2xl text-gray-600">{event.price.spectator}€</p>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Programme */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Programme de la journée</h2>
            </div>
            <div className="space-y-3">
              {event.program.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-16 flex-shrink-0">
                    <Badge variant="outline" className="border-[#41B6A6]/30 text-[#41B6A6] text-xs">
                      {item.time}
                    </Badge>
                  </div>
                  <p className="text-gray-700 flex-1">{item.activity}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Prérequis */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Prérequis</h2>
            </div>
            <div className="space-y-2">
              {event.requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#41B6A6] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">{req}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Commodités */}
          <section>
            <h2 className="text-gray-800 mb-4">Ce qui est inclus</h2>
            <div className="grid grid-cols-2 gap-2">
              {event.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Photos de l'événement */}
          <section>
            <h2 className="text-gray-800 mb-4">Photos</h2>
            <div className="grid grid-cols-2 gap-3">
              {event.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 max-w-[393px] mx-auto bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <Button
          onClick={() => onRegister(eventId)}
          className="w-full bg-purple-600 hover:bg-purple-700 rounded-2xl h-14"
          disabled={spotsRemaining === 0}
        >
          {spotsRemaining === 0 ? (
            <>Complet - Liste d'attente</>
          ) : (
            <>
              <Trophy className="h-5 w-5 mr-2" />
              S'inscrire à l'événement
            </>
          )}
        </Button>
      </div>
    </div>
  );
}