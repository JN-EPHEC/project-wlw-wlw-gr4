import { useState } from 'react';
import { GraduationCap, ChevronLeft, Building2, Clock, Users, CheckCircle, Send, Calendar, BookOpen, Award, Star, Play, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TeacherTrainingPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function TeacherTrainingPage({ onNavigate, onBack }: TeacherTrainingPageProps = {}) {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [selectedClub, setSelectedClub] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  // Clubs affiliés de l'éducateur
  const myClubs = [
    { id: 1, name: 'Club Canin Lyon Sud' },
    { id: 2, name: 'Éducation Canine Rhône-Alpes' },
  ];

  // Formations disponibles
  const availableTrainings = [
    {
      id: 1,
      title: 'Certificat d\'Éducateur Canin Comportementaliste',
      provider: 'CFPPA de Lyon',
      duration: '6 mois',
      format: 'Présentiel + E-learning',
      level: 'Professionnel',
      price: 2800,
      startDate: '2024-12-01',
      spots: 12,
      certified: true,
      description: 'Formation complète pour devenir éducateur canin comportementaliste certifié. Théorie et pratique avec stage en club.',
      topics: ['Comportement canin', 'Éducation positive', 'Psychologie animale', 'Gestion de groupe'],
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 2,
      title: 'Spécialisation Agility - Niveau 2',
      provider: 'Fédération Cynologique',
      duration: '3 mois',
      format: 'Présentiel',
      level: 'Avancé',
      price: 1200,
      startDate: '2024-11-15',
      spots: 8,
      certified: true,
      description: 'Perfectionnement en agility pour éducateurs confirmés. Techniques avancées et préparation aux compétitions.',
      topics: ['Parcours avancés', 'Timing', 'Gestion du stress', 'Compétition'],
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      title: 'Éducation Canine Thérapeutique',
      provider: 'Institut Canin de France',
      duration: '4 mois',
      format: 'E-learning',
      level: 'Intermédiaire',
      price: 1600,
      startDate: '2024-12-10',
      spots: 20,
      certified: true,
      description: 'Formation en ligne sur l\'utilisation des chiens en thérapie et médiation animale. Idéal pour diversifier votre activité.',
      topics: ['Médiation animale', 'Zoothérapie', 'Chiens d\'assistance', 'Protocoles thérapeutiques'],
      rating: 4.7,
      reviews: 124,
    },
    {
      id: 4,
      title: 'Perfectionnement en Obéissance',
      provider: 'Centre Canin National',
      duration: '2 mois',
      format: 'Présentiel',
      level: 'Tous niveaux',
      price: 800,
      startDate: '2024-11-20',
      spots: 15,
      certified: false,
      description: 'Approfondissez vos compétences en obéissance canine avec des techniques modernes et efficaces.',
      topics: ['Obéissance avancée', 'Renforcement positif', 'Résolution de problèmes'],
      rating: 4.6,
      reviews: 67,
    },
  ];

  // Demandes de formation en cours
  const pendingRequests = [
    {
      id: 1,
      trainingTitle: 'Certificat d\'Éducateur Canin Comportementaliste',
      clubName: 'Club Canin Lyon Sud',
      requestDate: '2024-11-01',
      status: 'pending',
      message: 'Je souhaite me perfectionner en comportementalisme...',
    },
  ];

  const handleRequestTraining = (training: any) => {
    setSelectedTraining(training);
    setShowRequestDialog(true);
  };

  const handleSendRequest = () => {
    console.log('Sending training request:', {
      training: selectedTraining.title,
      club: selectedClub,
      message: requestMessage,
    });
    setShowRequestDialog(false);
    setSelectedTraining(null);
    setSelectedClub('');
    setRequestMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white">Formations</h1>
            <p className="text-white/80 text-sm mt-1">Développez vos compétences</p>
          </div>
          <GraduationCap className="h-8 w-8 text-white/80" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <BookOpen className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">{availableTrainings.length}</p>
            <p className="text-white/70 text-xs">Disponibles</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Clock className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">{pendingRequests.length}</p>
            <p className="text-white/70 text-xs">En attente</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Award className="h-5 w-5 text-white mx-auto mb-1" />
            <p className="text-white">3</p>
            <p className="text-white/70 text-xs">Certifications</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 pt-4 z-10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="available">
                Disponibles ({availableTrainings.length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Mes demandes ({pendingRequests.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Available Trainings Tab */}
          <TabsContent value="available" className="px-4 py-4 space-y-4 mt-0">
            {availableTrainings.map((training) => (
              <Card key={training.id} className="p-4 border-0 shadow-sm">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-gray-800">{training.title}</h4>
                        {training.certified && (
                          <Badge className="bg-[#41B6A6] text-white border-0 shrink-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Certifiant
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{training.provider}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600">{training.description}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5">
                    {training.topics.map((topic, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-700 border-0 text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                        <Clock className="h-3 w-3" />
                        <span>Durée</span>
                      </div>
                      <p className="text-sm text-gray-800">{training.duration}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                        <Play className="h-3 w-3" />
                        <span>Format</span>
                      </div>
                      <p className="text-sm text-gray-800">{training.format}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>Début</span>
                      </div>
                      <p className="text-sm text-gray-800">{formatDate(training.startDate)}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                        <Users className="h-3 w-3" />
                        <span>Places</span>
                      </div>
                      <p className="text-sm text-gray-800">{training.spots} restantes</p>
                    </div>
                  </div>

                  {/* Rating & Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-800">{training.rating}</span>
                        <span className="text-xs text-gray-500">({training.reviews} avis)</span>
                      </div>
                      <p className="text-gray-800">{training.price}€</p>
                    </div>
                    <Button
                      className="bg-[#E9B782] hover:bg-[#d9a772] text-white"
                      onClick={() => handleRequestTraining(training)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Demander
                    </Button>
                  </div>

                  {/* Level Badge */}
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                    Niveau: {training.level}
                  </Badge>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="px-4 py-4 space-y-3 mt-0">
            {pendingRequests.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucune demande</h3>
                <p className="text-sm text-gray-600">
                  Vos demandes de formation apparaîtront ici
                </p>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="p-4 border-0 shadow-sm border-l-4 border-l-yellow-500">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-800">{request.trainingTitle}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Building2 className="h-3 w-3" />
                            <span>{request.clubName}</span>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 shrink-0">
                          En attente
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 mb-2">
                        Demande envoyée le {formatDate(request.requestDate)}
                      </p>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700">
                          <strong>Votre message:</strong>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {request.message}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Le club examinera votre demande et vous contactera sous 48h
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Training Dialog */}
      {selectedTraining && (
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Demande de formation</DialogTitle>
              <DialogDescription>
                Demandez la prise en charge de cette formation par un club
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Training Info */}
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#E9B782]/10 to-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800">{selectedTraining.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{selectedTraining.provider}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-800">{selectedTraining.price}€</span>
                      <span className="text-xs text-gray-500">• {selectedTraining.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Club Selection */}
              <div>
                <Label>Choisir un club</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Sélectionnez le club auquel vous souhaitez demander la prise en charge
                </p>
                <div className="space-y-2">
                  {myClubs.map((club) => (
                    <Card
                      key={club.id}
                      className={`p-3 cursor-pointer transition-all border ${
                        selectedClub === club.id.toString()
                          ? 'border-[#E9B782] bg-gradient-to-br from-[#E9B782]/10 to-white shadow-sm'
                          : 'border-gray-200 hover:border-[#E9B782]/50'
                      }`}
                      onClick={() => setSelectedClub(club.id.toString())}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center text-white shrink-0">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{club.name}</p>
                        </div>
                        {selectedClub === club.id.toString() && (
                          <CheckCircle className="h-5 w-5 text-[#E9B782]" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label>Message de motivation</Label>
                <Textarea
                  placeholder="Expliquez pourquoi cette formation est importante pour vous et comment elle bénéficiera au club..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Un message convaincant augmente vos chances d'obtenir la prise en charge
                </p>
              </div>

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>ℹ️ Prise en charge</strong> - Le club décidera s'il finance tout ou partie de la formation. La décision vous sera communiquée sous 48h.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRequestDialog(false);
                  setSelectedTraining(null);
                  setSelectedClub('');
                  setRequestMessage('');
                }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#E9B782] hover:bg-[#d9a772] text-white"
                onClick={handleSendRequest}
                disabled={!selectedClub || !requestMessage}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
