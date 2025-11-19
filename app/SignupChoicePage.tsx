import React from 'react';
import { ArrowLeft, User, Building2, GraduationCap, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface SignupChoicePageProps {
  onSelectType: (type: 'user' | 'club' | 'teacher') => void;
  onBack: () => void;
}

export function SignupChoicePage({ onSelectType, onBack }: SignupChoicePageProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/10 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center text-white">
          <h1 className="mb-2">Créer un compte</h1>
          <p className="text-white/90 text-sm">Choisissez le type de compte</p>
        </div>
      </div>

      {/* Choice Cards */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
        {/* Particulier Card */}
        <Card
          className="p-6 shadow-lg border-2 border-transparent hover:border-[#41B6A6] cursor-pointer transition-all hover:shadow-xl"
          onClick={() => onSelectType('user')}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#41B6A6] to-[#359889] flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-800 mb-2">Compte Particulier</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pour les propriétaires de chiens qui souhaitent accéder aux services et à la communauté
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#41B6A6]" />
                  <span>Réserver des séances de dressage</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#41B6A6]" />
                  <span>Gérer le profil de vos chiens</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#41B6A6]" />
                  <span>Accéder à DjanAI et à la communauté</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#41B6A6]" />
                  <span>Rejoindre des clubs canins</span>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-[#41B6A6] hover:bg-[#359889]">
            Continuer en tant que particulier
          </Button>
        </Card>

        {/* Teacher Card */}
        <Card
          className="p-6 shadow-lg border-2 border-transparent hover:border-[#F28B6F] cursor-pointer transition-all hover:shadow-xl"
          onClick={() => onSelectType('teacher')}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-800 mb-2">Compte Éducateur / Indépendant</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pour les éducateurs canins indépendants qui proposent des services à titre personnel
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#F28B6F]" />
                  <span>Proposer vos propres séances</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#F28B6F]" />
                  <span>Gérer votre agenda et tarifs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#F28B6F]" />
                  <span>Être visible auprès des clients</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#F28B6F]" />
                  <span>Obtenir le badge "Smart Dogs Verified"</span>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-[#F28B6F] hover:bg-[#e67a5f] text-white">
            Continuer en tant qu'éducateur
          </Button>
        </Card>

        {/* Club Card */}
        <Card
          className="p-6 shadow-lg border-2 border-transparent hover:border-[#E9B782] cursor-pointer transition-all hover:shadow-xl"
          onClick={() => onSelectType('club')}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] flex items-center justify-center flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-800 mb-2">Compte Club / Structure</h2>
              <p className="text-sm text-gray-600 mb-4">
                Pour les clubs canins et structures qui gèrent plusieurs éducateurs
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#E9B782]" />
                  <span>Créer et gérer votre club</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#E9B782]" />
                  <span>Gérer plusieurs éducateurs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#E9B782]" />
                  <span>Organiser des événements</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#E9B782]" />
                  <span>Créer une communauté</span>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full mt-6 bg-[#E9B782] hover:bg-[#d9a772] text-white">
            Continuer en tant que club
          </Button>
        </Card>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h4 className="text-sm text-gray-800 mb-1">Besoin d'aide ?</h4>
              <p className="text-xs text-gray-600">
                Si vous ne savez pas quel type de compte choisir, contactez-nous à{' '}
                <a href="mailto:support@smartdogs.fr" className="text-[#41B6A6] hover:underline">
                  support@smartdogs.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
