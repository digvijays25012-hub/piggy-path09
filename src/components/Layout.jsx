import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Wallet, User, Plus } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  
  const tabs = [
    { icon: <Home size={24} />, path: '/', label: 'Home' },
    { icon: <TrendingUp size={24} />, path: '/markets', label: 'Markets' },
    { icon: <Plus size={28} />, path: '/trade-center', label: 'Trade', primary: true }, // Centered Action
    { icon: <Wallet size={24} />, path: '/portfolio', label: 'Portfolio' },
    { icon: <User size={24} />, path: '/profile', label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-[#141416] pb-32">
      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-[#141416]">
        {children}

        {/* Improved Glassmorphic Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
           <div className="max-w-md mx-auto bg-[#1F2128]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] h-20 flex items-center justify-between px-4 shadow-premium">
              {tabs.map((tab) => {
                if (tab.primary) {
                  return (
                    <button 
                      key={tab.label}
                      className="w-14 h-14 bg-[#3772FF] text-white rounded-2xl flex items-center justify-center -mt-12 shadow-glow active:scale-95 transition-all"
                    >
                      {tab.icon}
                    </button>
                  );
                }
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) => `
                      flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all
                      ${isActive ? 'text-[#3772FF]' : 'text-[#777E90]'}
                    `}
                  >
                    {tab.icon}
                    <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
                  </NavLink>
                );
              })}
           </div>
        </nav>
      </main>
    </div>
  );
}
