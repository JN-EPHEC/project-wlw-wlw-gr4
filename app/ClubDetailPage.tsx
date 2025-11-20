import { ArrowLeft, Award, BadgeCheck, Calendar, Clock, Globe, Mail, MapPin, Phone, Star, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface ClubDetailPageProps {
  clubId: number;
  onBack: () => void;
  onBookAppointment: (clubId: number) => void;
  onHomeTrainingRequest?: (clubId: number) => void;
  onShowReviews?: (clubId: number) => void;
  onViewTeacher?: (teacherId: number, clubId: number) => void;
}

export function ClubDetailPage({ clubId, onBack, onBookAppointment, onHomeTrainingRequest, onShowReviews, onViewTeacher }: ClubDetailPageProps) {
  // Mock data - in real app, this would come from props or API based on clubId
  const club = {
    id: clubId,
    name: 'Canin Club Paris',
    rating: 4.8,
    reviews: 127,
    distance: '1.2 km',
    verified: true,
    homeTrainingEnabled: true,
    headerImage: 'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Centre d\'éducation canine moderne spécialisé dans le dressage positif et l\'obéissance. Notre équipe de professionnels certifiés accompagne votre chien dans son apprentissage avec bienveillance et expertise.',
    address: '42 Avenue des Champs-Élysées, 75008 Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@caninclubparis.fr',
    website: 'www.caninclubparis.fr',
    certifications: ['CCAD', 'Certificat de capacité animaux domestiques', 'Formation PSC1'],
    trainers: [
      { 
        id: 1,
        name: 'Sophie Martin', 
        specialty: 'Dressage & Obéissance', 
        experience: '12 ans',
        certifications: [
          'BPJEPS Éducateur Canin',
          'Certificat de Capacité Animaux Domestiques (CCAD)',
          'Formation Clicker Training avancé',
          'Spécialisation Comportement Canin',
        ]
      },
      { 
        id: 2,
        name: 'Lucas Dubois', 
        specialty: 'Agility & Sport', 
        experience: '8 ans',
        certifications: [
          'Moniteur Agility Niveau 3',
          'BPJEPS Activités Canines',
          'Formation Dog Dancing',
          'Certificat PSC1 (Premiers Secours)',
        ]
      },
      { 
        id: 3,
        name: 'Emma Bernard', 
        specialty: 'Comportement', 
        experience: '10 ans',
        certifications: [
          'Comportementaliste Certifié EAPAC',
          'Master en Éthologie',
          'CCAD (Certificat de Capacité)',
          'Formation Médiation Animale',
          'Certification Karen Pryor Academy',
        ]
      },
    ],
    schedule: [
      { day: 'Lundi - Vendredi', hours: '9h00 - 19h00' },
      { day: 'Samedi', hours: '9h00 - 17h00' },
      { day: 'Dimanche', hours: 'Fermé' },
    ],
    upcomingSlots: [
      { date: 'Lun 25 Oct', time: '10:00 - 11:00', available: true, terrain: 'Terrain principal', terrainAddress: '123 Rue de la République, 75015 Paris' },
      { date: 'Lun 25 Oct', time: '14:00 - 15:00', available: true, terrain: 'Terrain de dressage', terrainAddress: '45 Avenue du Parc, 75015 Paris' },
      { date: 'Mar 26 Oct', time: '11:00 - 12:00', available: true, terrain: 'Terrain principal', terrainAddress: '123 Rue de la République, 75015 Paris' },
      { date: 'Mer 27 Oct', time: '15:00 - 16:00', available: true, terrain: 'Terrain de dressage', terrainAddress: '45 Avenue du Parc, 75015 Paris' },
    ],
    photos: [
      'https://images.unsplash.com/photo-1592486058499-f262efe8292a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1544456948-c7ba22fe7111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1629130646965-e86223170abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      'https://images.unsplash.com/photo-1605976082021-5d76af4ec32b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    ],
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header with Image */}
      <div className="relative h-64 flex-shrink-0">
        <ImageWithFallback
          src={club.headerImage}
          alt={club.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </Button>

        {/* Club Name and Rating */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-white">{club.name}</h1>
                {club.verified && (
                  <BadgeCheck className="h-6 w-6 text-[#41B6A6]" fill="white" />
                )}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onShowReviews?.(clubId)}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Star className="h-5 w-5 fill-[#E9B782] text-[#E9B782]" />
                  <span className="text-white">{club.rating}</span>
                  <span className="text-white/80 text-sm">({club.reviews} avis)</span>
                </button>
                <div className="flex items-center gap-1 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{club.distance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-24">
        <div className="px-4 py-6 space-y-6">
          {/* Verified Badge */}
          {club.verified && (
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-[#41B6A6] px-4 py-2">
              <BadgeCheck className="h-4 w-4 mr-2" />
              Smart Dogs Verified
            </Badge>
          )}

          {/* Description */}
          <section>
            <h2 className="text-gray-800 mb-3">À propos</h2>
            <p className="text-gray-600 leading-relaxed">{club.description}</p>
          </section>

          <Separator />

          {/* Prochains créneaux */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Prochains créneaux</h2>
              <Calendar className="h-5 w-5 text-[#41B6A6]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {club.upcomingSlots.map((slot, index) => (
                <Card key={index} className="p-3 border-[#41B6A6]/20 hover:border-[#41B6A6] transition-all cursor-pointer">
                  <div className="text-sm text-gray-600 mb-1">{slot.date}</div>
                  <div className="flex items-center gap-1 text-[#41B6A6]">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{slot.time}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {slot.terrain} - {slot.terrainAddress}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Photos du club */}
          <section>
            <h2 className="text-gray-800 mb-4">Photos du club</h2>
            <div className="grid grid-cols-2 gap-3">
              {club.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Éducateurs */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Nos éducateurs</h2>
            </div>
            <div className="space-y-4">
              {club.trainers.map((trainer, index) => (
                <Card 
                  key={index} 
                  className="p-4 border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onViewTeacher?.(trainer.id, clubId)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-800 mb-1">{trainer.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{trainer.specialty}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-[#41B6A6]/30 text-[#41B6A6] text-xs">
                          {trainer.experience} d'expérience
                        </Badge>
                      </div>
                    </div>
                    <Award className="h-5 w-5 text-[#E9B782]" />
                  </div>
                  
                  {/* Diplômes et certifications */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Diplômes & Certifications</p>
                    <div className="space-y-1.5">
                      {trainer.certifications.slice(0, 3).map((cert, certIndex) => (
                        <div key={certIndex} className="flex items-start gap-2">
                          <BadgeCheck className="h-3.5 w-3.5 text-[#41B6A6] mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{cert}</span>
                        </div>
                      ))}
                      {trainer.certifications.length > 3 && (
                        <p className="text-xs text-[#41B6A6] mt-2">
                          + {trainer.certifications.length - 3} autres certifications
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-[#41B6A6]">
                      Toucher pour voir le profil complet →
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Certifications */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Certifications</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {club.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="border-[#41B6A6] text-[#41B6A6]">
                  {cert}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          {/* Horaires */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Horaires d'ouverture</h2>
            </div>
            <div className="space-y-2">
              {club.schedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="text-gray-800">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Contact */}
          <section>
            <h2 className="text-gray-800 mb-4">Informations de contact</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Adresse</p>
                  <p className="text-gray-800">{club.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                  <p className="text-gray-800">{club.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800">{club.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-[#41B6A6] mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Site web</p>
                  <p className="text-[#41B6A6]">{club.website}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {club.homeTrainingEnabled ? (
          <div className="flex gap-3">
            <Button
              onClick={() => onBookAppointment(clubId)}
              className="flex-1 bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Au club
            </Button>
            <Button
              onClick={() => onHomeTrainingRequest?.(clubId)}
              variant="outline"
              className="flex-1 rounded-2xl h-14 border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10"
            >
              <MapPin className="h-5 w-5 mr-2" />
              À domicile
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onBookAppointment(clubId)}
            className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Prendre rendez-vous
          </Button>
        )}
      </div>
    </div>
  );
}
