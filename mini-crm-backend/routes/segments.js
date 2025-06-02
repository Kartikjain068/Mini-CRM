const express = require("express");
const router = express.Router();
const Segment = require("../models/Segment");
const Customer = require("../models/Customer");
const { isLoggedIn } = require('../middleware/authmiddleware');

// Create segment
router.post("/", async (req, res) => {
  try {
    const newSegment = new Segment(req.body);
    const saved = await newSegment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save segment" });
  }
});

// Get all segments
router.get("/", async (req, res) => {
  try {
    const segments = await Segment.find().sort({ createdAt: -1 });
    res.json(segments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch segments" });
  }
});

// Update segment
router.put("/:id", async (req, res) => {
  try {
    const { name, rules } = req.body;
    const updatedSegment = await Segment.findByIdAndUpdate(
      req.params.id,
      { name, rules },
      { new: true }
    );
    if (!updatedSegment) {
      return res.status(404).json({ message: "Segment not found" });
    }
    res.json(updatedSegment);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete segment
router.delete("/:id", async (req, res) => {
  try {
    const deletedSegment = await Segment.findByIdAndDelete(req.params.id);
    if (!deletedSegment) {
      return res.status(404).json({ message: "Segment not found" });
    }
    res.json({ message: "Segment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Apply segment rules to customers
router.put("/apply/:id", async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) return res.status(404).json({ error: "Segment not found" });

    const query = buildMongoQuery(segment.rules);
    const matchingCustomers = await Customer.find(query);

    // Add segment tag to matched customers
    await Promise.all(
      matchingCustomers.map((cust) => {
        if (!cust.segmentTags.includes(segment.name)) {
          cust.segmentTags.push(segment.name);
          return cust.save();
        }
      })
    );

    res.json({
      message: "Segment applied successfully",
      matchedCount: matchingCustomers.length,
    });
  } catch (error) {
    console.error("Error applying segment:", error);
    res.status(500).json({ error: "Failed to apply segment" });
  }
});
router.post("/:id/apply", async (req, res) => {
  const segment = await Segment.findById(req.params.id);
  if (!segment) return res.status(404).json({ error: "Segment not found" });

  const query = buildMongoQuery(segment.rules);
  const matchingCustomers = await Customer.find(query);

  await Promise.all(
    matchingCustomers.map((cust) => {
      if (!cust.segmentTags.includes(segment.name)) {
        cust.segmentTags.push(segment.name);
        return cust.save();
      }
    })
  );

  res.json({ message: "Segment applied", matchedCount: matchingCustomers.length });
});


function buildMongoQuery(rules) {
  const query = {};
  rules.forEach(rule => {
    const fieldMap = {
      spend: "totalSpend",
      visits: "visitCount",
      lastActive: "lastPurchase"
    };

    const field = fieldMap[rule.field];
    const operator = rule.operator;
    const value = Number(rule.value);

    if (!field) return;

    if (field === "lastPurchase") {
      const date = new Date();
      date.setDate(date.getDate() - value);
      query[field] = {
        ...(query[field] || {}),
        [operator === ">" ? "$lt" : operator === "<" ? "$gt" : "$eq"]: date
      };
    } else {
      query[field] = {
        ...(query[field] || {}),
        [operator === ">" ? "$gt" : operator === "<" ? "$lt" : "$eq"]: value
      };
    }
  });
  return query;
}
// In your segments router
router.get("/count", async (req, res) => {
  try {
    const count = await Segment.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get segment count" });
  }
});

router.post('/', isLoggedIn, async (req, res) => {
  try {
    const segment = new Segment(req.body);
    await segment.save();
    res.json(segment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
