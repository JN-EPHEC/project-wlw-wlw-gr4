import { Edit, Eye, Heart, Image as ImageIcon, MessageCircle, MoreVertical, Plus, Search, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

interface TeacherCommunityPageProps {
  onNavigate?: (page: string) => void;
}

export function TeacherCommunityPage({ }: TeacherCommunityPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('my-posts');

  const [newPost, setNewPost] = useState({
    type: 'announcement',
    title: '',
    content: '',
    category: '',
    location: '',
  });

  const myPosts = [
    {
      id: 1,
      type: 'announcement',
      title: 'Séances de socialisation pour chiots',
      content: 'Bonjour à tous ! Je propose des séances collectives de socialisation pour chiots de 2 à 6 mois. Prochaine session samedi prochain.',
      category: 'Cours collectifs',
      author: 'Pierre Durand',
      authorRole: 'Éducateur canin',
      date: '2024-11-04',
      likes: 24,
      comments: 8,
      views: 156,
      location: 'Lyon',
    },
    {
      id: 2,
      type: 'tip',
      title: 'Astuce : Le rappel en 3 étapes',
      content: 'Voici ma méthode pour enseigner un rappel efficace à votre chien en seulement 3 étapes simples...',
      category: 'Conseils',
      author: 'Pierre Durand',
      authorRole: 'Éducateur canin',
      date: '2024-11-01',
      likes: 67,
      comments: 15,
      views: 432,
      location: null,
    },
  ];

  const communityPosts = [
    {
      id: 3,
      type: 'question',
      title: 'Besoin de conseils pour un chien réactif',
      content: 'Mon berger allemand de 2 ans est très réactif en laisse. Des recommandations de professionnels ?',
      category: 'Question',
      author: 'Marie L.',
      authorRole: 'Propriétaire',
      date: '2024-11-04',
      likes: 12,
      comments: 23,
      views: 89,
      location: 'Lyon',
    },
    {
      id: 4,
      type: 'event',
      title: 'Démonstration d\'agility gratuite',
      content: 'Le club organise une démonstration gratuite ce dimanche. Venez découvrir l\'agility !',
      category: 'Événement',
      author: 'Club Canin Lyon Sud',
      authorRole: 'Club',
      date: '2024-11-03',
      likes: 45,
      comments: 12,
      views: 234,
      location: 'Lyon Sud',
    },
  ];

  const handleCreatePost = () => {
    console.log('Creating post:', newPost);
    setShowCreateDialog(false);
    setNewPost({
      type: 'announcement',
      title: '',
      content: '',
      category: '',
      location: '',
    });
  };


  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white">Communauté</h1>
            <p className="text-white/80 text-sm mt-1">Partagez votre expertise</p>
          </div>
          <Button 
            className="bg-white text-[#F28B6F] hover:bg-white/90"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans la communauté..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white border-b border-gray-200 px-4 pt-4">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="my-posts">Mes publications ({myPosts.length})</TabsTrigger>
              <TabsTrigger value="community">Fil d'actualité</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-posts" className="px-4 py-4 space-y-4 mt-0">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center border-0 shadow-sm">
                <Eye className="h-5 w-5 text-[#41B6A6] mx-auto mb-1" />
                <p className="text-gray-800">588</p>
                <p className="text-xs text-gray-600">Vues</p>
              </Card>
              <Card className="p-3 text-center border-0 shadow-sm">
                <Heart className="h-5 w-5 text-[#F28B6F] mx-auto mb-1" />
                <p className="text-gray-800">91</p>
                <p className="text-xs text-gray-600">J'aime</p>
              </Card>
              <Card className="p-3 text-center border-0 shadow-sm">
                <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-gray-800">23</p>
                <p className="text-xs text-gray-600">Réponses</p>
              </Card>
            </div>

            {/* Posts */}
            {myPosts.length === 0 ? (
              <Card className="p-8 text-center border-0 shadow-sm">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-800 mb-2">Aucune publication</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Commencez à partager votre expertise avec la communauté
                </p>
                <Button 
                  className="bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une publication
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <Card key={post.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white shrink-0">
                        PD
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-gray-800">{post.author}</h4>
                              <Badge className="bg-[#41B6A6] text-white border-0 text-xs">
                                {post.authorRole}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                              {post.location && ` · ${post.location}`}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <Badge className="bg-[#F28B6F]/10 text-[#F28B6F] border-0 text-xs mb-2">
                          {post.category}
                        </Badge>

                        <h3 className="text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#F28B6F] transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#41B6A6] transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-1 text-sm text-gray-400 ml-auto">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="px-4 py-4 space-y-3 mt-0">
            {communityPosts.map((post) => (
              <Card key={post.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
                    post.authorRole === 'Club' 
                      ? 'bg-gradient-to-br from-[#E9B782] to-[#d9a772]'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {post.author.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-gray-800">{post.author}</h4>
                          <Badge className={`border-0 text-xs ${
                            post.authorRole === 'Club' 
                              ? 'bg-[#E9B782] text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {post.authorRole}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          {post.location && ` · ${post.location}`}
                        </p>
                      </div>
                    </div>

                    <Badge className={`text-xs mb-2 border-0 ${
                      post.type === 'question' ? 'bg-blue-100 text-blue-700' :
                      post.type === 'event' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.category}
                    </Badge>

                    <h3 className="text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#F28B6F] transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#41B6A6] transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-1 text-sm text-gray-400 ml-auto">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle publication</DialogTitle>
            <DialogDescription>
              Partagez une annonce, un conseil ou une actualité avec la communauté
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Type de publication</Label>
              <Select value={newPost.type} onValueChange={(value: string) => setNewPost({ ...newPost, type: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Annonce</SelectItem>
                  <SelectItem value="tip">Conseil / Astuce</SelectItem>
                  <SelectItem value="event">Événement</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Catégorie</Label>
              <Select value={newPost.category} onValueChange={(value: string) => setNewPost({ ...newPost, category: value })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cours">Cours collectifs</SelectItem>
                  <SelectItem value="conseils">Conseils d'éducation</SelectItem>
                  <SelectItem value="agility">Agility</SelectItem>
                  <SelectItem value="comportement">Comportement</SelectItem>
                  <SelectItem value="evenement">Événement</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Titre</Label>
              <Input
                placeholder="Un titre accrocheur..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Contenu</Label>
              <Textarea
                placeholder="Partagez votre message..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div>
              <Label>Localisation (optionnel)</Label>
              <Input
                placeholder="Ex: Lyon, Villeurbanne..."
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <Button variant="outline" className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" />
              Ajouter une image (bientôt disponible)
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCreateDialog(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
              onClick={handleCreatePost}
            >
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
