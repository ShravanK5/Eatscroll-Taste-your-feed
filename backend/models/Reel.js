const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  shopOwner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // This links the Reel to a specific User (the owner)
    required: true 
  },
  shopName: {
    type: String,
    required: true
  },
  itemName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  videoUrl: { 
    type: String, 
    required: true // They MUST upload a video to create a Reel
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);