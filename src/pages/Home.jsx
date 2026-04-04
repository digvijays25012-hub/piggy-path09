import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { History, TrendingUp, TrendingDown, ArrowUpRight, Bell } from 'lucide-react';
import Mascot from '../components/Mascot';

export default function Home() {
  const { portfolio, stocks, balance } = useStore();
  const navigate = useNavigate();
  
  const topHoldings = useMemo(() => {
    return [...portfolio]
      .sort((a, b) => {
        const sa = stocks.find(s => s.id === a.stockId);
        const sb = stocks.find(s => s.id === b.stockId);
        return (sb?.price * b.quantity || 0) - (sa?.price * a.quantity || 0);
      })
      .slice(0, 3);
  }, [portfolio, stocks]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      {/* Top Professional Ticker */}
      <div className="bg-slate-900 h-8 flex items-center overflow-hidden whitespace-nowrap gap-8 px-4 border-b border-slate-800">
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">NIFTY 50</span>
            <span className="text-[10px] font-bold text-emerald-400">21,690.20</span>
            <span className="text-[10px] font-bold text-emerald-500/50">+1.25%</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">BANKNIFTY</span>
            <span className="text-[10px] font-bold text-red-400">21,690.20</span>
            <span className="text-[10px] font-bold text-red-500/50">-1.25%</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">FINNIFTY</span>
            <span className="text-[10px] font-bold text-emerald-400">21,690.20</span>
         </div>
      </div>

      <header className="px-6 pt-10 pb-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Piggypath</h1>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVE TRADING</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">TOTAL P&L</span>
              <span className="text-xs font-black text-emerald-500 tracking-tight">+₹4,322</span>
           </div>
           <button className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
             <Bell size={18} />
           </button>
        </div>
      </header>

      {/* Quick Actions (Static Tiles) */}
      <div className="grid grid-cols-4 gap-4 mb-8 px-6 mt-8">
         {[
           { icon: <TrendingUp size={20} />, label: 'Markets', color: 'bg-white text-slate-400', path: '/markets' },
           { icon: <TrendingUp size={20} />, label: 'Markets', color: 'bg-[#1F2128] text-[#3772FF]', path: '/markets' },
           { icon: <TrendingDown size={20} />, label: 'Watchlist', color: 'bg-[#1F2128] text-[#EF466F]', path: '/markets' },
           { icon: <History size={20} />, label: 'History', color: 'bg-[#1F2128] text-[#777E90]', path: '/portfolio' },
           { icon: <ArrowUpRight size={20} />, label: 'Asset', color: 'bg-[#1F2128] text-[#45B26B]', path: '/portfolio' },
         ].map((action) => (
           <button 
             key={action.label}
             onClick={() => navigate(action.path)}
             className="flex flex-col items-center gap-2"
           >
              <div className={`w-full aspect-square ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                 {action.icon}
              </div>
              <span className="text-[10px] font-bold uppercase text-[#777E90] tracking-tight">{action.label}</span>
           </button>
         ))}
      </div>

      {/* Portfolio Quick Look */}
      <section className="p-6 mb-4">
        <div className="bg-[#1F2128] border border-white/5 rounded-[40px] p-8 text-white relative overflow-hidden shadow-premium group active:scale-[0.98] transition-transform duration-200">
          {/* Neon Glow Decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#3772FF]/10 blur-[100px] pointer-events-none" />
          
          <div className="absolute -top-6 -right-2 w-28 h-28 transform rotate-6 z-20 pointer-events-none drop-shadow-[0_0_20px_rgba(255,107,107,0.2)]">
              <Mascot />
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-black text-[#777E90] uppercase tracking-[0.2em] mb-3 block">Total Portfolio Balance</span>
            <div className="flex items-baseline gap-2 mb-8">
               <span className="text-4xl font-black tracking-tighter">₹{balance.toLocaleString()}</span>
               <span className="text-xs font-bold text-[#45B26B] bg-[#45B26B]/10 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                  <TrendingUp size={10} />
                  +2.4%
               </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mb-1 block">DAILY P&L</span>
                  <p className="font-black text-sm text-[#45B26B]">+ ₹{4322}</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mb-1 block">USED MARGIN</span>
                  <p className="font-black text-sm text-slate-300">₹{0}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Holdings */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Top Stocks</h3>
          <button className="text-[#3772FF] font-bold text-xs uppercase" onClick={() => navigate('/portfolio')}>See All</button>
        </div>
        <div className="space-y-4">
          {topHoldings.length === 0 ? (
            <div className="bg-[#1F2128] p-10 rounded-[32px] flex flex-col items-center justify-center text-center">
              <p className="text-[#777E90] font-bold text-sm">No active holdings</p>
            </div>
          ) : (
            topHoldings.map(holding => {
              const stock = stocks.find(s => s.id === holding.stockId);
              return (
                <div 
                   key={holding.stockId} 
                   onClick={() => navigate(`/stock/${holding.stockId}`)}
                   className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 group/row hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3772FF]/5 border border-[#3772FF]/10 rounded-[18px] flex items-center justify-center text-[#3772FF] group-hover/row:scale-110 transition-transform">
                      {stock.type === 'INDEX' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-sm tracking-tight">{stock.name}</h4>
                      <p className="text-[10px] font-bold text-[#777E90] uppercase tracking-wider">{stock.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">₹{stock.price.toLocaleString()}</p>
                    <p className={`text-[10px] font-black ${stock.change >= 0 ? 'text-[#45B26B]' : 'text-[#EF466F]'} uppercase`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
