import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Mail, Lock, Phone, MapPin, Eye, EyeOff, Camera, FileText, Award, Calendar } from 'lucide-react';
import { registerAccount, formatFirebaseAuthError } from '../hooks/signup';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface SignupTeacherPageProps {
  onSignup: () => void;
  onBack: () => void;
}

export function SignupTeacherPage({ onSignup, onBack }: SignupTeacherPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
    specialties: [] as string[],
    experience: '',
    certifications: '',
    bio: '',
    hourlyRate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableSpecialties = [
    'Obéissance de base',
    'Éducation canine',
    'Agility',
    'Comportementalisme',
    'Préparation concours',
    'Rééducation comportementale',
    'Chiots',
    'Sports canins',
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async () => {
    if (!acceptTerms) {
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (formData.specialties.length === 0) {
      alert('Veuillez sélectionner au moins une spécialité');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerAccount({
        email: formData.email,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        role: 'teacher',
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          specialties: formData.specialties,
          experience: formData.experience,
          certifications: formData.certifications,
          bio: formData.bio,
          hourlyRate: formData.hourlyRate,
          profilePhoto,
          roleLabel: 'educateur',
        },
      });
      onSignup();
    } catch (error) {
      setSubmitError(formatFirebaseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-6 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-white mb-1">Créer un compte</h1>
          <p className="text-white/80 text-sm">Éducateur / Indépendant</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Photo */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#F28B6F]/5 to-white">
          <Label className="text-gray-800 mb-3 block">Photo de profil *</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-3 border-[#F28B6F] flex items-center justify-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#F28B6F] text-[#F28B6F] hover:bg-[#F28B6F]/10"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                {profilePhoto ? 'Changer' : 'Ajouter'}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Une photo professionnelle aide à inspirer confiance auprès des clients
          </p>
        </Card>

        {/* Personal Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations personnelles</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Marie"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Martin"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email *</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="marie.martin@exemple.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700">Téléphone *</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Les clients pourront vous contacter pour les réservations
              </p>
            </div>

            <div>
              <Label htmlFor="city" className="text-gray-700">Ville d'exercice *</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Lyon"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations professionnelles</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="experience" className="text-gray-700">Années d'expérience *</Label>
              <div className="relative mt-1.5">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="5"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="certifications" className="text-gray-700">Certifications et diplômes</Label>
              <div className="relative mt-1.5">
                <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="Ex: Brevet Professionnel d'Éducateur Canin, Certificat de Capacité..."
                  className="pl-10 min-h-[80px]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Listez vos diplômes, certifications et formations
              </p>
            </div>

            <div>
              <Label className="text-gray-700">Spécialités * (minimum 1)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSpecialties.map(specialty => (
                  <Badge
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`cursor-pointer transition-all ${
                      formData.specialties.includes(specialty)
                        ? 'bg-[#F28B6F] text-white border-0 hover:bg-[#e67a5f]'
                        : 'bg-gray-100 text-gray-700 border-0 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-gray-700">Présentation</Label>
              <div className="relative mt-1.5">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Présentez-vous et parlez de votre approche éducative..."
                  className="pl-10 min-h-[100px]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Cette description sera visible sur votre profil public
              </p>
            </div>

            <div>
              <Label htmlFor="hourlyRate" className="text-gray-700">Tarif horaire indicatif (€)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="5"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="45"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Vous pourrez ajuster vos tarifs par type de séance
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Sécurité</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-700">Mot de passe *</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Min. 8 caractères avec majuscules, minuscules et chiffres
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirmer le mot de passe *</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Verification Badge Info */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-l-orange-500">
          <div className="flex gap-3">
            <Award className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-gray-800 mb-1">Badge "Smart Dogs Verified"</h4>
              <p className="text-xs text-gray-600">
                Après création de votre compte, vous pourrez soumettre vos documents pour obtenir le badge vérifié et augmenter votre visibilité.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <Card className="p-4 shadow-sm border-0 bg-gray-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#F28B6F] focus:ring-[#F28B6F] mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-[#F28B6F] hover:underline">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#F28B6F] hover:underline">
                politique de confidentialité
              </a>{' '}
              de Smart Dogs. Je confirme être un éducateur canin professionnel.
            </span>
          </label>
        </Card>

        {/* Newsletter */}
        <Card className="p-4 shadow-sm border-0 bg-blue-50 border-l-4 border-l-[#F28B6F]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-[#F28B6F] focus:ring-[#F28B6F] mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm text-gray-800">Recevoir la newsletter professionnelle</p>
              <p className="text-xs text-gray-600 mt-1">
                Conseils business, nouveautés et opportunités pour développer votre activité
              </p>
            </div>
          </label>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto space-y-3">
          {submitError && (
            <p className="text-sm text-red-600 text-center">{submitError}</p>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#F28B6F] hover:bg-[#e67a5f] h-12 text-white"
            disabled={!acceptTerms || isSubmitting}
          >
            {isSubmitting ? 'Cr�ation en cours...' : 'Cr�er mon compte'}
          </Button>
        </div>
      </div>
    </div>
  );
}
