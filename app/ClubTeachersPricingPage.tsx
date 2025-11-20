import { ArrowLeft, CheckCircle, Gift, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ClubTeachersPricingPageProps {
  onBack: () => void;
  onContinue: (selectedCount: number, totalPrice: number) => void;
  currentTeachersCount: number;
}

export function ClubTeachersPricingPage({ onBack, onContinue, currentTeachersCount }: ClubTeachersPricingPageProps) {
  const [selectedCount, setSelectedCount] = useState(1);
  const pricePerTeacher = 5;
  const freeTeacherThreshold = 5;

  // Calcul du prix total avec professeurs offerts
  const calculatePrice = (count: number): { total: number; free: number; paid: number } => {
    const freeTeachers = Math.floor(count / freeTeacherThreshold);
    const paidTeachers = count - freeTeachers;
    const total = paidTeachers * pricePerTeacher;
    return { total, free: freeTeachers, paid: paidTeachers };
  };

  const priceInfo = calculatePrice(selectedCount);

  const pricingOptions = [
    { count: 1, popular: false },
    { count: 3, popular: false },
    { count: 5, popular: true },
    { count: 10, popular: false },
  ];

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Ajouter des professeurs</h1>
            <p className="text-white/90 text-sm">
              Choisissez le nombre de professeurs à ajouter
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Current Status */}
        <Card className="p-4 shadow-sm border-0 bg-blue-50 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900">
                <strong>Actuellement :</strong> {currentTeachersCount} professeur(s)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                2 professeurs gratuits déjà utilisés
              </p>
            </div>
          </div>
        </Card>

        {/* Offer Banner */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="flex items-start gap-3">
            <Gift className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-green-900 mb-1">Offre spéciale !</h3>
              <p className="text-sm text-green-800">
                <strong>1 professeur offert tous les 5 professeurs</strong>
              </p>
              <p className="text-xs text-green-700 mt-1">
                Plus vous ajoutez de professeurs, plus vous économisez !
              </p>
            </div>
          </div>
        </Card>

        {/* Pricing Options */}
        <section>
          <h2 className="text-gray-800 mb-4">Forfaits disponibles</h2>
          <div className="space-y-3">
            {pricingOptions.map((option) => {
              const info = calculatePrice(option.count);
              const isSelected = selectedCount === option.count;
              
              return (
                <Card
                  key={option.count}
                  onClick={() => setSelectedCount(option.count)}
                  className={`p-4 cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-2 border-[#E9B782] shadow-md'
                      : 'border-0 shadow-sm hover:shadow-md'
                  } ${option.popular ? 'bg-[#E9B782]/5' : ''}`}
                >
                  {option.popular && (
                    <Badge className="absolute -top-2 right-4 bg-green-500 text-white border-0">
                      Populaire
                    </Badge>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-800">
                          {option.count} professeur{option.count > 1 ? 's' : ''}
                        </h3>
                        {info.free > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            +{info.free} offert{info.free > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {info.paid} × {pricePerTeacher}€
                          {info.free > 0 && ` + ${info.free} offert${info.free > 1 ? 's' : ''}`}
                        </p>
                        {option.count >= freeTeacherThreshold && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Économie de {info.free * pricePerTeacher}€
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[#E9B782]">{info.total}€</p>
                      <p className="text-xs text-gray-500">/mois</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-2 top-2">
                      <div className="w-6 h-6 rounded-full bg-[#E9B782] flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Custom Count */}
        <Card className="p-4 shadow-sm border-0 border-2 border-dashed border-gray-300">
          <h3 className="text-gray-800 mb-3">Nombre personnalisé</h3>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedCount(Math.max(1, selectedCount - 1))}
              className="h-10 w-10"
            >
              -
            </Button>
            
            <div className="flex-1 text-center">
              <p className="text-gray-800">{selectedCount} professeur{selectedCount > 1 ? 's' : ''}</p>
              {priceInfo.free > 0 && (
                <p className="text-xs text-green-600">
                  + {priceInfo.free} offert{priceInfo.free > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedCount(selectedCount + 1)}
              className="h-10 w-10"
            >
              +
            </Button>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <h3 className="text-gray-800 mb-3">Récapitulatif</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Professeurs payants</span>
              <span className="text-gray-800">{priceInfo.paid} × {pricePerTeacher}€</span>
            </div>
            
            {priceInfo.free > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Professeurs offerts</span>
                <span className="text-green-700">+ {priceInfo.free}</span>
              </div>
            )}
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-800">Total</span>
                <div className="text-right">
                  <p className="text-[#E9B782]">{priceInfo.total}€</p>
                  <p className="text-xs text-gray-500">/mois</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-xs text-gray-600">
                • Total de {selectedCount} professeur{selectedCount > 1 ? 's' : ''} 
                {' '}({priceInfo.paid} payant{priceInfo.paid > 1 ? 's' : ''}{priceInfo.free > 0 ? ` + ${priceInfo.free} offert${priceInfo.free > 1 ? 's' : ''}` : ''})
              </p>
              <p className="text-xs text-gray-600">
                • Renouvellement automatique mensuel
              </p>
              <p className="text-xs text-gray-600">
                • Annulation possible à tout moment
              </p>
            </div>
          </div>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={() => onContinue(selectedCount, priceInfo.total)}
          className="w-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782] shadow-lg"
        >
          Continuer vers le paiement
        </Button>
      </div>
    </div>
  );
}
