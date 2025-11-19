import React from 'react';
import { Users, MessageCircle, Bell, ChevronRight, BadgeCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface CommunityPageProps {
  onClubClick?: (clubId: number) => void;
}

export function CommunityPage({ onClubClick }: CommunityPageProps) {
  // Mock data - clubs auxquels l'utilisateur est affilié
  const affiliatedClubs = [
    {
      id: 1,
      name: 'Canin Club Paris',
      image: 'https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      verified: true,
      members: 234,
      unreadMessages: 5,
      lastMessage: 'Sophie a partagé une annonce',
      lastMessageTime: 'Il y a 2h',
    },
    {
      id: 2,
      name: 'Agility Pro',
      image: 'https://images.unsplash.com/photo-1631516378357-f87aa5d25769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      verified: true,
      members: 156,
      unreadMessages: 0,
      lastMessage: 'Lucas: Le cours de demain est confirmé',
      lastMessageTime: 'Hier',
    },
    {
      id: 4,
      name: 'DogSchool Expert',
      image: 'https://images.unsplash.com/photo-1713160848421-bd49a21b09ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      verified: true,
      members: 189,
      unreadMessages: 2,
      lastMessage: 'Emma a répondu dans #annonces',
      lastMessageTime: 'Il y a 5h',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <h1 className="text-white mb-2">Communauté</h1>
        <p className="text-white/80">Vos clubs et groupes</p>
      </div>

      {/* Stats Bar */}
      <div className="px-4 py-4 bg-gradient-to-br from-[#41B6A6]/5 to-[#41B6A6]/10 border-b border-[#41B6A6]/20">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-5 w-5 text-[#41B6A6]" />
              <span className="text-gray-800">{affiliatedClubs.length}</span>
            </div>
            <p className="text-xs text-gray-600">Clubs</p>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-5 w-5 text-[#41B6A6]" />
              <span className="text-gray-800">
                {affiliatedClubs.reduce((sum, club) => sum + club.unreadMessages, 0)}
              </span>
            </div>
            <p className="text-xs text-gray-600">Non lus</p>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Bell className="h-5 w-5 text-[#41B6A6]" />
              <span className="text-gray-800">3</span>
            </div>
            <p className="text-xs text-gray-600">Événements</p>
          </div>
        </div>
      </div>

      {/* Clubs List */}
      <div className="flex-1 overflow-y-auto">
        {affiliatedClubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-gray-800 mb-2">Aucun club pour le moment</h3>
            <p className="text-gray-600 mb-6">
              Rejoignez la communauté d'un club lors de votre prochaine réservation !
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            <h2 className="text-gray-700 mb-3">Mes clubs</h2>
            {affiliatedClubs.map((club) => (
              <Card
                key={club.id}
                onClick={() => onClubClick?.(club.id)}
                className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-gray-200"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <ImageWithFallback
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {club.verified && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                        <BadgeCheck className="h-4 w-4 text-[#41B6A6]" fill="white" />
                      </div>
                    )}
                    {club.unreadMessages > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#F28B6F] rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-xs text-white">{club.unreadMessages}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-gray-800 truncate">{club.name}</h3>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{club.members} membres</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 truncate">{club.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">{club.lastMessageTime}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        {affiliatedClubs.length > 0 && (
          <div className="px-4 pb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-blue-900 mb-1">Communauté active</h4>
                  <p className="text-sm text-blue-800">
                    Partagez vos expériences, posez vos questions et restez connecté avec votre club !
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
