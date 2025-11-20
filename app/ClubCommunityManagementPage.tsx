import { Bell, Calendar, ChevronRight, Hash, MessageCircle, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface ClubCommunityManagementPageProps {
  onNavigate: (page: string) => void;
}

export function ClubCommunityManagementPage({ onNavigate }: ClubCommunityManagementPageProps) {
  const stats = {
    announcements: 5,
    unreadAnnouncements: 2,
    upcomingEvents: 4,
    channels: 6,
    members: 127,
    unreadMessages: 30,
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-6 shadow-lg">
        <h1 className="text-white mb-2">Ma Communauté</h1>
        <p className="text-white/80">Gérez votre communauté</p>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4 bg-gradient-to-br from-[#E9B782]/5 to-[#E9B782]/10 border-b border-[#E9B782]/20">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-5 w-5 text-[#E9B782]" />
              <span className="text-gray-800">{stats.members}</span>
            </div>
            <p className="text-xs text-gray-600">Membres</p>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Hash className="h-5 w-5 text-[#E9B782]" />
              <span className="text-gray-800">{stats.channels}</span>
            </div>
            <p className="text-xs text-gray-600">Salons</p>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-5 w-5 text-[#E9B782]" />
              <span className="text-gray-800">{stats.unreadMessages}</span>
            </div>
            <p className="text-xs text-gray-600">Non lus</p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* 1. ANNONCES - Terracotta */}
        <Card
          onClick={() => onNavigate('clubAnnouncements')}
          className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-[#F28B6F]/30 bg-gradient-to-br from-[#F28B6F]/10 to-[#F28B6F]/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F28B6F] to-[#E67A5F] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-800">Annonces</h3>
                {stats.unreadAnnouncements > 0 && (
                  <Badge className="bg-[#F28B6F] text-white border-0 shadow-sm">
                    {stats.unreadAnnouncements} nouvelles
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Gérez les annonces officielles du club
              </p>
              <div className="flex items-center text-xs text-[#F28B6F]">
                <span>{stats.announcements} annonces publiées</span>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
          </div>
        </Card>

        {/* 2. ÉVÉNEMENTS - Turquoise */}
        <Card
          onClick={() => onNavigate('clubEventsManagement')}
          className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-[#41B6A6]/30 bg-gradient-to-br from-[#41B6A6]/10 to-[#41B6A6]/5"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#41B6A6] to-[#359889] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-800">Événements</h3>
                <Badge className="bg-[#41B6A6] text-white border-0">
                  {stats.upcomingEvents} à venir
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Créez et gérez vos événements
              </p>
              <div className="flex items-center text-xs text-[#41B6A6]">
                <span>Balade en forêt - Sam 28 Oct</span>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
          </div>
        </Card>

        {/* 3. SALONS DE DISCUSSION - Gray */}
        <Card
          onClick={() => onNavigate('clubChannels')}
          className="p-4 hover:shadow-lg transition-all cursor-pointer border-gray-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-800">Salons de discussion</h3>
                {stats.unreadMessages > 0 && (
                  <Badge className="bg-red-500 text-white border-0">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Discutez avec vos membres
              </p>
              <div className="flex items-center text-xs text-gray-600">
                <span>{stats.channels} salons actifs</span>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
          </div>
        </Card>

        {/* 4. MEMBRES - Purple */}
        <Card
          onClick={() => onNavigate('clubMembers')}
          className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-800">Membres</h3>
                <Badge className="bg-purple-600 text-white border-0">
                  {stats.members}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Gérez les membres de votre communauté
              </p>
              <div className="flex items-center text-xs text-purple-600">
                <span>Modération et permissions</span>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
          </div>
        </Card>
      </div>
    </div>
  );
}
