import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Wallet, History, Eye, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Mascot from '../components/Mascot';

export default function Home() {
  const { portfolio, stocks, balance, recentlyViewed } = useStore();
  const navigate = useNavigate();
  
  const totalValue = useMemo(() => {
    return portfolio.reduce((acc, p) => {
      const stock = stocks.find(s => s.id === p.stockId);
      return acc + (stock ? stock.price * p.quantity : 0);
    }, 0);
  }, [portfolio, stocks]);

  const totalInvestment = useMemo(() => {
    return portfolio.reduce((acc, p) => acc + (p.avgPrice * p.quantity), 0);
  }, [portfolio]);

  const totalProfit = totalValue - totalInvestment;
  const totalProfitPercent = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

  const recentStocksData = useMemo(() => {
    return recentlyViewed.map(id => stocks.find(s => s.id === id)).filter(Boolean);
  }, [recentlyViewed, stocks]);

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
    <div className="pb-24 px-6 pt-16 bg-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-slate-400 font-bold text-xs uppercase mb-1">Total Balance</h2>
          <div className="flex items-baseline gap-1">
            <span className="text-slate-900 font-bold text-3xl">₹{(totalValue + balance).toLocaleString()}</span>
            <span className="text-slate-400 font-semibold text-sm">INR</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
          <Wallet className="text-slate-900" size={24} />
        </div>
      </header>

      {/* Quick Actions (Static Tiles) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
         {[
           { icon: <TrendingUp size={20} />, label: 'Markets', color: 'bg-slate-50 text-slate-400', path: '/markets' },
           { icon: <TrendingDown size={20} />, label: 'Watchlist', color: 'bg-slate-50 text-slate-400', path: '/markets' },
           { icon: <History size={20} />, label: 'History', color: 'bg-slate-50 text-slate-400', path: '/portfolio' },
           { icon: <ArrowUpRight size={20} />, label: 'Asset', color: 'bg-slate-50 text-slate-400', path: '/portfolio' },
         ].map((action) => (
           <button 
             key={action.label}
             onClick={() => navigate(action.path)}
             className="flex flex-col items-center gap-2"
           >
              <div className={`w-full aspect-square ${action.color} rounded-2xl flex items-center justify-center`}>
                 {action.icon}
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight">{action.label}</span>
           </button>
         ))}
      </div>

      {/* Portfolio Card (Static) */}
      <div className="card p-6 mb-8 relative border border-slate-100 shadow-none bg-slate-50 rounded-[32px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-slate-400 font-bold text-xs uppercase">Portfolio P/L</span>
            <div className={`text-2xl font-bold mt-1 flex items-center gap-1 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalProfit >= 0 ? '+' : '-'}₹{Math.abs(totalProfit).toLocaleString()}
              <span className="text-sm opacity-70 ml-1">({totalProfitPercent.toFixed(2)}%)</span>
            </div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-20">
             <Mascot />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6">
           <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Investment</span>
              <p className="font-bold text-slate-800">₹{totalInvestment.toLocaleString()}</p>
           </div>
           <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Current Value</span>
              <p className="font-bold text-slate-800">₹{totalValue.toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* Top Holdings */}
      <section>
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
