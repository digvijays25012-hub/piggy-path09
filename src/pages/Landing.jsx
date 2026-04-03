import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-24 pb-12 items-center text-center max-w-md mx-auto relative overflow-hidden">
        {/* Simple Header */}
        <div className="flex items-center gap-3 mb-10 w-full justify-start">
          <div className="w-8 h-8 bg-[#FF6B6B] rounded-lg flex items-center justify-center shadow-lg shadow-red-200">
             <img src="https://api.iconify.design/solar:piggy-bank-bold-duotone.svg?color=white" className="w-5 h-5" alt="Logo" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">Piggypath</span>
        </div>

        {/* Static Mascot */}
        <div className="w-80 h-80 mb-12 flex items-center justify-center relative">
             <img 
               src="/assets/mascot.png" 
               alt="Piggy Mascot"
               className="w-full h-full object-contain relative z-20"
             />
             <div className="absolute inset-0 bg-red-50 rounded-full filter blur-3xl scale-75 opacity-20 z-10" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 leading-[1.1] mb-6">
          Invest Better, <br/>
          Simple & Smart.
        </h1>

        <p className="text-slate-400 font-bold text-sm max-w-[280px] leading-relaxed mb-12">
          Join thousands of smart traders making simple investment choices.
        </p>

        {/* Feature Grid (Static) */}
        <div className="grid grid-cols-3 gap-6 w-full mb-12">
             {[
               { icon: <Zap size={20} />, label: "Fast", color: "text-amber-500" },
               { icon: <Target size={20} />, label: "Smart", color: "text-emerald-500" },
               { icon: <TrendingUp size={20} />, label: "Growth", color: "text-[#FF6B6B]" },
             ].map((feat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                      <span className={feat.color}>{feat.icon}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{feat.label}</span>
                </div>
             ))}
        </div>

        {/* Simple CTA */}
        <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#FF6B6B] text-white h-14 rounded-2xl font-black text-md shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:opacity-80 transition-all"
        >
            Get Started
            <ArrowRight size={20} />
        </button>
          
        <p className="text-center text-slate-300 font-bold text-xs mt-8">
            Trusted by 50k+ users
        </p>

    </div>
  );
}
