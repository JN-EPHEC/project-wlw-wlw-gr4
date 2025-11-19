import React, { useState } from 'react';
import { ArrowLeft, Bell, Plus, Edit, Trash2, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ClubAnnouncementsPageProps {
  onBack: () => void;
}

export function ClubAnnouncementsPage({ onBack }: ClubAnnouncementsPageProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  const announcements = [
    {
      id: 1,
      title: 'Nouvelle session de groupe ce samedi !',
      content: 'Rejoignez-nous pour une session d\'agility collective ce samedi à 14h. Places limitées à 10 participants.',
      author: 'Sophie Leclerc',
      date: 'Il y a 2h',
      isNew: true,
    },
    {
      id: 2,
      title: 'Fermeture exceptionnelle lundi 30 octobre',
      content: 'Le club sera exceptionnellement fermé lundi 30 octobre pour travaux de maintenance. Merci de votre compréhension.',
      author: 'Pierre Martin',
      date: 'Hier',
      isNew: true,
    },
    {
      id: 3,
      title: 'Nouveau programme d\'éducation canine',
      content: 'Nous lançons un nouveau programme d\'éducation canine pour chiots de 3 à 6 mois. Inscriptions ouvertes !',
      author: 'Sophie Leclerc',
      date: 'Il y a 3 jours',
      isNew: false,
    },
    {
      id: 4,
      title: 'Compétition d\'agility - Résultats',
      content: 'Félicitations à tous les participants de la compétition d\'agility du weekend dernier ! Les résultats complets sont disponibles.',
      author: 'Pierre Martin',
      date: 'Il y a 5 jours',
      isNew: false,
    },
    {
      id: 5,
      title: 'Nouveau matériel d\'agility disponible',
      content: 'Nous avons reçu de nouveaux obstacles pour l\'agility. Venez les découvrir lors de vos prochaines séances !',
      author: 'Sophie Leclerc',
      date: 'Il y a 1 semaine',
      isNew: false,
    },
  ];

  const handleCreateAnnouncement = () => {
    console.log('Creating announcement:', newAnnouncement);
    setShowCreateDialog(false);
    setNewAnnouncement({ title: '', content: '' });
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header - Terracotta */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#E67A5F] px-4 pt-12 pb-6 shadow-lg">
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
            <h1 className="text-white mb-2">Annonces</h1>
            <div className="flex items-center gap-2 text-white/90">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Publications officielles du club</span>
            </div>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-white text-[#F28B6F] hover:bg-white/90 rounded-full shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%]">
              <DialogHeader>
                <DialogTitle>Nouvelle annonce</DialogTitle>
                <DialogDescription>
                  Créez une annonce officielle pour tous les membres du club.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Titre de l'annonce</Label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="Ex: Nouvelle session de groupe..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Contenu</Label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="Décrivez votre annonce..."
                    rows={6}
                    className="mt-1.5"
                  />
                </div>
                <Button
                  onClick={handleCreateAnnouncement}
                  className="w-full bg-[#F28B6F] hover:bg-[#E67A5F]"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Publier l'annonce
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <Card className="p-3 bg-white/95 border-0 shadow-md">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-gray-800 mb-0">{announcements.length}</p>
              <p className="text-xs text-gray-600">Annonces</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">{announcements.filter(a => a.isNew).length}</p>
              <p className="text-xs text-gray-600">Nouvelles</p>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div>
              <p className="text-gray-800 mb-0">127</p>
              <p className="text-xs text-gray-600">Lecteurs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-[#F28B6F]" />
          <h2 className="text-gray-800">Toutes les annonces</h2>
        </div>

        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className={`p-4 shadow-sm hover:shadow-md transition-all ${
              announcement.isNew ? 'border-2 border-[#F28B6F]/40 bg-[#F28B6F]/5' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-gray-800">{announcement.title}</h3>
                  {announcement.isNew && (
                    <Badge className="bg-[#F28B6F] text-white border-0 text-xs">
                      Nouveau
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{announcement.author}</span>
                  <span>•</span>
                  <span>{announcement.date}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Button size="sm" variant="outline" className="flex-1 h-8">
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <div className="px-4 pb-6">
        <Card className="p-4 bg-[#F28B6F]/10 border-[#F28B6F]/30">
          <div className="flex gap-3">
            <Bell className="h-5 w-5 text-[#F28B6F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-gray-800 mb-1">Annonces officielles</h4>
              <p className="text-sm text-gray-700">
                Seuls les éducateurs du club peuvent publier des annonces. Tous les membres recevront une notification.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
