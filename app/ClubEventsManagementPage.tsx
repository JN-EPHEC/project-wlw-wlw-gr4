import { ArrowLeft, Calendar, Clock, Edit, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface ClubEventsManagementPageProps {
  onBack: () => void;
}

export function ClubEventsManagementPage({ onBack }: ClubEventsManagementPageProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    type: '',
  });

  const events = [
    {
      id: 1,
      title: 'Balade en forêt de Fontainebleau',
      description: 'Grande balade canine en forêt avec pique-nique. Ouvert à tous les niveaux.',
      date: 'Sam 28 Oct',
      time: '10:00',
      location: 'Parking de la forêt',
      participants: 12,
      maxParticipants: 20,
      type: 'social',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Compétition d\'agility inter-clubs',
      description: 'Participez à notre compétition amicale d\'agility. Inscription requise.',
      date: 'Dim 5 Nov',
      time: '14:00',
      location: 'Terrain d\'agility',
      participants: 8,
      maxParticipants: 15,
      type: 'competition',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Atelier comportement canin',
      description: 'Atelier sur la communication canine et la résolution de problèmes comportementaux.',
      date: 'Mer 8 Nov',
      time: '18:30',
      location: 'Salle de formation',
      participants: 15,
      maxParticipants: 15,
      type: 'training',
      status: 'full',
    },
    {
      id: 4,
      title: 'Journée portes ouvertes',
      description: 'Découvrez notre club et nos activités. Démonstrations et essais gratuits.',
      date: 'Sam 11 Nov',
      time: '10:00',
      location: 'Club Canin Paris',
      participants: 0,
      maxParticipants: 50,
      type: 'openday',
      status: 'upcoming',
    },
  ];

  const handleCreateEvent = () => {
    console.log('Creating event:', newEvent);
    setShowCreateDialog(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      type: '',
    });
  };


  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'social':
        return <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Social</Badge>;
      case 'competition':
        return <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Compétition</Badge>;
      case 'training':
        return <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">Formation</Badge>;
      case 'openday':
        return <Badge className="bg-green-100 text-green-700 border-0 text-xs">Portes ouvertes</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header - Turquoise */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-2">Événements</h1>
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Gérez vos événements</span>
            </div>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-white text-[#41B6A6] hover:bg-white/90 rounded-full shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvel événement</DialogTitle>
                <DialogDescription>
                  Créez un événement pour votre communauté.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Titre de l'événement</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Balade en forêt..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Décrivez votre événement..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Heure</Label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label>Lieu</Label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Ex: Parking de la forêt..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Type d'événement</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value: string) => setNewEvent({ ...newEvent, type: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="competition">Compétition</SelectItem>
                      <SelectItem value="training">Formation</SelectItem>
                      <SelectItem value="openday">Portes ouvertes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nombre de participants max</Label>
                  <Input
                    type="number"
                    value={newEvent.maxParticipants}
                    onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                    placeholder="Ex: 20"
                    className="mt-1.5"
                  />
                </div>
                <Button
                  onClick={handleCreateEvent}
                  className="w-full bg-[#41B6A6] hover:bg-[#359889]"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Créer l'événement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <Card className="p-3 bg-white/95 border-0 shadow-md">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-gray-800 mb-0">{events.length}</p>
              <p className="text-xs text-gray-600">Événements</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{events.filter(e => e.status === 'upcoming').length}</p>
              <p className="text-xs text-gray-600">À venir</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{events.reduce((sum, e) => sum + e.participants, 0)}</p>
              <p className="text-xs text-gray-600">Inscrits</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-[#41B6A6]" />
          <h2 className="text-gray-800">Événements à venir</h2>
        </div>

        {events.map((event) => (
          <Card
            key={event.id}
            className={`p-4 shadow-sm hover:shadow-md transition-all ${
              event.status === 'full' ? 'border-2 border-orange-300 bg-orange-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 bg-[#41B6A6]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs text-[#41B6A6]">
                  {event.date.split(' ')[0]}
                </span>
                <span className="text-[#41B6A6]">
                  {event.date.split(' ')[1]}
                </span>
                <span className="text-xs text-[#41B6A6]">
                  {event.date.split(' ')[2]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-gray-800">{event.title}</h3>
                  {getEventTypeBadge(event.type)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {event.participants}/{event.maxParticipants} participants
                    </span>
                    {event.status === 'full' && (
                      <Badge className="bg-orange-500 text-white border-0 text-xs ml-2">
                        Complet
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1 h-8">
                <Users className="h-3 w-3 mr-1" />
                Participants
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8">
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
