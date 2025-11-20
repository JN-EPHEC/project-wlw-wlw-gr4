import { ArrowLeft, Award, BadgeCheck, BookOpen, Calendar, Camera, Heart, Sparkles, Star, Trophy } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface TeacherDetailPageProps {
  teacherId: number;
  clubId: number;
  onBack: () => void;
  onBookAppointment?: (teacherId: number) => void;
}

export function TeacherDetailPage({ teacherId, onBack, onBookAppointment }: TeacherDetailPageProps) {
  // Mock data - in real app, this would come from props or API based on teacherId
  const teachers: { [key: number]: any } = {
    1: {
      id: 1,
      name: 'Sophie Martin',
      specialty: 'Dressage & Obéissance',
      experience: '12 ans',
      rating: 4.9,
      reviews: 156,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      bio: 'Passionnée par l\'éducation canine depuis mon plus jeune âge, j\'ai fait de ma passion mon métier il y a 12 ans. Ma philosophie : l\'éducation positive et bienveillante pour créer une relation harmonieuse entre vous et votre compagnon.',
      certifications: [
        'BPJEPS Éducateur Canin',
        'Certificat de Capacité Animaux Domestiques (CCAD)',
        'Formation Clicker Training avancé',
        'Spécialisation Comportement Canin',
        'Certification Karen Pryor Academy',
        'Formation Continue en Éthologie',
      ],
      specializations: [
        'Éducation positive',
        'Obéissance de base',
        'Rappel et marche en laisse',
        'Sociabilisation chiot',
        'Résolution de problèmes comportementaux',
      ],
      hobbies: [
        '🏃‍♀️ Randonnée canine',
        '📚 Lecture sur l\'éthologie',
        '🎾 Agility loisir',
        '🐕 Bénévolat en refuge',
      ],
      excellence: 'Spécialiste reconnue du dressage à l\'obéissance pour chiens réactifs et anxieux. J\'ai accompagné plus de 500 binômes maître-chien vers une relation apaisée.',
      stats: {
        totalSessions: 1240,
        successRate: 96,
        specialties: 5,
      },
      availability: [
        { day: 'Lundi', slots: 3 },
        { day: 'Mercredi', slots: 5 },
        { day: 'Vendredi', slots: 2 },
        { day: 'Samedi', slots: 1 },
      ],
      workPhotos: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      ],
    },
    2: {
      id: 2,
      name: 'Lucas Dubois',
      specialty: 'Agility & Sport',
      experience: '8 ans',
      rating: 4.7,
      reviews: 89,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      bio: 'Ancien sportif de haut niveau, j\'ai découvert l\'agility il y a 8 ans et c\'est devenu ma vocation. J\'adore partager ma passion pour le sport canin et voir les chiens s\'épanouir dans l\'effort.',
      certifications: [
        'Moniteur Agility Niveau 3',
        'BPJEPS Activités Canines',
        'Formation Dog Dancing',
        'Certificat PSC1 (Premiers Secours)',
        'Formation Préparation Physique Canine',
      ],
      specializations: [
        'Agility compétition',
        'Dog dancing',
        'Préparation physique',
        'Sports canins',
        'Coordination et agilité',
      ],
      hobbies: [
        '🏅 Compétitions d\'agility',
        '🏋️ CrossFit',
        '🎵 Chorégraphie canine',
        '⛰️ Trail running avec chiens',
      ],
      excellence: 'Champion régional d\'agility 2023, j\'ai formé plusieurs binômes qui ont atteint le niveau national. Ma force : motiver et booster la confiance de votre chien.',
      stats: {
        totalSessions: 856,
        successRate: 94,
        specialties: 4,
      },
      availability: [
        { day: 'Mardi', slots: 4 },
        { day: 'Jeudi', slots: 3 },
        { day: 'Samedi', slots: 6 },
        { day: 'Dimanche', slots: 2 },
      ],
      workPhotos: [
        'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1558788353-f76d92427f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1609489274779-5c34f7a0e2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1585664811087-47f65abbad64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      ],
    },
    3: {
      id: 3,
      name: 'Emma Bernard',
      specialty: 'Comportement',
      experience: '10 ans',
      rating: 4.9,
      reviews: 203,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      bio: 'Comportementaliste diplômée, je me spécialise dans la résolution des problèmes comportementaux complexes. Mon approche allie éthologie scientifique et compréhension empathique du lien homme-animal.',
      certifications: [
        'Comportementaliste Certifié EAPAC',
        'Master en Éthologie',
        'CCAD (Certificat de Capacité)',
        'Formation Médiation Animale',
        'Certification Karen Pryor Academy',
        'Spécialisation Anxiété et Peurs',
        'Formation Thérapie Comportementale',
      ],
      specializations: [
        'Troubles comportementaux',
        'Anxiété et peurs',
        'Agressivité',
        'Médiation animale',
        'Rééducation comportementale',
      ],
      hobbies: [
        '🔬 Recherche en éthologie',
        '✍️ Rédaction d\'articles scientifiques',
        '🎓 Conférences et formations',
        '🐾 Adoption responsable',
      ],
      excellence: 'Experte en comportement canin, j\'ai aidé plus de 800 familles à résoudre des situations difficiles (agressivité, anxiété de séparation, peurs). Taux de réussite : 97%.',
      stats: {
        totalSessions: 1580,
        successRate: 97,
        specialties: 6,
      },
      availability: [
        { day: 'Lundi', slots: 2 },
        { day: 'Mardi', slots: 4 },
        { day: 'Mercredi', slots: 3 },
        { day: 'Jeudi', slots: 5 },
      ],
      workPhotos: [
        'https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      ],
    },
  };

  const teacher = teachers[teacherId] || teachers[1];

  return (
    <div className="flex flex-col h-full bg-white pb-24">
      {/* Header with gradient and profile */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <ImageWithFallback
              src={teacher.profileImage}
              alt={teacher.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Specialty */}
          <div className="flex-1 pt-2">
            <h1 className="text-white mb-2">{teacher.name}</h1>
            <p className="text-white/90 mb-2">{teacher.specialty}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-white text-white" />
                <span className="text-white">{teacher.rating}</span>
                <span className="text-white/80 text-sm">({teacher.reviews})</span>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                {teacher.experience}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 border-0 shadow-sm text-center bg-gradient-to-br from-[#41B6A6]/10 to-white">
              <div className="text-2xl text-[#41B6A6] mb-1">{teacher.stats.totalSessions}</div>
              <p className="text-xs text-gray-600">Séances</p>
            </Card>
            <Card className="p-4 border-0 shadow-sm text-center bg-gradient-to-br from-[#41B6A6]/10 to-white">
              <div className="text-2xl text-[#41B6A6] mb-1">{teacher.stats.successRate}%</div>
              <p className="text-xs text-gray-600">Réussite</p>
            </Card>
            <Card className="p-4 border-0 shadow-sm text-center bg-gradient-to-br from-[#41B6A6]/10 to-white">
              <div className="text-2xl text-[#41B6A6] mb-1">{teacher.stats.specialties}</div>
              <p className="text-xs text-gray-600">Spécialités</p>
            </Card>
          </div>

          {/* Bio */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">À propos</h2>
            </div>
            <Card className="p-4 border-0 shadow-sm bg-gray-50">
              <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
            </Card>
          </section>

          <Separator />

          {/* Excellence Domain */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-[#E9B782]" />
              <h2 className="text-gray-800">Domaine d'excellence</h2>
            </div>
            <Card className="p-4 border-0 shadow-sm border-l-4 border-l-[#E9B782] bg-gradient-to-r from-[#E9B782]/10 to-white">
              <p className="text-gray-700">{teacher.excellence}</p>
            </Card>
          </section>

          <Separator />

          {/* Specializations */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Spécialisations</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.specializations.map((spec: string, index: number) => (
                <Badge 
                  key={index} 
                  className="bg-[#41B6A6]/10 text-[#41B6A6] border-[#41B6A6]/30"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          {/* Certifications */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Diplômes & Certifications</h2>
            </div>
            <div className="space-y-3">
              {teacher.certifications.map((cert: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#41B6A6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BadgeCheck className="h-4 w-4 text-[#41B6A6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{cert}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Hobbies */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-[#F28B6F]" />
              <h2 className="text-gray-800">Passions & Hobbies</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {teacher.hobbies.map((hobby: string, index: number) => (
                <Card key={index} className="p-3 border-0 shadow-sm bg-gradient-to-br from-[#F28B6F]/5 to-white">
                  <p className="text-sm text-gray-700">{hobby}</p>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Work Photos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">En action</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {teacher.workPhotos.map((photo: string, index: number) => (
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

          {/* Availability */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Disponibilités cette semaine</h2>
            </div>
            <div className="space-y-2">
              {teacher.availability.map((day: any, index: number) => (
                <Card key={index} className="p-4 border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{day.day}</span>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {day.slots} créneaux
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button
          onClick={() => onBookAppointment?.(teacherId)}
          className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14"
        >
          <Calendar className="h-5 w-5 mr-2" />
          Réserver avec {teacher.name.split(' ')[0]}
        </Button>
      </div>
    </div>
  );
}
