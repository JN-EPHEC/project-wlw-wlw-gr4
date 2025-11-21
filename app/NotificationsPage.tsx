import { ArrowLeft, Award, Bell, BellOff, Calendar, CheckCircle2, Gift, Heart, MessageCircle, Star, Trophy, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface NotificationsPageProps {
  onBack: () => void;
  onNavigateToRating?: (bookingId: number) => void;
  onNavigateToClub?: (clubId: number) => void;
}

const initialNotifications = [
  {
    id: 1,
    type: 'rating',
    title: 'Donnez votre avis',
    message: 'Comment s\'est passée votre séance au Canin Club Paris ?',
    time: 'Il y a 2 heures',
    isRead: false,
    icon: Star,
    iconColor: 'text-[#E9B782]',
    bgColor: 'bg-[#E9B782]/10',
    actionLabel: 'Noter maintenant',
    actionData: { bookingId: 1 },
  },
  {
    id: 2,
    type: 'booking',
    title: 'Réservation confirmée',
    message: 'Votre séance du 2 novembre à 14h00 avec Sophie Martin est confirmée.',
    time: 'Il y a 3 heures',
    isRead: false,
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    club: {
      name: 'Canin Club Paris',
      logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100&h=100&fit=crop',
    },
  },
  {
    id: 3,
    type: 'event',
    title: 'Nouvel événement',
    message: 'Compétition d\'Agility - Grand Prix 2024 disponible pour inscription !',
    time: 'Hier',
    isRead: false,
    icon: Trophy,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    club: {
      name: 'Agility Pro Paris',
      logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop',
    },
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Rappel de séance',
    message: 'N\'oubliez pas votre séance demain à 10h00 avec Max.',
    time: 'Hier',
    isRead: true,
    icon: Calendar,
    iconColor: 'text-[#41B6A6]',
    bgColor: 'bg-[#41B6A6]/10',
  },
  {
    id: 5,
    type: 'message',
    title: 'Nouveau message',
    message: 'Sophie Martin vous a envoyé un message dans le canal #conseils.',
    time: 'Il y a 2 jours',
    isRead: true,
    icon: MessageCircle,
    iconColor: 'text-[#F28B6F]',
    bgColor: 'bg-[#F28B6F]/10',
    club: {
      name: 'Canin Club Paris',
      logo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=100&h=100&fit=crop',
    },
  },
  {
    id: 6,
    type: 'achievement',
    title: 'Nouveau badge débloqué',
    message: 'Félicitations ! Vous avez obtenu le badge "Membre actif".',
    time: 'Il y a 3 jours',
    isRead: true,
    icon: Award,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 7,
    type: 'club',
    title: 'Nouveau club disponible',
    message: 'Dog Academy Lyon a rejoint Smart Dogs et est maintenant disponible dans votre zone.',
    time: 'Il y a 4 jours',
    isRead: true,
    icon: Users,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    club: {
      name: 'Dog Academy Lyon',
      logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop',
    },
  },
  {
    id: 8,
    type: 'promo',
    title: 'Offre spéciale',
    message: '-20% sur votre prochaine réservation de cours collectif ce mois-ci !',
    time: 'Il y a 5 jours',
    isRead: true,
    icon: Gift,
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 9,
    type: 'community',
    title: 'Nouveau post populaire',
    message: 'Un post de la communauté que vous suivez a reçu plus de 50 likes.',
    time: 'Il y a 6 jours',
    isRead: true,
    icon: Heart,
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
];

type Notification = typeof initialNotifications[number];

export function NotificationsPage({ onBack, onNavigateToRating, onNavigateToClub }: NotificationsPageProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.type === 'rating' && onNavigateToRating) {
      onNavigateToRating(notification.actionData?.bookingId || 1);
    } else if (notification.club && onNavigateToClub) {
      onNavigateToClub(1);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </Button>
        </div>
        <h1 className="text-white">Notifications</h1>
        {unreadCount > 0 && (
          <p className="text-white/80 mt-2">
            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={`rounded-full flex-1 ${
              filter === 'all' 
                ? 'bg-[#41B6A6] hover:bg-[#359889]' 
                : ''
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={`rounded-full flex-1 ${
              filter === 'unread' 
                ? 'bg-[#41B6A6] hover:bg-[#359889]' 
                : ''
            }`}
          >
            <BellOff className="h-4 w-4 mr-2" />
            Non lues ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div>
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-gray-800 mb-2">Aucune notification</h3>
            <p className="text-gray-600 text-center">
              {filter === 'unread' 
                ? 'Vous avez tout lu ! ??' 
                : 'Vous n\'avez pas encore de notifications.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-4 cursor-pointer transition-colors ${
                    !notification.isRead 
                      ? 'bg-[#41B6A6]/5 hover:bg-[#41B6A6]/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-gray-800">{notification.title}</h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#41B6A6] rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      
                      {/* Club info if available */}
                      {notification.club && (
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={notification.club.logo} />
                            <AvatarFallback>{notification.club.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{notification.club.name}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        
                        {/* Action button if available */}
                        {notification.actionLabel && (
                            <Button
                            size="sm"
                            className="bg-[#E9B782] hover:bg-[#d9a772] rounded-full h-8"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                              handleNotificationClick(notification);
                            }}
                            >
                            {notification.actionLabel}
                            </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
