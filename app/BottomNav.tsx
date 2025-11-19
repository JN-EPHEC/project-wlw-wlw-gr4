import React from 'react';
import { Home, Users, MessageCircle, Dog, UserCircle } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'clubs', icon: Users, label: 'Clubs' },
    { id: 'community', icon: MessageCircle, label: 'Communauté' },
    { id: 'mydog', icon: Dog, label: 'Mes chiens' },
    { id: 'account', icon: UserCircle, label: 'Compte' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-[#41B6A6]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon 
                className={`h-6 w-6 ${isActive ? 'fill-[#41B6A6]/10' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
