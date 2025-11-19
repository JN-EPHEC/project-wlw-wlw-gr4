import React from 'react';
import { ArrowLeft, Calendar, Dog, Heart, Settings, Construction } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  onBack: () => void;
}

export function ComingSoonPage({ title, description, onBack }: ComingSoonPageProps) {
  const getIcon = () => {
    if (title.toLowerCase().includes('réservation')) return Calendar;
    if (title.toLowerCase().includes('chien')) return Dog;
    if (title.toLowerCase().includes('club') || title.toLowerCase().includes('suivi')) return Heart;
    if (title.toLowerCase().includes('paramètre')) return Settings;
    return Construction;
  };

  const Icon = getIcon();

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
        <h1 className="text-white">{title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-[#41B6A6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="h-10 w-10 text-[#41B6A6]" />
          </div>
          <h2 className="text-gray-800 mb-3">Bientôt disponible</h2>
          <p className="text-gray-600 mb-8">
            {description || 'Cette fonctionnalité sera disponible prochainement. Restez connecté pour ne rien manquer !'}
          </p>
          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-[#41B6A6]/5 to-white">
            <p className="text-sm text-gray-600">
              En attendant, explorez les autres fonctionnalités de Smart Dogs comme la recherche de clubs, les événements et la communauté !
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
