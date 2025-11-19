import React, { useState } from 'react';
import { ArrowLeft, Users, Search, UserPlus, UserMinus, Shield, Ban, Clock, MoreVertical, Dog } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface ClubMembersPageProps {
  onBack: () => void;
}

export function ClubMembersPage({ onBack }: ClubMembersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [suspendDuration, setSuspendDuration] = useState('7');
  const [suspendReason, setSuspendReason] = useState('');

  const members = [
    {
      id: 1,
      name: 'Marie Dupont',
      email: 'marie.d@email.com',
      role: 'Membre',
      joinedDate: '15 Jan 2025',
      status: 'active',
      dogs: 2,
      lastActive: 'Il y a 2h',
      messagesCount: 145,
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.m@email.com',
      role: 'Modérateur',
      joinedDate: '03 Jan 2025',
      status: 'active',
      dogs: 1,
      lastActive: 'Il y a 5min',
      messagesCount: 328,
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.b@email.com',
      role: 'Membre',
      joinedDate: '28 Déc 2024',
      status: 'active',
      dogs: 1,
      lastActive: 'Il y a 1h',
      messagesCount: 89,
    },
    {
      id: 4,
      name: 'Thomas Petit',
      email: 'thomas.p@email.com',
      role: 'Membre',
      joinedDate: '20 Oct 2025',
      status: 'pending',
      dogs: 1,
      lastActive: '-',
      messagesCount: 0,
    },
    {
      id: 5,
      name: 'Julie Rousseau',
      email: 'julie.r@email.com',
      role: 'Membre',
      joinedDate: '18 Oct 2025',
      status: 'active',
      dogs: 3,
      lastActive: 'Il y a 10min',
      messagesCount: 234,
    },
    {
      id: 6,
      name: 'Marc Dubois',
      email: 'marc.d@email.com',
      role: 'Membre',
      joinedDate: '10 Oct 2025',
      status: 'suspended',
      dogs: 1,
      lastActive: 'Il y a 3 jours',
      messagesCount: 67,
      suspendedUntil: '29 Oct 2025',
      suspendReason: 'Comportement inapproprié',
    },
  ];

  const handleApprove = (memberId: number) => {
    console.log('Approving member:', memberId);
  };

  const handleReject = (memberId: number) => {
    console.log('Rejecting member:', memberId);
  };

  const handleKick = (memberId: number) => {
    console.log('Kicking member:', memberId);
  };

  const handleBan = (memberId: number) => {
    console.log('Banning member:', memberId);
  };

  const handleSuspend = () => {
    console.log('Suspending member:', selectedMember?.id, 'for', suspendDuration, 'days. Reason:', suspendReason);
    setShowSuspendDialog(false);
    setSelectedMember(null);
    setSuspendDuration('7');
    setSuspendReason('');
  };

  const handleUnsuspend = (memberId: number) => {
    console.log('Unsuspending member:', memberId);
  };

  const pendingMembers = members.filter(m => m.status === 'pending');
  const activeMembers = members.filter(m => m.status === 'active');
  const suspendedMembers = members.filter(m => m.status === 'suspended');

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 px-4 pt-12 pb-6 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white mb-2">Membres</h1>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="h-4 w-4" />
              <span className="text-sm">Gérez votre communauté</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-3 bg-white/95 border-0 shadow-md">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-gray-800 mb-0">{members.length}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{activeMembers.length}</p>
              <p className="text-xs text-gray-600">Actifs</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{pendingMembers.length}</p>
              <p className="text-xs text-gray-600">En attente</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pending Members */}
        {pendingMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-orange-600" />
              <h2 className="text-gray-800">Demandes en attente</h2>
              <Badge className="bg-orange-500 text-white border-0">
                {pendingMembers.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {pendingMembers.map((member) => (
                <Card key={member.id} className="p-4 shadow-sm border-2 border-orange-300 bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center">
                      {member.name.charAt(0)}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-800">{member.name}</h4>
                      <p className="text-xs text-gray-600">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Dog className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {member.dogs} chien{member.dogs > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(member.id)}
                      size="sm"
                      className="flex-1 bg-[#41B6A6] hover:bg-[#359889] h-8"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Approuver
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-red-600">
                          <UserMinus className="h-3 w-3 mr-1" />
                          Refuser
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Refuser la demande ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir refuser la demande de {member.name} ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleReject(member.id)}>
                            Refuser
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suspended Members */}
        {suspendedMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-red-600" />
              <h2 className="text-gray-800">Membres suspendus</h2>
              <Badge className="bg-red-500 text-white border-0">
                {suspendedMembers.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {suspendedMembers.map((member) => (
                <Card key={member.id} className="p-4 shadow-sm border-2 border-red-300 bg-red-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center relative">
                      {member.name.charAt(0)}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <Ban className="h-3 w-3 text-white" />
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-800">{member.name}</h4>
                      <p className="text-xs text-gray-600">{member.email}</p>
                      <div className="mt-1 p-2 bg-white rounded text-xs">
                        <p className="text-red-600">Suspendu jusqu'au {member.suspendedUntil}</p>
                        <p className="text-gray-600 mt-1">Raison: {member.suspendReason}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUnsuspend(member.id)}
                      size="sm"
                      className="flex-1 bg-[#41B6A6] hover:bg-[#359889] h-8"
                    >
                      Lever la suspension
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-red-600">
                          <Ban className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bannir définitivement ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. {member.name} sera définitivement exclu de votre communauté.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBan(member.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Bannir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Members */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-purple-600" />
            <h2 className="text-gray-800">Membres actifs</h2>
          </div>
          <div className="space-y-2">
            {activeMembers.map((member) => (
              <Card key={member.id} className="p-4 shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center">
                    {member.name.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm text-gray-800">{member.name}</h4>
                      {member.role === 'Modérateur' && (
                        <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                          {member.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{member.email}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Actif {member.lastActive}</span>
                      <span>•</span>
                      <span>{member.messagesCount} messages</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Dog className="h-3 w-3" />
                        {member.dogs}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="flex gap-1">
                    {/* Kick Button with AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Expulser ce membre ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {member.name} sera retiré de votre communauté mais pourra redemander à rejoindre.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleKick(member.id)}>
                            Expulser
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Suspend Button with Dialog */}
                    <Dialog open={showSuspendDialog && selectedMember?.id === member.id} onOpenChange={setShowSuspendDialog}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2"
                          onClick={() => setSelectedMember(member)}
                        >
                          <Clock className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Suspendre {member.name}</DialogTitle>
                          <DialogDescription>
                            Le membre ne pourra plus accéder à la communauté pendant la durée de la suspension.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Durée de la suspension</Label>
                            <Select value={suspendDuration} onValueChange={setSuspendDuration}>
                              <SelectTrigger className="mt-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 jour</SelectItem>
                                <SelectItem value="3">3 jours</SelectItem>
                                <SelectItem value="7">7 jours</SelectItem>
                                <SelectItem value="14">14 jours</SelectItem>
                                <SelectItem value="30">30 jours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Raison de la suspension</Label>
                            <Textarea
                              value={suspendReason}
                              onChange={(e) => setSuspendReason(e.target.value)}
                              placeholder="Ex: Comportement inapproprié..."
                              rows={3}
                              className="mt-1.5"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setShowSuspendDialog(false);
                                setSelectedMember(null);
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={handleSuspend}
                              className="flex-1 bg-orange-600 hover:bg-orange-700"
                            >
                              Suspendre
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Ban Button with AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 px-2 text-red-600">
                          <Ban className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bannir définitivement ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. {member.name} sera définitivement exclu de votre communauté.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBan(member.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Bannir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 pb-6">
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-purple-900 mb-1">Outils de modération</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <p><UserMinus className="h-3 w-3 inline mr-1" /><strong>Expulser:</strong> Retirer temporairement</p>
                <p><Clock className="h-3 w-3 inline mr-1" /><strong>Suspendre:</strong> Bloquer l'accès temporairement</p>
                <p><Ban className="h-3 w-3 inline mr-1" /><strong>Bannir:</strong> Exclusion définitive</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
