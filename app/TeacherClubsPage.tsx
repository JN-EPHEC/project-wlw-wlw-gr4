import { Building2, Calendar, CheckCircle, Clock, DollarSign, GraduationCap, MapPin, Plus, Search, Send, Star, Users, X } from 'lucide-react';
import { useState } from 'react';
import { TeacherBottomNav } from './TeacherBottomNav';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

interface TeacherClubsPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function TeacherClubsPage({ onNavigate }: TeacherClubsPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [selectedClubForRequest, setSelectedClubForRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('my-clubs');

  const [requestMessage, setRequestMessage] = useState('');

  // Clubs auxquels le professeur est affilié
  const myClubs = [
    {
      id: 1,
      name: 'Club Canin Lyon Sud',
      location: 'Lyon 8ème',
      status: 'active',
      memberSince: '2023-05-15',
      coursesGiven: 45,
      rating: 4.9,
      nextCourse: '2024-11-06',
      monthlyRevenue: 680,
      members: 156,
      verified: true,
    },
    {
      id: 2,
      name: 'Éducation Canine Rhône-Alpes',
      location: 'Villeurbanne',
      status: 'active',
      memberSince: '2024-01-10',
      coursesGiven: 23,
      rating: 4.8,
      nextCourse: '2024-11-08',
      monthlyRevenue: 340,
      members: 89,
      verified: true,
    },
  ];

  // Demandes en attente
  const pendingRequests = [
    {
      id: 3,
      name: 'Club d\'Agility de Lyon',
      location: 'Lyon 3ème',
      status: 'pending',
      requestDate: '2024-11-02',
      members: 203,
      verified: true,
    },
  ];

  // Clubs disponibles pour faire une demande
  const availableClubs = [
    {
      id: 4,
      name: 'Dressage Canin Lyon',
      location: 'Lyon 6ème',
      members: 124,
      verified: true,
      specialties: ['Obéissance', 'Comportement'],
    },
    {
      id: 5,
      name: 'Club des Amis du Chien',
      location: 'Caluire-et-Cuire',
      members: 178,
      verified: false,
      specialties: ['Socialisation', 'Éducation de base'],
    },
    {
      id: 6,
      name: 'Sport Canin Lyon',
      location: 'Lyon 7ème',
      members: 245,
      verified: true,
      specialties: ['Agility', 'Flyball', 'Obé rythmée'],
    },
  ];

  const handleRequestAccess = (club: any) => {
    setSelectedClubForRequest(club);
    setShowSearchDialog(false);
    setShowRequestDialog(true);
  };

  const handleSendRequest = () => {
    console.log('Sending request to club:', selectedClubForRequest.name);
    console.log('Message:', requestMessage);
    setShowRequestDialog(false);
    setRequestMessage('');
    setSelectedClubForRequest(null);
  };

  const handleCancelRequest = (clubId: number) => {
    console.log('Cancelling request for club:', clubId);
  };

  const handleLeaveClub = (clubId: number) => {
    console.log('Leaving club:', clubId);
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-white">Mes clubs</h1>
            <p className="text-white/80 text-sm mt-1">Gérez vos affiliations</p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 text-white hover:bg-white/30"
              size="sm"
              onClick={() => onNavigate?.('teacher-training')}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Formations
            </Button>
            <Button 
              className="bg-white text-[#E9B782] hover:bg-white/90"
              size="sm"
              onClick={() => setShowSearchDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Rejoindre
            </Button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Building2 className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">{myClubs.length}</p>
            <p className="text-white/70 text-xs">Clubs actifs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Calendar className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">{myClubs.reduce((acc, club) => acc + club.coursesGiven, 0)}</p>
            <p className="text-white/70 text-xs">Cours donnés</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <DollarSign className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">{myClubs.reduce((acc, club) => acc + club.monthlyRevenue, 0)}€</p>
            <p className="text-white/70 text-xs">Ce mois</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white border-b border-gray-200 px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="my-clubs">
                Mes clubs ({myClubs.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente ({pendingRequests.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* My Clubs Tab */}
          <TabsContent value="my-clubs" className="px-4 py-4 space-y-3 mt-0">
            {myClubs.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucun club</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Rejoignez des clubs pour commencer à donner des cours
                </p>
                <Button 
                  className="bg-[#E9B782] hover:bg-[#d9a772] text-white"
                  onClick={() => setShowSearchDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Rechercher un club
                </Button>
              </Card>
            ) : (
              myClubs.map((club) => (
                <Card 
                  key={club.id}
                  className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigate?.('teacher-appointments')}
                >
                  <div className="flex items-start gap-3">
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
                        <Badge className="bg-green-100 text-green-700 border-0 shrink-0">
                          Actif
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>Cours donnés</span>
                          </div>
                          <p className="text-sm text-gray-800">{club.coursesGiven}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                            <DollarSign className="h-3 w-3" />
                            <span>Ce mois</span>
                          </div>
                          <p className="text-sm text-gray-800">{club.monthlyRevenue}€</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm text-gray-800">{club.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{club.members} membres</span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 h-8"
                              onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Quitter
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Quitter ce club ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Vous ne pourrez plus donner de cours via {club.name}. Vos cours passés resteront visibles dans l'historique.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleLeaveClub(club.id)}
                              >
                                Quitter le club
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="px-4 py-4 space-y-3 mt-0">
            {pendingRequests.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucune demande en attente</h3>
                <p className="text-sm text-gray-600">
                  Vos demandes d'affiliation apparaîtront ici
                </p>
              </Card>
            ) : (
              pendingRequests.map((club) => (
                <Card key={club.id} className="p-4 border-0 shadow-sm border-l-4 border-l-yellow-500">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-yellow-600" />
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
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 shrink-0">
                          En attente
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">
                        Demande envoyée le {new Date(club.requestDate).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <Users className="h-3 w-3" />
                        <span>{club.members} membres</span>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-red-600 border-red-200"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler la demande
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Annuler la demande ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Votre demande d'affiliation à {club.name} sera annulée. Vous pourrez faire une nouvelle demande plus tard.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Retour</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleCancelRequest(club.id)}
                            >
                              Annuler la demande
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Search Clubs Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rechercher un club</DialogTitle>
            <DialogDescription>
              Trouvez des clubs pour donner des cours
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nom du club, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Clubs */}
            <div className="space-y-3">
              {availableClubs.map((club) => (
                <Card key={club.id} className="p-4 border-0 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-800">{club.name}</h4>
                            {club.verified && (
                              <Badge className="bg-[#41B6A6] text-white border-0 shrink-0 text-xs">
                                Vérifié
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{club.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {club.specialties.map((specialty, index) => (
                          <Badge key={index} className="bg-gray-100 text-gray-700 border-0 text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{club.members} membres</span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-[#E9B782] hover:bg-[#d9a772] text-white"
                          onClick={() => handleRequestAccess(club)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Demander
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSearchDialog(false)}
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Request Access Dialog */}
      {selectedClubForRequest && (
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="max-w-[90%]">
            <DialogHeader>
              <DialogTitle>Demande d'affiliation</DialogTitle>
              <DialogDescription>
                Envoyez votre demande à {selectedClubForRequest.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Club Info */}
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#E9B782]/10 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-gray-800">{selectedClubForRequest.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedClubForRequest.location}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Message */}
              <div>
                <Label>Message de présentation</Label>
                <Textarea
                  placeholder="Présentez-vous et expliquez pourquoi vous souhaitez rejoindre ce club..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Un message personnalisé augmente vos chances d'être accepté
                </p>
              </div>

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>ℹ️ À savoir</strong> - Le club examinera votre profil et vos certifications avant de valider votre demande.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRequestDialog(false);
                  setRequestMessage('');
                  setSelectedClubForRequest(null);
                }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#E9B782] hover:bg-[#d9a772] text-white"
                onClick={handleSendRequest}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Bottom Navigation */}
      {onNavigate && (
        <TeacherBottomNav 
          currentPage="teacher-clubs" 
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
