import React, { useState } from 'react';
import { Building2, Users, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, Euro, MessageSquare, CreditCard, Zap, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface ClubHomePageProps {
  onNavigate: (page: string) => void;
}

export function ClubHomePage({ onNavigate }: ClubHomePageProps) {
  const [showBoostDialog, setShowBoostDialog] = useState(false);

  const todayAppointments = [
    { id: 1, time: '10:00', client: 'Marie Dupont', dog: 'Max', service: 'Agility' },
    { id: 2, time: '14:30', client: 'Jean Martin', dog: 'Luna', service: 'Éducation' },
    { id: 3, time: '16:00', client: 'Sophie Bernard', dog: 'Rex', service: 'Comportement' },
  ];

  const stats = {
    members: 127,
    appointmentsToday: 8,
    appointmentsWeek: 34,
    revenue: 2850,
    pendingPayments: 3,
  };

  const recentActivity = [
    { type: 'booking', message: 'Nouvelle réservation - Marie Dupont', time: '5 min' },
    { type: 'payment', message: 'Paiement reçu - 45€', time: '1h' },
    { type: 'member', message: 'Nouveau membre - Thomas Petit', time: '2h' },
    { type: 'message', message: '3 nouveaux messages dans "Annonces"', time: '3h' },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E9B782]/10 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <h1 className="mb-1">Club Canin Paris 15</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              <span className="text-white/80 text-sm">Dashboard</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Building2 className="h-8 w-8 text-[#E9B782]" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { label: 'Membres', value: stats.members, icon: Users },
            { label: "Auj.", value: stats.appointmentsToday, icon: Calendar },
            { label: 'Semaine', value: stats.appointmentsWeek, icon: Clock },
            { label: 'En attente', value: stats.pendingPayments, icon: AlertCircle },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-3 text-center bg-white/95 border-0">
                <Icon className="h-4 w-4 mx-auto mb-1 text-[#E9B782]" />
                <p className="text-gray-800 mb-0">{stat.value}</p>
                <p className="text-[10px] text-gray-600">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Boost Promotion Banner */}
        <Card className="p-4 shadow-lg border-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-white" />
                  <Badge className="bg-white/90 text-orange-600 border-0">Premium</Badge>
                </div>
                <h3 className="text-white mb-1">Boostez votre visibilité !</h3>
                <p className="text-sm text-white/90">
                  Apparaissez en tête des résultats et attirez +300% de clients
                </p>
              </div>
            </div>
            
            <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-white text-orange-600 hover:bg-white/90 shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Découvrir les offres
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%]">
                <DialogHeader>
                  <DialogTitle>Booster votre club</DialogTitle>
                  <DialogDescription>
                    Choisissez la durée de votre boost pour maximiser votre visibilité.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Card className="p-4 border-2 border-yellow-300 hover:border-yellow-400 cursor-pointer transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-gray-800">Boost 7 jours</h4>
                          <p className="text-xs text-gray-600">1 semaine de visibilité maximale</p>
                        </div>
                        <p className="text-yellow-600">29€</p>
                      </div>
                      <p className="text-xs text-gray-500">~4€/jour</p>
                    </Card>

                    <Card className="p-4 border-2 border-yellow-400 bg-yellow-50 hover:border-yellow-500 cursor-pointer transition-all relative">
                      <Badge className="absolute -top-2 right-2 bg-green-500 text-white border-0 text-xs">
                        Populaire
                      </Badge>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-gray-800">Boost 30 jours</h4>
                          <p className="text-xs text-gray-600">1 mois complet</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-600">99€</p>
                          <p className="text-xs text-gray-500 line-through">116€</p>
                        </div>
                      </div>
                      <p className="text-xs text-green-600">Économisez 15% · ~3.30€/jour</p>
                    </Card>

                    <Card className="p-4 border-2 border-yellow-300 hover:border-yellow-400 cursor-pointer transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-gray-800">Boost 90 jours</h4>
                          <p className="text-xs text-gray-600">3 mois de visibilité</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-600">249€</p>
                          <p className="text-xs text-gray-500 line-through">348€</p>
                        </div>
                      </div>
                      <p className="text-xs text-green-600">Économisez 30% · ~2.75€/jour</p>
                    </Card>
                  </div>

                  <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                    <p className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <strong>Badge premium visible</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <strong>Position en tête des résultats</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <strong>Statistiques détaillées</strong>
                    </p>
                  </div>

                  <Button 
                    onClick={() => onNavigate('clubProfile')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    Voir plus d'options dans Mon Club
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Revenue Card */}
        <Card className="p-4 shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenus du mois</p>
              <h2 className="text-green-700 mb-0">{stats.revenue}€</h2>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% vs mois dernier
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Euro className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Objectif mensuel</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </Card>

        {/* Today's Appointments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">Rendez-vous du jour</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('clubAppointments')}
              className="text-[#E9B782] hover:bg-[#E9B782]/10"
            >
              Voir tout
            </Button>
          </div>
          <div className="space-y-2">
            {todayAppointments.map((appt) => (
              <Card key={appt.id} className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#E9B782]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#E9B782]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm text-gray-800">{appt.time}</h4>
                      <Badge variant="outline" className="text-xs">
                        {appt.service}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{appt.client} - {appt.dog}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-gray-800 mb-4">Activité récente</h2>
          <Card className="p-4 shadow-sm border-0">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'booking' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'member' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'booking' ? '📅' :
                     activity.type === 'payment' ? '💰' :
                     activity.type === 'member' ? '👤' :
                     '💬'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-gray-800 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate('clubAppointments')}
              className="h-20 bg-gradient-to-br from-[#41B6A6] to-[#359889] hover:from-[#359889] hover:to-[#41B6A6] flex-col gap-2"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Nouveau RDV</span>
            </Button>
            <Button
              onClick={() => onNavigate('clubCommunity')}
              className="h-20 bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] hover:from-[#e67a5f] hover:to-[#F28B6F] flex-col gap-2"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Messages</span>
            </Button>
            <Button
              onClick={() => onNavigate('clubTeachers')}
              className="h-20 bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782] flex-col gap-2"
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Professeurs</span>
            </Button>
            <Button
              onClick={() => onNavigate('clubProfile')}
              className="h-20 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 flex-col gap-2"
            >
              <Building2 className="h-6 w-6" />
              <span className="text-sm">Mon Club</span>
            </Button>
            <Button
              onClick={() => onNavigate('clubPayments')}
              className="h-20 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500 flex-col gap-2 col-span-2"
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-sm">Paiements</span>
            </Button>
          </div>
        </section>

        {/* Alerts */}
        <Card className="p-4 shadow-sm border-0 bg-orange-50 border-l-4 border-l-orange-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-gray-800 mb-1">Attention requise</h4>
              <p className="text-xs text-gray-600 mb-2">
                Vous avez 3 paiements en attente de confirmation
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate('clubPayments')}
                className="border-orange-500 text-orange-600 hover:bg-orange-100"
              >
                Voir les paiements
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
