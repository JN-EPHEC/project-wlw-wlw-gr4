import { ArrowLeft, CheckCircle, Clock, Plus, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface DogTasksPageProps {
  dogId: number;
  onBack: () => void;
}

export function DogTasksPage({ onBack }: DogTasksPageProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  // Mock data
  const tasksData = {
    dogName: 'Max',
    dailyProgress: 3,
    dailyGoal: 5,
    weeklyProgress: 12,
    weeklyGoal: 20,
    currentStreak: 7,
    dailyTasks: [
      { id: 1, title: 'Marche en laisse 15 minutes', category: 'Obéissance', xp: 50, difficulty: 'Facile', icon: '🦮' },
      { id: 2, title: 'Assis/Couché 10 fois', category: 'Obéissance', xp: 30, difficulty: 'Facile', icon: '⭐' },
      { id: 3, title: 'Rappel au parc', category: 'Obéissance', xp: 75, difficulty: 'Moyen', icon: '📣' },
      { id: 4, title: 'Interaction avec 2 chiens', category: 'Socialisation', xp: 60, difficulty: 'Moyen', icon: '🐕' },
      { id: 5, title: 'Rester calme devant stimuli', category: 'Comportement', xp: 80, difficulty: 'Difficile', icon: '🧘' },
    ],
    weeklyTasks: [
      { id: 6, title: 'Session d\'agility complète', category: 'Agility', xp: 150, difficulty: 'Moyen', progress: 60, icon: '🏃' },
      { id: 7, title: 'Visite dans un lieu public', category: 'Socialisation', xp: 120, difficulty: 'Moyen', progress: 0, icon: '🏙️' },
      { id: 8, title: 'Apprendre un nouveau trick', category: 'Dressage', xp: 200, difficulty: 'Difficile', progress: 30, icon: '🎭' },
    ],
    djanAITasks: [
      { id: 9, title: 'Exercice personnalisé: Focus', category: 'IA DjanAI', xp: 100, difficulty: 'Moyen', description: 'Maintenir le contact visuel pendant 30 secondes en présence de distractions', icon: '🤖' },
      { id: 10, title: 'Challenge du jour', category: 'IA DjanAI', xp: 150, difficulty: 'Difficile', description: 'Parcours d\'obstacles improvisé dans votre jardin', icon: '🎯' },
    ],
    bonusTasks: [
      { id: 11, title: 'Brossage et toilettage', category: 'Bien-être', xp: 40, difficulty: 'Facile', icon: '✨' },
      { id: 12, title: 'Session de jeu libre', category: 'Bien-être', xp: 30, difficulty: 'Facile', icon: '🎾' },
    ],
  };

  const handleCompleteTask = (taskId: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const dailyPercentage = (tasksData.dailyProgress / tasksData.dailyGoal) * 100;
  const weeklyPercentage = (tasksData.weeklyProgress / tasksData.weeklyGoal) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-700';
      case 'Moyen': return 'bg-orange-100 text-orange-700';
      case 'Difficile': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-full transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white mb-2">Tâches de {tasksData.dogName}</h1>
            <p className="text-white/90 text-sm">Continue comme ça ! 🔥</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-1">
              <Zap className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-white text-sm">{tasksData.currentStreak} jours</p>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-[#41B6A6]" />
              <p className="text-sm text-gray-600">Quotidien</p>
            </div>
            <div className="text-2xl text-gray-800 mb-2">{tasksData.dailyProgress}/{tasksData.dailyGoal}</div>
            <Progress value={dailyPercentage} className="h-2" />
          </Card>
          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#41B6A6]" />
              <p className="text-sm text-gray-600">Hebdomadaire</p>
            </div>
            <div className="text-2xl text-gray-800 mb-2">{tasksData.weeklyProgress}/{tasksData.weeklyGoal}</div>
            <Progress value={weeklyPercentage} className="h-2" />
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Tâches quotidiennes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Tâches du jour</h2>
            </div>
            <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
              {tasksData.dailyProgress}/{tasksData.dailyGoal}
            </Badge>
          </div>
          <div className="space-y-3">
            {tasksData.dailyTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card
                  key={task.id}
                  className={`p-4 border-0 shadow-sm transition-all ${
                    isCompleted ? 'bg-green-50 border-l-4 border-l-green-500' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{task.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600">{task.category}</p>
                        </div>
                        <Badge className={`${getDifficultyColor(task.difficulty)} border-0 text-xs ml-2`}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#41B6A6]/10 text-[#41B6A6] border-0">
                          +{task.xp} XP
                        </Badge>
                        {!isCompleted ? (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            className="bg-[#41B6A6] hover:bg-[#359889] h-8"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complété
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Tâches hebdomadaires */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#41B6A6]" />
              <h2 className="text-gray-800">Défis de la semaine</h2>
            </div>
          </div>
          <div className="space-y-3">
            {tasksData.weeklyTasks.map((task) => (
              <Card key={task.id} className="p-4 border-0 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{task.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.category}</p>
                      </div>
                      <Badge className={`${getDifficultyColor(task.difficulty)} border-0 text-xs ml-2`}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progression</span>
                        <span className="text-xs text-gray-800">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-0">
                      +{task.xp} XP
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Tâches DjanAI */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#9333EA]" />
              <h2 className="text-gray-800">Recommandé par DjanAI</h2>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              IA
            </Badge>
          </div>
          <div className="space-y-3">
            {tasksData.djanAITasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card
                  key={task.id}
                  className={`p-4 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 ${
                    isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{task.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-700 mt-1">{task.description}</p>
                        </div>
                        <Badge className={`${getDifficultyColor(task.difficulty)} border-0 text-xs ml-2`}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className="bg-purple-600 text-white border-0">
                          +{task.xp} XP
                        </Badge>
                        {!isCompleted ? (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-8"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complété
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <Separator />

        {/* Tâches bonus */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Plus className="h-5 w-5 text-[#E9B782]" />
            <h2 className="text-gray-800">Tâches bonus</h2>
          </div>
          <div className="space-y-3">
            {tasksData.bonusTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card key={task.id} className={`p-4 border-0 shadow-sm ${isCompleted ? 'bg-green-50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{task.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600">{task.category}</p>
                        </div>
                        <Badge className={`${getDifficultyColor(task.difficulty)} border-0 text-xs ml-2`}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-[#E9B782]/20 text-[#E9B782] border-0">
                          +{task.xp} XP
                        </Badge>
                        {!isCompleted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteTask(task.id)}
                            className="h-8 border-[#E9B782] text-[#E9B782] hover:bg-[#E9B782] hover:text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complété
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Info message */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <h4 className="text-gray-800 mb-1">Astuce</h4>
              <p className="text-sm text-gray-700">
                Valide au moins 5 tâches par jour pour maintenir ta série et débloquer des bonus XP !
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
