const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const tradeRoutes = require("./routes/trade");
const portfolioRoutes = require("./routes/portfolio");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/trade", tradeRoutes);
app.use("/portfolio", portfolioRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Trading Server Running on Port ${PORT}`));
