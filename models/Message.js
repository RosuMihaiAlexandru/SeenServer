const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
      _id: String,
      name: String
  }
});

module.exports = mongoose.model('Message', messageSchema);