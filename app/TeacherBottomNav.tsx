import { Home, Calendar, MessageSquare, User, Building2 } from 'lucide-react';

interface TeacherBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function TeacherBottomNav({ currentPage, onNavigate }: TeacherBottomNavProps) {
  const navItems = [
    { id: 'teacher-home', icon: Home, label: 'Accueil' },
    { id: 'teacher-clubs', icon: Building2, label: 'Clubs' },
    { id: 'teacher-appointments', icon: Calendar, label: 'Cours' },
    { id: 'teacher-community', icon: MessageSquare, label: 'Communauté' },
    { id: 'teacher-account', icon: User, label: 'Compte' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-6 pt-3 shadow-lg z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 transition-colors"
            >
              <div className={`p-2 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-gradient-to-br from-[#41B6A6] to-[#359889] text-white' 
                  : 'text-gray-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-xs transition-colors ${
                isActive ? 'text-[#41B6A6]' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
