import { ArrowLeft, Award, BookOpen, CheckCircle2, Clock, Heart, MapPin, Smile, Sparkles, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

interface RatingPageProps {
  bookingId: number;
  onBack: () => void;
}

export function RatingPage({ bookingId, onBack }: RatingPageProps) {
  const [step, setStep] = useState<'clubRating' | 'trainerRating' | 'confirmation'>('clubRating');
  const [clubRating, setClubRating] = useState(0);
  const [clubHoverRating, setClubHoverRating] = useState(0);
  const [trainerRating, setTrainerRating] = useState(0);
  const [trainerHoverRating, setTrainerHoverRating] = useState(0);
  const [clubComment, setClubComment] = useState('');
  const [trainerComment, setTrainerComment] = useState('');
  const [selectedClubTags, setSelectedClubTags] = useState<string[]>([]);
  const [selectedTrainerTags, setSelectedTrainerTags] = useState<string[]>([]);

  // Mock data
  const booking = {
    id: bookingId,
    club: {
      name: 'Canin Club Paris',
      logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100&h=100&fit=crop',
    },
    trainer: {
      name: 'Sophie Martin',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      speciality: 'Éducation comportementale',
    },
    date: '25 Octobre 2024',
    service: 'Séance individuelle (1h)',
  };

  const clubTags = [
    { id: 'clean', label: 'Installations propres', icon: Sparkles },
    { id: 'accessible', label: 'Bien situé', icon: MapPin },
    { id: 'equipment', label: 'Bon équipement', icon: Award },
    { id: 'atmosphere', label: 'Bonne ambiance', icon: Smile },
    { id: 'parking', label: 'Parking facile', icon: MapPin },
    { id: 'welcoming', label: 'Accueil chaleureux', icon: Heart },
  ];

  const trainerTags = [
    { id: 'professional', label: 'Professionnel', icon: Award },
    { id: 'pedagogic', label: 'Pédagogue', icon: BookOpen },
    { id: 'patient', label: 'Patient', icon: Heart },
    { id: 'punctual', label: 'Ponctuel', icon: Clock },
    { id: 'listening', label: 'À l\'écoute', icon: Users },
    { id: 'passionate', label: 'Passionné', icon: Sparkles },
  ];

  const toggleClubTag = (tagId: string) => {
    setSelectedClubTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleTrainerTag = (tagId: string) => {
    setSelectedTrainerTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    // Here would be the API call to submit the ratings
    setStep('confirmation');
  };

  const renderStars = (
    rating: number,
    hoverRating: number,
    onRate: (rating: number) => void,
    onHover: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverRating || rating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              onMouseEnter={() => onHover(star)}
              onMouseLeave={() => onHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 transition-colors ${
                  isFilled
                    ? 'fill-[#E9B782] text-[#E9B782]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (step === 'confirmation') {
    return (
      <div className="relative flex flex-col h-full bg-white">
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
          <h1 className="text-white">Avis envoyé !</h1>
        </div>

        {/* Confirmation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#41B6A6]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-[#41B6A6]" />
            </div>
            <h2 className="text-gray-800 mb-2">Merci pour votre avis !</h2>
            <p className="text-gray-600">
              Votre retour aide la communauté Smart Dogs à faire les meilleurs choix.
            </p>
          </div>

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/5 to-white">
            <h3 className="text-gray-800 mb-4">Votre évaluation</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.club.logo} />
                    <AvatarFallback>CC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-800">{booking.club.name}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= clubRating
                              ? 'fill-[#E9B782] text-[#E9B782]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={booking.trainer.photo} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-800">{booking.trainer.name}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= trainerRating
                              ? 'fill-[#E9B782] text-[#E9B782]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-white">
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
        <h1 className="text-white">Donnez votre avis</h1>
        <p className="text-white/80 mt-2">
          {step === 'clubRating' ? 'Sur le club' : 'Sur le professeur'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'clubRating' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm ${step === 'clubRating' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Club
            </span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              step === 'trainerRating' ? 'bg-[#41B6A6] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm ${step === 'trainerRating' ? 'text-[#41B6A6]' : 'text-gray-600'}`}>
              Professeur
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        
        {/* Club Rating */}
        {step === 'clubRating' && (
          <div className="space-y-6">
            {/* Session Info */}
            <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.club.logo} />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{booking.club.name}</h4>
                  <p className="text-sm text-gray-600">{booking.date}</p>
                  <p className="text-sm text-gray-500">{booking.service}</p>
                </div>
              </div>
            </Card>

            <Separator />

            {/* Star Rating */}
            <div>
              <h2 className="text-gray-800 mb-3">Quelle note donneriez-vous ?</h2>
              <div className="flex flex-col items-center py-6">
                {renderStars(clubRating, clubHoverRating, setClubRating, setClubHoverRating)}
                {clubRating > 0 && (
                  <p className="text-gray-600 mt-3">
                    {clubRating === 1 && 'Très décevant'}
                    {clubRating === 2 && 'Décevant'}
                    {clubRating === 3 && 'Correct'}
                    {clubRating === 4 && 'Bien'}
                    {clubRating === 5 && 'Excellent'}
                  </p>
                )}
              </div>
            </div>

            {clubRating > 0 && (
              <>
                <Separator />

                {/* Tags */}
                <div>
                  <h2 className="text-gray-800 mb-3">Ce qui a fait la différence</h2>
                  <p className="text-sm text-gray-600 mb-4">Sélectionnez un ou plusieurs points positifs</p>
                  <div className="grid grid-cols-2 gap-3">
                    {clubTags.map((tag) => {
                      const Icon = tag.icon;
                      const isSelected = selectedClubTags.includes(tag.id);
                      return (
                        <Card
                          key={tag.id}
                          onClick={() => toggleClubTag(tag.id)}
                          className={`p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm'
                              : 'border-0 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${isSelected ? 'text-[#41B6A6]' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isSelected ? 'text-[#41B6A6]' : 'text-gray-700'}`}>
                              {tag.label}
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Comment */}
                <div>
                  <Label htmlFor="clubComment">Votre commentaire (optionnel)</Label>
                  <Textarea
                    id="clubComment"
                    value={clubComment}
                    onChange={(e) => setClubComment(e.target.value)}
                    placeholder="Partagez votre expérience avec la communauté..."
                    className="mt-1.5 min-h-[120px] rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Votre avis sera visible publiquement
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Trainer Rating */}
        {step === 'trainerRating' && (
          <div className="space-y-6">
            {/* Trainer Info */}
            <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.trainer.photo} />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{booking.trainer.name}</h4>
                  <p className="text-sm text-gray-600">{booking.trainer.speciality}</p>
                </div>
              </div>
            </Card>

            <Separator />

            {/* Star Rating */}
            <div>
              <h2 className="text-gray-800 mb-3">Quelle note donneriez-vous ?</h2>
              <div className="flex flex-col items-center py-6">
                {renderStars(trainerRating, trainerHoverRating, setTrainerRating, setTrainerHoverRating)}
                {trainerRating > 0 && (
                  <p className="text-gray-600 mt-3">
                    {trainerRating === 1 && 'Très décevant'}
                    {trainerRating === 2 && 'Décevant'}
                    {trainerRating === 3 && 'Correct'}
                    {trainerRating === 4 && 'Bien'}
                    {trainerRating === 5 && 'Excellent'}
                  </p>
                )}
              </div>
            </div>

            {trainerRating > 0 && (
              <>
                <Separator />

                {/* Tags */}
                <div>
                  <h2 className="text-gray-800 mb-3">Ses qualités principales</h2>
                  <p className="text-sm text-gray-600 mb-4">Sélectionnez un ou plusieurs points positifs</p>
                  <div className="grid grid-cols-2 gap-3">
                    {trainerTags.map((tag) => {
                      const Icon = tag.icon;
                      const isSelected = selectedTrainerTags.includes(tag.id);
                      return (
                        <Card
                          key={tag.id}
                          onClick={() => toggleTrainerTag(tag.id)}
                          className={`p-3 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm'
                              : 'border-0 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${isSelected ? 'text-[#41B6A6]' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isSelected ? 'text-[#41B6A6]' : 'text-gray-700'}`}>
                              {tag.label}
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Comment */}
                <div>
                  <Label htmlFor="trainerComment">Votre commentaire (optionnel)</Label>
                  <Textarea
                    id="trainerComment"
                    value={trainerComment}
                    onChange={(e) => setTrainerComment(e.target.value)}
                    placeholder="Partagez votre expérience avec ce professeur..."
                    className="mt-1.5 min-h-[120px] rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Votre avis sera visible publiquement
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {step === 'clubRating' && (
          <Button
            onClick={() => setStep('trainerRating')}
            disabled={clubRating === 0}
            className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
          >
            Continuer
          </Button>
        )}
        {step === 'trainerRating' && (
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('clubRating')}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-gray-300"
            >
              Retour
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={trainerRating === 0}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
            >
              Envoyer mon avis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
