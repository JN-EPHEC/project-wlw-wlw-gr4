import { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, MapPin, Dog, User, Phone, Mail, Edit, Trash2, CheckCircle, XCircle, ChevronRight, DollarSign, Building2, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TeacherAppointmentsPageProps {
  onNavigate?: (page: string) => void;
}

export function TeacherAppointmentsPage({ onNavigate }: TeacherAppointmentsPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [clubFilter, setClubFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const [newClass, setNewClass] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    terrain: '',
    price: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    dogName: '',
    dogBreed: '',
    notes: '',
    club: 'none',
  });

  const terrains = [
    { id: 1, name: 'Terrain principal', address: '123 Rue de la République, 75015 Paris', clubId: 1 },
    { id: 2, name: 'Terrain de dressage', address: '45 Avenue du Parc, 75015 Paris', clubId: 1 },
    { id: 3, name: 'Parc de la Tête d\'Or', address: 'Lyon', clubId: null },
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: 'Éducation de base',
      client: 'Marie Dubois',
      phone: '06 12 34 56 78',
      email: 'marie.dubois@email.com',
      dog: 'Max',
      breed: 'Golden Retriever',
      age: '6 mois',
      date: '2024-11-05',
      time: '14:00',
      duration: '60 min',
      location: 'Parc de la Tête d\'Or',
      terrain: 'Parc de la Tête d\'Or',
      status: 'confirmed',
      price: 45,
      notes: 'Première séance, chien très joueur',
      club: null,
    },
    {
      id: 2,
      title: 'Agility niveau 2',
      client: 'Thomas Martin',
      phone: '06 98 76 54 32',
      email: 'thomas.martin@email.com',
      dog: 'Luna',
      breed: 'Border Collie',
      age: '2 ans',
      date: '2024-11-06',
      time: '10:30',
      duration: '90 min',
      location: 'Club Canin Lyon Sud',
      terrain: 'Terrain principal',
      status: 'confirmed',
      price: 55,
      notes: 'Objectif : parcours complet',
      club: 'Club Canin Lyon Sud',
      clubId: 1,
    },
    {
      id: 3,
      title: 'Comportement agressif',
      client: 'Sophie Laurent',
      phone: '06 23 45 67 89',
      email: 'sophie.laurent@email.com',
      dog: 'Rex',
      breed: 'Berger Allemand',
      age: '3 ans',
      date: '2024-11-06',
      time: '16:00',
      duration: '120 min',
      location: 'À domicile',
      terrain: 'À domicile',
      status: 'pending',
      price: 65,
      notes: 'Agressivité envers les autres chiens',
      club: null,
    },
  ];

  const pastClasses = [
    {
      id: 4,
      title: 'Rappel avancé',
      client: 'Jean Dupont',
      dog: 'Bella',
      breed: 'Labrador',
      date: '2024-11-01',
      time: '15:00',
      status: 'completed',
      price: 45,
      paid: true,
    },
    {
      id: 5,
      title: 'Socialisation',
      client: 'Claire Martin',
      dog: 'Milo',
      breed: 'Beagle',
      date: '2024-10-28',
      time: '11:00',
      status: 'completed',
      price: 40,
      paid: true,
    },
  ];

  const handleAddClass = () => {
    // Logic to add new class
    console.log('Adding new class:', newClass);
    setShowAddDialog(false);
    setNewClass({
      title: '',
      date: '',
      time: '',
      duration: '60',
      location: '',
      terrain: '',
      price: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      dogName: '',
      dogBreed: '',
      notes: '',
      club: 'none',
    });
  };

  const handleViewDetails = (classItem: any) => {
    setSelectedClass(classItem);
    setShowDetailDialog(true);
  };

  const handleDeleteClass = (id: number) => {
    // Logic to delete class
    console.log('Deleting class:', id);
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white">Mes cours</h1>
            <p className="text-white/80 text-sm mt-1">Gérez vos rendez-vous</p>
          </div>
          <Button 
            className="bg-white text-[#41B6A6] hover:bg-white/90"
            size="sm"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>

        {/* Club Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={clubFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClubFilter('all')}
            className={clubFilter === 'all' ? 'bg-white text-[#41B6A6] hover:bg-white/90 shrink-0' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0'}
          >
            Tous
          </Button>
          <Button
            variant={clubFilter === 'independent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClubFilter('independent')}
            className={clubFilter === 'independent' ? 'bg-white text-[#41B6A6] hover:bg-white/90 shrink-0' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0'}
          >
            Indépendant
          </Button>
          <Button
            variant={clubFilter === '1' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClubFilter('1')}
            className={clubFilter === '1' ? 'bg-white text-[#41B6A6] hover:bg-white/90 shrink-0' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0'}
          >
            <Building2 className="h-3 w-3 mr-1" />
            Club Canin Lyon Sud
          </Button>
          <Button
            variant={clubFilter === '2' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClubFilter('2')}
            className={clubFilter === '2' ? 'bg-white text-[#41B6A6] hover:bg-white/90 shrink-0' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0'}
          >
            <Building2 className="h-3 w-3 mr-1" />
            Éducation Canine Rhône-Alpes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 pt-4 z-10">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="upcoming">À venir ({upcomingClasses.length})</TabsTrigger>
              <TabsTrigger value="past">Historique ({pastClasses.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="px-4 py-4 space-y-3 mt-0">
            {upcomingClasses.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucun cours prévu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Commencez par ajouter votre premier cours
                </p>
                <Button 
                  className="bg-[#41B6A6] hover:bg-[#359889] text-white"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un cours
                </Button>
              </Card>
            ) : (
              upcomingClasses
                .filter((classItem) => {
                  if (clubFilter === 'all') return true;
                  if (clubFilter === 'independent') return !classItem.club;
                  return classItem.clubId?.toString() === clubFilter;
                })
                .map((classItem) => (
                <Card 
                  key={classItem.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                  onClick={() => handleViewDetails(classItem)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] p-3 rounded-xl text-white text-center min-w-[60px]">
                      <p className="text-xs">{new Date(classItem.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-lg">{classItem.time}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-800">{classItem.title}</h4>
                          <p className="text-sm text-gray-600">{classItem.client}</p>
                        </div>
                        {classItem.status === 'confirmed' ? (
                          <Badge className="bg-green-100 text-green-700 border-0 shrink-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmé
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-0 shrink-0">
                            <Clock className="h-3 w-3 mr-1" />
                            En attente
                          </Badge>
                        )}
                      </div>

                      {classItem.club && (
                        <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0 mb-2">
                          <Building2 className="h-3 w-3 mr-1" />
                          {classItem.club}
                        </Badge>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Dog className="h-3.5 w-3.5" />
                          <span>{classItem.dog} - {classItem.breed}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{classItem.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{classItem.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Tarif</span>
                        <span className="text-[#41B6A6]">{classItem.price}€</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="px-4 py-4 space-y-3 mt-0">
            {pastClasses.map((classItem) => (
              <Card 
                key={classItem.id}
                className="p-4 border-0 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-gray-800">{classItem.title}</h4>
                        <p className="text-sm text-gray-600">{classItem.client}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 border-0 shrink-0">Terminé</Badge>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Dog className="h-3.5 w-3.5" />
                        <span>{classItem.dog} - {classItem.breed}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(classItem.date).toLocaleDateString('fr-FR')} à {classItem.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Tarif</span>
                        {classItem.paid && (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Payé
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-800">{classItem.price}€</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Class Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un cours</DialogTitle>
            <DialogDescription>
              Planifiez une nouvelle séance d'éducation canine
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Informations du cours */}
            <div>
              <Label>Type de cours</Label>
              <Input
                placeholder="Ex: Éducation de base, Agility..."
                value={newClass.title}
                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newClass.date}
                  onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={newClass.time}
                  onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Durée (minutes)</Label>
                <Select value={newClass.duration} onValueChange={(value) => setNewClass({ ...newClass, duration: value })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                    <SelectItem value="120">120 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  placeholder="45"
                  value={newClass.price}
                  onChange={(e) => setNewClass({ ...newClass, price: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Club (optionnel)</Label>
              <Select value={newClass.club} onValueChange={(value) => setNewClass({ ...newClass, club: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Aucun - Cours indépendant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun - Cours indépendant</SelectItem>
                  <SelectItem value="club1">Club Canin Lyon Sud</SelectItem>
                  <SelectItem value="club2">Éducation Canine Rhône-Alpes</SelectItem>
                  <SelectItem value="club3">Club d'Agility de Lyon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Terrain</Label>
              <Select 
                value={newClass.terrain} 
                onValueChange={(value) => setNewClass({ ...newClass, terrain: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Sélectionner un terrain" />
                </SelectTrigger>
                <SelectContent>
                  {terrains
                    .filter(t => newClass.club === 'none' ? t.clubId === null : true)
                    .map((terrain) => (
                      <SelectItem key={terrain.id} value={terrain.name}>
                        {terrain.name} - {terrain.address}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations client */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-gray-800 mb-3">Informations client</h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Nom du client</Label>
                  <Input
                    placeholder="Jean Dupont"
                    value={newClass.clientName}
                    onChange={(e) => setNewClass({ ...newClass, clientName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      placeholder="06 12 34 56 78"
                      value={newClass.clientPhone}
                      onChange={(e) => setNewClass({ ...newClass, clientPhone: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Email (opt.)</Label>
                    <Input
                      type="email"
                      placeholder="email@exemple.fr"
                      value={newClass.clientEmail}
                      onChange={(e) => setNewClass({ ...newClass, clientEmail: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informations chien */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-gray-800 mb-3">Informations sur le chien</h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nom du chien</Label>
                    <Input
                      placeholder="Max"
                      value={newClass.dogName}
                      onChange={(e) => setNewClass({ ...newClass, dogName: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Race</Label>
                    <Input
                      placeholder="Golden Retriever"
                      value={newClass.dogBreed}
                      onChange={(e) => setNewClass({ ...newClass, dogBreed: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                placeholder="Informations importantes, objectifs du cours..."
                value={newClass.notes}
                onChange={(e) => setNewClass({ ...newClass, notes: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowAddDialog(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] text-white"
              onClick={handleAddClass}
            >
              Ajouter le cours
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Class Detail Dialog */}
      {selectedClass && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedClass.title}</DialogTitle>
              <DialogDescription>
                Détails de la séance
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Statut</span>
                {selectedClass.status === 'confirmed' ? (
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmé
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente
                  </Badge>
                )}
              </div>

              {/* Date & Time */}
              <Card className="p-3 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/10 to-white">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#41B6A6]" />
                  <div>
                    <p className="text-sm text-gray-600">Date et heure</p>
                    <p className="text-gray-800">
                      {new Date(selectedClass.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-gray-800">{selectedClass.time} - {selectedClass.duration}</p>
                  </div>
                </div>
              </Card>

              {/* Location */}
              <Card className="p-3 border-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lieu</p>
                    <p className="text-gray-800">{selectedClass.location}</p>
                    {selectedClass.club && (
                      <Badge className="mt-1 bg-[#E9B782] text-white border-0">
                        {selectedClass.club}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Client Info */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-gray-800 mb-3">Informations client</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-800">{selectedClass.client}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${selectedClass.phone}`} className="text-sm text-[#41B6A6] hover:underline">
                      {selectedClass.phone}
                    </a>
                  </div>
                  {selectedClass.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href={`mailto:${selectedClass.email}`} className="text-sm text-[#41B6A6] hover:underline">
                        {selectedClass.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Dog Info */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-gray-800 mb-3">Informations sur le chien</h4>
                <Card className="p-3 border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-white">
                  <div className="flex items-center gap-3">
                    <Dog className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-gray-800">{selectedClass.dog}</p>
                      <p className="text-sm text-gray-600">{selectedClass.breed} - {selectedClass.age}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Notes */}
              {selectedClass.notes && (
                <div className="pt-2 border-t border-gray-200">
                  <h4 className="text-gray-800 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedClass.notes}
                  </p>
                </div>
              )}

              {/* Price */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Tarif</span>
                  </div>
                  <span className="text-green-600">{selectedClass.price}€</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce cours ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Le cours sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        handleDeleteClass(selectedClass.id);
                        setShowDetailDialog(false);
                      }}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>

              <Button
                size="sm"
                className="flex-1 bg-[#41B6A6] hover:bg-[#359889] text-white"
                onClick={() => setShowDetailDialog(false)}
              >
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
