import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      {/* iPhone 15 Pro Frame */}
      <div className="relative w-full max-w-[393px] h-[852px] bg-black rounded-[60px] p-3 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-9 bg-black rounded-full z-50" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[48px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
