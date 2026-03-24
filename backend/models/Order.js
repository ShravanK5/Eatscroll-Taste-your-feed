const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  customerName: String,
  shopName: String,

  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);