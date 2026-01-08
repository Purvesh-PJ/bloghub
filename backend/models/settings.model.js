const mongoose = require('mongoose');

const settignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Setting', settignSchema);
