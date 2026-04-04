import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import StockDetail from './pages/StockDetail';

export default function App() {
  const { user, updateStockPrices } = useStore();

  // Simulate real-time market updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateStockPrices();
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [updateStockPrices]);

  return (
    <Router>
        {!user ? (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
       ) : (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trade" element={<Navigate to="/markets" replace />} />
              <Route path="/stock/:id" element={<StockDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
       )}
    </Router>
  );
}
