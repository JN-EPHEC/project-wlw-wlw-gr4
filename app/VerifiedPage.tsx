import { ArrowLeft, BadgeCheck, Crown, FileCheck, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface VerifiedPageProps {
  onBack: () => void;
}

export function VerifiedPage({ onBack }: VerifiedPageProps) {
  const steps = [
    {
      number: 1,
      title: 'Soumettre les documents',
      description: 'Carte d\'identité, certificat professionnel, attestation d\'assurance',
      icon: FileCheck,
      status: 'completed',
    },
    {
      number: 2,
      title: 'Vérification d\'identité',
      description: 'Notre équipe vérifie votre profil et vos qualifications',
      icon: Shield,
      status: 'completed',
    },
    {
      number: 3,
      title: 'Validation finale',
      description: 'Recevez votre badge Smart Dogs Verified',
      icon: BadgeCheck,
      status: 'completed',
    },
  ];

  const benefits = [
    {
      title: 'Badge de confiance',
      description: 'Augmentez la confiance de vos clients',
      emoji: '✅',
    },
    {
      title: 'Visibilité accrue',
      description: 'Apparaissez en priorité dans les recherches',
      emoji: '🔍',
    },
    {
      title: 'Statistiques détaillées',
      description: 'Accédez à vos performances et insights',
      emoji: '📊',
    },
    {
      title: 'Support prioritaire',
      description: 'Assistance rapide et dédiée',
      emoji: '🎯',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#41B6A6]/5 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BadgeCheck className="h-8 w-8 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-white mb-1">Smart Dogs Verified</h1>
            <p className="text-white/90 text-sm">Badge de confiance officiel</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Current Status */}
        <section>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg border-0 p-5">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-white mb-1">Statut actuel</h3>
                <p className="text-sm text-white/90">Votre compte est vérifié ✓</p>
              </div>
              <BadgeCheck className="h-12 w-12 text-white/90" />
            </div>
          </Card>
        </section>

        {/* About the Badge */}
        <section>
          <h2 className="text-gray-800 mb-4">À propos du badge</h2>
          <Card className="p-5 shadow-sm border-0">
            <p className="text-gray-700 leading-relaxed mb-4">
              Le badge <strong>Smart Dogs Verified</strong> est un gage de qualité et de confiance pour les propriétaires de chiens. Il certifie que vous êtes un professionnel qualifié et vérifié par notre équipe.
            </p>
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
              100% Gratuit
            </Badge>
          </Card>
        </section>

        {/* Verification Steps */}
        <section>
          <h2 className="text-gray-800 mb-4">Processus de vérification</h2>
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="p-4 shadow-sm border-0">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'completed' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="mb-0">Étape {step.number}: {step.title}</h4>
                        {step.status === 'completed' && (
                          <BadgeCheck className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-gray-800 mb-4">Avantages du badge</h2>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-4 shadow-sm border-0 text-center">
                <div className="text-3xl mb-3">{benefit.emoji}</div>
                <h4 className="mb-2 text-sm">{benefit.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Premium Boost */}
        <section>
          <Card className="bg-gradient-to-r from-[#E9B782] to-[#F28B6F] shadow-lg border-0 p-5">
            <div className="text-center text-white">
              <Crown className="h-12 w-12 mx-auto mb-3 text-white/90" />
              <h3 className="text-white mb-2">Boost Premium</h3>
              <p className="text-sm text-white/90 mb-4">
                Augmentez votre visibilité de 3x avec le boost payant
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-3xl">29€</span>
                <span className="text-sm text-white/80">/mois</span>
              </div>
              <Button className="w-full bg-white text-[#E9B782] hover:bg-white/90">
                En savoir plus
              </Button>
            </div>
          </Card>
        </section>

        {/* Support */}
        <section>
          <Card className="p-5 shadow-sm border-0">
            <h3 className="mb-2">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Notre équipe est là pour vous accompagner dans le processus de vérification.
            </p>
            <Button variant="outline" className="w-full border-[#41B6A6] text-[#41B6A6] hover:bg-[#41B6A6]/10">
              Contacter le support
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
