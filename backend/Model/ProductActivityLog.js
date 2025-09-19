const mongoose = require("mongoose");

const productActivityLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  productName: { type: String }, // store name redundantly
  action: { type: String, enum: ["create", "update", "delete", "stock-adjustment"], required: true },
  reason: { type: String },
  at: { type: Date, default: Date.now },
  by: { type: String },
  changes: [
    {
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    },
  ],
  snapshot: { type: Object },
});


module.exports = mongoose.model("ProductActivityLog", productActivityLogSchema);


