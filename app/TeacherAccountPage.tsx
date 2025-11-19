import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, DollarSign, TrendingUp, Download, Eye, Edit, Save, X, Camera, LogOut, Trash2, ChevronRight, Building2, Star, Award, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TeacherAccountPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export function TeacherAccountPage({ onNavigate, onLogout, onDeleteAccount }: TeacherAccountPageProps = {}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '06 12 34 56 78',
    city: 'Lyon',
    bio: 'Éducateur canin professionnel depuis 10 ans, spécialisé en comportement et agility.',
    specialties: ['Éducation de base', 'Agility', 'Comportement'],
    experience: '10 ans',
    certifications: ['BPJEPS', 'Certificat de capacité'],
  });

  const [bankInfo, setBankInfo] = useState({
    accountHolder: 'Pierre Durand',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPP',
    paymentMethod: 'virement',
  });

  const earnings = {
    thisMonth: 1240,
    lastMonth: 1180,
    thisYear: 12450,
    pending: 245,
  };

  const transactions = [
    { id: 1, date: '2024-11-04', description: 'Cours - Marie Dubois', amount: 45, status: 'completed' },
    { id: 2, date: '2024-11-03', description: 'Cours - Thomas Martin', amount: 55, status: 'completed' },
    { id: 3, date: '2024-11-02', description: 'Cours collectif (5 participants)', amount: 150, status: 'completed' },
    { id: 4, date: '2024-11-01', description: 'Cours - Sophie Laurent', amount: 65, status: 'pending' },
  ];

  const stats = {
    totalClients: 45,
    totalCourses: 156,
    averageRating: 4.9,
    totalReviews: 38,
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl">
              PD
            </div>
            {!isEditing && (
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg">
                <Camera className="h-3.5 w-3.5 text-[#41B6A6]" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-white">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white/20 text-white border-0">
                <Shield className="h-3 w-3 mr-1" />
                Éducateur certifié
              </Badge>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white">{stats.averageRating}</span>
              <span className="text-white/70 text-sm">({stats.totalReviews} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="profile" className="w-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 pt-4 z-10">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="payments">Paiements</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="px-4 py-4 space-y-4 mt-0">
            {/* Leaderboard CTA */}
            <Card 
              className="p-4 border-0 shadow-sm bg-gradient-to-r from-[#E9B782] to-[#d9a772] cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate?.('teacherLeaderboard')}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-white">Classement des éducateurs</h3>
                    <p className="text-white/90 text-sm">Voir ta position ce mois-ci</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-0 shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowStatsDialog(true)}>
                <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-2" />
                <p className="text-gray-800">{stats.totalCourses}</p>
                <p className="text-xs text-gray-600">Cours donnés</p>
              </Card>

              <Card className="p-4 border-0 shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowStatsDialog(true)}>
                <User className="h-5 w-5 text-[#41B6A6] mx-auto mb-2" />
                <p className="text-gray-800">{stats.totalClients}</p>
                <p className="text-xs text-gray-600">Clients</p>
              </Card>
            </div>

            {/* Profile Info */}
            <Card className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Informations personnelles</h3>
                {!isEditing ? (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button size="sm" className="bg-[#41B6A6] hover:bg-[#359889] text-white" onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Nom complet</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Ville</Label>
                      <Input
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Présentation</Label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="mt-1.5 min-h-[80px]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-800">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-800">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-800">{profile.city}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{profile.bio}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Specialties */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-3">Spécialités</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-3">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-800">{cert}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="px-4 py-4 space-y-4 mt-0">
            {/* Earnings Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
                <DollarSign className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-gray-800">{earnings.thisMonth}€</p>
                <p className="text-xs text-gray-600">Ce mois</p>
              </Card>

              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/10 to-white">
                <TrendingUp className="h-5 w-5 text-[#41B6A6] mb-2" />
                <p className="text-gray-800">{earnings.thisYear}€</p>
                <p className="text-xs text-gray-600">Cette année</p>
              </Card>
            </div>

            {/* Pending */}
            {earnings.pending > 0 && (
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-white border-l-4 border-l-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paiement en attente</p>
                    <p className="text-gray-800">{earnings.pending}€</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 border-0">
                    En cours
                  </Badge>
                </div>
              </Card>
            )}

            {/* Bank Info */}
            <Card className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">Informations bancaires</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPaymentDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">IBAN</p>
                    <p className="text-sm text-gray-800">{bankInfo.iban}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">BIC</p>
                    <p className="text-sm text-gray-800">{bankInfo.bic}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-800">Historique</h3>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-3 border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600">+{transaction.amount}€</p>
                      {transaction.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Payé
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs mt-1">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="px-4 py-4 space-y-4 mt-0">
            {/* Notifications */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Nouvelles réservations</p>
                    <p className="text-xs text-gray-600">Recevoir une notification pour chaque nouvelle réservation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Rappels de cours</p>
                    <p className="text-xs text-gray-600">Rappel 24h avant chaque cours</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Messages communauté</p>
                    <p className="text-xs text-gray-600">Notifications pour les réponses à vos publications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Paiements</p>
                    <p className="text-xs text-gray-600">Confirmation de réception des paiements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Privacy */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-4">Confidentialité</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Profil public</p>
                    <p className="text-xs text-gray-600">Visible par tous les utilisateurs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800">Afficher mes statistiques</p>
                    <p className="text-xs text-gray-600">Nombre de cours, avis, etc.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-4">Compte</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onLogout?.()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données, cours, et publications seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => onDeleteAccount?.()}
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>

            {/* Help */}
            <Card className="p-4 border-0 shadow-sm">
              <h3 className="text-gray-800 mb-3">Aide & Support</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  <span>Centre d'aide</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  <span>Contacter le support</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  <span>Conditions d'utilisation</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <div className="text-center text-xs text-gray-500 py-4">
              Smart Dogs - Version 1.0.0
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Info Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Informations bancaires</DialogTitle>
            <DialogDescription>
              Modifiez vos coordonnées pour recevoir vos paiements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Titulaire du compte</Label>
              <Input
                value={bankInfo.accountHolder}
                onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>IBAN</Label>
              <Input
                value={bankInfo.iban}
                onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>BIC</Label>
              <Input
                value={bankInfo.bic}
                onChange={(e) => setBankInfo({ ...bankInfo, bic: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Mode de paiement</Label>
              <Select value={bankInfo.paymentMethod} onValueChange={(value) => setBankInfo({ ...bankInfo, paymentMethod: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>🔒 Sécurisé</strong> - Vos informations bancaires sont cryptées et sécurisées.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPaymentDialog(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] text-white"
              onClick={() => setShowPaymentDialog(false)}
            >
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Mes statistiques</DialogTitle>
            <DialogDescription>
              Vue d'ensemble de votre activité
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-0 shadow-sm text-center">
                <User className="h-6 w-6 text-[#41B6A6] mx-auto mb-2" />
                <p className="text-2xl text-gray-800">{stats.totalClients}</p>
                <p className="text-xs text-gray-600">Clients</p>
              </Card>

              <Card className="p-4 border-0 shadow-sm text-center">
                <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl text-gray-800">{stats.totalCourses}</p>
                <p className="text-xs text-gray-600">Cours donnés</p>
              </Card>

              <Card className="p-4 border-0 shadow-sm text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl text-gray-800">{stats.averageRating}</p>
                <p className="text-xs text-gray-600">Note moyenne</p>
              </Card>

              <Card className="p-4 border-0 shadow-sm text-center">
                <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl text-gray-800">{stats.totalReviews}</p>
                <p className="text-xs text-gray-600">Avis reçus</p>
              </Card>
            </div>

            <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
              <h4 className="text-gray-800 mb-3">Revenus</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <span className="text-green-600">{earnings.thisMonth}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mois dernier</span>
                  <span className="text-gray-800">{earnings.lastMonth}€</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-800"><strong>Cette année</strong></span>
                  <span className="text-green-600"><strong>{earnings.thisYear}€</strong></span>
                </div>
              </div>
            </Card>
          </div>

          <Button
            className="w-full bg-[#41B6A6] hover:bg-[#359889] text-white"
            onClick={() => setShowStatsDialog(false)}
          >
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
