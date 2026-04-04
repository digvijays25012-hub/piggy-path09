import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../api';

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
      // --- LIVE BROKERAGE STATE ---
      user: null,
      isLoggedIn: false,
      balance: 100000,
      portfolio: [], // Array of { stockId, quantity, avgPrice }
      trades: [],    // Array of { id, stockId, type, quantity, price, total, timestamp }
      stocks: INITIAL_STOCKS,
      recentlyViewed: [],
      
      // REAL DATA FROM ZERODHA
      realHoldings: [],
      realProfit: 0,

      // --- AUTH MODULE (Zerodha-Ready) ---
      login: async (phone) => {
        // Redirection logic to Zerodha will happen in UI component
        set({ user: { phone, name: 'Trader' }, isLoggedIn: true });
      },
      logout: () => set({ user: null, isLoggedIn: false }),

      // --- SYNC BROKERAGE DATA ---
      syncBrokerageData: async () => {
        try {
          const holdings = await api.fetchHoldings();
          let totalPnl = 0;
          holdings.forEach(h => totalPnl += h.pnl);

          set({ 
             realHoldings: holdings, 
             realProfit: totalPnl 
          });
        } catch (err) {
          console.error("Broker Sync Failed", err);
        }
      },

      // --- LIVE TRADING (Kite Integrated) ---
      executeTrade: async (stockId, type, quantity, price) => {
        const symbol = get().stocks.find(s => s.id === stockId)?.symbol;
        if (!symbol) return false;

        try {
          const order = type === 'BUY' 
            ? await api.placeBuyOrder(symbol, quantity)
            : await api.placeSellOrder(symbol, quantity);

          if (order.success) {
            await get().syncBrokerageData();
            return true;
          }
        } catch (err) {
          console.error("Live Trade Failed", err);
        }
        return false;
      },

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
      }
    }),
    {
      name: 'piggy-path-v3-real-trading',
    }
  )
);

