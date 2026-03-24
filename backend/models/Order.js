const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String },                // Added: sent by useStore
  customerName: { type: String },          // Used by MyOrders & LiveKitchen filters
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  shopName: { type: String },              // Used for LiveKitchen filtering
  // FIX: Added 'sent' was being used but was not in enum — replaced with 'pending' as default
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);