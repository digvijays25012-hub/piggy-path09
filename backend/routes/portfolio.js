const express = require("express");
const { kite } = require("../kite");
const router = express.Router();

// GET REAL HOLDINGS
router.get("/holdings", async (req, res) => {
  try {
    const holdings = await kite.getHoldings();
    res.json(holdings);
  } catch (err) {
    console.error("Holdings Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET REAL POSITIONS (Intraday)
router.get("/positions", async (req, res) => {
  try {
    const positions = await kite.getPositions();
    res.json(positions);
  } catch (err) {
    console.error("Positions Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
