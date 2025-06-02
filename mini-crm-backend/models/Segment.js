const mongoose = require("mongoose");

const SegmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: [
    {
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Segment", SegmentSchema);
