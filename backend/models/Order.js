const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  itemName: String,
  price: Number,
  shopName: String,
  // 🎯 DEFAULT STATUS IS PENDING
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'ready', 'delivered'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);