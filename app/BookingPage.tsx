import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface BookingPageProps {
  clubId: number;
  onBack: () => void;
}

type Step = 'datetime' | 'info' | 'payment' | 'confirmation';

export function BookingPage({ clubId, onBack }: BookingPageProps) {
  const [step, setStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [subscribeToClub, setSubscribeToClub] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dogName: '',
  });

  // Very small set of mock data (simplified from original)
  const club = {
    id: clubId,
    name: 'Canin Club Paris',
    address: '42 Avenue des Champs-Élysées, 75008 Paris',
  };

  const dates = [
    { label: 'Lun 25 Oct', value: '2025-10-25' },
    { label: 'Mar 26 Oct', value: '2025-10-26' },
  ];

  const slots = [
    { date: '2025-10-25', time: '09:00' },
    { date: '2025-10-25', time: '10:00' },
    { date: '2025-10-26', time: '14:00' },
  ];

  const canGoToInfo = selectedDate !== '' && selectedTime !== '';
  const canGoToPayment =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.dogName.trim();

  const handleConfirm = () => {
    setStep('confirmation');
  };

  if (step === 'confirmation') {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="flex-1 text-center text-white text-lg font-semibold">
              Réservation confirmée
            </h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#41B6A6]/10 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-[#41B6A6]" />
            </div>
            <h2 className="text-gray-800 mb-2">Réservation réussie !</h2>
            <p className="text-gray-600">
              Votre rendez-vous a été confirmé. Vous recevrez un email de
              confirmation.
            </p>
          </div>

          <Card className="p-6 border-2 border-[#41B6A6]/20">
            <h3 className="text-gray-800 mb-4">Détails de la réservation</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-gray-500">Date et heure</p>
                  <p className="text-gray-800">
                    {dates.find((d) => d.value === selectedDate)?.label} à{' '}
                    {selectedTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-gray-500">Lieu - Club</p>
                  <p className="text-gray-800">{club.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{club.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-gray-500">Votre chien</p>
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
              Retour à l&apos;accueil
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

      {/* Step indicator */}
      <div className="px-4 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          {[
            { id: 'datetime', label: 'Date & heure', index: 1 },
            { id: 'info', label: 'Infos', index: 2 },
            { id: 'payment', label: 'Paiement', index: 3 },
          ].map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === s.id
                      ? 'bg-[#41B6A6] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.index}
                </div>
                <span
                  className={`text-sm ${
                    step === s.id ? 'text-[#41B6A6]' : 'text-gray-600'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {step === 'datetime' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Choisissez une date</h2>
              <div className="grid grid-cols-2 gap-3">
                {dates.map((date) => (
                  <Card
                    key={date.value}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedDate === date.value
                        ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5'
                        : 'border border-gray-200 hover:border-[#41B6A6]'
                    }`}
                    onClick={() => {
                      setSelectedDate(date.value);
                      setSelectedTime('');
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar
                        className={`h-5 w-5 ${
                          selectedDate === date.value
                            ? 'text-[#41B6A6]'
                            : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={
                          selectedDate === date.value
                            ? 'text-[#41B6A6]'
                            : 'text-gray-700'
                        }
                      >
                        {date.label}
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
                  {slots
                    .filter((slot) => slot.date === selectedDate)
                    .map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          selectedTime === slot.time ? 'default' : 'outline'
                        }
                        className={`rounded-xl ${
                          selectedTime === slot.time
                            ? 'bg-[#41B6A6] hover:bg-[#359889]'
                            : 'border-gray-200 hover:border-[#41B6A6]'
                        }`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                </div>
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+33 6 00 00 00 00"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="dogName">Nom de votre chien</Label>
                  <Input
                    id="dogName"
                    value={formData.dogName}
                    onChange={(e) =>
                      setFormData({ ...formData, dogName: e.target.value })
                    }
                    placeholder="Max"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-gray-800 mb-4">Communauté du club</h2>
              <Card className="p-4 bg-gradient-to-br from-[#41B6A6]/5 to-[#41B6A6]/10 border-[#41B6A6]/20">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="subscribe"
                    checked={subscribeToClub}
                    onCheckedChange={(checked: any) =>
                      setSubscribeToClub(!!checked)
                    }
                    className="mt-1 data-[state=checked]:bg-[#41B6A6] data-[state=checked]:border-[#41B6A6]"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="subscribe"
                      className="text-gray-800 cursor-pointer flex items-center gap-2"
                    >
                      <Users className="h-5 w-5 text-[#41B6A6]" />
                      <span>Rejoindre la communauté du club</span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      Accédez aux salons de discussion, annonces et événements
                      du club, et échangez avec d&apos;autres propriétaires et
                      éducateurs.
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
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="text-gray-800">
                      {dates.find((d) => d.value === selectedDate)?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Heure</span>
                    <span className="text-gray-800">{selectedTime}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#41B6A6]">45 €</span>
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
                    <Label htmlFor="expiry">Date d&apos;expiration</Label>
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
                Paiement sécurisé. Vos informations sont protégées.
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
            disabled={!canGoToInfo}
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
              disabled={!canGoToPayment}
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
              onClick={handleConfirm}
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

