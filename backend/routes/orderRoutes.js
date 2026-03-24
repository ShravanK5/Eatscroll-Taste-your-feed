const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// FIX 1: REMOVED the duplicate router.post('/') — Express only runs the FIRST match,
//         so the second one was completely dead code and caused confusion.
// FIX 2: Field names now match the Order schema AND what useStore.js sends.
// FIX 3: Status defaults to 'pending' — 'sent' was NOT in the enum and caused a
//         Mongoose ValidationError on every single order placement.

// CREATE an order
router.post('/', async (req, res) => {
  try {
    const { userId, customerName, shopName, itemName, price } = req.body;
    const newOrder = new Order({
      userId,
      customerName,
      shopName,
      itemName,
      price,
      status: 'pending'   // was 'sent' — invalid enum value, now fixed
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Backend Post Error:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET all orders (sorted newest first)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// UPDATE order status
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

// DELETE an order
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