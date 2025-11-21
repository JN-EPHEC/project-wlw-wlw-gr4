import { useState } from 'react';
import { Building2, Users, MapPin, ChevronRight, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface TeacherCommunitySelectionPageProps {
  onNavigate?: (page: string, clubId?: number) => void;
}

export function TeacherCommunitySelectionPage({ onNavigate }: TeacherCommunitySelectionPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Clubs auxquels le professeur est affilié
  const myClubs = [
    {
      id: 1,
      name: 'Club Canin Lyon Sud',
      location: 'Lyon 8ème',
      members: 156,
      verified: true,
      unreadCount: 5,
    },
    {
      id: 2,
      name: 'Éducation Canine Rhône-Alpes',
      location: 'Villeurbanne',
      members: 89,
      verified: true,
      unreadCount: 0,
    },
  ];

  const filteredClubs = myClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="mb-6">
          <h1 className="text-white">Communauté</h1>
          <p className="text-white/80 text-sm mt-1">Sélectionnez un club</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Rechercher un club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {filteredClubs.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-sm">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-800 mb-2">Aucun club trouvé</h3>
            <p className="text-sm text-gray-600">
              Rejoignez des clubs pour accéder à leur communauté
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredClubs.map((club) => (
              <Card
                key={club.id}
                className="p-4 border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNavigate?.('teacher-club-community', club.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-gray-800">{club.name}</h4>
                          {club.verified && (
                            <Badge className="bg-[#41B6A6] text-white border-0 shrink-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{club.location}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{club.members} membres</span>
                      </div>
                      {club.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white border-0">
                          {club.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
