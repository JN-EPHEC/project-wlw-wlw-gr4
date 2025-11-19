import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, CreditCard, MapPin, User, Mail, Phone, CheckCircle2, Users, Trophy, Plus, Minus, PawPrint } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface EventBookingPageProps {
  eventId: number;
  onBack: () => void;
}

export function EventBookingPage({ eventId, onBack }: EventBookingPageProps) {
  const [step, setStep] = useState<'dog' | 'spectators' | 'info' | 'payment' | 'confirmation'>('dog');
  const [selectedDog, setSelectedDog] = useState<string>('');
  const [participantType, setParticipantType] = useState<'participant' | 'spectator'>('participant');
  const [spectatorCount, setSpectatorCount] = useState(0);
  
  // Mock data - user's dogs
  const userDogs = [
    { 
      id: '1', 
      name: 'Max', 
      breed: 'Golden Retriever', 
      age: '3 ans',
      eligible: true,
      reason: null,
    },
    { 
      id: '2', 
      name: 'Luna', 
      breed: 'Border Collie', 
      age: '2 ans',
      eligible: true,
      reason: null,
    },
    { 
      id: '3', 
      name: 'Rocky', 
      breed: 'Beagle', 
      age: '8 mois',
      eligible: false,
      reason: 'Âge minimum non atteint (18 mois requis)',
    },
  ];

  // Mock data - Event
  const event = {
    name: 'Compétition Régionale Agility',
    date: '15 Novembre 2024',
    time: '09:00 - 17:00',
    location: 'Paris Dog Park',
    address: '123 Rue du Parc, 75015 Paris',
    participantPrice: 35,
    spectatorPrice: 10,
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    spectators: [] as { name: string; email: string }[],
  });

  const handleConfirmBooking = () => {
    setStep('confirmation');
  };

  const addSpectator = () => {
    setFormData({
      ...formData,
      spectators: [...formData.spectators, { name: '', email: '' }],
    });
  };

  const removeSpectator = (index: number) => {
    const newSpectators = formData.spectators.filter((_, i) => i !== index);
    setFormData({ ...formData, spectators: newSpectators });
    if (spectatorCount > 0) setSpectatorCount(spectatorCount - 1);
  };

  const updateSpectator = (index: number, field: 'name' | 'email', value: string) => {
    const newSpectators = [...formData.spectators];
    newSpectators[index][field] = value;
    setFormData({ ...formData, spectators: newSpectators });
  };

  const calculateTotal = () => {
    let total = 0;
    if (participantType === 'participant' && selectedDog) {
      total += event.participantPrice;
    } else if (participantType === 'spectator') {
      total += event.spectatorPrice;
    }
    total += spectatorCount * event.spectatorPrice;
    return total;
  };

  if (step === 'confirmation') {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-4 pt-12 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-4 text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-white">Inscription confirmée</h1>
        </div>

        {/* Confirmation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-gray-800 mb-2">Inscription réussie !</h2>
            <p className="text-gray-600">
              Vous êtes inscrit à l'événement. Vous recevrez un email de confirmation avec tous les détails.
            </p>
          </div>

          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-gray-800 mb-4">Détails de l'inscription</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Événement</p>
                  <p className="text-gray-800">{event.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date et heure</p>
                  <p className="text-gray-800">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="text-gray-800">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.address}</p>
                </div>
              </div>

              {selectedDog && participantType === 'participant' && (
                <div className="flex items-start gap-3">
                  <PawPrint className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Chien participant</p>
                    <p className="text-gray-800">
                      {userDogs.find(d => d.id === selectedDog)?.name}
                    </p>
                  </div>
                </div>
              )}

              {spectatorCount > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Spectateurs invités</p>
                    <p className="text-gray-800">{spectatorCount} personne{spectatorCount > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-gray-800">Total payé</span>
                <span className="text-purple-600">{calculateTotal()}€</span>
              </div>
            </div>
          </Card>

          <div className="mt-6 space-y-3">
            <Button
              onClick={onBack}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-2xl h-12"
            >
              Retour à l'accueil
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-12 border-purple-600 text-purple-600 hover:bg-purple-600/10"
            >
              Ajouter au calendrier
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white">Inscription à l'événement</h1>
        <p className="text-white/80 mt-2">{event.name}</p>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'dog' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-xs ${step === 'dog' ? 'text-purple-600' : 'text-gray-600'}`}>
              Participant
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'spectators' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-xs ${step === 'spectators' ? 'text-purple-600' : 'text-gray-600'}`}>
              Spectateurs
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'info' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-xs ${step === 'info' ? 'text-purple-600' : 'text-gray-600'}`}>
              Infos
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200" />
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'payment' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              4
            </div>
            <span className={`text-xs ${step === 'payment' ? 'text-purple-600' : 'text-gray-600'}`}>
              Paiement
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        
        {/* Step 1: Choose participation type and dog */}
        {step === 'dog' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Type de participation</h2>
              <RadioGroup value={participantType} onValueChange={(value) => setParticipantType(value as 'participant' | 'spectator')}>
                <Card className={`p-4 cursor-pointer transition-all ${
                  participantType === 'participant'
                    ? 'border-2 border-purple-600 bg-purple-600/5'
                    : 'border border-gray-200 hover:border-purple-600'
                }`}>
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="participant" id="participant" className="mt-1 data-[state=checked]:border-purple-600 data-[state=checked]:text-purple-600" />
                    <div className="flex-1">
                      <label htmlFor="participant" className="text-gray-800 cursor-pointer flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-purple-600" />
                        <span>Participer avec mon chien</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-2">
                        Inscription pour la compétition avec votre chien
                      </p>
                      <Badge className="mt-3 bg-purple-100 text-purple-700 border-0">
                        {event.participantPrice}€
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${
                  participantType === 'spectator'
                    ? 'border-2 border-purple-600 bg-purple-600/5'
                    : 'border border-gray-200 hover:border-purple-600'
                }`}>
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="spectator" id="spectator" className="mt-1 data-[state=checked]:border-purple-600 data-[state=checked]:text-purple-600" />
                    <div className="flex-1">
                      <label htmlFor="spectator" className="text-gray-800 cursor-pointer flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span>Assister en tant que spectateur</span>
                      </label>
                      <p className="text-sm text-gray-600 mt-2">
                        Venez encourager les participants et profiter de l'événement
                      </p>
                      <Badge className="mt-3 bg-gray-100 text-gray-700 border-0">
                        {event.spectatorPrice}€
                      </Badge>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            {participantType === 'participant' && (
              <>
                <Separator />
                <div>
                  <h2 className="text-gray-800 mb-4">Choisissez votre chien</h2>
                  <div className="space-y-3">
                    {userDogs.map((dog) => (
                      <Card
                        key={dog.id}
                        onClick={() => dog.eligible && setSelectedDog(dog.id)}
                        className={`p-4 transition-all ${
                          dog.eligible
                            ? `cursor-pointer ${
                                selectedDog === dog.id
                                  ? 'border-2 border-purple-600 bg-purple-600/5'
                                  : 'border border-gray-200 hover:border-purple-600'
                              }`
                            : 'border border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedDog === dog.id ? 'bg-purple-600' : 'bg-gray-200'
                          }`}>
                            <PawPrint className={`h-6 w-6 ${
                              selectedDog === dog.id ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-gray-800">{dog.name}</h4>
                              {!dog.eligible && (
                                <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                                  Non éligible
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{dog.breed} • {dog.age}</p>
                            {!dog.eligible && dog.reason && (
                              <p className="text-xs text-orange-600 mt-2">{dog.reason}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-2xl h-12 border-purple-600 text-purple-600 hover:bg-purple-600/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un nouveau chien
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Spectators */}
        {step === 'spectators' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-2">Inviter des spectateurs</h2>
              <p className="text-gray-600 mb-6">
                Vous pouvez inviter des amis ou de la famille pour assister à l'événement ({event.spectatorPrice}€ par personne)
              </p>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                <div>
                  <p className="text-gray-800">Nombre de spectateurs</p>
                  <p className="text-sm text-gray-500">Prix unitaire : {event.spectatorPrice}€</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (spectatorCount > 0) {
                        setSpectatorCount(spectatorCount - 1);
                        if (formData.spectators.length > 0) {
                          removeSpectator(formData.spectators.length - 1);
                        }
                      }
                    }}
                    className="rounded-full border-gray-300"
                    disabled={spectatorCount === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-purple-600 w-8 text-center">{spectatorCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSpectatorCount(spectatorCount + 1);
                      addSpectator();
                    }}
                    className="rounded-full border-purple-600 text-purple-600 hover:bg-purple-600/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.spectators.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-gray-800">Informations des spectateurs</h3>
                  {formData.spectators.map((spectator, index) => (
                    <Card key={index} className="p-4 border-0 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-800">Spectateur {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeSpectator(index);
                            setSpectatorCount(spectatorCount - 1);
                          }}
                          className="h-8 w-8 text-gray-400 hover:text-red-600"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`spectator-name-${index}`}>Nom complet</Label>
                          <Input
                            id={`spectator-name-${index}`}
                            value={spectator.name}
                            onChange={(e) => updateSpectator(index, 'name', e.target.value)}
                            placeholder="Nom du spectateur"
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`spectator-email-${index}`}>Email</Label>
                          <Input
                            id={`spectator-email-${index}`}
                            type="email"
                            value={spectator.email}
                            onChange={(e) => updateSpectator(index, 'email', e.target.value)}
                            placeholder="email@exemple.com"
                            className="mt-1.5 rounded-xl"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {spectatorCount === 0 && (
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-0 shadow-sm text-center">
                  <Users className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Aucun spectateur ajouté. Vous pouvez passer cette étape ou ajouter des invités.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 'info' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Vos coordonnées</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
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
              </div>
            </div>

            <Separator />

            <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
              <p className="text-sm text-blue-800">
                ℹ️ Vous recevrez une confirmation par email avec tous les détails de l'événement et les instructions pour le jour J.
              </p>
            </Card>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 'payment' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-800 mb-4">Récapitulatif</h2>
              <Card className="p-4 border-purple-600/20 bg-purple-600/5 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Type de participation</span>
                    <span className="text-gray-800">
                      {participantType === 'participant' ? 'Participant' : 'Spectateur'}
                    </span>
                  </div>
                  {participantType === 'participant' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Inscription participant</span>
                      <span className="text-gray-800">{event.participantPrice}€</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Billet spectateur</span>
                      <span className="text-gray-800">{event.spectatorPrice}€</span>
                    </div>
                  )}
                  {spectatorCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Spectateurs invités ({spectatorCount})
                      </span>
                      <span className="text-gray-800">
                        {spectatorCount * event.spectatorPrice}€
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Total</span>
                    <span className="text-purple-600">
                      {calculateTotal()}€
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

            <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
              <p className="text-sm text-blue-800">
                💳 Paiement sécurisé. Vos informations sont protégées.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {step === 'dog' && (
          <Button
            onClick={() => setStep('spectators')}
            disabled={participantType === 'participant' && !selectedDog}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-2xl h-14 disabled:opacity-50"
          >
            Continuer
          </Button>
        )}
        {step === 'spectators' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('dog')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={() => setStep('info')}
              className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl h-14"
            >
              Continuer
            </Button>
          </div>
        )}
        {step === 'info' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('spectators')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={() => setStep('payment')}
              disabled={!formData.name || !formData.email || !formData.phone}
              className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl h-14 disabled:opacity-50"
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-2xl h-14"
            >
              Confirmer l'inscription
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
