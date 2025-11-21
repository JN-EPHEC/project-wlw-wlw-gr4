import { ArrowLeft, Bell, Calendar, ChevronRight, Hash, MessageCircle, Users, Volume2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface ClubCommunityPageProps {
  clubId: number;
  onBack: () => void;
  onChannelClick: (clubId: number, channelId: string, channelName: string) => void;
  onEventsClick: (clubId: number) => void;
}

export function ClubCommunityPage({ clubId, onBack, onChannelClick, onEventsClick }: ClubCommunityPageProps) {
  // Mock data
  const club = {
    id: clubId,
    name: 'Canin Club Paris',
    members: 234,
  };

  // Announcement channel - Only one, with terracotta color
  const announcementChannel = {
    id: 'announcements',
    name: 'Annonces officielles',
    description: 'Seuls les éducateurs peuvent publier',
    unread: 2,
    lastMessage: 'Sophie: Nouvelle session de groupe ce samedi !',
    lastMessageTime: 'Il y a 2h',
  };

  // Events summary
  const eventsSummary = {
    upcomingEvents: 4,
    nextEvent: {
      title: 'Balade en forêt de Fontainebleau',
      date: 'Sam 28 Oct',
    },
  };

  // Discussion channels
  const discussionChannels = [
    {
      id: 'general',
      name: 'Discussion générale',
      icon: MessageCircle,
      description: 'Chat général du club',
      unread: 3,
      lastMessage: 'Sophie: Quelqu\'un a des conseils pour...',
      lastMessageTime: 'Il y a 30min',
    },
    {
      id: 'course-oct-22',
      name: 'Cours du 22 Oct',
      icon: Hash,
      description: 'Discussion pour le cours du 22 octobre',
      unread: 0,
      lastMessage: 'Marc: Qui sera présent demain ?',
      lastMessageTime: 'Il y a 1h',
    },
    {
      id: 'course-oct-15',
      name: 'Cours du 15 Oct',
      icon: Hash,
      description: 'Discussion pour le cours du 15 octobre',
      unread: 0,
      lastMessage: 'Emma: N\'oubliez pas vos friandises !',
      lastMessageTime: 'Il y a 3h',
    },
    {
      id: 'tips-tricks',
      name: 'Astuces & Conseils',
      icon: MessageCircle,
      description: 'Partagez vos astuces d\'éducation',
      unread: 1,
      lastMessage: 'Julie a partagé une vidéo',
      lastMessageTime: 'Il y a 4h',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
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
        <h1 className="text-white mb-2">{club.name}</h1>
        <div className="flex items-center gap-2 text-white/90">
          <Users className="h-4 w-4" />
          <span className="text-sm">{club.members} membres</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* 1. ANNONCES SECTION - Terracotta color for importance */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-[#F28B6F]" />
            <h2 className="text-gray-800">Annonces</h2>
          </div>
          <Card
            onClick={() => onChannelClick(clubId, announcementChannel.id, announcementChannel.name)}
            className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-[#F28B6F]/30 bg-gradient-to-br from-[#F28B6F]/10 to-[#F28B6F]/5"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F28B6F] to-[#E67A5F] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-800">{announcementChannel.name}</h3>
                  {announcementChannel.unread > 0 && (
                    <Badge className="bg-[#F28B6F] text-white border-0 shadow-sm">
                      {announcementChannel.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#F28B6F] mb-2 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  {announcementChannel.description}
                </p>
                <p className="text-sm text-gray-700 mb-2 truncate">{announcementChannel.lastMessage}</p>
                <p className="text-xs text-gray-500">{announcementChannel.lastMessageTime}</p>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* 2. ÉVÉNEMENTS SECTION */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Événements</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEventsClick(clubId)}
              className="text-[#41B6A6] hover:text-[#359889] hover:bg-[#41B6A6]/10"
            >
              Voir tout
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Card
            onClick={() => onEventsClick(clubId)}
            className="p-4 hover:shadow-lg transition-all cursor-pointer border-[#41B6A6]/30 bg-gradient-to-br from-[#41B6A6]/5 to-transparent"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#41B6A6] to-[#359889] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800">Prochains événements</h3>
                  <Badge className="bg-[#41B6A6] text-white border-0">
                    {eventsSummary.upcomingEvents}
                  </Badge>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-800 mb-1">{eventsSummary.nextEvent.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="h-3.5 w-3.5 text-[#41B6A6]" />
                    <span>{eventsSummary.nextEvent.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* 3. SALONS DE DISCUSSION SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-[#41B6A6]" />
            <h2 className="text-gray-800">Salons de discussion</h2>
          </div>
          <div className="space-y-2">
            {discussionChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card
                  key={channel.id}
                  onClick={() => onChannelClick(clubId, channel.id, channel.name)}
                  className="p-4 hover:shadow-md transition-all cursor-pointer border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#41B6A6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="text-gray-800">{channel.name}</h4>
                          <p className="text-xs text-gray-500">{channel.description}</p>
                        </div>
                        {channel.unread > 0 && (
                          <Badge className="bg-[#F28B6F] text-white border-0 ml-2">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 truncate">{channel.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{channel.lastMessageTime}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Volume2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-900 mb-1">Règles de la communauté</h4>
              <p className="text-sm text-blue-800">
                Soyez respectueux, bienveillant et partagez vos connaissances pour aider la communauté à grandir.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
