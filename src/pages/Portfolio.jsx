import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Briefcase, History, TrendingUp as ProfitIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
  const { portfolio, stocks } = useStore();
  const navigate = useNavigate();

  const portfolioWithData = useMemo(() => {
    return portfolio.map(p => {
      const stock = stocks.find(s => s.id === p.stockId);
      const currentValue = stock ? stock.price * p.quantity : 0;
      const investment = p.avgPrice * p.quantity;
      const pAndL = currentValue - investment;
      const pAndLPercent = investment > 0 ? (pAndL / investment) * 100 : 0;
      return { ...p, stock, currentValue, investment, pAndL, pAndLPercent };
    }).sort((a, b) => b.currentValue - a.currentValue);
  }, [portfolio, stocks]);

  const totalValue = portfolioWithData.reduce((acc, p) => acc + p.currentValue, 0);
  const totalInvestment = portfolioWithData.reduce((acc, p) => acc + p.investment, 0);
  const totalProfit = totalValue - totalInvestment;

  return (
    <div className="pb-24 px-6 pt-16 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Portfolio</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">REAL-TIME ASSETS</p>
      </header>

      {/* Portfolio Card Wrapper */}
      <section className="mb-10 card p-6 bg-slate-900 text-white shadow-xl shadow-slate-200">
         <div className="flex justify-between items-start mb-6">
            <div>
               <span className="text-slate-500 font-black text-[10px] uppercase">TOTAL VALUE</span>
               <div className="text-3xl font-black mt-1">₹{totalValue.toLocaleString()}</div>
            </div>
            <div className={`px-4 py-2 rounded-xl flex items-center gap-1 font-black shadow-lg ${totalProfit >= 0 ? 'bg-emerald-500 text-white shadow-emerald-900/40' : 'bg-red-500 text-white shadow-red-900/40'}`}>
               {totalProfit >= 0 ? '+' : '-'}₹{Math.abs(totalProfit).toLocaleString()}
               <TrendingUp size={18} />
            </div>
         </div>
         <div className="w-full h-px bg-slate-800 my-6" />
         <div className="flex items-center gap-8 text-center sm:text-left">
            <div className="flex-1">
               <span className="text-slate-500 font-black text-[10px] uppercase block mb-1">INVESTED</span>
               <p className="font-black">₹{totalInvestment.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex-1">
               <span className="text-slate-500 font-black text-[10px] uppercase block mb-1">TODAY'S P/L</span>
               <p className={totalProfit >= 0 ? 'text-emerald-400 font-black' : 'text-red-400 font-black'}>₹{totalProfit.toFixed(2)}</p>
            </div>
         </div>
      </section>

      {/* Holding List */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            Asset Allocation <Briefcase size={20} className="text-[#FF6B6B]" />
          </h3>
          <span className="text-xs font-bold text-slate-400">{portfolioWithData.length} Assets</span>
        </div>

        {portfolioWithData.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-100 shadow-sm border border-slate-50 mb-6">
                <History size={40} />
             </div>
             <p className="text-slate-400 font-bold text-lg">Empty Portfolio</p>
             <p className="text-slate-300 text-sm">Your assets will appear here after your first trade.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolioWithData.map((holding, idx) => (
              <motion.div 
                key={holding.stockId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/stock/${holding.stockId}`)}
                className="card flex flex-col gap-4 p-5 cursor-pointer hover:border-red-100 active:bg-slate-50 transition-all border-l-4 border-l-slate-200 hover:border-l-[#FF6B6B]"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm uppercase">
                         {holding.stock?.symbol.slice(0, 2)}
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-sm">{holding.stock?.name}</h4>
                         <p className="text-[10px] text-slate-400 font-black uppercase">{holding.quantity} Shares · Avg ₹{holding.avgPrice.toFixed(1)}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="font-black text-slate-900">₹{holding.currentValue.toLocaleString()}</div>
                      <div className={`text-xs font-black flex items-center justify-end gap-1 ${holding.pAndL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                         {holding.pAndL >= 0 ? '+' : '-'}₹{Math.abs(holding.pAndL).toFixed(1)}
                         <span className="text-[10px] opacity-60">({holding.pAndLPercent.toFixed(2)}%)</span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
