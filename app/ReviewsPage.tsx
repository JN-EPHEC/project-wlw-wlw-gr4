import { ArrowLeft, Calendar, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface ReviewsPageProps {
  clubId?: number;
  trainerId?: number;
  onBack: () => void;
}

export function ReviewsPage({ onBack }: ReviewsPageProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Mock data
  const stats = {
    averageRating: 4.7,
    totalReviews: 124,
    breakdown: {
      5: 89,
      4: 25,
      3: 7,
      2: 2,
      1: 1,
    },
  };

  const reviews = [
    {
      id: 1,
      user: {
        name: 'Marc Dubois',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        dog: 'Luna',
      },
      rating: 5,
      date: '15 Octobre 2024',
      comment: 'Excellente expérience ! Sophie est très pédagogue et a su mettre Luna en confiance dès le premier cours. Les installations sont impeccables et l\'accueil chaleureux.',
      tags: ['Professionnel', 'Pédagogue', 'Installations propres'],
      helpful: 12,
    },
    {
      id: 2,
      user: {
        name: 'Julie Martin',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        dog: 'Max',
      },
      rating: 5,
      date: '10 Octobre 2024',
      comment: 'Je recommande vivement ! Les progrès de Max ont été spectaculaires en seulement 3 séances. L\'équipe est à l\'écoute et les conseils sont très pratiques.',
      tags: ['À l\'écoute', 'Passionné', 'Bon équipement'],
      helpful: 8,
    },
    {
      id: 3,
      user: {
        name: 'Thomas Laurent',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        dog: 'Rocky',
      },
      rating: 4,
      date: '5 Octobre 2024',
      comment: 'Très bon club dans l\'ensemble. Seul petit bémol : le parking peut être compliqué aux heures de pointe.',
      tags: ['Patient', 'Bien situé'],
      helpful: 5,
    },
    {
      id: 4,
      user: {
        name: 'Sophie Renard',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        dog: 'Bella',
      },
      rating: 5,
      date: '28 Septembre 2024',
      comment: 'Un club exceptionnel ! L\'approche positive utilisée a fait des miracles avec Bella qui était très anxieuse. Merci infiniment !',
      tags: ['Patient', 'Professionnel', 'Bonne ambiance'],
      helpful: 15,
    },
    {
      id: 5,
      user: {
        name: 'Pierre Durand',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        dog: 'Charlie',
      },
      rating: 5,
      date: '20 Septembre 2024',
      comment: 'Rapport qualité-prix imbattable. Les cours sont complets, les explications claires et le suivi personnalisé.',
      tags: ['Pédagogue', 'Ponctuel', 'Accueil chaleureux'],
      helpful: 6,
    },
  ];

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-[#E9B782] text-[#E9B782]'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white">Avis clients</h1>
        <p className="text-white/80 mt-2">{stats.totalReviews} avis</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* Overall Rating */}
        <div className="px-4 py-6 border-b border-gray-100">
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#E9B782]/10 to-white">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-gray-800" style={{ fontSize: '3rem', lineHeight: '1' }}>{stats.averageRating}</span>
                </div>
                {renderStars(Math.round(stats.averageRating), 'lg')}
                <p className="text-sm text-gray-600 mt-2">{stats.totalReviews} avis</p>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.breakdown[stars as keyof typeof stats.breakdown];
                  const percentage = (count / stats.totalReviews) * 100;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-[#E9B782] text-[#E9B782]" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E9B782]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant={filterRating === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterRating(null)}
              className={`rounded-full flex-shrink-0 ${
                filterRating === null 
                  ? 'bg-[#41B6A6] hover:bg-[#359889]' 
                  : ''
              }`}
            >
              Tous
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filterRating === rating ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating(rating)}
                className={`rounded-full flex-shrink-0 ${
                  filterRating === rating 
                    ? 'bg-[#41B6A6] hover:bg-[#359889]' 
                    : ''
                }`}
              >
                <Star className="h-3 w-3 mr-1" />
                {rating}
              </Button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 py-6 space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6 border-0 shadow-sm">
              {/* User Info */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-800">{review.user.name}</h4>
                      <p className="text-sm text-gray-600">Propriétaire de {review.user.dog}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {renderStars(review.rating, 'sm')}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* Tags */}
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="bg-[#41B6A6]/10 text-[#41B6A6] border-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              {/* Helpful */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#41B6A6]">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Utile ({review.helpful})
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Aucun avis avec ce filtre</p>
          </div>
        )}
      </div>
    </div>
  );
}
