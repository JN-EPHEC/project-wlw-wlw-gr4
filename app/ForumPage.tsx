import { ArrowLeft, Eye, MessageSquare, Plus, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

interface ForumPageProps {
  clubId: number;
  channelId: string;
  channelName: string;
  onBack: () => void;
  onPostClick: (postId: number) => void;
}

export function ForumPage({ channelName, onBack, onPostClick }: ForumPageProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Available tags
  const availableTags = [
    'Rappel', 'Chiot', 'Éducation de base', 'Comportement', 
    'Socialisation', 'Progrès', 'Friandises', 'Motivation',
    'Agility', 'Sport', 'DIY', 'Anxiété', 'Santé',
    'Alimentation', 'Jouets', 'Astuces', 'Questions'
  ];

  // Mock posts data
  const posts = [
    {
      id: 1,
      title: 'Comment apprendre le rappel à un chiot ?',
      author: 'Julie Martin',
      authorAvatar: 'JM',
      content: 'Bonjour à tous ! Mon chiot de 4 mois a du mal avec le rappel. Avez-vous des astuces qui ont fonctionné pour vous ?',
      category: 'Éducation',
      likes: 24,
      comments: 12,
      views: 156,
      timeAgo: 'Il y a 2h',
      tags: ['Rappel', 'Chiot', 'Éducation de base'],
    },
    {
      id: 2,
      title: 'Les meilleures friandises pour l\'entraînement',
      author: 'Marc Dubois',
      authorAvatar: 'MD',
      content: 'Je partage ma liste de friandises préférées pour l\'entraînement. Les petits morceaux de fromage fonctionnent super bien !',
      category: 'Conseils',
      likes: 45,
      comments: 23,
      views: 289,
      timeAgo: 'Il y a 5h',
      tags: ['Friandises', 'Motivation', 'Récompense'],
    },
    {
      id: 3,
      title: 'Socialisation : ma méthode qui fonctionne',
      author: 'Sophie Laurent',
      authorAvatar: 'SL',
      content: 'Après plusieurs mois d\'efforts, mon chien réactif s\'est transformé ! Voici comment j\'ai procédé...',
      category: 'Comportement',
      likes: 67,
      comments: 34,
      views: 412,
      timeAgo: 'Hier',
      tags: ['Socialisation', 'Comportement', 'Progrès'],
    },
    {
      id: 4,
      title: 'Exercices d\'agility à faire à la maison',
      author: 'Thomas Bernard',
      authorAvatar: 'TB',
      content: 'Pour ceux qui veulent débuter l\'agility, voici des exercices simples à faire chez soi sans matériel coûteux.',
      category: 'Sport',
      likes: 38,
      comments: 15,
      views: 234,
      timeAgo: 'Il y a 2 jours',
      tags: ['Agility', 'DIY', 'Exercices'],
    },
    {
      id: 5,
      title: 'Gérer l\'anxiété de séparation',
      author: 'Emma Petit',
      authorAvatar: 'EP',
      content: 'Mon chien avait une grosse anxiété de séparation. Voici les techniques qui ont vraiment aidé.',
      category: 'Comportement',
      likes: 52,
      comments: 28,
      views: 345,
      timeAgo: 'Il y a 3 jours',
      tags: ['Anxiété', 'Séparation', 'Solutions'],
    },
  ];

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      // In real app, would send to backend
      console.log('Creating post:', { title: newPostTitle, content: newPostContent, tags: selectedTags });
      setNewPostTitle('');
      setNewPostContent('');
      setSelectedTags([]);
      setIsCreateDialogOpen(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="text-white truncate">{channelName}</h2>
              <p className="text-white/80 text-sm">Forum de partage</p>
            </div>
          </div>
          
          {/* Create Post Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-white text-[#41B6A6] hover:bg-white/90 rounded-full flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Créer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[350px]">
              <DialogHeader>
                <DialogTitle>Créer un post</DialogTitle>
                <DialogDescription>
                  Partagez une astuce ou posez une question à la communauté
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Ex: Comment améliorer le rappel ?"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Partagez votre astuce ou posez une question..."
                    className="mt-1.5 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label>Tags (optionnel)</Label>
                  <div className="mt-2 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-2 border rounded-md">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-[#41B6A6] text-white hover:bg-[#359889]'
                            : 'border-gray-300 text-gray-600 hover:border-[#41B6A6] hover:text-[#41B6A6]'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} sélectionné{selectedTags.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                  className="w-full bg-[#41B6A6] hover:bg-[#359889]"
                >
                  Publier
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="flex-1 flex flex-col">
        <div className="px-4 pt-4 bg-white border-b">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="recent">Récents</TabsTrigger>
            <TabsTrigger value="popular">Populaires</TabsTrigger>
            <TabsTrigger value="trending">Tendances</TabsTrigger>
          </TabsList>
        </div>

        {/* Posts List */}
        <TabsContent value="recent" className="flex-1 overflow-y-auto m-0">
          <div className="px-4 py-4 space-y-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="p-4 hover:shadow-md transition-all cursor-pointer border-gray-200"
              >
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white flex-shrink-0">
                    {post.authorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                      <Badge variant="outline" className="ml-auto text-xs border-[#41B6A6]/30 text-[#41B6A6]">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Post Content Preview */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Post Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="flex-1 overflow-y-auto m-0">
          <div className="px-4 py-4 space-y-3">
            {[...posts].sort((a, b) => b.likes - a.likes).map((post) => (
              <Card
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="p-4 hover:shadow-md transition-all cursor-pointer border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white flex-shrink-0">
                    {post.authorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                      <Badge variant="outline" className="ml-auto text-xs border-[#41B6A6]/30 text-[#41B6A6]">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="flex-1 overflow-y-auto m-0">
          <div className="px-4 py-4 space-y-3">
            {[...posts].sort((a, b) => b.comments - a.comments).map((post) => (
              <Card
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="p-4 hover:shadow-md transition-all cursor-pointer border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white flex-shrink-0">
                    {post.authorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 line-clamp-2 mb-1">{post.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                      <Badge variant="outline" className="ml-auto text-xs border-[#41B6A6]/30 text-[#41B6A6]">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-[#41B6A6]" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{post.views}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
