const BASE = "http://localhost:5001";

// 1. ZERODHA AUTHENTICATION
export const getZerodhaLoginUrl = async () => {
  const res = await fetch(`${BASE}/auth/login`);
  const data = await res.json();
  return data.url;
};

// 2. LIVE ORDER EXECUTION
export const placeBuyOrder = async (symbol, quantity) => {
  const res = await fetch(`${BASE}/trade/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, quantity })
  });
  return res.json();
};

export const placeSellOrder = async (symbol, quantity) => {
  const res = await fetch(`${BASE}/trade/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, quantity })
  });
  return res.json();
};

// 3. PORTFOLIO DATA SYNC
export const fetchHoldings = async () => {
  const res = await fetch(`${BASE}/portfolio/holdings`);
  return res.json();
};

export const fetchPositions = async () => {
  const res = await fetch(`${BASE}/portfolio/positions`);
  return res.json();
};
