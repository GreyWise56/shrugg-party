const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Confirm startup
console.log("👣 Starting ShruggBot server...");

// API rate limiting
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests
});
app.use('/api/shrugg', shruggLimiter);

// Dummy API route (replace with real logic later)
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

// Serve React static files
const reactBuildPath = path.join(__dirname, '..', 'shruggbot-ui', 'build');
console.log("📂 React build path:", reactBuildPath);
app.use(express.static(reactBuildPath));

// Serve static assets from React
app.use('/static', express.static(path.join(reactBuildPath, 'static')));

// Health check route (for Railway)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Debug route to confirm index.html exists
app.get('/debug-index', (req, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  const exists = fs.existsSync(indexPath);
  res.send(`index.html exists: ${exists}`);
});

// Catch-all route to serve React frontend
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
