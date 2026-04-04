const { KiteConnect } = require("kiteconnect");
require("dotenv").config();

const kite = new KiteConnect({
  api_key: process.env.KITE_API_KEY
});

module.exports = { kite };
