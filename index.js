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

console.log("👣 Starting ShruggBot server...");

// Rate limit for API
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use('/api/shrugg', shruggLimiter);

// Dummy API handler
app.post('/api/shrugg', async (req, res) => {
  const { text } = req.body;
  res.json({
    reaction: `Shrugging at: ${text}`,
    score: Math.floor(Math.random() * 10) + 1,
  });
});

// React static files
const reactBuildPath = path.join(__dirname, 'shruggbot-ui', 'build');
console.log("📂 React build path:", reactBuildPath);
console.log("📁 React build exists?", fs.existsSync(reactBuildPath));
console.log("🔍 Current working directory:", process.cwd());
console.log("🗂 __dirname:", __dirname);

app.use(express.static(reactBuildPath));

// Health check route
app.get('/health', (_, res) => res.status(200).send('OK'));

// Debug route to check for index.html
app.get('/debug-index', (_, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  const exists = fs.existsSync(indexPath);
  res.send(`index.html exists: ${exists}`);
});

// ✅ Fallback GET / route to prevent Railway 502
app.get('/', (_, res) => {
  res.send('ShruggBot backend is running!');
});

// Catch-all: serve React frontend
app.get('*', (req, res) => {
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
try {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
  });
} catch (err) {
  console.error("❌ Server crashed on startup:", err);
}