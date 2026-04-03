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
           { icon: <TrendingDown size={20} />, label: 'Watchlist', color: 'bg-white text-slate-400', path: '/markets' },
           { icon: <History size={20} />, label: 'History', color: 'bg-white text-slate-400', path: '/portfolio' },
           { icon: <ArrowUpRight size={20} />, label: 'Asset', color: 'bg-white text-slate-400', path: '/portfolio' },
         ].map((action) => (
           <button 
             key={action.label}
             onClick={() => navigate(action.path)}
             className="flex flex-col items-center gap-2"
           >
              <div className={`w-full aspect-square ${action.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                 {action.icon}
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight">{action.label}</span>
           </button>
         ))}
      </div>

      {/* Portfolio Quick Look */}
      <section className="p-6 mb-4">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300 group active:scale-[0.98] transition-transform duration-200">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-400/10 blur-[80px] -mr-20 -mt-20 group-hover:bg-red-400/20 transition-all" />
          
          {/* Mascot Peeking Correction */}
          <div className="absolute -top-6 -right-2 w-28 h-28 transform rotate-6 z-20 pointer-events-none drop-shadow-2xl">
              <Mascot />
          </div>

          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block opacity-80">Portfolio Value</span>
            <div className="flex items-baseline gap-2 mb-8">
               <h2 className="text-4xl font-black tracking-tighter">₹{balance.toLocaleString()}</h2>
               <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp size={12} />
                  +1.5%
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <span className="text-[8px] text-slate-500 font-bold uppercase mb-1 block">DAILY P&L</span>
                  <p className="font-black text-sm text-emerald-400">+ ₹{4322}</p>
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
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Top Stocks</h3>
          <button className="text-slate-400 font-bold text-xs uppercase" onClick={() => navigate('/portfolio')}>See All</button>
        </div>
        <div className="space-y-4">
          {topHoldings.length === 0 ? (
            <div className="bg-slate-50 p-10 rounded-[32px] flex flex-col items-center justify-center text-center">
              <p className="text-slate-400 font-bold text-sm">No active holdings</p>
            </div>
          ) : (
            topHoldings.map(holding => {
              const stock = stocks.find(s => s.id === holding.stockId);
              const pAndL = (stock?.price - holding.avgPrice) * holding.quantity;
              return (
                <div 
                   key={holding.stockId} 
                   onClick={() => navigate(`/stock/${holding.stockId}`)}
                   className="flex items-center justify-between p-2 cursor-pointer active:opacity-60"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400">
                      {stock?.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{stock?.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{holding.quantity} Shares · Avg ₹{holding.avgPrice.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{(stock?.price * holding.quantity).toLocaleString()}</div>
                    <div className={`text-[10px] font-bold ${pAndL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {pAndL >= 0 ? '+' : '-'}₹{Math.abs(pAndL).toFixed(1)}
                    </div>
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
