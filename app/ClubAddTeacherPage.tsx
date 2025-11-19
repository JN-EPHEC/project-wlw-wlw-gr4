import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, BookOpen, CheckCircle, AlertCircle, Shield, Eye, EyeOff, Copy } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';

interface ClubAddTeacherPageProps {
  onBack: () => void;
  onTeacherAdded?: (teacher: any) => void;
}

export function ClubAddTeacherPage({ onBack, onTeacherAdded }: ClubAddTeacherPageProps) {
  const [step, setStep] = useState<'form' | 'credentials'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialties: '',
    bio: '',
    experience: '',
    certifications: ''
  });

  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const generateCredentials = (firstName: string, lastName: string): { username: string; password: string } => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `PROF-${initials}-${randomNum}`;
    
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    const password = `Pass2024@${randomPassword.substring(0, 6)}`;
    
    return { username, password };
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        })
        .catch(() => {
          fallbackCopyToClipboard(text, field);
        });
    } else {
      fallbackCopyToClipboard(text, field);
    }
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return;
    }

    const credentials = generateCredentials(formData.firstName, formData.lastName);
    setGeneratedCredentials(credentials);
    setStep('credentials');
  };

  const handleFinish = () => {
    if (onTeacherAdded && generatedCredentials) {
      const newTeacher = {
        id: Date.now(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        status: 'active' as const,
        credentials: generatedCredentials,
        createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        bio: formData.bio,
        experience: formData.experience,
        certifications: formData.certifications
      };
      onTeacherAdded(newTeacher);
    }
    onBack();
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email;

  if (step === 'credentials' && generatedCredentials) {
    return (
      <div className="flex flex-col h-full bg-white pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2">Identifiants générés</h1>
              <p className="text-white/90 text-sm">
                Communiquez ces codes au professeur
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Success Alert */}
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              Le professeur <strong>{formData.firstName} {formData.lastName}</strong> a été ajouté avec succès !
            </AlertDescription>
          </Alert>

          {/* Credentials Card */}
          <Card className="p-6 shadow-sm border-0">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#E9B782]/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-[#E9B782]" />
              </div>
              <h2 className="text-gray-800 mb-1">{formData.firstName} {formData.lastName}</h2>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <Label className="text-gray-700">Nom complet</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={`${formData.firstName} ${formData.lastName}`}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(`${formData.firstName} ${formData.lastName}`, 'name')}
                  >
                    {copiedField === 'name' ? (
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
                    value={formData.email}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(formData.email, 'email')}
                  >
                    {copiedField === 'email' ? (
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
                    value={generatedCredentials.username}
                    readOnly
                    className="bg-gray-50 font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedCredentials.username, 'username')}
                  >
                    {copiedField === 'username' ? (
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
                      value={generatedCredentials.password}
                      readOnly
                      className="bg-gray-50 font-mono pr-10"
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
                    onClick={() => copyToClipboard(generatedCredentials.password, 'password')}
                  >
                    {copiedField === 'password' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>Important :</strong> Communiquez ces identifiants au professeur. Il pourra se connecter à son interface dédiée sur <strong>app.smartdogs.fr/professeur</strong>
            </AlertDescription>
          </Alert>

          {/* Instructions */}
          <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-[#E9B782] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-gray-800 mb-2">Prochaines étapes</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Envoyez ces identifiants au professeur par email ou SMS</li>
                  <li>• Le professeur pourra se connecter immédiatement</li>
                  <li>• Il aura accès à son planning, ses élèves, et ses statistiques</li>
                  <li>• Vous pourrez gérer ses permissions depuis votre interface</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="px-4 py-4 bg-white border-t border-gray-100">
          <Button
            onClick={handleFinish}
            className="w-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782]"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Terminer
          </Button>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-white mb-2">Nouveau professeur</h1>
            <p className="text-white/90 text-sm">
              Remplissez les informations ci-dessous
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Info Banner */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            Un code d'identifiant et un mot de passe seront générés automatiquement après l'ajout.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations principales</h3>
          
          <div className="space-y-4">
            {/* First Name & Last Name */}
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

            {/* Email */}
            <div>
              <Label className="text-gray-700">Email *</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label className="text-gray-700">Téléphone</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Specialties */}
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
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations complémentaires</h3>
          
          <div className="space-y-4">
            {/* Bio */}
            <div>
              <Label className="text-gray-700">Biographie</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Présentez le professeur en quelques lignes..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            {/* Experience */}
            <div>
              <Label className="text-gray-700">Expérience</Label>
              <Input
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="10 ans d'expérience en éducation canine"
                className="mt-1.5"
              />
            </div>

            {/* Certifications */}
            <div>
              <Label className="text-gray-700">Certifications</Label>
              <Textarea
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                placeholder="Certificat d'éducateur canin, Formation comportementaliste..."
                className="mt-1.5 min-h-[80px]"
              />
            </div>
          </div>
        </Card>

        {/* How it works */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-[#E9B782] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-gray-800 mb-2">Comment ça marche ?</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Complétez les informations du professeur</li>
                <li>• Un code d'accès unique sera généré automatiquement</li>
                <li>• Vous pourrez copier et partager ces identifiants</li>
                <li>• Le professeur se connectera sur son interface dédiée</li>
                <li>• 2 professeurs gratuits, puis abonnement Premium requis</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782] disabled:opacity-50"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Créer le professeur
          </Button>
        </div>
      </div>
    </div>
  );
}
