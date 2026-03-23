const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
// Since we exported 'upload' directly, we import it directly
const upload = require('../config/cloudinary');


// @route   POST /api/reels/upload
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    // CRITICAL: Log this to your terminal to see if data is missing
    console.log("--- New Upload Attempt ---");
    console.log("Body:", req.body);
    console.log("File:", req.file ? "Video Received ✅" : "No Video ❌");

    // We check for multiple possible names (itemName vs title) to prevent 400 errors
    const { 
      itemName, title, 
      shopOwner, ownerId, 
      price, description, shopName 
    } = req.body;

    // Validate required fields manually before Mongoose does
    if (!req.file) return res.status(400).json({ error: "Video file is required" });
    if (!itemName && !title) return res.status(400).json({ error: "Item name/Title is required" });
    if (!shopOwner && !ownerId) return res.status(400).json({ error: "Shop Owner ID is required" });

    const newReel = new Reel({
      videoUrl: req.file.path,
      itemName: itemName || title,
      shopOwner: shopOwner || ownerId,
      shopName: shopName || "Unknown Kitchen",
      price: price || 0,
      description: description || ""
    });

    const savedReel = await newReel.save();
    console.log("Reel Saved Successfully! 🎉");
    res.status(201).json(savedReel);
  } catch (error) {
    console.error("Upload Error Details:", error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;