import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, MessageSquare, Eye, MoreVertical, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface PostDetailPageProps {
  postId: number;
  onBack: () => void;
}

export function PostDetailPage({ postId, onBack }: PostDetailPageProps) {
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Mock post data
  const post = {
    id: postId,
    title: 'Comment apprendre le rappel à un chiot ?',
    author: 'Julie Martin',
    authorAvatar: 'JM',
    content: `Bonjour à tous ! 👋

Mon chiot de 4 mois a du mal avec le rappel. J'ai essayé plusieurs méthodes mais rien ne semble vraiment fonctionner.

Quand je l'appelle, il me regarde mais continue ce qu'il fait. J'utilise des friandises comme récompense mais ça ne suffit pas.

Avez-vous des astuces qui ont fonctionné pour vous ? Des erreurs à éviter ?

Merci d'avance pour vos conseils ! 🐕`,
    category: 'Éducation',
    likes: 24,
    comments: 12,
    views: 156,
    timeAgo: 'Il y a 2h',
    tags: ['Rappel', 'Chiot', 'Éducation de base'],
  };

  // Mock comments data
  const comments = [
    {
      id: 1,
      author: 'Sophie Martin',
      authorAvatar: 'SM',
      isEducator: true,
      content: 'Excellent question ! Le rappel est fondamental. Mon conseil : commencez dans un environnement sans distractions et augmentez progressivement la difficulté. Utilisez un mot unique et récompensez TOUJOURS.',
      likes: 15,
      timeAgo: 'Il y a 1h',
    },
    {
      id: 2,
      author: 'Marc Dubois',
      authorAvatar: 'MD',
      isEducator: false,
      content: 'J\'ai eu le même problème ! Ce qui a marché pour moi : ne jamais rappeler pour quelque chose de négatif. Le rappel doit toujours être associé à du positif.',
      likes: 8,
      timeAgo: 'Il y a 1h',
    },
    {
      id: 3,
      author: 'Thomas Bernard',
      authorAvatar: 'TB',
      isEducator: false,
      content: 'Astuce : j\'utilise une longe de 10m pour l\'entraînement. Ça me permet de le "rappeler" physiquement s\'il ignore, tout en restant positif.',
      likes: 12,
      timeAgo: 'Il y a 45min',
    },
    {
      id: 4,
      author: 'Emma Petit',
      authorAvatar: 'EP',
      isEducator: false,
      content: 'Surtout ne pas répéter le rappel en boucle ! Si tu dis "viens" 10 fois, tu lui apprends qu\'il peut ignorer les 9 premières fois.',
      likes: 6,
      timeAgo: 'Il y a 30min',
    },
    {
      id: 5,
      author: 'Julie Martin',
      authorAvatar: 'JM',
      isEducator: false,
      content: 'Merci à tous pour vos conseils ! Je vais essayer avec la longe et en variant les récompenses. Je vous tiens au courant ! 🙏',
      likes: 3,
      timeAgo: 'Il y a 15min',
    },
  ];

  const handleSendComment = () => {
    if (newComment.trim()) {
      console.log('Sending comment:', newComment);
      setNewComment('');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-4 shadow-md">
        <div className="flex items-center justify-between">
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
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-4">
        {/* Post */}
        <Card className="p-4 mb-4">
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white flex-shrink-0">
              {post.authorAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-gray-800">{post.author}</h3>
                  <p className="text-xs text-gray-500">{post.timeAgo}</p>
                </div>
                <Badge variant="outline" className="border-[#41B6A6]/30 text-[#41B6A6]">
                  {post.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Post Title */}
          <h2 className="text-gray-800 mb-3">{post.title}</h2>

          {/* Post Content */}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
            {post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
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

          {/* Post Actions */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1 ${isLiked ? 'text-[#41B6A6]' : 'text-gray-600'}`}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes + (isLiked ? 1 : 0)}</span>
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
          </div>
        </Card>

        <Separator className="my-4" />

        {/* Comments Section */}
        <div className="mb-4">
          <h3 className="text-gray-800 mb-3">{comments.length} Commentaires</h3>
          
          <div className="space-y-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4 bg-gray-50 border-gray-200">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center text-white flex-shrink-0">
                    {comment.authorAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-gray-800">{comment.author}</span>
                      {comment.isEducator && (
                        <Badge className="text-xs bg-[#41B6A6] text-white border-0">
                          Éducateur
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{comment.timeAgo}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-gray-500 hover:text-[#41B6A6] -ml-2"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Comment Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="Ajouter un commentaire..."
              className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="flex-shrink-0 bg-[#41B6A6] hover:bg-[#359889] rounded-full h-12 w-12 p-0 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
