const express = require("express");
const { kite } = require("../kite");
const router = express.Router();

let accessToken = "";

router.get("/login", (req, res) => {
  // Generate the Zerodha Login URL
  const url = kite.getLoginURL();
  res.json({ url });
});

router.get("/callback", async (req, res) => {
  try {
    const { request_token } = req.query;
    
    // Exchange request_token for a long-lived access_token
    const response = await kite.generateSession(
      request_token,
      process.env.KITE_API_SECRET
    );

    accessToken = response.access_token;
    kite.setAccessToken(accessToken);

    console.log("Successfully logged into Zerodha.");
    // Redirect back to your frontend dashboard
    res.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.error("Auth Callback failed:", err.message);
    res.status(500).json({ error: "Brokerage Authentication Failed." });
  }
});

module.exports = router;
