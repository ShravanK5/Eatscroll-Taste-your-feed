require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const reelRoutes = require("./routes/reelRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.set("io", io);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// SOCKET
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});