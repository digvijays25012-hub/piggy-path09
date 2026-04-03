import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Info, ShoppingCart } from 'lucide-react';
import LightweightChart from '../components/LightweightChart';
import TradeModal from '../components/TradeModal';

export default function StockDetail() {
  const { id } = useParams();
  const { stocks, portfolio } = useStore();
  const navigate = useNavigate();
  const stock = useMemo(() => stocks.find(s => s.id === id), [stocks, id]);
  const holding = useMemo(() => portfolio.find(p => p.stockId === id), [portfolio, id]);

  const [tradeType, setTradeType] = useState(null);
  const addToRecentlyViewed = useStore(state => state.addToRecentlyViewed);

  useEffect(() => {
    if (id) addToRecentlyViewed(id);
  }, [id, addToRecentlyViewed]);

  if (!stock) return <div className="p-10 text-center font-bold text-slate-400">Stock not found</div>;

  return (
    <div className="pb-32 px-6 pt-16 bg-white min-h-screen max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">{stock.name}</h1>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stock.symbol}</span>
        </div>
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
          <Info size={20} />
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-10 text-center">
        <div className="text-4xl font-bold text-slate-900 mb-2">₹{stock.price.toLocaleString()}</div>
        <div className={`text-md font-bold flex items-center justify-center gap-1 ${stock.changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {stock.changePercent >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
          <span className="text-slate-300 font-bold ml-1">Today</span>
        </div>
      </div>

      {/* Chart Section */}
      <section className="mb-10 bg-slate-50 rounded-[32px] p-6 border border-slate-100 overflow-hidden">
         <LightweightChart data={stock.history} color={stock.changePercent >= 0 ? '#10b981' : '#ef4444'} />
      </section>

      {/* Stats/Position */}
      {holding && (
        <section className="mb-10 bg-slate-50 rounded-[32px] p-6 border border-slate-100">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Your Position</h3>
           <div className="grid grid-cols-2 gap-8">
              <div>
                 <span className="text-[10px] text-slate-300 font-bold uppercase mb-1 block">Shares</span>
                 <p className="font-bold text-slate-900">{holding.quantity}</p>
              </div>
              <div>
                 <span className="text-[10px] text-slate-300 font-bold uppercase mb-1 block">Avg Price</span>
                 <p className="font-bold text-slate-900">₹{holding.avgPrice.toFixed(2)}</p>
              </div>
              <div>
                 <span className="text-[10px] text-slate-300 font-bold uppercase mb-1 block">Current Value</span>
                 <p className="font-bold text-slate-900">₹{(stock.price * holding.quantity).toLocaleString()}</p>
              </div>
              <div>
                 <span className="text-[10px] text-slate-300 font-bold uppercase mb-1 block">P/L</span>
                 <p className={`font-bold ${(stock.price - holding.avgPrice) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                   ₹{((stock.price - holding.avgPrice) * holding.quantity).toFixed(2)}
                 </p>
              </div>
           </div>
        </section>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-10 left-6 right-6 max-w-md mx-auto grid grid-cols-2 gap-4 z-40 bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200">
         <button 
           onClick={() => setTradeType('sell')}
           className="h-14 font-bold text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 active:bg-slate-100 transition-colors uppercase tracking-widest text-xs"
         >
           Sell
         </button>
         <button 
            onClick={() => setTradeType('buy')}
            className="btn-primary h-14 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
         >
           <ShoppingCart size={18} />
           Buy Now
         </button>
      </div>

      {tradeType && (
        <TradeModal 
          stock={stock} 
          type={tradeType} 
          onClose={() => setTradeType(null)} 
        />
      )}
    </div>
  );
}
