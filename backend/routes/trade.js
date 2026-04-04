const express = require("express");
const { kite } = require("../kite");
const router = express.Router();

// PLACING REAL BUY ORDER
router.post("/buy", async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    const order = await kite.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol: symbol,
      transaction_type: "BUY",
      quantity: parseInt(quantity),
      product: "CNC", // Cash & Carry (Investment)
      order_type: "MARKET"
    });

    res.json({ success: true, orderId: order.order_id });
  } catch (err) {
    console.error("Buy Order Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PLACING REAL SELL ORDER
router.post("/sell", async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    const order = await kite.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol: symbol,
      transaction_type: "SELL",
      quantity: parseInt(quantity),
      product: "CNC",
      order_type: "MARKET"
    });

    res.json({ success: true, orderId: order.order_id });
  } catch (err) {
    console.error("Sell Order Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
