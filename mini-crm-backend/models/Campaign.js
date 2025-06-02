const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  message: String,
  segmentId: String,
  segmentName: String,
  audienceSize: Number,
  sent: Number,
  failed: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
