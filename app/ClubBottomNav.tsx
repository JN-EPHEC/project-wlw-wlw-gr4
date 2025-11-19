import React from 'react';
import { Home, Building2, MessageSquare, Calendar, CreditCard } from 'lucide-react';

interface ClubBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function ClubBottomNav({ currentPage, onNavigate }: ClubBottomNavProps) {
  const navItems = [
    { id: 'clubHome', icon: Home, label: 'Accueil' },
    { id: 'clubProfile', icon: Building2, label: 'Mon Club' },
    { id: 'clubCommunity', icon: MessageSquare, label: 'Communauté' },
    { id: 'clubAppointments', icon: Calendar, label: 'Mes RDV' },
    { id: 'clubPayments', icon: CreditCard, label: 'Paiements' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#E9B782]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-[#E9B782]/20' : ''}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
