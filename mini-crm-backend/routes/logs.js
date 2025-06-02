// routes/logs.js

const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");
const Customer = require("../models/Customer");
const Campaign = require("../models/Campaign");
const { isLoggedIn } = require('../middleware/authmiddleware');


// TEMP: Seed activity logs for all customers
router.post("/seed", async (req, res) => {
  try {
    const customers = await Customer.find();
    const campaigns = await Campaign.find();

    if (!customers.length || !campaigns.length) {
      return res.status(400).json({ error: "No customers or campaigns found to create logs." });
    }

    const logs = [];

    for (let i = 0; i < 10; i++) {
      const receipt = new Receipt({
        customerId: customers[Math.floor(Math.random() * customers.length)]._id,
        campaignId: campaigns[Math.floor(Math.random() * campaigns.length)]._id,
        status: Math.random() > 0.2 ? "SENT" : "FAILED"
      });

      await receipt.save();
      logs.push(receipt);
    }

    res.json({ message: "Logs seeded", data: logs });
  } catch (err) {
    console.error("Seeding logs failed:", err);  // Add this
    res.status(500).json({ error: "Failed to seed logs" });
  }
});


// Get logs by customerId (for timeline)
router.get("/customer/:customerId", async (req, res) => {
  try {
    const logs = await Receipt.find({ customerId: req.params.customerId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customer logs" });
  }
});

module.exports = router;
