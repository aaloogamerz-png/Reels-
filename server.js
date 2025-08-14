// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const Reel = require('./models/Reel');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MONGODB CONNECTION ---
// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/reelsdb';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB err', err));

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.random().toString(36).substring(2,8);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- API: upload a reel ---
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    const { username, description, songName } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Video required' });
    const videoPath = `/uploads/${req.file.filename}`;
    const reel = new Reel({ username, description, songName, videoPath });
    await reel.save();
    res.json({ success: true, reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- API: get reels (paginated) ---
app.get('/api/reels', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 3); // per page
    const skip = (page - 1) * limit;

    const reels = await Reel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Reel.countDocuments();
    res.json({ reels, page, limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- API: like/unlike ---
app.post('/api/reels/:id/like', async (req, res) => {
  try {
    const { userId } = req.body; // simple username or id
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Not found' });

    const idx = reel.likedBy.indexOf(userId);
    if (idx === -1) {
      reel.likedBy.push(userId);
      reel.likes = reel.likedBy.length;
    } else {
      reel.likedBy.splice(idx, 1);
      reel.likes = reel.likedBy.length;
    }
    await reel.save();
    res.json({ likes: reel.likes, liked: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- API: comment ---
app.post('/api/reels/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Not found' });
    reel.comments.push({ user, text });
    await reel.save();
    res.json({ success: true, comments: reel.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// fallback to index
app.get('*', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
