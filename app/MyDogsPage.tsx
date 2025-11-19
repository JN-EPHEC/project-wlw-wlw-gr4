import React, { useState } from 'react';
import { Plus, ChevronRight, Heart, Activity, Calendar, Sparkles, Bell, Award, TrendingUp, Clock, Camera } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AddDogPage } from './AddDogPage';

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
  weight: string;
  height?: string;
  image: string;
  healthStatus: {
    vaccines: string;
    deworming: string;
    vetVisit: string;
  };
}

interface MyDogsPageProps {
  onNavigate?: (page: string) => void;
}

export function MyDogsPage({ onNavigate }: MyDogsPageProps = {}) {
  const [view, setView] = useState<'list' | 'add' | 'detail'>('list');
  const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([
    {
      id: 1,
      name: 'Max',
      breed: 'Golden Retriever',
      age: '3 ans',
      weight: '32 kg',
      height: '58 cm',
      image: 'https://images.unsplash.com/photo-1719292606971-0916fc62f5b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      healthStatus: {
        vaccines: 'À jour',
        deworming: 'Dans 2 mois',
        vetVisit: '15 Nov 2025',
      },
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Border Collie',
      age: '2 ans',
      weight: '18 kg',
      height: '48 cm',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      healthStatus: {
        vaccines: 'À jour',
        deworming: 'À jour',
        vetVisit: '28 Nov 2025',
      },
    },
  ]);

  const handleAddDog = (dogData: any) => {
    const newDog: Dog = {
      id: dogs.length + 1,
      name: dogData.name,
      breed: dogData.breed,
      age: dogData.age || 'Non renseigné',
      weight: dogData.weight || 'Non renseigné',
      height: dogData.height,
      image: dogData.photo || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
      healthStatus: {
        vaccines: 'À mettre à jour',
        deworming: 'À mettre à jour',
        vetVisit: 'Non planifiée',
      },
    };

    setDogs([...dogs, newDog]);
    setView('list');
  };

  const handleDogClick = (dogId: number) => {
    setSelectedDogId(dogId);
    setView('detail');
  };

  if (view === 'add') {
    return (
      <AddDogPage
        onBack={() => setView('list')}
        onSave={handleAddDog}
      />
    );
  }

  if (view === 'detail' && selectedDogId) {
    const selectedDog = dogs.find(d => d.id === selectedDogId);
    if (selectedDog) {
      return <DogDetailView 
        dog={selectedDog} 
        onBack={() => setView('list')} 
        onNavigate={onNavigate}
        onViewProgression={(dogId) => {
          // This will be handled by App.tsx
          if (onNavigate) {
            (window as any).selectedDogId = dogId;
            onNavigate('dogProgression');
          }
        }}
      />;
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-white">Mes chiens</h1>
            <p className="text-white/80 text-sm">{dogs.length} compagnon{dogs.length > 1 ? 's' : ''} enregistré{dogs.length > 1 ? 's' : ''}</p>
          </div>
          <Button
            onClick={() => setView('add')}
            size="sm"
            className="bg-white text-[#41B6A6] hover:bg-white/90 rounded-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Dogs List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {dogs.map((dog) => (
          <Card
            key={dog.id}
            className="p-4 shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleDogClick(dog.id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#41B6A6] flex-shrink-0">
                <ImageWithFallback
                  src={dog.image}
                  alt={dog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 mb-1">{dog.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dog.breed}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{dog.age}</span>
                  <span>•</span>
                  <span>{dog.weight}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>

            {/* Quick Health Status */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Vaccins</p>
                <Badge
                  className={`text-xs ${
                    dog.healthStatus.vaccines === 'À jour'
                      ? 'bg-green-100 text-green-700 border-0'
                      : 'bg-orange-100 text-orange-700 border-0'
                  }`}
                >
                  {dog.healthStatus.vaccines}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Vermifuge</p>
                <Badge
                  className={`text-xs ${
                    dog.healthStatus.deworming === 'À jour'
                      ? 'bg-green-100 text-green-700 border-0'
                      : 'bg-orange-100 text-orange-700 border-0'
                  }`}
                >
                  {dog.healthStatus.deworming}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Véto</p>
                <p className="text-xs text-gray-700">{dog.healthStatus.vetVisit}</p>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {dogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-gray-800 mb-2">Aucun chien enregistré</h3>
            <p className="text-gray-600 mb-6">Ajoutez votre premier compagnon !</p>
            <Button
              onClick={() => setView('add')}
              className="bg-[#41B6A6] hover:bg-[#359889]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un chien
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Dog Detail View Component
interface DogDetailViewProps {
  dog: Dog;
  onBack: () => void;
  onNavigate?: (page: string) => void;
  onViewProgression?: (dogId: number) => void;
}

function DogDetailView({ dog, onBack, onNavigate, onViewProgression }: DogDetailViewProps) {
  const healthData = [
    { label: 'Vaccins', status: dog.healthStatus.vaccines, color: dog.healthStatus.vaccines === 'À jour' ? 'text-green-600' : 'text-orange-600', icon: '💉' },
    { label: 'Vermifuge', status: dog.healthStatus.deworming, color: dog.healthStatus.deworming === 'À jour' ? 'text-green-600' : 'text-orange-600', icon: '💊' },
    { label: 'Visite véto', status: dog.healthStatus.vetVisit, color: 'text-blue-600', icon: '🏥' },
  ];

  const trainingProgress = [
    { skill: 'Assis', progress: 100 },
    { skill: 'Couché', progress: 100 },
    { skill: 'Pas bouger', progress: 85 },
    { skill: 'Rappel', progress: 70 },
    { skill: 'Marche en laisse', progress: 60 },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20">
      {/* Header with Dog Profile */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full mb-4"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
        </Button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <ImageWithFallback
              src={dog.image}
              alt={dog.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-white">
            <h1 className="mb-1">{dog.name}</h1>
            <p className="text-white/90 mb-1">{dog.breed}</p>
            <div className="flex gap-3 text-sm text-white/80">
              <span>{dog.age}</span>
              <span>•</span>
              <span>{dog.weight}</span>
              {dog.height && (
                <>
                  <span>•</span>
                  <span>{dog.height}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Gamification CTA */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onViewProgression?.(dog.id)}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white mb-1">Niveau 12 • 2840 XP</h3>
                <p className="text-white/90 text-sm">Voir la progression & tâches</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6" />
          </div>
        </Card>

        {/* Quick Info Cards */}
        <section>
          <h2 className="text-gray-800 mb-4">Informations</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/10 to-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-[#41B6A6]" />
                <p className="text-xs text-gray-600">Âge</p>
              </div>
              <p className="text-gray-800">{dog.age}</p>
            </Card>
            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#E9B782]" />
                <p className="text-xs text-gray-600">Poids</p>
              </div>
              <p className="text-gray-800">{dog.weight}</p>
            </Card>
            {dog.height && (
              <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#F28B6F]/10 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-[#F28B6F]" />
                  <p className="text-xs text-gray-600">Taille</p>
                </div>
                <p className="text-gray-800">{dog.height}</p>
              </Card>
            )}
            <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-100 to-white">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-purple-600" />
                <p className="text-xs text-gray-600">Race</p>
              </div>
              <p className="text-sm text-gray-800">{dog.breed}</p>
            </Card>
          </div>
        </section>

        {/* Training Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Progression d'apprentissage</h2>
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
              <Award className="h-3 w-3 mr-1" />
              Niveau 3
            </Badge>
          </div>
          <Card className="p-4 shadow-sm border-0">
            <div className="space-y-4">
              {trainingProgress.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{item.skill}</span>
                      {item.progress === 100 && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs px-1.5 py-0">
                          ✓ Maîtrisé
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-[#41B6A6]">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Upcoming Appointments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Prochains rendez-vous</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#41B6A6] hover:bg-[#41B6A6]/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              {
                type: 'Vétérinaire',
                date: '15 Nov 2025',
                time: '14h30',
                location: 'Clinique Vétérinaire du Parc',
                icon: '🏥',
                color: 'bg-blue-100 text-blue-700',
              },
              {
                type: 'Séance Agility',
                date: '25 Oct 2025',
                time: '10h00',
                location: 'Club Canin Paris 15',
                icon: '🏃',
                color: 'bg-green-100 text-green-700',
              },
              {
                type: 'Toilettage',
                date: '30 Oct 2025',
                time: '16h00',
                location: 'Salon Pattes de Velours',
                icon: '✂️',
                color: 'bg-purple-100 text-purple-700',
              },
            ].map((appt, index) => (
              <Card key={index} className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full ${appt.color} flex items-center justify-center text-xl flex-shrink-0`}>
                    {appt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-gray-800">{appt.type}</h4>
                      <Badge variant="outline" className="text-xs border-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        {appt.time}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{appt.date}</p>
                    <p className="text-xs text-gray-500">{appt.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Health & Tracking */}
        <section>
          <h2 className="text-gray-800 mb-4">Santé & suivi</h2>
          <div className="grid grid-cols-3 gap-3">
            {healthData.map((item, index) => (
              <Card key={index} className="p-3 text-center shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <p className={`text-xs ${item.color}`}>{item.status}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements & Badges */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Badges & Récompenses</h2>
            <Badge className="bg-amber-100 text-amber-700 border-0">
              12 badges
            </Badge>
          </div>
          <Card className="p-4 shadow-sm border-0">
            <div className="grid grid-cols-4 gap-4">
              {[
                { emoji: '🏆', name: 'Champion', unlocked: true },
                { emoji: '⭐', name: 'Étoile', unlocked: true },
                { emoji: '🎯', name: 'Précision', unlocked: true },
                { emoji: '🚀', name: 'Rapide', unlocked: true },
                { emoji: '❤️', name: 'Sociable', unlocked: true },
                { emoji: '🧠', name: 'Intelligent', unlocked: true },
                { emoji: '💪', name: 'Fort', unlocked: false },
                { emoji: '🎓', name: 'Diplômé', unlocked: false },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100'
                      : 'bg-gray-100 opacity-40'
                  }`}
                >
                  <div className="text-2xl">{badge.emoji}</div>
                  <p className="text-[10px] text-gray-600 text-center">{badge.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* DjanAI Program */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-[#E9B782]" />
            <h2 className="text-gray-800">DjanAI - Programme Personnalisé</h2>
          </div>
          
          <div className="space-y-3">
            {/* Créer un nouveau programme */}
            <Card 
              className="p-5 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/10 to-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate?.('djanai')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#41B6A6] to-[#359889] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-1">Créer un programme avec DjanAI</h3>
                  <p className="text-sm text-gray-600">Répondez à quelques questions pour obtenir un programme personnalisé pour {dog.name}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>

            {/* Accéder au programme existant */}
            <Card 
              className="p-5 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate?.('djanai-program')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E9B782] to-[#d9a772] rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-1">Voir mon programme</h3>
                  <p className="text-sm text-gray-600">Consultez votre programme d'entraînement personnalisé</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          </div>
        </section>

        {/* Activity Log */}
        <section>
          <h2 className="text-gray-800 mb-4">Activités récentes</h2>
          <div className="space-y-2">
            {[
              { date: '22 Oct', activity: 'Séance Agility', duration: '1h', icon: '🏃', color: 'text-green-600' },
              { date: '20 Oct', activity: 'Promenade au parc', duration: '45min', icon: '🌳', color: 'text-emerald-600' },
              { date: '18 Oct', activity: 'Cours d\'obéissance', duration: '1h30', icon: '🎓', color: 'text-blue-600' },
            ].map((activity, index) => (
              <Card key={index} className="p-3 shadow-sm border-0 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`text-xl ${activity.color}`}>{activity.icon}</div>
                  <div>
                    <h4 className="text-sm mb-0">{activity.activity}</h4>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{activity.duration}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Reminders */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-[#F28B6F]" />
            <h2 className="text-gray-800">Rappels importants</h2>
          </div>
          <div className="space-y-2">
            {[
              {
                title: 'Rappel de vermifuge',
                date: 'Dans 2 mois',
                priority: 'medium',
                icon: '💊',
              },
              {
                title: 'Renouvellement vaccins',
                date: 'Dans 6 mois',
                priority: 'low',
                icon: '💉',
              },
            ].map((reminder, index) => (
              <Card
                key={index}
                className={`p-3 shadow-sm border-l-4 ${
                  reminder.priority === 'high'
                    ? 'border-l-red-500 bg-red-50'
                    : reminder.priority === 'medium'
                    ? 'border-l-orange-500 bg-orange-50'
                    : 'border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{reminder.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-800">{reminder.title}</h4>
                    <p className="text-xs text-gray-600">{reminder.date}</p>
                  </div>
                  <Bell className="h-4 w-4 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Photo Gallery Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Galerie photos</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#41B6A6] hover:bg-[#41B6A6]/10"
            >
              Voir tout
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[dog.image, dog.image, dog.image].map((img, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#41B6A6] transition-colors cursor-pointer"
              >
                <ImageWithFallback
                  src={img}
                  alt={`${dog.name} photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
              <Camera className="h-6 w-6 text-gray-400 mb-1" />
              <p className="text-[10px] text-gray-500">Ajouter</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
