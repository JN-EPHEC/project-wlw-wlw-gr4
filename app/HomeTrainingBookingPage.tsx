import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, Plus, Shield, User, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface HomeTrainingBookingPageProps {
  clubId: number;
  onBack: () => void;
}

export function HomeTrainingBookingPage({ onBack }: HomeTrainingBookingPageProps) {
  const [step, setStep] = useState<'datetime' | 'address' | 'details' | 'confirmation'>('datetime');
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    address: '',
    city: '',
    postalCode: '',
    additionalInfo: '',
    name: '',
    email: '',
    phone: '',
    dogName: '',
    dogBreed: '',
    dogAge: '',
    selectedTeacher: '',
    notes: '',
  });

  const [alternativeSlots, setAlternativeSlots] = useState<{date: string, time: string}[]>([]);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  // Mock data
  const club = {
    name: 'Canin Club Paris',
  };

  const teachers = [
    { id: '1', name: 'Sophie Martin', specialty: 'Dressage & Obéissance' },
    { id: '2', name: 'Lucas Dubois', specialty: 'Agility & Sport' },
    { id: '3', name: 'Emma Bernard', specialty: 'Comportement' },
    { id: 'any', name: 'Peu importe', specialty: 'Premier disponible' },
  ];

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.time) {
      setAlternativeSlots([...alternativeSlots, newSlot]);
      setNewSlot({ date: '', time: '' });
    }
  };

  const handleRemoveSlot = (index: number) => {
    setAlternativeSlots(alternativeSlots.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = () => {
    setStep('confirmation');
  };

  if (step === 'confirmation') {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-4 text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-white">Demande envoyée</h1>
        </div>

        {/* Confirmation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#41B6A6]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-[#41B6A6]" />
            </div>
            <h2 className="text-gray-800 mb-2">Demande envoyée !</h2>
            <p className="text-gray-600">
              Votre demande de cours à domicile a été transmise au club. Vous recevrez une réponse sous 24-48h.
            </p>
          </div>

          <Card className="p-6 border-2 border-[#41B6A6]/20 mb-6">
            <h3 className="text-gray-800 mb-4">Récapitulatif de votre demande</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date et heure souhaitées</p>
                  <p className="text-gray-800">
                    {new Date(formData.preferredDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {formData.preferredTime}
                  </p>
                </div>
              </div>

              {alternativeSlots.length > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Créneaux alternatifs</p>
                    {alternativeSlots.map((slot, index) => (
                      <p key={index} className="text-sm text-gray-800">
                        {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {slot.time}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="text-gray-800">{formData.address}</p>
                  <p className="text-xs text-gray-600">{formData.postalCode} {formData.city}</p>
                </div>
              </div>

              {formData.selectedTeacher && formData.selectedTeacher !== 'any' && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Éducateur souhaité</p>
                    <p className="text-gray-800">
                      {teachers.find(t => t.id === formData.selectedTeacher)?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-blue-900 mb-1">Prochaines étapes</h4>
                <p className="text-sm text-blue-700">
                  Le club va examiner votre demande et vous proposera soit une confirmation directe, soit une modification d'horaire. Vous recevrez une notification dès qu'ils auront répondu.
                </p>
              </div>
            </div>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              onClick={onBack}
              className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-12"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white">Cours à domicile</h1>
        <p className="text-white/80 mt-2">{club.name}</p>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'datetime' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm ${step === 'datetime' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Date
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'address' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm ${step === 'address' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Adresse
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'details' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-sm ${step === 'details' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Détails
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {step === 'datetime' && (
          <div className="space-y-6">
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-orange-900 mb-1">À propos des cours à domicile</h4>
                  <p className="text-sm text-orange-700">
                    Les cours à domicile sont sur demande et doivent être validés par le club. 
                    Le tarif est généralement plus élevé que les cours au club et inclut les frais de déplacement.
                  </p>
                </div>
              </div>
            </Card>

            <div>
              <h2 className="text-gray-800 mb-4">Date et heure souhaitées</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preferredDate">Date préférée</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="mt-1.5 rounded-xl"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="preferredTime">Heure préférée</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-800">Créneaux alternatifs (optionnel)</h2>
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  Recommandé
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Proposez d'autres créneaux pour augmenter vos chances d'obtenir un rendez-vous rapidement.
              </p>

              <div className="space-y-3">
                {alternativeSlots.map((slot, index) => (
                  <Card key={index} className="p-3 border-[#41B6A6]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#41B6A6]" />
                        <span className="text-sm text-gray-800">
                          {new Date(slot.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {slot.time}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSlot(index)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}

                <Card className="p-3 border-dashed border-2 border-gray-200">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={newSlot.date}
                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        placeholder="Date"
                        className="text-sm"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Input
                        type="time"
                        value={newSlot.time}
                        onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                        placeholder="Heure"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleAddSlot}
                      disabled={!newSlot.date || !newSlot.time}
                      variant="outline"
                      className="w-full border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un créneau
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-blue-900 mb-1">Protection des données</h4>
                  <p className="text-sm text-blue-700">
                    Vos informations personnelles sont protégées conformément au RGPD. 
                    Elles ne seront utilisées que pour organiser le cours à domicile.
                  </p>
                </div>
              </div>
            </Card>

            <div>
              <h2 className="text-gray-800 mb-4">Votre adresse</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Rue de la Paix"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="75001"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Paris"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Informations complémentaires (optionnel)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Code d'accès, étage, instructions particulières..."
                    className="mt-1.5 rounded-xl min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-gray-800 mb-4">Vos coordonnées</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@email.com"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+33 6 00 00 00 00"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Informations sur votre chien</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dogName">Nom du chien</Label>
                  <Input
                    id="dogName"
                    value={formData.dogName}
                    onChange={(e) => setFormData({ ...formData, dogName: e.target.value })}
                    placeholder="Rex"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="dogBreed">Race</Label>
                  <Input
                    id="dogBreed"
                    value={formData.dogBreed}
                    onChange={(e) => setFormData({ ...formData, dogBreed: e.target.value })}
                    placeholder="Berger Allemand"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="dogAge">Âge</Label>
                  <Input
                    id="dogAge"
                    value={formData.dogAge}
                    onChange={(e) => setFormData({ ...formData, dogAge: e.target.value })}
                    placeholder="2 ans"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-gray-800 mb-4">Préférence d'éducateur (optionnel)</h2>
              <Select
                value={formData.selectedTeacher}
                onValueChange={(value: string) => setFormData({ ...formData, selectedTeacher: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un éducateur" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      <div>
                        <div>{teacher.name}</div>
                        <div className="text-xs text-gray-500">{teacher.specialty}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 mt-2">
                Si vous ne choisissez pas, le club assignera un éducateur disponible.
              </p>
            </div>

            <div>
              <h2 className="text-gray-800 mb-4">Notes supplémentaires (optionnel)</h2>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Décrivez vos objectifs, les comportements à travailler, ou toute information utile pour l'éducateur..."
                className="mt-1.5 rounded-xl min-h-[120px]"
              />
            </div>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-purple-900 mb-1">Tarification</h4>
                  <p className="text-sm text-purple-700">
                    Le tarif exact vous sera communiqué par le club après validation de votre demande. 
                    Il inclut la séance et les frais de déplacement.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {step === 'datetime' && (
          <Button
            onClick={() => setStep('address')}
            disabled={!formData.preferredDate || !formData.preferredTime}
            className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
          >
            Continuer
          </Button>
        )}
        {step === 'address' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('datetime')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={() => setStep('details')}
              disabled={!formData.address || !formData.city || !formData.postalCode || !formData.name || !formData.email || !formData.phone}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
            >
              Continuer
            </Button>
          </div>
        )}
        {step === 'details' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('address')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={handleSubmitRequest}
              disabled={!formData.dogName || !formData.dogBreed || !formData.dogAge}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
            >
              Envoyer la demande
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
