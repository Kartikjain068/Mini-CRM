// models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  status: String, // SENT or FAILED
  message: String,
  segmentId: String,
  segmentName: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
