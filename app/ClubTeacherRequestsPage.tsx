import { ArrowLeft, Award, Calendar, CheckCircle, Mail, Phone, Shield, Star, X } from 'lucide-react';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface ClubTeacherRequestsPageProps {
  onBack: () => void;
}

export function ClubTeacherRequestsPage({ onBack }: ClubTeacherRequestsPageProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const pendingRequests = [
    {
      id: 1,
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      phone: '06 12 34 56 78',
      requestDate: '2024-11-02',
      experience: '8 ans',
      certifications: ['BPJEPS', 'Certificat de capacité'],
      specialties: ['Éducation de base', 'Comportement', 'Agility'],
      rating: 4.8,
      totalCourses: 124,
      message: 'Bonjour, je suis éducatrice canine depuis 8 ans et je suis spécialisée en comportement et agility. Je serais ravie de rejoindre votre club pour proposer mes services et participer à vos événements.',
      verified: true,
    },
    {
      id: 2,
      name: 'Marc Dupont',
      email: 'marc.dupont@email.com',
      phone: '06 98 76 54 32',
      requestDate: '2024-11-01',
      experience: '5 ans',
      certifications: ['Certificat de capacité'],
      specialties: ['Éducation de base', 'Socialisation'],
      rating: 4.6,
      totalCourses: 67,
      message: 'Je souhaite rejoindre votre club pour développer mon activité et rencontrer d\'autres professionnels.',
      verified: false,
    },
  ];

  const handleApprove = (requestId: number) => {
    console.log('Approving request:', requestId);
    setShowDetailDialog(false);
  };

  const handleReject = (requestId: number) => {
    console.log('Rejecting request:', requestId);
    setShowDetailDialog(false);
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
            <h1 className="text-white">Demandes d'affiliation</h1>
            <p className="text-white/80 text-sm mt-1">
              {pendingRequests.length} demande{pendingRequests.length > 1 ? 's' : ''} en attente
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {pendingRequests.length === 0 ? (
          <Card className="p-8 text-center border-0 shadow-sm">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-800 mb-2">Aucune demande en attente</h3>
            <p className="text-sm text-gray-600">
              Les demandes d'affiliation des éducateurs apparaîtront ici
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <Card 
                key={request.id}
                className="p-4 border-0 shadow-sm border-l-4 border-l-[#E9B782] cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(request)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white shrink-0">
                    {request.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-gray-800">{request.name}</h4>
                          {request.verified && (
                            <Badge className="bg-[#41B6A6] text-white border-0 shrink-0">
                              <Shield className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Demande envoyée le {new Date(request.requestDate).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Expérience</span>
                        </div>
                        <p className="text-sm text-gray-800">{request.experience}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Star className="h-3 w-3" />
                          <span>Note</span>
                        </div>
                        <p className="text-sm text-gray-800">{request.rating}/5</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {request.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} className="bg-[#E9B782]/20 text-[#E9B782] border-0 text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm"
                            className="flex-1 bg-[#41B6A6] hover:bg-[#359889] text-white"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accepter cette demande ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {request.name} pourra donner des cours via votre club. Vous pourrez gérer ses accès depuis la page des éducateurs.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-[#41B6A6] hover:bg-[#359889]"
                              onClick={() => handleApprove(request.id)}
                            >
                              Accepter
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 border-red-200"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Refuser cette demande ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              La demande de {request.name} sera refusée. L'éducateur pourra faire une nouvelle demande ultérieurement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleReject(request.id)}
                            >
                              Refuser
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      {selectedRequest && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Demande d'affiliation</DialogTitle>
              <DialogDescription>
                Détails de la demande de {selectedRequest.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Profile */}
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/10 to-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white text-xl">
                    {selectedRequest.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-800">{selectedRequest.name}</h3>
                      {selectedRequest.verified && (
                        <Badge className="bg-[#41B6A6] text-white border-0">
                          <Shield className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-800">{selectedRequest.rating}</span>
                      <span className="text-sm text-gray-500">({selectedRequest.totalCourses} cours donnés)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${selectedRequest.email}`} className="text-[#41B6A6] hover:underline">
                      {selectedRequest.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${selectedRequest.phone}`} className="text-[#41B6A6] hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Experience */}
              <div>
                <h4 className="text-gray-800 mb-3">Expérience professionnelle</h4>
                <Card className="p-3 border-0 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#41B6A6]" />
                    <span className="text-sm text-gray-800">{selectedRequest.experience} d'expérience</span>
                  </div>
                  <p className="text-xs text-gray-600">{selectedRequest.totalCourses} cours donnés au total</p>
                </Card>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-gray-800 mb-3">Certifications</h4>
                <div className="space-y-2">
                  {selectedRequest.certifications.map((cert: string, index: number) => (
                    <Card key={index} className="p-3 border-0 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-800">{cert}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-gray-800 mb-3">Spécialités</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.specialties.map((specialty: string, index: number) => (
                    <Badge key={index} className="bg-[#E9B782]/20 text-[#E9B782] border-0">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-gray-800 mb-2">Message de présentation</h4>
                <Card className="p-3 border-0 shadow-sm bg-gray-50">
                  <p className="text-sm text-gray-700">{selectedRequest.message}</p>
                </Card>
              </div>

              {/* Request Date */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  Demande reçue le {new Date(selectedRequest.requestDate).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Refuser cette demande ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      La demande de {selectedRequest.name} sera refusée. L'éducateur pourra faire une nouvelle demande ultérieurement.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      Refuser
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="flex-1 bg-[#41B6A6] hover:bg-[#359889] text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accepter
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Accepter cette demande ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {selectedRequest.name} pourra donner des cours via votre club. Vous pourrez gérer ses accès depuis la page des éducateurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-[#41B6A6] hover:bg-[#359889]"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      Accepter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
