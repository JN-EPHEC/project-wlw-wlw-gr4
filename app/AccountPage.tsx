import { BadgeCheck, Bell, Calendar, ChevronRight, Dog, Heart, LogOut, Settings, Star } from 'lucide-react';
import type { SignedInAccount } from '../hooks/auth';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  onShowRatingInvitation?: (bookingId: number) => void;
  onLogout?: () => void;
  user?: SignedInAccount | null;
}

export function AccountPage({ onNavigate, onShowRatingInvitation, onLogout, user }: AccountPageProps) {
  const profile = (user?.profile ?? {}) as Record<string, unknown>;
  const firstName = typeof profile['firstName'] === 'string' ? (profile['firstName'] as string) : undefined;
  const lastName = typeof profile['lastName'] === 'string' ? (profile['lastName'] as string) : undefined;
  const city = typeof profile['city'] === 'string' ? (profile['city'] as string) : undefined;
  const avatarUrl =
    typeof profile['profilePhoto'] === 'string' && profile['profilePhoto']
      ? (profile['profilePhoto'] as string)
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';
  const hasUser = !!user;
  const displayName = hasUser
    ? ([firstName, lastName].filter(Boolean).join(' ') || user?.displayName || user?.email || 'Utilisateur')
    : 'Utilisateur';
  const location = city ?? undefined;
  const isVerified = profile['verified'] !== false;
  const email = user?.email ?? undefined;
  const phone = typeof profile['phone'] === 'string' ? (profile['phone'] as string) : null;

  // 🔹 rôles corrigés : owner | club | educator
  const roleLabel =
    user?.role === 'club'
      ? 'Club'
      : user?.role === 'educator'
      ? 'Éducateur'
      : 'Particulier';

  const bookingsCount = typeof profile['bookingsCount'] === 'number' ? (profile['bookingsCount'] as number) : undefined;
  const dogsArray = Array.isArray(profile['dogs']) ? (profile['dogs'] as any[]) : undefined;
  const followedClubsArray = Array.isArray(profile['followedClubs']) ? (profile['followedClubs'] as any[]) : undefined;

  const stats = [
    { label: 'Réservations', value: bookingsCount ?? '-', icon: Calendar },
    { label: 'Chiens', value: typeof dogsArray === 'undefined' ? '-' : String(dogsArray.length), icon: Dog },
    { label: 'Clubs suivis', value: typeof followedClubsArray === 'undefined' ? '-' : String(followedClubsArray.length), icon: Heart },
  ];

  const menuItems = [
    { id: 'bookings', icon: Calendar, label: 'Mes réservations', badge: '3' },
    { id: 'dogs', icon: Dog, label: 'Mes chiens', badge: null },
    { id: 'followedClubs', icon: Heart, label: 'Clubs suivis', badge: null },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: '5' },
    { id: 'settings', icon: Settings, label: 'Paramètres', badge: null },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8">
        <h1 className="text-white mb-6">Mon compte</h1>

        {/* Profile Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#41B6A6]/20">
                <ImageWithFallback src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="mb-0">{displayName}</h2>
                  {isVerified && <BadgeCheck className="h-5 w-5 text-[#41B6A6]" />}
                </div>
                <p className="text-sm text-gray-500">{location}</p>
                <p className="text-xs text-gray-400 mt-1">{email}</p>
                {phone && <p className="text-xs text-gray-400">{phone}</p>}
                <div className="mt-3">
                  <Badge className="bg-[#41B6A6]/15 text-[#41B6A6] border border-[#41B6A6]/30">{roleLabel}</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#41B6A6]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#41B6A6]" />
                      </div>
                    </div>
                    <p className="text-gray-800 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Rating Invitation */}
        <section>
          <Card
            className="bg-gradient-to-br from-[#E9B782]/10 to-white shadow-sm border-0 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onShowRatingInvitation?.(1)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E9B782]/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-[#E9B782]" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">Donnez votre avis</h3>
                <p className="text-xs text-gray-500">
                  Comment s&apos;est passée votre dernière séance ? Partagez votre expérience.
                </p>
              </div>
              <Button size="sm" className="bg-[#E9B782] hover:bg-[#d9a772] text-white rounded-full">
                Noter
              </Button>
            </div>
          </Card>
        </section>

        {/* Verified badge */}
        <section>
          <Card className="bg-gradient-to-br from-[#41B6A6] to-[#359889] text-white border-0 shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Smart Dogs Verified</h3>
                  <p className="text-sm text-white/90">Badge actif</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6" />
            </div>
          </Card>
        </section>

        {/* Menu Items */}
        <section>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#41B6A6]/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#41B6A6]" />
                      </div>
                      <span className="text-gray-800">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge className="bg-[#F28B6F] text-white border-0 text-xs">{item.badge}</Badge>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* My Dogs Quick Access */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Mes chiens</h3>
            <button onClick={() => onNavigate('mydog')} className="text-[#41B6A6] text-sm">
              Voir tout
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {dogsArray && dogsArray.length > 0 ? (
              dogsArray.map((dog: any, idx: number) => (
                <Card
                  key={dog.id ?? `${dog.name ?? 'dog'}-${idx}`}
                  className="overflow-hidden shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onNavigate('mydog')}
                >
                  <div className="relative h-28">
                    <ImageWithFallback src={dog.image ?? ''} alt={dog.name ?? 'Chien'} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="mb-0">{dog.name ?? 'Chien'}</h4>
                    {dog.breed && <p className="text-xs text-gray-500">{dog.breed}</p>}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-4 shadow-sm border-0 text-center">
                <p className="text-sm text-gray-600">Aucun chien pour le moment.</p>
                <div className="mt-3">
                  <Button onClick={() => onNavigate('mydog')} className="text-[#41B6A6]">
                    Ajouter un chien
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Followed Clubs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800">Clubs suivis</h3>
            <button onClick={() => onNavigate('clubs')} className="text-[#41B6A6] text-sm">
              Découvrir
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {followedClubsArray && followedClubsArray.length > 0 ? (
              followedClubsArray.map((club: any, idx: number) => (
                <Card
                  key={club.id ?? `${club.name ?? 'club'}-${idx}`}
                  className="flex-shrink-0 p-3 shadow-sm border-0 text-center min-w-[80px] cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-2">{club.logo ?? '🏆'}</div>
                  <p className="text-xs text-gray-700 leading-tight">{club.name ?? 'Club'}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 shadow-sm border-0 text-center min-w-[200px]">
                <p className="text-sm text-gray-600">Vous ne suivez encore aucun club.</p>
                <div className="mt-2">
                  <Button onClick={() => onNavigate('clubs')} className="text-[#41B6A6]">
                    Découvrir des clubs
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Logout Button with confirmation */}
        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Se déconnecter du compte</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous êtes sur le point de vous déconnecter de votre compte Smart Dogs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onLogout?.()}
                >
                  Se déconnecter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
