import { Calendar, CheckCircle, Clock, Dog, Edit, Filter, Home, MapPin, Plus, Search, Trash2, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

interface ClubAppointmentsPageProps {
  onNavigate?: (page: string) => void;
}

export function ClubAppointmentsPage({ onNavigate }: ClubAppointmentsPageProps = {}) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [] = useState<any>(null);
  const [] = useState(false);
  const [] = useState(false);
  const [] = useState('');
  const [] = useState('');
  const [] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    duration: '60',
    service: '',
    trainer: '',
    terrain: '',
    maxParticipants: '1',
    price: '',
    notes: '',
  });

  const terrains = [
    { id: 1, name: 'Terrain principal', address: '123 Rue de la République, 75015 Paris' },
    { id: 2, name: 'Terrain de dressage', address: '45 Avenue du Parc, 75015 Paris' },
  ];

  const appointments = {
    upcoming: [
      {
        id: 1,
        date: '25 Oct 2025',
        time: '10:00',
        client: 'Marie Dupont',
        dog: 'Max',
        service: 'Agility',
        trainer: 'Pierre Martin',
        terrain: 'Terrain principal',
        duration: '1h',
        price: 45,
        status: 'confirmed',
        participants: 1,
        maxParticipants: 1,
      },
      {
        id: 2,
        date: '25 Oct 2025',
        time: '14:30',
        client: 'Jean Martin',
        dog: 'Luna',
        service: 'Éducation canine',
        trainer: 'Sophie Leclerc',
        terrain: 'Terrain de dressage',
        duration: '1h',
        price: 50,
        status: 'pending',
        participants: 1,
        maxParticipants: 1,
      },
      {
        id: 3,
        date: '26 Oct 2025',
        time: '16:00',
        client: 'Cours collectif',
        dog: 'Multiple',
        service: 'Obéissance',
        trainer: 'Pierre Martin',
        terrain: 'Terrain principal',
        duration: '2h',
        price: 30,
        status: 'confirmed',
        participants: 8,
        maxParticipants: 10,
      },
    ],
    past: [
      {
        id: 4,
        date: '22 Oct 2025',
        time: '10:00',
        client: 'Thomas Petit',
        dog: 'Rex',
        service: 'Comportement',
        trainer: 'Sophie Leclerc',
        duration: '1h30',
        price: 65,
        status: 'completed',
        paid: true,
      },
      {
        id: 5,
        date: '20 Oct 2025',
        time: '15:00',
        client: 'Julie Rousseau',
        dog: 'Bella',
        service: 'Agility',
        trainer: 'Pierre Martin',
        duration: '1h',
        price: 45,
        status: 'completed',
        paid: true,
      },
    ],
    cancelled: [
      {
        id: 6,
        date: '23 Oct 2025',
        time: '11:00',
        client: 'Marc Dubois',
        dog: 'Rocky',
        service: 'Éducation',
        trainer: 'Sophie Leclerc',
        duration: '1h',
        price: 50,
        status: 'cancelled',
        cancelledBy: 'client',
        cancelReason: 'Chien malade',
      },
    ],
  };

  const handleCreateAppointment = () => {
    console.log('Creating appointment:', newAppointment);
    setShowCreateDialog(false);
    setNewAppointment({
      date: '',
      time: '',
      duration: '60',
      service: '',
      trainer: '',
      terrain: '',
      maxParticipants: '1',
      price: '',
      notes: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-0">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 border-0">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 border-0">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-0">Annulé</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white">Mes Rendez-vous</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-white text-[#E9B782] hover:bg-white/90 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un rendez-vous</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau rendez-vous.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, date: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Heure</Label>
                    <Input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, time: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>Service</Label>
                  <Select
                    value={newAppointment.service}
                    onValueChange={(value: any) =>
                      setNewAppointment({ ...newAppointment, service: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agility">Agility</SelectItem>
                      <SelectItem value="education">Éducation canine</SelectItem>
                      <SelectItem value="obedience">Obéissance</SelectItem>
                      <SelectItem value="behavior">Comportementalisme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Éducateur</Label>
                  <Select
                    value={newAppointment.trainer}
                    onValueChange={(value: any) =>
                      setNewAppointment({ ...newAppointment, trainer: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un éducateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pierre">Pierre Martin</SelectItem>
                      <SelectItem value="sophie">Sophie Leclerc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Terrain</Label>
                  <Select
                    value={newAppointment.terrain}
                    onValueChange={(value: any) =>
                      setNewAppointment({ ...newAppointment, terrain: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Sélectionner un terrain" />
                    </SelectTrigger>
                    <SelectContent>
                      {terrains.map((terrain) => (
                        <SelectItem key={terrain.id} value={terrain.id.toString()}>
                          {terrain.name} - {terrain.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Durée (min)</Label>
                    <Input
                      type="number"
                      value={newAppointment.duration}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, duration: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      value={newAppointment.price}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, price: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>Places disponibles</Label>
                  <Input
                    type="number"
                    value={newAppointment.maxParticipants}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, maxParticipants: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, notes: e.target.value })
                    }
                    placeholder="Informations complémentaires..."
                    className="mt-1.5"
                  />
                </div>

                <Button
                  onClick={handleCreateAppointment}
                  className="w-full bg-[#E9B782] hover:bg-[#d9a772]"
                >
                  Créer le rendez-vous
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-white/95 border-0">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-[#E9B782]" />
            <p className="text-gray-800 mb-0">{appointments.upcoming.length}</p>
            <p className="text-[10px] text-gray-600">À venir</p>
          </Card>
          <Card className="p-3 text-center bg-white/95 border-0">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <p className="text-gray-800 mb-0">{appointments.past.length}</p>
            <p className="text-[10px] text-gray-600">Terminés</p>
          </Card>
          <Card className="p-3 text-center bg-white/95 border-0">
            <XCircle className="h-5 w-5 mx-auto mb-1 text-red-600" />
            <p className="text-gray-800 mb-0">{appointments.cancelled.length}</p>
            <p className="text-[10px] text-gray-600">Annulés</p>
          </Card>
        </div>

        {/* Home Training Requests Button */}
        <Button
          onClick={() => onNavigate && onNavigate('clubHomeTrainingRequests')}
          className="w-full mt-3 bg-white/20 hover:bg-white/30 border border-white/40 text-white"
        >
          <Home className="h-4 w-4 mr-2" />
          Demandes à domicile
          <Badge className="ml-auto bg-orange-500 text-white border-0">
            3
          </Badge>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-4 bg-white shadow-sm">
            <TabsList className="w-full grid grid-cols-3 p-1 bg-gray-100 rounded-xl h-auto gap-1">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <Calendar className="h-4 w-4 mr-1.5" />
                À venir
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Passés
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <XCircle className="h-4 w-4 mr-1.5" />
                Annulés
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="px-4 py-4 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {appointments.upcoming.map((appt) => (
                <Card key={appt.id} className="p-4 shadow-md border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-[#E9B782]/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-6 w-6 text-[#E9B782]" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-800">{appt.service}</h4>
                        <p className="text-xs text-gray-600">{appt.date} à {appt.time}</p>
                      </div>
                    </div>
                    {getStatusBadge(appt.status)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{appt.client}</span>
                    </div>
                    {appt.dog !== 'Multiple' && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Dog className="h-4 w-4 text-gray-400" />
                        <span>{appt.dog}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appt.duration} - {appt.trainer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{appt.terrain}</span>
                    </div>
                    {appt.maxParticipants > 1 && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          {appt.participants}/{appt.maxParticipants} participants
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-gray-800">{appt.price}€</p>
                    <div className="flex gap-2">
                      {appt.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-[#41B6A6] hover:bg-[#359889] h-8">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmer
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <XCircle className="h-3 w-3 mr-1" />
                            Refuser
                          </Button>
                        </>
                      )}
                      {appt.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="outline" className="h-8">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Past Appointments */}
          <TabsContent value="past" className="px-4 py-4 space-y-3">
            {appointments.past.map((appt) => (
              <Card key={appt.id} className="p-4 shadow-sm border-0 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-800">{appt.service}</h4>
                      <p className="text-xs text-gray-600">{appt.date} à {appt.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(appt.status)}
                    {appt.paid && (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Payé
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{appt.client} - {appt.dog}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{appt.trainer}</span>
                    <span className="text-gray-800">{appt.price}€</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Cancelled Appointments */}
          <TabsContent value="cancelled" className="px-4 py-4 space-y-3">
            {appointments.cancelled.map((appt) => (
              <Card key={appt.id} className="p-4 shadow-sm border-0 bg-red-50 border-l-4 border-l-red-500">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-800">{appt.service}</h4>
                      <p className="text-xs text-gray-600">{appt.date} à {appt.time}</p>
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{appt.client} - {appt.dog}</span>
                  </div>
                  <div className="bg-white p-2 rounded text-xs">
                    <p className="text-gray-600 mb-1">
                      Annulé par: <span className="text-gray-800">{appt.cancelledBy === 'client' ? 'Client' : 'Club'}</span>
                    </p>
                    <p className="text-gray-600">Raison: {appt.cancelReason}</p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
