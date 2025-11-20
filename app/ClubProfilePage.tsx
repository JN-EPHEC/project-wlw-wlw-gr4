import { AlertCircle, Building2, Camera, CheckCircle, ChevronRight, Clock, CreditCard, DollarSign, Edit, FileText, Globe, Image as ImageIcon, LogOut, Mail, MapPin, Percent, Phone, Plus, Save, Shield, Smartphone, Star, Tag, Trash2, TrendingUp, Trophy, Upload, Users, Wallet, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface ClubProfilePageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onDeleteClub?: () => void;
}

export function ClubProfilePage({ onNavigate, onLogout, onDeleteClub }: ClubProfilePageProps = {}) {
  const [isEditing, setIsEditing] = useState(false);
  const [clubData, setClubData] = useState({
    name: 'Club Canin Paris 15',
    legalName: 'Association Club Canin Paris 15',
    siret: '123 456 789 00010',
    description: 'Club canin professionnel spécialisé dans l\'éducation canine, l\'agility et l\'obéissance. Notre équipe de professionnels diplômés accompagne les propriétaires et leurs chiens depuis plus de 15 ans.',
    email: 'contact@clubcaninparis15.fr',
    phone: '01 23 45 67 89',
    address: '123 Rue de la République',
    city: 'Paris',
    postalCode: '75015',
    website: 'www.clubcaninparis15.fr',
    openingHours: 'Lun-Sam: 9h-19h, Dim: 9h-13h',
    services: ['Éducation canine', 'Agility', 'Obéissance', 'Comportementalisme'],
    verified: true,
    memberSince: 'Janvier 2020',
    rating: 4.8,
    totalReviews: 156,
  });

  const [settings, setSettings] = useState({
    acceptNewMembers: true,
    showPhonePublic: true,
    autoConfirmBookings: false,
    emailNotifications: true,
    homeTrainingEnabled: true,
    maxGroupSize: '10',
    cancellationPolicy: '24h',
    requireDeposit: true,
    depositAmount: '20',
    language: 'fr',
  });

  const [bankInfo, setBankInfo] = useState({
    isConnected: false,
    accountHolder: '',
    iban: '',
    bic: '',
    bankName: '',
  });

  const [images] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500', title: 'Terrain d\'agility' },
    { id: 2, url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500', title: 'Séance de groupe' },
    { id: 3, url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=500', title: 'Nos installations' },
  ]);

  const [promotions] = useState([
    { id: 1, title: '-20% sur les forfaits mensuels', code: 'OCT2025', validUntil: '31 Oct 2025', discount: '20%', isActive: true },
    { id: 2, title: 'Première séance gratuite', code: 'FIRST', validUntil: '31 Déc 2025', discount: '100%', isActive: true },
  ]);

  const [terrains, setTerrains] = useState([
    { id: 1, name: 'Terrain principal', address: '123 Rue de la République, 75015 Paris', type: 'Agility', isDefault: true },
    { id: 2, name: 'Terrain de dressage', address: '45 Avenue du Parc, 75015 Paris', type: 'Éducation', isDefault: false },
  ]);

  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showTerrainDialog, setShowTerrainDialog] = useState(false);
  const [showBoostDialog, setShowBoostDialog] = useState(false);
  const [showBoostPaymentDialog, setShowBoostPaymentDialog] = useState(false);
  const [showBoostSuccessDialog, setShowBoostSuccessDialog] = useState(false);
  const [selectedBoostPlan, setSelectedBoostPlan] = useState<{days: number, price: number, title: string} | null>(null);
  const [boostStatus, setBoostStatus] = useState<{
    isActive: boolean;
    endDate: string;
    daysRemaining: number;
  }>({
    isActive: false,
    endDate: '',
    daysRemaining: 0,
  });
  const [newPromo, setNewPromo] = useState({
    title: '',
    code: '',
    validUntil: '',
    discount: '',
    discountType: 'percent',
  });
  const [newTerrain, setNewTerrain] = useState({
    name: '',
    address: '',
    type: '',
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleAddPromo = () => {
    console.log('Adding promo:', newPromo);
    setShowPromoDialog(false);
    setNewPromo({ title: '', code: '', validUntil: '', discount: '', discountType: 'percent' });
  };

  const handleAddTerrain = () => {
    const newTerrainData = {
      id: terrains.length + 1,
      ...newTerrain,
    };
    setTerrains([...terrains, newTerrainData]);
    setShowTerrainDialog(false);
    setNewTerrain({ name: '', address: '', type: '', isDefault: false });
  };

  const handleDeleteTerrain = (id: number) => {
    setTerrains(terrains.filter(t => t.id !== id));
  };

  const handleSetDefaultTerrain = (id: number) => {
    setTerrains(terrains.map(t => ({ ...t, isDefault: t.id === id })));
  };

  const handleSelectBoostPlan = (days: number, price: number, title: string) => {
    setSelectedBoostPlan({ days, price, title });
    setShowBoostDialog(false);
    setShowBoostPaymentDialog(true);
  };

  const handleConfirmBoostPayment = () => {
    if (selectedBoostPlan) {
      // Validation basique selon la méthode de paiement
      if (paymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
          alert('Veuillez remplir tous les champs de la carte');
          return;
        }
      }
      
      // Simuler le traitement du paiement
      // En production, appeler l'API de paiement ici
      
      // Calculer la date de fin
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedBoostPlan.days);
      
      setBoostStatus({
        isActive: true,
        endDate: endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        daysRemaining: selectedBoostPlan.days,
      });
      
      // Réinitialiser les données
      setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
      setPaymentMethod('card');
      
      setShowBoostPaymentDialog(false);
      setShowBoostSuccessDialog(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white">Mon Club</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-white hover:bg-white/20 rounded-full"
          >
            {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          </Button>
        </div>

        {/* Club Photo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg mx-auto">
            <div className="w-full h-full bg-white flex items-center justify-center">
              <Building2 className="h-12 w-12 text-[#E9B782]" />
            </div>
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Camera className="h-4 w-4 text-[#E9B782]" />
            </button>
          )}
        </div>

        <div className="text-center mt-4 text-white">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="mb-0">{clubData.name}</h2>
            {clubData.verified && (
              <Badge className="bg-white/20 text-white border-0">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{clubData.rating} ({clubData.totalReviews} avis)</span>
          </div>
          <p className="text-white/80 text-xs mt-1">Membre depuis {clubData.memberSince}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Leaderboard CTA */}
        <Card 
          className="p-4 border-0 shadow-sm bg-gradient-to-r from-purple-600 to-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate?.('clubLeaderboard')}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white">Classement Inter-Clubs</h3>
                <p className="text-white/90 text-sm">Voir votre position ce mois-ci</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6" />
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations générales</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700">Nom du club</Label>
              {isEditing ? (
                <Input
                  value={clubData.name}
                  onChange={(e) => setClubData({ ...clubData, name: e.target.value })}
                  className="mt-1.5"
                />
              ) : (
                <p className="text-sm text-gray-800 mt-1.5">{clubData.name}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-700">Raison sociale</Label>
              {isEditing ? (
                <Input
                  value={clubData.legalName}
                  onChange={(e) => setClubData({ ...clubData, legalName: e.target.value })}
                  className="mt-1.5"
                />
              ) : (
                <p className="text-sm text-gray-800 mt-1.5">{clubData.legalName}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-700">SIRET</Label>
              <p className="text-sm text-gray-600 mt-1.5">{clubData.siret}</p>
            </div>

            <div>
              <Label className="text-gray-700">Description</Label>
              {isEditing ? (
                <Textarea
                  value={clubData.description}
                  onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1.5">{clubData.description}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Coordonnées</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#E9B782] flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-gray-700 text-xs">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={clubData.email}
                    onChange={(e) => setClubData({ ...clubData, email: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-800">{clubData.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#E9B782] flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-gray-700 text-xs">Téléphone</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={clubData.phone}
                    onChange={(e) => setClubData({ ...clubData, phone: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-800">{clubData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#E9B782] flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-gray-700 text-xs">Adresse</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <Input
                      value={clubData.address}
                      onChange={(e) => setClubData({ ...clubData, address: e.target.value })}
                      placeholder="Adresse"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={clubData.postalCode}
                        onChange={(e) => setClubData({ ...clubData, postalCode: e.target.value })}
                        placeholder="Code postal"
                      />
                      <Input
                        value={clubData.city}
                        onChange={(e) => setClubData({ ...clubData, city: e.target.value })}
                        placeholder="Ville"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-800">
                    {clubData.address}, {clubData.postalCode} {clubData.city}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-[#E9B782] flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-gray-700 text-xs">Site web</Label>
                {isEditing ? (
                  <Input
                    value={clubData.website}
                    onChange={(e) => setClubData({ ...clubData, website: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-blue-600">{clubData.website}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#E9B782] flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-gray-700 text-xs">Horaires</Label>
                {isEditing ? (
                  <Input
                    value={clubData.openingHours}
                    onChange={(e) => setClubData({ ...clubData, openingHours: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-800">{clubData.openingHours}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Services proposés</h3>
          <div className="flex flex-wrap gap-2">
            {clubData.services.map((service, index) => (
              <Badge key={index} className="bg-[#E9B782]/10 text-[#E9B782] border-0">
                {service}
                {isEditing && (
                  <button className="ml-2 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {isEditing && (
              <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                + Ajouter
              </Button>
            )}
          </div>
        </Card>

        {/* Terrains Management */}
        <Card className="p-6 shadow-sm border-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Terrains</h3>
            <Dialog open={showTerrainDialog} onOpenChange={setShowTerrainDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%]">
                <DialogHeader>
                  <DialogTitle>Ajouter un terrain</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau terrain pour vos cours
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Nom du terrain</Label>
                    <Input
                      value={newTerrain.name}
                      onChange={(e) => setNewTerrain({ ...newTerrain, name: e.target.value })}
                      placeholder="Ex: Terrain principal"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Adresse complète</Label>
                    <Textarea
                      value={newTerrain.address}
                      onChange={(e) => setNewTerrain({ ...newTerrain, address: e.target.value })}
                      placeholder="Ex: 123 Rue de la République, 75015 Paris"
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label>Type de terrain</Label>
                    <Select
                      value={newTerrain.type}
                      onValueChange={(value: string) => setNewTerrain({ ...newTerrain, type: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agility">Agility</SelectItem>
                        <SelectItem value="Éducation">Éducation</SelectItem>
                        <SelectItem value="Obéissance">Obéissance</SelectItem>
                        <SelectItem value="Comportement">Comportement</SelectItem>
                        <SelectItem value="Multi-usage">Multi-usage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddTerrain}
                    className="w-full bg-[#E9B782] hover:bg-[#d9a772]"
                    disabled={!newTerrain.name || !newTerrain.address || !newTerrain.type}
                  >
                    Ajouter le terrain
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-3">
            {terrains.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Aucun terrain enregistré. Ajoutez vos terrains pour faciliter la gestion des cours.
                </p>
              </div>
            ) : (
              terrains.map((terrain) => (
                <Card key={terrain.id} className="p-4 border-0 shadow-sm bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#E9B782]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#E9B782]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-gray-800">{terrain.name}</h4>
                        <div className="flex items-center gap-1">
                          {terrain.isDefault && (
                            <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0 text-xs">
                              Par défaut
                            </Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleDeleteTerrain(terrain.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{terrain.address}</p>
                      <Badge className="bg-gray-200 text-gray-700 border-0">
                        {terrain.type}
                      </Badge>
                      {!terrain.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7 text-xs"
                          onClick={() => handleSetDefaultTerrain(terrain.id)}
                        >
                          Définir par défaut
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        {/* Teachers Management */}
        {onNavigate && (
          <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white border-l-4 border-l-[#E9B782]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#E9B782]" />
                <h3 className="text-gray-800">Gestion des professeurs</h3>
              </div>
              <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0">2 gratuits</Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Ajoutez et gérez les professeurs de votre club. Chaque professeur reçoit ses propres identifiants de connexion.
            </p>
            
            <Button
              onClick={() => onNavigate('clubTeachers')}
              className="w-full bg-[#E9B782] hover:bg-[#d9a772]"
            >
              <Users className="h-4 w-4 mr-2" />
              Gérer mes professeurs
            </Button>
          </Card>
        )}

        {/* Settings */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Paramètres généraux</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Accepter nouveaux membres</Label>
                <p className="text-xs text-gray-600">Autoriser les inscriptions</p>
              </div>
              <Switch
                checked={settings.acceptNewMembers}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, acceptNewMembers: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Téléphone public</Label>
                <p className="text-xs text-gray-600">Visible sur votre profil</p>
              </div>
              <Switch
                checked={settings.showPhonePublic}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, showPhonePublic: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Confirmation auto RDV</Label>
                <p className="text-xs text-gray-600">Valider automatiquement</p>
              </div>
              <Switch
                checked={settings.autoConfirmBookings}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, autoConfirmBookings: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Notifications email</Label>
                <p className="text-xs text-gray-600">Recevoir les alertes</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Cours à domicile</Label>
                <p className="text-xs text-gray-600">Autoriser les demandes de cours à domicile</p>
              </div>
              <Switch
                checked={settings.homeTrainingEnabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, homeTrainingEnabled: checked })
                }
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-[#E9B782]" />
                <Label className="text-gray-800">Taille max des groupes</Label>
              </div>
              <Select value={settings.maxGroupSize} onValueChange={(value: string) => setSettings({ ...settings, maxGroupSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 participants</SelectItem>
                  <SelectItem value="8">8 participants</SelectItem>
                  <SelectItem value="10">10 participants</SelectItem>
                  <SelectItem value="15">15 participants</SelectItem>
                  <SelectItem value="20">20 participants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[#E9B782]" />
                <Label className="text-gray-800">Politique d'annulation</Label>
              </div>
              <Select value={settings.cancellationPolicy} onValueChange={(value: string) => setSettings({ ...settings, cancellationPolicy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12h avant - Remboursement total</SelectItem>
                  <SelectItem value="24h">24h avant - Remboursement total</SelectItem>
                  <SelectItem value="48h">48h avant - Remboursement total</SelectItem>
                  <SelectItem value="72h">72h avant - Remboursement total</SelectItem>
                  <SelectItem value="7days">7 jours avant - Remboursement total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-[#E9B782]" />
                <Label className="text-gray-800">Langue</Label>
              </div>
              <Select value={settings.language} onValueChange={(value: string) => setSettings({ ...settings, language: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card className="p-6 shadow-sm border-0">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-[#E9B782]" />
            <h3 className="text-gray-800">Paramètres de paiement</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-800">Acompte requis</Label>
                <p className="text-xs text-gray-600">Demander un acompte à la réservation</p>
              </div>
              <Switch
                checked={settings.requireDeposit}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, requireDeposit: checked })
                }
              />
            </div>

            {settings.requireDeposit && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-[#E9B782]" />
                  <Label className="text-gray-800">Montant de l'acompte</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={settings.depositAmount}
                    onChange={(e) => setSettings({ ...settings, depositAmount: e.target.value })}
                    className="flex-1"
                  />
                  <Select defaultValue="percent">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="euro">€</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Bank Account Connection */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h3 className="text-gray-800">Compte bancaire</h3>
          </div>

          {!bankInfo.isConnected ? (
            <div>
              <div className="flex items-start gap-3 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">
                    Connectez votre compte bancaire pour recevoir vos paiements
                  </p>
                  <p className="text-xs text-blue-700">
                    Les paiements seront versés directement sur votre compte sous 2-3 jours ouvrés.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Titulaire du compte</Label>
                  <Input
                    value={bankInfo.accountHolder}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                    placeholder="Nom du titulaire"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">IBAN</Label>
                  <Input
                    value={bankInfo.iban}
                    onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">BIC/SWIFT</Label>
                  <Input
                    value={bankInfo.bic}
                    onChange={(e) => setBankInfo({ ...bankInfo, bic: e.target.value })}
                    placeholder="XXXXXXXX"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Nom de la banque</Label>
                  <Input
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                    placeholder="Ex: Crédit Agricole"
                    className="mt-1.5"
                  />
                </div>

                <Button
                  onClick={() => setBankInfo({ ...bankInfo, isConnected: true })}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Connecter mon compte bancaire
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3 mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900 mb-1">
                    Compte bancaire connecté
                  </p>
                  <p className="text-xs text-green-700">
                    Vous recevez vos paiements automatiquement.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                <div>
                  <Label className="text-gray-600 text-xs">Titulaire</Label>
                  <p className="text-sm text-gray-800">{bankInfo.accountHolder || 'Association Club Canin Paris 15'}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">IBAN</Label>
                  <p className="text-sm text-gray-800">FR76 •••• •••• •••• •••• •••• 123</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">Banque</Label>
                  <p className="text-sm text-gray-800">{bankInfo.bankName || 'Crédit Agricole'}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBankInfo({ ...bankInfo, isConnected: false })}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Déconnecter
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Sécurité :</strong> Vos informations bancaires sont cryptées et sécurisées. Nous ne stockons jamais vos données bancaires complètes.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Frais :</strong> Smart Dogs prélève 5% de commission sur chaque transaction.
            </p>
          </div>
        </Card>

        {/* Boost Section */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h3 className="text-gray-800">Booster mon club</h3>
            <Badge className="bg-yellow-500 text-white border-0 text-xs">Premium</Badge>
          </div>

          {boostStatus.isActive ? (
            <div>
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-900 mb-1">
                      <strong>Votre club est boosté !</strong>
                    </p>
                    <p className="text-xs text-green-700">
                      Actif jusqu'au {boostStatus.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-700">En tête des résultats</span>
                  </div>
                  <Badge className="bg-yellow-500 text-white border-0 text-xs">
                    {boostStatus.daysRemaining} jours restants
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={() => setShowBoostDialog(true)}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                Prolonger mon boost
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700 mb-4">
                Augmentez votre visibilité et attirez plus de clients en boostant votre annonce !
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                  <span>Apparaissez en tête des résultats</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span>Badge "Club mis en avant"</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-yellow-600" />
                  <span>+300% de visibilité en moyenne</span>
                </div>
              </div>

              <Button
                onClick={() => setShowBoostDialog(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Booster mon annonce
              </Button>
            </div>
          )}

          {/* Dialog de sélection du plan */}
          <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
            <DialogContent className="max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Booster votre club</DialogTitle>
                <DialogDescription>
                  Choisissez la durée de votre boost pour maximiser votre visibilité.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <Card 
                    className="p-4 border-2 border-yellow-300 hover:border-yellow-400 cursor-pointer transition-all"
                    onClick={() => handleSelectBoostPlan(7, 9, 'Boost 7 jours')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-gray-800">Boost 7 jours</h4>
                        <p className="text-xs text-gray-600">1 semaine de visibilité maximale</p>
                      </div>
                      <p className="text-yellow-600">9€</p>
                    </div>
                    <p className="text-xs text-gray-500">~1.30€/jour</p>
                  </Card>

                  <Card 
                    className="p-4 border-2 border-yellow-400 bg-yellow-50 hover:border-yellow-500 cursor-pointer transition-all relative"
                    onClick={() => handleSelectBoostPlan(30, 30, 'Boost 30 jours')}
                  >
                    <Badge className="absolute -top-2 right-2 bg-green-500 text-white border-0 text-xs">
                      Populaire
                    </Badge>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-gray-800">Boost 30 jours</h4>
                        <p className="text-xs text-gray-600">1 mois complet</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">30€</p>
                        <p className="text-xs text-gray-500 line-through">39€</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">Économisez 23% · ~1€/jour</p>
                  </Card>

                  <Card 
                    className="p-4 border-2 border-yellow-300 hover:border-yellow-400 cursor-pointer transition-all"
                    onClick={() => handleSelectBoostPlan(90, 75, 'Boost 90 jours')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-gray-800">Boost 90 jours</h4>
                        <p className="text-xs text-gray-600">3 mois de visibilité</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-600">75€</p>
                        <p className="text-xs text-gray-500 line-through">117€</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600">Économisez 36% · ~0.83€/jour</p>
                  </Card>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                  <strong>Inclus :</strong> Badge premium, position en tête, statistiques détaillées
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog de paiement */}
          <Dialog open={showBoostPaymentDialog} onOpenChange={setShowBoostPaymentDialog}>
            <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Paiement sécurisé</DialogTitle>
                <DialogDescription>
                  Choisissez votre mode de paiement
                </DialogDescription>
              </DialogHeader>
              
              {selectedBoostPlan && (
                <div className="space-y-4 py-4">
                  {/* Résumé compact */}
                  <Card className="p-3 bg-yellow-50 border border-yellow-300 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-800">{selectedBoostPlan.title}</p>
                          <p className="text-xs text-gray-600">{selectedBoostPlan.days} jours</p>
                        </div>
                      </div>
                      <p className="text-gray-800"><strong>{(selectedBoostPlan.price * 1.2).toFixed(2)}€</strong></p>
                    </div>
                  </Card>

                  {/* Méthodes de paiement rapide */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 uppercase tracking-wide">Paiement express</p>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {/* Apple Pay */}
                      <Button
                        variant="outline"
                        className={`h-14 flex-col gap-1 transition-all ${
                          paymentMethod === 'apple' 
                            ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5' 
                            : 'border-2 border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('apple')}
                      >
                        <Smartphone className="h-5 w-5" />
                        <span className="text-xs">Apple Pay</span>
                      </Button>

                      {/* Google Pay */}
                      <Button
                        variant="outline"
                        className={`h-14 flex-col gap-1 transition-all ${
                          paymentMethod === 'google' 
                            ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5' 
                            : 'border-2 border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('google')}
                      >
                        <Wallet className="h-5 w-5" />
                        <span className="text-xs">Google Pay</span>
                      </Button>

                      {/* PayPal */}
                      <Button
                        variant="outline"
                        className={`h-14 flex-col gap-1 transition-all ${
                          paymentMethod === 'paypal' 
                            ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5' 
                            : 'border-2 border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <DollarSign className="h-5 w-5" />
                        <span className="text-xs">PayPal</span>
                      </Button>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs text-gray-500">ou par carte bancaire</span>
                    </div>
                  </div>

                  {/* Carte bancaire */}
                  <Button
                    variant="outline"
                    className={`w-full h-14 justify-start gap-3 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5' 
                        : 'border-2 border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Carte bancaire</span>
                  </Button>

                  {/* Formulaire de carte (si sélectionné) */}
                  {paymentMethod === 'card' && (
                    <Card className="p-4 space-y-4 border-2 border-[#41B6A6]/20 bg-gradient-to-br from-[#41B6A6]/5 to-white shadow-sm">
                      <div>
                        <Label className="text-xs text-gray-700">Numéro de carte</Label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '');
                            const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                            setCardDetails({ ...cardDetails, number: formatted });
                          }}
                          maxLength={19}
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-700">Nom sur la carte</Label>
                        <Input
                          placeholder="JEAN DUPONT"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                          className="mt-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-700">Expiration</Label>
                          <Input
                            placeholder="MM/AA"
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setCardDetails({ ...cardDetails, expiry: value });
                            }}
                            maxLength={5}
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label className="text-xs text-gray-700">CVV</Label>
                          <Input
                            type="password"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                            maxLength={3}
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-900">
                          Paiement 100% sécurisé. Vos données sont cryptées et ne sont jamais stockées.
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Message selon la méthode */}
                  {paymentMethod === 'apple' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-700 text-center">
                        Vous serez redirigé vers Apple Pay pour finaliser le paiement
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'google' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-700 text-center">
                        Vous serez redirigé vers Google Pay pour finaliser le paiement
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-700 text-center">
                        Vous serez redirigé vers PayPal pour finaliser le paiement
                      </p>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowBoostPaymentDialog(false);
                        setShowBoostDialog(true);
                        setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
                        setPaymentMethod('card');
                      }}
                    >
                      Retour
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-[#41B6A6] to-[#359889] hover:opacity-90 text-white transition-opacity"
                      onClick={handleConfirmBoostPayment}
                    >
                      {paymentMethod === 'card' && <CreditCard className="h-4 w-4 mr-2" />}
                      {paymentMethod === 'apple' && <Smartphone className="h-4 w-4 mr-2" />}
                      {paymentMethod === 'google' && <Wallet className="h-4 w-4 mr-2" />}
                      {paymentMethod === 'paypal' && <DollarSign className="h-4 w-4 mr-2" />}
                      Payer {(selectedBoostPlan.price * 1.2).toFixed(2)}€
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Dialog de succès */}
          <Dialog open={showBoostSuccessDialog} onOpenChange={setShowBoostSuccessDialog}>
            <DialogContent className="max-w-[90%]">
              <DialogHeader>
                <DialogTitle className="sr-only">Boost activé</DialogTitle>
                <DialogDescription className="sr-only">
                  Votre club a été boosté avec succès
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-gray-800 mb-2">Boost activé avec succès !</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Votre club est maintenant boosté jusqu'au {boostStatus.endDate}
                </p>

                <div className="space-y-3 mb-6">
                  <Card className="p-4 bg-green-50 border border-green-200 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-900 mb-1">
                          <strong>Votre club apparaît en tête des résultats</strong>
                        </p>
                        <p className="text-xs text-green-700">
                          Les utilisateurs vous verront en premier lors de leurs recherches
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-yellow-50 border border-yellow-200 text-left">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-900 mb-1">
                          <strong>Badge premium activé</strong>
                        </p>
                        <p className="text-xs text-yellow-700">
                          Votre profil affiche le badge "Club mis en avant"
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-blue-50 border border-blue-200 text-left">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 mb-1">
                          <strong>Statistiques disponibles</strong>
                        </p>
                        <p className="text-xs text-blue-700">
                          Consultez vos performances dans "Mon Club"
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Button
                  onClick={() => setShowBoostSuccessDialog(false)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  Super, compris !
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>

        {/* Gallery Section */}
        <Card className="p-6 shadow-sm border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[#E9B782]" />
              <h3 className="text-gray-800">Galerie photos</h3>
            </div>
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <Upload className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%]">
                <DialogHeader>
                  <DialogTitle>Ajouter une photo</DialogTitle>
                  <DialogDescription>
                    Ajoutez des photos de votre club pour attirer plus de clients.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#E9B782] transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Cliquez pour uploader une image</p>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                  </div>
                  <div>
                    <Label>Titre de la photo</Label>
                    <Input placeholder="Ex: Notre terrain d'agility" className="mt-1.5" />
                  </div>
                  <Button className="w-full bg-[#E9B782] hover:bg-[#d9a772]">
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader la photo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Trash2 className="h-3 w-3 text-white" />
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">{image.title}</p>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            {images.length}/12 photos · Les photos de qualité augmentent vos réservations de 40%
          </p>
        </Card>

        {/* Promotions Section */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              <h3 className="text-gray-800">Promotions</h3>
            </div>
            <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700">
                  <Tag className="h-3 w-3 mr-1" />
                  Créer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%]">
                <DialogHeader>
                  <DialogTitle>Nouvelle promotion</DialogTitle>
                  <DialogDescription>
                    Créez une promotion pour attirer de nouveaux clients.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Titre de la promotion</Label>
                    <Input
                      value={newPromo.title}
                      onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                      placeholder="Ex: -20% sur les forfaits mensuels"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Code promo</Label>
                    <Input
                      value={newPromo.code}
                      onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                      placeholder="Ex: OCT2025"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Réduction</Label>
                      <Input
                        type="number"
                        value={newPromo.discount}
                        onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
                        placeholder="20"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select 
                        value={newPromo.discountType} 
                        onValueChange={(value: string) => setNewPromo({ ...newPromo, discountType: value })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">Pourcentage (%)</SelectItem>
                          <SelectItem value="euro">Euros (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Valide jusqu'au</Label>
                    <Input
                      type="date"
                      value={newPromo.validUntil}
                      onChange={(e) => setNewPromo({ ...newPromo, validUntil: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <Button
                    onClick={handleAddPromo}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Créer la promotion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <Card key={promo.id} className="p-4 border-2 border-purple-200 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-gray-800">{promo.title}</h4>
                        {promo.isActive && (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                          {promo.code}
                        </Badge>
                        <span className="text-xs text-gray-600">-{promo.discount}</span>
                      </div>
                      <p className="text-xs text-gray-500">Valide jusqu'au {promo.validUntil}</p>
                    </div>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune promotion active
              </p>
            )}
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-900">
              <strong>Conseil :</strong> Les clubs avec promotions actives reçoivent 60% de réservations en plus !
            </p>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <h3 className="text-gray-800 mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl text-gray-800 mb-1">127</p>
              <p className="text-xs text-gray-600">Membres actifs</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl text-gray-800 mb-1">456</p>
              <p className="text-xs text-gray-600">Séances réalisées</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl text-gray-800 mb-1">4.8</p>
              <p className="text-xs text-gray-600">Note moyenne</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-2xl text-gray-800 mb-1">98%</p>
              <p className="text-xs text-gray-600">Satisfaction</p>
            </div>
          </div>
        </Card>

        {isEditing && (
          <div className="flex gap-3">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#E9B782] hover:bg-[#d9a772]"
            >
              Enregistrer
            </Button>
          </div>
        )}

        {/* Account Actions */}
        {!isEditing && (
          <div className="space-y-3">
            {/* Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>

            {/* Delete Club Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon club
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90%]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer définitivement votre club ?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>
                      Cette action est <strong>irréversible</strong>. Toutes vos données seront définitivement supprimées :
                    </p>
                    <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                      <li>Profil et informations du club</li>
                      <li>Tous vos membres et professeurs</li>
                      <li>Historique des réservations</li>
                      <li>Statistiques et évaluations</li>
                      <li>Photos et promotions</li>
                      <li>Communauté et messages</li>
                    </ul>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-900">
                        <strong>⚠️ Attention :</strong> Les paiements en cours seront annulés et vos membres seront notifiés.
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="flex-1">
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteClub}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Oui, supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Warning text */}
            <p className="text-xs text-gray-500 text-center pt-2">
              Besoin d'aide ? Contactez notre support à support@smartdogs.fr
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
