const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require("../middleware/auth");

// CREATE ORDER
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shopName } = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      customerName: req.user.name,
      shopName,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();

    req.app.get("io").emit("new-order", savedOrder);

    res.status(201).json(savedOrder);

  } catch (err) {
    res.status(500).json({ error: "Order failed" });
  }
});

// GET ORDERS
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// UPDATE STATUS
router.patch('/:id', async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(updated);
});
// DELETE ORDER
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;