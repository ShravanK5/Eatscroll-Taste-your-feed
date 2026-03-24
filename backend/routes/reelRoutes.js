const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const upload = require('../config/cloudinary');

// @route POST /api/reels/upload  — multipart video upload (used by UploadReel.jsx)
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    console.log("--- New Upload Attempt ---");
    console.log("Body:", req.body);
    console.log("File:", req.file ? "Video Received ✅" : "No Video ❌");

    const { itemName, title, shopOwner, ownerId, price, description, shopName } = req.body;

    if (!req.file) return res.status(400).json({ error: "Video file is required" });
    if (!itemName && !title) return res.status(400).json({ error: "Item name is required" });
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

// FIX: Added /upload-url route for OwnerUpload.jsx which submits a video URL
//      (not a file). Without this route, OwnerUpload's POST hit a 404 silently.
router.post('/upload-url', async (req, res) => {
  try {
    const { itemName, shopOwner, shopName, price, description, videoUrl } = req.body;

    if (!videoUrl) return res.status(400).json({ error: "videoUrl is required" });
    if (!itemName) return res.status(400).json({ error: "itemName is required" });
    if (!shopOwner) return res.status(400).json({ error: "shopOwner is required" });

    const newReel = new Reel({
      videoUrl,
      itemName,
      shopOwner,
      shopName: shopName || "Unknown Kitchen",
      price: price || 0,
      description: description || ""
    });

    const savedReel = await newReel.save();
    res.status(201).json(savedReel);
  } catch (error) {
    console.error("Upload-URL Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// @route GET /api/reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;