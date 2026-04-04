import React, { useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Bell, Search, Layers, History, ArrowUpRight } from 'lucide-react';
import Mascot from '../components/Mascot';

export default function Home() {
  const { stocks, realHoldings, realProfit, syncBrokerageData, balance } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial Sync with Zerodha
    syncBrokerageData();
    
    // Periodic sync every 60 seconds
    const interval = setInterval(syncBrokerageData, 60000);
    return () => clearInterval(interval);
  }, [syncBrokerageData]);
  
  const totalValue = useMemo(() => {
    return realHoldings.reduce((acc, h) => acc + h.last_price * h.quantity, 0);
  }, [realHoldings]);

  const topHoldings = useMemo(() => {
    return [...realHoldings]
      .sort((a, b) => (b.last_price * b.quantity) - (a.last_price * a.quantity))
      .slice(0, 3);
  }, [realHoldings]);

  return (
    <div className="min-h-screen bg-[#141416] flex flex-col pb-32 relative overflow-hidden">
      {/* Background Decor - Neon Pulse */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3772FF]/5 rounded-full blur-[120px] -mr-80 -mt-80 pointer-events-none" />

      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center relative z-10">
        <div>
           <h2 className="text-[#777E90] text-[10px] font-black uppercase tracking-[0.2em] mb-1">TERMINAL CONNECTED</h2>
           <h1 className="text-2xl font-black text-white tracking-tight">Piggypath <span className="text-[#3772FF]">Pro</span></h1>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-[#1F2128] border border-white/5 rounded-xl flex items-center justify-center text-[#777E90] active:scale-95 transition-all">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 bg-[#1F2128] border border-white/5 rounded-xl flex items-center justify-center text-[#777E90] active:scale-95 transition-all relative">
            <Bell size={20} />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#3772FF] rounded-full border-2 border-[#141416]" />
          </button>
        </div>
      </header>

      {/* Portfolio Card - THE CORE VIEW */}
      <div className="px-6 mb-10 relative z-10 mt-6">
         <div className="bg-gradient-to-br from-[#1F2128] to-[#141416] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-[#3772FF]/5 opacity-50 pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[#777E90] text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">TOTAL ASSET VALUE</span>
              <div className="flex items-end gap-3 mb-8">
                <h3 className="text-5xl font-black text-white leading-none tracking-tighter">
                  ₹{totalValue > 0 ? totalValue.toLocaleString('en-IN') : balance.toLocaleString('en-IN')}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${realProfit >= 0 ? 'bg-emerald-400/5 border-emerald-400/10' : 'bg-rose-400/5 border-rose-400/10'}`}>
                  <span className="text-[8px] font-black text-[#777E90] uppercase tracking-widest block mb-1">REAL P&L</span>
                  <div className="flex items-center gap-1.5">
                    {realProfit >= 0 ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-rose-400" />}
                    <span className={`font-black text-sm ${realProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ₹{Math.abs(realProfit).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[8px] font-black text-[#777E90] uppercase tracking-widest block mb-1">MARGIN USED</span>
                  <p className="font-black text-sm text-white">₹0.00</p>
                </div>
              </div>
            </div>

            {/* Mascot Placement - PEAKING FROM TOP RIGHT */}
            <div className="absolute -top-4 -right-2 w-32 h-32 transform rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110 z-20">
               <Mascot />
            </div>
         </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="px-6 grid grid-cols-4 gap-4 mb-10 relative z-10">
         {[
           { icon: <Layers size={22} />, label: 'Markets', color: 'text-[#3772FF]', bg: 'bg-[#3772FF]/10' },
           { icon: <History size={22} />, label: 'Orders', color: 'text-[#9757D7]', bg: 'bg-[#9757D7]/10' },
           { icon: <ArrowUpRight size={22} />, label: 'Transfer', color: 'text-[#45B26B]', bg: 'bg-[#45B26B]/10' },
           { icon: <TrendingUp size={22} />, label: 'Reports', color: 'text-[#EF466F]', bg: 'bg-[#EF466F]/10' },
         ].map((action, i) => (
           <button key={i} className="flex flex-col items-center gap-3 active:scale-90 transition-transform">
              <div className={`w-full aspect-square ${action.bg} ${action.color} rounded-2xl flex items-center justify-center border border-white/5 shadow-inner`}>
                {action.icon}
              </div>
              <span className="text-[9px] font-black text-[#777E90] uppercase tracking-wider">{action.label}</span>
           </button>
         ))}
      </div>

      {/* Real Holdings List */}
      <div className="px-6 mb-8 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-black text-lg tracking-tight">Active Holdings</h3>
          <button onClick={() => navigate('/portfolio')} className="text-[#3772FF] text-xs font-black uppercase tracking-widest hover:underline">VIEW ALL</button>
        </div>
        
        <div className="space-y-4">
          {topHoldings.length > 0 ? topHoldings.map((holding) => (
            <div 
              key={holding.tradingsymbol}
              onClick={() => navigate(`/stock/${holding.tradingsymbol}`)}
              className="bg-[#1F2128] border border-white/5 rounded-3xl p-5 flex items-center justify-between hover:border-[#3772FF]/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#141416] rounded-2xl flex items-center justify-center font-black text-[#3772FF] border border-white/5">
                  {holding.tradingsymbol.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{holding.tradingsymbol}</h4>
                  <p className="text-[#777E90] text-[10px] font-bold uppercase tracking-wider">{holding.quantity} Shares</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-black text-sm tracking-tight">₹{(holding.last_price * holding.quantity).toLocaleString('en-IN')}</p>
                <p className={`text-[10px] font-bold ${holding.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {holding.pnl >= 0 ? '+' : ''}{holding.pnl.toFixed(2)}%
                </p>
              </div>
            </div>
          )) : (
            <div className="bg-[#1F2128]/40 border border-dashed border-white/10 rounded-[32px] p-12 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="text-[#777E90]/50" size={24} />
               </div>
               <p className="text-[#777E90] font-bold text-sm">No Live Assets Detected</p>
               <p className="text-[10px] text-[#777E90]/50 uppercase tracking-[0.1em] mt-2 leading-relaxed">
                  Log in to Zerodha to synchronize <br/>your live portfolio
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
