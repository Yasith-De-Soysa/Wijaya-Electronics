const mongoose = require('mongoose');

const stockAdjustmentLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  type: { type: String, enum: ['add', 'remove'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  at: { type: Date, default: Date.now },
  by: { type: String }, // optional: req.user?.name
});

module.exports = mongoose.model('StockAdjustmentLog', stockAdjustmentLogSchema);
