import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Markets() {
  const { stocks, addToRecentlyViewed } = useStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredStocks = useMemo(() => {
    return stocks.filter(s => 
      s.symbol.toLowerCase().includes(search.toLowerCase()) || 
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stocks, search]);

  const topGainers = useMemo(() => {
    return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  }, [stocks]);

  return (
    <div className="pb-24 px-6 pt-16 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Markets</h1>
        
        {/* Search */}
        <div className="flex items-center bg-white border border-slate-100 rounded-3xl px-5 py-4 shadow-sm focus-within:ring-2 ring-red-100 transition-all">
          <Search size={22} className="text-slate-300 mr-3" />
          <input 
            type="text" 
            placeholder="Search symbols or names"
            className="flex-1 outline-none font-bold text-slate-900 placeholder:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Top Gainers - Horizontal Scroll */}
      {!search && (
        <section className="mb-8">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Top Gainers <TrendingUp size={20} className="text-emerald-500" />
              </h3>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {topGainers.map(stock => (
                <motion.div 
                  key={stock.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addToRecentlyViewed(stock.id);
                    navigate(`/stock/${stock.id}`);
                  }}
                  className="min-w-[150px] bg-emerald-50 p-4 rounded-3xl border border-emerald-100 shadow-sm shadow-emerald-100/50"
                >
                   <span className="text-emerald-400 font-black text-[10px] uppercase block mb-1">{stock.symbol}</span>
                   <p className="font-black text-slate-900 truncate mb-1">{stock.name}</p>
                   <div className="text-lg font-black text-emerald-600 flex items-center gap-0.5">
                      +{stock.changePercent}%
                      <ArrowUpRight size={18} />
                   </div>
                   <div className="text-xs text-emerald-400 font-bold mt-1">₹{stock.price}</div>
                </motion.div>
              ))}
           </div>
        </section>
      )}

      {/* Stock List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-slate-900">All Stocks</h3>
          <Info size={16} className="text-slate-300" />
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {filteredStocks.map((stock, idx) => (
              <motion.div 
                key={stock.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                   addToRecentlyViewed(stock.id);
                   navigate(`/stock/${stock.id}`);
                }}
                className="card flex items-center justify-between p-5 cursor-pointer active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 ${stock.changePercent >= 0 ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-400 border-red-100'}`}>
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{stock.symbol}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase truncate max-w-[120px]">{stock.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-black text-lg text-slate-900">₹{stock.price}</div>
                  <div className={`text-sm font-bold flex items-center justify-end gap-1 ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    {stock.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredStocks.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center">
                <Search size={48} className="text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold text-lg">No matches found</p>
                <p className="text-slate-300">Try a different symbol or name</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
