const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  msgType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  text: String,
  mediaPath: String,
  duration: String,
  user: {
      _id: String,
      name: String
  }
});

module.exports = mongoose.model('Message', messageSchema);