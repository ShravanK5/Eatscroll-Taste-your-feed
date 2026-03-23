const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will encrypt this later!
  role: { type: String, enum: ['customer', 'owner'], required: true },
  shopName: { type: String } // Only required if they are an owner
});

module.exports = mongoose.model('User', userSchema);