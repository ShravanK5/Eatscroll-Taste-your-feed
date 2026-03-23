require('dotenv').config(); // 👈 Add this line first!
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'foodreels',
    resource_type: 'video', 
    allowed_formats: ['mp4', 'mov', 'webm'],
  },
});

const upload = multer({ storage: storage });

// 🚨 THIS IS THE CRITICAL PART
module.exports = upload;