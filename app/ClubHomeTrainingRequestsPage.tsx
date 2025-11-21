import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, Dog, Edit, Home, Mail, MapPin, Phone, Send, User, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ClubHomeTrainingRequestsPageProps {
  onBack: () => void;
}

export function ClubHomeTrainingRequestsPage({ onBack }: ClubHomeTrainingRequestsPageProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showAssignTeacherDialog, setShowAssignTeacherDialog] = useState(false);
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedTime, setModifiedTime] = useState('');
  const [modificationReason, setModificationReason] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');

  const homeTrainingRequests = [
    {
      id: 1,
      status: 'pending_club',
      client: {
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        phone: '+33 6 12 34 56 78',
      },
      dog: {
        name: 'Max',
        breed: 'Berger Allemand',
        age: '3 ans',
      },
      preferredDate: '2025-10-28',
      preferredTime: '14:00',
      alternativeSlots: [
        { date: '2025-10-29', time: '10:00' },
        { date: '2025-10-30', time: '15:00' },
      ],
      address: {
        street: '123 Rue de la Paix',
        postalCode: '75001',
        city: 'Paris',
        additionalInfo: 'Code: 1234A, 3ème étage',
      },
      requestedTeacher: 'Sophie Martin',
      notes: 'Mon chien a des problèmes de rappel en extérieur. Je souhaiterais travailler cet aspect en particulier.',
      submittedAt: '2025-10-20 14:30',
    },
    {
      id: 2,
      status: 'pending_teacher',
      client: {
        name: 'Jean Martin',
        email: 'jean.martin@email.com',
        phone: '+33 6 98 76 54 32',
      },
      dog: {
        name: 'Luna',
        breed: 'Golden Retriever',
        age: '1 an',
      },
      preferredDate: '2025-10-27',
      preferredTime: '10:00',
      alternativeSlots: [],
      address: {
        street: '45 Avenue Mozart',
        postalCode: '75016',
        city: 'Paris',
        additionalInfo: '',
      },
      requestedTeacher: 'Pierre Martin',
      assignedTeacher: 'Pierre Martin',
      notes: 'Socialisation avec d\'autres chiens et travail sur la marche en laisse.',
      submittedAt: '2025-10-21 09:15',
      clubValidatedAt: '2025-10-21 15:20',
    },
    {
      id: 3,
      status: 'confirmed',
      client: {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        phone: '+33 6 55 44 33 22',
      },
      dog: {
        name: 'Rocky',
        breed: 'Labrador',
        age: '5 ans',
      },
      preferredDate: '2025-10-26',
      preferredTime: '16:00',
      confirmedDate: '2025-10-26',
      confirmedTime: '16:00',
      alternativeSlots: [],
      address: {
        street: '12 Rue Victor Hugo',
        postalCode: '92100',
        city: 'Boulogne-Billancourt',
        additionalInfo: 'Maison avec jardin',
      },
      requestedTeacher: 'Peu importe',
      assignedTeacher: 'Sophie Leclerc',
      notes: 'Comportement agressif envers les visiteurs, besoin d\'aide urgente.',
      submittedAt: '2025-10-19 11:00',
      clubValidatedAt: '2025-10-19 14:30',
      teacherValidatedAt: '2025-10-19 16:45',
      price: 85,
    },
  ];


  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
  };

  const handleAcceptRequest = (request: any) => {
    if (request.requestedTeacher && request.requestedTeacher !== 'Peu importe') {
      setSelectedRequest(request);
      setShowAssignTeacherDialog(true);
    } else {
      // Direct accept without specific teacher
      console.log('Accepté directement:', request);
    }
  };

  const handleModifyRequest = (request: any) => {
    setSelectedRequest(request);
    setModifiedDate(request.preferredDate);
    setModifiedTime(request.preferredTime);
    setShowModifyDialog(true);
  };

  const handleRejectRequest = (request: any) => {
    console.log('Rejeté:', request);
    // Show reject dialog with reason
  };

  const handleSendModification = () => {
    console.log('Proposition de modification envoyée:', {
      requestId: selectedRequest.id,
      newDate: modifiedDate,
      newTime: modifiedTime,
      reason: modificationReason,
    });
    setShowModifyDialog(false);
    setModificationReason('');
  };

  const handleAssignTeacher = () => {
    console.log('Demande envoyée à l\'éducateur:', {
      requestId: selectedRequest.id,
      teacherId: assignedTeacher,
    });
    setShowAssignTeacherDialog(false);
    setAssignedTeacher('');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending_club':
        return {
          badge: <Badge className="bg-orange-100 text-orange-700 border-0">En attente club</Badge>,
          color: 'orange',
          icon: AlertCircle,
        };
      case 'pending_teacher':
        return {
          badge: <Badge className="bg-blue-100 text-blue-700 border-0">En attente éducateur</Badge>,
          color: 'blue',
          icon: Clock,
        };
      case 'confirmed':
        return {
          badge: <Badge className="bg-green-100 text-green-700 border-0">Confirmé</Badge>,
          color: 'green',
          icon: CheckCircle,
        };
      case 'rejected':
        return {
          badge: <Badge className="bg-red-100 text-red-700 border-0">Refusé</Badge>,
          color: 'red',
          icon: XCircle,
        };
      default:
        return {
          badge: <Badge className="bg-gray-100 text-gray-700 border-0">Inconnu</Badge>,
          color: 'gray',
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white">Demandes à domicile</h1>
        <p className="text-white/80 mt-2">{homeTrainingRequests.length} demande(s)</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {homeTrainingRequests.map((request) => {
          const statusInfo = getStatusInfo(request.status);

          return (
            <Card
              key={request.id}
              className={`p-4 shadow-sm border-0 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                statusInfo.color === 'orange' ? 'border-l-orange-500 bg-orange-50/30' :
                statusInfo.color === 'blue' ? 'border-l-blue-500 bg-blue-50/30' :
                statusInfo.color === 'green' ? 'border-l-green-500 bg-green-50/30' :
                'border-l-gray-300'
              }`}
              onClick={() => handleViewRequest(request)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    statusInfo.color === 'orange' ? 'bg-orange-100' :
                    statusInfo.color === 'blue' ? 'bg-blue-100' :
                    statusInfo.color === 'green' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    <Home className={`h-5 w-5 ${
                      statusInfo.color === 'orange' ? 'text-orange-600' :
                      statusInfo.color === 'blue' ? 'text-blue-600' :
                      statusInfo.color === 'green' ? 'text-green-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-gray-800">{request.client.name}</h4>
                    <p className="text-xs text-gray-600">
                      {new Date(request.preferredDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {request.preferredTime}
                    </p>
                  </div>
                </div>
                {statusInfo.badge}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Dog className="h-4 w-4 text-gray-400" />
                  <span>{request.dog.name} - {request.dog.breed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{request.address.city}</span>
                </div>
                {request.requestedTeacher && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Éducateur: {request.requestedTeacher}</span>
                  </div>
                )}
              </div>

              {request.status === 'pending_club' && (
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleAcceptRequest(request);
                    }}
                    className="flex-1 bg-[#41B6A6] hover:bg-[#359889] h-9"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleModifyRequest(request);
                    }}
                    className="flex-1 h-9"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleRejectRequest(request);
                    }}
                    className="h-9 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {request.status === 'confirmed' && request.price && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Prix convenu</span>
                  <span className="text-[#E9B782]">{request.price}€</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-[90%] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="text-gray-800 mb-3">Informations client</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedRequest.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedRequest.client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedRequest.client.phone}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="text-gray-800 mb-3">Chien</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Nom:</strong> {selectedRequest.dog.name}</p>
                  <p><strong>Race:</strong> {selectedRequest.dog.breed}</p>
                  <p><strong>Âge:</strong> {selectedRequest.dog.age}</p>
                </div>
              </Card>

              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="text-gray-800 mb-3">Date et heure</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      {new Date(selectedRequest.preferredDate).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })} à {selectedRequest.preferredTime}
                    </span>
                  </div>

                  {selectedRequest.alternativeSlots.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">Créneaux alternatifs:</p>
                      {selectedRequest.alternativeSlots.map((slot: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>
                            {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {slot.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-gray-50 border-0">
                <h3 className="text-gray-800 mb-3">Adresse</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>{selectedRequest.address.street}</p>
                  <p>{selectedRequest.address.postalCode} {selectedRequest.address.city}</p>
                  {selectedRequest.address.additionalInfo && (
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Info complémentaire:</strong> {selectedRequest.address.additionalInfo}
                    </p>
                  )}
                </div>
              </Card>

              {selectedRequest.notes && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="text-gray-800 mb-2">Notes du client</h3>
                  <p className="text-sm text-gray-700">{selectedRequest.notes}</p>
                </Card>
              )}

              {selectedRequest.status === 'pending_club' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      setShowDetailDialog(false);
                      handleAcceptRequest(selectedRequest);
                    }}
                    className="flex-1 bg-[#41B6A6] hover:bg-[#359889]"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accepter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailDialog(false);
                      handleModifyRequest(selectedRequest);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Proposer modification
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailDialog(false);
                      handleRejectRequest(selectedRequest);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modify Dialog */}
      <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Proposer une modification</DialogTitle>
            <DialogDescription>
              Proposez une nouvelle date et heure au client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="modifiedDate">Nouvelle date</Label>
              <Input
                id="modifiedDate"
                type="date"
                value={modifiedDate}
                onChange={(e) => setModifiedDate(e.target.value)}
                className="mt-1.5"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="modifiedTime">Nouvelle heure</Label>
              <Input
                id="modifiedTime"
                type="time"
                value={modifiedTime}
                onChange={(e) => setModifiedTime(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="modificationReason">Raison de la modification (optionnel)</Label>
              <Textarea
                id="modificationReason"
                value={modificationReason}
                onChange={(e) => setModificationReason(e.target.value)}
                placeholder="Expliquez pourquoi vous proposez une autre date..."
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleSendModification}
              disabled={!modifiedDate || !modifiedTime}
              className="w-full bg-[#41B6A6] hover:bg-[#359889]"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer la proposition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Teacher Dialog */}
      <Dialog open={showAssignTeacherDialog} onOpenChange={setShowAssignTeacherDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Assigner un éducateur</DialogTitle>
            <DialogDescription>
              Le client a demandé {selectedRequest?.requestedTeacher}. Confirmez l'assignation pour envoyer la demande à l'éducateur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-blue-900 mb-1">Prochaine étape</h4>
                  <p className="text-sm text-blue-700">
                    Une fois accepté, la demande sera envoyée à l'éducateur qui devra la valider ou proposer une modification.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAssignTeacherDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAssignTeacher}
                className="flex-1 bg-[#41B6A6] hover:bg-[#359889]"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer à l'éducateur
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
