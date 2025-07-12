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

// Confirm startup
console.log("👣 Starting ShruggBot server...");

// Rate limiter
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use('/api/shrugg', shruggLimiter);

// Dummy API route
app.post('/api/shrugg', async (req, res) => {
  try {
    const { text, mode, tones } = req.body;
    res.json({
      reaction: `Shrugging at: ${text}`,
      score: Math.floor(Math.random() * 10) + 1,
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Something broke.' });
  }
});

// Serve React from build
const reactBuildPath = path.join(__dirname, '..', 'shruggbot-ui', 'build');
console.log("📂 React build path:", reactBuildPath);

app.use(express.static(reactBuildPath));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Debug: verify index.html exists
app.get('/debug-index', (req, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  const exists = fs.existsSync(indexPath);
  res.send(`index.html exists: ${exists}`);
});

// Catch-all: serve React app
app.get('/*', (req, res) => {
  const indexFile = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    console.log("✅ Serving React app...");
    res.sendFile(indexFile);
  } else {
    console.error("❌ index.html not found!");
    res.status(500).send('index.html not found.');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});
