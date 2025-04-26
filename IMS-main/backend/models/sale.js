const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  itemName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Sale", saleSchema);