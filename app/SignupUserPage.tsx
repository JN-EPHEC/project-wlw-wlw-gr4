import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Camera } from 'lucide-react';
import { registerAccount, formatFirebaseAuthError } from '../hooks/signup';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface SignupUserPageProps {
  onSignup: () => void;
  onBack: () => void;
}

export function SignupUserPage({ onSignup, onBack }: SignupUserPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerAccount({
        email: formData.email,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        role: 'user',
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          profilePhoto,
          roleLabel: 'particulier',
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
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 shadow-md">
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
          <p className="text-white/80 text-sm">Compte Particulier</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Photo */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/5 to-white">
          <Label className="text-gray-800 mb-3 block">Photo de profil (optionnel)</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-3 border-[#41B6A6] flex items-center justify-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10"
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
                  placeholder="Jean"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dupont"
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
                  placeholder="jean.dupont@exemple.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700">Téléphone</Label>
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
            </div>

            <div>
              <Label htmlFor="city" className="text-gray-700">Ville</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Paris"
                  className="pl-10"
                />
              </div>
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

        {/* Terms */}
        <Card className="p-4 shadow-sm border-0 bg-gray-50">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] focus:ring-[#41B6A6] mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-[#41B6A6] hover:underline">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#41B6A6] hover:underline">
                politique de confidentialité
              </a>{' '}
              de Smart Dogs
            </span>
          </label>
        </Card>

        {/* Newsletter */}
        <Card className="p-4 shadow-sm border-0 bg-blue-50 border-l-4 border-l-[#41B6A6]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] focus:ring-[#41B6A6] mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm text-gray-800">Recevoir la newsletter Smart Dogs</p>
              <p className="text-xs text-gray-600 mt-1">
                Conseils, actualités et offres exclusives
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
            className="w-full bg-[#41B6A6] hover:bg-[#359889] h-12"
            disabled={!acceptTerms || isSubmitting}
          >
            {isSubmitting ? 'Cr�ation en cours...' : 'Cr�er mon compte'}
          </Button>
        </div>
      </div>
    </div>
  );
}

