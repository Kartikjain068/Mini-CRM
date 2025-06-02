const express = require("express");
const router = express.Router();
const { isLoggedIn } = require('../middleware/authmiddleware');

// This route simulates delivery receipt
router.post("/receipt", async (req, res) => {
  // You can add DB update logic here if needed
  console.log("📩 Delivery Receipt:", req.body);
  res.json({ received: true });
});

module.exports = router;
