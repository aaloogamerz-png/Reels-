// models/Reel.js
const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, default: '' },
  songName: { type: String, default: '' },
  videoPath: { type: String, required: true }, // relative path to /uploads
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // simple user ids or usernames
  comments: [
    {
      user: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Reel', ReelSchema);
