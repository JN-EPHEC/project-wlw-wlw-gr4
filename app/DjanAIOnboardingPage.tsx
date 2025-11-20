import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface DjanAIOnboardingPageProps {
  dogId?: number;
  onComplete: (profile: DogProfile) => void;
  onBack: () => void;
}

export interface DogProfile {
  dogId?: number;
  age: string;
  breed: string;
  size: string;
  energy: string;
  experience: string;
  goals: string[];
  behaviors: string[];
  environment: string;
  timeAvailable: string;
}

export function DjanAIOnboardingPage({ dogId, onComplete, onBack }: DjanAIOnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Form state
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState('');
  const [energy, setEnergy] = useState('');
  const [experience, setExperience] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [behaviors, setBehaviors] = useState<string[]>([]);
  const [environment, setEnvironment] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete({
        dogId,
        age,
        breed,
        size,
        energy,
        experience,
        goals,
        behaviors,
        environment,
        timeAvailable,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return age !== '';
      case 2: return breed !== '';
      case 3: return size !== '';
      case 4: return energy !== '';
      case 5: return experience !== '';
      case 6: return goals.length > 0;
      case 7: return behaviors.length > 0;
      case 8: return environment !== '' && timeAvailable !== '';
      default: return false;
    }
  };

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const toggleBehavior = (behavior: string) => {
    setBehaviors(prev => 
      prev.includes(behavior) 
        ? prev.filter(b => b !== behavior)
        : [...prev, behavior]
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
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
        <p className="text-white/80">Créons le profil de votre chien</p>
      </div>

      {/* Progress */}
      <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Étape {currentStep} sur {totalSteps}</span>
          <span className="text-sm text-[#41B6A6]">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        
        {/* Step 1: Age */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Quel âge a votre chien ?</h2>
              <p className="text-gray-600">L'âge influence les méthodes d'éducation recommandées.</p>
            </div>
            
            <RadioGroup value={age} onValueChange={setAge}>
              <div className="space-y-3">
                <Card className={`p-4 cursor-pointer transition-all ${age === 'puppy' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="puppy" id="puppy" />
                    <Label htmlFor="puppy" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🐕</div>
                        <div>
                          <h4 className="text-gray-800">Chiot (0-12 mois)</h4>
                          <p className="text-sm text-gray-600">Apprentissage des bases</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${age === 'young' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="young" id="young" />
                    <Label htmlFor="young" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🐶</div>
                        <div>
                          <h4 className="text-gray-800">Jeune (1-3 ans)</h4>
                          <p className="text-sm text-gray-600">Plein d'énergie, réactif</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${age === 'adult' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="adult" id="adult" />
                    <Label htmlFor="adult" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🦮</div>
                        <div>
                          <h4 className="text-gray-800">Adulte (3-7 ans)</h4>
                          <p className="text-sm text-gray-600">Maturité comportementale</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${age === 'senior' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🐕‍🦺</div>
                        <div>
                          <h4 className="text-gray-800">Senior (7+ ans)</h4>
                          <p className="text-sm text-gray-600">Besoin d'adaptations</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Breed */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Quelle est la race ?</h2>
              <p className="text-gray-600">Chaque race a des besoins spécifiques.</p>
            </div>
            
            <RadioGroup value={breed} onValueChange={setBreed}>
              <div className="space-y-3">
                <Card className={`p-4 cursor-pointer transition-all ${breed === 'working' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="working" id="working" />
                    <Label htmlFor="working" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Chien de travail</h4>
                      <p className="text-sm text-gray-600">Berger, Malinois, Border Collie...</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${breed === 'sporting' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="sporting" id="sporting" />
                    <Label htmlFor="sporting" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Chien sportif</h4>
                      <p className="text-sm text-gray-600">Retriever, Setter, Springer...</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${breed === 'toy' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="toy" id="toy" />
                    <Label htmlFor="toy" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Chien de compagnie</h4>
                      <p className="text-sm text-gray-600">Chihuahua, Bichon, Caniche...</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${breed === 'terrier' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="terrier" id="terrier" />
                    <Label htmlFor="terrier" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Terrier</h4>
                      <p className="text-sm text-gray-600">Jack Russell, Bull Terrier...</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${breed === 'guardian' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="guardian" id="guardian" />
                    <Label htmlFor="guardian" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Chien de garde</h4>
                      <p className="text-sm text-gray-600">Rottweiler, Doberman, Dogue...</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${breed === 'mixed' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Croisé / Race mixte</h4>
                      <p className="text-sm text-gray-600">Mélange de races</p>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Size */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Quelle est sa taille ?</h2>
              <p className="text-gray-600">La taille influence les méthodes physiques d'entraînement.</p>
            </div>
            
            <RadioGroup value={size} onValueChange={setSize}>
              <div className="space-y-3">
                <Card className={`p-4 cursor-pointer transition-all ${size === 'small' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Petit (&lt; 10 kg)</h4>
                      <p className="text-sm text-gray-600">Facile à manipuler</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${size === 'medium' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Moyen (10-25 kg)</h4>
                      <p className="text-sm text-gray-600">Taille standard</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${size === 'large' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Grand (25-45 kg)</h4>
                      <p className="text-sm text-gray-600">Nécessite de la force</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${size === 'giant' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="giant" id="giant" />
                    <Label htmlFor="giant" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Très grand (&gt; 45 kg)</h4>
                      <p className="text-sm text-gray-600">Contrôle important requis</p>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Energy */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Niveau d'énergie ?</h2>
              <p className="text-gray-600">Détermine l'intensité des exercices recommandés.</p>
            </div>
            
            <RadioGroup value={energy} onValueChange={setEnergy}>
              <div className="space-y-3">
                <Card className={`p-4 cursor-pointer transition-all ${energy === 'low' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Calme 😴</h4>
                      <p className="text-sm text-gray-600">Préfère le repos, peu actif</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${energy === 'moderate' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Modéré 🐕</h4>
                      <p className="text-sm text-gray-600">Équilibré, moments de jeu</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${energy === 'high' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Énergique ⚡</h4>
                      <p className="text-sm text-gray-600">Très actif, besoin d'exercice</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${energy === 'very-high' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="very-high" id="very-high" />
                    <Label htmlFor="very-high" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Hyperactif 🚀</h4>
                      <p className="text-sm text-gray-600">Débordant d'énergie constamment</p>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 5: Experience */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Votre expérience ?</h2>
              <p className="text-gray-600">Adapte les conseils à votre niveau.</p>
            </div>
            
            <RadioGroup value={experience} onValueChange={setExperience}>
              <div className="space-y-3">
                <Card className={`p-4 cursor-pointer transition-all ${experience === 'beginner' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Débutant</h4>
                      <p className="text-sm text-gray-600">Premier chien, peu d'expérience</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${experience === 'intermediate' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Intermédiaire</h4>
                      <p className="text-sm text-gray-600">Quelques chiens éduqués</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${experience === 'advanced' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Avancé</h4>
                      <p className="text-sm text-gray-600">Expérience significative</p>
                    </Label>
                  </div>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${experience === 'expert' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert" className="flex-1 cursor-pointer">
                      <h4 className="text-gray-800">Expert / Professionnel</h4>
                      <p className="text-sm text-gray-600">Éducateur ou très expérimenté</p>
                    </Label>
                  </div>
                </Card>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 6: Goals */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Vos objectifs ?</h2>
              <p className="text-gray-600">Sélectionnez un ou plusieurs objectifs.</p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'obedience', label: 'Obéissance de base', desc: 'Assis, couché, pas bouger...' },
                { id: 'socialization', label: 'Socialisation', desc: 'Avec humains et autres chiens' },
                { id: 'behavior', label: 'Problèmes comportementaux', desc: 'Aboiements, destruction...' },
                { id: 'agility', label: 'Agility / Sport', desc: 'Activités sportives' },
                { id: 'tricks', label: 'Tours et tricks', desc: 'Apprentissage de tours amusants' },
                { id: 'walking', label: 'Marche en laisse', desc: 'Ne pas tirer, suivre' },
                { id: 'recall', label: 'Rappel', desc: 'Revenir au pied' },
                { id: 'therapy', label: 'Chien de thérapie', desc: 'Calme et comportement adapté' },
              ].map((goal) => (
                <Card
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    goals.includes(goal.id)
                      ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm'
                      : 'border-0 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={goals.includes(goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="text-gray-800">{goal.label}</h4>
                      <p className="text-sm text-gray-600">{goal.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Behaviors */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">Comportements actuels ?</h2>
              <p className="text-gray-600">Sélectionnez les comportements observés.</p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'calm', label: 'Calme et posé', icon: '😌' },
                { id: 'excitable', label: 'Excitable / Hyperactif', icon: '🤪' },
                { id: 'anxious', label: 'Anxieux / Peureux', icon: '😰' },
                { id: 'aggressive', label: 'Tendances agressives', icon: '😠' },
                { id: 'destructive', label: 'Destructeur', icon: '🔨' },
                { id: 'barking', label: 'Aboie beaucoup', icon: '🔊' },
                { id: 'pulling', label: 'Tire en laisse', icon: '🦮' },
                { id: 'jumping', label: 'Saute sur les gens', icon: '🤾' },
                { id: 'digging', label: 'Creuse', icon: '⛏️' },
                { id: 'chewing', label: 'Mâchonne tout', icon: '🦴' },
              ].map((behavior) => (
                <Card
                  key={behavior.id}
                  onClick={() => toggleBehavior(behavior.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    behaviors.includes(behavior.id)
                      ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm'
                      : 'border-0 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={behaviors.includes(behavior.id)}
                    />
                    <span className="text-2xl">{behavior.icon}</span>
                    <h4 className="text-gray-800 flex-1">{behavior.label}</h4>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Environment & Time */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-gray-800 mb-2">Environnement</h2>
                <p className="text-gray-600">Où vit votre chien ?</p>
              </div>
              
              <RadioGroup value={environment} onValueChange={setEnvironment}>
                <div className="space-y-3">
                  <Card className={`p-4 cursor-pointer transition-all ${environment === 'apartment' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="apartment" id="apartment" />
                      <Label htmlFor="apartment" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Appartement 🏢</h4>
                        <p className="text-sm text-gray-600">Sans jardin</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${environment === 'house-small' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="house-small" id="house-small" />
                      <Label htmlFor="house-small" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Maison avec petit jardin 🏡</h4>
                        <p className="text-sm text-gray-600">Espace extérieur limité</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${environment === 'house-large' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="house-large" id="house-large" />
                      <Label htmlFor="house-large" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Maison avec grand jardin 🏘️</h4>
                        <p className="text-sm text-gray-600">Large espace extérieur</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${environment === 'rural' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="rural" id="rural" />
                      <Label htmlFor="rural" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Milieu rural / Ferme 🌾</h4>
                        <p className="text-sm text-gray-600">Grands espaces naturels</p>
                      </Label>
                    </div>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="text-gray-800 mb-2">Temps disponible</h2>
                <p className="text-gray-600">Combien de temps par jour pouvez-vous consacrer ?</p>
              </div>
              
              <RadioGroup value={timeAvailable} onValueChange={setTimeAvailable}>
                <div className="space-y-3">
                  <Card className={`p-4 cursor-pointer transition-all ${timeAvailable === 'minimal' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="minimal" id="minimal" />
                      <Label htmlFor="minimal" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Moins de 30 min/jour</h4>
                        <p className="text-sm text-gray-600">Très occupé</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${timeAvailable === 'moderate' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">30 min - 1h/jour</h4>
                        <p className="text-sm text-gray-600">Temps raisonnable</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${timeAvailable === 'good' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">1-2h/jour</h4>
                        <p className="text-sm text-gray-600">Bon temps disponible</p>
                      </Label>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${timeAvailable === 'extensive' ? 'border-2 border-[#41B6A6] bg-[#41B6A6]/5 shadow-sm' : 'border-0 shadow-sm hover:shadow-md'}`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="extensive" id="extensive" />
                      <Label htmlFor="extensive" className="flex-1 cursor-pointer">
                        <h4 className="text-gray-800">Plus de 2h/jour</h4>
                        <p className="text-sm text-gray-600">Très disponible</p>
                      </Label>
                    </div>
                  </Card>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full bg-[#41B6A6] hover:bg-[#359889] rounded-2xl h-14 disabled:opacity-50"
        >
          {currentStep === totalSteps ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Voir mes recommandations
            </>
          ) : (
            <>
              Continuer
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
