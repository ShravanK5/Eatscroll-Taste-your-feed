const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');
const upload = require('../config/cloudinary');

// UPLOAD VIDEO
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { itemName, shopOwner, shopName, price, description } = req.body;

    const newReel = new Reel({
      videoUrl: req.file.path,
      itemName,
      shopOwner,
      shopName,
      price,
      description
    });

    const saved = await newReel.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET REELS
router.get('/', async (req, res) => {
  const reels = await Reel.find().sort({ createdAt: -1 });
  res.json(reels);
});

// LIKE
router.patch('/like/:id', async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  reel.likes += 1;
  await reel.save();
  res.json(reel);
});

module.exports = router;