const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Models & Routes
const Order = require('./models/Order');
const authRoutes = require('./routes/authRoutes');
const reelRoutes = require('./routes/reelRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const httpServer = createServer(app);

// 1. FIXED CORS: Combined both your manual config and the permissive one
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());

// 2. Setup WebSockets
const io = new Server(httpServer, {
  cors: {
    origin: "*", // More permissive for development
    methods: ["GET", "POST"]
  }
});

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connected to MongoDB Successfully!'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// 4. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/orders', orderRoutes);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('FoodReels Backend is LIVE!');
});

// 5. Live Order Engine (WebSockets)
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

// 6. PORT MATCHING: Set this to 5001 to match your Landing.jsx!
const PORT = 5001; 

httpServer.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});