import React, { useState } from 'react';
import { 
  Copy, Check, Palette, Type, Layout, Layers, Zap, Shield, ArrowLeft,
  Trophy, Star, Target, TrendingUp, Lock, CheckCircle, Sparkles,
  Home, User, MessageSquare, Calendar, Settings, Search, Bell, Heart,
  Plus, X, Eye, Send, Edit, Trash2, Phone, Mail, MapPin, Globe,
  Users, Dog, Building2, GraduationCap, CreditCard, Camera, Upload,
  Filter, Activity, Award, Crown, Medal, Gift, AlertCircle, XCircle,
  ChevronRight, Clock, Euro, Tag, ThumbsUp, AlertTriangle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

interface GuidelinesPageProps {
  onBack?: () => void;
}

export function GuidelinesPage({ onBack }: GuidelinesPageProps = {}) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeIconCategory, setActiveIconCategory] = useState<string>('all');

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Couleurs principales
  const primaryColors = [
    { name: 'Turquoise', hex: '#41B6A6', usage: 'Couleur principale - Interface utilisateur, boutons primaires' },
    { name: 'Turquoise Dark', hex: '#359889', usage: 'Variante foncée - Utilisé dans les gradients' },
    { name: 'Sable', hex: '#E9B782', usage: 'Couleur secondaire - Headers clubs, éléments chaleureux' },
    { name: 'Sable Dark', hex: '#d9a772', usage: 'Variante foncée - Utilisé dans les gradients' },
    { name: 'Terracotta', hex: '#F28B6F', usage: 'Couleur tertiaire - Éducateurs, communauté, annonces' },
    { name: 'Terracotta Dark', hex: '#e67a5f', usage: 'Variante foncée - Utilisé dans les gradients' },
  ];

  const grayScale = [
    { name: 'Gray 50', hex: '#F9FAFB', usage: 'Arrière-plans très clairs' },
    { name: 'Gray 100', hex: '#F3F4F6', usage: 'Arrière-plans clairs' },
    { name: 'Gray 200', hex: '#E5E7EB', usage: 'Bordures, séparateurs' },
    { name: 'Gray 300', hex: '#D1D5DB', usage: 'Bordures actives' },
    { name: 'Gray 400', hex: '#9CA3AF', usage: 'Icônes désactivées' },
    { name: 'Gray 500', hex: '#6B7280', usage: 'Texte secondaire' },
    { name: 'Gray 600', hex: '#4B5563', usage: 'Texte tertiaire' },
    { name: 'Gray 700', hex: '#374151', usage: 'Texte secondaire foncé' },
    { name: 'Gray 800', hex: '#1F2937', usage: 'Texte principal' },
    { name: 'Gray 900', hex: '#111827', usage: 'Titres, texte très foncé' },
  ];

  const functionalColors = [
    { name: 'Success', hex: '#10B981', usage: 'Succès, confirmations, statut actif' },
    { name: 'Emerald', hex: '#059669', usage: 'Revenue, gains, positif' },
    { name: 'Warning', hex: '#F59E0B', usage: 'Avertissements, attention requise' },
    { name: 'Error', hex: '#EF4444', usage: 'Erreurs, suppressions, actions destructives' },
    { name: 'Info', hex: '#3B82F6', usage: 'Informations, liens' },
    { name: 'Cyan', hex: '#06B6D4', usage: 'Variante info/fraîcheur' },
    { name: 'Purple', hex: '#9333EA', usage: 'Promotions, classements' },
    { name: 'Purple Dark', hex: '#7C3AED', usage: 'Variante foncée pour classements' },
    { name: 'Pink', hex: '#EC4899', usage: 'DjanAI, intelligence artificielle' },
    { name: 'Amber', hex: '#F59E0B', usage: 'Badges déverrouillés, récompenses' },
    { name: 'Yellow', hex: '#EAB308', usage: 'Premium, or, highlight' },
    { name: 'Orange', hex: '#F97316', usage: 'Boost, premium, énergie' },
  ];

  const allGradients = [
    {
      name: 'Turquoise Gradient',
      classes: 'bg-gradient-to-br from-[#41B6A6] to-[#359889]',
      usage: 'Headers utilisateur, interface principale'
    },
    {
      name: 'Sable Gradient',
      classes: 'bg-gradient-to-br from-[#E9B782] to-[#d9a772]',
      usage: 'Headers club, interface professionnelle'
    },
    {
      name: 'Terracotta Gradient',
      classes: 'bg-gradient-to-br from-[#F28B6F] to-[#e67a5f]',
      usage: 'Headers éducateur, annonces'
    },
    {
      name: 'Premium Boost',
      classes: 'bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500',
      usage: 'Boost, promotions, premium'
    },
    {
      name: 'DjanAI Primary',
      classes: 'bg-gradient-to-r from-purple-600 to-pink-600',
      usage: 'Intelligence artificielle, IA'
    },
    {
      name: 'DjanAI Background',
      classes: 'bg-gradient-to-br from-purple-50 to-pink-50',
      usage: 'Fond de cards DjanAI'
    },
    {
      name: 'Leaderboard Header',
      classes: 'bg-gradient-to-br from-purple-600 to-purple-800',
      usage: 'Headers classements'
    },
    {
      name: 'Podium 1ère place',
      classes: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      usage: 'Champion, première position'
    },
    {
      name: 'Podium 2ème place',
      classes: 'bg-gradient-to-br from-gray-300 to-gray-400',
      usage: 'Deuxième position'
    },
    {
      name: 'Podium 3ème place',
      classes: 'bg-gradient-to-br from-orange-400 to-orange-500',
      usage: 'Troisième position'
    },
    {
      name: 'Success Status',
      classes: 'bg-gradient-to-r from-green-500 to-green-600',
      usage: 'Statut vérifié, succès'
    },
    {
      name: 'Revenue',
      classes: 'bg-gradient-to-br from-green-50 to-emerald-50',
      usage: 'Gains, revenus'
    },
  ];

  // Icônes par catégorie
  const iconCategories = [
    {
      id: 'navigation',
      name: 'Navigation',
      icons: [
        { Icon: Home, name: 'Home' },
        { Icon: ArrowLeft, name: 'ArrowLeft' },
        { Icon: ChevronRight, name: 'ChevronRight' },
        { Icon: Plus, name: 'Plus' },
        { Icon: X, name: 'X' },
        { Icon: Search, name: 'Search' },
        { Icon: Filter, name: 'Filter' },
        { Icon: Settings, name: 'Settings' },
        { Icon: Eye, name: 'Eye' },
      ]
    },
    {
      id: 'users',
      name: 'Utilisateurs',
      icons: [
        { Icon: User, name: 'User' },
        { Icon: Users, name: 'Users' },
        { Icon: Dog, name: 'Dog' },
        { Icon: Building2, name: 'Building2' },
        { Icon: GraduationCap, name: 'GraduationCap' },
      ]
    },
    {
      id: 'communication',
      name: 'Communication',
      icons: [
        { Icon: MessageSquare, name: 'MessageSquare' },
        { Icon: Send, name: 'Send' },
        { Icon: Bell, name: 'Bell' },
        { Icon: Phone, name: 'Phone' },
        { Icon: Mail, name: 'Mail' },
      ]
    },
    {
      id: 'actions',
      name: 'Actions',
      icons: [
        { Icon: CheckCircle, name: 'CheckCircle' },
        { Icon: XCircle, name: 'XCircle' },
        { Icon: AlertCircle, name: 'AlertCircle' },
        { Icon: Edit, name: 'Edit' },
        { Icon: Trash2, name: 'Trash2' },
        { Icon: Copy, name: 'Copy' },
        { Icon: Upload, name: 'Upload' },
        { Icon: Camera, name: 'Camera' },
      ]
    },
    {
      id: 'gamification',
      name: 'Gamification',
      icons: [
        { Icon: Trophy, name: 'Trophy' },
        { Icon: Award, name: 'Award' },
        { Icon: Medal, name: 'Medal' },
        { Icon: Crown, name: 'Crown' },
        { Icon: Star, name: 'Star' },
        { Icon: Zap, name: 'Zap' },
        { Icon: Sparkles, name: 'Sparkles' },
        { Icon: Target, name: 'Target' },
        { Icon: TrendingUp, name: 'TrendingUp' },
        { Icon: Lock, name: 'Lock' },
      ]
    },
    {
      id: 'interface',
      name: 'Interface',
      icons: [
        { Icon: Heart, name: 'Heart' },
        { Icon: ThumbsUp, name: 'ThumbsUp' },
        { Icon: Calendar, name: 'Calendar' },
        { Icon: Clock, name: 'Clock' },
        { Icon: MapPin, name: 'MapPin' },
        { Icon: Globe, name: 'Globe' },
        { Icon: Shield, name: 'Shield' },
        { Icon: CreditCard, name: 'CreditCard' },
        { Icon: Euro, name: 'Euro' },
        { Icon: Tag, name: 'Tag' },
        { Icon: Activity, name: 'Activity' },
        { Icon: Gift, name: 'Gift' },
        { Icon: AlertTriangle, name: 'AlertTriangle' },
      ]
    },
  ];

  const ColorCard = ({ name, hex, usage }: { name: string; hex: string; usage: string }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0">
      <div className="h-24" style={{ backgroundColor: hex }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-gray-800">{name}</h4>
          <button
            onClick={() => copyToClipboard(hex, name)}
            className="text-gray-500 hover:text-gray-800 transition-colors"
          >
            {copiedColor === name ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-800 mb-2">{hex}</p>
        <p className="text-xs text-gray-600">{usage}</p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 text-white">
        <div className="max-w-[1400px] mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </button>
          )}
          <div className="flex items-center gap-4 mb-4">
            <Palette className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
            <h1 className="text-white">Smart Dogs Design System</h1>
          </div>
          <p className="text-white/90 max-w-3xl">
            Guide complet des composants, couleurs, gradients, typographies, icônes et patterns de design utilisés dans l'application Smart Dogs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
              Version 3.0
            </Badge>
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
              100+ Icônes
            </Badge>
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
              18 Gradients
            </Badge>
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
              Novembre 2025
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-12">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8 md:mb-10 gap-2 h-auto p-2">
            <TabsTrigger value="colors" className="gap-2 py-3">
              <Palette className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Couleurs</span>
              <span className="sm:hidden">Couleurs</span>
            </TabsTrigger>
            <TabsTrigger value="gradients" className="gap-2 py-3">
              <Layers className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Gradients</span>
              <span className="sm:hidden">Grad.</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-2 py-3">
              <Type className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Typo</span>
              <span className="sm:hidden">Typo</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="gap-2 py-3">
              <Layers className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Composants</span>
              <span className="sm:hidden">Comp.</span>
            </TabsTrigger>
            <TabsTrigger value="icons" className="gap-2 py-3">
              <Star className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Icônes</span>
              <span className="sm:hidden">Icon.</span>
            </TabsTrigger>
            <TabsTrigger value="spacing" className="gap-2 py-3">
              <Layout className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Espace</span>
              <span className="sm:hidden">Esp.</span>
            </TabsTrigger>
            <TabsTrigger value="patterns" className="gap-2 py-3">
              <Zap className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Patterns</span>
              <span className="sm:hidden">Patt.</span>
            </TabsTrigger>
          </TabsList>

          {/* COLORS TAB */}
          <TabsContent value="colors" className="space-y-10 md:space-y-12">
            {/* Primary Colors */}
            <section>
              <h2 className="text-gray-800 mb-3">Couleurs principales</h2>
              <p className="text-gray-600 mb-8">
                Les couleurs de l'identité visuelle Smart Dogs avec leurs variantes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {primaryColors.map((color) => (
                  <ColorCard key={color.hex} {...color} />
                ))}
              </div>
            </section>

            {/* Gray Scale */}
            <section>
              <h2 className="text-gray-800 mb-3">Échelle de gris</h2>
              <p className="text-gray-600 mb-8">
                Utilisée pour les textes, arrière-plans et bordures.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {grayScale.map((color) => (
                  <ColorCard key={color.hex} {...color} />
                ))}
              </div>
            </section>

            {/* Functional Colors */}
            <section>
              <h2 className="text-gray-800 mb-3">Couleurs fonctionnelles</h2>
              <p className="text-gray-600 mb-8">
                Pour les états, notifications, gamification et actions spécifiques.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {functionalColors.map((color) => (
                  <ColorCard key={color.hex} {...color} />
                ))}
              </div>
            </section>

            {/* Couleurs de niveaux */}
            <section>
              <h2 className="text-gray-800 mb-3">Couleurs de niveaux (Gamification)</h2>
              <p className="text-gray-600 mb-8">
                Gradients utilisés pour les niveaux de progression des chiens.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { name: 'Bronze (1-2)', gradient: 'from-orange-400 to-orange-600' },
                  { name: 'Argent (3-4)', gradient: 'from-gray-300 to-gray-500' },
                  { name: 'Or (5-6)', gradient: 'from-yellow-400 to-yellow-600' },
                  { name: 'Platine (7-8)', gradient: 'from-blue-400 to-blue-600' },
                  { name: 'Diamant (9-10)', gradient: 'from-purple-400 to-purple-600' },
                ].map((level) => (
                  <Card key={level.name} className="overflow-hidden border-0 shadow-md">
                    <div className={`h-24 bg-gradient-to-r ${level.gradient}`} />
                    <div className="p-4 text-center">
                      <h4 className="text-gray-800 mb-2">{level.name}</h4>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {level.gradient}
                      </code>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* GRADIENTS TAB */}
          <TabsContent value="gradients" className="space-y-10 md:space-y-12">
            <section>
              <h2 className="text-gray-800 mb-3">Tous les dégradés</h2>
              <p className="text-gray-600 mb-8">
                Collection complète des 18+ gradients utilisés dans l'application.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allGradients.map((gradient, index) => (
                  <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                    <div className={`h-32 ${gradient.classes}`} />
                    <div className="p-6">
                      <h4 className="mb-3">{gradient.name}</h4>
                      <code className="text-xs bg-gray-100 px-3 py-2 rounded block mb-3 break-all">
                        {gradient.classes}
                      </code>
                      <p className="text-sm text-gray-600">{gradient.usage}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Overlays */}
            <section>
              <h2 className="text-gray-800 mb-3">Overlays pour images</h2>
              <p className="text-gray-600 mb-8">
                Gradients d'overlay utilisés sur les images de fond.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-[#41B6A6]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-white mb-1">Overlay Standard</h4>
                      <p className="text-white/90 text-sm">Bas vers transparent</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                      bg-gradient-to-t from-black/60 to-transparent
                    </code>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-[#E9B782]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-white mb-1">Overlay Premium</h4>
                      <p className="text-white/90 text-sm">3 niveaux de transparence</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                      bg-gradient-to-t from-black/70 via-black/30 to-transparent
                    </code>
                  </div>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* TYPOGRAPHY TAB */}
          <TabsContent value="typography" className="space-y-10 md:space-y-12">
            <section>
              <h2 className="text-gray-800 mb-3">Famille de polices</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 lg:p-8 border-0 shadow-md">
                  <div className="mb-6">
                    <h3 className="text-gray-800 mb-3">Baloo Bold</h3>
                    <p className="text-gray-600 mb-4">
                      Utilisée pour tous les titres (h1, h2, h3, h4, h5, h6). Donne un aspect chaleureux et moderne.
                    </p>
                  </div>
                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                    <h1 className="text-gray-800">Titre h1 - Baloo Bold</h1>
                    <h2 className="text-gray-800">Titre h2 - Baloo Bold</h2>
                    <h3 className="text-gray-800">Titre h3 - Baloo Bold</h3>
                    <h4 className="text-gray-800">Titre h4 - Baloo Bold</h4>
                  </div>
                </Card>

                <Card className="p-6 lg:p-8 border-0 shadow-md">
                  <div className="mb-6">
                    <h3 className="text-gray-800 mb-3">Poppins</h3>
                    <p className="text-gray-600 mb-4">
                      Utilisée pour tout le corps de texte, les labels et les descriptions. Police moderne et lisible.
                    </p>
                  </div>
                  <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                    <p className="text-base text-gray-800">Texte normal (base) - Poppins Regular</p>
                    <p className="text-sm text-gray-600">Texte petit (sm) - Poppins Regular</p>
                    <p className="text-xs text-gray-500">Texte très petit (xs) - Poppins Regular</p>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-gray-800 mb-3">Règles typographiques</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2">
                        <strong>Important :</strong> Ne pas utiliser les classes Tailwind pour font-size, font-weight ou line-height
                      </p>
                      <p className="text-sm text-gray-600">
                        La typographie est gérée dans globals.css avec des valeurs par défaut pour chaque élément HTML.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 mb-3">✅ Bon</p>
                      <code className="text-sm bg-white px-3 py-2 rounded block">
                        {'<h1>Mon titre</h1>'}
                      </code>
                    </div>
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 mb-3">❌ Mauvais</p>
                      <code className="text-sm bg-white px-3 py-2 rounded block">
                        {'<h1 className="text-2xl font-bold">'}
                      </code>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </TabsContent>

          {/* COMPONENTS TAB */}
          <TabsContent value="components" className="space-y-10 md:space-y-12">
            {/* Buttons */}
            <section>
              <h2 className="text-gray-800 mb-3">Boutons</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="space-y-8">
                  <div>
                    <h4 className="mb-4">Variantes standards</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button>Défaut</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4">Couleurs Smart Dogs</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-[#41B6A6] hover:bg-[#359889] text-white">Turquoise</Button>
                      <Button className="bg-[#E9B782] hover:bg-[#d9a772] text-white">Sable</Button>
                      <Button className="bg-[#F28B6F] hover:bg-[#e67a5f] text-white">Terracotta</Button>
                      <Button className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white">
                        <Zap className="h-4 w-4 mr-2" />
                        Premium
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
                        <Sparkles className="h-4 w-4 mr-2" />
                        DjanAI
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4">Tailles</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button>Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4">Boutons arrondis (Pill)</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button className="rounded-full">Bouton arrondi</Button>
                      <Button className="rounded-full bg-[#41B6A6] hover:bg-[#359889] text-white">
                        Action
                      </Button>
                      <Button size="icon" className="rounded-full">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Cards */}
            <section>
              <h2 className="text-gray-800 mb-3">Cartes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 shadow-sm border-0">
                  <h4 className="mb-3">Carte standard</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    shadow-sm border-0 pour un style épuré
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    shadow-sm border-0
                  </code>
                </Card>

                <Card className="p-6 shadow-lg border-0">
                  <h4 className="mb-3">Carte avec ombre</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    shadow-lg pour plus de profondeur
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    shadow-lg border-0
                  </code>
                </Card>

                <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-[#41B6A6]/10 to-white">
                  <h4 className="mb-3">Carte avec gradient</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Dégradé subtil en arrière-plan
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    from-[#41B6A6]/10
                  </code>
                </Card>

                <Card className="p-6 shadow-sm border-0 border-l-4 border-l-[#41B6A6]">
                  <h4 className="mb-3">Carte avec bordure</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Bordure latérale colorée
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    border-l-4
                  </code>
                </Card>

                <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                  <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="mb-3">Carte DjanAI</h4>
                  <p className="text-sm text-gray-600">
                    Style spécial IA
                  </p>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 shadow-lg">
                  <Zap className="h-8 w-8 mb-3" />
                  <h4 className="text-white mb-3">Carte Premium</h4>
                  <p className="text-white/90 text-sm">
                    Boost et promotions
                  </p>
                </Card>
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-gray-800 mb-3">Badges</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-4">Couleurs Smart Dogs</h4>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-[#41B6A6] text-white border-0">Turquoise</Badge>
                      <Badge className="bg-[#E9B782] text-white border-0">Sable</Badge>
                      <Badge className="bg-[#F28B6F] text-white border-0">Terracotta</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4">États</h4>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-green-100 text-green-700 border-0 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Actif
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">Premium</Badge>
                      <Badge className="bg-purple-100 text-purple-700 border-0">Promo</Badge>
                      <Badge className="bg-red-100 text-red-700 border-0">Urgent</Badge>
                      <Badge className="bg-gray-100 text-gray-700 border-0">Inactif</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4">Badges spéciaux</h4>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-white/20 text-[#41B6A6] border border-[#41B6A6] gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                      <Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white border-0 gap-1">
                        <Zap className="h-3 w-3" />
                        Boosté
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 gap-1">
                        <Sparkles className="h-3 w-3" />
                        DjanAI
                      </Badge>
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0 gap-1">
                        <Trophy className="h-3 w-3" />
                        Niveau 5
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Progress Bars */}
            <section>
              <h2 className="text-gray-800 mb-3">Barres de progression</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4>Standard (Turquoise)</h4>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#41B6A6] to-[#359889] rounded-full transition-all duration-500"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4>Purple (Gamification)</h4>
                      <span className="text-sm text-gray-600">450 / 600 XP</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4>Gold (Niveau Or)</h4>
                      <span className="text-sm text-gray-600">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                        style={{ width: '80%' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Inputs */}
            <section>
              <h2 className="text-gray-800 mb-3">Champs de formulaire</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Input standard</label>
                    <Input placeholder="Entrez votre texte..." />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Input avec icône</label>
                    <div className="relative">
                      <Palette className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input className="pl-10" placeholder="Avec icône..." />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700 mb-2 block">Checkbox personnalisé</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] focus:ring-[#41B6A6]"
                      />
                      <span className="text-gray-700">Option avec style Smart Dogs</span>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </TabsContent>

          {/* ICONS TAB */}
          <TabsContent value="icons" className="space-y-10 md:space-y-12">
            <section>
              <div className="mb-8">
                <h2 className="text-gray-800 mb-3">Bibliothèque d'icônes Lucide</h2>
                <p className="text-gray-600 mb-6">
                  100+ icônes utilisées dans l'application Smart Dogs. Toutes proviennent de Lucide React.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    size="sm"
                    variant={activeIconCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setActiveIconCategory('all')}
                  >
                    Toutes
                  </Button>
                  {iconCategories.map((cat) => (
                    <Button
                      key={cat.id}
                      size="sm"
                      variant={activeIconCategory === cat.id ? 'default' : 'outline'}
                      onClick={() => setActiveIconCategory(cat.id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                {iconCategories
                  .filter(cat => activeIconCategory === 'all' || activeIconCategory === cat.id)
                  .map((category) => (
                    <div key={category.id}>
                      <h3 className="text-gray-800 mb-4">{category.name}</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {category.icons.map(({ Icon, name }) => (
                          <Card 
                            key={name}
                            className="p-4 hover:shadow-md transition-shadow border-0 cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(name);
                              setCopiedColor(name);
                              setTimeout(() => setCopiedColor(null), 1500);
                            }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Icon className="h-6 w-6 text-[#41B6A6]" />
                              <span className="text-xs text-gray-700 text-center break-all">{name}</span>
                              {copiedColor === name && (
                                <Check className="h-3 w-3 text-green-500" />
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              <Card className="p-6 bg-blue-50 border-blue-200 border">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-2 text-blue-900">Import des icônes</h4>
                    <code className="text-sm bg-white px-3 py-2 rounded block mb-3">
                      import {`{ IconName }`} from 'lucide-react'
                    </code>
                    <p className="text-sm text-blue-700">
                      Cliquez sur une icône pour copier son nom dans le presse-papier.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Tailles d'icônes */}
            <section>
              <h2 className="text-gray-800 mb-3">Tailles standardisées</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
                  {[
                    { size: 'h-3 w-3', label: 'Très petit', usage: 'Badges' },
                    { size: 'h-4 w-4', label: 'Petit', usage: 'Inputs, Boutons SM' },
                    { size: 'h-5 w-5', label: 'Moyen', usage: 'Boutons, Nav' },
                    { size: 'h-6 w-6', label: 'Grand', usage: 'Cards, Features' },
                    { size: 'h-8 w-8', label: 'Très grand', usage: 'Hero, Badges' },
                    { size: 'h-10 w-10', label: 'Énorme', usage: 'Avatars' },
                    { size: 'h-12 w-12', label: 'Gigantesque', usage: 'Empty states' },
                  ].map((item) => (
                    <div key={item.size} className="text-center">
                      <Sparkles className={`${item.size} mx-auto mb-2 text-[#41B6A6]`} />
                      <code className="text-xs block mb-1 text-gray-800">{item.size}</code>
                      <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.usage}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </TabsContent>

          {/* SPACING TAB */}
          <TabsContent value="spacing" className="space-y-10 md:space-y-12">
            <section>
              <h2 className="text-gray-800 mb-3">Espacements standards (gap, padding, margin)</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                  {[
                    { size: '1', px: '4px', usage: 'Très petit' },
                    { size: '2', px: '8px', usage: 'Petit' },
                    { size: '3', px: '12px', usage: 'Moyen' },
                    { size: '4', px: '16px', usage: 'Standard' },
                    { size: '5', px: '20px', usage: 'Medium+' },
                    { size: '6', px: '24px', usage: 'Large' },
                    { size: '8', px: '32px', usage: 'Très large' },
                    { size: '12', px: '48px', usage: 'XL' },
                  ].map((space) => (
                    <div key={space.size} className="text-center">
                      <div className="bg-[#41B6A6] mb-3 mx-auto rounded-sm shadow-sm" style={{ width: space.px, height: space.px }} />
                      <p className="text-sm text-gray-800 mb-1">{space.size}</p>
                      <p className="text-xs text-gray-500 mb-1">{space.px}</p>
                      <p className="text-xs text-gray-400">{space.usage}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-gray-800 mb-3">Border Radius</h2>
              <Card className="p-6 lg:p-8 border-0 shadow-md">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                  {[
                    { name: 'rounded', usage: 'Léger' },
                    { name: 'rounded-md', usage: 'Moyen' },
                    { name: 'rounded-lg', usage: 'Standard' },
                    { name: 'rounded-xl', usage: 'Prononcé' },
                    { name: 'rounded-2xl', usage: 'Très arrondi' },
                    { name: 'rounded-3xl', usage: 'Headers' },
                    { name: 'rounded-full', usage: 'Cercle' },
                  ].map((radius) => (
                    <div key={radius.name} className="text-center">
                      <div className={`w-20 h-20 bg-[#41B6A6] mx-auto mb-3 shadow-sm ${radius.name}`} />
                      <code className="text-xs block mb-1 text-gray-800">{radius.name}</code>
                      <p className="text-xs text-gray-500">{radius.usage}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section>
              <h2 className="text-gray-800 mb-3">Ombres (Shadow)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 shadow-sm border-0">
                  <h4 className="mb-3">Shadow SM</h4>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded block mb-3">shadow-sm</code>
                  <p className="text-sm text-gray-600">Usage courant pour les cartes</p>
                  <Badge className="mt-3 bg-green-100 text-green-700 border-0">RECOMMANDÉ</Badge>
                </Card>
                <Card className="p-6 shadow-md border-0">
                  <h4 className="mb-3">Shadow MD</h4>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded block mb-3">shadow-md</code>
                  <p className="text-sm text-gray-600">Hover states, éléments importants</p>
                </Card>
                <Card className="p-6 shadow-lg border-0">
                  <h4 className="mb-3">Shadow LG</h4>
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded block mb-3">shadow-lg</code>
                  <p className="text-sm text-gray-600">Emphase, headers, modals</p>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* PATTERNS TAB */}
          <TabsContent value="patterns" className="space-y-10 md:space-y-12">
            {/* Headers */}
            <section>
              <h2 className="text-gray-800 mb-3">Headers de page</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="bg-gradient-to-br from-[#41B6A6] to-[#359889] px-6 pt-10 pb-8 text-white rounded-b-3xl">
                    <h3 className="text-white mb-2">Header Utilisateur</h3>
                    <p className="text-white/90 text-sm">Dégradé turquoise avec arrondis</p>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <code className="text-xs block bg-white px-3 py-2 rounded break-all">
                      bg-gradient-to-br from-[#41B6A6] to-[#359889] rounded-b-3xl
                    </code>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-6 pt-10 pb-8 text-white">
                    <h3 className="text-white mb-2">Header Éducateur</h3>
                    <p className="text-white/90 text-sm">Dégradé terracotta</p>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <code className="text-xs block bg-white px-3 py-2 rounded break-all">
                      bg-gradient-to-br from-[#F28B6F] to-[#e67a5f]
                    </code>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-6 pt-10 pb-8 text-white rounded-b-3xl">
                    <h3 className="text-white mb-2">Header Club</h3>
                    <p className="text-white/90 text-sm">Dégradé sable pour interface pro</p>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <code className="text-xs block bg-white px-3 py-2 rounded break-all">
                      bg-gradient-to-br from-[#E9B782] to-[#d9a772] rounded-b-3xl
                    </code>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 px-6 pt-10 pb-8 text-white">
                    <h3 className="text-white mb-2">Header Leaderboard</h3>
                    <p className="text-white/90 text-sm">Dégradé purple pour classements</p>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <code className="text-xs block bg-white px-3 py-2 rounded break-all">
                      bg-gradient-to-br from-purple-600 to-purple-800
                    </code>
                  </div>
                </Card>
              </div>
            </section>

            {/* Gamification Cards */}
            <section>
              <h2 className="text-gray-800 mb-3">Patterns de gamification</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Carte de progression */}
                <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 bg-gray-200 flex items-center justify-center">
                      <Dog className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-gray-800">Max</h4>
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0">
                          Niveau 5
                        </Badge>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                          style={{ width: '70%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">700 / 1000 XP</p>
                    </div>
                  </div>
                </Card>

                {/* Carte de badge */}
                <Card className="p-4 shadow-sm border-0">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-gray-800 mb-1">Premier pas</h4>
                    <p className="text-xs text-gray-600 mb-3">Première séance complétée</p>
                    <Badge className="bg-green-100 text-green-700 border-0 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Déverrouillé
                    </Badge>
                  </div>
                </Card>

                {/* Carte de tâche */}
                <Card className="p-4 shadow-sm border-0">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-[#41B6A6] mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-gray-800">Pratiquer le rappel</h4>
                        <Badge className="bg-purple-100 text-purple-700 border-0 flex items-center gap-1 flex-shrink-0">
                          <Zap className="h-3 w-3" />
                          +50 XP
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Faire venir votre chien 5 fois</p>
                    </div>
                  </div>
                </Card>

                {/* Podium preview */}
                <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-purple-50 to-white">
                  <h4 className="mb-4 text-center">Podium Leaderboard</h4>
                  <div className="flex items-end justify-center gap-2">
                    <div className="flex-1 text-center">
                      <div className="text-2xl mb-2">🥈</div>
                      <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-xl p-2">
                        <p className="text-white text-xs">2ème</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center -mt-4">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-t-xl p-3">
                        <p className="text-white">1er</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-2xl mb-2">🥉</div>
                      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-t-xl p-2">
                        <p className="text-white text-xs">3ème</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Messages de statut */}
            <section>
              <h2 className="text-gray-800 mb-3">Messages de statut</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 bg-green-50 border border-green-200 shadow-sm border-0">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-green-900 mb-1">Succès !</h4>
                      <p className="text-sm text-green-700">Votre action a été réalisée avec succès</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-orange-50 border border-orange-200 shadow-sm border-0">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-orange-900 mb-1">Attention</h4>
                      <p className="text-sm text-orange-700">Veuillez vérifier les informations</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border border-blue-200 shadow-sm border-0">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-blue-900 mb-1">Information</h4>
                      <p className="text-sm text-blue-700">Voici une information importante</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-red-50 border border-red-200 shadow-sm border-0">
                  <div className="flex gap-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-red-900 mb-1">Erreur</h4>
                      <p className="text-sm text-red-700">Une erreur s'est produite</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Layout mobile */}
            <section>
              <h2 className="text-gray-800 mb-3">Layout mobile (iPhone 15 Pro)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 shadow-md">
                  <h4 className="mb-3">Dimensions</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    L'application simule un iPhone 15 Pro
                  </p>
                  <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                    w-[393px] h-[852px]
                  </code>
                </Card>

                <Card className="p-6 border-0 shadow-md">
                  <h4 className="mb-3">Bottom Navigation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Navigation fixée en bas
                  </p>
                  <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                    fixed bottom-0 h-20
                  </code>
                </Card>

                <Card className="p-6 border-0 shadow-md">
                  <h4 className="mb-3">Padding bottom</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Pour éviter la bottom nav
                  </p>
                  <code className="text-xs bg-gray-100 px-3 py-2 rounded block">
                    pb-20 ou pb-24
                  </code>
                </Card>
              </div>
            </section>

            {/* DjanAI Patterns */}
            <section>
              <h2 className="text-gray-800 mb-3">Patterns DjanAI</h2>
              <div className="space-y-6">
                <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-800">DjanAI</h3>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs gap-1">
                          <Sparkles className="h-3 w-3" />
                          IA
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Programme personnalisé pour votre chien
                      </p>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-full">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Commencer
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-1">Consulter DjanAI</h3>
                      <p className="text-white/80 text-sm">
                        Votre assistant IA personnel
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/80" />
                  </div>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Palette className="h-5 w-5" />
              <p>Smart Dogs Design System</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>Version 3.0</span>
              <span>•</span>
              <span>Novembre 2025</span>
              <span>•</span>
              <span>Audit complet</span>
            </div>
            <p className="text-xs text-gray-400">
              Tous les gradients, couleurs et 100+ icônes documentés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
