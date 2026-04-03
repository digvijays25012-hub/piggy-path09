import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      // Trigger mascot animation
      window.dispatchEvent(new CustomEvent('tradeSuccess'));
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF']
      });
      addTradeEvent?.(); 
      setTimeout(onClose, 2500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('input'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0.9, opacity: 0 }}
         className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative"
       >
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>

          <div className="p-8">
             <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isBuy ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-slate-50 text-slate-400 shadow-slate-100'}`}>
                   {isBuy ? <ShoppingCart size={24} /> : <Tag size={24} />}
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-900">{isBuy ? 'Buy stock' : 'Sell stock'}</h2>
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{stock.symbol}</p>
                </div>
             </div>

             <AnimatePresence mode="wait">
                {status === 'input' && (
                  <motion.div 
                    key="input-view"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                   >
                     {/* Quantity Input */}
                     <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 border border-slate-100 ring-2 ring-transparent focus-within:ring-red-100 transition-all">
                        <span className="text-slate-400 font-bold text-xs uppercase mb-1">ENTER QUANTITY</span>
                        <input 
                          type="number" 
                          placeholder="0"
                          className="bg-transparent text-center text-4xl font-black text-slate-900 outline-none w-full"
                          autoFocus
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        />
                        <div className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-1">
                           <Wallet size={12} />
                           {isBuy ? (
                             <>AVL. BALANCE: ₹{balance.toLocaleString()}</>
                           ) : (
                             <>SHARES OWNED: {holding?.quantity || 0}</>
                           )}
                        </div>
                     </div>

                     {/* Summary */}
                     <div className="flex justify-between items-center py-2 px-4">
                        <span className="text-slate-400 font-bold text-sm">TOTAL {isBuy ? 'COST' : 'RECEIVE'}:</span>
                        <span className="text-2xl font-black text-slate-900">₹{total.toLocaleString()}</span>
                     </div>

                     {/* Execute Button */}
                     <button 
                       disabled={!canExecute}
                       onClick={handleExecute}
                       className={`w-full h-16 rounded-2xl font-black text-lg transition-all shadow-xl ${canExecute ? 'bg-[#FF6B6B] text-white shadow-red-200' : 'bg-slate-100 text-slate-300'}`}
                     >
                        Confirm {type.toLowerCase()} order
                     </button>
                  </motion.div>
                )}

                {status === 'processing' && (
                  <motion.div 
                    key="processing"
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                     <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                     <h3 className="text-lg font-black text-slate-900">Processing order...</h3>
                     <p className="text-slate-400 font-bold text-sm">Validating with market engine</p>
                  </motion.div>
                )}

                {status === 'success' && (
                   <motion.div 
                    key="success"
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                   >
                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-50">
                        <CheckCircle2 size={48} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900">Transaction Success!</h3>
                     <p className="text-emerald-500 font-bold">Your portfolio has been updated</p>
                   </motion.div>
                )}

                {status === 'error' && (
                   <motion.div 
                    key="error"
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                   >
                     <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <X size={32} />
                     </div>
                     <h3 className="text-lg font-black text-slate-900">Order Failed</h3>
                     <p className="text-red-400 font-medium">Insufficient balance or quantity</p>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </motion.div>
    </div>
  );
}
