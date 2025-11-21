import { AlertCircle, ArrowLeft, Award, BookOpen, Calendar, CheckCircle2, Clock, Heart, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { DogProfile } from './DjanAIOnboardingPage';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DjanAIResultsPageProps {
  profile: DogProfile;
  onBack: () => void;
  onRestart: () => void;
}

export function DjanAIResultsPage({ profile, onBack, onRestart }: DjanAIResultsPageProps) {
  const [selectedTab, setSelectedTab] = useState('program');

  // Generate personalized recommendations based on profile
  const getRecommendations = () => {
    const recommendations = {
      program: [] as any[],
      exercises: [] as any[],
      tips: [] as any[],
      warnings: [] as any[],
    };

    // Training program based on age
    if (profile.age === 'puppy') {
      recommendations.program.push({
        title: 'Programme Chiot (0-12 mois)',
        description: 'Focus sur la socialisation et les bases',
        phases: [
          { week: '1-4', focus: 'Socialisation, habituation aux stimuli' },
          { week: '5-8', focus: 'Commandes de base : assis, couché' },
          { week: '9-12', focus: 'Marche en laisse, rappel simple' },
        ],
      });
    } else if (profile.age === 'young') {
      recommendations.program.push({
        title: 'Programme Jeune Adulte (1-3 ans)',
        description: 'Renforcement et canalisation de l\'énergie',
        phases: [
          { week: '1-4', focus: 'Révision des bases, autocontrôle' },
          { week: '5-8', focus: 'Commandes avancées, distractions' },
          { week: '9-12', focus: 'Sports canins, challenges mentaux' },
        ],
      });
    }

    // Exercises based on energy level
    if (profile.energy === 'high' || profile.energy === 'very-high') {
      recommendations.exercises.push({
        title: 'Exercices pour chien énergique',
        items: [
          { name: 'Course/vélo', duration: '30-45 min', frequency: 'Quotidien' },
          { name: 'Agility/Parcours', duration: '20-30 min', frequency: '3-4x/semaine' },
          { name: 'Jeux de balle intense', duration: '15-20 min', frequency: 'Quotidien' },
          { name: 'Nage (si possible)', duration: '20-30 min', frequency: '2-3x/semaine' },
        ],
      });
    } else {
      recommendations.exercises.push({
        title: 'Exercices adaptés',
        items: [
          { name: 'Promenade tranquille', duration: '20-30 min', frequency: 'Quotidien' },
          { name: 'Jeux calmes', duration: '10-15 min', frequency: 'Quotidien' },
          { name: 'Exercices mentaux', duration: '10-15 min', frequency: '3-4x/semaine' },
        ],
      });
    }

    // Tips based on goals
    if (profile.goals.includes('obedience')) {
      recommendations.tips.push({
        category: 'Obéissance',
        tips: [
          'Séances courtes (5-10 min) mais fréquentes',
          'Toujours finir sur un succès',
          'Récompenser immédiatement les bons comportements',
          'Être cohérent dans les commandes',
        ],
      });
    }

    if (profile.goals.includes('socialization')) {
      recommendations.tips.push({
        category: 'Socialisation',
        tips: [
          'Exposer progressivement à différents environnements',
          'Rencontres contrôlées avec autres chiens',
          'Récompenser les interactions calmes',
          'Ne jamais forcer le contact',
        ],
      });
    }

    // Warnings based on behaviors
    if (profile.behaviors.includes('aggressive') || profile.behaviors.includes('anxious')) {
      recommendations.warnings.push({
        severity: 'high',
        message: 'Comportements nécessitant une attention professionnelle',
        details: 'Ces comportements peuvent nécessiter l\'intervention d\'un éducateur comportementaliste certifié.',
        action: 'Consulter un professionnel rapidement',
      });
    }

    if (profile.timeAvailable === 'minimal') {
      recommendations.warnings.push({
        severity: 'medium',
        message: 'Temps limité disponible',
        details: 'Votre chien peut avoir besoin de plus de temps que ce que vous pouvez offrir actuellement.',
        action: 'Envisager des solutions complémentaires (dog walker, garderie)',
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="flex flex-col h-full bg-white pb-20">
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-white">DjanAI</h1>
        </div>
        <p className="text-white/80">Votre programme personnalisé</p>
      </div>

      {/* Profile Summary */}
      <div className="px-4 py-4 bg-gradient-to-br from-[#41B6A6]/5 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-800">Profil créé</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            className="text-[#41B6A6] hover:text-[#359889]"
          >
            Modifier
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-white border-[#41B6A6] text-[#41B6A6]">
            {profile.age === 'puppy' && '🐕 Chiot'}
            {profile.age === 'young' && '🐶 Jeune'}
            {profile.age === 'adult' && '🦮 Adulte'}
            {profile.age === 'senior' && '🐕‍🦺 Senior'}
          </Badge>
          <Badge className="bg-white border-[#41B6A6] text-[#41B6A6]">
            {profile.energy === 'low' && '😴 Calme'}
            {profile.energy === 'moderate' && '🐕 Modéré'}
            {profile.energy === 'high' && '⚡ Énergique'}
            {profile.energy === 'very-high' && '🚀 Hyperactif'}
          </Badge>
          <Badge className="bg-white border-[#41B6A6] text-[#41B6A6]">
            {profile.goals.length} objectif{profile.goals.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Warnings Section */}
      {recommendations.warnings.length > 0 && (
        <div className="px-4 py-4 bg-orange-50 border-b border-orange-100">
          {recommendations.warnings.map((warning, index) => (
            <Card key={index} className={`p-4 border-0 ${warning.severity === 'high' ? 'bg-red-50' : 'bg-orange-50'}`}>
              <div className="flex gap-3">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${warning.severity === 'high' ? 'text-red-600' : 'text-orange-600'}`} />
                <div>
                  <h4 className={`mb-1 ${warning.severity === 'high' ? 'text-red-900' : 'text-orange-900'}`}>
                    {warning.message}
                  </h4>
                  <p className={`text-sm mb-2 ${warning.severity === 'high' ? 'text-red-700' : 'text-orange-700'}`}>
                    {warning.details}
                  </p>
                  <Badge className={`${warning.severity === 'high' ? 'bg-red-600' : 'bg-orange-600'} text-white border-0`}>
                    {warning.action}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-white px-4">
          <TabsTrigger value="program" className="data-[state=active]:border-b-2 data-[state=active]:border-[#41B6A6]">
            <Calendar className="h-4 w-4 mr-2" />
            Programme
          </TabsTrigger>
          <TabsTrigger value="exercises" className="data-[state=active]:border-b-2 data-[state=active]:border-[#41B6A6]">
            <Zap className="h-4 w-4 mr-2" />
            Exercices
          </TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:border-b-2 data-[state=active]:border-[#41B6A6]">
            <BookOpen className="h-4 w-4 mr-2" />
            Conseils
          </TabsTrigger>
        </TabsList>

        {/* Program Tab */}
        <TabsContent value="program" className="flex-1 overflow-y-auto px-4 py-6 pb-8 space-y-6">
          {recommendations.program.map((program, index) => (
            <Card key={index} className="p-6 border-0 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#41B6A6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-[#41B6A6]" />
                </div>
                <div>
                  <h3 className="text-gray-800 mb-1">{program.title}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                {program.phases.map((phase: any, phaseIndex: number) => (
                  <div key={phaseIndex} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-[#41B6A6] text-white rounded-full flex items-center justify-center text-sm">
                        {phaseIndex + 1}
                      </div>
                      {phaseIndex < program.phases.length - 1 && (
                        <div className="w-0.5 h-full bg-[#41B6A6]/30 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0 mb-2">
                        Semaine {phase.week}
                      </Badge>
                      <p className="text-gray-700">{phase.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gray-800 mb-2">Suivi des progrès</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Notez chaque semaine les progrès de votre chien pour ajuster le programme si nécessaire.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full">
                  Activer le suivi (bientôt)
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises" className="flex-1 overflow-y-auto px-4 py-6 pb-8 space-y-6">
          {recommendations.exercises.map((exerciseGroup, index) => (
            <Card key={index} className="p-6 border-0 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#41B6A6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-[#41B6A6]" />
                </div>
                <div>
                  <h3 className="text-gray-800">{exerciseGroup.title}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {exerciseGroup.items.map((item: any, itemIndex: number) => (
                  <Card key={itemIndex} className="p-4 border-0 shadow-sm bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-2">{item.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </Badge>
                          <Badge className="bg-[#E9B782]/10 text-[#E9B782] border-0">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.frequency}
                          </Badge>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-gray-300" />
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gray-800 mb-2">Stimulation mentale</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Les exercices mentaux sont aussi importants que l'exercice physique. Jeux de flair, puzzles alimentaires, etc.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Cacher des friandises dans la maison</li>
                  <li>Utiliser des jouets d'occupation (Kong, tapis de fouille)</li>
                  <li>Apprendre de nouveaux tours régulièrement</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="flex-1 overflow-y-auto px-4 py-6 pb-8 space-y-6">
          {recommendations.tips.map((tipGroup, index) => (
            <Card key={index} className="p-6 border-0 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#41B6A6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-[#41B6A6]" />
                </div>
                <div>
                  <h3 className="text-gray-800">{tipGroup.category}</h3>
                </div>
              </div>

              <div className="space-y-3">
                {tipGroup.tips.map((tip: string, tipIndex: number) => (
                  <div key={tipIndex} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#41B6A6] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gray-800 mb-2">Principes généraux</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>La patience et la cohérence sont essentielles</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Toujours utiliser le renforcement positif</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Ne jamais punir physiquement ou crier</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Adapter les méthodes à la personnalité du chien</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Consulter un professionnel en cas de doute</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
