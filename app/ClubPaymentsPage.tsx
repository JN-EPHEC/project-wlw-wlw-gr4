import { ArrowUpRight, CheckCircle, Clock, CreditCard, Download, Euro, Filter, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ClubPaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = {
    totalRevenue: 2850,
    pendingPayments: 3,
    completedPayments: 34,
    monthlyGrowth: 12,
    averageTransaction: 52,
  };

  const recentTransactions = [
    {
      id: 1,
      date: '22 Oct 2025',
      client: 'Marie Dupont',
      service: 'Agility',
      amount: 45,
      status: 'completed',
      method: 'card',
    },
    {
      id: 2,
      date: '22 Oct 2025',
      client: 'Jean Martin',
      service: 'Éducation canine',
      amount: 50,
      status: 'completed',
      method: 'card',
    },
    {
      id: 3,
      date: '21 Oct 2025',
      client: 'Sophie Bernard',
      service: 'Cours collectif',
      amount: 30,
      status: 'completed',
      method: 'cash',
    },
    {
      id: 4,
      date: '20 Oct 2025',
      client: 'Thomas Petit',
      service: 'Comportement',
      amount: 65,
      status: 'completed',
      method: 'transfer',
    },
  ];

  const pendingPayments = [
    {
      id: 1,
      date: '25 Oct 2025',
      client: 'Julie Rousseau',
      service: 'Agility',
      amount: 45,
      dueDate: '27 Oct 2025',
    },
    {
      id: 2,
      date: '25 Oct 2025',
      client: 'Marc Dubois',
      service: 'Éducation',
      amount: 50,
      dueDate: '28 Oct 2025',
    },
    {
      id: 3,
      date: '24 Oct 2025',
      client: 'Laura Martin',
      service: 'Obéissance',
      amount: 30,
      dueDate: '26 Oct 2025',
    },
  ];

  const monthlyBreakdown = [
    { service: 'Agility', revenue: 890, sessions: 18, percentage: 31 },
    { service: 'Éducation canine', revenue: 1200, sessions: 24, percentage: 42 },
    { service: 'Obéissance', revenue: 480, sessions: 16, percentage: 17 },
    { service: 'Comportement', revenue: 280, sessions: 4, percentage: 10 },
  ];

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      case 'transfer':
        return '🏦';
      default:
        return '💰';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      case 'transfer':
        return 'Virement';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white">Paiements</h1>
          <Button
            size="sm"
            className="bg-white text-[#E9B782] hover:bg-white/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Revenue Card */}
        <Card className="p-4 bg-white/95 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Revenus du mois</p>
              <h2 className="text-gray-800 mb-0">{stats.totalRevenue}€</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-green-100 text-green-700 border-0">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{stats.monthlyGrowth}%
            </Badge>
            <span className="text-xs text-gray-600">vs mois dernier</span>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="p-3 text-center bg-white/95 border-0">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
            <p className="text-gray-800 mb-0">{stats.completedPayments}</p>
            <p className="text-[10px] text-gray-600">Payés</p>
          </Card>
          <Card className="p-3 text-center bg-white/95 border-0">
            <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
            <p className="text-gray-800 mb-0">{stats.pendingPayments}</p>
            <p className="text-[10px] text-gray-600">En attente</p>
          </Card>
          <Card className="p-3 text-center bg-white/95 border-0">
            <Euro className="h-5 w-5 mx-auto mb-1 text-blue-600" />
            <p className="text-gray-800 mb-0">{stats.averageTransaction}€</p>
            <p className="text-[10px] text-gray-600">Moy/séance</p>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 py-4 bg-white shadow-sm">
            <TabsList className="w-full grid grid-cols-3 p-1 bg-gray-100 rounded-xl h-auto gap-1">
              <TabsTrigger 
                value="overview" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Vue
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <CreditCard className="h-4 w-4 mr-1.5" />
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="rounded-lg data-[state=active]:bg-[#E9B782] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-200 data-[state=active]:hover:bg-[#d9a772] py-2.5"
              >
                <Clock className="h-4 w-4 mr-1.5" />
                Attente
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="px-4 py-4 space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800">Période</h3>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Revenue by Service */}
            <section>
              <h3 className="text-gray-800 mb-4">Revenus par service</h3>
              <Card className="p-4 shadow-sm border-0">
                <div className="space-y-4">
                  {monthlyBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm text-gray-800">{item.service}</h4>
                            <span className="text-sm text-gray-800">{item.revenue}€</span>
                          </div>
                          <p className="text-xs text-gray-600">{item.sessions} séances</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={item.percentage} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600 w-10 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Payment Methods */}
            <section>
              <h3 className="text-gray-800 mb-4">Modes de paiement</h3>
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center shadow-sm border-0">
                  <div className="text-2xl mb-2">💳</div>
                  <p className="text-gray-800 mb-1">65%</p>
                  <p className="text-xs text-gray-600">Carte</p>
                </Card>
                <Card className="p-4 text-center shadow-sm border-0">
                  <div className="text-2xl mb-2">💵</div>
                  <p className="text-gray-800 mb-1">25%</p>
                  <p className="text-xs text-gray-600">Espèces</p>
                </Card>
                <Card className="p-4 text-center shadow-sm border-0">
                  <div className="text-2xl mb-2">🏦</div>
                  <p className="text-gray-800 mb-1">10%</p>
                  <p className="text-xs text-gray-600">Virement</p>
                </Card>
              </div>
            </section>

            {/* Monthly Chart Placeholder */}
            <section>
              <h3 className="text-gray-800 mb-4">Évolution mensuelle</h3>
              <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/5 to-white">
                <div className="flex items-end justify-between h-32 gap-2">
                  {[65, 82, 75, 90, 88, 78, 85, 95].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-[#41B6A6] to-[#41B6A6]/60 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-[10px] text-gray-500">{index + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-600 mt-4">
                  Derniers 8 jours
                </p>
              </Card>
            </section>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="px-4 py-4 space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les paiements</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="transfer">Virement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-4 shadow-sm border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                        {getPaymentMethodIcon(transaction.method)}
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-800">{transaction.client}</h4>
                        <p className="text-xs text-gray-600">{transaction.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800">+{transaction.amount}€</p>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        Payé
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>{transaction.date}</span>
                    <span>{getPaymentMethodLabel(transaction.method)}</span>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              Voir plus de transactions
            </Button>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="px-4 py-4 space-y-4">
            {pendingPayments.length > 0 ? (
              <>
                <Card className="p-4 shadow-sm border-0 bg-orange-50 border-l-4 border-l-orange-500">
                  <div className="flex items-center gap-2 text-sm text-orange-800">
                    <Clock className="h-4 w-4" />
                    <span>{pendingPayments.length} paiements en attente</span>
                  </div>
                </Card>

                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <Card key={payment.id} className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm text-gray-800">{payment.client}</h4>
                            <p className="text-xs text-gray-600">{payment.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-800">{payment.amount}€</p>
                          <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                            En attente
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-gray-600">Séance: {payment.date}</span>
                        <span className="text-orange-600">Échéance: {payment.dueDate}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-[#41B6A6] hover:bg-[#359889] h-8">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Marquer payé
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8">
                          Relancer
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center shadow-sm border-0">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <h3 className="text-gray-800 mb-2">Tous les paiements sont à jour !</h3>
                <p className="text-sm text-gray-600">
                  Aucun paiement en attente pour le moment
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
