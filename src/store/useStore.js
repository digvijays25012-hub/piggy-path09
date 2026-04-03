import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_STOCKS = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, changePercent: 1.25, history: [] },
  { id: '2', symbol: 'MSFT', name: 'Microsoft', price: 405.32, changePercent: -0.45, history: [] },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 147.12, changePercent: 0.85, history: [] },
  { id: '4', symbol: 'AMZN', name: 'Amazon.com', price: 174.42, changePercent: -1.15, history: [] },
  { id: '5', symbol: 'TSLA', name: 'Tesla, Inc.', price: 175.34, changePercent: -2.35, history: [] },
  { id: '6', symbol: 'META', name: 'Meta Platforms', price: 494.31, changePercent: 1.65, history: [] },
  { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.28, changePercent: 3.45, history: [] },
  { id: '8', symbol: 'NFLX', name: 'Netflix', price: 628.44, changePercent: 0.15, history: [] },
];

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      balance: 100000,
      portfolio: [],
      stocks: INITIAL_STOCKS,
      recentlyViewed: [],
      trades: [],
      tradeEventCount: 0,

      login: (phone) => set({ user: { id: 'user_1', phone, isLoggedIn: true } }),
      logout: () => set({ user: null }),

      addTradeEvent: () => set((state) => ({ tradeEventCount: state.tradeEventCount + 1 })),

      updateStockPrices: () => {
        set((state) => ({
          stocks: state.stocks.map((stock) => {
            const fluctuation = (Math.random() - 0.5) * 2;
            const newPrice = Math.max(1, stock.price + fluctuation);
            const newHistory = [...stock.history, { time: Date.now(), value: newPrice }].slice(-50);
            return {
              ...stock,
              price: Number(newPrice.toFixed(2)),
              changePercent: Number((((newPrice - stock.price) / stock.price) * 100).toFixed(2)),
              history: newHistory,
            };
          }),
        }));
      },

      addToRecentlyViewed: (stockId) => {
        set((state) => ({
          recentlyViewed: [stockId, ...state.recentlyViewed.filter(id => id !== stockId)].slice(0, 5)
        }));
      },

      executeTrade: (stockId, type, quantity, price) => {
        const { balance, portfolio, trades } = get();
        const totalCost = quantity * price;

        if (type === 'BUY') {
          if (balance < totalCost) return false;
          
          const existing = portfolio.find(p => p.stockId === stockId);
          let newPortfolio;
          if (existing) {
            const newQty = existing.quantity + quantity;
            const newAvgPrice = (existing.avgPrice * existing.quantity + totalCost) / newQty;
            newPortfolio = portfolio.map(p => p.stockId === stockId ? { ...p, quantity: newQty, avgPrice: newAvgPrice } : p);
          } else {
            newPortfolio = [...portfolio, { stockId, quantity, avgPrice: price }];
          }

          set({
            balance: balance - totalCost,
            portfolio: newPortfolio,
            trades: [{ stockId, type, quantity, price, timestamp: Date.now() }, ...trades]
          });
          return true;
        } else if (type === 'SELL') {
          const existing = portfolio.find(p => p.stockId === stockId);
          if (!existing || existing.quantity < quantity) return false;

          let newPortfolio = portfolio.map(p => 
            p.stockId === stockId ? { ...p, quantity: p.quantity - quantity } : p
          ).filter(p => p.quantity > 0);

          set({
            balance: balance + totalCost,
            portfolio: newPortfolio,
            trades: [{ stockId, type, quantity, price, timestamp: Date.now() }, ...trades]
          });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'piggy-path-storage',
    }
  )
);
