const express = require("express");
const router = express.Router();
const CommunicationLog = require("../models/CommunicationLog");
const { isLoggedIn } = require('../middleware/authmiddleware');

router.post("/delivery-receipt", async (req, res) => {
  const { customerId, segmentId, message, status } = req.body;

  const log = new CommunicationLog({
    customerId,
    segmentId,
    message,
    status,
  });

  await log.save();

  res.json({ success: true });
});

module.exports = router;
