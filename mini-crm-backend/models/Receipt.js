const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },
  status: {
    type: String,
    enum: ["SENT", "FAILED"],
    default: "SENT"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Receipt", receiptSchema);
