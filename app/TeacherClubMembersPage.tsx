import { AlertCircle, ArrowLeft, Crown, Search, Shield, Users as UsersIcon, UserX } from 'lucide-react';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TeacherClubMembersPageProps {
  clubId?: number;
  onBack?: () => void;
}

export function TeacherClubMembersPage({ onBack }: TeacherClubMembersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  const clubInfo = {
    name: 'Club Canin Lyon Sud',
  };

  // Permissions de l'éducateur
  const permissions = {
    canKickMembers: true,
    canManageEducators: false, // Seul l'admin du club peut gérer les éducateurs
  };

  // Membres du club
  const members = [
    {
      id: 1,
      name: 'Marie Dubois',
      role: 'Membre',
      joinDate: '2024-06-15',
      coursesAttended: 12,
      avatar: 'MD',
    },
    {
      id: 2,
      name: 'Thomas Laurent',
      role: 'Membre',
      joinDate: '2024-08-20',
      coursesAttended: 8,
      avatar: 'TL',
    },
    {
      id: 3,
      name: 'Julie Bernard',
      role: 'Membre',
      joinDate: '2024-05-10',
      coursesAttended: 24,
      avatar: 'JB',
    },
    {
      id: 4,
      name: 'Pierre Martin',
      role: 'Membre',
      joinDate: '2024-09-05',
      coursesAttended: 3,
      avatar: 'PM',
    },
  ];

  // Éducateurs du club
  const educators = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Éducatrice',
      isAdmin: false,
      joinDate: '2023-05-15',
      coursesGiven: 124,
      avatar: 'SM',
      specialties: ['Agility', 'Obéissance'],
    },
    {
      id: 2,
      name: 'Marc Dupont',
      role: 'Éducateur',
      isAdmin: false,
      joinDate: '2024-01-10',
      coursesGiven: 67,
      avatar: 'MD',
      specialties: ['Comportement', 'Socialisation'],
    },
    {
      id: 3,
      name: 'Jean Directeur',
      role: 'Admin',
      isAdmin: true,
      joinDate: '2020-01-01',
      coursesGiven: 0,
      avatar: 'JD',
      specialties: [],
    },
  ];

  const handleKickMember = (memberId: number, memberName: string) => {
    console.log('Kicking member:', memberId, memberName);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEducators = educators.filter(educator =>
    educator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div>
            <h2 className="text-white">Membres</h2>
            <p className="text-white/80 text-sm mt-0.5">{clubInfo.name}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-white/20">
            <TabsTrigger 
              value="members"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F28B6F]"
            >
              Membres ({members.length})
            </TabsTrigger>
            <TabsTrigger 
              value="educators"
              className="data-[state=active]:bg-white data-[state=active]:text-[#F28B6F]"
            >
              Éducateurs ({educators.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} className="w-full">
          {/* Members Tab */}
          <TabsContent value="members" className="px-4 py-4 space-y-3 mt-0">
            {!permissions.canKickMembers && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                  <p className="text-sm text-orange-900">
                    Vous n'avez pas la permission de gérer les membres de ce club.
                  </p>
                </div>
              </div>
            )}

            {filteredMembers.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucun membre trouvé</h3>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="p-4 border-0 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                        {member.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-800 mb-1">{member.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>Membre depuis {new Date(member.joinDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{member.coursesAttended} cours suivis</span>
                        </div>
                      </div>

                      {permissions.canKickMembers && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Expulser ce membre ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {member.name} sera expulsé du club et ne pourra plus accéder à la communauté ni participer aux cours.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleKickMember(member.id, member.name)}
                              >
                                Expulser
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Educators Tab */}
          <TabsContent value="educators" className="px-4 py-4 space-y-3 mt-0">
            {!permissions.canManageEducators && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                  <p className="text-sm text-blue-900">
                    Seul l'administrateur du club peut gérer les éducateurs.
                  </p>
                </div>
              </div>
            )}

            {filteredEducators.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucun éducateur trouvé</h3>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEducators.map((educator) => (
                  <Card key={educator.id} className="p-4 border-0 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white shrink-0">
                        {educator.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-800">{educator.name}</h4>
                          {educator.isAdmin ? (
                            <Badge className="bg-yellow-500 text-white border-0">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge className="bg-[#41B6A6] text-white border-0">
                              <Shield className="h-3 w-3 mr-1" />
                              Éducateur
                            </Badge>
                          )}
                        </div>

                        {educator.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {educator.specialties.map((specialty, index) => (
                              <Badge key={index} className="bg-gray-100 text-gray-700 border-0 text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>Depuis {new Date(educator.joinDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                          {educator.coursesGiven > 0 && (
                            <>
                              <span>•</span>
                              <span>{educator.coursesGiven} cours donnés</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
