import { AlertCircle, ArrowLeft, Bell, BookOpen, CheckCircle, Copy, Eye, EyeOff, Mail, Phone, Share2, Shield, Trash2, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  status: 'active' | 'pending';
  credentials: {
    username: string;
    password: string;
  };
  createdAt: string;
}

interface ClubTeachersPageProps {
  onBack: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToAddTeacher?: () => void;
  onNavigateToRequests?: () => void;
}

export function ClubTeachersPage({ onBack, onNavigateToPricing, onNavigateToAddTeacher, onNavigateToRequests }: ClubTeachersPageProps) {
  const pendingRequestsCount = 2; // Normalement récupéré depuis le backend
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      firstName: 'Sophie',
      lastName: 'Durand',
      email: 'sophie.durand@email.com',
      phone: '06 12 34 56 78',
      specialties: ['Agility', 'Obéissance'],
      status: 'active',
      credentials: {
        username: 'PROF-SD-8745',
        password: 'Pass2024@SD'
      },
      createdAt: '15 Sept 2024'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{ username: string; password: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialties: ''
  });

  const freeLimit = 2;
  const canAddFree = teachers.length < freeLimit;

  const generateCredentials = (firstName: string, lastName: string): { username: string; password: string } => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `PROF-${initials}-${randomNum}`;
    
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    const password = `Pass2024@${randomPassword.substring(0, 6)}`;
    
    return { username, password };
  };

  const handleAddTeacher = () => {
    if (!canAddFree) {
      if (onNavigateToPricing) {
        onNavigateToPricing();
      }
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      return;
    }

    const credentials = generateCredentials(formData.firstName, formData.lastName);
    
    const newTeacher: Teacher = {
      id: teachers.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
      status: 'active',
      credentials,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setTeachers([...teachers, newTeacher]);
    setNewCredentials(credentials);
    setShowAddDialog(false);
    setShowCredentialsDialog(true);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialties: ''
    });
  };

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  const fallbackCopyToClipboard = (text: string, field: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    document.body.removeChild(textArea);
  };

  const copyToClipboard = (text: string, field: string) => {
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          // Fallback to old method
          fallbackCopyToClipboard(text, field);
        });
    } else {
      // Use fallback directly
      fallbackCopyToClipboard(text, field);
    }
  };

  const shareCredentials = (teacher: Teacher) => {
    const text = `Identifiants Smart Dogs\n\nNom: ${teacher.firstName} ${teacher.lastName}\nEmail: ${teacher.email}\n\nCode d'identifiant: ${teacher.credentials.username}\nMot de passe: ${teacher.credentials.password}\n\nConnexion: app.smartdogs.fr/professeur`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Identifiants Smart Dogs',
        text: text,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(text, 'share');
      });
    } else {
      copyToClipboard(text, 'share');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white mb-2">Mes Professeurs</h1>
            <p className="text-white/90 text-sm">
              Gérez votre équipe d'enseignants
            </p>
          </div>
          {pendingRequestsCount > 0 && (
            <button
              onClick={onNavigateToRequests}
              className="relative bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors mr-3"
            >
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            </button>
          )}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Card className="p-3 bg-white/95 border-0 text-center">
            <p className="text-gray-800 mb-1">{teachers.length}</p>
            <p className="text-xs text-gray-600">Professeurs</p>
          </Card>
          <Card className="p-3 bg-white/95 border-0 text-center">
            <p className="text-gray-800 mb-1">{freeLimit - teachers.length < 0 ? 0 : freeLimit - teachers.length}</p>
            <p className="text-xs text-gray-600">Gratuits restants</p>
          </Card>
          <Card className="p-3 bg-white/95 border-0 text-center">
            <p className="text-gray-800 mb-1">{teachers.filter(t => t.status === 'active').length}</p>
            <p className="text-xs text-gray-600">Actifs</p>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        {canAddFree && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              Vous pouvez ajouter <strong>{freeLimit - teachers.length} professeur(s) gratuit(s)</strong> supplémentaire(s). 
              Au-delà, un abonnement Premium est requis.
            </AlertDescription>
          </Alert>
        )}

        {!canAddFree && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-900">
              Vous avez atteint la limite gratuite. Passez à Premium pour ajouter plus de professeurs.
            </AlertDescription>
          </Alert>
        )}

        {/* Add Teacher Button */}
        <Button
          onClick={() => {
            if (canAddFree) {
              if (onNavigateToAddTeacher) {
                onNavigateToAddTeacher();
              }
            } else {
              if (onNavigateToPricing) {
                onNavigateToPricing();
              }
            }
          }}
          className="w-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782]"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Ajouter un professeur
        </Button>

        {/* Teachers List */}
        <section>
          <h2 className="text-gray-800 mb-4">Liste des professeurs</h2>
          
          {teachers.length === 0 ? (
            <Card className="p-8 shadow-sm border-0 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-2">Aucun professeur</p>
              <p className="text-sm text-gray-500">
                Ajoutez votre premier professeur pour commencer
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E9B782]/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-[#E9B782]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-800">{teacher.firstName} {teacher.lastName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              className={teacher.status === 'active' 
                                ? 'bg-green-100 text-green-700 border-0' 
                                : 'bg-gray-100 text-gray-600 border-0'
                              }
                            >
                              {teacher.status === 'active' ? 'Actif' : 'En attente'}
                            </Badge>
                            {teacher.id <= freeLimit && (
                              <Badge className="bg-blue-100 text-blue-700 border-0">
                                Gratuit
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{teacher.phone}</span>
                          </div>
                        )}
                      </div>

                      {teacher.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {teacher.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Ajouté le {teacher.createdAt}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Voir identifiants
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90%]">
                              <DialogHeader>
                                <DialogTitle>Identifiants de connexion</DialogTitle>
                                <DialogDescription>
                                  Identifiants pour {teacher.firstName} {teacher.lastName}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                {/* Name */}
                                <div>
                                  <Label className="text-gray-700">Nom complet</Label>
                                  <div className="flex gap-2 mt-1.5">
                                    <Input
                                      value={`${teacher.firstName} ${teacher.lastName}`}
                                      readOnly
                                      className="bg-gray-50"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => copyToClipboard(`${teacher.firstName} ${teacher.lastName}`, `name-${teacher.id}`)}
                                    >
                                      {copiedField === `name-${teacher.id}` ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Email */}
                                <div>
                                  <Label className="text-gray-700">Email</Label>
                                  <div className="flex gap-2 mt-1.5">
                                    <Input
                                      value={teacher.email}
                                      readOnly
                                      className="bg-gray-50"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => copyToClipboard(teacher.email, `email-${teacher.id}`)}
                                    >
                                      {copiedField === `email-${teacher.id}` ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Username */}
                                <div>
                                  <Label className="text-gray-700">Code d'identifiant</Label>
                                  <div className="flex gap-2 mt-1.5">
                                    <Input
                                      value={teacher.credentials.username}
                                      readOnly
                                      className="bg-gray-50"
                                    />
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => copyToClipboard(teacher.credentials.username, `username-${teacher.id}`)}
                                    >
                                      {copiedField === `username-${teacher.id}` ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Password */}
                                <div>
                                  <Label className="text-gray-700">Mot de passe</Label>
                                  <div className="flex gap-2 mt-1.5">
                                    <div className="relative flex-1">
                                      <Input
                                        value={teacher.credentials.password}
                                        readOnly
                                        className="bg-gray-50 pr-10"
                                        type={showPassword ? "text" : "password"}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full"
                                        onClick={() => setShowPassword(!showPassword)}
                                      >
                                        {showPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => copyToClipboard(teacher.credentials.password, `password-${teacher.id}`)}
                                    >
                                      {copiedField === `password-${teacher.id}` ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Share Button */}
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => shareCredentials(teacher)}
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  {copiedField === 'share' ? 'Copié !' : 'Partager les identifiants'}
                                </Button>

                                <Alert className="bg-blue-50 border-blue-200">
                                  <AlertCircle className="h-4 w-4 text-blue-600" />
                                  <AlertDescription className="text-sm text-blue-900">
                                    Communiquez ces identifiants au professeur. Il pourra se connecter à son interface dédiée sur app.smartdogs.fr/professeur
                                  </AlertDescription>
                                </Alert>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-[#E9B782] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-gray-800 mb-1">Comment ça marche ?</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Ajoutez les informations du professeur</li>
                <li>• Un code d'accès unique est généré automatiquement</li>
                <li>• Communiquez ces identifiants au professeur</li>
                <li>• Il pourra se connecter à son interface dédiée</li>
                <li>• 2 professeurs gratuits, puis abonnement Premium requis</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Ajouter un professeur</DialogTitle>
            <DialogDescription>
              Renseignez les informations du nouveau professeur. Un code d'accès sera généré automatiquement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700">Prénom *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Jean"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-gray-700">Nom *</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dupont"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jean.dupont@email.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-gray-700">Téléphone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-gray-700">Spécialités</Label>
              <Input
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="Agility, Obéissance, Comportementalisme..."
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1">Séparez les spécialités par des virgules</p>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-900">
                Un code d'identifiant et un mot de passe seront générés automatiquement après l'ajout.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddTeacher}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
                className="flex-1 bg-[#E9B782] hover:bg-[#d9a772]"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credentials Display Dialog */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Identifiants générés</DialogTitle>
            <DialogDescription>
              Communiquez ces identifiants au professeur pour qu'il puisse se connecter.
            </DialogDescription>
          </DialogHeader>
          
          {newCredentials && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-700">Code d'identifiant</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={newCredentials.username}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newCredentials.username, 'new-username')}
                  >
                    {copiedField === 'new-username' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-700">Mot de passe</Label>
                <div className="flex gap-2 mt-1.5">
                  <div className="relative flex-1">
                    <Input
                      value={newCredentials.password}
                      readOnly
                      className="bg-gray-50 pr-10"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(newCredentials.password, 'new-password')}
                  >
                    {copiedField === 'new-password' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900">
                  <strong>Important :</strong> Notez bien ces identifiants. Vous pourrez les retrouver dans la fiche du professeur.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => setShowCredentialsDialog(false)}
                className="w-full bg-[#E9B782] hover:bg-[#d9a772]"
              >
                J'ai noté les identifiants
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
