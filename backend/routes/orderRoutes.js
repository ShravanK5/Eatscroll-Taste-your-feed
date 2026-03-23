const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// NEW: Create an order (This connects the Button to the Database)
router.post('/', async (req, res) => {
  try {
    const { userId, shopId, itemName, price, status } = req.body;
    const newOrder = new Order({
      userId,
      shopId,
      itemName,
      price,
      status: status || 'sent'
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Backend Post Error:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
// Add this above your GET route in orderRoutes.js
router.post('/', async (req, res) => {
  try {
    const { userId, shopId, itemName, price } = req.body;
    const newOrder = new Order({
      userId,
      shopId,
      itemName,
      price,
      status: 'sent' // Default status so it shows up in "My Orders"
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order to database' });
  }
});
// 1. GET all orders
router.get('/', async (req, res) => {
  try {
    // Fetches all and sorts by newest first
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 2. UPDATE order status (Matches the Dashboard fetch call)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 3. DELETE an order (The "Chef POV" delete option)
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;