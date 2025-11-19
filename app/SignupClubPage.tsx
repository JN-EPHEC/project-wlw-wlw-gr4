import React, { useState } from 'react';
import { ArrowLeft, Building2, Mail, Lock, Phone, MapPin, Eye, EyeOff, Camera, Upload, X } from 'lucide-react';
import { registerAccount, formatFirebaseAuthError } from '../hooks/signup';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SignupClubPageProps {
  onSignup: () => void;
  onBack: () => void;
}

export function SignupClubPage({ onSignup, onBack }: SignupClubPageProps) {
  const [formData, setFormData] = useState({
    clubName: '',
    legalName: '',
    siret: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    services: [] as string[],
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [clubPhoto, setClubPhoto] = useState<string | null>(null);
  const [documents, setDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableServices = [
    'Éducation canine',
    'Agility',
    'Obéissance',
    'Comportementalisme',
    'Ring',
    'Canicross',
    'Pension canine',
    'Toilettage',
    'Promenade',
    'Dog sitting',
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClubPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments([...documents, file.name]);
    }
  };

  const toggleService = (service: string) => {
    if (formData.services.includes(service)) {
      setFormData({
        ...formData,
        services: formData.services.filter((s) => s !== service),
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service],
      });
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
    if (!formData.email || !formData.password || !formData.clubName || !formData.siret) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await registerAccount({
        email: formData.email,
        password: formData.password,
        displayName: formData.clubName || formData.legalName,
        role: 'club',
        profile: {
          clubName: formData.clubName,
          legalName: formData.legalName,
          siret: formData.siret,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          description: formData.description,
          services: formData.services,
          documents,
          clubPhoto,
          roleLabel: 'club',
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
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-6 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-white mb-1">Créer un compte club</h1>
          <p className="text-white/80 text-sm">Pour les professionnels du secteur canin</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-24">
        {/* Club Photo */}
        <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <Label className="text-gray-800 mb-3 block">Logo / Photo du club *</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-3 border-[#E9B782] flex items-center justify-center">
              {clubPhoto ? (
                <img src={clubPhoto} alt="Club" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#E9B782] text-[#E9B782] hover:bg-[#E9B782]/10"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                {clubPhoto ? 'Changer' : 'Ajouter'}
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

        {/* Club Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Informations du club</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clubName" className="text-gray-700">Nom du club *</Label>
              <Input
                id="clubName"
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                placeholder="Club Canin Paris 15"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="legalName" className="text-gray-700">Raison sociale</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Association Club Canin Paris 15"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="siret" className="text-gray-700">SIRET / RNA *</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                placeholder="123 456 789 00010"
                className="mt-1.5"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Pour les associations, indiquez le numéro RNA
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-700">Description du club</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Présentation de votre club, valeurs, spécialités..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>
          </div>
        </Card>

        {/* Services */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Services proposés</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableServices.map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  formData.services.includes(service)
                    ? 'border-[#E9B782] bg-[#E9B782]/10 text-[#E9B782]'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Coordonnées</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email *</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@clubcanin.fr"
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
                  placeholder="01 23 45 67 89"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-gray-700">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Rue de la République"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode" className="text-gray-700">Code postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="75015"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-700">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Paris"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Documents */}
        <Card className="p-6 shadow-sm border-0">
          <h3 className="text-gray-800 mb-4">Documents administratifs</h3>
          <p className="text-sm text-gray-600 mb-4">
            Pour obtenir le badge "Smart Dogs Verified", veuillez fournir :
          </p>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-700 mb-2 block">Documents requis</Label>
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📄</span>
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                      <button
                        onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <label htmlFor="document-upload">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#E9B782] hover:bg-[#E9B782]/5 transition-colors mt-2">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Cliquez pour télécharger des documents</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Kbis, statuts d'association, attestation d'assurance...
                  </p>
                </div>
                <input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </label>
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
              className="w-5 h-5 rounded border-gray-300 text-[#E9B782] focus:ring-[#E9B782] mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              J'accepte les{' '}
              <a href="#" className="text-[#E9B782] hover:underline">
                conditions d'utilisation professionnelles
              </a>{' '}
              et la{' '}
              <a href="#" className="text-[#E9B782] hover:underline">
                politique de confidentialité
              </a>{' '}
              de Smart Dogs
            </span>
          </label>
        </Card>

        {/* Info Box */}
        <Card className="p-4 shadow-sm border-0 bg-amber-50 border-l-4 border-l-amber-500">
          <div className="flex gap-3">
            <div className="text-2xl">⭐</div>
            <div>
              <h4 className="text-sm text-gray-800 mb-1">Badge "Smart Dogs Verified"</h4>
              <p className="text-xs text-gray-600">
                Après vérification de vos documents, vous obtiendrez le badge de confiance qui
                valorise votre club auprès des utilisateurs.
              </p>
            </div>
          </div>
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
            className="w-full bg-[#E9B782] hover:bg-[#d9a772] h-12 text-white"
            disabled={!acceptTerms || isSubmitting}
          >
            {isSubmitting ? 'Cr�ation en cours...' : 'Cr�er mon compte club'}
          </Button>
        </div>
      </div>
    </div>
  );
}
