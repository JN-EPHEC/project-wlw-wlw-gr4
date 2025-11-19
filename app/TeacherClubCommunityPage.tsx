import { useState } from 'react';
import { ArrowLeft, Hash, Calendar, Megaphone, Plus, Settings, Users as UsersIcon, MoreVertical, Pin, Trash2, MapPin, Clock, CheckCircle, Send, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface TeacherClubCommunityPageProps {
  clubId?: number;
  onBack?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export function TeacherClubCommunityPage({ clubId = 1, onBack, onNavigate }: TeacherClubCommunityPageProps) {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showAddChannelDialog, setShowAddChannelDialog] = useState(false);
  const [showCreateAnnouncementDialog, setShowCreateAnnouncementDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showAnnouncementDetailDialog, setShowAnnouncementDetailDialog] = useState(false);
  const [showEventDetailDialog, setShowEventDetailDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Form states for new announcement
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [newAnnouncementPinned, setNewAnnouncementPinned] = useState(false);
  
  // Form states for new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventMaxParticipants, setNewEventMaxParticipants] = useState('');
  
  // Form states for new channel
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');

  // Info du club
  const clubInfo = {
    id: clubId,
    name: 'Club Canin Lyon Sud',
    location: 'Lyon 8ème',
    members: 156,
  };

  // Permissions de l'éducateur dans ce club
  const permissions = {
    canPostAnnouncements: true,
    canCreateEvents: true,
    canManageChannels: true,
    canManageMembers: true, // Si le club autorise
  };

  // Annonces
  const announcements = [
    {
      id: 1,
      author: 'Sophie Martin',
      role: 'Éducatrice',
      date: '2024-11-03',
      time: '14:30',
      content: 'Rappel : Le cours d\'agility de demain est maintenu malgré la météo. N\'oubliez pas les friandises ! 🐕',
      fullContent: 'Rappel : Le cours d\'agility de demain est maintenu malgré la météo. N\'oubliez pas les friandises ! 🐕\n\nPensez à apporter :\n- Des friandises de haute valeur\n- Une laisse de 2m minimum\n- De l\'eau pour votre chien\n- Une attitude positive !\n\nLe cours aura lieu comme prévu à 14h30 sur le terrain principal. En cas de forte pluie, nous nous réfugierons sous le hangar pour la partie théorique.',
      isPinned: true,
      likes: 12,
      comments: 5,
    },
    {
      id: 2,
      author: 'Direction du club',
      role: 'Admin',
      date: '2024-11-01',
      time: '10:00',
      content: 'Nouvelles règles du club : Merci de toujours ramasser les déjections de vos chiens et de respecter les horaires des cours.',
      fullContent: 'Nouvelles règles du club :\n\n1. Ramassage des déjections : Merci de toujours ramasser les déjections de vos chiens. Des sacs sont disponibles à l\'entrée.\n\n2. Respect des horaires : Les cours commencent à l\'heure précise. Merci d\'arriver 10 minutes en avance.\n\n3. Sécurité : Tous les chiens doivent être tenus en laisse en dehors des zones d\'entraînement.\n\n4. Vaccination : Assurez-vous que les vaccins de votre chien sont à jour.\n\nMerci de votre coopération !',
      isPinned: true,
      likes: 28,
      comments: 12,
    },
    {
      id: 3,
      author: 'Marc Dupont',
      role: 'Éducateur',
      date: '2024-10-30',
      time: '16:45',
      content: 'Excellente session aujourd\'hui avec le groupe débutant ! Bravo à tous les participants 🎉',
      fullContent: 'Excellente session aujourd\'hui avec le groupe débutant ! Bravo à tous les participants 🎉\n\nNous avons travaillé sur :\n- Le rappel au pied\n- La position assise\n- Le "reste" avec distraction\n\nTous les chiens ont fait d\'énormes progrès ! Continuez à pratiquer ces exercices à la maison, même 5 minutes par jour font la différence.\n\nÀ la semaine prochaine pour la suite !',
      isPinned: false,
      likes: 15,
      comments: 8,
    },
  ];

  // Événements à venir
  const upcomingEvents = [
    {
      id: 1,
      title: 'Concours d\'Agility',
      date: '2024-11-15',
      time: '09:00',
      location: 'Terrain principal',
      participants: 24,
      maxParticipants: 30,
      description: 'Grand concours d\'agility ouvert à tous les niveaux. Venez nombreux pour encourager nos participants !',
      fullDescription: 'Grand concours d\'agility ouvert à tous les niveaux !\n\n📋 Programme de la journée :\n- 09h00 : Accueil et échauffement\n- 10h00 : Catégorie débutants\n- 12h00 : Pause déjeuner (food truck sur place)\n- 14h00 : Catégorie intermédiaires\n- 16h00 : Catégorie avancés\n- 18h00 : Remise des prix\n\n🏆 Récompenses :\n- Médailles pour les 3 premiers de chaque catégorie\n- Lots surprises pour tous les participants\n\n💰 Inscription : 15€ par chien\n\nVenez nombreux pour encourager nos participants et passer une excellente journée canine !',
      organizer: 'Sophie Martin',
      category: 'Sport canin',
      price: '15€',
      requirements: 'Vaccins à jour, certificat vétérinaire',
    },
    {
      id: 2,
      title: 'Journée portes ouvertes',
      date: '2024-11-20',
      time: '14:00',
      location: 'Club entier',
      participants: 45,
      maxParticipants: 100,
      description: 'Découvrez notre club et toutes nos activités. Ateliers gratuits et démonstrations toute l\'après-midi !',
      fullDescription: 'Journée portes ouvertes - Découvrez le Club Canin Lyon Sud !\n\n🎯 Au programme :\n- Démonstrations d\'agility\n- Ateliers d\'éducation de base (gratuits)\n- Stands d\'information sur les différentes disciplines\n- Rencontre avec nos éducateurs\n- Espace jeux pour les chiens\n- Boutique éphémère (accessoires, friandises)\n\n👨‍👩‍👧‍👦 Pour toute la famille :\n- Animations pour les enfants\n- Buvette et petite restauration\n- Tombola avec de nombreux lots à gagner\n\n💡 Informations pratiques :\n- Entrée gratuite\n- Parking disponible\n- Chiens tenus en laisse obligatoire\n- Possibilité de s\'inscrire pour la saison sur place\n\nVenez découvrir l\'univers passionnant de l\'éducation canine !',
      organizer: 'Direction du club',
      category: 'Événement public',
      price: 'Gratuit',
      requirements: 'Aucun prérequis',
    },
  ];

  // Channels de discussion
  const channels = [
    { id: 1, name: 'général', unread: 3, description: 'Discussion générale' },
    { id: 2, name: 'conseils-education', unread: 0, description: 'Conseils et astuces' },
    { id: 3, name: 'agility', unread: 1, description: 'Tout sur l\'agility' },
    { id: 4, name: 'comportement', unread: 0, description: 'Questions comportementales' },
  ];

  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', newAnnouncementContent);
    setShowCreateAnnouncementDialog(false);
    setNewAnnouncementContent('');
    setNewAnnouncementPinned(false);
  };

  const handleCreateEvent = () => {
    console.log('Creating event:', {
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDescription,
      maxParticipants: newEventMaxParticipants,
    });
    setShowCreateEventDialog(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    setNewEventDescription('');
    setNewEventMaxParticipants('');
  };

  const handleCreateChannel = () => {
    console.log('Creating channel:', { name: newChannelName, description: newChannelDescription });
    setShowAddChannelDialog(false);
    setNewChannelName('');
    setNewChannelDescription('');
  };

  const handleAnnouncementClick = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementDetailDialog(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDetailDialog(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-white">{clubInfo.name}</h2>
            <p className="text-white/80 text-sm mt-0.5">{clubInfo.members} membres</p>
          </div>
          {permissions.canManageMembers && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => onNavigate?.('teacher-club-members', { clubId })}
            >
              <UsersIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-white/20">
            <TabsTrigger 
              value="announcements"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F28B6F]"
            >
              <Megaphone className="h-4 w-4 mr-1" />
              Annonces
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F28B6F]"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Événements
            </TabsTrigger>
            <TabsTrigger 
              value="channels"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F28B6F]"
            >
              <Hash className="h-4 w-4 mr-1" />
              Channels
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} className="w-full">
          {/* Announcements Tab */}
          <TabsContent value="announcements" className="px-4 py-4 space-y-3 mt-0">
            {permissions.canPostAnnouncements && (
              <Button
                className="w-full bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
                onClick={() => setShowCreateAnnouncementDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle annonce
              </Button>
            )}

            <div className="space-y-3">
              {announcements.map((announcement) => (
                <Card 
                  key={announcement.id}
                  className={`p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${announcement.isPinned ? 'border-l-4 border-l-[#F28B6F]' : ''}`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white shrink-0">
                      {announcement.author.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-800">{announcement.author}</h4>
                            <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0">
                              {announcement.role}
                            </Badge>
                            {announcement.isPinned && (
                              <Pin className="h-3 w-3 text-[#F28B6F]" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(announcement.date).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long' 
                            })} à {announcement.time}
                          </p>
                        </div>
                        {permissions.canPostAnnouncements && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Pin className="h-4 w-4 mr-2" />
                                {announcement.isPinned ? 'Détacher' : 'Épingler'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{announcement.content}</p>

                      <div className="text-xs text-gray-500">
                        ❤️ {announcement.likes} j'aime
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="px-4 py-4 space-y-3 mt-0">
            {permissions.canCreateEvents && (
              <Button
                className="w-full bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
                onClick={() => setShowCreateEventDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel événement
              </Button>
            )}

            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <Card 
                  key={event.id}
                  className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] p-3 rounded-xl text-white text-center min-w-[60px]">
                      <p className="text-xs">
                        {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-lg">{event.time}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 mb-1">{event.title}</h4>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <UsersIcon className="h-3 w-3 inline mr-1" />
                          {event.participants}/{event.maxParticipants} participants
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          Confirmé
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="px-4 py-4 space-y-3 mt-0">
            {permissions.canManageChannels && (
              <Button
                className="w-full bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
                onClick={() => setShowAddChannelDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau channel
              </Button>
            )}

            <div className="space-y-2">
              {channels.map((channel) => (
                <Card
                  key={channel.id}
                  className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onNavigate?.('teacher-channel-chat', { channelId: channel.id, clubId })}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Hash className="h-5 w-5 text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-gray-800">#{channel.name}</h4>
                        {channel.unread > 0 && (
                          <Badge className="bg-red-500 text-white border-0">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{channel.description}</p>
                    </div>

                    {permissions.canManageChannels && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Settings className="h-4 w-4 mr-2" />
                            Paramètres
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Announcement Dialog */}
      <Dialog open={showCreateAnnouncementDialog} onOpenChange={setShowCreateAnnouncementDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Nouvelle annonce</DialogTitle>
            <DialogDescription>
              Créez une annonce pour tous les membres du club
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Contenu de l'annonce *</Label>
              <Textarea
                placeholder="Écrivez votre annonce ici..."
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                className="mt-1.5 min-h-[150px]"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="pinned"
                checked={newAnnouncementPinned}
                onChange={(e) => setNewAnnouncementPinned(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#F28B6F] focus:ring-[#F28B6F]"
              />
              <Label htmlFor="pinned" className="cursor-pointer text-sm">
                <Pin className="h-4 w-4 inline mr-1" />
                Épingler cette annonce en haut
              </Label>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>ℹ️ Info</strong> - Tous les membres du club recevront une notification pour cette annonce.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowCreateAnnouncementDialog(false);
                setNewAnnouncementContent('');
                setNewAnnouncementPinned(false);
              }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
              onClick={handleCreateAnnouncement}
              disabled={!newAnnouncementContent.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel événement</DialogTitle>
            <DialogDescription>
              Créez un événement pour le club
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Titre de l'événement *</Label>
              <Input
                placeholder="Ex: Concours d'agility"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Heure *</Label>
                <Input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Lieu *</Label>
              <Input
                placeholder="Ex: Terrain principal"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Nombre maximum de participants</Label>
              <Input
                type="number"
                placeholder="Ex: 30"
                value={newEventMaxParticipants}
                onChange={(e) => setNewEventMaxParticipants(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                placeholder="Décrivez l'événement, le programme, les informations pratiques..."
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>ℹ️ Info</strong> - Les membres pourront s'inscrire à cet événement depuis la page communauté.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowCreateEventDialog(false);
                setNewEventTitle('');
                setNewEventDate('');
                setNewEventTime('');
                setNewEventLocation('');
                setNewEventDescription('');
                setNewEventMaxParticipants('');
              }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
              onClick={handleCreateEvent}
              disabled={!newEventTitle || !newEventDate || !newEventTime || !newEventLocation || !newEventDescription}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Créer l'événement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Detail Dialog */}
      {selectedAnnouncement && (
        <Dialog open={showAnnouncementDetailDialog} onOpenChange={setShowAnnouncementDetailDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Annonce</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Author info */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white shrink-0">
                  {selectedAnnouncement.author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-800">{selectedAnnouncement.author}</h4>
                    <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0">
                      {selectedAnnouncement.role}
                    </Badge>
                    {selectedAnnouncement.isPinned && (
                      <Pin className="h-4 w-4 text-[#F28B6F]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedAnnouncement.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })} à {selectedAnnouncement.time}
                  </p>
                </div>
              </div>

              {/* Full content */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedAnnouncement.fullContent}</p>
              </div>

              {/* Engagement stats */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  ❤️ {selectedAnnouncement.likes} j'aime
                </div>
                <div className="text-sm text-gray-600">
                  💬 {selectedAnnouncement.comments} commentaires
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAnnouncementDetailDialog(false)}
            >
              Fermer
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={showEventDetailDialog} onOpenChange={setShowEventDetailDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Détails de l'événement
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Event header card */}
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#F28B6F]/10 to-white">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] p-3 rounded-xl text-white text-center min-w-[70px]">
                    <p className="text-xs">
                      {new Date(selectedEvent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-lg">{selectedEvent.time}</p>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-2">{selectedEvent.title}</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { 
                          weekday: 'long',
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Event details */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-gray-800 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{selectedEvent.fullDescription}</p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Organisateur</p>
                    <p className="text-sm text-gray-800">{selectedEvent.organizer}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Catégorie</p>
                    <p className="text-sm text-gray-800">{selectedEvent.category}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Prix</p>
                    <p className="text-sm text-gray-800">{selectedEvent.price}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Prérequis</p>
                    <p className="text-sm text-gray-800">{selectedEvent.requirements}</p>
                  </div>
                </div>

                {/* Participants */}
                <Card className="p-4 border-0 shadow-sm bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800">Participants inscrits</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {selectedEvent.participants}/{selectedEvent.maxParticipants} places
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        selectedEvent.participants < selectedEvent.maxParticipants 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      } border-0`}>
                        {selectedEvent.participants < selectedEvent.maxParticipants ? 'Places disponibles' : 'Complet'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowEventDetailDialog(false)}
            >
              Fermer
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Channel Dialog */}
      <Dialog open={showAddChannelDialog} onOpenChange={setShowAddChannelDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau channel</DialogTitle>
            <DialogDescription>
              Les membres pourront discuter dans ce channel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Nom du channel *</Label>
              <div className="relative mt-1.5">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ex: agility, conseils-education"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Utilisez des lettres minuscules et des tirets
              </p>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="De quoi va parler ce channel ?"
                value={newChannelDescription}
                onChange={(e) => setNewChannelDescription(e.target.value)}
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>ℹ️ Info</strong> - Tous les membres du club auront accès à ce channel.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAddChannelDialog(false);
                setNewChannelName('');
                setNewChannelDescription('');
              }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
              onClick={handleCreateChannel}
              disabled={!newChannelName.trim()}
            >
              <Hash className="h-4 w-4 mr-2" />
              Créer le channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
