import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, CreditCard, MapPin, User, Mail, Phone, CheckCircle2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

interface BookingPageProps {
  clubId: number;
  onBack: () => void;
}

export function BookingPage({ clubId, onBack }: BookingPageProps) {
  const [step, setStep] = useState<'datetime' | 'info' | 'payment' | 'confirmation'>('datetime');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTerrain, setSelectedTerrain] = useState<{name: string, address: string} | null>(null);
  const [subscribeToClub, setSubscribeToClub] = useState(true);
  
  // Mock data
  const club = {
    name: 'Canin Club Paris',
    address: '42 Avenue des Champs-Élysées, 75008 Paris',
  };

  const terrains = [
    { id: 1, name: 'Terrain principal', address: '123 Rue de la République, 75015 Paris' },
    { id: 2, name: 'Terrain de dressage', address: '45 Avenue du Parc, 75015 Paris' },
  ];

  const availableDates = [
    { date: 'Lun 25 Oct', value: '2025-10-25' },
    { date: 'Mar 26 Oct', value: '2025-10-26' },
    { date: 'Mer 27 Oct', value: '2025-10-27' },
    { date: 'Jeu 28 Oct', value: '2025-10-28' },
  ];

  // Créneaux avec terrain assigné
  const availableSlots = [
    { date: '2025-10-25', time: '09:00', terrain: terrains[0] },
    { date: '2025-10-25', time: '10:00', terrain: terrains[0] },
    { date: '2025-10-25', time: '11:00', terrain: terrains[1] },
    { date: '2025-10-25', time: '14:00', terrain: terrains[1] },
    { date: '2025-10-26', time: '09:00', terrain: terrains[0] },
    { date: '2025-10-26', time: '10:00', terrain: terrains[1] },
    { date: '2025-10-26', time: '11:00', terrain: terrains[0] },
    { date: '2025-10-26', time: '14:00', terrain: terrains[1] },
    { date: '2025-10-27', time: '09:00', terrain: terrains[0] },
    { date: '2025-10-27', time: '10:00', terrain: terrains[1] },
    { date: '2025-10-27', time: '15:00', terrain: terrains[0] },
    { date: '2025-10-27', time: '16:00', terrain: terrains[1] },
    { date: '2025-10-28', time: '09:00', terrain: terrains[0] },
    { date: '2025-10-28', time: '10:00', terrain: terrains[1] },
    { date: '2025-10-28', time: '14:00', terrain: terrains[0] },
    { date: '2025-10-28', time: '15:00', terrain: terrains[1] },
  ];

  const services = [
    { name: 'Séance individuelle (1h)', price: 45 },
    { name: 'Évaluation comportementale', price: 30 },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dogName: '',
    service: services[0].name,
  });

  const handleConfirmBooking = () => {
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
          <h1 className="text-white">Réservation confirmée</h1>
        </div>

        {/* Confirmation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#41B6A6]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-[#41B6A6]" />
            </div>
            <h2 className="text-gray-800 mb-2">Réservation réussie !</h2>
            <p className="text-gray-600">
              Votre rendez-vous a été confirmé. Vous recevrez un email de confirmation.
            </p>
          </div>

          <Card className="p-6 border-2 border-[#41B6A6]/20">
            <h3 className="text-gray-800 mb-4">Détails de la réservation</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date et heure</p>
                  <p className="text-gray-800">
                    {availableDates.find(d => d.value === selectedDate)?.date} à {selectedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Lieu - Club</p>
                  <p className="text-gray-800">{club.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{club.address}</p>
                </div>
              </div>

              {selectedTerrain && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Terrain assigné</p>
                    <p className="text-gray-800">{selectedTerrain.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedTerrain.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Votre chien</p>
                  <p className="text-gray-800">{formData.dogName}</p>
                </div>
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
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10"
            >
              Ajouter au calendrier
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
        <h1 className="text-white">Réserver une séance</h1>
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
              Date & Heure
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'info' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm ${step === 'info' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Infos
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'payment' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-sm ${step === 'payment' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Paiement
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {step === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Choisissez une date</h2>
              <div className="grid grid-cols-2 gap-3">
                {availableDates.map((date) => (
                  <Card
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDate === date.value
                        ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5'
                        : 'border border-gray-200 hover:border-[#41B6A6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className={`h-5 w-5 ${selectedDate === date.value ? 'text-[#41B6A6]' : 'text-gray-400'}`} />
                      <span className={selectedDate === date.value ? 'text-[#41B6A6]' : 'text-gray-700'}>
                        {date.date}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <h2 className="text-gray-800 mb-4">Choisissez un horaire</h2>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots
                    .filter(slot => slot.date === selectedDate)
                    .map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? 'default' : 'outline'}
                        onClick={() => {
                          setSelectedTime(slot.time);
                          setSelectedTerrain(slot.terrain);
                        }}
                        className={`rounded-xl ${
                          selectedTime === slot.time
                            ? 'bg-[#41B6A6] hover:bg-[#359889]'
                            : 'border-gray-200 hover:border-[#41B6A6]'
                        }`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                </div>
                
                {/* Afficher le terrain sélectionné */}
                {selectedTime && selectedTerrain && (
                  <Card className="mt-4 p-4 bg-[#41B6A6]/5 border-[#41B6A6]/20">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Terrain assigné</p>
                        <p className="text-gray-800">{selectedTerrain.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{selectedTerrain.address}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Vos informations</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Votre nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom complet"
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
                    placeholder="votre@email.com"
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
                <div>
                  <Label htmlFor="dogName">Nom de votre chien</Label>
                  <Input
                    id="dogName"
                    value={formData.dogName}
                    onChange={(e) => setFormData({ ...formData, dogName: e.target.value })}
                    placeholder="Rex"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-gray-800 mb-4">Type de séance</h2>
              <div className="space-y-3">
                {services.map((service) => (
                  <Card
                    key={service.name}
                    onClick={() => setFormData({ ...formData, service: service.name })}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.service === service.name
                        ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5'
                        : 'border border-gray-200 hover:border-[#41B6A6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800">{service.name}</p>
                      </div>
                      <Badge className="bg-[#E9B782] text-white border-0">
                        {service.price}€
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Subscribe to club community */}
            <div>
              <Card className="p-4 bg-gradient-to-br from-[#41B6A6]/5 to-[#41B6A6]/10 border-[#41B6A6]/20">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="subscribe" 
                    checked={subscribeToClub}
                    onCheckedChange={(checked) => setSubscribeToClub(checked as boolean)}
                    className="mt-1 data-[state=checked]:bg-[#41B6A6] data-[state=checked]:border-[#41B6A6]"
                  />
                  <div className="flex-1">
                    <label htmlFor="subscribe" className="text-gray-800 cursor-pointer flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#41B6A6]" />
                      <span>Rejoindre la communauté du club</span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      Accédez aux salons de discussion, annonces et événements du club. 
                      Échangez avec d'autres propriétaires et les éducateurs !
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Récapitulatif</h2>
              <Card className="p-4 border-[#41B6A6]/20 bg-[#41B6A6]/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="text-gray-800">
                      {availableDates.find(d => d.value === selectedDate)?.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Heure</span>
                    <span className="text-gray-800">{selectedTime}</span>
                  </div>
                  {selectedTerrain && (
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-600">Terrain</span>
                      <div className="text-right">
                        <p className="text-gray-800">{selectedTerrain.name}</p>
                        <p className="text-xs text-gray-600">{selectedTerrain.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="text-gray-800">{formData.service}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#41B6A6]">
                      {services.find(s => s.name === formData.service)?.price}€
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-gray-800 mb-4">Informations de paiement</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="rounded-xl pl-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/AA"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                💳 Paiement sécurisé. Vos informations sont protégées.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {step === 'datetime' && (
          <Button
            onClick={() => setStep('info')}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
          >
            Continuer
          </Button>
        )}
        {step === 'info' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('datetime')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={() => setStep('payment')}
              disabled={!formData.name || !formData.email || !formData.phone || !formData.dogName}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
            >
              Continuer
            </Button>
          </div>
        )}
        {step === 'payment' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('info')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={handleConfirmBooking}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14"
            >
              Confirmer la réservation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}