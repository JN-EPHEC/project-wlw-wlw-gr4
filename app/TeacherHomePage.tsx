import { Award, Bell, Calendar, ChevronRight, Dog, DollarSign, MapPin, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface TeacherHomePageProps {
  onNavigate?: (page: string) => void;
}

export function TeacherHomePage({ onNavigate }: TeacherHomePageProps = {}) {
  const [notifications] = useState([
    { id: 1, type: 'booking', message: 'Nouvelle réservation pour demain 14h', time: '5 min', unread: true },
    { id: 2, type: 'review', message: 'Un client a laissé un avis 5★', time: '1h', unread: true },
    { id: 3, type: 'payment', message: 'Paiement de 45€ reçu', time: '3h', unread: false },
  ]);

  const upcomingClasses = [
    {
      id: 1,
      title: 'Éducation de base',
      client: 'Client',
      dog: 'Max',
      breed: 'Golden Retriever',
      date: 'Aujourd\'hui',
      time: '14:00',
      location: 'Parc de la Tête d\'Or',
      status: 'confirmed',
      price: 45,
    },
    {
      id: 2,
      title: 'Agility niveau 2',
      client: 'Client',
      dog: 'Luna',
      breed: 'Border Collie',
      date: 'Demain',
      time: '10:30',
      location: 'Club Canin Lyon Sud',
      status: 'confirmed',
      price: 55,
    },
    {
      id: 3,
      title: 'Comportement agressif',
      client: 'Client',
      dog: 'Rex',
      breed: 'Berger Allemand',
      date: 'Demain',
      time: '16:00',
      location: 'À domicile',
      status: 'pending',
      price: 65,
    },
  ];

  const stats = [
    { label: 'Ce mois', value: '1,240€', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Cours donnés', value: '28', icon: Calendar, color: 'bg-[#41B6A6]' },
    { label: 'Clients actifs', value: '15', icon: Users, color: 'bg-[#F28B6F]' },
    { label: 'Note moyenne', value: '4.9', icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white">Bonjour 👋</h1>
            <p className="text-white/80 text-sm mt-1">Éducateur canin professionnel</p>
          </div>
          <button 
            onClick={() => onNavigate?.('notifications')}
            className="relative bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition-colors"
          >
            <Bell className="h-5 w-5 text-white" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-white text-sm">{stat.value}</p>
              <p className="text-white/70 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Notifications récentes */}
        {notifications.some(n => n.unread) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2>Notifications</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate?.('notifications')}
              >
                Voir tout
              </Button>
            </div>

            <div className="space-y-2">
              {notifications.filter(n => n.unread).slice(0, 2).map((notification) => (
                <Card 
                  key={notification.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                  onClick={() => onNavigate?.('notifications')}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'booking' ? 'bg-blue-100' :
                      notification.type === 'review' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      {notification.type === 'booking' && <Calendar className="h-4 w-4 text-blue-600" />}
                      {notification.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
                      {notification.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#41B6A6] rounded-full mt-1.5" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cours à venir */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>Prochains cours</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('teacher-appointments')}
            >
              Voir tout
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingClasses.slice(0, 3).map((classItem) => (
              <Card 
                key={classItem.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm"
                onClick={() => onNavigate?.('teacher-appointments')}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] p-3 rounded-xl text-white text-center min-w-[60px]">
                    <p className="text-xs">{classItem.date}</p>
                    <p className="text-lg">{classItem.time}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-gray-800">{classItem.title}</h4>
                        <p className="text-sm text-gray-600">{classItem.client}</p>
                      </div>
                      {classItem.status === 'confirmed' ? (
                        <Badge className="bg-green-100 text-green-700 border-0 shrink-0">Confirmé</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-0 shrink-0">En attente</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Dog className="h-3.5 w-3.5" />
                        <span>{classItem.dog} - {classItem.breed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{classItem.location}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Tarif</span>
                      <span className="text-[#41B6A6]">{classItem.price}€</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-3">
          <h2>Actions rapides</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/10 to-white"
              onClick={() => onNavigate?.('teacher-appointments')}
            >
              <div className="bg-[#41B6A6] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-gray-800 mb-1">Ajouter un cours</h4>
              <p className="text-xs text-gray-600">Planifier une nouvelle séance</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-gradient-to-br from-green-50 to-white"
              onClick={() => onNavigate?.('teacher-account')}
            >
              <div className="bg-green-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-gray-800 mb-1">Paiements</h4>
              <p className="text-xs text-gray-600">Gérer mes revenus</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-white"
            >
              <div className="bg-yellow-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-gray-800 mb-1">Statistiques</h4>
              <p className="text-xs text-gray-600">Voir mes performances</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white"
            >
              <div className="bg-purple-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-gray-800 mb-1">Formations</h4>
              <p className="text-xs text-gray-600">Améliorer vos skills</p>
            </Card>
          </div>
        </div>

        {/* Boost profil (optionnel) */}
        <Card className="p-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 border-0 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white mb-1">Boostez votre visibilité</h4>
              <p className="text-white/90 text-sm mb-3">
                Apparaissez en tête des recherches et obtenez +300% de visibilité
              </p>
              <Button 
                className="bg-white text-orange-600 hover:bg-white/90"
                size="sm"
              >
                Découvrir <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
