const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Init app
const app = express();
app.use(express.json());
app.use(cors());

// Rate limit API
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use('/api/shrugg', shruggLimiter);

// Dummy API handler (replace with your logic)
app.post('/api/shrugg', async (req, res) => {
  try {
    const { text, mode, tones } = req.body;
    res.json({
      reaction: `Shrugging at: ${text}`,
      score: Math.floor(Math.random() * 10) + 1,
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Something broke.' });
  }
});

// Serve React static files
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Health check (for Railway)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Debug route to verify index.html is found
app.get('/debug-index', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  const exists = fs.existsSync(indexPath);
  res.send(`index.html exists: ${exists}`);
});

// Catch-all: serve React app
app.get('/*', (req, res) => {
  const indexFile = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(500).send('index.html not found.');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});
