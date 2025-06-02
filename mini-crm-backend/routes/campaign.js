const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const Segment = require("../models/Segment");
const axios = require("axios");
const { isLoggedIn } = require('../middleware/authmiddleware');
// const CommunicationLog = require('../models/CommunicationLog');


// Launch campaign
router.post("/", async (req, res) => {
  const { message, segmentId } = req.body;
  const segment = await Segment.findById(segmentId);
  if (!segment) return res.status(400).json({ error: "Segment not found" });

  const query = segment.rules.reduce((acc, rule) => {
    const { field, operator, value } = rule;
    const condition =
      operator === ">"
        ? { [field]: { $gt: value } }
        : operator === "<"
        ? { [field]: { $lt: value } }
        : { [field]: value };
    acc.push(condition);
    return acc;
  }, []);

  const customers = await Customer.find({ $and: query });

  let sent = 0;
  let failed = 0;

  for (const customer of customers) {
    const success = Math.random() < 0.9;

    await axios.post("http://localhost:5000/api/vendor/receipt", {
      customerId: customer._id,
      status: success ? "SENT" : "FAILED",
      message,
      segmentId,
    });

    success ? sent++ : failed++;
  }

  await Campaign.create({
    message,
    segmentName: segment.name,
    segmentId,
    audienceSize: customers.length,
    sent,
    failed,
  });

  res.json({ status: "Campaign Launched", sent, failed });
});

// Fetch campaigns
router.get("/", async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.json(campaigns);
});

// In campaigns route
router.get("/count", async (req, res) => {
  try {
    const count = await Campaign.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get campaign count" });
  }
});
    
// GET /api/campaigns/logs
router.get('/logs', async (req, res) => {
  try {
    const { segmentId, startDate, endDate } = req.query;

    const filter = {};

    if (segmentId) {
      // Find customers in the segment
      const segment = await Segment.findById(segmentId);
      if (segment) {
        const rules = segment.rules;
        const conditions = rules.map(rule => ({ [rule.field]: rule.value }));
        const customers = await Customer.find({ $and: conditions }, '_id');
        filter.customerId = { $in: customers.map(c => c._id) };
      }
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // const logs = await CommunicationLog.find(filter);
    res.json({ logs });
  } catch (err) {
    console.error("Error fetching campaign logs:", err);
    res.status(500).json({ error: "Failed to fetch campaign logs" });
  }
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
