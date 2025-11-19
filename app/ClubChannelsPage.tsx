import React, { useState } from 'react';
import { ArrowLeft, Hash, Plus, Settings, Lock, Globe, Users, MessageCircle, Bell, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ClubChannelsPageProps {
  onBack: () => void;
  onChannelClick: (channelId: string, channelName: string) => void;
}

export function ClubChannelsPage({ onBack, onChannelClick }: ClubChannelsPageProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    type: 'public',
  });

  const channels = [
    {
      id: 'announcements',
      name: 'Annonces officielles',
      description: 'Seuls les éducateurs peuvent publier',
      type: 'announcement',
      members: 127,
      unread: 3,
      lastMessage: 'Nouvelle session ce samedi...',
      lastTime: 'Il y a 2h',
    },
    {
      id: 'general',
      name: 'Discussion générale',
      description: 'Chat général du club',
      type: 'public',
      members: 127,
      unread: 12,
      lastMessage: 'Sophie: Quelqu\'un pour une balade...',
      lastTime: 'Il y a 5min',
    },
    {
      id: 'events',
      name: 'Événements',
      description: 'Organisation des événements',
      type: 'public',
      members: 89,
      unread: 5,
      lastMessage: 'Marc: RDV samedi 10h ?',
      lastTime: 'Il y a 30min',
    },
    {
      id: 'tips',
      name: 'Astuces & Conseils',
      description: 'Partage de conseils',
      type: 'public',
      members: 102,
      unread: 8,
      lastMessage: 'Emma: Nouveau tutoriel rappel',
      lastTime: 'Il y a 1h',
    },
    {
      id: 'beginners',
      name: 'Débutants',
      description: 'Questions des nouveaux',
      type: 'public',
      members: 45,
      unread: 2,
      lastMessage: 'Julie: Comment apprendre le assis ?',
      lastTime: 'Il y a 2h',
    },
    {
      id: 'staff',
      name: 'Staff',
      description: 'Équipe du club uniquement',
      type: 'private',
      members: 8,
      unread: 0,
      lastMessage: 'Pierre: Réunion demain ?',
      lastTime: 'Hier',
    },
  ];

  const handleCreateChannel = () => {
    console.log('Creating channel:', newChannel);
    setShowCreateDialog(false);
    setNewChannel({ name: '', description: '', type: 'public' });
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-600 px-4 pt-12 pb-6 shadow-lg">
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
            <h1 className="text-white mb-2">Salons de discussion</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">Gérez vos salons</span>
            </div>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-white text-gray-700 hover:bg-white/90 rounded-full shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Nouveau salon</DialogTitle>
                <DialogDescription>
                  Créez un nouveau salon de discussion pour votre communauté.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Nom du salon</Label>
                  <Input
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    placeholder="Ex: questions-débutants"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newChannel.description}
                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                    placeholder="Décrivez le but du salon..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Type de salon</Label>
                  <Select
                    value={newChannel.type}
                    onValueChange={(value) => setNewChannel({ ...newChannel, type: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Tous les membres</SelectItem>
                      <SelectItem value="private">Privé - Sur invitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateChannel}
                  className="w-full bg-gray-700 hover:bg-gray-600"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Créer le salon
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <Card className="p-3 bg-white/95 border-0 shadow-md">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-gray-800 mb-0">{channels.length}</p>
              <p className="text-xs text-gray-600">Salons</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{channels.filter(c => c.type === 'public').length}</p>
              <p className="text-xs text-gray-600">Publics</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{channels.reduce((sum, c) => sum + c.unread, 0)}</p>
              <p className="text-xs text-gray-600">Non lus</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Announcement Channel - Special */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-[#F28B6F]" />
            <h2 className="text-gray-800">Annonces</h2>
          </div>
          {channels
            .filter((c) => c.type === 'announcement')
            .map((channel) => (
              <Card
                key={channel.id}
                onClick={() => onChannelClick(channel.id, channel.name)}
                className="p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-[#F28B6F]/30 bg-[#F28B6F]/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F28B6F] to-[#E67A5F] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-gray-800">{channel.name}</h3>
                      {channel.unread > 0 && (
                        <Badge className="bg-[#F28B6F] text-white border-0">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#F28B6F] mb-2">{channel.description}</p>
                    <p className="text-sm text-gray-600 truncate mb-1">{channel.lastMessage}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{channel.lastTime}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {channel.members}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* Public Channels */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-5 w-5 text-gray-700" />
            <h2 className="text-gray-800">Salons publics</h2>
          </div>
          <div className="space-y-2">
            {channels
              .filter((c) => c.type === 'public')
              .map((channel) => (
                <Card
                  key={channel.id}
                  onClick={() => onChannelClick(channel.id, channel.name)}
                  className="p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hash className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="text-sm text-gray-800">{channel.name}</h4>
                          <p className="text-xs text-gray-500">{channel.description}</p>
                        </div>
                        {channel.unread > 0 && (
                          <Badge className="bg-red-500 text-white border-0 ml-2">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-2">{channel.lastMessage}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{channel.lastTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {channel.members}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Private Channels */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="h-5 w-5 text-purple-600" />
            <h2 className="text-gray-800">Salons privés</h2>
          </div>
          <div className="space-y-2">
            {channels
              .filter((c) => c.type === 'private')
              .map((channel) => (
                <Card
                  key={channel.id}
                  onClick={() => onChannelClick(channel.id, channel.name)}
                  className="p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-purple-200 bg-purple-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="text-sm text-gray-800">{channel.name}</h4>
                          <p className="text-xs text-purple-600">{channel.description}</p>
                        </div>
                        {channel.unread > 0 && (
                          <Badge className="bg-purple-600 text-white border-0 ml-2">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-2">{channel.lastMessage}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{channel.lastTime}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {channel.members}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
