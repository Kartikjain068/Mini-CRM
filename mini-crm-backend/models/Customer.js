const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,    // For new data
  mobile: String,   // For legacy data
  totalSpend: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  lastPurchase: Date,
  segmentTags: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
