const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const Order = require('./models/Order');
const authRoutes = require('./routes/authRoutes');
const reelRoutes = require('./routes/reelRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB Successfully!'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('FoodReels Backend is LIVE!');
});

io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('place-order', async (orderData) => {
    try {
      const newOrder = new Order(orderData);
      await newOrder.save();
      io.emit('incoming-order', newOrder);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  });

  socket.on('update-status', (data) => {
    io.emit('status-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected');
  });
});

// FIX: was hardcoded to 5001 — this breaks deployment on Render/Railway/Heroku
//      which inject their own PORT via environment variable.
//      process.env.PORT || 5001 works in both local dev AND production.
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});