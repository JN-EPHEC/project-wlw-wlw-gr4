import { ArrowRight, Calendar, CheckCircle2, Clock, MapPin, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface RatingInvitationPageProps {
  bookingId: number;
  onStartRating: (bookingId: number) => void;
  onDismiss: () => void;
}

export function RatingInvitationPage({ bookingId, onStartRating, onDismiss }: RatingInvitationPageProps) {
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
    time: '14:00 - 15:00',
    service: 'Séance individuelle (1h)',
    dog: 'Max',
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-white mb-2">Séance terminée !</h1>
          <p className="text-white/80">Comment s'est passée votre expérience ?</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        
        {/* Session Details Card */}
        <Card className="p-6 border-0 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-800">Séance complétée</h3>
              <p className="text-sm text-gray-600">Avec {booking.dog}</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#41B6A6] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-gray-800">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#41B6A6] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Horaire</p>
                <p className="text-gray-800">{booking.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p className="text-gray-800">{booking.club.name}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Why Rate */}
        <div className="mb-6">
          <h2 className="text-gray-800 mb-3">Pourquoi donner mon avis ?</h2>
          <div className="space-y-3">
            <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/5 to-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#41B6A6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-[#41B6A6]" />
                </div>
                <div>
                  <h4 className="text-gray-800">Aidez la communauté</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Votre retour aide d'autres propriétaires à faire les meilleurs choix pour leurs chiens
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-[#E9B782]/5 to-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#E9B782]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-[#E9B782]" />
                </div>
                <div>
                  <h4 className="text-gray-800">Améliorez les services</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Les clubs et professeurs utilisent vos avis pour s'améliorer continuellement
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Who to rate */}
        <div className="mb-6">
          <h2 className="text-gray-800 mb-3">Vous évaluerez</h2>
          <div className="space-y-3">
            {/* Club */}
            <Card className="p-4 border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.club.logo} />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{booking.club.name}</h4>
                  <p className="text-sm text-gray-600">Le club</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>

            {/* Trainer */}
            <Card className="p-4 border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.trainer.photo} />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-gray-800">{booking.trainer.name}</h4>
                  <p className="text-sm text-gray-600">{booking.trainer.speciality}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>

        {/* Time estimate */}
        <Card className="p-4 border-0 shadow-sm bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            ⏱️ Cela ne prend que 2 minutes
          </p>
        </Card>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="space-y-3">
          <Button
            onClick={() => onStartRating(bookingId)}
            className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14"
          >
            <Star className="h-5 w-5 mr-2" />
            Donner mon avis
          </Button>
          <Button
            onClick={onDismiss}
            variant="ghost"
            className="w-full rounded-2xl h-12 text-gray-600"
          >
            Peut-être plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}
