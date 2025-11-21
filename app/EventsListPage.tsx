import { ArrowLeft, Calendar, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface EventsListPageProps {
  clubId: number;
  onBack: () => void;
}

export function EventsListPage({ onBack }: EventsListPageProps) {
  const events = [
    {
      id: 1,
      title: 'Balade en forêt de Fontainebleau',
      description: 'Rejoignez-nous pour une balade collective en forêt ! Une excellente occasion pour socialiser nos chiens dans un cadre naturel.',
      date: '2025-10-28',
      time: '10:00 - 13:00',
      location: 'Parking de la forêt de Fontainebleau',
      participants: 12,
      maxParticipants: 20,
      tags: ['Socialisation', 'Sortie'],
      image: 'https://images.unsplash.com/photo-1629130646965-e86223170abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 2,
      title: 'Atelier Agility Débutants',
      description: 'Session découverte de l\'agility pour les débutants. Matériel fourni, venez découvrir cette discipline ludique !',
      date: '2025-11-02',
      time: '14:00 - 16:00',
      location: 'Club - Terrain d\'agility',
      participants: 8,
      maxParticipants: 10,
      tags: ['Agility', 'Débutant', 'Sport'],
      image: 'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 3,
      title: 'Journée Portes Ouvertes',
      description: 'Venez découvrir notre club avec vos amis et famille ! Démonstrations, initiations et rencontres avec nos éducateurs.',
      date: '2025-11-10',
      time: '10:00 - 18:00',
      location: 'Club - Tous les terrains',
      participants: 45,
      maxParticipants: 100,
      tags: ['Découverte', 'Démonstration', 'Tout public'],
      image: 'https://images.unsplash.com/photo-1754951762703-6bb3c65c4a34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
    {
      id: 4,
      title: 'Stage intensif obéissance',
      description: 'Stage de 3 jours pour perfectionner l\'obéissance de votre chien. Niveau intermédiaire requis.',
      date: '2025-11-15',
      time: '9:00 - 17:00',
      location: 'Club - Terrain principal',
      participants: 6,
      maxParticipants: 8,
      tags: ['Obéissance', 'Stage', 'Intensif'],
      image: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white mb-2">Événements</h1>
        <p className="text-white/80">Prochaines activités du club</p>
      </div>

      {/* Events List */}
      <div className="px-4 py-6 space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-gray-200">
            <div className="flex gap-4 p-4">
              {/* Event Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-800 line-clamp-1">{event.title}</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {event.description}
                </p>

                {/* Date & Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[#41B6A6]" />
                    <span className="capitalize">{formatDate(event.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[#41B6A6]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#41B6A6]" />
                    <span>{event.participants}/{event.maxParticipants}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 text-[#41B6A6] mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-[#41B6A6]/30 text-[#41B6A6] text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
