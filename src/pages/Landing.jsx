import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141416] flex flex-col px-8 pt-24 pb-12 items-center text-center max-w-md mx-auto relative overflow-hidden">
        {/* Neon Back-glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3772FF]/10 blur-[120px] -mr-40 -mt-40 pointer-events-none" />

        {/* Global Logo Header */}
        <div className="flex items-center gap-3 mb-10 w-full justify-start sticky top-0 z-50 py-4">
          <div className="w-10 h-10 bg-[#3772FF] rounded-[16px] flex items-center justify-center shadow-glow">
             <img src="https://api.iconify.design/solar:piggy-bank-bold-duotone.svg?color=white" className="w-7 h-7" alt="Logo" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">Piggypath</span>
        </div>

        {/* Mascot Highlight Section */}
        <div className="w-80 h-80 mb-12 flex items-center justify-center relative group">
             <img 
               src="/assets/mascot.png" 
               alt="Piggy Mascot"
               className="w-full h-full object-contain relative z-20 drop-shadow-[0_0_40px_rgba(55,114,255,0.3)] group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-[#3772FF]/5 rounded-full filter blur-[80px] scale-90 glow-bg z-10" />
        </div>

        <h1 className="text-4xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
          Invest Better, <br/>
          Simple & Smart.
        </h1>

        <p className="text-[#777E90] font-bold text-sm max-w-[280px] leading-relaxed mb-12">
          Join thousands of smart traders making intelligent investment choices.
        </p>

        {/* CTA Section */}
        <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#3772FF] text-white h-16 rounded-[24px] font-black text-md shadow-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
            Authorize Entry
            <ArrowRight size={22} />
        </button>
          
        <p className="text-center text-[#777E90]/50 font-black text-[10px] uppercase tracking-[0.2em] mt-10">
            Trusted by 50,000+ Smart Investors
        </p>
    </div>
  );
}
