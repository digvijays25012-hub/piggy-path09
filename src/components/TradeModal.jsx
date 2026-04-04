import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { X, CheckCircle2, Wallet, ShoppingCart, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TradeModal({ type, stock, holding, onClose }) {
  const [qty, setQty] = useState('');
  const [status, setStatus] = useState('input'); // input, processing, success, error
  const { balance, executeTrade, addTradeEvent } = useStore();

  const total = useMemo(() => {
    const q = parseFloat(qty) || 0;
    return q * stock.price;
  }, [qty, stock.price]);

  const isBuy = type.toUpperCase() === 'BUY';

  const canExecute = useMemo(() => {
    const q = parseFloat(qty) || 0;
    if (q <= 0) return false;
    if (isBuy) return total <= balance;
    if (!isBuy) return holding && q <= holding.quantity;
    return false;
  }, [isBuy, qty, total, balance, holding]);

  const handleExecute = async () => {
    setStatus('processing');
    await new Promise(r => setTimeout(r, 1500));
    
    const success = executeTrade(stock.id, type, parseFloat(qty), stock.price);
    
    if (success) {
      setStatus('success');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3772FF', '#45B26B', '#EF466F']
      });
      addTradeEvent?.(); 
      setTimeout(onClose, 2500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('input'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#141416]/90 backdrop-blur-md">
       <div className="bg-[#1F2128] border border-white/10 w-full max-w-sm rounded-[32px] shadow-premium overflow-hidden relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="p-8">
             <div className="flex items-center gap-3 mb-10">
                <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center shadow-glow ${isBuy ? 'bg-[#3772FF]/10 text-[#3772FF]' : 'bg-[#EF466F]/10 text-[#EF466F]'}`}>
                   {isBuy ? <ShoppingCart size={24} /> : <Tag size={24} />}
                </div>
                <div>
                   <h2 className="text-xl font-black text-white">{isBuy ? 'Buy stock' : 'Sell stock'}</h2>
                   <p className="text-[#777E90] font-bold text-xs uppercase tracking-widest">{stock.symbol}</p>
                </div>
             </div>

             {status === 'input' && (
               <div className="space-y-8">
                  <div className="bg-white/5 border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center gap-2 focus-within:ring-2 ring-[#3772FF]/50 transition-all">
                     <span className="text-[#777E90] font-black text-[10px] uppercase tracking-widest mb-1">Enter Shares Volume</span>
                     <input 
                       type="number" 
                       placeholder="0"
                       className="bg-transparent text-center text-4xl font-black text-white outline-none w-full placeholder:text-white/10"
                       autoFocus
                       value={qty}
                       onChange={(e) => setQty(e.target.value)}
                     />
                     <div className="text-[10px] text-[#777E90] font-black mt-2 flex items-center gap-2 uppercase tracking-widest">
                        <Wallet size={12} />
                        {isBuy ? (
                          <>Available: ₹{balance.toLocaleString()}</>
                        ) : (
                          <>Owned: {holding?.quantity || 0}</>
                        )}
                     </div>
                  </div>

                  <div className="flex justify-between items-center py-2 px-4">
                     <span className="text-[#777E90] font-bold text-xs">Total Order Value:</span>
                     <span className="text-2xl font-black text-white">₹{total.toLocaleString()}</span>
                  </div>

                  <button 
                    disabled={!canExecute}
                    onClick={handleExecute}
                    className={`w-full h-16 rounded-[22px] font-black text-lg transition-all shadow-glow ${canExecute ? 'bg-[#3772FF] text-white hover:bg-white hover:text-[#141416]' : 'bg-[#23262F] text-white/10'}`}
                  >
                     Confirm Order
                  </button>
               </div>
             )}

             {status === 'processing' && (
               <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-[#3772FF] border-t-transparent rounded-full animate-spin" />
                  <h3 className="text-lg font-black text-white leading-tight">Authenticating <br/> Order Block...</h3>
               </div>
             )}

             {status === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-[#45B26B]/10 rounded-full flex items-center justify-center text-[#45B26B] shadow-glow shadow-[#45B26B]/50">
                     <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Success!</h3>
                  <p className="text-[#45B26B] font-bold text-sm">Portfolio Balance Updated</p>
                </div>
             )}

             {status === 'error' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-[#EF466F]/10 rounded-full flex items-center justify-center text-[#EF466F]">
                     <X size={32} />
                  </div>
                  <h3 className="text-lg font-black text-white">Order Declined</h3>
                  <p className="text-[#EF466F] font-medium text-xs">Insufficient margin or liquidity</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
