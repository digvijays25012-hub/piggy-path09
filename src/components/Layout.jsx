import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Briefcase, User, ShoppingCart } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  const tabs = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Markets', path: '/markets', icon: <TrendingUp size={22} /> },
    { name: 'Trade', path: '/trade', icon: <ShoppingCart size={22} />, isMain: true },
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={22} /> },
    { name: 'Profile', path: '/profile', icon: <User size={22} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden max-w-md mx-auto relative safe-top safe-bottom">
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-white">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 h-[calc(5rem+env(safe-area-inset-bottom,0px))] flex items-start justify-between pt-3 pb-safe z-40 max-w-md mx-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center transition-all ${tab.isMain ? 'relative -top-6' : ''} ${isActive ? 'text-[#FF6B6B]' : 'text-slate-300'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-3 rounded-2xl transition-all duration-200 ${tab.isMain ? 'bg-[#FF6B6B] text-white shadow-xl shadow-red-200/50' : isActive ? 'bg-red-50/50' : 'bg-transparent'}`}>
                  {tab.icon}
                </div>
                {!tab.isMain && (
                   <span className={`text-[10px] mt-1 font-bold uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      {tab.name}
                   </span>
                )}
                {/* Simplified static Active Indicator */}
                {!tab.isMain && isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-[#FF6B6B] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
